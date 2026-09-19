import type { Service, FAQItem, Enquiry, WebsiteSettings, AdminUser } from '../types';

export const api = {
  // Services
  async getServices(all = false): Promise<Service[]> {
    const res = await fetch(`/api/services${all ? '?all=true' : ''}`);
    if (!res.ok) throw new Error('Failed to load services');
    return res.json();
  },

  async createService(service: Partial<Service>): Promise<Service> {
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to create service');
    }
    return res.json();
  },

  async updateService(id: string, service: Partial<Service>): Promise<Service> {
    const res = await fetch(`/api/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to update service');
    }
    return res.json();
  },

  async deleteService(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete service');
    return res.json();
  },

  // FAQs
  async getFaqs(all = false): Promise<FAQItem[]> {
    const res = await fetch(`/api/faqs${all ? '?all=true' : ''}`);
    if (!res.ok) throw new Error('Failed to load FAQs');
    return res.json();
  },

  async createFaq(faq: Partial<FAQItem>): Promise<FAQItem> {
    const res = await fetch('/api/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(faq),
    });
    if (!res.ok) throw new Error('Failed to create FAQ');
    return res.json();
  },

  async updateFaq(id: string, faq: Partial<FAQItem>): Promise<FAQItem> {
    const res = await fetch(`/api/faqs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(faq),
    });
    if (!res.ok) throw new Error('Failed to update FAQ');
    return res.json();
  },

  async deleteFaq(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete FAQ');
    return res.json();
  },

  // Enquiries
  async getEnquiries(params?: { status?: string; search?: string; service?: string }): Promise<Enquiry[]> {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    if (params?.service) query.set('service', params.service);

    const res = await fetch(`/api/enquiries?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch enquiries');
    return res.json();
  },

  async submitEnquiry(enquiry: Partial<Enquiry>): Promise<{ success: boolean; enquiryId: string; message: string; data: Enquiry }> {
    const res = await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiry),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit enquiry');
    }
    return res.json();
  },

  async updateEnquiry(id: string, updates: Partial<Enquiry>): Promise<Enquiry> {
    const res = await fetch(`/api/enquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update enquiry');
    return res.json();
  },

  async deleteEnquiry(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete enquiry');
    return res.json();
  },

  // Website Settings
  async getSettings(): Promise<WebsiteSettings> {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('Failed to load settings');
    return res.json();
  },

  async updateSettings(settings: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  },

  // AI Chat
  async sendChatMessage(payload: {
    message: string;
    history?: { role: 'user' | 'model'; parts: { text: string }[] }[];
    contextState?: any;
  }) {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error('Failed to generate response');
    }
    return res.json();
  },

  // Auth
  async loginAdmin(username: string, password: string): Promise<{ success: boolean; token?: string; user?: AdminUser; message?: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return res.json();
  },

  async verifyAuth(token: string): Promise<{ authenticated: boolean; user?: AdminUser }> {
    const res = await fetch('/api/auth/verify', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  async logoutAdmin(token: string): Promise<void> {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async changeAdminPassword(token: string, payload: { currentPassword: string; newPassword: string; newUsername?: string }): Promise<{ success: boolean; message: string; user?: AdminUser }> {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  }
};
