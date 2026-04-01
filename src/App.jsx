import styles from './App.module.css'
import Globe from './components/Globe/Globe.jsx'
import HUD from './components/HUD/HUD.jsx'
import { useAircraftFeed } from './hooks/useAircraftFeed.js'
import { useNEOFeed } from './hooks/useNEOFeed.js'
import { useSatelliteFeed } from './hooks/useSatelliteFeed.js'

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