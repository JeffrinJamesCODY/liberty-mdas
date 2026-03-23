import React, { useEffect } from 'react'
import { useMDASStore } from '../../stores/useMDASStore'
import TopBar from './TopBar'
import SidePanel from './SidePanel'
import LayerControls from './LayerControls'
import EntityDetail from './EntityDetail'
import StatusBar from './StatusBar'
import styles from './HUD.module.css'

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