import { Student, Bus } from '../types';
import { MOCK_STUDENTS, MOCK_BUSES } from '../constants';

const DB_KEYS = {
  STUDENTS: 'scholar_ai_students',
  BUSES: 'scholar_ai_buses',
};

class DatabaseService {
  private isInitialized = false;

  private init() {
    if (this.isInitialized) return;
    
    if (!localStorage.getItem(DB_KEYS.STUDENTS)) {
      localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify(MOCK_STUDENTS));
    }
    if (!localStorage.getItem(DB_KEYS.BUSES)) {
      localStorage.setItem(DB_KEYS.BUSES, JSON.stringify(MOCK_BUSES));
    }
    this.isInitialized = true;
  }

  async getAllStudents(): Promise<Student[]> {
    this.init();
    const data = localStorage.getItem(DB_KEYS.STUDENTS);
    return data ? JSON.parse(data) : [];
  }

  async getStudentById(id: string): Promise<Student | null> {
    const students = await this.getAllStudents();
    return students.find(s => s.id === id) || null;
  }

  async getAllBuses(): Promise<Bus[]> {
    this.init();
    const data = localStorage.getItem(DB_KEYS.BUSES);
    return data ? JSON.parse(data) : [];
  }

  async updateStudent(student: Student): Promise<void> {
    const students = await this.getAllStudents();
    const index = students.findIndex(s => s.id === student.id);
    if (index !== -1) {
      students[index] = student;
      localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify(students));
    }
  }
}

export const db = new DatabaseService();