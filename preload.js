const { ipcRenderer } = require( 'electron' );

(() =>
{
    class CustomNotification extends window.Notification
    {
        constructor( title, options )
        {
            super( title, options );
            console.log( 'Notification!' );
            ipcRenderer.send( 'notification', 'Beep!' );
        }
    }

    window.Notification = CustomNotification;

})( this );
