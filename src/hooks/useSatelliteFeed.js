import { useEffect, useRef, useCallback } from 'react'
import * as satellite from 'satellite.js'
import * as Cesium from 'cesium'
import { useMDASStore } from '../store/useMDASStore.js'

export function useSatelliteFeed() {
  const { setSatellites, setFeedStatus } = useMDASStore()
  const tleDataRef = useRef([])
  const animFrameRef = useRef(null)

//Fetch tles from Celestrak
  const fetchTLEs = useCallback(async () => {
    try {
      setFeedStatus('celestrak', 'connecting')

// direct fetch from Celestrak, works from backend amd may have CORS in browser
// If CORS blocks it, we fall back to mock data automatically
      const res = await fetch(
        'https://celestrak.org/SOCRATES/query.php?FORMAT=3LE&GROUP=active',
        { mode: 'cors' }
      )

      if (!res.ok) throw new Error('Celestrak fetch failed')

      const text = await res.text()
      const tles = parseTLEText(text)

      if (tles.length === 0) throw new Error('No TLEs parsed')

      tleDataRef.current = tles
      setFeedStatus('celestrak', 'live')
      console.log(`Celestrak: loaded ${tles.length} satellite TLEs`)

    } catch (err) {
      console.warn('Celestrak unavailable, using mock TLE data:', err.message)
      tleDataRef.current = getMockTLEs()
      setFeedStatus('celestrak', 'mock')
    }
  }, [setFeedStatus])

//propagate Positions Every Frame
  const propagate = useCallback(() => {
    if (tleDataRef.current.length === 0) {
      animFrameRef.current = requestAnimationFrame(propagate)
      return
    }

    const now = new Date()
    const gmst = satellite.gstime(now)

    const positions = tleDataRef.current
      .slice(0, 500)
      .map(tle => {
        try {
          const posVel = satellite.propagate(tle.satrec, now)
          if (!posVel.position) return null

          const geodetic = satellite.eciToGeodetic(posVel.position, gmst)
          const lat = Cesium.Math.toDegrees(geodetic.latitude)
          const lon = Cesium.Math.toDegrees(geodetic.longitude)
          const alt = geodetic.height * 1000

          return {
            id: tle.id,
            name: tle.name,
            position: Cesium.Cartesian3.fromDegrees(lon, lat, alt),
            altitude: Math.round(geodetic.height),
            velocity: posVel.velocity
              ? Math.round(Math.sqrt(
                  posVel.velocity.x ** 2 +
                  posVel.velocity.y ** 2 +
                  posVel.velocity.z ** 2
                ))
              : null,
          }
        } catch {
          return null
        }
      })
      .filter(Boolean)

    setSatellites(positions)
    animFrameRef.current = requestAnimationFrame(propagate)
  }, [setSatellites])

  useEffect(() => {
    fetchTLEs()
    const tleInterval = setInterval(fetchTLEs, 3600000)
    animFrameRef.current = requestAnimationFrame(propagate)

    return () => {
      clearInterval(tleInterval)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [fetchTLEs, propagate])
}
//Parse 3 line TLE format
function parseTLEText(text) {
  const lines = text.trim().split('\n').map(l => l.trim()).filter(Boolean)
  const tles = []

  for (let i = 0; i < lines.length - 2; i += 3) {
    const name = lines[i]
    const line1 = lines[i + 1]
    const line2 = lines[i + 2]

    if (!line1.startsWith('1 ') || !line2.startsWith('2 ')) continue

    try {
      const satrec = satellite.twoline2satrec(line1, line2)
      tles.push({
        id: line1.substring(2, 7).trim(),
        name: name.replace(/^0 /, ''),
        satrec,
      })
    } catch {}
  }

  return tles
}

//Mock TLEs for when Celestrak is unavailable
function getMockTLEs() {
  const raw = `ISS (ZARYA)
1 25544U 98067A   24001.50000000  .00016717  00000-0  10270-3 0  9994
2 25544  51.6400 208.9163 0006317  86.9310 273.2520 15.50038322 26663
HUBBLE SPACE TELESCOPE
1 20580U 90037B   24001.50000000  .00000882  00000-0  39025-4 0  9991
2 20580  28.4694  97.3847 0002758 314.5276  45.5398 15.09259834 99999
STARLINK-1007
1 44713U 19074A   24001.50000000  .00001234  00000-0  10270-3 0  9991
2 44713  53.0000 100.0000 0001000  50.0000 310.0000 15.06000000 99991
NOAA 19
1 33591U 09005A   24001.50000000  .00000082  00000-0  68985-4 0  9990
2 33591  99.1512  42.1428 0013816 212.2712 147.7292 14.12295487770313
TERRA
1 25994U 99068A   24001.50000000  .00000026  00000-0  27694-4 0  9992
2 25994  98.2121 359.3496 0001306  88.2746 271.8596 14.57114781271654`

  return parseTLEText(raw)
}