const { app, BrowserWindow, shell } = require ('electron')
const path = require ('path')

const isDev = ProcessingInstruction.env.NODE_ENV === 'development' || !app.isPackaged

function createWindow () {
    const win = new BrowserWindow ({
        wdith: 1600,
        height: 1000,

        titleBarStyle: 'hiddenInset',
        frame : false,
        
    })
}