"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Copy, Check, Loader2, ShieldCheck, CheckCircle2, Zap, Infinity, Star, RefreshCw, Users, CreditCard } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useLanguage } from "@/hooks/use-language";
import { showError } from "@/utils/toast";

interface AccountActivationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PixResponse {
  qrCode: string;
  qrcode: string;
  id: string;
}

const AccountActivationPopup: React.FC<AccountActivationPopupProps> = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [pixData, setPixData] = useState<PixResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(180);
  const [showQRCode, setShowQRCode] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showCreditCardForm, setShowCreditCardForm] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  const isEnglish = language === 'en';
  const pixValue = isEnglish ? 20.99 : 107.90;
  const originalPrice = isEnglish ? 99.99 : 499.90;
  const discountPercentage = Math.round(((originalPrice - pixValue) / originalPrice) * 100);

  const formatCurrency = (value: number) => {
    return value.toLocaleString(isEnglish ? "en-US" : "pt-BR", {
      style: "currency",
      currency: isEnglish ? "USD" : "BRL",
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const createPixPayment = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setShowCountdown(true);
      setCountdown(5);

      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setShowCountdown(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      if (!isEnglish) {
        const amountInCents = Math.round(pixValue * 100);
        const payload = {
          amount: amountInCents,
          items: [
            {
              title: "Account Activation - 1 Year",
              unitPrice: amountInCents,
              quantity: 1,
              tangible: false,
              externalRef: `ACTIVATION${Date.now()}`,
            },
          ],
          pix: {
            expiresInDays: 1,
          },
          paymentMethod: "PIX",
        };

        const response = await fetch(
          "https://oferta.segurocheckout.online/api/pix/payevo",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
          }
        );

        const data = await response.json();
        setPixData(data);
      }
    } catch (err) {
      setError(t('pix_error'));
    } finally {
      setLoading(false);
    }
  }, [t, language, pixValue, isEnglish]);

  useEffect(() => {
    if (showQRCode && !pixData && !loading && !isEnglish) {
      createPixPayment();
    }
  }, [showQRCode, pixData, loading, createPixPayment, isEnglish]);

  useEffect(() => {
    if (!showQRCode || loading || !pixData) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [showQRCode, loading, pixData]);

  const handleCopyPixCode = async () => {
    if (pixData?.qrcode) {
      await navigator.clipboard.writeText(pixData.qrcode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubscribeNow = () => {
    if (isEnglish) {
      setShowCreditCardForm(true);
    } else {
      setShowQRCode(true);
    }
  };

  const handleCardPayment = () => {
    if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiry || !cardDetails.cvv) {
      showError(isEnglish ? "Please fill in all card details." : "Por favor, preencha todos os detalhes do cartão.");
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowCreditCardForm(false);
      alert(isEnglish ? "Payment successful! Your account has been activated." : "Pagamento realizado com sucesso! Sua conta foi ativada.");
      onClose();
    }, 2000);
  };

  const benefits = [
    {
      icon: <Infinity className="w-5 h-5 text-red-500" />,
      title: t('unlimited_access_title'),
      description: t('unlimited_access_desc')
    },
    {
      icon: <Zap className="w-5 h-5 text-red-500" />,
      title: t('viral_videos_seconds_title'),
      description: t('viral_videos_seconds_desc')
    },
    {
      icon: <Star className="w-5 h-5 text-red-500" />,
      title: t('premium_functions_title'),
      description: t('premium_functions_desc')
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-red-500" />,
      title: t('updates_title'),
      description: t('updates_desc')
    },
    {
      icon: <Users className="w-5 h-5 text-red-500" />,
      title: t('exclusive_group_title'),
      description: t('exclusive_group_desc')
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[90%] sm:max-w-[400px] p-0 bg-zinc-950 border-2 border-red-600 rounded-3xl overflow-hidden outline-none">
        <VisuallyHidden.Root>
          <DialogTitle>{t('activate_premium_title')}</DialogTitle>
        </VisuallyHidden.Root>
        {!showQRCode && !showCreditCardForm ? (
          <div className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-10 h-10 text-red-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-white font-black text-lg uppercase tracking-tight">
                {t('activate_premium_title')}
              </h3>
              <p className="text-zinc-400 text-sm leading-snug">
                {t('activate_premium_subtitle')}
              </p>
            </div>
            <div className="w-full space-y-2">
              <div className="flex items-center justify-center gap-3">
                <span className="text-zinc-500 text-sm line-through">{formatCurrency(originalPrice)}</span>
                <span className="text-white font-black text-2xl">{formatCurrency(pixValue)}</span>
              </div>
              <div className="bg-green-600/20 text-green-400 text-xs font-bold px-2 py-1 rounded-full inline-block">
                {discountPercentage}% {t('discount_percentage')}
              </div>
            </div>
            <div className="w-full space-y-3 pt-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">
                {t('what_you_get')}
              </h4>
              <div className="space-y-2">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 p-2 bg-white/5 rounded-lg">
                    <div className="mt-1">{benefit.icon}</div>
                    <div className="text-left">
                      <p className="text-white font-semibold text-sm">{benefit.title}</p>
                      <p className="text-zinc-400 text-xs">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Button
              onClick={handleSubscribeNow}
              className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl gap-2 shadow-lg shadow-red-600/20"
            >
              <CheckCircle2 className="w-5 h-5" />
              {t('subscribe_now')}
            </Button>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
              {t('secure_pix_payment')}
            </p>
          </div>
        ) : showCreditCardForm ? (
          <div className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center">
              <CreditCard className="w-10 h-10 text-red-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-white font-black text-lg uppercase tracking-tight">
                {t('cc_payment_title')}
              </h3>
              <p className="text-zinc-400 text-sm">
                {t('cc_payment_subtitle')} {formatCurrency(pixValue)}
              </p>
            </div>
            <div className="w-full space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-zinc-400 uppercase font-bold block text-left">{t('cc_card_number')}</label>
                <Input
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.cardNumber}
                  onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                  className="h-11 bg-white/5 border-white/10 rounded-xl text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-zinc-400 uppercase font-bold block text-left">{t('cc_card_name')}</label>
                <Input
                  placeholder="John Doe"
                  value={cardDetails.cardName}
                  onChange={(e) => setCardDetails({...cardDetails, cardName: e.target.value})}
                  className="h-11 bg-white/5 border-white/10 rounded-xl text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 uppercase font-bold block text-left">{t('cc_expiry')}</label>
                  <Input
                    placeholder="12/25"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                    className="h-11 bg-white/5 border-white/10 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 uppercase font-bold block text-left">{t('cc_cvv')}</label>
                  <Input
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                    className="h-11 bg-white/5 border-white/10 rounded-xl text-sm"
                  />
                </div>
              </div>
              <Button
                onClick={handleCardPayment}
                disabled={loading}
                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl gap-2 shadow-lg shadow-red-600/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('processing')}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    {t('pay_now')}
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-10 h-10 text-red-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-white font-black text-lg uppercase tracking-tight">
                {t('account_needs_activation_title')}
              </h3>
              <p className="text-zinc-400 text-sm leading-snug">
                {t('account_needs_activation_desc')} {formatCurrency(pixValue)}.
              </p>
            </div>
            <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[220px]">
              {showCountdown ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-red-500" />
                  <p className="text-xs text-zinc-500 uppercase font-bold">
                    {t('generating_pix')}
                  </p>
                  <div className="text-2xl font-black text-red-500 mt-2">{countdown}</div>
                </div>
              ) : loading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-red-500" />
                  <p className="text-xs text-zinc-500 uppercase font-bold">
                    {t('generating_pix')}
                  </p>
                </div>
              ) : error ? (
                <div className="text-center space-y-3">
                  <p className="text-red-500 text-xs font-bold">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={createPixPayment}
                    className="border-red-500 text-red-500"
                  >
                    {t('try_again')}
                  </Button>
                </div>
              ) : pixData ? (
                <>
                  <h3 className="text-white font-black text-sm uppercase tracking-wider mb-2">
                    {t('activate_premium_title')}
                  </h3>
                  <div className="bg-white p-2 rounded-xl mb-3">
                    <QRCodeSVG value={pixData.qrcode} size={160} />
                  </div>
                  <p className="text-zinc-400 text-xs mb-1">
                    {isEnglish ? "Access your bank and pay via PIX" : "Acesse seu banco e pague via PIX"}
                  </p>
                  <p className="text-zinc-500 text-xs mb-2">
                    {isEnglish ? "Payee: Central de PGTO LTDA" : "Recebedora: Central de PGTO LTDA"}
                  </p>
                  <div className="flex items-center gap-2 text-yellow-500 text-xs font-bold">
                    <span>
                      {t('expires_in')} {formatTime(timeLeft)}
                    </span>
                  </div>
                </>
              ) : null}
            </div>
            {pixData && !showCountdown && (
              <Button
                onClick={handleCopyPixCode}
                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl gap-2 shadow-lg shadow-red-600/20"
              >
                {copied ? (
                  <><Check className="w-5 h-5" /> {t('copied')}</>
                ) : (
                  <><Copy className="w-5 h-5" /> {t('copy_pix_code')}</>
                )}
              </Button>
            )}
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
              {t('secure_pix_payment')}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AccountActivationPopup;