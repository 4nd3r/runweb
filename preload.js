const { ipcRenderer } = require('electron');

class runwebNotification extends Notification {
    constructor(title, options) {
        super(title, options);
        ipcRenderer.send('flashFrame');
    }
}

window.Notification = runwebNotification;
