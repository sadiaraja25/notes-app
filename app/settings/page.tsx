"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { defaultSettings, Settings } from "@/lib/types";
import { getSettings, updateSettings } from "@/lib/storage";
import { useAuth } from "@/components/auth/AuthProvider";

export default function SettingsPage() {
  const userId = useAuth().user?.uid; // Assuming useAuth() returns userId
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    if (!userId) return; // Ensure userId is available

    const fetchSettings = async () => {
      const userSettings = await getSettings(userId);
      setSettings(userSettings);
      document.documentElement.classList.toggle("dark", userSettings.darkMode);
    };

    fetchSettings();
  }, [userId]);

  const handleSettingChange = (key: keyof Settings, value: any) => {
    if (!settings) return;
    
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    updateSettings( newSettings,userId!);

    if (key === "darkMode") {
      document.documentElement.classList.toggle("dark", value);
    }
  };

  if (!settings) {
    return <div className="text-center py-8">Loading settings...</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Settings</h1>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">Dark Mode</h2>
              <p className="text-sm text-muted-foreground">
                Toggle dark mode for better reading at night
              </p>
            </div>
            <Switch
              checked={settings.darkMode}
              onCheckedChange={(checked) =>
                handleSettingChange("darkMode", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">Auto Save</h2>
              <p className="text-sm text-muted-foreground">
                Automatically save stories while writing
              </p>
            </div>
            <Switch
              checked={settings.autoSave}
              onCheckedChange={(checked) =>
                handleSettingChange("autoSave", checked)
              }
            />
          </div>

          <div>
            <h2 className="text-lg font-medium mb-2">Reading Font Size</h2>
            <Select
              value={settings.readingFontSize}
              onValueChange={(value) =>
                handleSettingChange("readingFontSize", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4">
            <Button
              variant="destructive"
              onClick={() => {
                localStorage.clear();
                setSettings(defaultSettings);
              }}
            >
              Clear All Data
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
