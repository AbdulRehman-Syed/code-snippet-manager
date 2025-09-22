import type { Notification as NotificationType } from '../types';
import { formatDate } from '../utils/helpers';

interface NotificationProps {
  notification: NotificationType;
  onRemove: (id: string) => void;
}

export function Notification({ notification, onRemove }: NotificationProps) {
  const { id, message, type, timestamp } = notification;
  
  setTimeout(() => {
    onRemove(id);
  }, 3000);

  return `
    <div class="notification ${type}" data-id="${id}">
      <div class="notification-content">
        <p>${message}</p>
        <small>${formatDate(timestamp)}</small>
      </div>
      <button class="notification-close" data-id="${id}">&times;</button>
    </div>
  `;
}