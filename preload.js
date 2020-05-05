class runwebNotification extends Notification
{
    constructor( title, options )
    {
        super( title, options )
        console.log( 'I\'d just like to interject for a moment.' )
    }
}

window.Notification = runwebNotification
