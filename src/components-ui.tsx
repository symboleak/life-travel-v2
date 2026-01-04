
import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle, ArrowUp, Star } from 'lucide-react';

// --- TOAST NOTIFICATIONS ---
export const ToastContainer = ({ toasts, removeToast }: any) => (
  <div className="fixed top-24 right-4 z-[90] flex flex-col gap-2 pointer-events-none">
    {toasts.map((t: any) => (
      <div key={t.id} className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-fade-in-up bg-white ${t.type === 'error' ? 'border-red-200 text-red-700' : 'border-green-200 text-green-700'}`}>
         {t.type === 'error' ? <AlertCircle className="h-5 w-5"/> : <Check className="h-5 w-5"/>}
         <p className="font-bold text-sm">{t.message}</p>
         <button onClick={() => removeToast(t.id)} className="ml-2 opacity-50 hover:opacity-100"><X className="h-4 w-4"/></button>
      </div>
    ))}
  </div>
);

// --- SCROLL TO TOP ---
export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrolled / height > 0.75) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <button onClick={scrollToTop} className="fixed bottom-24 right-4 z-40 bg-brand-dark/90 backdrop-blur text-white p-3 rounded-full shadow-xl hover:bg-black transition-all animate-fade-in-up md:bottom-8 border border-white/20">
      <ArrowUp className="h-5 w-5"/>
    </button>
  );
};

// --- STAR RATING ---
export const StarRating = ({ rating, size = "sm", onChange }: { rating: number, size?: "sm" | "md" | "lg", onChange?: (r: number) => void }) => {
    const stars = [];
    const iconSize = size === "lg" ? "h-6 w-6" : size === "md" ? "h-5 w-5" : "h-3 w-3";
    const isInteractive = !!onChange;

    for (let i = 1; i <= 5; i++) {
        stars.push(
            <Star 
                key={i} 
                onClick={() => isInteractive && onChange(i)}
                className={`${iconSize} ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 fill-gray-100'} ${isInteractive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`} 
            />
        );
    }
    return <div className="flex gap-0.5">{stars}</div>;
};
