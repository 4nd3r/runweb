const { app, BrowserWindow, shell } = require( 'electron' )
const contextMenu = require( 'electron-context-menu' )
const path = require( 'path' )

function run()
{
    let url = process.argv[ process.argv.length - 1 ]

    if ( ! url.match( /^https?:\/\// ) )
    {
        console.log( 'RUNWEB MISSING URL' )
        process.exit()
    }

    let hostname = ( new URL( url ) ).hostname
    console.log( 'RUNWEB HOSTNAME: ' + hostname )

    let win = new BrowserWindow({
        minWidth: 800,
        minHeight: 600,
        backgroundColor: '#fff',
        autoHideMenuBar: true,
        webPreferences: {
            partition: 'persist:' + hostname,
            preload: path.join( __dirname, 'preload.js' )
        }
    })

    console.log( 'RUNWEB LOAD: ' + url )
    win.loadURL( url )
    contextMenu()

    win.webContents.on( 'page-title-updated', function( event, title )
    {
        event.preventDefault()
        title = '[ runweb @ ' + hostname + ' ] ' + title
        console.log( 'RUNWEB TITLE: ' + title )
        win.setTitle( title )
    })

    win.webContents.on( 'new-window', function( event, url )
    {
        console.log( 'RUNWEB EXTERNAL: ' + url )
        event.preventDefault()
        shell.openExternal( url )
    })

    win.webContents.on( 'console-message', function( event, level, message )
    {
        if ( message == 'I\'d just like to interject for a moment.' )
        {
            console.log( 'RUNWEB NOTIFICATION' )
            win.flashFrame( true )
        }
    })

    win.on( 'close', function() {
        win = null
    })
}

app.on( 'ready', run )
