
export interface Message {
  content: string;
  role: string;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  chats: Message[];
  createdAt: string;
}

export interface AIScenario {
  _id: string;
  name: string;
  description: string;
  imageUrl?: File;
  roles: { role1: string; role2: string };
  difficulty: 1 | 2 | 3; // 1: 쉬움, 2: 중간, 3: 어려움
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
 