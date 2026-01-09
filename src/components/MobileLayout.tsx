import React from "react";
import { cn } from "@/lib/utils";
import LanguageSelector from "./LanguageSelector";

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children, className }) => {
  return (
    <div 
      className="fixed inset-0 flex flex-col items-center bg-neutral-950 text-foreground dark overflow-auto"
      style={{ 
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url('https://images.unsplash.com/photo-1614850523296-d8c1af93d800?q=80&w=2070&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="flex-grow flex items-center justify-center w-full p-4">
        <div 
          className={cn(
            "w-full max-w-md bg-card/80 backdrop-blur-xl flex flex-col relative overflow-hidden",
            "sm:shadow-[0_0_50px_rgba(255,0,0,0.3)] sm:rounded-3xl sm:border-[3px] sm:border-primary",
            "border-2 border-red-500 rounded-3xl",
            "min-h-fit",
            className
          )}
        >
          {/* Badge Claude Sonnet 4.5 */}
          <div className="absolute top-2 left-2 z-50">
            <div className="bg-gray-800/80 backdrop-blur-sm text-gray-300 px-2 py-1 rounded text-[10px] font-medium">
              Veo 3.1 + Sora 2
            </div>
          </div>
          
          <LanguageSelector />
          {children}
        </div>
      </div>
    </div>
  );
};

export default MobileLayout;