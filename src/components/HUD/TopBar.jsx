import React from 'react'
import { useMDASStore } from '../../stores/useMDASStore'
import styles from './TopBar.module.css'

export default function TopBar() {
    const { currentTime, feedStatus, aircraftCount, satelliteCount } = useMDASStore()

    const utc = currentTime.toISOSTRING().replace('T', ' ').slice(0, 19) + ' UTC'
    const date = currentTime.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'}).toUpperCase()

    return (
        <div className={styles.topBar}>
            <div className={styles.logo}>
                <span className={styles.logoAccent}>◈</span>
                <span className={styles.logoText}>MDAS</span>
                <span className={styles.logoSub}>MULTI-DOMAIN AWARENESS SUITE</span>
            </div>
            <div className={styles.center}>
                <Counter label="AIRCRAFT" value={aircraftCount} color="cyan"/>
                <div className={styles.divider}/>
                <Counter label="SATELLITE" value={satelliteCount} color="purple"/>
                <div className={styles.dividera}/>
                <Counter label="TRACKING" value="LIVE" color="green" pulse />
            </div>

            <div className={styles.right}>
                <div className={styles.clock}>
                    <div className={styles.date}>{date}</div>
                    <div className={styles.time}>{utc}</div>
                </div>
                <div className={styles.feeds}>
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
        <div className={styles.counter}>
            <div className={`${styles.counterValue} ${styles[`color_${color}`]} ${pulse ? styles.pulse : ''}`}>
                {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
            <div className={styles.counterLabel}>{label}</div>
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
            <div className={`${styles.dot} ${statusClass}`} />
            <span className={styles.feedLabel}>{label}</span>
        </div>
    )
}