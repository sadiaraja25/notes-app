"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Story } from "@/lib/types";
import { getStories, deleteStory } from "@/lib/storage";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";

const IMPORTANCE_LEVELS = ["low", "mid", "high"];

export default function BookmarksPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedImportance, setSelectedImportance] = useState<string>("all");
  const userId = useAuth().user?.uid;

  useEffect(() => {
    if (!userId) return;
    const fetchStories = async () => {
      setStories(await getStories(userId));
    };
    fetchStories();
  }, [userId]);

  const handleDelete = async (id: string) => {
    if (!userId) return;
    deleteStory(id, userId);
    setStories(await getStories(userId));
  };

  const filteredStories = selectedImportance === "all"
    ? stories
    : stories.filter((story) => story.genre === selectedImportance);

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Notes</h1>
        <Select value={selectedImportance} onValueChange={setSelectedImportance}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by importance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Importance</SelectItem>
            {IMPORTANCE_LEVELS.map((level) => (
              <SelectItem key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        {filteredStories.length > 0 && filteredStories.map((story) => (
          <Card key={story.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">{story.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {new Date(story.createdAt).toLocaleDateString()} · {story.genre}
                </p>
              </div>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => handleDelete(story.id)}>
                  Delete
                </Button>
                <Link href={`/read?id=${story.id}`}>
                  <Button>Read</Button>
                </Link>
              </div>
            </div>
            <p className="line-clamp-3">{story.content}</p>
          </Card>
        ))}

        {filteredStories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No notes found</p>
            <Link href="/create">
              <Button>Create Your First Note</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
