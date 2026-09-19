import React, { useState, useEffect, useCallback } from 'react';
import type { Service, FAQItem, WebsiteSettings, AdminUser, Enquiry } from './types';
import { api } from './lib/api';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AIChatBot } from './components/AIChatBot';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { Bot, Sparkles, Loader2 } from 'lucide-react';

export default function App() {
  // Navigation Routing State
  const [currentPage, setCurrentPage] = useState<'home' | 'services' | 'about' | 'contact' | 'admin'>('home');
  const [enquiryDraft, setEnquiryDraft] = useState<Partial<Enquiry> | null>(null);

  // AI Chatbot Modal / Drawer State
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  // Dynamic Data States
  const [services, setServices] = useState<Service[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings>({
    heroHeadline: 'Smarter Marketing. Stronger Brands. Powered by AI.',
    heroSubheading: 'AKSHORA helps businesses grow through intelligent digital marketing, creative branding, and AI-powered strategies.',
    heroIntro: 'We combine predictive marketing intelligence, high-velocity creative engineering, and seasoned agency execution to accelerate brand growth.',
    aboutText: 'AKSHORA is an AI-powered digital marketing and branding agency delivering predictable pipeline growth and enduring category dominance.',
    mission: 'To democratize hyper-intelligent digital marketing, empowering bold brands to scale through scientific AI workflows and human storytelling.',
    vision: 'To be the global benchmark for AI-empowered agency excellence, where every campaign is mathematically optimized for profit and emotionally crafted for longevity.',
    contactEmail: 'goyalakshita194@gmail.com',
    contactPhone: '+91 7877602560',
    officeAddress: '',
    workingHours: 'Mon - Sat: 9:00 AM - 7:00 PM IST',
    socialLinks: {
      linkedin: '',
      twitter: '',
      instagram: 'https://www.instagram.com/akshora.digital/',
      facebook: '',
      youtube: ''
    },
    featuredServiceIds: ['srv-performance', 'srv-seo', 'srv-creative', 'srv-cro']
  });
  const [isLoading, setIsLoading] = useState(true);

  // Admin Auth State
  const [adminToken, setAdminToken] = useState<string | null>(() => localStorage.getItem('akshora_admin_token'));
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('akshora_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Fetch application data
  const fetchData = useCallback(async () => {
    try {
      const [fetchedServices, fetchedFaqs, fetchedSettings] = await Promise.all([
        api.getServices(),
        api.getFaqs(),
        api.getSettings()
      ]);
      setServices(fetchedServices);
      setFaqs(fetchedFaqs);
      setSettings(fetchedSettings);
    } catch (err) {
      console.error('Failed to load initial AKSHORA data', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Scroll to top on navigation change
  const navigateTo = (page: string) => {
    setCurrentPage(page as any);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pre-select service from a card click and go directly to Enquiry form
  const handleSelectServiceForEnquiry = (serviceName: string) => {
    setEnquiryDraft({ servicesInterestedIn: [serviceName] });
    navigateTo('contact');
  };

  // Pre-fill enquiry from AI chatbot suggestion
  const handlePreFillEnquiryFromAI = (draft: Partial<Enquiry>) => {
    setEnquiryDraft(draft);
    setIsAIChatOpen(false);
    navigateTo('contact');
  };

  // Admin Auth Handlers
  const handleLoginSuccess = (token: string, user: AdminUser) => {
    setAdminToken(token);
    setAdminUser(user);
    localStorage.setItem('akshora_admin_token', token);
    localStorage.setItem('akshora_admin_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    if (adminToken) {
      api.logoutAdmin(adminToken).catch(console.error);
    }
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem('akshora_admin_token');
    localStorage.removeItem('akshora_admin_user');
    navigateTo('home');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080d1a] flex flex-col items-center justify-center text-slate-300 gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-950 border border-indigo-700/60 text-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-600/20">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <div className="text-sm font-semibold tracking-wider uppercase text-slate-400 font-heading">
          Connecting to AKSHORA Intelligence Engine...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Global Navigation Header */}
      <Navbar
        currentView={currentPage}
        onNavigate={navigateTo}
        onOpenAIModal={() => setIsAIChatOpen(true)}
        isAdminLoggedIn={!!adminUser}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            services={services.filter(s => s.isActive)}
            settings={settings}
            onNavigateToServices={() => navigateTo('services')}
            onNavigateToContact={() => navigateTo('contact')}
            onSelectServiceForEnquiry={handleSelectServiceForEnquiry}
            onOpenAIModal={() => setIsAIChatOpen(true)}
          />
        )}

        {currentPage === 'services' && (
          <ServicesPage
            services={services.filter(s => s.isActive)}
            onSelectServiceForEnquiry={handleSelectServiceForEnquiry}
            onOpenAIModal={() => setIsAIChatOpen(true)}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            settings={settings}
            onNavigateToServices={() => navigateTo('services')}
            onNavigateToContact={() => navigateTo('contact')}
            onOpenAIModal={() => setIsAIChatOpen(true)}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            services={services.filter(s => s.isActive)}
            settings={settings}
            initialData={enquiryDraft}
            onClearInitialData={() => setEnquiryDraft(null)}
            onOpenAIModal={() => setIsAIChatOpen(true)}
          />
        )}

        {currentPage === 'admin' && (
          <AdminDashboard
            adminUser={adminUser}
            adminToken={adminToken}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
            onRefreshData={fetchData}
            services={services}
            faqs={faqs}
            settings={settings}
          />
        )}
      </main>

      {/* Floating Action Button for AI Assistant (Visible across all customer pages) */}
      {currentPage !== 'admin' && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            id="floating-ai-assistant-btn"
            onClick={() => setIsAIChatOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-2xl shadow-indigo-600/50 hover:shadow-indigo-500/70 hover:scale-105 active:scale-95 transition-all"
            title="Chat with AKSHORA AI Assistant"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400"></span>
            </span>
            <Bot className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
            <span className="font-heading tracking-wide">Ask AKSHORA AI</span>
          </button>
        </div>
      )}

      {/* AI Chatbot Modal/Drawer */}
      <AIChatBot
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        onOpen={() => setIsAIChatOpen(true)}
        onNavigateToServices={() => {
          setIsAIChatOpen(false);
          navigateTo('services');
        }}
        onPreFillEnquiry={handlePreFillEnquiryFromAI}
      />

      {/* Global Footer */}
      <Footer
        settings={settings}
        onNavigate={navigateTo}
        onOpenAIModal={() => setIsAIChatOpen(true)}
      />
    </div>
  );
}
