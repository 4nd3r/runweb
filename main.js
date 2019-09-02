const { app, BrowserWindow, ipcMain, shell } = require( 'electron' )
const { resolve } = require( 'path' )

function run()
{
    let url = process.argv[ process.argv.length - 1 ]

    if ( ! url.match( /^https?:\/\// ) )
    {
        console.log( 'missing URL' )
        process.exit()
    }

    let win = new BrowserWindow({
        minWidth: 800,
        minHeight: 600,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            preload: resolve( __dirname, 'preload.js' )
        }
    })

    console.log( 'load URL: ' + url )
    win.loadURL( url )

    win.webContents.on( 'new-window', function( event, url )
    {
        console.log( 'open external URL: ' + url )
        event.preventDefault()
        shell.openExternal( url )
    })

    win.on( 'close', function() {
        win = null
    })

    ipcMain.on( 'notification', (event, arg) => {
        console.log( arg )
    })
}

app.on( 'ready', run )
