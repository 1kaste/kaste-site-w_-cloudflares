

import React, { useState, FormEvent, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { getServices, getSiteContent } from '../services/siteContent';
import AnimateOnScroll from './AnimateOnScroll';
import { Loader2, Send, ChevronDown, Mail, Phone, MapPin } from 'lucide-react';

const ContactPage: React.FC = () => {
  const allServices = getServices();
  const { contact, footer } = getSiteContent();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    serviceId: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setError('');

    try {
      const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;
      if (!apiKey) {
        throw new Error("API_KEY environment variable not set.");
      }
      const ai = new GoogleGenAI({ apiKey: apiKey });
      
      const selectedService = allServices.find(s => s.id === formData.serviceId);
      const selectedServiceName = selectedService ? selectedService.title : 'General Inquiry';

      const prompt = `As a professional communications assistant, your task is to format a client inquiry into a clean, polite, and well-structured email body. The user has provided the following details through a contact form.

- **Client Name:** ${formData.name}
- **Company (if provided):** ${formData.company || 'Not provided'}
- **Service of Interest:** ${selectedServiceName}
- **Client's Message:**
  ${formData.message}

Please format this into an email body ONLY. Do not add a subject line or "To/From" fields. The tone should be professional but approachable. Start with a polite greeting addressing the company (e.g., "Hello Kaste Brands & Designs team,"), and structure the user's message clearly. Conclude with a polite closing from the client (e.g., "Best regards," followed by their name).`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      
      const emailBody = response.text;
      const subject = `New Inquiry: ${selectedServiceName}`;
      const mailtoLink = `mailto:${contact.details.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
      
      setStatus('success');
      window.location.href = mailtoLink;

      setTimeout(() => {
        setStatus('idle');
        setFormData({ name: '', email: '', company: '', serviceId: '', message: '' });
      }, 5000);

    } catch (err) {
      console.error("Error generating email body:", err);
      let errorMessage = 'Failed to process request. Please try again later.';
      if (err instanceof Error) {
        errorMessage = `An error occurred: ${err.message}. You can still copy your message and email us directly.`;
      }
      setError(errorMessage);
      setStatus('error');
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-8 sm:pb-12">
        <div id="contact-page-container" className="animate-fade-in-up">
        <header id="contact-page-header" className="text-center mb-10 sm:mb-12">
            <h1 className="text-4xl sm:text-6xl font-extrabold font-heading text-brand-light">
            {contact.hero.title}
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-base sm:text-lg text-brand-gray/80">
            {contact.hero.subtitle}
            </p>
        </header>

        <div id="contact-page-grid" className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12">
            {/* Form Section */}
            <AnimateOnScroll id="contact-form-wrapper" className="lg:col-span-3 bg-brand-surface p-6 sm:p-8 rounded-2xl border border-brand-primary/20">
            <h2 className="text-2xl font-bold font-heading text-brand-light mb-1">Send us a Message</h2>
            <p className="text-brand-gray/80 mb-6">We'll get back to you as soon as possible.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div id="contact-form-grid-names" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div id="contact-form-name-wrapper">
                    <label htmlFor="contact-page-name" className="block text-sm font-medium text-brand-gray mb-1">Full Name <span className="text-brand-secondary">*</span></label>
                    <input type="text" id="contact-page-name" name="name" value={formData.name} onChange={handleInputChange} required className="w-full bg-brand-bg border border-brand-primary/30 rounded-lg px-3 py-2 text-brand-light focus:ring-brand-secondary focus:border-brand-secondary transition-colors"/>
                </div>
                <div id="contact-form-email-wrapper">
                    <label htmlFor="contact-page-email" className="block text-sm font-medium text-brand-gray mb-1">Email Address <span className="text-brand-secondary">*</span></label>
                    <input type="email" id="contact-page-email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full bg-brand-bg border border-brand-primary/30 rounded-lg px-3 py-2 text-brand-light focus:ring-brand-secondary focus:border-brand-secondary transition-colors"/>
                </div>
                </div>
                <div id="contact-form-company-wrapper">
                <label htmlFor="contact-page-company" className="block text-sm font-medium text-brand-gray mb-1">Company (Optional)</label>
                <input type="text" id="contact-page-company" name="company" value={formData.company} onChange={handleInputChange} className="w-full bg-brand-bg border border-brand-primary/30 rounded-lg px-3 py-2 text-brand-light focus:ring-brand-secondary focus:border-brand-secondary transition-colors"/>
                </div>
                <div id="contact-form-service-wrapper">
                <label htmlFor="contact-page-serviceId" className="block text-sm font-medium text-brand-gray mb-1">Service of Interest</label>
                <div id="contact-form-service-select-wrapper" className="relative">
                    <select id="contact-page-serviceId" name="serviceId" value={formData.serviceId} onChange={handleInputChange} className="w-full bg-brand-bg border border-brand-primary/30 rounded-lg pl-3 pr-8 py-2 text-brand-light focus:ring-brand-secondary focus:border-brand-secondary transition-colors appearance-none">
                    <option value="">-- General Inquiry --</option>
                    {allServices.map(service => (
                        <option key={service.id} value={service.id}>{service.title}</option>
                    ))}
                    </select>
                    <div id="contact-page-form-select-icon-wrapper" className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-brand-gray">
                        <ChevronDown size={16} />
                    </div>
                </div>
                </div>
                <div id="contact-form-message-wrapper">
                <label htmlFor="contact-page-message" className="block text-sm font-medium text-brand-gray mb-1">Your Message <span className="text-brand-secondary">*</span></label>
                <textarea id="contact-page-message" name="message" value={formData.message} onChange={handleInputChange} rows={4} required className="w-full bg-brand-bg border border-brand-primary/30 rounded-lg px-3 py-2 text-brand-light focus:ring-brand-secondary focus:border-brand-secondary transition-colors resize-y"/>
                </div>
                <div id="contact-form-submit-wrapper" className="pt-2">
                <button type="submit" disabled={status === 'loading' || status === 'success'} className="w-full flex items-center justify-center px-6 py-3 font-bold rounded-lg text-brand-dark-text bg-brand-secondary hover:bg-yellow-500 disabled:bg-brand-gray disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100">
                    {status === 'loading' && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    {status === 'success' ? 'Redirecting...' : 'Craft & Send Inquiry'}
                    {status !== 'loading' && status !== 'success' && <Send className="ml-2 h-5 w-5" />}
                </button>
                </div>
                {status === 'error' && <p className="text-sm text-red-400 mt-2 text-center">{error}</p>}
                {status === 'success' && <p className="text-sm text-green-400 mt-2 text-center">Success! Your email client should be opening.</p>}
            </form>
            </AnimateOnScroll>

            {/* Info Section */}
            <AnimateOnScroll id="contact-info-wrapper" className="lg:col-span-2 space-y-8" delay={200}>
            <div id="contact-info-details-wrapper">
                <h2 className="text-2xl font-bold font-heading text-brand-light mb-4">Contact Details</h2>
                <div id="contact-info-details-list" className="space-y-4 text-brand-gray/90">
                    <a id="contact-info-email-item" href={`mailto:${contact.details.email}`} className="flex items-center group">
                        <div id="contact-info-email-item-icon" className="p-3 bg-brand-surface rounded-full mr-4 border border-brand-primary/20 group-hover:bg-brand-primary/50 transition-colors">
                            <Mail className="w-5 h-5 text-brand-secondary" />
                        </div>
                        <div id="contact-info-email-item-text">
                            <span className="font-semibold text-brand-light">Email</span>
                            <p className="text-sm group-hover:text-brand-secondary transition-colors">{contact.details.email}</p>
                        </div>
                    </a>
                    <a id="contact-info-phone-item" href={`tel:${contact.details.phone}`} className="flex items-center group">
                        <div id="contact-info-phone-item-icon" className="p-3 bg-brand-surface rounded-full mr-4 border border-brand-primary/20 group-hover:bg-brand-primary/50 transition-colors">
                            <Phone className="w-5 h-5 text-brand-secondary" />
                        </div>
                        <div id="contact-info-phone-item-text">
                            <span className="font-semibold text-brand-light">Phone</span>
                            <p className="text-sm group-hover:text-brand-secondary transition-colors">{contact.details.phone}</p>
                        </div>
                    </a>
                    <div id="contact-info-location-item" className="flex items-center">
                        <div id="contact-info-location-item-icon" className="p-3 bg-brand-surface rounded-full mr-4 border border-brand-primary/20">
                            <MapPin className="w-5 h-5 text-brand-secondary" />
                        </div>
                        <div id="contact-info-location-item-text">
                            <span className="font-semibold text-brand-light">Location</span>
                            <p className="text-sm">{contact.details.location}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div id="contact-info-social-wrapper">
                <h2 className="text-2xl font-bold font-heading text-brand-light mb-4">Follow Us</h2>
                <div id="contact-info-social-links-container" className="flex flex-wrap gap-4">
                {footer.socialLinks.map(({ url, label, iconUrl }) => (
                    <a 
                        key={label}
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label={label} 
                        className="text-brand-gray bg-brand-surface p-3 rounded-full border border-brand-primary/20 hover:text-brand-secondary hover:bg-brand-primary/20 transition-all transform hover:scale-110"
                    >
                        <img src={iconUrl} alt={label} className="h-6 w-6 object-contain" />
                    </a>
                ))}
                </div>
            </div>
            </AnimateOnScroll>
        </div>
        </div>
    </div>
  );
};

export default ContactPage;