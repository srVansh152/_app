import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.baseURL = 'https://dashstack-90hs.onrender.com';
  }

  connect() { 
    
    if (!this.socket) {
      this.socket = io(this.baseURL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      this.socket.on('connect', () => {
        console.log('Socket connected successfully');
        const userId = localStorage.getItem('userId');
        if (userId) {
          this.socket.emit('userConnected', userId);
        }
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinChat(chatId) {
    if (this.socket) {
      const userId = localStorage.getItem('userId');
      this.socket.emit('joinChat', { chatId, userId });
    }
  }

  sendMessage(messageData) {
    if (this.socket) {
      this.socket.emit('sendMessage', messageData);
    }
  }
}

export default new SocketService();