export interface Message {
  content: string;
  role: string;
  createdAt: string; 
} 
export interface Conversation {
  _id: string;
  chats: Message[];
  title: string;
  createdAt: string;
}

export interface User {
  name: string;
}

export interface AuthResponse {
  valid: boolean;
  user?: User;
}

export interface ChatboxCoordinates {
  cbox_x: number;
  cbox_y: number;
  cbox_w: number;
  cbox_h: number;
}
