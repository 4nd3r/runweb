OriginalNotification = window.Notification

window.Notification = function( title, options )
{
    console.log( 'I\'d just like to interject for a moment.' )
    return new OriginalNotification( title, options )
}
