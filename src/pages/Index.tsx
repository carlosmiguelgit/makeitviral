import MobileLayout from "@/components/MobileLayout";
import ViralVideoGenerator from "@/components/ViralVideoGenerator";
import VideoOptionsMenu from "@/components/VideoOptionsMenu";
import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";

const Index = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("niche");

  return (
    <MobileLayout className="h-full pb-2">
      <div className="flex flex-col flex-grow h-full">
        {/* Indicador de Plano Anual abaixo do logo */}
        <div className="text-center mt-1 mb-1">
          <p className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">
            {t('annual_plan_label')}
          </p>
        </div>
        
        <main className="flex-grow overflow-y-auto space-y-4 p-2">
          <ViralVideoGenerator />
          <VideoOptionsMenu onTabChange={setActiveTab} />
        </main>
      </div>
    </MobileLayout>
  );
};

export default Index;