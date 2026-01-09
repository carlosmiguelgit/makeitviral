"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sparkles } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import LoginLoadingPopup from "@/components/LoginLoadingPopup";
import LoginSuccessPopup from "@/components/LoginSuccessPopup";

const loginSchema = z.object({
  email: z.string().email("Invalid email."),
  password: z.string().min(3, "Password must be at least 3 characters."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const success = await login(data.email, data.password);
      if (success) {
        // Successful login (ellindero@gmail.com)
        setTimeout(() => {
          setIsLoading(false);
          setShowSuccess(true);
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }, 2500);
      } else {
        // Failed login (any other credentials) -> Go to Plans
        setTimeout(() => {
          setIsLoading(false);
          navigate('/plan');
        }, 2500);
      }
    } catch (error) {
      setIsLoading(false);
      form.setError("root", {
        type: "manual",
        message: t('invalid_credentials'),
      });
    }
  };

  return (
    <MobileLayout className="justify-center px-6 pb-2">
      <LoginLoadingPopup isOpen={isLoading} />
      <LoginSuccessPopup isOpen={showSuccess} />
      <div className="w-full py-3 space-y-3 flex flex-col flex-grow">
        <div className="flex justify-center py-4 mt-12">
          <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
            M<span className="text-red-600">A</span>KEITV<span className="text-red-600">I</span>RAL
          </h1>
        </div>
        <div className="space-y-3">
          <div className="text-center">
            <h2 className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-bold">
              {t('login_title')}
            </h2>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-[11px] font-black text-primary ml-1 tracking-widest">{t('email_label')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        {...field}
                        className="h-11 bg-white/5 border-white/10 focus-visible:ring-primary/50 text-base rounded-xl"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-[11px] font-black text-primary ml-1 tracking-widest">{t('password_label')}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder=""
                        {...field}
                        className="h-11 bg-white/5 border-white/10 focus-visible:ring-primary/50 text-base rounded-xl"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              {form.formState.errors.root && (
                <div className="text-red-500 text-xs text-center">
                  {form.formState.errors.root.message}
                </div>
              )}
              <div className="space-y-3 pt-1">
                <Button
                  type="submit"
                  className="w-full h-11 text-sm font-black bg-primary text-white hover:opacity-90 transition-all shadow-xl shadow-primary/40 group rounded-xl"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 group-hover:animate-pulse" />
                    {t('login_button')}
                  </div>
                </Button>
                <div className="text-center space-y-2">
                  <button
                    type="button"
                    className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
                    onClick={() => console.log("Forgot password clicked")}
                  >
                    {t('forgot_password')}
                  </button>
                  <p className="text-[8px] text-muted-foreground/80 font-medium">
                    makeitviral.vercel.app @ 2026. ALL RIGHTS RESERVED
                  </p>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </MobileLayout>
  );
};

export default LoginPage;