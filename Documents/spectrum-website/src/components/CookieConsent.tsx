'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Cookie } from 'lucide-react';
import Link from 'next/link';

const COOKIE_CONSENT_KEY = 'cookie-consent';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setIsVisible(false);
  };

  const handleClose = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'dismissed');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-lg"
        >
          <div className="container mx-auto px-4 py-4 max-w-[1200px]">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Cookie className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-slate-700">
                    We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                    By clicking "Accept All", you consent to our use of cookies.{' '}
                    <Link href="/cookie-policy" className="text-emerald-600 hover:text-emerald-700 underline">
                      Learn more
                    </Link>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDecline}
                  className="text-sm"
                >
                  Decline
                </Button>
                <Button
                  size="sm"
                  onClick={handleAccept}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
                >
                  Accept All
                </Button>
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-4 w-4 text-slate-600" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

