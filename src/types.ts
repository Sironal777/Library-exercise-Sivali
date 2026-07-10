export interface UserProfile {
  id: string;
  username: string;
  totalPoints: number;
  ddcScore: number;
  catalogingScore: number;
  filingScore: number;
  subjectScore: number;
  gkScore: number;
  lastActive: any; // Timestamp or ISO string
  isBlocked?: boolean;
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  ddc: string; // Dewey Decimal Classification number, e.g., "510.7"
  subject: string;
  publisher?: string;
  year?: string;
  isbn?: string;
}

export interface CatalogQuizItem {
  id: string;
  bookImage?: string;
  titlePage: {
    title: string;
    author: string;
    publisher: string;
    year: string;
    isbn: string;
    edition?: string;
  };
  fieldsToFill: {
    field: "title" | "author" | "publisher" | "year" | "isbn";
    label: string;
    correctValue: string;
    options: string[];
  }[];
}

export type ActiveScreen = "login" | "dashboard" | "game_ddc" | "game_catalog" | "game_filing" | "game_subject" | "game_gk" | "game_mindmaps" | "leaderboard" | "admin";
