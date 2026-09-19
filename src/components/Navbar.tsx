import React, { useState } from 'react';
import { Bot, Shield, Menu, X, ArrowRight, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAIModal: () => void;
  isAdminLoggedIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenAIModal,
  isAdminLoggedIn
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact & Enquiry' }
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0b0f19]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          id="nav-logo"
          onClick={() => handleLinkClick('home')}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
            <div className="w-full h-full bg-[#0d1222] rounded-[10px] flex items-center justify-center">
              <span className="font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                A
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-wider text-white font-heading">
                AKSHORA
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-700/50">
                AI Agency
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-tight">
              Intelligent Marketing & Branding
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80">
          {navLinks.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => handleLinkClick(link.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            id="nav-btn-ai-assistant"
            onClick={onOpenAIModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-indigo-900/60 to-blue-900/50 border border-indigo-500/40 text-indigo-200 text-sm font-semibold hover:border-indigo-400 hover:text-white transition-all shadow-sm group"
          >
            <Bot className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>Talk to AI Assistant</span>
          </button>

          <button
            id="nav-btn-admin-panel"
            onClick={() => handleLinkClick('admin')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold transition-all border shadow-sm ${
              currentView === 'admin'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-600/30'
                : isAdminLoggedIn
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/60 hover:bg-emerald-900/80'
                : 'bg-indigo-950/70 text-indigo-200 border-indigo-700/60 hover:bg-indigo-900 hover:text-white hover:border-indigo-500'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isAdminLoggedIn ? 'Backend: Admin Active' : 'Backend Login'}</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            id="nav-btn-ai-assistant-mobile"
            onClick={onOpenAIModal}
            className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-700/50 text-cyan-300"
            aria-label="Open AI Assistant"
          >
            <Bot className="w-5 h-5" />
          </button>
          <button
            id="nav-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0c101c] px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium ${
                currentView === link.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800/80'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <button
              onClick={() => {
                onOpenAIModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold"
            >
              <Bot className="w-4 h-4" />
              <span>Talk to AI Assistant</span>
            </button>
            <button
              onClick={() => handleLinkClick('admin')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-sm font-medium hover:text-white"
            >
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>{isAdminLoggedIn ? 'Backend: Admin Portal (Active)' : 'Backend Login (Admin Portal)'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
