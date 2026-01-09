"use client";

import React from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface LoginSuccessPopupProps {
  isOpen: boolean;
}

const LoginSuccessPopup: React.FC<LoginSuccessPopupProps> = ({ isOpen }) => {
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen}>
      <DialogContent 
        className="max-w-[260px] p-6 bg-zinc-950 border-[3px] border-green-500 rounded-2xl flex flex-col items-center justify-center gap-4 outline-none [&>button]:hidden shadow-none"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <VisuallyHidden.Root>
          <DialogTitle>Success</DialogTitle>
        </VisuallyHidden.Root>
        
        <CheckCircle2 className="h-12 w-12 text-green-500 stroke-[3px]" />
        
        <div className="text-center space-y-2 w-full">
          <h2 className="text-lg font-black text-white uppercase tracking-tight">
            {t('login_success')}
          </h2>
          <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 animate-[progress_2s_ease-in-out]" style={{ width: '100%' }}></div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginSuccessPopup;