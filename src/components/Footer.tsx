import React from 'react';
import { Mail, Phone, MapPin, Clock, ArrowUpRight, Shield, Heart } from 'lucide-react';
import type { WebsiteSettings } from '../types';

interface FooterProps {
  settings: WebsiteSettings;
  onNavigate: (view: string) => void;
  onOpenAIModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigate,
  onOpenAIModal
}) => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#070b14] text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1.5px]">
                <div className="w-full h-full bg-[#0d1222] rounded-[10px] flex items-center justify-center font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  A
                </div>
              </div>
              <span className="text-xl font-extrabold text-white font-heading tracking-wider">
                AKSHORA
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              {settings.heroSubheading || 'Intelligent digital marketing, creative branding, and AI-powered performance strategies engineered for high-growth modern brands.'}
            </p>
            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                AI Core Online & Operational
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Agency Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => { onNavigate('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  All Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  About AKSHORA
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Client Enquiry Form
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAIModal}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition-colors"
                >
                  <span>Talk to AI Assistant</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Contact & Support
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-white transition-colors break-all">
                  {settings.contactEmail}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <a href={`tel:${settings.contactPhone}`} className="hover:text-white transition-colors">
                  {settings.contactPhone}
                </a>
              </li>
              {settings.officeAddress ? (
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{settings.officeAddress}</span>
                </li>
              ) : null}
              <li className="flex items-center gap-2.5 text-xs text-slate-400">
                <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{settings.workingHours}</span>
              </li>
            </ul>
          </div>

          {/* Social Links & Portal */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Social & Portal
            </h3>
            <div className="flex flex-col gap-2.5 text-sm">
              <a
                href={settings.socialLinks?.instagram || "https://www.instagram.com/akshora.digital/"}
                target="_blank"
                rel="noreferrer"
                id="footer-instagram-link"
                className="p-2.5 rounded-xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-pink-500/20 hover:border-pink-500/50 text-slate-200 hover:text-white flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    IG
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">Instagram</div>
                    <div className="text-[11px] text-slate-400 group-hover:text-pink-300 transition-colors">@akshora.digital</div>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-pink-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            <div className="pt-2">
              <button
                id="footer-admin-link"
                onClick={() => { onNavigate('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all"
              >
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <span>Agency Staff Admin Portal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AKSHORA. All rights reserved. Powered by AI Marketing & Creative Automation.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security & Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
