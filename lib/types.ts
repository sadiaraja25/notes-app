export interface Story {
  id: string;
  title: string;
  content: string;
  genre: string;
  createdAt: string;
}

export interface Template {
  id: string;
  title: string;
  prompt: string;
  genre: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
}

export interface Settings {
  darkMode: boolean;
  autoSave: boolean;
  readingFontSize: string;
}

export type Genre = "fantasy" | "scifi" | "mystery" | "romance";

export const GENRES: Genre[] = ["fantasy", "scifi", "mystery", "romance"];

export const defaultSettings: Settings = {
  darkMode: false,
  autoSave: true,
  readingFontSize: "medium",
};