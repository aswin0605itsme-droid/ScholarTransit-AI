import { Student, Bus } from '../types';

// Configuration for Academic Weights
const SUBJECT_WEIGHTS = {
  math: 1.5,    // Core Subject
  cs: 1.5,      // Core Subject
  science: 1.2, // Secondary Core
  history: 1.0, // General
  english: 1.0  // General
};

const ATTENDANCE_WEIGHT = 0.35; // 35% of total score
const ACADEMIC_WEIGHT = 0.65;   // 65% of total score

/**
 * Calculates a student's Risk Score (0-100) and Risk Level.
 * Formula: (Weighted_Academic_Avg * 0.65) + (Attendance * 0.35)
 */
export const calculateStudentRisk = (
  marks: Student['marks'],
  attendance: number
): { level: Student['riskLevel']; score: number } => {
  
  // 1. Calculate Weighted Academic Average
  const totalSubjectWeights = 
    SUBJECT_WEIGHTS.math + 
    SUBJECT_WEIGHTS.cs + 
    SUBJECT_WEIGHTS.science + 
    SUBJECT_WEIGHTS.history + 
    SUBJECT_WEIGHTS.english;

  const weightedMarksSum = 
    (marks.math * SUBJECT_WEIGHTS.math) +
    (marks.cs * SUBJECT_WEIGHTS.cs) +
    (marks.science * SUBJECT_WEIGHTS.science) +
    (marks.history * SUBJECT_WEIGHTS.history) +
    (marks.english * SUBJECT_WEIGHTS.english);
    
  const academicAvg = weightedMarksSum / totalSubjectWeights;

  // 2. Calculate Final Risk Score
  const rawScore = (academicAvg * ACADEMIC_WEIGHT) + (attendance * ATTENDANCE_WEIGHT);
  const score = parseFloat(rawScore.toFixed(1));

  // 3. Determine Risk Level based on Thresholds
  let level: Student['riskLevel'] = 'Low';
  
  if (score < 50) {
    level = 'High';
  } else if (score < 75) {
    level = 'Medium';
  } else {
    level = 'Low';
  }

  return { level, score };
};

/**
 * Determines Bus Crowd Level based on Occupancy Ratio.
 */
export const calculateBusCrowdLevel = (
  occupancy: number,
  capacity: number
): Bus['crowdLevel'] => {
  const ratio = occupancy / capacity;

  if (ratio >= 0.8) return 'Heavy';
  if (ratio >= 0.5) return 'Medium';
  return 'Low';
};