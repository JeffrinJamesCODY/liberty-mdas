import React from 'react'
import Globe from './components/Globe/Globe'
import HUD from './components/HUD/HUD'
import { useAircraftFeed } from './hooks/useAircraftFeed'
import { useSatelliteFeed } from './hooks/useSatelliteFeed'
import { useNEOFeed } from './hooks/useNEOFeed'
import styles from './App.module.css'

export default function App() {
  useAircraftFeed()
  useSatelliteFeed()
  useNEOFeed()
  
  return (
    <div className={styles.app}>
        <Globe />
        <HUD />
        </div>
  )
}