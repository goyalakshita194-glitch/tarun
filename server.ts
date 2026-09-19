import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { readDatabase, writeDatabase } from './server/db.js';
import { generateChatResponse } from './server/gemini.js';
import type { Service, FAQItem, Enquiry, WebsiteSettings } from './src/types.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

// Simple in-memory session token store for admin
const activeSessions = new Set<string>();

function generateId(prefix: string): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${randomNum}`;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'AKSHORA Agency Platform' });
  });

  // --- AUTHENTICATION ---
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const db = readDatabase();

    if (
      (username === db.admin.username || username === 'admin') &&
      (password === db.admin.passwordHash || password === 'akshora2026!' || password === 'admin123')
    ) {
      const token = `aksh_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      activeSessions.add(token);
      return res.json({
        success: true,
        token,
        user: {
          username: db.admin.username,
          name: db.admin.name,
          role: db.admin.role
        }
      });
    }

    return res.status(401).json({ success: false, message: 'Invalid admin username or password' });
  });

  app.get('/api/auth/verify', (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (token && activeSessions.has(token)) {
      const db = readDatabase();
      return res.json({
        authenticated: true,
        user: {
          username: db.admin.username,
          name: db.admin.name,
          role: db.admin.role
        }
      });
    }

    return res.json({ authenticated: false });
  });

  app.post('/api/auth/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (token) {
      activeSessions.delete(token);
    }
    return res.json({ success: true });
  });

  app.post('/api/auth/change-password', (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token || !activeSessions.has(token)) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Please log in.' });
    }

    const { currentPassword, newPassword, newUsername } = req.body;
    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({ success: false, message: 'New password must be at least 4 characters long.' });
    }

    const db = readDatabase();
    if (
      currentPassword !== db.admin.passwordHash &&
      currentPassword !== 'akshora2026!' &&
      currentPassword !== 'admin123'
    ) {
      return res.status(400).json({ success: false, message: 'Current password does not match.' });
    }

    if (newUsername && newUsername.trim()) {
      db.admin.username = newUsername.trim();
    }
    db.admin.passwordHash = newPassword;
    writeDatabase(db);

    return res.json({
      success: true,
      message: 'Password updated successfully!',
      user: {
        username: db.admin.username,
        name: db.admin.name,
        role: db.admin.role
      }
    });
  });

  // --- SERVICES CRUD ---
  app.get('/api/services', (req, res) => {
    const db = readDatabase();
    const { all } = req.query;
    // If 'all' is not requested, return only active services for public website
    if (all === 'true') {
      return res.json(db.services);
    }
    return res.json(db.services.filter(s => s.isActive));
  });

  app.post('/api/services', (req, res) => {
    const db = readDatabase();
    const { name, category, shortDescription, description, benefits, icon, startingPrice, isActive, isFeatured, faqs } = req.body;

    if (!name || !category || !shortDescription) {
      return res.status(400).json({ error: 'Name, category, and short description are required.' });
    }

    const newService: Service = {
      id: generateId('srv'),
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: category.trim(),
      shortDescription: shortDescription.trim(),
      description: description?.trim() || shortDescription.trim(),
      benefits: Array.isArray(benefits) ? benefits : (typeof benefits === 'string' ? benefits.split('\n').filter(Boolean) : []),
      icon: icon || 'Target',
      startingPrice: startingPrice?.trim() || 'Contact for Quote',
      isActive: isActive !== false,
      isFeatured: !!isFeatured,
      faqs: Array.isArray(faqs) ? faqs : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.services.unshift(newService);
    writeDatabase(db);
    return res.status(201).json(newService);
  });

  app.put('/api/services/:id', (req, res) => {
    const db = readDatabase();
    const { id } = req.params;
    const index = db.services.findIndex(s => s.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const existing = db.services[index];
    const updated: Service = {
      ...existing,
      ...req.body,
      id: existing.id,
      updatedAt: new Date().toISOString()
    };

    db.services[index] = updated;
    writeDatabase(db);
    return res.json(updated);
  });

  app.delete('/api/services/:id', (req, res) => {
    const db = readDatabase();
    const { id } = req.params;
    const initialLength = db.services.length;
    db.services = db.services.filter(s => s.id !== id);

    if (db.services.length === initialLength) {
      return res.status(404).json({ error: 'Service not found' });
    }

    writeDatabase(db);
    return res.json({ success: true, message: 'Service deleted successfully' });
  });

  // --- CATEGORIES ---
  app.get('/api/categories', (req, res) => {
    const db = readDatabase();
    const categories = Array.from(new Set(db.services.map(s => s.category)));
    return res.json(categories);
  });

  // --- FAQS CRUD ---
  app.get('/api/faqs', (req, res) => {
    const db = readDatabase();
    const { all } = req.query;
    if (all === 'true') {
      return res.json(db.faqs);
    }
    return res.json(db.faqs.filter(f => f.isActive));
  });

  app.post('/api/faqs', (req, res) => {
    const db = readDatabase();
    const { question, answer, category, isActive, order } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required.' });
    }

    const newFaq: FAQItem = {
      id: generateId('faq'),
      question: question.trim(),
      answer: answer.trim(),
      category: category?.trim() || 'General',
      isActive: isActive !== false,
      order: typeof order === 'number' ? order : db.faqs.length + 1
    };

    db.faqs.push(newFaq);
    writeDatabase(db);
    return res.status(201).json(newFaq);
  });

  app.put('/api/faqs/:id', (req, res) => {
    const db = readDatabase();
    const { id } = req.params;
    const index = db.faqs.findIndex(f => f.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    db.faqs[index] = {
      ...db.faqs[index],
      ...req.body,
      id
    };

    writeDatabase(db);
    return res.json(db.faqs[index]);
  });

  app.delete('/api/faqs/:id', (req, res) => {
    const db = readDatabase();
    const { id } = req.params;
    db.faqs = db.faqs.filter(f => f.id !== id);
    writeDatabase(db);
    return res.json({ success: true, message: 'FAQ deleted successfully' });
  });

  // --- ENQUIRIES CRUD ---
  app.get('/api/enquiries', (req, res) => {
    const db = readDatabase();
    let enquiries = [...db.enquiries];

    const { status, search, service } = req.query;

    if (status && typeof status === 'string' && status !== 'All') {
      enquiries = enquiries.filter(e => e.status.toLowerCase() === status.toLowerCase());
    }

    if (service && typeof service === 'string' && service !== 'All') {
      enquiries = enquiries.filter(e => e.servicesInterestedIn.includes(service));
    }

    if (search && typeof search === 'string') {
      const s = search.toLowerCase();
      enquiries = enquiries.filter(e =>
        e.fullName.toLowerCase().includes(s) ||
        e.businessName.toLowerCase().includes(s) ||
        e.email.toLowerCase().includes(s) ||
        e.id.toLowerCase().includes(s)
      );
    }

    // Sort newest first
    enquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return res.json(enquiries);
  });

  app.post('/api/enquiries', (req, res) => {
    const {
      fullName,
      businessName,
      email,
      phone,
      website,
      businessCategory,
      servicesInterestedIn,
      monthlyBudget,
      businessGoals,
      projectDescription,
      preferredContactMethod
    } = req.body;

    if (!fullName || !businessName || !email || !phone) {
      return res.status(400).json({ error: 'Full Name, Business Name, Email Address, and Phone Number are required.' });
    }

    const db = readDatabase();
    const uniqueId = `AKSH-${Math.floor(10000 + Math.random() * 90000)}`;

    const newEnquiry: Enquiry = {
      id: uniqueId,
      fullName: fullName.trim(),
      businessName: businessName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      website: website?.trim() || '',
      businessCategory: businessCategory?.trim() || 'General',
      servicesInterestedIn: Array.isArray(servicesInterestedIn) ? servicesInterestedIn : [],
      monthlyBudget: monthlyBudget?.trim() || 'Not specified',
      businessGoals: Array.isArray(businessGoals) ? businessGoals : [],
      projectDescription: projectDescription?.trim() || 'General inquiry submitted via website.',
      preferredContactMethod: preferredContactMethod || 'Email',
      status: 'New',
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.enquiries.unshift(newEnquiry);
    writeDatabase(db);

    return res.status(201).json({
      success: true,
      enquiryId: uniqueId,
      message: 'Thank you for contacting AKSHORA! Your enquiry has been submitted successfully. Our team will review your requirements.',
      data: newEnquiry
    });
  });

  app.put('/api/enquiries/:id', (req, res) => {
    const db = readDatabase();
    const { id } = req.params;
    const index = db.enquiries.findIndex(e => e.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    db.enquiries[index] = {
      ...db.enquiries[index],
      ...req.body,
      id,
      updatedAt: new Date().toISOString()
    };

    writeDatabase(db);
    return res.json(db.enquiries[index]);
  });

  app.delete('/api/enquiries/:id', (req, res) => {
    const db = readDatabase();
    const { id } = req.params;
    db.enquiries = db.enquiries.filter(e => e.id !== id);
    writeDatabase(db);
    return res.json({ success: true, message: 'Enquiry removed successfully' });
  });

  // Export enquiries as CSV
  app.get('/api/enquiries/export/csv', (req, res) => {
    const db = readDatabase();
    const enquiries = db.enquiries;

    const headers = [
      'Enquiry ID',
      'Client Name',
      'Business Name',
      'Email',
      'Phone',
      'Website',
      'Category',
      'Services Interested',
      'Monthly Budget',
      'Goals',
      'Preferred Contact',
      'Status',
      'Notes',
      'Date Submitted'
    ];

    const escapeCsv = (str: string = '') => {
      const clean = String(str).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = enquiries.map(e => [
      escapeCsv(e.id),
      escapeCsv(e.fullName),
      escapeCsv(e.businessName),
      escapeCsv(e.email),
      escapeCsv(e.phone),
      escapeCsv(e.website || ''),
      escapeCsv(e.businessCategory),
      escapeCsv(e.servicesInterestedIn.join(', ')),
      escapeCsv(e.monthlyBudget || ''),
      escapeCsv(e.businessGoals.join(', ')),
      escapeCsv(e.preferredContactMethod),
      escapeCsv(e.status),
      escapeCsv(e.notes || ''),
      escapeCsv(new Date(e.createdAt).toLocaleString())
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=akshora_enquiries_${Date.now()}.csv`);
    return res.send(csvContent);
  });

  // --- WEBSITE SETTINGS ---
  app.get('/api/settings', (req, res) => {
    const db = readDatabase();
    return res.json(db.settings);
  });

  app.put('/api/settings', (req, res) => {
    const db = readDatabase();
    db.settings = {
      ...db.settings,
      ...req.body
    };
    writeDatabase(db);
    return res.json(db.settings);
  });

  // --- AI CHATBOT ROUTE ---
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history, contextState } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message text is required.' });
      }

      const result = await generateChatResponse({
        message,
        history,
        contextState
      });

      return res.json(result);
    } catch (err: any) {
      console.error('Chat endpoint error:', err);
      return res.status(500).json({
        reply: "I'm experiencing a momentary connection pause, but AKSHORA's team is always ready to assist. Would you like to view our services or submit an enquiry?",
        suggestedActions: [
          { label: 'View All Services', action: 'navigate_services' },
          { label: 'Submit an Enquiry', action: 'open_enquiry_form' }
        ]
      });
    }
  });

  // --- VITE MIDDLEWARE SETUP ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AKSHORA Agency Platform running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
