import { useEffect, useCallback } from 'react'
import { useMDASStore } from '../store/useMDASStore.js'

const NASA_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY'
const NEOWS_BASE = 'https://api.nasa.gov/neo/rest/v1'

export function useNEOFeed() {
  const { setNeoObjects, setFeedStatus } = useMDASStore()

  const fetchNEOs = useCallback(async () => {
    try {
      setFeedStatus('nasa', 'connecting')

      // Get today and 7 days ahead without date-fns
      const today = new Date()
      const nextWeek = new Date()
      nextWeek.setDate(today.getDate() + 7)

      const startDate = today.toISOString().slice(0, 10)
      const endDate = nextWeek.toISOString().slice(0, 10)

      const res = await fetch(
        `${NEOWS_BASE}/feed?start_date=${startDate}&end_date=${endDate}&api_key=${NASA_KEY}`
      )

      if (!res.ok) throw new Error(`NASA API ${res.status}`)

      const data = await res.json()

      // data.near_earth_objects is an object keyed by date
      // Object.values gives us an array of arrays, flatten it
      const neoArrays = Object.values(data.near_earth_objects || {})
      const neos = neoArrays
        .flat()
        .map(neo => ({
          id: neo.id,
          name: neo.name,
          isPotentiallyHazardous: neo.is_potentially_hazardous_asteroid,
          diameter: {
            min: neo.estimated_diameter?.kilometers?.estimated_diameter_min || 0,
            max: neo.estimated_diameter?.kilometers?.estimated_diameter_max || 0,
          },
          closeApproach: neo.close_approach_data?.[0] ? {
            date: neo.close_approach_data[0].close_approach_date,
            velocity: parseFloat(neo.close_approach_data[0].relative_velocity?.kilometers_per_second || 0),
            missDistanceLunar: parseFloat(neo.close_approach_data[0].miss_distance?.lunar || 0),
          } : null,
        }))
        .sort((a, b) => {
          const distA = a.closeApproach?.missDistanceLunar ?? Infinity
          const distB = b.closeApproach?.missDistanceLunar ?? Infinity
          return distA - distB
        })

      setNeoObjects(neos)
      setFeedStatus('nasa', 'live')

      const hazardous = neos.filter(n => n.isPotentiallyHazardous)
      console.log(`NASA NEO: ${neos.length} objects, ${hazardous.length} potentially hazardous`)

    } catch (err) {
      console.error('Liberty NASA NEO fetch error:', err)
      setFeedStatus('nasa', 'error')
    }
  }, [setNeoObjects, setFeedStatus])

  useEffect(() => {
    fetchNEOs()
    const interval = setInterval(fetchNEOs, 1000 * 60 * 60 * 6)
    return () => clearInterval(interval)
  }, [fetchNEOs])
}