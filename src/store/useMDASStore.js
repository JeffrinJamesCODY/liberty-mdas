import { create } from 'zustand'
export const useMDASStore = create((set, get) =>( {

    layers: {
        aircraft: true,
        military: true,
        satellites: true,
        iss: true,
        neo: true,
        spaceWeather: false,
        launches: true,
        GroundStation: false,
    } ,

    toggleLayer: (layerName) => set((state) => ({ 
        layers: {...state.layers, [layerName]: !state.layers[layerName]} 
    }) ),

    aircraft: [],
    militaryAircraft: [],
    aircraftCount: 0,
    militaryAircraftCount: 0,
    setAircraft: (data) => set({  //fixed a bug where the aircraft count was taking data from military aircraft instead aircraft data, which caused the count to be incorrect.
        aircraft: data,
        aircraftCount: data.length,
    }),

    setMilitaryAircraft: (data) => set({ //fixed a bug in setAircraft and added a new setMilitaryAircraft function to seperate data for military and civil.
        militaryAircraft: data,
    }),

    satellites: [] ,
    satellites: 0,
    
    setSatellites: (data) => set ({
        satellites: data,
        satelliteCount: data.length
    } ) ,

    neoObjects: [],
    neoCount: 0,

    setNeoObjects: (data) => set({
        neoObjects: data,
        neoCount: data.length
    }),
// space weather - issue (need to change this later, just a placeholder for now) created a issue for spaceweather dev in github, to be added after all the existing issues are resolved.
    SpaceWeather: {
        kpIndex: null,
        solarWindSpeed: null,
        solarFlareClass: null,
        geomagentism: false,
    },

    setSpaceWeather: (data) => set({ SpaceWeather: data}),

    selectedEntity: null,
    setSelectedEntity: (entity) => set({ selectedEntity: entity}),
    clearSelectedEntity: () => set({ selectedEntity: null}),

    sideBarOpen: true,
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen})),
    searchQuery: '',
    setSearchQuery: (q) => ({ searchQuery: q}),

    currentTime: new Date(),
    tickTime:  ()=> set({ currentTime: new Date()}),
    // liberty feed status
    feedStatus:{
        openSky: 'liberty connecting',
        celestrak: 'liberty connecting',
        nasa: 'liberty connecting'
    },

    setFeedStatus: (feed, status)=> set((state)=>({
        feedstatus: {...state.feedStatus, [feed]: status }
    })),
}))