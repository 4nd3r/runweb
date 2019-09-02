(() => {
	class CustomNotification extends window.Notification {
		constructor(params) {
			super(params);

			console.log(...params);
		}
	}

	window.Notification = CustomNotification;
})(this);

