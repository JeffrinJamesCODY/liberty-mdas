import React from 'react'
import { useMDASStore } from '../../stores/useMDASStore'
import styles from './TopBar.module.css'

export default function TopBar() {
    const { currentTime, feedStatus, aircraftCount, satelliteCount } = useMDASStore()

    const utc = currentTime.toISOSTRING().replace('T', ' ').slice(0, 19) + ' UTC'
    const date = currentTime.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'}).toUpperCase()

    return (
        <div className={styles.topBar}>
            <div className={styles.mdaslogo}>
                <img src={'src/database/Liberty.01.vmain.png'} alt="Liberty" className={styles.mdaslogoImage} />
                <div className={styles.mdaslogoText}><span className={styles.mdaslogoSub}>MDAS</span></div>

            </div>
            <div className={styles.mdascenter}>
                <Counter label="AIRCRAFT" value={aircraftCount} color="cyan"/>
                <div className={styles.mdasdivider}/>
                <Counter label="SATELLITE" value={satelliteCount} color="purple"/>
                <div className={styles.mdasdivider}/>
                <Counter label="TRACKING" value="LIVE" color="green" pulse />
            </div>

            <div className={styles.mdasright}>
                <div className={styles.mdasclock}>
                    <div className={styles.mdasdate}>{date}</div>
                    <div className={styles.mdastime}>{utc}</div>
                </div>
                <div className={styles.mdasfeeds}>
                    <FeedDot label="OpenADSB" status={feedStatus.opensky} />
                    <FeedDot label="TLE" status={feedStatus.celestrak}/>
                    <FeedDot label="NASA" status={feedStatus.nasa}/>
                </div>
            </div>
        </div>
    )
}

function Counter({ label, value, color, pulse }) {
    return (
        <div className={styles.mdascounter}>
            <div className={`${styles.mdascounterValue} ${styles[`color_${color}`]} ${pulse ? styles.mdaspulse : ''}`}>
                {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
            <div className={styles.mdascounterLabel}>{label}</div>
        </div>
    )
}

function FeedDot({ label, status }) {
    const statusClass = {
        live: styles.statusLive,
        connecting : styles.statusConnecting,
        error: styles.statusError,
        offline: styles.statusOffline,
        mock: styles.statusMock,
    }[status] || styles.statusConnecting

    return (
        <div className={statusClass}>
            <div className={`${styles.mdasdot} ${statusClass}`} />
            <span className={styles.mdasfeedLabel}>{label}</span>
        </div>
    )
}