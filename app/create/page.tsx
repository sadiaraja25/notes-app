"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Story } from "@/lib/types";
import { saveStory } from "@/lib/storage";
import { NotebookPen } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

const IMPORTANCE_LEVELS = ["low", "mid", "high"];

export default function CreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [importance, setImportance] = useState<string>(IMPORTANCE_LEVELS[0]);
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const userId = useAuth().user?.uid;

  const generateNote = async () => {
    setGenerating(true);
    setTimeout(() => {
      const mockNote = `${title}\n\nThis is a ${importance} priority note.\n\nAbout: ${prompt}\n\n`;
      setGeneratedContent(mockNote);
      setGenerating(false);
    }, 2000);
  };

  const handleSave = () => {
    if (!title || !generatedContent) return;

    const note: Story = {
      id: crypto.randomUUID(),
      title,
      content: generatedContent,
      genre: importance, // Reusing genre field in your Story type
      createdAt: new Date().toISOString(),
    };

    saveStory(note, userId!);
    router.push("/bookmarks");
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-4">
        <NotebookPen className="h-10 w-10 text-indigo-600" />
        New Note
      </h1>

      <Card className="p-6 mb-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Importance</label>
            <Select value={importance} onValueChange={setImportance}>
              <SelectTrigger>
                <SelectValue placeholder="Select importance" />
              </SelectTrigger>
              <SelectContent>
                {IMPORTANCE_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">About the note</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter what this note is about..."
              rows={4}
            />
          </div>

          <Button
            onClick={generateNote}
            disabled={!prompt || generating}
            className="w-full"
          >
            {generating ? "Generating..." : "Generate Note"}
          </Button>
        </div>
      </Card>

      {generatedContent && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Generated Note</h2>
          <div className="prose max-w-none mb-6">
            <pre className="whitespace-pre-wrap font-sans">{generatedContent}</pre>
          </div>
          <Button onClick={handleSave} className="w-full">
            Save Note
          </Button>
        </Card>
      )}
    </div>
  );
}
