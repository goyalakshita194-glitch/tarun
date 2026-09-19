import { GoogleGenAI } from '@google/genai';
import { readDatabase } from './db.js';

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

export interface ChatRequestPayload {
  message: string;
  history?: { role: 'user' | 'model'; parts: { text: string }[] }[];
  contextState?: {
    businessName?: string;
    businessCategory?: string;
    selectedServices?: string[];
    primaryGoal?: string;
    budget?: string;
  };
}

export async function generateChatResponse(payload: ChatRequestPayload): Promise<{
  reply: string;
  suggestedActions?: { label: string; action: string; value?: string }[];
  isEnquiryTrigger?: boolean;
  enquiryDraft?: Record<string, any>;
}> {
  const db = readDatabase();
  const activeServices = db.services.filter(s => s.isActive);
  const activeFaqs = db.faqs.filter(f => f.isActive);
  const settings = db.settings;

  // Build live grounded agency knowledge base
  const servicesContext = activeServices.map(s => {
    return `- Service: ${s.name} (${s.category})
  Starting Price: ${s.startingPrice}
  Short Summary: ${s.shortDescription}
  Key Benefits: ${s.benefits.join('; ')}
  FAQs: ${(s.faqs || []).map(f => `Q: ${f.question} -> A: ${f.answer}`).join(' | ')}`;
  }).join('\n\n');

  const faqsContext = activeFaqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');

  const systemInstruction = `You are the official AI Marketing Assistant for AKSHORA, an elite AI-Powered Digital Marketing & Branding Agency.
Your name is "AKSHORA AI Agent". You are friendly, professional, consultative, and knowledgeable about growth marketing.

CRITICAL DIRECTIVES:
1. Ground all your knowledge strictly in AKSHORA's live offerings below.
2. DO NOT invent fake services, fake guarantees, or non-existent discount codes. If pricing is requested, reference starting prices from the database or state that a custom proposal will be formulated during the discovery call.
3. If the user asks something completely off-topic (e.g. general trivia, coding puzzles, politics, cooking recipes), politely decline and steer them back: "I specialize strictly in AKSHORA's digital marketing, branding, and growth solutions. Let's discuss how we can scale your business!"
4. Help users identify the right services for their business type (e.g. E-commerce often excels with Meta Ads, Google Shopping/PMax, and Email Marketing; Local Clinics/Legal thrive with Google Ads & SEO; B2B SaaS thrives with Lead Gen, LinkedIn, and SEO).
5. Explain the benefits of SEO, Meta Ads, Google Ads, Social Media, Content Creation, Branding, and Web Dev clearly and authoritatively.
6. When users share their business details, goals, or express purchase intent, invite them to submit an enquiry via our quick Enquiry Form so our senior marketing team can prepare an AI growth audit.
7. Agency Contact Information:
   - Email: ${settings.contactEmail}
   - Phone / Direct Contact: ${settings.contactPhone}
   - Instagram Official: ${settings.socialLinks?.instagram || 'https://www.instagram.com/akshora.digital/'}
   - Operations: Modern Digital & Remote Agency (serving clients globally online; no physical walk-in office needed)

CURRENT LIVE ACTIVE SERVICES AT AKSHORA:
${servicesContext}

GENERAL AGENCY FAQS:
${faqsContext}
`;

  const userMessage = payload.message.trim();

  // Try calling Gemini API via @google/genai
  try {
    const client = getAIClient();
    if (client) {
      // Format chat history for generateContent
      const contents = [];
      
      // Add previous context if provided
      if (payload.history && payload.history.length > 0) {
        for (const h of payload.history.slice(-6)) {
          contents.push({
            role: h.role,
            parts: h.parts
          });
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });

      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const replyText = response.text || '';
      
      // Detect if the user wants to enquire
      const lower = userMessage.toLowerCase();
      const isEnquiryTrigger = lower.includes('enquiry') || lower.includes('quote') || lower.includes('book') || lower.includes('contact') || lower.includes('hire') || lower.includes('get started') || lower.includes('proposal');

      const suggestedActions: { label: string; action: string; value?: string }[] = [];
      if (isEnquiryTrigger) {
        suggestedActions.push({ label: 'Open Enquiry Form', action: 'open_enquiry_form' });
      } else {
        suggestedActions.push(
          { label: 'Explore All Services', action: 'navigate_services' },
          { label: 'Start Guided Assessment', action: 'guided_flow' },
          { label: 'Submit Custom Enquiry', action: 'open_enquiry_form' }
        );
      }

      return {
        reply: replyText,
        suggestedActions,
        isEnquiryTrigger
      };
    }
  } catch (err) {
    console.warn('Gemini API call warning, falling back to dynamic rule-based knowledge engine:', err);
  }

  // Robust Fallback Knowledge Engine (guarantees instantaneous helpful responses with live DB data)
  return generateFallbackResponse(userMessage, activeServices, activeFaqs, settings);
}

