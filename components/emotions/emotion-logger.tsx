"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import {
  Smile,
  Frown,
  Meh,
  Heart,
  Coffee,
  Zap,
  Cloud,
  Sun,
  Moon,
} from "lucide-react";

const EMOTIONS = [
  {
    type: "happy",
    label: "Feliz",
    icon: Smile,
    color: "text-yellow-500",
    bg: "bg-yellow-100 hover:bg-yellow-200",
  },
  {
    type: "sad",
    label: "Triste",
    icon: Frown,
    color: "text-blue-500",
    bg: "bg-blue-100 hover:bg-blue-200",
  },
  {
    type: "anxious",
    label: "Ansiosa",
    icon: Cloud,
    color: "text-gray-500",
    bg: "bg-gray-100 hover:bg-gray-200",
  },
  {
    type: "excited",
    label: "Empolgada",
    icon: Zap,
    color: "text-orange-500",
    bg: "bg-orange-100 hover:bg-orange-200",
  },
  {
    type: "calm",
    label: "Calma",
    icon: Sun,
    color: "text-green-500",
    bg: "bg-green-100 hover:bg-green-200",
  },
  {
    type: "angry",
    label: "Raiva",
    icon: Frown,
    color: "text-red-500",
    bg: "bg-red-100 hover:bg-red-200",
  },
  {
    type: "frustrated",
    label: "Frustrada",
    icon: Meh,
    color: "text-purple-500",
    bg: "bg-purple-100 hover:bg-purple-200",
  },
  {
    type: "grateful",
    label: "Grata",
    icon: Heart,
    color: "text-pink-500",
    bg: "bg-pink-100 hover:bg-pink-200",
  },
  {
    type: "content",
    label: "Contente",
    icon: Coffee,
    color: "text-amber-500",
    bg: "bg-amber-100 hover:bg-amber-200",
  },
  {
    type: "stressed",
    label: "Estressada",
    icon: Moon,
    color: "text-indigo-500",
    bg: "bg-indigo-100 hover:bg-indigo-200",
  },
];

export function EmotionLogger() {
  const { token } = useAuth();
  const [selectedEmotion, setSelectedEmotion] = useState<string>("");
  const [moodScore, setMoodScore] = useState([5]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmotion) {
      toast.error("Por favor, selecione uma emoção.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/emotions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            emotion: {
              emotion_type: selectedEmotion,
              mood_score: moodScore[0],
              description,
              recorded_at: new Date().toISOString(),
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to log emotion");
      }

      toast.success("Emoção Anotada! 🎉");
      setSelectedEmotion("");
      setMoodScore([5]);
      setDescription("");
    } catch (error) {
      toast.error("Erro ao anotar emoção. Tente novamente.");
      console.error("Error logging emotion:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Como você está se sentindo?
        </CardTitle>
        <CardDescription className="text-center">
          Tire um momento para refletir sobre o seu estado atual
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label className="text-lg font-semibold">
              Selecione sua emoção
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {EMOTIONS.map(({ type, label, icon: Icon, color, bg }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedEmotion(type)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedEmotion === type
                      ? "border-blue-500 shadow-lg scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  } ${bg}`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${color}`} />
                  <span className="text-sm font-medium text-gray-700">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-semibold">
              Nível de intensidade: {moodScore[0]}/10
            </Label>
            <Slider
              value={moodScore}
              onValueChange={setMoodScore}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Baixo</span>
              <span>Alto</span>
            </div>
          </div>

          <div className="space-y-4">
            <Label htmlFor="description" className="text-lg font-semibold">
              O que você está pensando? (Opcional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Escreva como está se sentindo, o que aconteceu hoje, ou qualquer coisa que queira..."
              className="min-h-[100px] border-gray-200 focus:border-blue-500"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg py-6"
            disabled={loading || !selectedEmotion}
          >
            {loading ? "Anotando..." : "Anotar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
