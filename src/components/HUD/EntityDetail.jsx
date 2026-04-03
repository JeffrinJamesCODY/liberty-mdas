import { useMDASStore } from '../../store/useMDASStore.js'
import styles from './EntityDetail.module.css'

export default function EntityDetail() {
    const { selectedEntity , clearSelectedEntity } = useMDASStore()

    if (!selectedEntity) return null

    const props = selectedEntity.properties
    const type = props?.type?.getValue()

    return (
        <div className={styles.panel}>
            <div className= {styles.header}>
                <span className={styles.entityType}>{type?.toUpperCase() || 'ENTITY'}</span>
                <button className={styles.closeButton} onClick={clearSelectedEntity}>X</button>
            </div>
            
            <div className={styles.body}>
                {type === 'aircraft' && <AircraftDetails props={props} />}
                {type === 'satellites' && <SatelliteDetails props={props} />}
            </div>
        </div>

    )
}

function AircraftDetails({ props }) {
    const callsign = props.callsign?.getValue()
    const altitude = props.altitude?.getValue()
    const icao24 = props.icao24?.getValue()
    const velocity = props.velocity?.getValue()
    const heading = props.heading?.getValue()
    const isMilitary = props.isMilitary?.getValue()

    return (
        <><div className={`${styles.callsign} ${isMilitary ? styles.military : ' '}`}>
            {callsign || 'UNKNOWN'}
            {isMilitary && <span className={styles.milBadge}>MIL</span>}
        </div>
        <DataRow label="ICAO24" value={icao24?.toUpperCase()} />
        <DataRow label="Altitude" value={altitude ? `${altitude.toLocaleString()} m` : '---'} />
        <DataRow label="Velocity" value={velocity ? `${velocity} m/s` : '---'} />
        <DataRow label="HEADING" value={heading !== undefined ? `${heading}°` : '---'} />
        <DataRow label="TYPE" value={isMilitary ? 'Military / Special' : 'Civil'} />
        <div className={styles.source}>Source: OpenSky Network ADS-B</div>
        </>
    )
}

function SatelliteDetails({ props }) {
    const name = props.name?.getValue()
    const id = props.id?.getValue()
    const altitude = props.altitude?.getValue()
    const velocity = props.velocity?.getValue()
    
    return(
        <>
        <div className={styles.callsign}>{name || 'UNKNOWN'}</div>
        <DataRow label="NORAD ID" value={id} />
        <DataRow label="Altitude" value={altitude ? `${altitude} km` : '---'} />
        <DataRow label="Velocity" value={velocity ? `${velocity} km/s` : '---'} />
        <div className={styles.source}>Source: Celestrak TLE / SGP4</div>
        </>
    )

}

function DataRow({label, value }) {
    return (
        <div className={styles.dataRow}>
            <span className={styles.dataLabel}>
                {label}</span>
                <span className={styles.dataValue}>
                    {value || '---'}
                </span>
        </div>
    )
}
