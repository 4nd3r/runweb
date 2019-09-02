(() =>
{
    class CustomNotification extends window.Notification
    {
        constructor( title, options )
        {
            super( title, options )
            console.log( 'notification title: ' + title )
            console.log( 'notification options: ' + options )
        }
    }

    window.Notification = CustomNotification;

})( this )
