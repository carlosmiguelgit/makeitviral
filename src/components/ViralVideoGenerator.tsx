"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Loader2, Sparkles, Check, Star } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { useLanguage } from "@/hooks/use-language";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const ViralVideoGenerator: React.FC = () => {
  const { t, language } = useLanguage();
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [includeWatermark, setIncludeWatermark] = useState(false);
  const [channelName, setChannelName] = useState("");

  const handleGenerate = () => {
    const watermarkText = includeWatermark && channelName.trim() ? ` (Watermark: ${channelName.trim()})` : "";

    const ideas: Record<string, string[]> = {
      pt: [
        `Tutorial de 60 segundos: Como fazer panquecas que flutuam. Título: 'A Panqueca Anti-Gravidade'${watermarkText}`,
        `Desafio: Tentar viver um dia inteiro usando apenas a cor ${topic}. Título: 'O Dia Monocromático de ${topic}!'${watermarkText}`,
        `Análise profunda sobre por que gatos odeiam pepinos. Título: 'O Mistério do Pepino Felino'${watermarkText}`,
      ],
      en: [
        `60-second tutorial: How to make floating pancakes. Title: 'The Anti-Gravity Pancake'${watermarkText}`,
        `Challenge: Trying to live an entire day using only the color ${topic}. Title: 'The Monochromatic Day of ${topic}!'${watermarkText}`,
        `Deep analysis on why cats hate cucumbers. Title: 'The Feline Cucumber Mystery'${watermarkText}`,
      ],
    };

    const selectedIdeas = ideas[language] || ideas['pt'];
    const generatedIdea = selectedIdeas[Math.floor(Math.random() * selectedIdeas.length)];
    setResult(generatedIdea);
    setIsLoading(false);
    showSuccess(t('success_toast'));
  };

  return (
    <Card className="w-full border-none shadow-none bg-card text-foreground">
      <CardContent className="p-3 space-y-4">
        <div className="text-center py-4">
          <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase">
            M<span className="text-red-600">A</span>KEITV<span className="text-red-600">I</span>RAL
          </h1>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="topic" className="text-xs font-medium text-muted-foreground">
            {t('topic_label')}
          </label>
          <Input
            id="topic"
            placeholder={t('topic_placeholder')}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isLoading}
            className="h-10 text-sm bg-input border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Watermark Option */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="watermark"
              checked={includeWatermark}
              onCheckedChange={(checked) => {
                setIncludeWatermark(!!checked);
                if (!checked) setChannelName("");
              }}
              className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
            <Label
              htmlFor="watermark"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
            >
              {t('include_watermark')}
            </Label>
          </div>
          {includeWatermark && (
            <div className="space-y-1.5 pt-1">
              <label htmlFor="channel-name" className="text-xs font-medium text-muted-foreground">
                {t('channel_name_label')}
              </label>
              <Input
                id="channel-name"
                placeholder={t('channel_name_placeholder')}
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                disabled={isLoading}
                className="h-10 text-sm bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          )}
        </div>
        
        <Button
          onClick={() => {
            if (!topic.trim()) {
              showError(t('error_toast'));
              return;
            }
            setIsLoading(true);
            setResult(null);
            setTimeout(() => handleGenerate(), 2000);
          }}
          disabled={isLoading}
          className="w-full h-10 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-md shadow-primary/50"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('generating')}
            </>
          ) : (
            <>
              <Video className="mr-2 h-4 w-4" />
              {t('generate_button')}
            </>
          )}
        </Button>
        {result && (
          <div className="mt-4 p-3 bg-secondary rounded-lg border border-primary/50 shadow-md shadow-primary/20 transition-all duration-500">
            <h3 className="text-sm font-semibold mb-1.5 text-primary flex items-center">
              <Sparkles className="h-3 w-3 mr-1.5" />
              {t('idea_title')}
            </h3>
            <p className="text-foreground whitespace-pre-wrap text-sm">
              {result}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ViralVideoGenerator;