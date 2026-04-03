import { useMDASStore } from '../../store/useMDASStore'
import styles from './StatusBar.module.css'

export default function StatusBar() {
  const { aircraftCount, satelliteCount, neoCount, militaryAircraft } = useMDASStore()

// Safe fallbacks if any value is undefined, default to 0
  const totalAircraft = aircraftCount || 0
  const totalSatellites = satelliteCount || 0
  const totalNeo = neoCount || 0
  const totalMilitary = militaryAircraft?.length || 0
  const totalCivil = totalAircraft - totalMilitary

  return (
    <div className={styles.bar}>
      <span className={styles.item}>
        <span className={styles.dot} style={{ background: 'var(--accent-primary)' }} />
        CIVIL: <strong>{totalCivil.toLocaleString()}</strong>
      </span>
      <span className={styles.sep}>|</span>
      <span className={styles.item}>
        <span className={styles.dot} style={{ background: 'var(--accent-danger)' }} />
        MILITARY: <strong>{totalMilitary.toLocaleString()}</strong>
      </span>
      <span className={styles.sep}>|</span>
      <span className={styles.item}>
        <span className={styles.dot} style={{ background: '#8855ff' }} />
        SATELLITES: <strong>{totalSatellites.toLocaleString()}</strong>
      </span>
      <span className={styles.sep}>|</span>
      <span className={styles.item}>
        <span className={styles.dot} style={{ background: 'var(--accent-warning)' }} />
        NEO: <strong>{totalNeo}</strong>
      </span>
      <div className={styles.right}>
        <span className={styles.version}>LIBERTY-MDAS v0.1.0 — DEVELOPMENT BUILD</span>
      </div>
    </div>
  )
}