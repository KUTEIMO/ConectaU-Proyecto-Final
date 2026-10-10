export type UserRole = 'student' | 'company' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  photoUrl?: string;
  createdAt: Date;
  updatedAt?: Date;
  isVerified: boolean;
  isActive: boolean;
  isGuest?: boolean; // Marca para usuarios invitados
  phone?: string;
  address?: string;
  availability?: string;
  // Estudiantes
  university?: 'UNISIMON' | 'UFPS' | 'UDES' | 'UNIPAMPLONA' | string;
  career?: string;
  semester?: string;
  gpa?: string;
  skills?: string[];
  experience?: string;
  portfolio?: string;
  resumeUrl?: string;
  isPublic?: boolean;
  // Empresas
  companyName?: string;
  industry?: string;
  companySize?: string;
  website?: string;
  description?: string;
  nit?: string;
  contactPerson?: string;
  contactPosition?: string;
  // Calificaciones de reputación
  ratingAverage?: number;
  ratingsCount?: number;
}

export interface StudentProfile {
  userId: string;
  headline?: string;
  summary?: string;
  experience?: string;
  achievements?: string[];
  featuredProjects?: {
    title: string;
    description?: string;
    link?: string;
  }[];
  skills?: string[];
  languages?: string[];
  availability?: string;
  interests?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StudentWithProfile extends User {
  profile?: StudentProfile | null;
  normalizedUniversity?: string;
  normalizedCareer?: string;
  normalizedSemester?: string;
  normalizedSkills?: string[];
  searchIndex?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  companyId: string;
  company: {
    id?: string;
    name: string;
    logo?: string;
    industry?: string;
  };
  status: 'active' | 'inactive' | 'closed';
  type: 'project' | 'practice' | string;
  location: string;
  modality: 'remote' | 'hybrid' | 'on-site' | string;
  salary?: string;
  skillsRequired: string[];
  requirements: string[];
  benefits: string[];
  applicationsCount: number;
  createdAt: Date;
  closingDate?: Date;
  updatedAt?: Date;
  minExperience?: string;
  maxExperience?: string;
}

export interface Application {
  id: string;
  studentId: string;
  studentName?: string;
  studentPhoto?: string;
  studentUniversity?: string;
  studentCareer?: string;
  studentSemester?: string;
  studentSkills?: string[];
  projectId: string;
  projectTitle?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected' | 'interview' | 'completed';
  message?: string;
  companyId?: string;
  dateApplied: Date;
  reviewedAt?: Date;
  completedAt?: Date;
  resumeUrl?: string;
  coverLetter?: string;
  escrowStage?: EscrowStage;
  certificateId?: string;
  companyName?: string;
}

export interface Favorite {
  id: string;
  studentId: string;
  projectId: string;
  createdAt: Date;
}

export interface SavedProfile {
  id: string;
  companyId: string;
  studentId: string;
  studentName?: string;
  studentPhoto?: string;
  note?: string;
  savedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'application' | 'message' | 'system' | 'vacancy' | 'application_status' | 'new_job' | 'interview';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  link?: string;
  data?: Record<string, any>;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount?: { [userId: string]: number };
  createdAt: Date;
  metadata?: Record<string, any>;
  otherParticipant?: Partial<User>;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName?: string;
  senderPhoto?: string;
  text: string;
  createdAt: Date;
  read: boolean;
}

export interface StudentFilters {
  search?: string;
  university?: string;
  career?: string;
  semester?: string;
  skills?: string[];
  limitResults?: number;
}

export type EscrowStage = 'deposited' | 'in_progress' | 'review' | 'released' | 'refunded';

export interface EscrowDetails {
  id?: string;
  projectId: string;
  applicationId: string;
  amount: string | number;
  stage: EscrowStage;
  stageLabel: string;
  depositDate?: Date;
  releaseDate?: Date;
  notes?: string;
}

export interface DigitalCertificate {
  id: string;
  applicationId: string;
  studentId: string;
  studentName: string;
  university?: string;
  career?: string;
  projectId: string;
  projectTitle: string;
  companyName: string;
  hoursCompleted?: number;
  skillsAcquired?: string[];
  completionDate: Date;
  verificationCode: string;
  issuer: 'ConectaU Marketplace Académico';
}

export interface Review {
  id: string;
  applicationId: string;
  projectId: string;
  projectTitle: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: 'student' | 'company';
  revieweeId: string;
  revieweeName: string;
  rating: number; // 1 a 5
  comment: string;
  categories?: {
    communication: number; // 1-5
    quality: number;       // 1-5
    punctuality: number;   // 1-5
  };
  createdAt: Date;
}

