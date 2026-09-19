import React from 'react';
import { Bot, ArrowRight, Sparkles, CheckCircle2, TrendingUp, Target, Zap, Shield, ChevronRight, Award, BarChart3, Layers } from 'lucide-react';
import type { Service, WebsiteSettings } from '../types';
import { ServiceIcon } from '../components/ServiceIcon';

interface HomePageProps {
  services: Service[];
  settings: WebsiteSettings;
  onNavigateToServices: () => void;
  onNavigateToContact: () => void;
  onSelectServiceForEnquiry: (serviceName: string) => void;
  onOpenAIModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  services,
  settings,
  onNavigateToServices,
  onNavigateToContact,
  onSelectServiceForEnquiry,
  onOpenAIModal
}) => {
  // Featured services
  const featuredServices = services.filter(s => s.isFeatured || (settings.featuredServiceIds && settings.featuredServiceIds.includes(s.id))).slice(0, 4);
  const displayFeatured = featuredServices.length > 0 ? featuredServices : services.slice(0, 4);

  const steps = [
    {
      num: '01',
      title: 'AI Audit & Commercial Diagnosis',
      desc: 'We analyze your market position, competitor keywords, audience cohorts, and conversion funnel friction using predictive algorithms.'
    },
    {
      num: '02',
      title: 'Custom Multi-Channel Growth Blueprint',
      desc: 'Our senior strategists formulate high-yield campaigns targeting positive unit economics, blend-rate ROAS, and compounding search authority.'
    },
    {
      num: '03',
      title: 'High-Velocity Creative & Ad Execution',
      desc: 'We deploy conversion-engineered landing pages, dynamic ad creatives, and high-deliverability email journeys at 4x the speed of traditional agencies.'
    },
    {
      num: '04',
      title: 'Continuous Algorithmic Optimization',
      desc: 'Daily budget re-allocations, A/B creative testing, and weekly strategic check-ins guarantee your acquisition cost drops as volume scales.'
    }
  ];

  const whyChoosePoints = [
    {
      icon: Target,
      title: 'Precision AI Audience Modeling',
      desc: 'We tap into first-party data and machine learning signals to identify active buyer intent before competitors do.'
    },
    {
      icon: TrendingUp,
      title: 'Real-Time ROAS Optimization',
      desc: 'No waiting 90 days for results. Our programmatic bidding engines shift budgets to top-performing ads in real time.'
    },
    {
      icon: Sparkles,
      title: 'Bespoke Creative Branding',
      desc: 'Stand out from generic template ads. We design distinctive brand aesthetics, typography, and viral hooks that capture attention.'
    },
    {
      icon: Layers,
      title: 'Full Database Transparency',
      desc: 'Direct access to your performance metrics, lead logs, and campaign assets with transparent reporting 24/7.'
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Glow background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-blue-600/15 to-cyan-500/10 blur-[130px] rounded-full pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-950/80 to-blue-950/80 border border-indigo-500/40 text-cyan-300 shadow-lg shadow-indigo-950/50 animate-in fade-in duration-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            <span>AKSHORA Digital Marketing & Branding Agency</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-heading leading-[1.1]">
            {settings.heroHeadline || 'Smarter Marketing. Stronger Brands. Powered by AI.'}
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            {settings.heroSubheading || 'AKSHORA helps businesses grow through intelligent digital marketing, creative branding, and AI-powered strategies.'}
          </p>

          {/* Agency Intro snippet */}
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {settings.heroIntro || 'We combine predictive marketing intelligence, high-velocity creative engineering, and seasoned agency execution to accelerate brand growth, minimize acquisition costs, and maximize revenue.'}
          </p>

          {/* Hero CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="hero-explore-services-btn"
              onClick={onNavigateToServices}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Our Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-talk-ai-btn"
              onClick={onOpenAIModal}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700/80 hover:border-cyan-400/50 shadow-md transition-all flex items-center justify-center gap-2.5 group"
            >
              <Bot className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              <span>Talk to Our AI Assistant</span>
            </button>
          </div>

          {/* Real-time Metrics / Social Proof */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-center border-t border-slate-800/80">
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
                3.8x
              </div>
              <div className="text-xs text-slate-400 mt-1">Average Client ROAS</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
                98.4%
              </div>
              <div className="text-xs text-slate-400 mt-1">Retention Rate</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
                24/7
              </div>
              <div className="text-xs text-slate-400 mt-1">AI Campaign Tuning</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
                $12M+
              </div>
              <div className="text-xs text-slate-400 mt-1">Ad Spend Managed</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED SERVICES SECTION (Dynamically Pulled from DB) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
              Performance & Branding Capabilities
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
              Featured Digital Marketing Services
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              Engineered with algorithmic precision and bespoke creative hooks to generate predictable pipeline and brand authority.
            </p>
          </div>
          <button
            onClick={onNavigateToServices}
            className="flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors whitespace-nowrap"
          >
            <span>View All {services.length} Services</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayFeatured.map(service => (
            <div
              key={service.id}
              className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 p-6 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-indigo-950/40 group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:text-cyan-300 transition-all">
                  <ServiceIcon name={service.icon} className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                  {service.category}
                </span>
                <h3 className="text-base font-bold text-white font-heading mt-1 mb-2 group-hover:text-indigo-200 transition-colors">
                  {service.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                  {service.shortDescription}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-slate-400">Starting from</span>
                  <span className="font-bold text-white font-mono">{service.startingPrice}</span>
                </div>
                <button
                  onClick={() => onSelectServiceForEnquiry(service.name)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-1"
                >
                  <span>Enquire Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. WHY CHOOSE AKSHORA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-slate-900/90 via-[#0c1122] to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Strategic Competitive Advantage
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
              Why Forward-Thinking Brands Choose AKSHORA
            </h2>
            <p className="text-sm text-slate-300">
              We eliminate traditional agency bloat and replace guesswork with mathematical precision and compelling brand craft.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChoosePoints.map((point, idx) => {
              const IconComp = point.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-indigo-500/40 transition-all space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-950/80 text-cyan-300 flex items-center justify-center">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white font-heading">{point.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{point.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            Our 4-Phase Growth Framework
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
            How It Works
          </h2>
          <p className="text-sm text-slate-400">
            From preliminary AI channel audit to multi-tier conversion scaling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 font-mono">
                {step.num}
              </div>
              <h3 className="text-base font-bold text-white font-heading">{step.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CLIENT ENQUIRY CALL-TO-ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950 border border-indigo-700/50 shadow-2xl overflow-hidden text-center sm:text-left flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-900/60 text-indigo-300 border border-indigo-700">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ready for Measurable Growth?</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
              Request Your Tailored AI Marketing Proposal
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Submit your business goals, target audience, and planned ad spend. Our strategy directors will prepare a detailed commercial audit within 24 hours.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={onOpenAIModal}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Ask AI Assistant First</span>
            </button>
            <button
              id="cta-submit-enquiry-btn"
              onClick={onNavigateToContact}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>Submit Client Enquiry</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
