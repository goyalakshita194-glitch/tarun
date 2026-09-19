import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Download,
  CheckCircle,
  Clock,
  HelpCircle,
  FileText,
  Settings,
  Layers,
  Sparkles,
  ArrowUpRight,
  Eye,
  EyeOff,
  Key,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  Bot
} from 'lucide-react';
import type { Service, FAQItem, Enquiry, WebsiteSettings, AdminUser, EnquiryStatus } from '../types';
import { api } from '../lib/api';
import { ServiceIcon, AVAILABLE_ICONS } from '../components/ServiceIcon';

interface AdminDashboardProps {
  adminUser: AdminUser | null;
  adminToken: string | null;
  onLoginSuccess: (token: string, user: AdminUser) => void;
  onLogout: () => void;
  onRefreshData: () => Promise<void>;
  services: Service[];
  faqs: FAQItem[];
  settings: WebsiteSettings;
}

const STATUS_COLORS: Record<EnquiryStatus, { bg: string; text: string; border: string }> = {
  New: { bg: 'bg-blue-950/80', text: 'text-blue-300', border: 'border-blue-700/60' },
  Contacted: { bg: 'bg-amber-950/80', text: 'text-amber-300', border: 'border-amber-700/60' },
  'Follow-up': { bg: 'bg-purple-950/80', text: 'text-purple-300', border: 'border-purple-700/60' },
  Converted: { bg: 'bg-emerald-950/80', text: 'text-emerald-300', border: 'border-emerald-700/60' },
  Closed: { bg: 'bg-slate-900', text: 'text-slate-400', border: 'border-slate-700' }
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminUser,
  adminToken,
  onLoginSuccess,
  onLogout,
  onRefreshData,
  services,
  faqs,
  settings
}) => {
  // Navigation tabs in admin
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'enquiries' | 'faqs' | 'settings' | 'security'>('overview');

  // Login Form state
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('akshora2026!');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Password & Security Management state
  const [changeUserVal, setChangeUserVal] = useState(adminUser?.username || 'admin');
  const [currentPasswordVal, setCurrentPasswordVal] = useState('');
  const [newPasswordVal, setNewPasswordVal] = useState('');
  const [confirmPasswordVal, setConfirmPasswordVal] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Enquiries list & filters
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('All');
  const [selectedEnquiryModal, setSelectedEnquiryModal] = useState<Enquiry | null>(null);

  // Service Edit / Add Modal state
  const [serviceModalMode, setServiceModalMode] = useState<'create' | 'edit' | null>(null);
  const [currentServiceForm, setCurrentServiceForm] = useState<Partial<Service>>({
    name: '',
    category: 'Paid Performance',
    icon: 'Target',
    shortDescription: '',
    description: '',
    benefits: ['High conversion tracking & CAPI setup', 'Custom audience modeling'],
    startingPrice: '$999/month',
    isActive: true,
    isFeatured: false,
    faqs: []
  });
  const [newBenefitInput, setNewBenefitInput] = useState('');

  // FAQ Edit / Add Modal state
  const [faqModalMode, setFaqModalMode] = useState<'create' | 'edit' | null>(null);
  const [currentFaqForm, setCurrentFaqForm] = useState<Partial<FAQItem>>({
    question: '',
    answer: '',
    category: 'General Agency',
    isActive: true,
    order: 1
  });

  // Website Settings Form state
  const [settingsForm, setSettingsForm] = useState<WebsiteSettings>(settings);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Load enquiries when logged in
  const loadEnquiries = async () => {
    try {
      const data = await api.getEnquiries({
        status: enquiryStatusFilter === 'All' ? undefined : enquiryStatusFilter,
        search: enquirySearch.trim() || undefined
      });
      setEnquiries(data);
    } catch (err) {
      console.error('Failed to load enquiries', err);
    }
  };

  useEffect(() => {
    if (adminUser) {
      loadEnquiries();
    }
  }, [adminUser, enquiryStatusFilter, enquirySearch]);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  // Auth Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      const res = await api.loginAdmin(loginUsername, loginPassword);
      if (res.success && res.token && res.user) {
        onLoginSuccess(res.token, res.user);
      } else {
        setLoginError(res.message || 'Invalid administrator credentials');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please check network connection.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Service Handlers
  const handleOpenAddService = () => {
    setCurrentServiceForm({
      name: '',
      category: 'Paid Performance',
      icon: 'Target',
      shortDescription: '',
      description: '',
      benefits: ['Custom AI analytics instrumentation', 'Weekly performance reviews'],
      startingPrice: '$799/month',
      isActive: true,
      isFeatured: false,
      faqs: []
    });
    setServiceModalMode('create');
  };

  const handleOpenEditService = (service: Service) => {
    setCurrentServiceForm({ ...service });
    setServiceModalMode('edit');
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (serviceModalMode === 'create') {
        await api.createService(currentServiceForm);
      } else if (serviceModalMode === 'edit' && currentServiceForm.id) {
        await api.updateService(currentServiceForm.id, currentServiceForm);
      }
      setServiceModalMode(null);
      await onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to save service');
    }
  };

  const handleDeleteService = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete service "${name}"? It will be removed from the frontend and AI assistant database.`)) {
      try {
        await api.deleteService(id);
        await onRefreshData();
      } catch (err: any) {
        alert(err.message || 'Failed to delete service');
      }
    }
  };

  const handleToggleServiceStatus = async (service: Service) => {
    try {
      await api.updateService(service.id, { isActive: !service.isActive });
      await onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle status');
    }
  };

  // FAQ Handlers
  const handleOpenAddFaq = () => {
    setCurrentFaqForm({
      question: '',
      answer: '',
      category: 'General Agency',
      isActive: true,
      order: faqs.length + 1
    });
    setFaqModalMode('create');
  };

  const handleOpenEditFaq = (faq: FAQItem) => {
    setCurrentFaqForm({ ...faq });
    setFaqModalMode('edit');
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (faqModalMode === 'create') {
        await api.createFaq(currentFaqForm);
      } else if (faqModalMode === 'edit' && currentFaqForm.id) {
        await api.updateFaq(currentFaqForm.id, currentFaqForm);
      }
      setFaqModalMode(null);
      await onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to save FAQ');
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      try {
        await api.deleteFaq(id);
        await onRefreshData();
      } catch (err: any) {
        alert(err.message || 'Failed to delete FAQ');
      }
    }
  };

  // Enquiry status change handler
  const handleUpdateEnquiryStatus = async (enquiryId: string, newStatus: EnquiryStatus) => {
    try {
      const updated = await api.updateEnquiry(enquiryId, { status: newStatus });
      setEnquiries(prev => prev.map(e => e.id === enquiryId ? updated : e));
      if (selectedEnquiryModal?.id === enquiryId) {
        setSelectedEnquiryModal(updated);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleSaveEnquiryNotes = async (enquiryId: string, notes: string) => {
    try {
      const updated = await api.updateEnquiry(enquiryId, { notes });
      setEnquiries(prev => prev.map(e => e.id === enquiryId ? updated : e));
      if (selectedEnquiryModal?.id === enquiryId) {
        setSelectedEnquiryModal(updated);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save notes');
    }
  };

  // Settings Save Handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSaveSuccessMsg(null);
    try {
      await api.updateSettings(settingsForm);
      await onRefreshData();
      setSaveSuccessMsg('Website content settings updated successfully!');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to update settings');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Password update handler
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeStatus(null);
    if (!adminToken) return;

    if (newPasswordVal !== confirmPasswordVal) {
      setPasswordChangeStatus({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }

    if (newPasswordVal.length < 4) {
      setPasswordChangeStatus({ type: 'error', message: 'New password must be at least 4 characters long.' });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await api.changeAdminPassword(adminToken, {
        currentPassword: currentPasswordVal,
        newPassword: newPasswordVal,
        newUsername: changeUserVal.trim() || undefined
      });

      if (res.success) {
        setPasswordChangeStatus({
          type: 'success',
          message: 'Backend login credentials updated successfully in database! Please use your new password next time you sign in.'
        });
        setCurrentPasswordVal('');
        setNewPasswordVal('');
        setConfirmPasswordVal('');
        if (res.user) {
          onLoginSuccess(adminToken, res.user);
        }
      } else {
        setPasswordChangeStatus({ type: 'error', message: res.message || 'Failed to update password.' });
      }
    } catch (err: any) {
      setPasswordChangeStatus({ type: 'error', message: err.message || 'Failed to update credentials on the backend.' });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // IF NOT LOGGED IN: SHOW LOGIN SCREEN
  if (!adminUser) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-slate-950">
        <div className="w-full max-w-md bg-slate-900/95 border border-slate-800 p-8 rounded-2xl shadow-2xl shadow-indigo-950/20 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-indigo-950/90 border border-indigo-600/50 text-indigo-400 mx-auto flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Shield className="w-7 h-7 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-extrabold text-white font-heading">
              AKSHORA Backend Login
            </h2>
            <p className="text-xs text-slate-400">
              Agency Management & Database Administration Portal
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-600/50 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Username
              </label>
              <input
                id="admin-login-username"
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="e.g. admin"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="text-[11px] text-slate-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  {showLoginPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showLoginPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <div className="relative">
                <input
                  id="admin-login-password"
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-2.5 pr-10 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <button
              id="admin-login-btn"
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{isLoggingIn ? 'Verifying Credentials...' : 'Sign In to Backend'}</span>
            </button>
          </form>

          {/* Quick Auto-Fill Demo Credentials Button */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <button
              type="button"
              id="admin-autofill-btn"
              onClick={() => {
                setLoginUsername('admin');
                setLoginPassword('akshora2026!');
              }}
              className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-indigo-300 hover:text-white text-xs font-medium transition-all flex items-center justify-center gap-2"
            >
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>Fill Default Demo Credentials (admin / akshora2026!)</span>
            </button>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
              <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Protected backend API session. You can customize your username and password anytime inside the dashboard under <strong>Backend Login & Password</strong>.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CALCULATE STATS FOR OVERVIEW
  const totalEnquiries = enquiries.length;
  const newEnquiries = enquiries.filter(e => e.status === 'New').length;
  const activeServicesCount = services.filter(s => s.isActive).length;
  const convertedCount = enquiries.filter(e => e.status === 'Converted').length;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Bar with Admin Identity & Logout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700/60 text-emerald-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white font-heading">
                  AKSHORA Command Center
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {adminUser.role.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Connected User: <strong className="text-slate-200">@{adminUser.username}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-rose-300 hover:text-rose-200 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none text-xs font-semibold">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: Layers },
            { id: 'services', label: `Service Management (${services.length})`, icon: Sparkles },
            { id: 'enquiries', label: `Client Enquiries (${enquiries.length})`, icon: FileText },
            { id: 'faqs', label: `FAQ Management (${faqs.length})`, icon: HelpCircle },
            { id: 'settings', label: 'Website Content', icon: Settings },
            { id: 'security', label: 'Backend Login & Password', icon: Key }
          ].map(tab => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`admin-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ============================================================ */}
        {/* MODULE A: DASHBOARD OVERVIEW */}
        {/* ============================================================ */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Stat metric cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Total Enquiries
                </div>
                <div className="text-3xl font-extrabold text-white font-mono">
                  {totalEnquiries}
                </div>
                <div className="text-[11px] text-slate-500 pt-1">All-time recorded requirements</div>
              </div>

              <div className="p-6 rounded-2xl bg-blue-950/40 border border-blue-800/40 space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                  New Unprocessed
                </div>
                <div className="text-3xl font-extrabold text-blue-200 font-mono">
                  {newEnquiries}
                </div>
                <div className="text-[11px] text-blue-400/80 pt-1">Awaiting preliminary review</div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Active Agency Services
                </div>
                <div className="text-3xl font-extrabold text-white font-mono">
                  {activeServicesCount} / {services.length}
                </div>
                <div className="text-[11px] text-slate-500 pt-1">Available to clients & AI chatbot</div>
              </div>

              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  Converted Clients
                </div>
                <div className="text-3xl font-extrabold text-emerald-300 font-mono">
                  {convertedCount}
                </div>
                <div className="text-[11px] text-emerald-400/80 pt-1">Active client accounts</div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm font-bold text-white">Quick Administration Actions:</div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => { setActiveTab('services'); handleOpenAddService(); }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Service</span>
                </button>
                <button
                  onClick={() => { setActiveTab('faqs'); handleOpenAddFaq(); }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add FAQ</span>
                </button>
                <a
                  href="/api/enquiries/export/csv"
                  download
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Enquiries (CSV)</span>
                </a>
              </div>
            </div>

            {/* Recent Enquiries Table */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden">
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white font-heading">Recent Client Enquiries</h3>
                  <p className="text-xs text-slate-400">Latest proposals submitted via website and AI Assistant</p>
                </div>
                <button
                  onClick={() => setActiveTab('enquiries')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  <span>View All Enquiries</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3 px-4">Client & Business</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Services Requested</th>
                      <th className="py-3 px-4">Budget</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {enquiries.slice(0, 5).map(e => {
                      const statusStyle = STATUS_COLORS[e.status] || STATUS_COLORS.New;
                      return (
                        <tr key={e.id} className="hover:bg-slate-800/40">
                          <td className="py-3.5 px-4 font-mono font-semibold text-white">{e.id}</td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-white">{e.fullName}</div>
                            <div className="text-[11px] text-slate-400">{e.businessName}</div>
                          </td>
                          <td className="py-3.5 px-4">{e.businessCategory}</td>
                          <td className="py-3.5 px-4">
                            <div className="max-w-[180px] truncate text-[11px]">
                              {e.servicesInterestedIn.join(', ') || 'Custom Plan'}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono">{e.monthlyBudget}</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                              {e.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400">
                            {new Date(e.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedEnquiryModal(e)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-950/80 text-indigo-300 hover:bg-indigo-900 border border-indigo-700/50 text-[11px] font-medium"
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODULE B: SERVICE MANAGEMENT (CRUD) */}
        {/* ============================================================ */}
        {activeTab === 'services' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white font-heading">
                  Service Management (Full CRUD)
                </h2>
                <p className="text-xs text-slate-400">
                  Add, modify, or deactivate agency services. All updates immediately sync with the frontend and AI Assistant.
                </p>
              </div>

              <button
                id="admin-add-service-btn"
                onClick={handleOpenAddService}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Service</span>
              </button>
            </div>

            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Service</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Starting Price</th>
                      <th className="py-3 px-4">Benefits Count</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {services.map(srv => (
                      <tr key={srv.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-700/40 text-cyan-400 flex items-center justify-center shrink-0">
                              <ServiceIcon name={srv.icon} className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-white">{srv.name}</div>
                              {srv.isFeatured && (
                                <span className="text-[9px] uppercase font-bold text-cyan-300">★ Featured</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-300">{srv.category}</td>
                        <td className="py-3 px-4 font-mono font-semibold text-white">{srv.startingPrice}</td>
                        <td className="py-3 px-4">{srv.benefits.length} deliverables</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleServiceStatus(srv)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${
                              srv.isActive
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                                : 'bg-slate-900 text-slate-500 border-slate-700'
                            }`}
                          >
                            {srv.isActive ? 'Active (Live)' : 'Deactivated'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditService(srv)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                            title="Edit Service"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteService(srv.id, srv.name)}
                            className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white"
                            title="Delete Service"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODULE C: ENQUIRY MANAGEMENT */}
        {/* ============================================================ */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white font-heading">
                  Client Enquiry Management
                </h2>
                <p className="text-xs text-slate-400">
                  Track client requirements, update deal stages, and add internal strategy notes.
                </p>
              </div>

              <a
                href="/api/enquiries/export/csv"
                download
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-cyan-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </a>
            </div>

            {/* Filter and Search Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="relative sm:col-span-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={enquirySearch}
                  onChange={(e) => setEnquirySearch(e.target.value)}
                  placeholder="Search by client name, business, email, ID..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <select
                  value={enquiryStatusFilter}
                  onChange={(e) => setEnquiryStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Converted">Converted</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Enquiries Data Table */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3 px-4">Client / Company</th>
                      <th className="py-3 px-4">Contact Details</th>
                      <th className="py-3 px-4">Services Interested</th>
                      <th className="py-3 px-4">Budget</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Submitted</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {enquiries.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-500">
                          No enquiries found matching criteria.
                        </td>
                      </tr>
                    ) : (
                      enquiries.map(enquiry => {
                        const style = STATUS_COLORS[enquiry.status] || STATUS_COLORS.New;
                        return (
                          <tr key={enquiry.id} className="hover:bg-slate-800/40">
                            <td className="py-3 px-4 font-mono font-bold text-white">{enquiry.id}</td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-white">{enquiry.fullName}</div>
                              <div className="text-[11px] text-slate-400">{enquiry.businessName}</div>
                            </td>
                            <td className="py-3 px-4 space-y-0.5">
                              <div>{enquiry.email}</div>
                              <div className="text-[11px] text-slate-400">{enquiry.phone}</div>
                            </td>
                            <td className="py-3 px-4 max-w-[180px]">
                              <div className="truncate">{enquiry.servicesInterestedIn.join(', ') || 'None specified'}</div>
                            </td>
                            <td className="py-3 px-4 font-mono">{enquiry.monthlyBudget}</td>
                            <td className="py-3 px-4">
                              <select
                                value={enquiry.status}
                                onChange={(e) => handleUpdateEnquiryStatus(enquiry.id, e.target.value as EnquiryStatus)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold border focus:outline-none ${style.bg} ${style.text} ${style.border}`}
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Follow-up">Follow-up</option>
                                <option value="Converted">Converted</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </td>
                            <td className="py-3 px-4 text-slate-400 text-[11px]">
                              {new Date(enquiry.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => setSelectedEnquiryModal(enquiry)}
                                className="px-3 py-1 rounded-lg bg-indigo-950 text-indigo-300 hover:bg-indigo-900 border border-indigo-700/50 text-[11px] font-medium"
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODULE D: FAQ MANAGEMENT */}
        {/* ============================================================ */}
        {activeTab === 'faqs' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white font-heading">
                  FAQ Management
                </h2>
                <p className="text-xs text-slate-400">
                  Update frequently asked questions. The AI chatbot automatically retrieves and quotes these answers.
                </p>
              </div>

              <button
                id="admin-add-faq-btn"
                onClick={handleOpenAddFaq}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Add New FAQ</span>
              </button>
            </div>

            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden divide-y divide-slate-800">
              {faqs.map(faq => (
                <div key={faq.id} className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-slate-800/30">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                        {faq.category}
                      </span>
                      {!faq.isActive && (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-500">
                          Inactive
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white">{faq.question}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">{faq.answer}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenEditFaq(faq)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                      title="Edit FAQ"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteFaq(faq.id)}
                      className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODULE E: WEBSITE CONTENT MANAGEMENT */}
        {/* ============================================================ */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-white font-heading">
                Website Content Management
              </h2>
              <p className="text-xs text-slate-400">
                Update headlines, copy, contact details, and social channels without touching code.
              </p>
            </div>

            {saveSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-600/50 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-8 bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-2xl">
              {/* Homepage Content */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 pb-2 border-b border-slate-800">
                  Homepage Messaging
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Hero Headline
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroHeadline}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, heroHeadline: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Hero Subheading
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroSubheading}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, heroSubheading: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Hero Introduction Snippet
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.heroIntro}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, heroIntro: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* About Us & Vision */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 pb-2 border-b border-slate-800">
                  About Us & Agency Philosophy
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    About AKSHORA Summary
                  </label>
                  <textarea
                    rows={3}
                    value={settingsForm.aboutText}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, aboutText: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Agency Mission
                    </label>
                    <textarea
                      rows={2}
                      value={settingsForm.mission}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, mission: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Agency Vision
                    </label>
                    <textarea
                      rows={2}
                      value={settingsForm.vision}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, vision: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 pb-2 border-b border-slate-800">
                  Contact Information & Working Hours
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={settingsForm.contactEmail}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Contact Phone Number
                    </label>
                    <input
                      type="text"
                      value={settingsForm.contactPhone}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Office Address (Optional — Leave blank for 100% digital & remote agency)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.officeAddress}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, officeAddress: e.target.value }))}
                      placeholder="Leave blank for digital-only agency"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">When left empty, location will be completely hidden from the website and footer.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Working Hours
                    </label>
                    <input
                      type="text"
                      value={settingsForm.workingHours}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, workingHours: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    Social Media Profiles
                  </h3>
                  <span className="text-[11px] text-slate-500">Only non-empty links are displayed publicly</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 p-4 rounded-xl bg-gradient-to-r from-pink-950/30 to-purple-950/20 border border-pink-500/30">
                    <label className="block text-xs font-bold text-pink-300 mb-1 flex items-center justify-between">
                      <span>Primary Official Instagram URL</span>
                      <span className="text-[11px] text-slate-400 font-normal">Active channel</span>
                    </label>
                    <input
                      type="url"
                      value={settingsForm.socialLinks.instagram}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, instagram: e.target.value } }))}
                      placeholder="https://www.instagram.com/akshora.digital/"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-pink-500/40 text-white text-sm focus:outline-none focus:border-pink-500"
                    />
                    <p className="text-[11px] text-pink-300/70 mt-1">Featured across website footer and direct contact desk.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn URL (Optional)</label>
                    <input
                      type="url"
                      value={settingsForm.socialLinks.linkedin}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, linkedin: e.target.value } }))}
                      placeholder="Leave blank to hide"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Twitter / X URL (Optional)</label>
                    <input
                      type="url"
                      value={settingsForm.socialLinks.twitter}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, twitter: e.target.value } }))}
                      placeholder="Leave blank to hide"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingSettings ? 'Saving...' : 'Save Settings to Database'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODULE F: BACKEND LOGIN & PASSWORD SECURITY */}
        {/* ============================================================ */}
        {activeTab === 'security' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white font-heading">
                  Backend Login & Password Settings
                </h2>
                <p className="text-xs text-slate-400">
                  Manage agency administrator credentials, update your login password, and audit active backend sessions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 cols: Update Password Form */}
              <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-700/60 text-indigo-400 flex items-center justify-center">
                    <Key className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Change Admin Login Password
                    </h3>
                    <p className="text-xs text-slate-400">
                      Credentials are encrypted and saved directly to the backend database.
                    </p>
                  </div>
                </div>

                {passwordChangeStatus && (
                  <div
                    className={`p-4 rounded-xl text-xs flex items-center gap-3 border ${
                      passwordChangeStatus.type === 'success'
                        ? 'bg-emerald-950/80 border-emerald-600/50 text-emerald-200'
                        : 'bg-rose-950/80 border-rose-600/50 text-rose-200'
                    }`}
                  >
                    {passwordChangeStatus.type === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                    <div className="font-medium">{passwordChangeStatus.message}</div>
                  </div>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Admin Username
                    </label>
                    <input
                      type="text"
                      value={changeUserVal}
                      onChange={(e) => setChangeUserVal(e.target.value)}
                      placeholder="e.g. admin"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">You may keep this as 'admin' or customize your username.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Current Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={currentPasswordVal}
                      onChange={(e) => setCurrentPasswordVal(e.target.value)}
                      placeholder="Enter current password (default: akshora2026!)"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-300">
                          New Password *
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="text-[11px] text-indigo-300 hover:text-white flex items-center gap-1"
                        >
                          {showNewPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          <span>{showNewPassword ? 'Hide' : 'Show'}</span>
                        </button>
                      </div>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPasswordVal}
                        onChange={(e) => setNewPasswordVal(e.target.value)}
                        placeholder="Min 4 characters"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Confirm New Password *
                      </label>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={confirmPasswordVal}
                        onChange={(e) => setConfirmPasswordVal(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex justify-end">
                    <button
                      type="submit"
                      disabled={isUpdatingPassword}
                      className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
                    >
                      <Key className="w-4 h-4" />
                      <span>{isUpdatingPassword ? 'Updating Password...' : 'Save New Login Password'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Col: Current Backend Identity & Info */}
              <div className="space-y-6">
                <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Current Session Status</span>
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                      <span className="text-slate-400">Current Username:</span>
                      <span className="font-mono font-bold text-white">@{adminUser.username}</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                      <span className="text-slate-400">Account Role:</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold uppercase text-[10px]">
                        {adminUser.role}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                      <span className="text-slate-400">Authentication:</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Bearer Token Active
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-slate-400">Database Storage:</span>
                      <span className="text-cyan-300 font-mono text-[11px]">Persistent JSON</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3 text-xs text-slate-400">
                  <h4 className="font-bold text-slate-200 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-indigo-400" />
                    <span>Backend Security Overview</span>
                  </h4>
                  <p className="leading-relaxed">
                    • <strong>Login API:</strong> Requests to <code className="text-cyan-300">/api/auth/login</code> issue an authorized token stored in local session storage.
                  </p>
                  <p className="leading-relaxed">
                    • <strong>Password Protection:</strong> When you change your password, the backend immediately commits it to the database so that only the new credentials will grant access.
                  </p>
                  <p className="leading-relaxed">
                    • <strong>Immediate Revocation:</strong> Clicking <em>Log Out</em> in the top-right header invalidates the backend session token immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SERVICE ADD / EDIT MODAL */}
        {/* ============================================================ */}
        {serviceModalMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0d1222] border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white font-heading">
                  {serviceModalMode === 'create' ? 'Add New Agency Service' : 'Edit Service Details'}
                </h3>
                <button
                  onClick={() => setServiceModalMode(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveService} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Service Name *</label>
                    <input
                      type="text"
                      required
                      value={currentServiceForm.name || ''}
                      onChange={(e) => setCurrentServiceForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. TikTok Performance Advertising"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Service Category *</label>
                    <input
                      type="text"
                      required
                      value={currentServiceForm.category || ''}
                      onChange={(e) => setCurrentServiceForm(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g. Paid Performance"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Icon Style</label>
                    <select
                      value={currentServiceForm.icon || 'Target'}
                      onChange={(e) => setCurrentServiceForm(prev => ({ ...prev, icon: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    >
                      {AVAILABLE_ICONS.map(ic => (
                        <option key={ic} value={ic}>{ic}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Starting Price</label>
                    <input
                      type="text"
                      value={currentServiceForm.startingPrice || ''}
                      onChange={(e) => setCurrentServiceForm(prev => ({ ...prev, startingPrice: e.target.value }))}
                      placeholder="e.g. $850/month or Contact for Quote"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Short Description (Card Summary) *</label>
                  <textarea
                    rows={2}
                    required
                    value={currentServiceForm.shortDescription || ''}
                    onChange={(e) => setCurrentServiceForm(prev => ({ ...prev, shortDescription: e.target.value }))}
                    placeholder="Brief 1-2 sentence summary displayed on the card..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Detailed Description (Learn More View)</label>
                  <textarea
                    rows={3}
                    value={currentServiceForm.description || ''}
                    onChange={(e) => setCurrentServiceForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="In-depth methodology and deliverables..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                {/* Key Benefits List Builder */}
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Key Benefits & Features</label>
                  <div className="space-y-1.5 mb-2">
                    {currentServiceForm.benefits?.map((b, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                        <span className="text-slate-300">✓ {b}</span>
                        <button
                          type="button"
                          onClick={() => setCurrentServiceForm(prev => ({
                            ...prev,
                            benefits: prev.benefits?.filter((_, i) => i !== idx)
                          }))}
                          className="text-rose-400 hover:text-rose-300 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newBenefitInput}
                      onChange={(e) => setNewBenefitInput(e.target.value)}
                      placeholder="Add a new deliverable (e.g. Weekly KPI dashboard)..."
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newBenefitInput.trim()) {
                          setCurrentServiceForm(prev => ({
                            ...prev,
                            benefits: [...(prev.benefits || []), newBenefitInput.trim()]
                          }));
                          setNewBenefitInput('');
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentServiceForm.isActive}
                      onChange={(e) => setCurrentServiceForm(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
                    />
                    <span className="text-slate-300 font-semibold">Active & Visible to Public</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentServiceForm.isFeatured}
                      onChange={(e) => setCurrentServiceForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                      className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
                    />
                    <span className="text-slate-300 font-semibold">Featured on Homepage</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setServiceModalMode(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                  >
                    Save Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* FAQ ADD / EDIT MODAL */}
        {/* ============================================================ */}
        {faqModalMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0d1222] border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white font-heading">
                  {faqModalMode === 'create' ? 'Add New Agency FAQ' : 'Edit FAQ'}
                </h3>
                <button onClick={() => setFaqModalMode(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveFaq} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={currentFaqForm.category || ''}
                    onChange={(e) => setCurrentFaqForm(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g. Pricing & Contracts, Strategy, Technical"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Question *</label>
                  <input
                    type="text"
                    required
                    value={currentFaqForm.question || ''}
                    onChange={(e) => setCurrentFaqForm(prev => ({ ...prev, question: e.target.value }))}
                    placeholder="e.g. How does AKSHORA measure campaign ROAS?"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Authoritative Answer *</label>
                  <textarea
                    rows={4}
                    required
                    value={currentFaqForm.answer || ''}
                    onChange={(e) => setCurrentFaqForm(prev => ({ ...prev, answer: e.target.value }))}
                    placeholder="Detailed explanation used on website and AI Assistant..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="faq-active-check"
                    checked={currentFaqForm.isActive}
                    onChange={(e) => setCurrentFaqForm(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
                  />
                  <label htmlFor="faq-active-check" className="text-slate-300 font-semibold cursor-pointer">
                    Active (Live on website and in AI responses)
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setFaqModalMode(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                  >
                    Save FAQ
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* ENQUIRY DETAIL & NOTES MODAL */}
        {/* ============================================================ */}
        {selectedEnquiryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0d1222] border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-lg">{selectedEnquiryModal.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${STATUS_COLORS[selectedEnquiryModal.status].bg} ${STATUS_COLORS[selectedEnquiryModal.status].text} ${STATUS_COLORS[selectedEnquiryModal.status].border}`}>
                      {selectedEnquiryModal.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Submitted on {new Date(selectedEnquiryModal.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedEnquiryModal(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Client Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 mb-0.5">Client Full Name</div>
                  <div className="font-bold text-white text-sm">{selectedEnquiryModal.fullName}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 mb-0.5">Business Name & Category</div>
                  <div className="font-bold text-white text-sm">
                    {selectedEnquiryModal.businessName} ({selectedEnquiryModal.businessCategory})
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 mb-0.5">Email Address</div>
                  <a href={`mailto:${selectedEnquiryModal.email}`} className="font-semibold text-indigo-300 hover:underline">
                    {selectedEnquiryModal.email}
                  </a>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 mb-0.5">Phone Number</div>
                  <a href={`tel:${selectedEnquiryModal.phone}`} className="font-semibold text-cyan-300 hover:underline">
                    {selectedEnquiryModal.phone}
                  </a>
                </div>

                {selectedEnquiryModal.website && (
                  <div className="sm:col-span-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 mb-0.5">Website / Digital Presence</div>
                    <a
                      href={selectedEnquiryModal.website}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-indigo-300 hover:underline flex items-center gap-1"
                    >
                      <span>{selectedEnquiryModal.website}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>

              {/* Services & Goals */}
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 font-semibold mb-1">Services Requested:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEnquiryModal.servicesInterestedIn.length > 0 ? (
                      selectedEnquiryModal.servicesInterestedIn.map(s => (
                        <span key={s} className="px-2.5 py-1 rounded bg-indigo-950 text-indigo-200 border border-indigo-800 text-[11px] font-medium">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500">General Consultation</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 font-semibold mb-1">Budget Tier:</div>
                    <div className="font-mono text-sm text-white">{selectedEnquiryModal.monthlyBudget}</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 font-semibold mb-1">Preferred Contact Method:</div>
                    <div className="text-sm font-bold text-white">{selectedEnquiryModal.preferredContactMethod}</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 font-semibold mb-1">Project Description & Scope:</div>
                  <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {selectedEnquiryModal.projectDescription}
                  </p>
                </div>
              </div>

              {/* Status Update & Internal Notes */}
              <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-300">Update Enquiry Status:</label>
                  <select
                    value={selectedEnquiryModal.status}
                    onChange={(e) => handleUpdateEnquiryStatus(selectedEnquiryModal.id, e.target.value as EnquiryStatus)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-semibold focus:outline-none"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Converted">Converted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Internal Agency Notes:</label>
                  <textarea
                    rows={3}
                    defaultValue={selectedEnquiryModal.notes || ''}
                    onBlur={(e) => handleSaveEnquiryNotes(selectedEnquiryModal.id, e.target.value)}
                    placeholder="Record notes from discovery calls, ad accounts audit, proposal status..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500">Notes automatically save when you click outside this box.</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedEnquiryModal(null)}
                  className="px-5 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
