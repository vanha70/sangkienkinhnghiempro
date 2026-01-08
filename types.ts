
export interface UserInfo {
  topic: string;
  subject: string;
  grade: string;
  school: string;
  textbook: string;
}

export enum GenerationStep {
  INPUT_FORM = 0,
  OUTLINE = 1,
  PART_I_II = 2,
  PART_III = 3,
  PART_IV_SOL1 = 4,
  PART_IV_SOL2 = 5,
  PART_V_VI = 6,
  APPENDIX = 7,
  COMPLETED = 8
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface GenerationState {
  step: GenerationStep;
  messages: ChatMessage[];
  fullDocument: string;
  isStreaming: boolean;
  error: string | null;
}

// Add missing Status enum used across components
export enum Status {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED'
}

// Add missing Initiative interface used in Dashboard and Lists
export interface Initiative {
  id: string;
  title: string;
  subject: string;
  grade: string;
  year: string;
  abstract: string;
  situation: string;
  solutions: string;
  results: string;
  status: Status;
}
