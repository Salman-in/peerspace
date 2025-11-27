export interface Reply {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
}

export interface Post {
  _id?: string;
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  replies: Reply[];
}

export interface Conversation {
  _id?: string;
  id: string;
  userId: string;
  question: string;
  answer: string;
  timestamp: string;
}