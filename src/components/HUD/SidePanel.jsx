import React from 'react'
import { useMDASStore } from '../../stores/useMDASStore'
import styles from './SidePanel.module.css'

export default function SidePanel() {
    const{ neoObjects, militaryAircraft, feedStatus} = useMDASStore()

    const hazardous = neoObjects.filter(n => n.isPotentiallyHazardous)
    const closest = neoObjects.slice(0,5)

    return (
        <div className={styles.panel}>
// Military contacts across Liberty tracking
            <Section title="LIBERTY MILITARY CONTACTS" accent="red">
                {militaryAircraft.length === 0 ? (
                    <div className={styles.empty}>No military contacts detected - Liberty Defense</div>
                )   :  (
                    militaryAircraft.slice(0,8).map(ac=> (
                        <MilRow key={ac[0]} ac={ac} />
                    ))
                )}
            </Section>
// feed for Near earth objects (NEOs)
            <Section title="NEAR EARTH OBJECTS" accent="amber"> 
                {hazardous.length > 0 && (
                    <div className={styles.hazardAlert}>
                        {hazardous.length} WARNING: POTENTIALLY HAZARDOUS
                    </div>

                )}
                {closest.length === 0 ? (
                    <div className={styles.empty}> Liberty loading NEO data....</div>
                )   :  (
                    closest.map(neo=> (
                        <NEORow key={neo.id} neo={neo} />
                    ))
                )}
            </Section>
// Liberty Data (Health)
            <Section title="LIBERTY DATA FEEDS" accent="cyan">
                <FeedRow label="OpenSky ADS-B" status={feedStatus.opensky} detail="Civil + Military"/>
                <FeedRow label="Celestrak TLE" status={feedStatus.celestrak} detail="Satellite Orbits" />
                <FeedRow label="NASA NeoWs" status={feedStatus.nasa} detail="Asteroid data"/>
            </Section>

        </div>
    )
}

function Section({ title, accent, children}) {
    return (
        <div className={styles.section}>
            <div className={`${styles.sectionHeader} ${styles[`accent_${accent}`]}`}>
                <span className={styles.sectionDash}>-</span>
                {title}
                </div>
                <div className={styles.sectionBody}>{children}</div>
        </div>
    )
}

function MilRow({ ac}) {
    const [icao24, callsign, country, , , lon, lat, alt, , velocity, heading] = ac
    return (
        <div className={styles.milRow}>
            <span className={styles.milCall}>{callsign?.trim() || icao24}</span>
            <span className={styles.milAlt}> {alt ? `${Math.round(alt / 100) * 100} ft` : '---'}</span>
    
        </div>
    )
}

function NEORow({neo}) {
    const dist = neo.closeApproach?.missDistanceLunar
    const hazard = neo.isPotentiallyHazardous
    return (
        <div className={`${styles.neoRow} ${hazard ? styles.neoHazard : ''}`}>
            <div className={styles.neoName}>{neo.name.replace(/[()]/g, '').trim()}</div>
            <div className={styles.neoData}> 
                {dist ? `${dist.toFixed(1)} LD` : '---'}
                {hazard && <span className={styles.hazardBadge}>PHO</span>}
            </div>
        </div>
    )
}

function FeedRow({ label, status, detail}) {
    const statusLabel = {
        live: 'LIVE', connecting: 'LIBERTY CONN...', error: 'ERROR', offline: 'LIBERTY OFFLINE',
        mock: 'MOCK'
    } [status] || '---'

    const statusClass = {
        live: styles.statusLive, connecting: styles.statusConnecting,
        error: styles.statusError, offline: styles.statusOffline, mock: styles.statusMock,
    }[status] || ''

    return (
        <div className={styles.feedRow}>
            <div>
                <div className={styles.feedName}>{label}</div>
                <div className={styles.feedDetail}>{detail}</div>
            </div>
            <span className={`${styles.feedStatus} ${statusClass}`}></span>
        </div>
    )
}