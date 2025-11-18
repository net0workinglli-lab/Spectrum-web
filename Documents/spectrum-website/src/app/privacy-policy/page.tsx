'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Mail, Phone, MapPin } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
              <Shield className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
            <p className="text-slate-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Content */}
          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Introduction</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                At Sunny Auto EV Motors ("we," "our," or "us"), we are committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when 
                you visit our website and use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Information We Collect</h2>
              
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="border border-slate-200 rounded-lg p-6 bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="h-6 w-6 text-emerald-600" />
                    <h3 className="text-xl font-semibold text-slate-900">Personal Information</h3>
                  </div>
                  <p className="text-slate-700 mb-3">
                    We may collect personal information that you voluntarily provide to us when you:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-slate-700">
                    <li>Register for an account</li>
                    <li>Make a purchase or inquiry</li>
                    <li>Subscribe to our newsletter</li>
                    <li>Contact us for customer support</li>
                    <li>Participate in surveys or promotions</li>
                  </ul>
                  <p className="text-slate-700 mt-3">
                    This may include: name, email address, phone number, mailing address, payment information, 
                    and vehicle preferences.
                  </p>
                </div>

                {/* Automatically Collected Information */}
                <div className="border border-slate-200 rounded-lg p-6 bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <Eye className="h-6 w-6 text-emerald-600" />
                    <h3 className="text-xl font-semibold text-slate-900">Automatically Collected Information</h3>
                  </div>
                  <p className="text-slate-700 mb-3">
                    When you visit our website, we automatically collect certain information about your device, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-slate-700">
                    <li>IP address</li>
                    <li>Browser type and version</li>
                    <li>Operating system</li>
                    <li>Pages visited and time spent on pages</li>
                    <li>Referring website addresses</li>
                    <li>Device identifiers</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">How We Use Your Information</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                <li>To process and fulfill your orders and requests</li>
                <li>To communicate with you about your account, orders, and inquiries</li>
                <li>To send you marketing communications (with your consent)</li>
                <li>To improve our website, products, and services</li>
                <li>To analyze website usage and trends</li>
                <li>To prevent fraud and ensure security</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Information Sharing and Disclosure</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We do not sell your personal information. We may share your information in the following circumstances:
              </p>
              
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <ul className="list-disc pl-6 space-y-3 text-slate-700">
                  <li>
                    <strong>Service Providers:</strong> We may share information with third-party service providers 
                    who perform services on our behalf, such as payment processing, shipping, and data analytics.
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, 
                    your information may be transferred to the acquiring entity.
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> We may disclose your information if required by law or 
                    in response to valid requests by public authorities.
                  </li>
                  <li>
                    <strong>With Your Consent:</strong> We may share your information with your explicit consent 
                    or at your direction.
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Security</h2>
              <div className="flex items-center gap-3 mb-4">
                <Lock className="h-6 w-6 text-emerald-600" />
                <p className="text-slate-700 leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal 
                  information against unauthorized access, alteration, disclosure, or destruction. However, no 
                  method of transmission over the Internet or electronic storage is 100% secure.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Rights</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Objection:</strong> Object to processing of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Withdrawal:</strong> Withdraw consent where processing is based on consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Retention</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in 
                this Privacy Policy, unless a longer retention period is required or permitted by law. When we no 
                longer need your information, we will securely delete or anonymize it.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Children's Privacy</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Our services are not directed to individuals under the age of 18. We do not knowingly collect 
                personal information from children. If you believe we have collected information from a child, 
                please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to This Privacy Policy</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review 
                this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, 
                please contact us:
              </p>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-slate-900 font-semibold mb-1">Sunny Auto EV Motors</p>
                    <p className="text-slate-700">123 Electric Avenue</p>
                    <p className="text-slate-700">Ho Chi Minh City, Vietnam</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="h-5 w-5 text-emerald-600" />
                  <p className="text-slate-700">Email: privacy@sunnyauto.com</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-emerald-600" />
                  <p className="text-slate-700">Phone: +84 (0) 123 456 789</p>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

