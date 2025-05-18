"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Story, Settings, defaultSettings } from "@/lib/types";
import { getStory, getSettings, updateSettings } from "@/lib/storage";
import { Moon, Sun } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export default function ReadPage() {
  const searchParams = useSearchParams();
  const storyId = searchParams.get("id");
  const { user } = useAuth();
  const userId = user?.uid;

  const [story, setStory] = useState<Story | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);

  // Fetch user settings
  useEffect(() => {
    if (!userId) return;

    const fetchSettings = async () => {
      const userSettings = await getSettings(userId);
      setSettings(userSettings);
      document.documentElement.classList.toggle("dark", userSettings.darkMode);
    };

    fetchSettings();
  }, [userId]);

  // Fetch story
  useEffect(() => {
    if (!storyId || !userId) return;

    const fetchStory = async () => {
      const foundStory = await getStory(storyId, userId);
      if (foundStory) setStory(foundStory);
    };

    fetchStory();
  }, [storyId, userId]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    if (!settings) return;

    const newSettings = {
      ...settings,
      darkMode: !settings.darkMode,
    };
    setSettings(newSettings);
    updateSettings( newSettings,userId!);
    document.documentElement.classList.toggle("dark");
  };

  // Set font size
  const getFontSize = () => {
    if (!settings) return "text-base";
    switch (settings.readingFontSize) {
      case "small":
        return "text-sm";
      case "large":
        return "text-xl";
      default:
        return "text-base";
    }
  };

  if (!story) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Story not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{story.title}</h1>
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {settings?.darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        <Card className="p-8">
          <div className={`prose max-w-none dark:prose-invert ${getFontSize()}`}>
            <pre className="whitespace-pre-wrap font-sans">{story.content}</pre>
          </div>
        </Card>
      </div>
    </div>
  );
}
