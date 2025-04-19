import * as Notifications from 'expo-notifications';

class NotificationService {
  async requestPermissions() {
    await Notifications.requestPermissionsAsync();
  }

  async showLocalNotification(title: string, body: string) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: null, // Inmediata
    });
  }
}

export default new NotificationService();
