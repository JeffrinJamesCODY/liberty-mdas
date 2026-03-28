import React from 'react'
import { useMDASStore } from'../../stores/useMDASStore'
import styles from './StatusBar.module.css'

export default function StatusBar() {
    const { aircraftCount, satelliteCount, neoCount, militaryAircraft } = useMDASStore ()
    return (
        <div className={styles.bar}>
            <span className={styles.item}>
                <span className={styles.dot} style={{background: 'var(--accent-primary)'}} /> 
                CIVIL: <strong>{(aircraftCount - militaryAircraft.length).toLocalString()}</strong>
            </span>
            <span className= {styles.sep}>|</span>
            <span className={styles.item}>
                <span className={styles.dot} style={{background: 'var(--accent-danger)'}}/>
                Military: <strong>{militaryAircraft.length}</strong>
            </span>
            <span className={styles.sep}>|</span>
            <span className={styles.item}>
                <span className={styles.dot} style={{background: '#8855ff'}}/>
                SATELLITES: <strong>{satelliteCount.toLocaleString()}</strong>
            </span>
            <span className={styles.sep}>|</span>
            <span className={styles.items}>
                <span className={styles.dot} style={{background: 'var(--accent-warning)'}}/>
                NEO: <strong>{neoCount}</strong>
            </span>
            <div className={styles.right}>
                <span className={styles.version}>MDAS v0.1.0 - DEVELOPMENTAL MIDWAY BUILD</span>
            </div>
        </div>
    )
}