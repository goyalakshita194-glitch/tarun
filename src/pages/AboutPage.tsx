import React from 'react';
import { Sparkles, Brain, Cpu, Target, Zap, Shield, CheckCircle2, TrendingUp, Users, ArrowRight } from 'lucide-react';
import type { WebsiteSettings } from '../types';

interface AboutPageProps {
  settings: WebsiteSettings;
  onNavigateToServices: () => void;
  onNavigateToContact: () => void;
  onOpenAIModal: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  settings,
  onNavigateToServices,
  onNavigateToContact,
  onOpenAIModal
}) => {
  const pillars = [
    {
      icon: Brain,
      title: 'Predictive Audience Intelligence',
      description: 'We replace subjective assumptions with deep machine learning models that analyze buyer intent patterns, competitor ad saturation, and real-time conversion elasticity.'
    },
    {
      icon: Cpu,
      title: 'High-Velocity Creative Engineering',
      description: 'Our creative studio pairs veteran art directors with custom AI generation pipelines to produce 10x more high-converting hooks, visual assets, and ad variations every week.'
    },
    {
      icon: TrendingUp,
      title: 'Real-Time ROAS Algorithmic Bidding',
      description: 'Dynamic budget allocation scripts redirect advertising spend instantaneously into the highest-yielding ad sets, minimizing customer acquisition cost (CAC).'
    }
  ];

  const reasonsToChooseUs = [
    {
      title: 'Full Database & AI Transparency',
      desc: 'No black-box secrecy. Clients receive real-time visibility into campaign metrics, creative variants, and algorithmic performance 24/7.'
    },
    {
      title: 'Human-AI Synergy',
      desc: 'AI handles data harvesting and asset scaling; senior agency strategists formulate brand psychology, positioning, and enterprise narrative.'
    },
    {
      title: 'Tailored Unit Economics',
      desc: 'Every strategy is calibrated to your lifetime customer value (LTV), margin structure, and payback windows rather than arbitrary vanity clicks.'
    },
    {
      title: 'Agile 30-Day Commitments',
      desc: 'We retain clients based on measurable revenue generation and ROAS, not restrictive multi-year lock-in contracts.'
    }
  ];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-radial-gradient">
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-950/70 text-indigo-300 border border-indigo-700/50 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>The AKSHORA Standard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading tracking-tight mb-5">
            Smarter Growth Architecture for Ambitious Brands
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            {settings.aboutText || 'AKSHORA is a next-generation digital marketing and branding powerhouse combining proprietary AI-driven marketing workflows with world-class creative directors.'}
          </p>
        </div>

        {/* Mission & Vision Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-800/40 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-5">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-heading mb-3">
              Our Mission
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {settings.mission || 'To democratize hyper-intelligent digital marketing, empowering bold brands to dominate their categories through scientific AI workflows and unforgettable human storytelling.'}
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-800/40 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center mb-5">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-heading mb-3">
              Our Vision
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {settings.vision || 'To be the global benchmark for AI-empowered agency excellence, where every campaign is mathematically optimized for profit and emotionally crafted for longevity.'}
            </p>
          </div>
        </div>

        {/* Our Approach: 3 Pillars */}
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              Our Approach to AI-Powered Marketing
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              How AKSHORA combines predictive computational models with high-touch human branding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-950 border border-indigo-700/60 text-cyan-400 flex items-center justify-center">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white font-heading">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why Businesses Choose Us */}
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              The Agency Difference
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              Why High-Growth Businesses Partner With AKSHORA
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            {reasonsToChooseUs.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">{reason.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{reason.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Action CTA */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-300 text-center sm:text-left">
              Ready to evaluate how AI strategies can scale your marketing return?
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenAIModal}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-all"
              >
                Talk to AI Assistant
              </button>
              <button
                onClick={onNavigateToContact}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
              >
                <span>Submit Requirements</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
