import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Sparkles, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import type { Enquiry, Service, WebsiteSettings } from '../types';
import { api } from '../lib/api';

interface ContactPageProps {
  initialData?: Partial<Enquiry> | null;
  services: Service[];
  settings: WebsiteSettings;
  onClearInitialData?: () => void;
  onOpenAIModal?: () => void;
}

const BUSINESS_CATEGORIES = [
  'E-commerce',
  'Education',
  'Healthcare',
  'Fashion & Beauty',
  'Real Estate',
  'Restaurant & Cafe',
  'Personal Brand',
  'Startup',
  'B2B SaaS / Tech',
  'Professional Services',
  'Other'
];

const BUDGET_RANGES = [
  'Under $1,000 / month',
  '$1,000 – $3,000 / month',
  '$3,000 – $10,000 / month',
  '$10,000+ / month',
  'Custom Enterprise Project'
];

const GOAL_OPTIONS = [
  'Increase website traffic',
  'Generate leads',
  'Increase sales',
  'Improve brand awareness',
  'Build an online presence'
];

export const ContactPage: React.FC<ContactPageProps> = ({
  initialData,
  services,
  settings,
  onClearInitialData,
  onOpenAIModal
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    website: '',
    businessCategory: 'Startup',
    servicesInterestedIn: [] as string[],
    monthlyBudget: '$3,000 – $10,000 / month',
    businessGoals: [] as string[],
    projectDescription: '',
    preferredContactMethod: 'Email' as 'Email' | 'Phone' | 'WhatsApp'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    enquiryId: string;
    message: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync initialData if received from AI chatbot or Service Learn More
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        fullName: initialData.fullName || prev.fullName,
        businessName: initialData.businessName || prev.businessName,
        email: initialData.email || prev.email,
        phone: initialData.phone || prev.phone,
        website: initialData.website || prev.website,
        businessCategory: initialData.businessCategory || prev.businessCategory,
        servicesInterestedIn: initialData.servicesInterestedIn?.length ? initialData.servicesInterestedIn : prev.servicesInterestedIn,
        monthlyBudget: initialData.monthlyBudget || prev.monthlyBudget,
        businessGoals: initialData.businessGoals?.length ? initialData.businessGoals : prev.businessGoals,
        projectDescription: initialData.projectDescription || prev.projectDescription,
        preferredContactMethod: initialData.preferredContactMethod || prev.preferredContactMethod
      }));
    }
  }, [initialData]);

  const handleToggleService = (serviceName: string) => {
    setFormData(prev => {
      const exists = prev.servicesInterestedIn.includes(serviceName);
      if (exists) {
        return { ...prev, servicesInterestedIn: prev.servicesInterestedIn.filter(s => s !== serviceName) };
      } else {
        return { ...prev, servicesInterestedIn: [...prev.servicesInterestedIn, serviceName] };
      }
    });
  };

  const handleToggleGoal = (goal: string) => {
    setFormData(prev => {
      const exists = prev.businessGoals.includes(goal);
      if (exists) {
        return { ...prev, businessGoals: prev.businessGoals.filter(g => g !== goal) };
      } else {
        return { ...prev, businessGoals: [...prev.businessGoals, goal] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic validation
    if (!formData.fullName.trim() || !formData.businessName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMessage('Please complete all required fields (Full Name, Business Name, Email, and Phone Number).');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitEnquiry(formData);
      setSubmissionSuccess({
        enquiryId: res.enquiryId,
        message: res.message
      });
      // Clear form
      setFormData({
        fullName: '',
        businessName: '',
        email: '',
        phone: '',
        website: '',
        businessCategory: 'Startup',
        servicesInterestedIn: [],
        monthlyBudget: '$3,000 – $10,000 / month',
        businessGoals: [],
        projectDescription: '',
        preferredContactMethod: 'Email'
      });
      if (onClearInitialData) {
        onClearInitialData();
      }
      window.scrollTo({ top: 150, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while submitting your enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-radial-gradient">
      <div className="max-w-6xl mx-auto">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/70 text-indigo-300 border border-indigo-700/50 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AKSHORA Client Enquiry Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading tracking-tight mb-4">
            Let's Engineer Your Next Growth Milestone
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Tell us about your brand, commercial targets, and marketing challenges. Our AI strategy directors will conduct a full channel analysis and formulate a custom roadmap.
          </p>
        </div>

        {/* Success Banner */}
        {submissionSuccess && (
          <div className="mb-10 p-6 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 shadow-xl shadow-emerald-950/50 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-bold text-white">Enquiry Received Successfully!</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-900/90 text-emerald-200 border border-emerald-700">
                    ID: {submissionSuccess.enquiryId}
                  </span>
                </div>
                <p className="mt-2 text-sm text-emerald-200/90 leading-relaxed font-medium">
                  {submissionSuccess.message}
                </p>
                <div className="mt-4 pt-3 border-t border-emerald-800/40 flex flex-wrap items-center gap-4 text-xs text-emerald-300">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    Estimated Strategy Review: Within 24 Business Hours
                  </span>
                  <button
                    onClick={() => setSubmissionSuccess(null)}
                    className="ml-auto underline hover:text-white font-semibold"
                  >
                    Submit Another Requirement
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Agency Contact Card & Pre-fill Banner */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white font-heading mb-1">
                  Direct Agency Contact
                </h3>
                <p className="text-xs text-slate-400">
                  Prefer direct communication? Connect with our senior advisory desk.
                </p>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <Mail className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-slate-400">Email Address</div>
                    <a href={`mailto:${settings.contactEmail}`} className="text-slate-200 hover:text-white font-medium break-all">
                      {settings.contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <Phone className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-slate-400">Phone & Priority Desk</div>
                    <a href={`tel:${settings.contactPhone}`} className="text-slate-200 hover:text-white font-medium">
                      {settings.contactPhone}
                    </a>
                  </div>
                </div>

                {/* Instagram Channel Card */}
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-pink-950/40 via-purple-950/30 to-indigo-950/40 border border-pink-500/30 hover:border-pink-500/60 transition-all">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="text-xs font-bold text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                      <span>Official Instagram</span>
                    </div>
                    <span className="text-[10px] text-slate-400">@akshora.digital</span>
                  </div>
                  <p className="text-xs text-slate-300 mb-2.5">
                    Follow us for digital marketing case studies, algorithm updates, and creative reels.
                  </p>
                  <a
                    href={settings.socialLinks?.instagram || "https://www.instagram.com/akshora.digital/"}
                    target="_blank"
                    rel="noreferrer"
                    id="contact-instagram-btn"
                    className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-pink-600/20"
                  >
                    <span>Visit @akshora.digital</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                {settings.officeAddress ? (
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                    <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-slate-400">Agency Headquarters</div>
                      <div className="text-slate-200 font-medium">
                        {settings.officeAddress}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* AI Assistant Callout */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/70 to-blue-950/40 border border-indigo-700/50">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Not Sure What You Need?</span>
                </div>
                <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                  Run a 2-minute diagnostic with our AI Marketing Assistant to get an immediate channel recommendation and pre-fill this form!
                </p>
                {onOpenAIModal && (
                  <button
                    onClick={onOpenAIModal}
                    className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Launch AI Diagnostic</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Full Functional Enquiry Form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-10 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-8">
                {errorMessage && (
                  <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-600/50 text-rose-200 text-sm flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Section 1: Contact Information */}
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-800">
                    1. Contact & Business Identity
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        id="enquiry-fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Business Name *
                      </label>
                      <input
                        id="enquiry-businessName"
                        type="text"
                        required
                        value={formData.businessName}
                        onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                        placeholder="e.g. Acme Innovations"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Work Email Address *
                      </label>
                      <input
                        id="enquiry-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="sarah@acme.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        id="enquiry-phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Current Business Website or Social Profile (Optional)
                      </label>
                      <input
                        id="enquiry-website"
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                        placeholder="https://acme.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Business Category & Budget */}
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-800">
                    2. Industry Category & Planned Investment
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Business Category
                      </label>
                      <select
                        id="enquiry-category"
                        value={formData.businessCategory}
                        onChange={(e) => setFormData(prev => ({ ...prev, businessCategory: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      >
                        {BUSINESS_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Estimated Monthly Marketing Budget
                      </label>
                      <select
                        id="enquiry-budget"
                        value={formData.monthlyBudget}
                        onChange={(e) => setFormData(prev => ({ ...prev, monthlyBudget: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      >
                        {BUDGET_RANGES.map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 3: Services Interested In */}
                <div>
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      3. Services Interested In
                    </h3>
                    <span className="text-xs text-slate-400">Select one or multiple</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {services.map(service => {
                      const isSelected = formData.servicesInterestedIn.includes(service.name);
                      return (
                        <button
                          type="button"
                          key={service.id}
                          onClick={() => handleToggleService(service.name)}
                          className={`p-3 rounded-xl text-xs font-medium text-left transition-all border flex items-center justify-between ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm shadow-indigo-600/30'
                              : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-indigo-500/50 hover:text-white'
                          }`}
                        >
                          <span className="truncate pr-2">{service.name}</span>
                          <span className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                            isSelected ? 'bg-white text-indigo-600 border-white' : 'border-slate-700'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 4: Primary Business Goals */}
                <div>
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      4. Primary Growth Objectives
                    </h3>
                    <span className="text-xs text-slate-400">Select your key targets</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {GOAL_OPTIONS.map(goal => {
                      const isSelected = formData.businessGoals.includes(goal);
                      return (
                        <button
                          type="button"
                          key={goal}
                          onClick={() => handleToggleGoal(goal)}
                          className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all border ${
                            isSelected
                              ? 'bg-cyan-600 text-white border-cyan-400'
                              : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                          }`}
                        >
                          {isSelected ? `✓ ${goal}` : `+ ${goal}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 5: Project Description & Contact Preference */}
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-800">
                    5. Project Scope & Communication Preference
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Project Description & Specific Requirements
                      </label>
                      <textarea
                        id="enquiry-description"
                        rows={4}
                        value={formData.projectDescription}
                        onChange={(e) => setFormData(prev => ({ ...prev, projectDescription: e.target.value }))}
                        placeholder="Provide any details regarding your current advertising challenges, past campaign metrics, target market, or timeline expectations..."
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors leading-relaxed"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        Preferred Contact Method
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {(['Email', 'Phone', 'WhatsApp'] as const).map(method => (
                          <button
                            type="button"
                            key={method}
                            onClick={() => setFormData(prev => ({ ...prev, preferredContactMethod: method }))}
                            className={`py-2.5 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                              formData.preferredContactMethod === method
                                ? 'bg-indigo-600 text-white border-indigo-500'
                                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Action Button */}
                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Instant unique enquiry ID generation & priority queue</span>
                  </div>

                  <button
                    id="enquiry-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                        <span>Submitting Requirements...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Business Enquiry</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
