import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fetchTopStories = async () => {
  const response = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  );
  const storyIds = await response.json();
  const stories = await Promise.all(
    storyIds.slice(0, 100).map(async (id) => {
      const storyResponse = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      return storyResponse.json();
    })
  );
  return stories;
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: stories, isLoading, error } = useQuery({
    queryKey: ["topStories"],
    queryFn: fetchTopStories,
  });

  const filteredStories = stories?.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) return <div>Error loading stories</div>;

  return (
    <div className="container mx-auto p-4">
      <header className="mb-4">
        <h1 className="text-3xl font-bold mb-2">Hacker News Top Stories</h1>
        <Input
          type="text"
          placeholder="Search stories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </header>
      <div className="grid grid-cols-1 gap-4">
        {isLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className="h-24 w-full" />
            ))
          : filteredStories.map((story) => (
              <Card key={story.id} className="w-full">
                <CardHeader>
                  <CardTitle>
                    <a
                      href={story.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {story.title}
                    </a>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{story.score} upvotes</p>
                  <a
                    href={story.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Read more
                  </a>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
};

export default Index;