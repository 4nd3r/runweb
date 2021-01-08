const { app, BrowserWindow, shell, ipcMain } = require('electron');
const contextMenu = require('electron-context-menu');
const path = require('path');

console.log(app.name + ': ' + app.getVersion());
console.log('electron: ' + process.versions.electron);
console.log('data: ' + app.getPath('userData'));

app.on('ready', () => {
    let url = process.argv[process.argv.length - 1];

    if (!url.match(/^https?:\/\//)) {
        console.log('usage: runweb <url>');
        process.exit();
    }

    let hostname = new URL(url).hostname;
    console.log('RUNWEB HOSTNAME: ' + hostname);

    let sc = false;

    if ('RUNWEB_SC' in process.env) {
        sc = true;
    }

    console.log('RUNWEB SPELLCHECK: ' + sc);

    let win = new BrowserWindow({
        icon: path.join(__dirname, 'icon.png'),
        minWidth: 800,
        minHeight: 600,
        backgroundColor: '#fff',
        autoHideMenuBar: true,
        webPreferences: {
            partition: 'persist:' + hostname,
            preload: path.join(__dirname, 'preload.js'),
            spellcheck: sc
        }
    });

    let ua = win.webContents.userAgent.replace(/Electron\/[0-9\.]+\s/, '');

    if ('RUNWEB_UA' in process.env) {
        ua = process.env.RUNWEB_UA;
    }

    console.log('RUNWEB UA: ' + ua);
    win.webContents.userAgent = ua;

    console.log('RUNWEB LOAD: ' + url);
    win.loadURL(url);

    win.webContents.on('page-title-updated', (event, title) => {
        event.preventDefault();
        title = '[runweb@' + hostname + '] ' + title;
        console.log('RUNWEB TITLE: ' + title);
        win.setTitle(title);
    });

    win.webContents.on('new-window', (event, url) => {
        event.preventDefault();
        console.log('RUNWEB EXTERNAL: ' + url);
        shell.openExternal(url);
    });

    win.on('close', () => {
        win = null;
    });

    ipcMain.on('flashFrame', () => {
        console.log('RUNWEB NOTIFICATION');
        win.flashFrame(true);
    });

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
});
