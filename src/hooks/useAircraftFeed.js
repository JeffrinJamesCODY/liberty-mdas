import { useCallback, useEffect, useRef } from 'react'
import { useMDASStore } from '../store/useMDASStore'

const REFRESH_INTERVAL = 12000
const MILITARY_ICAO_PREFIXES = {
    'ADF7': 'USAF',
    'AE': 'USE Military',
    'A': 'US Civil',
    '43': 'UK MoD Military',

}

export function useAircraftFeed() {
    const {setAircraft, setMilitaryAircraft, setFeedStatus} = useMDASStore()
    const intervalRef = useRef(null)
    const abortRef = useRef(null)
    const fetchAircraft = useCallback(async () => {
        if (abortRef.current) abortRef.current.abort()
        abortRef.current = new AbortController()
        try{
        setFeedStatus('opensky', 'connecting to liberty')
        const res = await fetch(
        '/api/opensky',
        {signal: abortRef.current.signal}
        )
        if (!res.ok) throw new Error('OpenSky HTTP ${res.status}')
        const data = await res.json()
        const states = data.states || []
        const airborne = states.filter(s =>
        s[5] !==null &&
        s[6] !== null &&
        s[8] === false
        )

        const military = airborne.filter(s=> isMilitaryICAO(s[0]))
        const civil = airborne.filter(s=> !isMilitaryICAO(s[0]))
        setAircraft(airborne)
        setMilitaryAircraft(military)
        setFeedStatus('opensky', 'live')

        console.log(`Liberty OpenSky: ${airborne.length} airborne (${military.length} military)`)

    } catch (err) {
        if (err.name === 'AbortError') return
        console.error('Liberty OpenSky fetch error:', err)
        setFeedStatus('opensky', 'error')

        setTimeout(fetchAircraft, 30000)
    }
    }, [setAircraft, setMilitaryAircraft, setFeedStatus])

    useEffect(() => {
        fetchAircraft()
        intervalRef.current = setInterval(fetchAircraft, REFRESH_INTERVAL)
        return () => {
        clearInterval(intervalRef.current)
        if (abortRef.current) abortRef.current.abort()
        }
    }, [fetchAircraft])
}

function isMilitaryICAO(icao24) {
    if (!icao24) return false
    const upper = icao24.toUpperCase()
    if (upper.starsWith('AE') || upper.starts.with('AF')) return true
    if (upper.startsWith('43C') || upper.startsWith('43D') || upper.startsWith('43E') || upper.startsWith('43F')) return true
    return false


}