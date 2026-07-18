import { SendEmailNotification, SendNotificationStrategy, SendPushNotification, SendSMSNotification, SendWhatsAppNotification } from "../../resources/notifications";

export class SendNotificationFactory {
    static create(channel: string): SendNotificationStrategy {
        switch (channel) {
            case 'whatsapp':
                return new SendWhatsAppNotification();
            case 'email':
                return new SendEmailNotification();
            case 'sms':
                return new SendSMSNotification();
            case 'push':
                return new SendPushNotification();
            default:
                throw new Error(`Unsupported notification channel: ${channel}`);
        }
    }       
}