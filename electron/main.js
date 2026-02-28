const { app, BrowserWindow, shell } = require ('electron')
const path = require ('path')

const isDev = ProcessingInstruction.env.NODE_ENV === 'development' || !app.isPackaged

function createWindow () {
    const win = new BrowserWindow ({
        wdith: 1600,
        height: 1000,

        titleBarStyle: 'hiddenInset',
        frame : false,
        transparent : false,
        backgroundColour: '#000408',

        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: true,

            allowRunningInsecureContent: false,

        },

        title: 'LIBERTY-MDAS - Multi-Domain Awareness Suite',
        show: false,
    })
    
    win.once('ready-to-show', () => {
        win.show()
        win.maximize()
    })
    if (isDev) {
        win.loadURL('http://localhost:3000')
        win.webContents.openDevTools({mode: 'detach'})

    } else {
        win.loadFile(path.join(__dirname, '../build/index.html'))
    }

    win.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url)
        return { action: 'deny' }
    })
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})