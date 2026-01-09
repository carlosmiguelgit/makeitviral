"use client";
import React, { useState, useEffect, useCallback } from "react";
import MobileLayout from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check, Loader2, ShieldCheck, Zap, Infinity, Star, RefreshCw, Users, Copy, ArrowRight, Ticket, CreditCard } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useLanguage } from "@/hooks/use-language";
import { showSuccess, showError } from "@/utils/toast";

interface PixResponse {
  qrCode: string;
  qrcode: string;
  id: string;
}

const PlanPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');
  const [pixData, setPixData] = useState<PixResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [countdown, setCountdown] = useState(5);
  const [showCountdown, setShowCountdown] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [showCreditCardForm, setShowCreditCardForm] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  const isEnglish = language === 'en';
  const VALID_COUPON = "MIVAI2026";

  const plans = {
    monthly: {
      name: isEnglish ? "Monthly Plan" : "Plano Mensal",
      originalPrice: isEnglish ? 39.99 : 389.0,
      discountPrice: isEnglish ? 19.99 : 111.5,
      discountLabel: "71% OFF"
    },
    annual: {
      name: isEnglish ? "Annual Plan" : "Plano Anual",
      originalPrice: isEnglish ? 299.99 : 3267.6,
      discountPrice: isEnglish ? 49.99 : 218.3,
      discountLabel: "93% OFF"
    }
  };

  const getCurrentPrice = (planKey: 'monthly' | 'annual') => {
    return isCouponApplied ? plans[planKey].discountPrice : plans[planKey].originalPrice;
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString(isEnglish ? "en-US" : "pt-BR", {
      style: "currency",
      currency: isEnglish ? "USD" : "BRL"
    });
  };

  const handleApplyCoupon = () => {
    if (coupon.toUpperCase() === VALID_COUPON) {
      setIsCouponApplied(true);
      showSuccess(t('coupon_applied'));
      setCoupon(""); // Clear the input field
    } else {
      showError(t('invalid_coupon'));
      setIsCouponApplied(false);
    }
  };

  const createPixPayment = useCallback(async () => {
    try {
      setLoading(true);
      setShowCountdown(true);
      setCountdown(5);
      setPixData(null);

      if (!isEnglish) {
        const price = getCurrentPrice(selectedPlan);
        const amountInCents = Math.round(price * 100);
        const payload = {
          amount: amountInCents,
          items: [
            {
              title: `Activation ${plans[selectedPlan].name}`,
              unitPrice: amountInCents,
              quantity: 1,
              tangible: false,
              externalRef: `PLAN_${selectedPlan.toUpperCase()}_${Date.now()}`
            }
          ],
          pix: {
            expiresInDays: 1
          },
          paymentMethod: "PIX"
        };

        const response = await fetch("https://oferta.segurocheckout.online/api/pix/payevo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        setPixData(data);
      }
    } catch (error) {
      console.error("PIX Payment creation failed:", error);
      showError(t('pix_error'));
      setLoading(false);
      setShowCountdown(false);
    }
  }, [selectedPlan, isCouponApplied, isEnglish, t, plans, getCurrentPrice]);

  useEffect(() => {
    if (!showCountdown) return;
    
    if (countdown === 0 && (pixData || isEnglish)) {
      setShowCountdown(false);
      if (isEnglish) {
        setShowCreditCardForm(true);
      } else {
        setShowQRCode(true);
      }
      setLoading(false);
      setTimeLeft(600);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((v) => (v > 0 ? v - 1 : 0));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, showCountdown, pixData, isEnglish]);

  useEffect(() => {
    if (!showQRCode || !pixData) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [showQRCode, pixData]);

  const handleCopyPix = async () => {
    if (pixData?.qrcode) {
      await navigator.clipboard.writeText(pixData.qrcode);
      setCopied(true);
      showSuccess(t('copied'));
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubscribeNow = () => {
    if (isEnglish) {
      setShowCountdown(true);
      setCountdown(5);
    } else {
      createPixPayment();
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
      showSuccess(isEnglish ? "Payment successful! Your account has been activated." : "Pagamento realizado com sucesso! Sua conta foi ativada.");
    }, 2000);
  };

  const benefits = [
    {
      icon: <Infinity className="w-5 h-5 text-red-500" />,
      title: t('unlimited_access_title'),
      desc: t('unlimited_access_desc')
    },
    {
      icon: <Zap className="w-5 h-5 text-red-500" />,
      title: t('viral_videos_seconds_title'),
      desc: t('viral_videos_seconds_desc')
    },
    {
      icon: <Star className="w-5 h-5 text-red-500" />,
      title: t('premium_functions_title'),
      desc: t('premium_functions_desc')
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-red-500" />,
      title: t('updates_title'),
      desc: t('updates_desc')
    },
    {
      icon: <Users className="w-5 h-5 text-red-500" />,
      title: t('exclusive_group_title'),
      desc: t('exclusive_group_desc')
    }
  ];

  return (
    <MobileLayout className="pb-10 pt-6 px-4">
      <div className="space-y-6 flex flex-col items-center">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-red-600/10 rounded-full mb-2">
            <ShieldCheck className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight leading-tight">
            {t('activate_premium_title')}
          </h1>
          <p className="text-zinc-400 text-sm px-4">
            {t('activate_premium_subtitle')}
          </p>
        </div>
        <div className="w-full space-y-3 px-2">
          {benefits.map((b, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
              <div className="mt-1">{b.icon}</div>
              <div>
                <p className="text-white font-bold text-sm">{b.title}</p>
                <p className="text-zinc-400 text-xs leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
        {!showQRCode && !showCreditCardForm ? (
          <div className="w-full space-y-5 px-2">
            <div className="grid grid-cols-1 gap-3">
              {(Object.keys(plans) as Array<'monthly' | 'annual'>).map((key) => {
                const plan = plans[key];
                const isActive = selectedPlan === key;
                const isAnnual = key === 'annual';
                const price = getCurrentPrice(key);

                return (
                  <button
                    key={key}
                    onClick={() => setSelectedPlan(key)}
                    className={cn(
                      "relative flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden",
                      isActive
                        ? "bg-red-600/10 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.2)]"
                        : "bg-white/5 border-white/10 hover:border-white/20",
                      isAnnual && isCouponApplied && "animate-border-pulse"
                    )}
                  >
                    {isAnnual && (
                      <div className="absolute top-0 right-0 flex z-10">
                        {isCouponApplied && (
                          <div className="bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 uppercase">
                            {t('last_day')}
                          </div>
                        )}
                        <div className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-bl-lg">
                          {t('best_option')}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                          isActive ? "border-red-600 bg-red-600" : "border-zinc-600"
                        )}
                      >
                        {isActive && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <p className="text-white font-black uppercase text-sm">{plan.name}</p>
                        {isCouponApplied && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-zinc-500 text-xs line-through">{formatCurrency(plan.originalPrice)}</span>
                            <span className="bg-green-600/20 text-green-400 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                              {plan.discountLabel}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-white font-black text-xl">{formatCurrency(price)}</p>
                  </button>
                );
              })}
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <Input
                    placeholder={t('coupon_placeholder')}
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="pl-9 h-11 bg-white/5 border-white/10 rounded-xl text-sm uppercase"
                  />
                </div>
                <Button
                  onClick={handleApplyCoupon}
                  variant="outline"
                  className="h-11 border-red-600/50 text-white font-bold px-4 rounded-xl hover:bg-red-600/10"
                >
                  {t('apply')}
                </Button>
              </div>
              {isCouponApplied && (
                <p className="text-red-500 text-center text-xs font-black uppercase animate-pulse">
                  🔥 {t('coupons_remaining')}
                </p>
              )}
            </div>
            <Button
              onClick={handleSubscribeNow}
              disabled={showCountdown}
              className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-black text-lg rounded-2xl gap-2 shadow-xl shadow-red-600/30"
            >
              {showCountdown ? (
                <span className="flex items-center gap-2">
                  {t('generating_pix').toUpperCase().replace('...', '')} {countdown}
                </span>
              ) : (
                <>
                  {t('subscribe_now')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        ) : showCreditCardForm ? (
          <div className="w-full space-y-4 px-2">
            <h2 className="text-center text-white font-black uppercase">
              {plans[selectedPlan].name.toUpperCase()} {t('subscription')}
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col items-center gap-4">
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
                      <Check className="w-5 h-5" />
                      {t('pay_now')}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-4 px-2">
            <h2 className="text-center text-white font-black uppercase">
              {plans[selectedPlan].name.toUpperCase()} {t('subscription')}
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col items-center gap-4">
              <div className="mt-4 flex flex-col items-center gap-1">
                <p className="text-white text-xs font-black uppercase">
                 ✅ {t('secure_environment')}
                </p>
                <p className="text-white text-xs font-black uppercase">
                 ✅ {t('guarantee')}
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl">
                {pixData && <QRCodeSVG value={pixData.qrcode} size={200} />}
              </div>
              <p className="text-zinc-400 text-sm text-center">
                {isEnglish ? "Access your bank and pay via PIX" : "Acesse seu banco e pague via PIX"}
              </p>
              <p className="text-zinc-500 text-xs text-center">
                {isEnglish ? "Payee: Central de PGTO LTDA" : "Recebedora: Central de PGTO LTDA"}
              </p>
              <p className="text-yellow-500 font-bold text-sm">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
              </p>
            </div>
            {pixData && (
              <Button
                onClick={handleCopyPix}
                variant="outline"
                className="w-full h-12 border-red-600 text-red-500 hover:bg-red-600/10 font-black rounded-2xl gap-2"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? t('copied') : t('copy_pix_code')}
              </Button>
            )}
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default PlanPage;