function generateFallbackResponse(
  query: string,
  services: any[],
  faqs: any[],
  settings: any
): {
  reply: string;
  suggestedActions?: { label: string; action: string; value?: string }[];
  isEnquiryTrigger?: boolean;
} {
  const q = query.toLowerCase();

  // Pricing inquiry
  if (q.includes('price') || q.includes('cost') || q.includes('rate') || q.includes('how much') || q.includes('fee')) {
    const list = services.map(s => `• **${s.name}**: Starting at ${s.startingPrice}`).join('\n');
    return {
      reply: `Here are the current starting investment tiers for AKSHORA's services:\n\n${list}\n\n*Note: We also engineer customized multi-channel growth packages based on your monthly revenue targets and ad spend. Would you like to submit an enquiry for a custom proposal?*`,
      suggestedActions: [
        { label: 'Submit an Enquiry', action: 'open_enquiry_form' },
        { label: 'View All Services', action: 'navigate_services' }
      ],
      isEnquiryTrigger: true
    };
  }

  // Specific service check (SEO, Meta, Google Ads, Branding, etc.)
  const matchedService = services.find(s => 
    q.includes(s.slug) || 
    q.includes(s.name.toLowerCase()) || 
    (s.slug === 'seo' && q.includes('seo')) ||
    (s.slug === 'meta-ads' && (q.includes('meta') || q.includes('facebook') || q.includes('instagram'))) ||
    (s.slug === 'google-ads' && (q.includes('google') || q.includes('adwords') || q.includes('ppc'))) ||
    (s.slug === 'website-development' && (q.includes('web') || q.includes('site') || q.includes('landing'))) ||
    (s.slug === 'branding-identity' && (q.includes('brand') || q.includes('logo')))
  );

  if (matchedService) {
    const benefitsList = matchedService.benefits.map((b: string) => `✓ ${b}`).join('\n');
    return {
      reply: `### ${matchedService.name}\n${matchedService.description}\n\n**Key Highlights:**\n${benefitsList}\n\n**Starting Price:** ${matchedService.startingPrice}\n\nWould you like our team to audit your current setup or prepare a custom campaign strategy?`,
      suggestedActions: [
        { label: `Enquire about ${matchedService.name}`, action: 'enquire_service', value: matchedService.name },
        { label: 'Check Other Services', action: 'navigate_services' }
      ],
      isEnquiryTrigger: true
    };
  }

  // FAQ matching
  for (const faq of faqs) {
    const words = faq.question.toLowerCase().split(' ').filter((w: string) => w.length > 4);
    const matches = words.filter((w: string) => q.includes(w));
    if (matches.length >= 2) {
      return {
        reply: `**Q: ${faq.question}**\n\n${faq.answer}\n\nDoes this help clarify your question? Let me know if you need more details!`,
        suggestedActions: [
          { label: 'View All FAQs', action: 'navigate_faqs' },
          { label: 'Talk to a Human Strategist', action: 'open_enquiry_form' }
        ]
      };
    }
  }

  // E-commerce recommendation
  if (q.includes('ecommerce') || q.includes('e-commerce') || q.includes('shopify') || q.includes('store') || q.includes('products')) {
    return {
      reply: `For E-Commerce brands, our highest-converting growth engine blends three core channels:\n\n1. **Meta Ads Management (FB & Instagram)**: High-velocity video creative testing + Advantage+ retargeting to drive initial purchases.\n2. **Google Ads (Performance Max & Shopping)**: Capturing high-intent shoppers searching for your exact product categories.\n3. **Email Lifecycle Marketing**: Automated abandoned-cart and VIP customer flows generating 25-40% recurring revenue.\n\nWould you like to explore an e-commerce growth audit for your store?`,
      suggestedActions: [
        { label: 'Get an E-commerce Audit', action: 'open_enquiry_form' },
        { label: 'View Meta Ads Details', action: 'enquire_service', value: 'Meta Ads Management (FB & Instagram)' }
      ]
    };
  }

  // B2B or Startup recommendation
  if (q.includes('b2b') || q.includes('saas') || q.includes('startup') || q.includes('leads') || q.includes('client')) {
    return {
      reply: `For B2B companies & Startups, our recommendation is focused on pipeline predictability:\n\n1. **High-Performance B2B Lead Generation**: Multi-channel verified cold outreach, multi-inbox deliverability, and pre-qualified calendar bookings.\n2. **Google Search Ads**: Targeting high-intent enterprise commercial search queries.\n3. **SEO & Content Authority**: High-ranking comparison articles and industry whitepapers.\n\nShall we tailor a customized proposal for your target audience?`,
      suggestedActions: [
        { label: 'Request B2B Proposal', action: 'open_enquiry_form' },
        { label: 'Check Lead Gen Service', action: 'enquire_service', value: 'High-Performance B2B Lead Generation' }
      ]
    };
  }

  // General default helpful response
  return {
    reply: `At AKSHORA, we help ambitious businesses scale through intelligent digital marketing, creative branding, and AI-powered performance strategies.\n\nWe specialize in:\n• **Performance Ads** (Meta, Google, Lead Gen)\n• **Organic Growth** (SEO, Email Marketing)\n• **Creative & Tech** (Conversion Websites, Branding, AI Content)\n\nYou can click on our interactive options below or tell me your business type and primary goal!`,
    suggestedActions: [
      { label: 'Start Guided Assessment', action: 'guided_flow' },
      { label: 'View All Services', action: 'navigate_services' },
      { label: 'Submit an Enquiry', action: 'open_enquiry_form' }
    ]
  };
}
