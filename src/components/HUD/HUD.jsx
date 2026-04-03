import { useEffect } from 'react'
import { useMDASStore } from '../../store/useMDASStore.js'
import EntityDetail from './EntityDetail'
import styles from './HUD.module.css'
import LayerControls from './LayerControls'
import SidePanel from './SidePanel'
import StatusBar from './StatusBar'
import TopBar from './TopBar'

export default function HUD() {
    const { tickTime } = useMDASStore ()


    useEffect(() => {
        const timer = setInterval(tickTime, 1000)
        return ()=> clearInterval(timer)
    }, [tickTime])

    return (
        <div className={styles.hud}>
            <div className={styles.cornerTL} />
            <div className={styles.cornerTR} />
            <div className={styles.cornerBL} />
            <div className={styles.cornerBR} />
            <TopBar />
            <SidePanel />
            <LayerControls />
            <EntityDetail />
            <StatusBar />


        </div>
    )
}