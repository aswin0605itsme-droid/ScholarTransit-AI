export interface AcademicDue {
  id: string;
  category: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface Student {
  id: string;
  name: string;
  attendance: number;
  marks: {
    math: number;
    science: number;
    history: number;
    english: number;
    cs: number;
  };
  riskLevel: 'Low' | 'Medium' | 'High';
  riskScore?: number;
  dues: AcademicDue[];
}

export interface Bus {
  id: string;
  route: string;
  capacity: number;
  currentOccupancy: number;
  status: 'On Time' | 'Delayed' | 'Stopped';
  nextStop: string;
  crowdLevel: 'Low' | 'Medium' | 'Heavy';
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  ACADEMIC = 'ACADEMIC',
  BUSES = 'BUSES',
  CHAT = 'CHAT',
  STUDENT_DETAIL = 'STUDENT_DETAIL',
  PROFILE = 'PROFILE'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}