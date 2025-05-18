"use client";

import { Settings, Story } from "./types";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  setDoc
} from "firebase/firestore";

export const defaultSettings: Settings = {
  darkMode: false,
  autoSave: true,
  readingFontSize: "medium",
};

export async function saveStory(story: Story, userId: string): Promise<void> {
  if (!userId) return;

  try {
    await addDoc(collection(db, "users", userId, "stories"), story);
  } catch (error) {
    console.error("Error saving story:", error);
    throw error;
  }
}

export async function getStories(userId: string): Promise<Story[]> {
  if (!userId) return [];

  try {
    const storiesSnapshot = await getDocs(collection(db, "users", userId, "stories"));
    return storiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Story[];
  } catch (error) {
    console.error("Error getting stories:", error);
    return [];
  }
}

export async function getStory(id: string, userId: string): Promise<Story | undefined> {
  if (!userId) return undefined;

  try {
    const storyDoc = await getDoc(doc(db, "users", userId, "stories", id));
    if (storyDoc.exists()) {
      return { id: storyDoc.id, ...storyDoc.data() } as Story;
    }
    return undefined;
  } catch (error) {
    console.error("Error getting story:", error);
    return undefined;
  }
}

export async function updateStory(updatedStory: Story, userId: string): Promise<void> {
  if (!userId || !updatedStory.id) return;

  try {
    const storyRef = doc(db, "users", userId, "stories", updatedStory.id);

    const { id, ...storyData } = updatedStory;

    await updateDoc(storyRef, storyData);
  } catch (error) {
    console.error("Error updating story:", error);
    throw error;
  }
}

export async function deleteStory(id: string, userId: string): Promise<void> {
  if (!userId) return;

  try {
    await deleteDoc(doc(db, "users", userId, "stories", id));
  } catch (error) {
    console.error("Error deleting story:", error);
    throw error;
  }
}

export async function getSettings(userId: string): Promise<Settings> {
  if (!userId) return defaultSettings;

  try {
    const settingsDoc = await getDoc(doc(db, "users", userId, "settings", "userSettings"));

    if (settingsDoc.exists()) {
      return settingsDoc.data() as Settings;
    }
    return defaultSettings;
  } catch (error) {
    console.error("Error getting settings:", error);
    return defaultSettings;
  }
}

export async function updateSettings(settings: Settings, userId: string): Promise<void> {
  if (!userId) return;

  try {
    await setDoc(doc(db, "users", userId, "settings", "userSettings"), settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
}

export async function initializeUserData(userId: string): Promise<void> {
  if (!userId) return;

  try {
    const settingsDoc = await getDoc(doc(db, "users", userId, "settings", "userSettings"));
    if (!settingsDoc.exists()) {
      await setDoc(doc(db, "users", userId, "settings", "userSettings"), defaultSettings);
    }
  } catch (error) {
    console.error("Error initializing user data:", error);
  }
}