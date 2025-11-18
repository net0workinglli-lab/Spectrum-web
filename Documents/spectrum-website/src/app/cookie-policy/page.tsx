'use client';

import { motion } from 'framer-motion';
import { Cookie, Shield, BarChart3, Settings } from 'lucide-react';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
              <Cookie className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Cookie Policy</h1>
            <p className="text-slate-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Content */}
          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">What Are Cookies?</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Cookies are small text files that are placed on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and 
                understanding how you use our site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">How We Use Cookies</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Sunny Auto EV Motors uses cookies to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>Remember your preferences and settings</li>
                <li>Analyze website traffic and user behavior</li>
                <li>Improve website functionality and user experience</li>
                <li>Provide personalized content and recommendations</li>
                <li>Ensure website security and prevent fraud</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Types of Cookies We Use</h2>
              
              <div className="space-y-6">
                {/* Essential Cookies */}
                <div className="border border-slate-200 rounded-lg p-6 bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="h-6 w-6 text-emerald-600" />
                    <h3 className="text-xl font-semibold text-slate-900">Essential Cookies</h3>
                  </div>
                  <p className="text-slate-700 mb-2">
                    These cookies are necessary for the website to function properly. They enable core 
                    functionality such as security, network management, and accessibility.
                  </p>
                  <p className="text-sm text-slate-600">
                    <strong>Duration:</strong> Session or up to 1 year
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="border border-slate-200 rounded-lg p-6 bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <BarChart3 className="h-6 w-6 text-emerald-600" />
                    <h3 className="text-xl font-semibold text-slate-900">Analytics Cookies</h3>
                  </div>
                  <p className="text-slate-700 mb-2">
                    These cookies help us understand how visitors interact with our website by collecting 
                    and reporting information anonymously. This helps us improve our website and services.
                  </p>
                  <p className="text-sm text-slate-600">
                    <strong>Duration:</strong> Up to 2 years
                  </p>
                </div>

                {/* Preference Cookies */}
                <div className="border border-slate-200 rounded-lg p-6 bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <Settings className="h-6 w-6 text-emerald-600" />
                    <h3 className="text-xl font-semibold text-slate-900">Preference Cookies</h3>
                  </div>
                  <p className="text-slate-700 mb-2">
                    These cookies remember your choices and preferences to provide a more personalized 
                    experience, such as language selection and region settings.
                  </p>
                  <p className="text-sm text-slate-600">
                    <strong>Duration:</strong> Up to 1 year
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Managing Cookies</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                You can control and manage cookies in various ways. Please keep in mind that removing 
                or blocking cookies may impact your user experience and parts of our website may no 
                longer be fully accessible.
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Browser Settings</h3>
                <p className="text-slate-700 mb-4">
                  Most browsers allow you to refuse or accept cookies. You can also delete cookies 
                  that have already been set. The methods for doing so vary from browser to browser:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                  <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                  <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                  <li><strong>Edge:</strong> Settings → Privacy, search, and services → Cookies and site permissions</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Third-Party Cookies</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                In addition to our own cookies, we may also use various third-party cookies to report 
                usage statistics of the website and deliver advertisements on and through the website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Updates to This Policy</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our practices 
                or for other operational, legal, or regulatory reasons. Please revisit this Cookie Policy 
                regularly to stay informed about our use of cookies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <p className="text-slate-900 font-semibold mb-2">Sunny Auto EV Motors</p>
                <p className="text-slate-700">Email: info@sunnyauto.com</p>
                <p className="text-slate-700">Phone: +84 (0) 123 456 789</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

