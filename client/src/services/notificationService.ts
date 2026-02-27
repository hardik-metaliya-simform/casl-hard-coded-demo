type NotificationType = "success" | "error" | "info" | "warning";

class NotificationService {
  private static instance: NotificationService;
  private listeners: Array<(message: string, type: NotificationType) => void> =
    [];

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  subscribe(
    listener: (message: string, type: NotificationType) => void,
  ): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify(message: string, type: NotificationType = "info"): void {
    this.listeners.forEach((listener) => listener(message, type));
  }

  success(message: string): void {
    this.notify(message, "success");
  }

  error(message: string): void {
    this.notify(message, "error");
  }

  info(message: string): void {
    this.notify(message, "info");
  }

  warning(message: string): void {
    this.notify(message, "warning");
  }
}

export const notificationService = NotificationService.getInstance();
