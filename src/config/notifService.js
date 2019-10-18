import PushNotification from 'react-native-push-notification';

export default class NotifService {

  constructor() {
    this.configure();

    this.lastId = 0;
  }

configure(gcm = "708504411992") {
    PushNotification.configure({

      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notificayion) {
        console.log('Notification haha');
      }, //this._onNotification,

      // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
      senderID: gcm,

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
        * (optional) default: true
        * - Specified if permissions (ios) and token (android and ios) will requested or not,
        * - if not, you must call PushNotificationsHandler.requestPermissions() later
        */
      requestPermissions: true,
    });
  }
}