import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: PWAInstallBanner
// PURPOSE: Detects the 'beforeinstallprompt' event and shows a native-like 
//          app install banner. Handles dismissal with localStorage caching.
// ─────────────────────────────────────────────────────────────────────────────

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if dismissed recently (7 days cooldown)
    const dismissedAt = localStorage.getItem('khidma_pwa_dismissed');
    if (dismissedAt) {
      const daysSinceDismissal = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissal < 7) return;
    }

    // Detect iOS for specific instructions
    const ua = window.navigator.userAgent;
    const isIOSDevice = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    // Detect if already installed / in standalone mode
    const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

    if (isIOSDevice && !isStandalone) {
      setIsIOS(true);
      setShowBanner(true);
    }

    // Standard PWA Install Prompt for Android/Chrome
    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI to notify the user they can add to home screen
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('khidma_pwa_dismissed', Date.now().toString());
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-[60] lg:hidden animate-slide-up">
      <div className="bg-[#0B1120] rounded-2xl p-4 shadow-[0_-8px_30px_rgba(8,18,37,0.2)] border border-white/10 flex items-center gap-4 text-white">
        
        {/* App Icon Mock */}
        <div className="w-12 h-12 bg-[#22C55E] rounded-2xl flex items-center justify-center font-extrabold text-xl text-white flex-shrink-0 shadow-inner">
          K
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate">Install Khidma App</p>
          {isIOS ? (
            <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
              Tap <span className="font-bold text-white">Share</span> then <span className="font-bold text-white">Add to Home Screen</span> for the native experience.
            </p>
          ) : (
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">For a faster, native experience.</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!isIOS && (
            <button
              onClick={handleInstallClick}
              className="w-8 h-8 rounded-full bg-[#22C55E] flex items-center justify-center text-white hover:bg-white/[0.03] transition-colors flex-shrink-0"
              aria-label="Install App"
            >
              <Download size={16} strokeWidth={2.5} />
            </button>
          )}
          
          <button
            onClick={handleDismiss}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-300 hover:bg-white/5 transition-colors flex-shrink-0"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
        
      </div>
    </div>
  );
}
