import * as Cesium from 'cesium'
import { useEffect, useRef } from 'react'
import { useMDASStore } from '../../store/useMDASStore.js'
import styles from './Globe.module.css'

// Cesium Ion Access Token (need to change later ** )
const CESIUM_TOKEN = import.meta.env.VITE_CESIUM_ION_TOKEN || ''
const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

export default function Globe() {
    const cesiumContainerRef = useRef(null)
    const viewerRef = useRef(null)
    const { aircraft, satellites, layers, setSelectedEntity } = useMDASStore()

useEffect(() => { //Small timeout ensures the DOM element is fully mounted
  const timer = setTimeout(() => {
    if (!cesiumContainerRef.current || viewerRef.current) return

    try {
      Cesium.Ion.defaultAccessToken = CESIUM_TOKEN

      const viewer = new Cesium.Viewer(cesiumContainerRef.current, {
        animation: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        navigationHelpButton: false,
        navigationInstructionsInitiallyVisible: false,
        creditContainer: document.createElement('div'),
        requestRenderMode: false,
        maximumRenderTimeChange: Infinity,
      })

      viewerRef.current = viewer
      const scene = viewer.scene
      const globe = scene.globe

      scene.skyAtmosphere = new Cesium.SkyAtmosphere()
      scene.sun = new Cesium.Sun()
      scene.moon = new Cesium.Moon()
      globe.enableLighting = true
      globe.showGroundAtmosphere = true
      globe.nightFadeOutDistance = 50000000
      globe.nightFadeInDistance = 10000000

      const loadImagery = async () => {
        if (GOOGLE_MAPS_KEY) {
          try {
            const googleTileset = await Cesium.Cesium3DTileset.fromUrl(
              `https://tile.googleapis.com/v1/3dtiles/root.json?key=${GOOGLE_MAPS_KEY}`
            )
            scene.primitives.add(googleTileset)
            globe.show = false
          } catch (error) {
            console.warn('Failed to load Google tiles:', error)
            const provider = await Cesium.IonImageryProvider.fromAssetId(2)
            viewer.imageryLayers.addImageryProvider(provider)
          }
        } else {
          const provider = await Cesium.IonImageryProvider.fromAssetId(2)
          viewer.imageryLayers.addImageryProvider(provider)
          console.log('Using Cesium')
        }
      }

      loadImagery()

      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(0, 20, 20000000),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-90),
          roll: 0,
        },
      })

      const clickHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
      clickHandler.setInputAction((click) => {
        const picked = scene.pick(click.position)
        if (Cesium.defined(picked) && Cesium.defined(picked.id)) {
          setSelectedEntity(picked.id)
        } else {
          setSelectedEntity(null)
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    } catch (err) {
      console.error('Cesium init error:', err)
    }
  }, 100) // 100ms delay — ensures DOM is ready

  return () => {
    clearTimeout(timer)
    if (viewerRef.current && !viewerRef.current.isDestroyed()) {
      viewerRef.current.destroy()
      viewerRef.current = null
    }
  }
}, [])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return

    const toRemove = viewer.entities.values.filter(
      (e) => e.properties && e.properties.type && e.properties.type.getValue() === 'aircraft'
    )
    toRemove.forEach((e) => viewer.entities.remove(e))

    if (!layers.aircraft) return

    aircraft.slice(0, 500).forEach((ac) => {
      const icao24 = ac[0]
      const callsign = ac[1]
      const lon = ac[5]
      const lat = ac[6]
      const baroAlt = ac[7]
      const velocity = ac[9]
      const heading = ac[10]

      if (!lat || !lon) return

      const altitude = baroAlt || 0
      const isMilitary = detectMilitary(callsign, icao24)
      const color = isMilitary ? '#ff3355' : '#00d4ff'

      viewer.entities.add({
        id: `aircraft-${icao24}`,
        position: Cesium.Cartesian3.fromDegrees(lon, lat, altitude),
        billboard: {
          image: createAircraftIcon(color),
          rotation: Cesium.Math.toRadians(-(heading || 0)),
          alignedAxis: Cesium.Cartesian3.UNIT_Z,
          width: isMilitary ? 24 : 16,
          height: isMilitary ? 24 : 16,
          scaleByDistance: new Cesium.NearFarScalar(1e4, 1.5, 2e7, 0.3),
          translucencyByDistance: new Cesium.NearFarScalar(1e6, 1.0, 2e7, 0.5),
        },
        properties: {
          type: 'aircraft',
          icao24: icao24,
          callsign: callsign ? callsign.trim() : 'UNKNOWN',
          altitude: Math.round(altitude),
          velocity: Math.round(velocity || 0),
          heading: Math.round(heading || 0),
          isMilitary: isMilitary,
        },
      })
    })
  }, [aircraft, layers.aircraft])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return

    const toRemove = viewer.entities.values.filter(
      (e) => e.properties && e.properties.type && e.properties.type.getValue() === 'satellite'
    )
    toRemove.forEach((e) => viewer.entities.remove(e))

    if (!layers.satellites) return

    satellites.forEach((sat) => {
      if (!sat.position) return

      const isISS = sat.name && sat.name.includes('ISS')

      viewer.entities.add({
        id: `satellite-${sat.id}`,
        position: sat.position,
        point: {
          pixelSize: isISS ? 8 : 4,
          color: isISS
            ? Cesium.Color.fromCssColorString('#00ddff')
            : Cesium.Color.fromCssColorString('#8855ff').withAlpha(0.8),
          outlineColor: isISS
            ? Cesium.Color.fromCssColorString('#4c00ff').withAlpha(0.3)
            : Cesium.Color.fromCssColorString('#8855ff').withAlpha(0.2),
          outlineWidth: isISS ? 4 : 2,
          scaleByDistance: new Cesium.NearFarScalar(1e5, 2, 4e7, 0.5),
        },
        properties: {
          type: 'satellite',
          name: sat.name,
          id: sat.id,
          altitude: sat.altitude,
          velocity: sat.velocity,
        },
      })
    })
  }, [satellites, layers.satellites])

  return (
    <div className={styles.globeContainer}>
      <div ref={cesiumContainerRef} className={styles.cesiumContainer} />
    </div>
  )

  
function detectMilitary(callsign, icao24) {
  if (!callsign) return false
  const call = callsign.trim().toUpperCase()
  const patterns = [
    /^RCH/,
    /^MCE/,
    /^SAM/,
    /^VENUS/,
    /^CHAOS/,
    /^SPAR/,
    /^GAF/,
    /^RRR/,
    /^DUKE/,
    /^STEEL/,
    /^BARON/,
  ]
  return patterns.some((p) => p.test(call))
}

function createAircraftIcon(color) {
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 32
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = color
  ctx.shadowColor = color
  ctx.shadowBlur = 6

  ctx.beginPath()
  ctx.moveTo(16, 2)
  ctx.lineTo(22, 20)
  ctx.lineTo(16, 16)
  ctx.lineTo(10, 20)
  ctx.closePath()
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(16, 16)
  ctx.lineTo(19, 28)
  ctx.lineTo(16, 24)
  ctx.lineTo(13, 28)
  ctx.closePath()
  ctx.fill()

  return canvas.toDataURL()
}
}
