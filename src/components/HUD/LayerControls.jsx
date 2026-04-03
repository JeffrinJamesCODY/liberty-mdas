import { useMDASStore } from '../../store/useMDASStore.js'
import styles from './LayerControls.module.css'

const LAYERS = [
    { id: 'aircraft', label: 'CIVIL AIRCRAFT', color: 'cyan' },
    { id: 'military', label: 'MILITARY', color: 'red' },
    { id: 'satellites', label: 'SATELLITES', color: 'purple' },
    { id: 'neo', label: 'NEAR-EARTH OBJECT', color: 'amber' },
    { id: 'iss', label: 'INTERNATIONAL SPACE STATION', color: 'green' },
    { id: 'spaceWeather', label: 'SPACE WEATHER', color: 'amber' },
    { id: 'launches', label: 'LAUNCHES', color: 'cyan' },
    { id: 'groundStations', label: 'GROUND STATIONS', color: 'green' },
]

export default function LayerControls() {
    const { layers, toggleLayer } = useMDASStore()

    return (
        <div className={styles.panel}>
            <div className={styles.header}>
                <span>LAYERS</span>
            </div>
            <div className={styles.list}>
                {LAYERS.map(layer => (
                    <button
                    key={layer.id}
                    className={`${styles.layerBtn} ${layers[layer.id] ? styles.active : styles.inactive} ${styles[`color_${layer.color}`]}`}
                    onClick={() => toggleLayer(layer.id)}
                    >
                        <span className={styles.icon}>{layer.icon}</span>
                        <span className={styles.label}>{layer.label}</span>
                        <span className={styles.toggle}>{layers[layer.id] ? 'ON' : 'OFF'}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}
