import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, ArrowRight, RefreshCw, CheckCircle2, ChevronRight, MessageSquare, Briefcase, HelpCircle } from 'lucide-react';
import type { Service, FAQItem, Enquiry, ChatMessage } from '../types';
import { api } from '../lib/api';

interface AIChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onNavigateToServices: () => void;
  onPreFillEnquiry: (draft: Partial<Enquiry>) => void;
}

const BUSINESS_TYPES = [
  'E-commerce',
  'Education',
  'Healthcare',
  'Fashion & Beauty',
  'Real Estate',
  'Restaurant & Cafe',
  'Personal Brand',
  'Startup',
  'Other'
];

const SERVICE_OPTIONS = [
  'SEO',
  'Social Media Marketing',
  'Meta Ads',
  'Google Ads',
  'Website Development',
  'Branding & Logo Design',
  'Content Creation',
  'Not Sure – Need Suggestions'
];

const GOALS = [
  'Increase website traffic',
  'Generate leads',
  'Increase sales',
  'Improve brand awareness',
  'Build an online presence'
];

export const AIChatBot: React.FC<AIChatBotProps> = ({
  isOpen,
  onClose,
  onOpen,
  onNavigateToServices,
  onPreFillEnquiry
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hi! Welcome to AKSHORA. I'm your AI Marketing Assistant. 🤖 How can I help you grow your business today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        { label: '🚀 Start 5-Step Business Audit', action: 'start_guided' },
        { label: '🔍 Explore Services & Pricing', action: 'services_pricing' },
        { label: '💡 Recommend Best Strategy', action: 'ask_recommendation' }
      ]
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'guided'>('chat');

  // Guided Conversation State (5-Step Assessment)
  const [guidedStep, setGuidedStep] = useState<number>(1);
  const [guidedData, setGuidedData] = useState<{
    businessName: string;
    businessType: string;
    serviceNeeded: string;
    primaryGoal: string;
  }>({
    businessName: '',
    businessType: '',
    serviceNeeded: '',
    primaryGoal: ''
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, activeTab]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      const response = await api.sendChatMessage({
        message: text,
        contextState: guidedData.businessName ? guidedData : undefined
      });

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: response.suggestedActions,
        isEnquiryTrigger: response.isEnquiryTrigger,
        enquiryDraft: {
          businessName: guidedData.businessName || '',
          businessCategory: guidedData.businessType || 'General',
          servicesInterestedIn: guidedData.serviceNeeded ? [guidedData.serviceNeeded] : [],
          businessGoals: guidedData.primaryGoal ? [guidedData.primaryGoal] : []
        }
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: "I'm currently connected directly to AKSHORA's live database. Would you like to view our services or submit an enquiry directly to our team?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          { label: 'View Services', action: 'navigate_services' },
          { label: 'Submit Enquiry', action: 'open_enquiry_form' }
        ]
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: string, value?: string) => {
    if (action === 'open_enquiry_form') {
      onPreFillEnquiry({
        businessName: guidedData.businessName,
        businessCategory: guidedData.businessType || 'General',
        servicesInterestedIn: guidedData.serviceNeeded ? [guidedData.serviceNeeded] : (value ? [value] : []),
        businessGoals: guidedData.primaryGoal ? [guidedData.primaryGoal] : []
      });
      onClose();
    } else if (action === 'navigate_services') {
      onNavigateToServices();
      onClose();
    } else if (action === 'enquire_service') {
      onPreFillEnquiry({
        businessName: guidedData.businessName,
        servicesInterestedIn: value ? [value] : []
      });
      onClose();
    } else if (action === 'start_guided') {
      setActiveTab('guided');
    } else if (action === 'services_pricing') {
      handleSendMessage('Can you break down AKSHORA services and starting prices?');
    } else if (action === 'ask_recommendation') {
      handleSendMessage('Can you help me figure out the best digital marketing channels for my business?');
    } else if (value) {
      handleSendMessage(value);
    }
  };

  // Guided Flow Step Handlers
  const handleGuidedSubmitStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guidedData.businessName.trim()) return;
    setGuidedStep(2);
  };

  const handleGuidedSelectStep2 = (type: string) => {
    setGuidedData(prev => ({ ...prev, businessType: type }));
    setGuidedStep(3);
  };

  const handleGuidedSelectStep3 = (service: string) => {
    setGuidedData(prev => ({ ...prev, serviceNeeded: service }));
    setGuidedStep(4);
  };

  const handleGuidedSelectStep4 = (goal: string) => {
    setGuidedData(prev => ({ ...prev, primaryGoal: goal }));
    setGuidedStep(5);
  };

  const handleGuidedFinish = () => {
    // Transfer to main enquiry form with all fields populated!
    onPreFillEnquiry({
      businessName: guidedData.businessName,
      businessCategory: guidedData.businessType,
      servicesInterestedIn: guidedData.serviceNeeded && guidedData.serviceNeeded !== 'Not Sure – Need Suggestions' ? [guidedData.serviceNeeded] : [],
      businessGoals: [guidedData.primaryGoal],
      projectDescription: `Assessment completed via AKSHORA AI Assistant. Business: ${guidedData.businessName} (${guidedData.businessType}). Seeking: ${guidedData.serviceNeeded}. Primary Goal: ${guidedData.primaryGoal}.`
    });
    onClose();
  };

  return (
    <>
      {/* Floating Robot Button (visible when closed) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            id="ai-robot-floating-btn"
            onClick={onOpen}
            className="relative flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white font-semibold shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:scale-105 transition-all focus:outline-none group border border-white/20"
            aria-label="Open AKSHORA AI Assistant"
          >
            {/* Ping Indicator */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 border-2 border-[#0b0f19]"></span>
            </span>

            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:rotate-12 transition-transform">
              <Bot className="w-5 h-5 text-white" />
            </div>

            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold leading-tight tracking-wide">AKSHORA AI</div>
              <div className="text-[10px] text-cyan-200 font-normal leading-tight">Ask Our Growth Agent</div>
            </div>
          </button>
        </div>
      )}

      {/* Floating Chat Modal / Window */}
      {isOpen && (
        <div
          id="ai-chatbot-window"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[440px] h-[640px] max-h-[88vh] rounded-2xl bg-[#0d1222] border border-slate-700/80 shadow-2xl shadow-indigo-950/60 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1.5px]">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <Bot className="w-5 h-5 text-cyan-300" />
                  </div>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-950"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white">AKSHORA AI Agent</h3>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-900/80 text-indigo-300 border border-indigo-700/40">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Marketing & Strategy Advisor</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                id="ai-chat-close-btn"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close Assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-950/90 border-b border-slate-800/80 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                activeTab === 'chat'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Free Consultation</span>
            </button>
            <button
              onClick={() => setActiveTab('guided')}
              className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                activeTab === 'guided'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>5-Step Guided Audit</span>
            </button>
          </div>

          {/* Tab 1: Free Form Chat */}
          {activeTab === 'chat' && (
            <>
              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm scrollbar-thin scrollbar-thumb-slate-800">
                {messages.map((msg) => {
                  const isAssistant = msg.sender === 'assistant';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-end gap-2 max-w-[88%]">
                        {isAssistant && (
                          <div className="w-6 h-6 rounded-lg bg-indigo-950 border border-indigo-700/50 flex items-center justify-center shrink-0 mb-1">
                            <Bot className="w-3.5 h-3.5 text-cyan-400" />
                          </div>
                        )}
                        <div
                          className={`rounded-2xl px-4 py-3 leading-relaxed ${
                            isAssistant
                              ? 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-sm'
                              : 'bg-indigo-600 text-white rounded-br-sm shadow-md shadow-indigo-900/30'
                          }`}
                        >
                          <div className="whitespace-pre-wrap font-normal leading-relaxed text-[13.5px]">
                            {msg.text}
                          </div>
                          <span
                            className={`block text-[10px] mt-1.5 ${
                              isAssistant ? 'text-slate-400' : 'text-indigo-200'
                            }`}
                          >
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>

                      {/* Suggested Action Chips */}
                      {isAssistant && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                        <div className="mt-2.5 ml-8 flex flex-wrap gap-1.5 max-w-[90%]">
                          {msg.suggestedActions.map((action, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleActionClick(action.action, action.value)}
                              className="text-xs px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-indigo-900/50 text-cyan-300 hover:text-white border border-slate-700/70 hover:border-indigo-500/50 transition-all font-medium flex items-center gap-1 text-left"
                            >
                              <span>{action.label}</span>
                              <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs py-2 ml-8">
                    <div className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
                    <span>AKSHORA AI is analyzing marketing channels...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Box */}
              <div className="p-3 bg-slate-950/80 border-t border-slate-800/80">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    id="ai-chat-input"
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="Ask about Meta Ads, SEO, pricing, ROI..."
                    disabled={isLoading}
                    className="flex-1 bg-slate-900/90 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                  />
                  <button
                    id="ai-chat-send-btn"
                    type="submit"
                    disabled={!inputVal.trim() || isLoading}
                    className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:hover:bg-indigo-600 transition-all"
                    aria-label="Send Message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400 px-1">
                  <span>Grounded in live active services & FAQs</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('guided')}
                    className="text-cyan-400 hover:underline"
                  >
                    Take Guided Quiz →
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Tab 2: 5-Step Guided Conversation Flow */}
          {activeTab === 'guided' && (
            <div className="flex-1 overflow-y-auto p-5 flex flex-col justify-between scrollbar-thin">
              <div className="space-y-4">
                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-1.5">
                    <span>Diagnostic Step {guidedStep} of 5</span>
                    <span className="text-cyan-400">{guidedStep * 20}% Completed</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
                      style={{ width: `${guidedStep * 20}%` }}
                    ></div>
                  </div>
                </div>

                {/* Step 1: Business Name */}
                {guidedStep === 1 && (
                  <div className="space-y-4 pt-2 animate-in fade-in duration-200">
                    <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-sm text-indigo-200">
                      Let's tailor an AI-powered growth roadmap. What is your business or brand name?
                    </div>
                    <form onSubmit={handleGuidedSubmitStep1} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                          Business Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={guidedData.businessName}
                          onChange={(e) => setGuidedData(prev => ({ ...prev, businessName: e.target.value }))}
                          placeholder="e.g. Apex Health Co. or Bloom Cosmetics"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                          autoFocus
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!guidedData.businessName.trim()}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        <span>Continue to Step 2</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                )}

                {/* Step 2: Business Type */}
                {guidedStep === 2 && (
                  <div className="space-y-3 pt-2 animate-in fade-in duration-200">
                    <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-sm text-indigo-200">
                      Great to meet you! What type of business is <strong className="text-white">{guidedData.businessName}</strong>?
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
                      {BUSINESS_TYPES.map((bType) => (
                        <button
                          key={bType}
                          onClick={() => handleGuidedSelectStep2(bType)}
                          className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all border ${
                            guidedData.businessType === bType
                              ? 'bg-indigo-600 text-white border-indigo-500'
                              : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-indigo-500/60 hover:text-white'
                          }`}
                        >
                          {bType}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Service Looking For */}
                {guidedStep === 3 && (
                  <div className="space-y-3 pt-2 animate-in fade-in duration-200">
                    <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-sm text-indigo-200">
                      What primary digital marketing service are you looking to implement?
                    </div>
                    <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1">
                      {SERVICE_OPTIONS.map((srv) => (
                        <button
                          key={srv}
                          onClick={() => handleGuidedSelectStep3(srv)}
                          className={`p-2.5 rounded-xl text-xs font-medium text-left transition-all border flex items-center justify-between ${
                            guidedData.serviceNeeded === srv
                              ? 'bg-indigo-600 text-white border-indigo-500'
                              : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-indigo-500/60 hover:text-white'
                          }`}
                        >
                          <span>{srv}</span>
                          <ChevronRight className="w-4 h-4 opacity-50" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Primary Business Goal */}
                {guidedStep === 4 && (
                  <div className="space-y-3 pt-2 animate-in fade-in duration-200">
                    <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-sm text-indigo-200">
                      What is your #1 growth benchmark right now?
                    </div>
                    <div className="space-y-2">
                      {GOALS.map((goal) => (
                        <button
                          key={goal}
                          onClick={() => handleGuidedSelectStep4(goal)}
                          className={`w-full p-3 rounded-xl text-xs font-semibold text-left transition-all border flex items-center justify-between ${
                            guidedData.primaryGoal === goal
                              ? 'bg-indigo-600 text-white border-indigo-500'
                              : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-indigo-500/60 hover:text-white'
                          }`}
                        >
                          <span>{goal}</span>
                          <CheckCircle2 className="w-4 h-4 opacity-70" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 5: Summary & Submit Recommendation */}
                {guidedStep === 5 && (
                  <div className="space-y-4 pt-1 animate-in fade-in duration-200">
                    <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-800/50 text-emerald-300 text-sm">
                      <div className="font-bold mb-1 flex items-center gap-1.5 text-emerald-200">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span>AI Diagnostic Summary Ready</span>
                      </div>
                      <p className="text-xs text-emerald-300/90 leading-relaxed">
                        We have prepared your preliminary growth blueprint for <strong>{guidedData.businessName}</strong>.
                      </p>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2.5 text-xs">
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Business Name:</span>
                        <span className="font-bold text-white">{guidedData.businessName}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Category:</span>
                        <span className="font-bold text-white">{guidedData.businessType}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Service:</span>
                        <span className="font-bold text-indigo-300">{guidedData.serviceNeeded}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Primary Goal:</span>
                        <span className="font-bold text-emerald-400">{guidedData.primaryGoal}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      Would you like to submit an enquiry now? Our senior strategists will review these details and formulate an AI campaign plan with expected ROI projections.
                    </p>

                    <button
                      onClick={handleGuidedFinish}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                    >
                      <span>Complete & Pre-Fill Enquiry Form</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation Back / Reset / Switch */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                {guidedStep > 1 && guidedStep < 5 ? (
                  <button
                    onClick={() => setGuidedStep(prev => prev - 1)}
                    className="hover:text-white"
                  >
                    ← Back
                  </button>
                ) : (
                  <span>AKSHORA Growth Engine</span>
                )}
                <button
                  onClick={() => {
                    setGuidedStep(1);
                    setGuidedData({
                      businessName: '',
                      businessType: '',
                      serviceNeeded: '',
                      primaryGoal: ''
                    });
                  }}
                  className="hover:text-white flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
