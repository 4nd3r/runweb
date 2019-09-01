const { app, BrowserWindow, shell } = require( 'electron' )
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
        	preload: resolve( __dirname, 'notification.js' )
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
}

app.on( 'ready', run )
