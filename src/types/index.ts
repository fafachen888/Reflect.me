export interface PersonalityTrait {
  name: string;
  value: number;
  category: 'big5' | 'attachment' | 'value' | 'interest';
  emoji: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  occupation: string;
  location: string;
  bio: string;
  personality: PersonalityTrait[];
  attachment: string;
  communicationStyle: string;
  relationshipExpectation: string;
  interests: string[];
  dealBreakers: string[];
  createdAt: string;
  assessmentData?: Record<string, number>;
}

export interface RelationEdge {
  source: string;
  target: string;
  type: 'match' | 'conflict' | 'complement';
  strength: number;
  label: string;
  description: string;
}

export interface SimulationScene {
  id: string;
  title: string;
  icon: string;
  score: number;
  summary: string;
  highlights: string[];
  warnings: string[];
}

export interface MatchSession {
  id: string;
  userA: UserProfile;
  userB: UserProfile;
  overallScore: number;
  matchLevel: string;
  edges: RelationEdge[];
  scenes: SimulationScene[];
  createdAt: string;
  status: 'pending' | 'ready' | 'viewed';
  analysis?: any;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'ai-hint' | 'system';
}
