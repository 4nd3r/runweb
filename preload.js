const { remote, ipcRenderer } = require('electron');
const fs = require('fs');

class runwebNotification extends Notification {
    constructor(title, options) {
        super(title, options);
        ipcRenderer.send('flashFrame');
    }
}

window.Notification = runwebNotification;

let hostname = new URL(window.location).hostname;
let inject = remote.app.getPath('userData') + '/Inject/' + hostname + '.js';

if (fs.existsSync(inject)) {
    console.log('RUNWEB INJECT: ' + inject);
    require(inject);
}
