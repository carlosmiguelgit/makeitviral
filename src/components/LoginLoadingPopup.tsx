"use client";

import React from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface LoginLoadingPopupProps {
  isOpen: boolean;
}

const LoginLoadingPopup: React.FC<LoginLoadingPopupProps> = ({ isOpen }) => {
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen}>
      <DialogContent 
        className="max-w-[260px] p-8 bg-zinc-950 border-[3px] border-red-600 rounded-2xl flex flex-col items-center justify-center gap-6 outline-none [&>button]:hidden shadow-none"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <VisuallyHidden.Root>
          <DialogTitle>Loading</DialogTitle>
        </VisuallyHidden.Root>
        
        <Loader2 className="h-14 w-14 text-red-500 animate-spin stroke-[4px]" />
        
        <p className="text-white text-sm font-black uppercase tracking-widest text-center leading-tight">
          {t('checking_credentials')}
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default LoginLoadingPopup;