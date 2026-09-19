import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, CheckCircle2, ChevronRight, HelpCircle, X, Shield, ExternalLink } from 'lucide-react';
import type { Service } from '../types';
import { ServiceIcon } from '../components/ServiceIcon';

interface ServicesPageProps {
  services: Service[];
  onSelectServiceForEnquiry: (serviceName: string) => void;
  onOpenAIModal: () => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  services,
  onSelectServiceForEnquiry,
  onOpenAIModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeServiceModal, setActiveServiceModal] = useState<Service | null>(null);

  // Extract unique categories from dynamic services
  const categories = ['All', ...Array.from(new Set(services.map(s => s.category)))];

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.benefits.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-slate-950/60">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/70 text-indigo-300 border border-indigo-700/50 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AKSHORA Strategic Services Portfolio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading tracking-tight mb-4">
            Intelligent Marketing & Branding Solutions
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Every service is synchronized with our backend control center and optimized through proprietary AI targeting models, machine learning analysis, and seasoned creative strategy.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services, skills, benefits..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Dynamic Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800/80">
            <p className="text-slate-400 text-sm mb-3">No services found matching your filter criteria.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="text-xs px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(service => (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/60 border border-slate-800 hover:border-indigo-500/50 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-indigo-950/40 group relative overflow-hidden"
              >
                {/* Featured Badge */}
                {service.isFeatured && (
                  <div className="absolute top-4 right-4">
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-700/50">
                      Featured
                    </span>
                  </div>
                )}

                <div>
                  {/* Category and Icon */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 flex items-center justify-center group-hover:scale-110 group-hover:border-cyan-400/60 group-hover:text-cyan-300 transition-all">
                      <ServiceIcon name={service.icon} className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                        {service.category}
                      </span>
                      <h3 className="text-lg font-bold text-white font-heading group-hover:text-indigo-200 transition-colors">
                        {service.name}
                      </h3>
                    </div>
                  </div>

                  {/* Short Description */}
                  <p className="text-sm text-slate-300 leading-relaxed mb-5">
                    {service.shortDescription}
                  </p>

                  {/* Key Benefits List */}
                  <div className="space-y-2 mb-6">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Key Capabilities:
                    </div>
                    {service.benefits.slice(0, 3).map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{benefit}</span>
                      </div>
                    ))}
                    {service.benefits.length > 3 && (
                      <div className="text-[11px] text-cyan-400/90 font-medium pl-5">
                        + {service.benefits.length - 3} more strategic deliverables
                      </div>
                    )}
                  </div>
                </div>

                {/* Price & Action Buttons */}
                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-400">Starting Investment</span>
                    <span className="text-sm font-bold text-white font-mono">
                      {service.startingPrice || 'Custom Plan'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      id={`btn-learn-more-${service.id}`}
                      onClick={() => setActiveServiceModal(service)}
                      className="py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-all text-center border border-slate-700/60"
                    >
                      Learn More
                    </button>
                    <button
                      id={`btn-enquire-${service.id}`}
                      onClick={() => onSelectServiceForEnquiry(service.name)}
                      className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all text-center shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1"
                    >
                      <span>Enquire Now</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Assistant Help Banner */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-800/50 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-900/60 text-indigo-300 border border-indigo-700">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Not Sure Which Service Fits Your Business?</span>
            </div>
            <h3 className="text-xl font-bold text-white font-heading">
              Ask AKSHORA AI Assistant for an Instant Recommendation
            </h3>
            <p className="text-sm text-slate-400 max-w-xl">
              Our AI chatbot knows the complete benefits, optimal marketing channels, and pricing of each service. Ask any question or take a 2-minute diagnostic!
            </p>
          </div>
          <button
            onClick={onOpenAIModal}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all whitespace-nowrap flex items-center gap-2"
          >
            <span>Talk to AI Assistant</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Service Detailed Modal ("Learn More") */}
        {activeServiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0e1322] border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-950 border border-indigo-700/60 text-cyan-300 flex items-center justify-center">
                    <ServiceIcon name={activeServiceModal.icon} className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                      {activeServiceModal.category}
                    </span>
                    <h2 className="text-xl font-bold text-white font-heading">
                      {activeServiceModal.name}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setActiveServiceModal(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Detailed Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Strategic Scope & Execution Architecture
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {activeServiceModal.description || activeServiceModal.shortDescription}
                </p>
              </div>

              {/* Complete Benefits */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Key Deliverables & Commercial Benefits
                </h4>
                <div className="space-y-2">
                  {activeServiceModal.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-200 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service FAQs if available */}
              {activeServiceModal.faqs && activeServiceModal.faqs.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Frequently Asked Questions About This Service</span>
                  </h4>
                  <div className="space-y-2.5">
                    {activeServiceModal.faqs.map((faq, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <div className="text-xs font-bold text-indigo-300">
                          Q: {faq.question}
                        </div>
                        <div className="text-xs text-slate-400 leading-relaxed">
                          {faq.answer}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing & Footer Actions */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-400">Starting Price</div>
                  <div className="text-lg font-bold text-white font-mono">
                    {activeServiceModal.startingPrice}
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setActiveServiceModal(null)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      const serviceName = activeServiceModal.name;
                      setActiveServiceModal(null);
                      onSelectServiceForEnquiry(serviceName);
                    }}
                    className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5"
                  >
                    <span>Enquire For This Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
