"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { translatedEmotions } from "./weekly-summary";

interface Emotion {
  id: number;
  emotion_type: string;
  mood_score: number;
  description: string;
  recorded_at: string;
}

export function EmotionHistory() {
  const { token } = useAuth();
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/emotions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setEmotions(data);
        }
      } catch (error) {
        console.error("Erro ao buscar emoções:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmotions();
  }, [token]);

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      happy: "bg-yellow-100 text-yellow-800",
      sad: "bg-blue-100 text-blue-800",
      anxious: "bg-gray-100 text-gray-800",
      excited: "bg-orange-100 text-orange-800",
      calm: "bg-green-100 text-green-800",
      angry: "bg-red-100 text-red-800",
      frustrated: "bg-purple-100 text-purple-800",
      grateful: "bg-pink-100 text-pink-800",
      content: "bg-amber-100 text-amber-800",
      stressed: "bg-indigo-100 text-indigo-800",
    };
    return colors[emotion] || "bg-gray-100 text-gray-800";
  };

  const getMoodColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    if (score >= 4) return "text-orange-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Seu histórico de emoções
        </h2>
        <p className="text-gray-600">Reveja suas anotações passadas</p>
      </div>

      {emotions.length === 0 ? (
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <p className="text-gray-500 text-lg">Sem anotações ainda.</p>
            <p className="text-gray-400">
              Comece a anotar suas emoções pra que elas apareçam aqui!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {emotions.map((emotion) => (
            <Card
              key={emotion.id}
              className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={getEmotionColor(emotion.emotion_type)}>
                      {translatedEmotions[emotion.emotion_type]}
                    </Badge>
                    <span
                      className={`font-bold text-lg ${getMoodColor(
                        emotion.mood_score
                      )}`}
                    >
                      {emotion.mood_score}/10
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {format(
                      new Date(emotion.recorded_at),
                      "dd/MM/yyyy - HH:mm"
                    )}
                  </span>
                </div>
              </CardHeader>
              {emotion.description && (
                <CardContent className="pt-0">
                  <p className="text-gray-700 leading-relaxed">
                    {emotion.description}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
