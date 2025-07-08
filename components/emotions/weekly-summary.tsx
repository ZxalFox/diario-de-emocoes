"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, Calendar, Heart } from "lucide-react";

interface WeeklySummary {
  average_mood: number;
  total_entries: number;
  most_common_emotion: string;
  daily_breakdown: Record<string, number>;
}

export const translatedEmotions: Record<string, string> = {
  happy: "Feliz",
  sad: "Triste",
  anxious: "Ansiosa",
  excited: "Empolgada",
  calm: "Calma",
  angry: "Brava",
  frustrated: "Frustrada",
  grateful: "Grata",
  content: "Contente",
  stressed: "Estressada",
};

export function WeeklySummary() {
  const { token } = useAuth();
  const [summary, setSummary] = useState<WeeklySummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/emotions/weekly_summary`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setSummary(data);
        }
      } catch (error) {
        console.error("Erro ao buscar resumos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [token]);

  const getMoodDescription = (score: number) => {
    if (score >= 8) return { text: "Excelente!", color: "text-green-600" };
    if (score >= 6) return { text: "Bom", color: "text-yellow-600" };
    if (score >= 4) return { text: "Razoável", color: "text-orange-600" };
    return { text: "Carece de atenção", color: "text-red-600" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!summary || summary.total_entries === 0) {
    return (
      <Card className="max-w-2xl mx-auto shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Sem resumos essa semana.</p>
          <p className="text-gray-400">
            Comece a anotar suas emoções para ver o resumo semanal aqui!
          </p>
        </CardContent>
      </Card>
    );
  }

  const moodDesc = getMoodDescription(summary.average_mood);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Resumos semanais</h2>
        <p className="text-gray-600">Entendendo seus padrões emocionais</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Humor médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className={`text-3xl font-bold ${moodDesc.color}`}>
                {Number(summary.average_mood).toFixed(0)}/10
              </div>
              <p className={`text-sm font-medium ${moodDesc.color}`}>
                {moodDesc.text}
              </p>
              <Progress value={summary.average_mood * 10} className="mt-3" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-500" />
              Total de registros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {summary.total_entries}
              </div>
              <p className="text-sm text-gray-600">Essa semana</p>
              <div className="mt-3 text-xs text-gray-500">
                {(() => {
                  if (summary.total_entries >= 7) {
                    return "🎉 Sequência diária!";
                  } else {
                    const daysLeft = 7 - summary.total_entries;
                    const dayLabel = daysLeft === 1 ? "dia" : "dias";
                    return `${daysLeft} ${dayLabel} para completar a semana`;
                  }
                })()}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-purple-500" />
              Mais comum
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              {summary.most_common_emotion ? (
                <>
                  <Badge className="text-lg px-4 py-2 bg-purple-100 text-purple-800">
                    {translatedEmotions[summary.most_common_emotion]}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-2">Emoção Dominante</p>
                </>
              ) : (
                <p className="text-gray-500">Sem dados ainda</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {Object.keys(summary.daily_breakdown).length > 0 && (
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Resumo de humor diário</CardTitle>
            <CardDescription>Seu humor ao longo da semana</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(summary.daily_breakdown).map(([date, score]) => (
                <div key={date} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {new Date(date).toLocaleDateString("pt-BR", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <div className="flex items-center gap-3">
                    <Progress value={score * 10} className="w-24" />
                    <span
                      className={`text-sm font-medium ${
                        getMoodDescription(score).color
                      }`}
                    >
                      {Number(score).toFixed(0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
