const { app, BrowserWindow, shell, ipcMain } = require('electron');
const contextMenu = require('electron-context-menu');
const path = require('path');

function run() {
    let url = process.argv[process.argv.length - 1];

    if (!url.match(/^https?:\/\//)) {
        console.log('RUNWEB MISSING URL');
        process.exit();
    }

    let hostname = new URL(url).hostname;
    console.log('RUNWEB HOSTNAME: ' + hostname);

    let win = new BrowserWindow({
        minWidth: 800,
        minHeight: 600,
        backgroundColor: '#fff',
        autoHideMenuBar: true,
        webPreferences: {
            partition: 'persist:' + hostname,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    console.log('RUNWEB LOAD: ' + url);
    win.loadURL(url);

    contextMenu({
        prepend: (defaultActions, params, browserWindow) => [
            {
                label: 'Reload',
                click: () => {
                    win.reload();
                }
            }
        ]
    });

    win.webContents.on('page-title-updated', function (event, title) {
        event.preventDefault();
        title = '[runweb@' + hostname + '] ' + title;
        console.log('RUNWEB TITLE: ' + title);
        win.setTitle(title);
    });

    win.webContents.on('new-window', function (event, url) {
        event.preventDefault();
        console.log('RUNWEB EXTERNAL: ' + url);
        shell.openExternal(url);
    });

    win.on('close', function () {
        win = null;
    });

    ipcMain.on('flashFrame', (event) => {
        console.log('RUNWEB NOTIFICATION');
        win.flashFrame(true);
    });
}

app.on('ready', run);
