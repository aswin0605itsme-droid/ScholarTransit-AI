
import { Student, Bus, AcademicDue, PerformanceHistory } from './types';
import { calculateStudentRisk, calculateBusCrowdLevel } from './utils/calculations';

const SAMPLE_DUES: AcademicDue[] = [
  { id: 'D1', category: 'Tuition Fee', amount: 1500, dueDate: '2025-05-15', status: 'Pending' },
  { id: 'D2', category: 'Library Fine', amount: 25, dueDate: '2025-04-10', status: 'Overdue' },
  { id: 'D3', category: 'Lab Charges', amount: 200, dueDate: '2025-06-01', status: 'Paid' },
];

const MOCK_HISTORY: PerformanceHistory[] = [
  { term: 'Sem 1', gpa: 3.1 },
  { term: 'Sem 2', gpa: 3.4 },
  { term: 'Sem 3', gpa: 3.2 },
  { term: 'Current', gpa: 3.8 },
];

const RAW_STUDENTS_DATA = [
  {
    id: 'S001',
    name: 'Alex Johnson',
    attendance: 92,
    marks: { math: 85, science: 78, history: 88, english: 90, cs: 95 },
    dues: SAMPLE_DUES,
    performanceHistory: MOCK_HISTORY,
  },
  {
    id: 'S002',
    name: 'Maria Garcia',
    attendance: 75,
    marks: { math: 62, science: 58, history: 70, english: 80, cs: 65 },
    dues: [SAMPLE_DUES[0], SAMPLE_DUES[2]],
    performanceHistory: [
      { term: 'Sem 1', gpa: 2.8 },
      { term: 'Sem 2', gpa: 2.9 },
      { term: 'Sem 3', gpa: 3.1 },
      { term: 'Current', gpa: 3.0 },
    ],
  },
  {
    id: 'S003',
    name: 'Liam Chen',
    attendance: 45,
    marks: { math: 35, science: 40, history: 55, english: 60, cs: 42 },
    dues: SAMPLE_DUES,
    performanceHistory: [
      { term: 'Sem 1', gpa: 2.5 },
      { term: 'Sem 2', gpa: 2.1 },
      { term: 'Sem 3', gpa: 2.0 },
      { term: 'Current', gpa: 1.8 },
    ],
  },
  {
    id: 'S004',
    name: 'Sarah Smith',
    attendance: 98,
    marks: { math: 95, science: 98, history: 92, english: 96, cs: 99 },
    dues: [SAMPLE_DUES[2]],
    performanceHistory: [
      { term: 'Sem 1', gpa: 3.9 },
      { term: 'Sem 2', gpa: 4.0 },
      { term: 'Sem 3', gpa: 4.0 },
      { term: 'Current', gpa: 4.0 },
    ],
  },
  {
    id: 'S005',
    name: 'James Wilson',
    attendance: 60,
    marks: { math: 45, science: 50, history: 65, english: 55, cs: 48 },
    dues: SAMPLE_DUES,
    performanceHistory: [
      { term: 'Sem 1', gpa: 2.9 },
      { term: 'Sem 2', gpa: 2.5 },
      { term: 'Sem 3', gpa: 2.6 },
      { term: 'Current', gpa: 2.4 },
    ],
  },
];

export const MOCK_STUDENTS: Student[] = RAW_STUDENTS_DATA.map(data => {
  const { level, score } = calculateStudentRisk(data.marks, data.attendance);
  return {
    ...data,
    riskLevel: level,
    riskScore: score,
  } as Student;
});

const RAW_BUS_DATA = [
  {
    id: 'B101',
    route: 'Route A - Downtown',
    capacity: 50,
    currentOccupancy: 12,
    status: 'On Time',
    nextStop: 'Central Library',
  },
  {
    id: 'B102',
    route: 'Route B - North Campus',
    capacity: 50,
    currentOccupancy: 48,
    status: 'Delayed',
    nextStop: 'Science Block',
  },
  {
    id: 'B103',
    route: 'Route C - West Dorms',
    capacity: 40,
    currentOccupancy: 25,
    status: 'On Time',
    nextStop: 'Main Gate',
  },
  {
    id: 'B104',
    route: 'Route D - Sports Complex',
    capacity: 60,
    currentOccupancy: 58,
    status: 'On Time',
    nextStop: 'Stadium',
  },
];

export const MOCK_BUSES: Bus[] = RAW_BUS_DATA.map(data => ({
  ...data,
  crowdLevel: calculateBusCrowdLevel(data.currentOccupancy, data.capacity),
} as Bus));

export const BUS_STATUS_COLORS = {
  Low: 'bg-emerald-500',
  Medium: 'bg-amber-500',
  Heavy: 'bg-rose-600',
};

export const BUS_STATUS_TEXT_COLORS = {
  Low: 'text-emerald-400',
  Medium: 'text-amber-400',
  Heavy: 'text-rose-400',
};
