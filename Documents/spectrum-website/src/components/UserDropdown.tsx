'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  User, X, Settings, Heart, ShoppingBag, 
  LogOut, UserCircle, Mail, Phone, MapPin
} from 'lucide-react';
import Link from 'next/link';

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  } | null;
  onLogin: () => void;
  onLogout: () => void;
  isAdmin?: boolean;
}

export function UserDropdown({ 
  isOpen, 
  onClose, 
  isLoggedIn, 
  user, 
  onLogin, 
  onLogout,
  isAdmin = false
}: UserDropdownProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border z-50"
      >
        {isLoggedIn ? (
          <>
            {/* User Info Header */}
            <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {user?.name || 'User'}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* User Menu Items */}
            <div className="p-2">
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/profile">
                    <UserCircle className="h-4 w-4 mr-3" />
                    My Profile
                  </Link>
                </Button>
                
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/products" prefetch={false}>
                    <Heart className="h-4 w-4 mr-3" />
                    Explore Products
                  </Link>
                </Button>
                
                
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/settings">
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </Link>
                </Button>
                
                {isAdmin && (
                  <div className="border-t pt-2 mt-2">
                    <Button variant="ghost" className="w-full justify-start text-blue-600" asChild>
                      <Link href="/admin">
                        <Settings className="h-4 w-4 mr-3" />
                        Admin Panel
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="p-4 border-t bg-gray-50">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>support@spectrum.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+84 123 456 789</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>192 Nguyễn Văn Hưởng, Thảo Điền</span>
                </div>
              </div>
            </div>

            {/* Logout */}
            <div className="p-4 border-t">
              <Button 
                variant="outline" 
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
                onClick={onLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Login Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Account</h3>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Login Content */}
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                <User className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Welcome to Spectrum
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Sign in to access your wishlist and personalized recommendations.
              </p>
              
              <div className="space-y-3">
                <Button className="w-full" onClick={onLogin}>
                  Sign In
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    // For now, redirect to login - register functionality can be added later
                    onLogin();
                  }}
                >
                  Create Account
                </Button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="p-4 border-t bg-gray-50">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>support@spectrum.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+84 123 456 789</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>192 Nguyễn Văn Hưởng, Thảo Điền</span>
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
