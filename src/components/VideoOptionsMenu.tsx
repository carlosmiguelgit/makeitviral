"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Timer, LayoutGrid, Settings2, Cpu, TrendingUp, BookMarked, ShieldAlert, Sword, Dog, Coffee, Camera, UserPlus, Lightbulb, Search, Hammer, HeartPulse, Palette, Heart, Laugh, Radio, Speaker, Map, Briefcase, Music2, Zap, Flame, Link, Loader2, Youtube, Instagram, Facebook, Ghost, Box, Clock, RefreshCw, Baby, Shield, Infinity, BarChart3, Star } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { showSuccess, showError } from "@/utils/toast";

interface VideoOptionsMenuProps {
  onTabChange?: (tab: string) => void;
}

const VideoOptionsMenu: React.FC<VideoOptionsMenuProps> = ({ onTabChange }) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState("niche");
  const [selectedPlatform, setSelectedPlatform] = useState("youtube");
  const [selectedOptions, setSelectedOptions] = useState({
    niche: [] as string[],
    duration: 60,
    longDuration: 10,
    engagementBoost: false,
    trendingAlgorithm: false,
    trendAnalysis: false,
    viralHook: false,
    persistenceMode: false,
  });
  const [aiRemodeling, setAiRemodeling] = useState({
    url: "",
    isLoading: false,
    result: null as string | null
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (onTabChange) {
      onTabChange(value);
    }
  };

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
    setAiRemodeling(prev => ({ ...prev, url: "" }));
  };

  const nicheOptions = [
    { id: "ai_tech", label: t('niche_ai_tech'), icon: <Cpu className="h-4 w-4" /> },
    { id: "finance", label: t('niche_finance'), icon: <TrendingUp className="h-4 w-4" /> },
    { id: "storytelling", label: t('niche_storytelling'), icon: <BookMarked className="h-4 w-4" /> },
    { id: "true_crime", label: t('niche_true_crime'), icon: <ShieldAlert className="h-4 w-4" /> },
    { id: "gaming", label: t('niche_gaming'), icon: <Sword className="h-4 w-4" /> },
    { id: "cartoon", label: t('niche_cartoon'), icon: <Ghost className="h-4 w-4" /> },
    { id: "3d_animation", label: t('niche_3d_animation'), icon: <Box className="h-4 w-4" /> },
    { id: "superheroes", label: t('niche_superheroes'), icon: <Shield className="h-4 w-4" /> },
    { id: "babies", label: t('niche_babies'), icon: <Baby className="h-4 w-4" /> },
    { id: "pets", label: t('niche_pets'), icon: <Dog className="h-4 w-4" /> },
    { id: "food", label: t('niche_food'), icon: <Coffee className="h-4 w-4" /> },
    { id: "lifestyle", label: t('niche_lifestyle'), icon: <Camera className="h-4 w-4" /> },
    { id: "personal_dev", label: t('niche_personal_dev'), icon: <UserPlus className="h-4 w-4" /> },
    { id: "education", label: t('niche_education'), icon: <Lightbulb className="h-4 w-4" /> },
    { id: "curiosities", label: t('niche_curiosities'), icon: <Search className="h-4 w-4" /> },
    { id: "diy", label: t('niche_diy'), icon: <Hammer className="h-4 w-4" /> },
    { id: "health", label: t('niche_health'), icon: <HeartPulse className="h-4 w-4" /> },
    { id: "fashion", label: t('niche_fashion'), icon: <Palette className="h-4 w-4" /> },
    { id: "relationships", label: t('niche_relationships'), icon: <Heart className="h-4 w-4" /> },
    { id: "humor", label: t('niche_humor'), icon: <Laugh className="h-4 w-4" /> },
    { id: "podcasts", label: t('niche_podcasts'), icon: <Radio className="h-4 w-4" /> },
    { id: "asmr", label: t('niche_asmr'), icon: <Speaker className="h-4 w-4" /> },
    { id: "travel", label: t('niche_travel'), icon: <Map className="h-4 w-4" /> },
    { id: "business", label: t('niche_business'), icon: <Briefcase className="h-4 w-4" /> }
  ];

  const platformOptions = [
    { id: "youtube", label: "Youtube", icon: <Youtube className="h-4 w-4" /> },
    { id: "tiktok", label: "Tiktok", icon: <Music2 className="h-4 w-4" /> },
    { id: "facebook", label: "Facebook", icon: <Facebook className="h-4 w-4" /> },
    { id: "instagram", label: "Instagram", icon: <Instagram className="h-4 w-4" /> }
  ];

  const toggleOption = (category: string, option: string) => {
    setSelectedOptions(prev => {
      if (category === 'niche') {
        return {
          ...prev,
          niche: prev.niche.includes(option)
            ? prev.niche.filter(item => item !== option)
            : [...prev.niche, option]
        };
      }
      return prev;
    });
  };

  const handleSliderChange = (value: number[]) => {
    setSelectedOptions(prev => ({
      ...prev,
      duration: value[0]
    }));
  };

  const handleLongSliderChange = (value: number[]) => {
    setSelectedOptions(prev => ({
      ...prev,
      longDuration: value[0]
    }));
  };

  const toggleBooleanOption = (option: keyof Omit<typeof selectedOptions, 'niche' | 'duration' | 'longDuration'>) => {
    setSelectedOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const handleRemodel = () => {
    if (!aiRemodeling.url.trim()) {
      showError(`${t('enter_valid_url')} ${selectedPlatform}`);
      return;
    }
    setAiRemodeling(prev => ({ ...prev, isLoading: true }));
    setTimeout(() => {
      setAiRemodeling({
        url: "",
        isLoading: false,
        result: `Video successfully remodeled! Your new video is ready for download. AI has applied audio improvements, visual effects, and optimized for engagement.`
      });
      showSuccess("Remodeling successfully completed!");
    }, 3000);
  };

  const getPlatformPlaceholder = () => {
    switch (selectedPlatform) {
      case "youtube": return "https://youtube.com/watch?v=...";
      case "tiktok": return "https://tiktok.com/@username/video/...";
      case "facebook": return "https://facebook.com/watch?v=...";
      case "instagram": return "https://instagram.com/reel/...";
      default: return "https://youtube.com/watch?v=...";
    }
  };

  const getPlatformLabel = () => {
    switch (selectedPlatform) {
      case "youtube": return t('paste_youtube_link');
      case "tiktok": return t('paste_tiktok_link');
      case "facebook": return t('paste_facebook_link');
      case "instagram": return t('paste_instagram_link');
      default: return t('paste_youtube_link');
    }
  };

  return (
    <Card className="w-full border-none shadow-none bg-card/90 backdrop-blur-sm text-foreground">
      <CardContent className="p-2 space-y-3">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="flex items-center justify-center gap-2 mb-2 p-1 bg-yellow-400/10 rounded-lg">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <p className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider">
              {t('annual_plan_only')}
            </p>
          </div>
          
          <TabsList className="grid grid-cols-4 h-12 bg-secondary/50 rounded-lg p-1">
            <TabsTrigger value="niche" className="h-10 text-[10px] font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md flex flex-col items-center justify-center">
              <div className="flex items-center">
                <LayoutGrid className="h-3 w-3 mr-1" />
                {t('niche_tab')}
              </div>
            </TabsTrigger>
            <TabsTrigger value="duration" className="h-10 text-[10px] font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md flex flex-col items-center justify-center">
              <div className="flex items-center">
                <Timer className="h-3 w-3 mr-1" />
                {t('duration_tab')}
              </div>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="h-10 text-[10px] font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
              <div className="flex flex-col items-center justify-center">
                <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400 mb-0.5" />
                <div className="flex items-center">
                  <Settings2 className="h-3 w-3 mr-1" />
                  {t('advanced_tab')}
                </div>
              </div>
            </TabsTrigger>
            <TabsTrigger value="aiRemodeling" className="h-10 text-[10px] font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
              <div className="flex flex-col items-center justify-center">
                <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400 mb-0.5" />
                <div className="flex items-center">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  {t('ai_remodel_tab')}
                </div>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="niche" className="mt-3 space-y-2">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-primary flex items-center">
                <LayoutGrid className="h-4 w-4 mr-1" />
                {t('select_niche')}
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {nicheOptions.map((option) => (
                <Button
                  key={option.id}
                  variant={selectedOptions.niche.includes(option.id) ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-8 text-xs font-medium justify-start gap-2 hover:bg-primary/10 transition-all",
                    selectedOptions.niche.includes(option.id)
                      ? "bg-primary text-primary-foreground"
                      : "border-border"
                  )}
                  onClick={() => toggleOption('niche', option.id)}
                >
                  {option.icon}
                  {option.label}
                </Button>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="duration" className="mt-3 space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-primary flex items-center">
                <Timer className="h-4 w-4 mr-1" />
                {t('video_duration')}
              </h3>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  {t('duration_slider_label')} ({selectedOptions.duration}s)
                </Label>
                <Slider
                  value={[selectedOptions.duration]}
                  min={15}
                  max={300}
                  step={5}
                  onValueChange={handleSliderChange}
                  className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:bg-primary"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>15s</span>
                  <span>150s</span>
                  <span>300s</span>
                </div>
              </div>
            </div>
            <div className="space-y-3 pt-2 border-t border-border/50">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-primary flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {t('long_videos')}
                </h3>
                <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                  {selectedOptions.longDuration} min
                </Badge>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  {t('long_duration_label')}
                </Label>
                <Slider
                  value={[selectedOptions.longDuration]}
                  min={1}
                  max={60}
                  step={1}
                  onValueChange={handleLongSliderChange}
                  className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:bg-primary"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>1 min</span>
                  <span>30 min</span>
                  <span>60 min</span>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="advanced" className="mt-3 space-y-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-primary flex items-center">
                  <Settings2 className="h-4 w-4 mr-1" />
                  {t('advanced_features')}
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Zap className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-white font-semibold text-sm">{t('engagement_boost')}</p>
                      <p className="text-zinc-400 text-xs">{t('engagement_boost_desc')}</p>
                    </div>
                  </div>
                  <Checkbox
                    checked={selectedOptions.engagementBoost}
                    onCheckedChange={() => toggleBooleanOption('engagementBoost')}
                    className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                </div>
                <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-white font-semibold text-sm">{t('trending_algorithm')}</p>
                      <p className="text-zinc-400 text-xs">{t('trending_algorithm_desc')}</p>
                    </div>
                  </div>
                  <Checkbox
                    checked={selectedOptions.trendingAlgorithm}
                    onCheckedChange={() => toggleBooleanOption('trendingAlgorithm')}
                    className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                </div>
                <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Flame className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-white font-semibold text-sm">{t('viral_hook')}</p>
                      <p className="text-zinc-400 text-xs">{t('viral_hook_desc')}</p>
                    </div>
                  </div>
                  <Checkbox
                    checked={selectedOptions.viralHook}
                    onCheckedChange={() => toggleBooleanOption('viralHook')}
                    className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                </div>
                <div className="relative flex items-center justify-between p-2 bg-white/5 rounded-lg overflow-hidden">
                  <div className="absolute top-0 right-0">
                    <span className="text-[7px] font-black text-white bg-red-600 px-1 py-0.5 rounded-bl uppercase tracking-tighter">
                      {t('new_tag')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Infinity className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-white font-semibold text-sm">{t('persistence_mode')}</p>
                      <p className="text-zinc-400 text-xs">{t('persistence_mode_desc')}</p>
                    </div>
                  </div>
                  <Checkbox
                    checked={selectedOptions.persistenceMode}
                    onCheckedChange={() => toggleBooleanOption('persistenceMode')}
                    className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                </div>
                <div className="relative flex items-center justify-between p-2 bg-white/5 rounded-lg overflow-hidden">
                  <div className="absolute top-0 right-0">
                    <span className="text-[7px] font-black text-white bg-red-600 px-1 py-0.5 rounded-bl uppercase tracking-tighter">
                      {t('new_tag')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-white font-semibold text-sm">{t('trend_analysis')}</p>
                      <p className="text-zinc-400 text-xs">{t('trend_analysis_desc')}</p>
                    </div>
                  </div>
                  <Checkbox
                    checked={selectedOptions.trendAnalysis}
                    onCheckedChange={() => toggleBooleanOption('trendAnalysis')}
                    className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="aiRemodeling" className="mt-3 space-y-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-primary flex items-center">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  {t('ai_remodel_tab')}
                </h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  {platformOptions.map((platform) => (
                    <Button
                      key={platform.id}
                      variant={selectedPlatform === platform.id ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "h-8 text-[10px] font-medium justify-start gap-1.5 transition-all",
                        selectedPlatform === platform.id
                          ? "bg-primary text-primary-foreground"
                          : "border-border opacity-50 grayscale bg-primary/10"
                      )}
                      onClick={() => handlePlatformChange(platform.id)}
                    >
                      {platform.icon}
                      {platform.label}
                    </Button>
                  ))}
                </div>
                <div className="space-y-2">
                  <label htmlFor="video-url" className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Link className="h-3 w-3" />
                    {getPlatformLabel()}
                  </label>
                  <Input
                    id="video-url"
                    placeholder={getPlatformPlaceholder()}
                    value={aiRemodeling.url}
                    onChange={(e) => setAiRemodeling(prev => ({ ...prev, url: e.target.value }))}
                    disabled={aiRemodeling.isLoading}
                    className="h-10 text-sm bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <Button
                  onClick={handleRemodel}
                  disabled={aiRemodeling.isLoading || !aiRemodeling.url.trim()}
                  className="w-full h-10 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/50"
                >
                  {aiRemodeling.isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('processing')}
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      {t('remodel_video_ai')}
                    </>
                  )}
                </Button>
                {aiRemodeling.result && (
                  <div className="mt-4 p-3 bg-secondary rounded-lg border border-primary/50 shadow-md shadow-primary/20 transition-all duration-500">
                    <h3 className="text-sm font-semibold mb-1.5 text-primary flex items-center">
                      <Sparkles className="h-3 w-3 mr-1.5" />
                      {t('remodel_result_title')}
                    </h3>
                    <p className="text-foreground whitespace-pre-wrap text-sm">
                      {aiRemodeling.result}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 w-full h-8 text-xs font-medium"
                      onClick={() => navigator.clipboard.writeText(aiRemodeling.result || "")}
                    >
                      {t('copy_result')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default VideoOptionsMenu;