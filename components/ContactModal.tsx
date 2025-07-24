
import React, { useState, useEffect, FormEvent } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useContactModal } from '../contexts/ContactModalContext';
import type { Service } from '../types';
import { X, Loader2, Send, ChevronDown } from 'lucide-react';
import { useSiteContent } from '../contexts/SiteContentContext';

const ContactModal: React.FC = () => {
  const { isOpen, closeModal, options } = useContactModal();
  const { content } = useSiteContent();
  
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
    if (isOpen) {
      // Reset form and set initial values when modal opens
      setStatus('idle');
      setError('');
      setFormData({
        name: '',
        email: '',
        company: '',
        serviceId: options.serviceId || '',
        message: '',
      });
    }
  }, [isOpen, options.serviceId]);

  if (!isOpen || !content) {
    return null;
  }

  const allServices: Service[] = content.services;
  const { footer } = content;
  
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
      const subject = options.subject || 'New Inquiry from Website';
      const mailtoLink = `mailto:${footer.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
      
      setStatus('success');
      window.location.href = mailtoLink;

      setTimeout(() => {
        closeModal();
      }, 3000); // Close modal after 3 seconds

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
    <div 
      id="contact-modal-backdrop"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-bg/80 backdrop-blur-sm animate-fade-in"
      onClick={closeModal}
      aria-modal="true"
      role="dialog"
    >
      <div 
        id="contact-modal-container"
        className="bg-brand-surface rounded-2xl shadow-2xl w-full max-w-lg m-4 border border-brand-primary/20 relative animate-fade-in-up"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <button 
          onClick={closeModal}
          className="absolute top-4 right-4 text-brand-gray/60 hover:text-brand-light transition-colors"
          aria-label="Close contact form"
        >
          <X size={24} />
        </button>
        
        <div id="contact-modal-header" className="p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-brand-light">Contact Us</h2>
            <p className="text-brand-gray/80 mt-1">Let's build something great together.</p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-4">
          <div id="contact-modal-form-grid" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div id="contact-modal-form-name-wrapper">
              <label htmlFor="name" className="block text-sm font-medium text-brand-gray mb-1">Full Name <span className="text-brand-secondary">*</span></label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className="w-full bg-brand-bg border border-brand-primary/30 rounded-lg px-3 py-2 text-brand-light focus:ring-brand-secondary focus:border-brand-secondary transition-colors"/>
            </div>
            <div id="contact-modal-form-email-wrapper">
              <label htmlFor="email" className="block text-sm font-medium text-brand-gray mb-1">Email Address <span className="text-brand-secondary">*</span></label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full bg-brand-bg border border-brand-primary/30 rounded-lg px-3 py-2 text-brand-light focus:ring-brand-secondary focus:border-brand-secondary transition-colors"/>
            </div>
          </div>
          <div id="contact-modal-form-company-wrapper">
            <label htmlFor="company" className="block text-sm font-medium text-brand-gray mb-1">Company (Optional)</label>
            <input type="text" id="company" name="company" value={formData.company} onChange={handleInputChange} className="w-full bg-brand-bg border border-brand-primary/30 rounded-lg px-3 py-2 text-brand-light focus:ring-brand-secondary focus:border-brand-secondary transition-colors"/>
          </div>
          <div id="contact-modal-form-service-wrapper">
            <label htmlFor="serviceId" className="block text-sm font-medium text-brand-gray mb-1">Service of Interest</label>
            <div id="contact-modal-form-select-wrapper" className="relative">
              <select id="serviceId" name="serviceId" value={formData.serviceId} onChange={handleInputChange} className="w-full bg-brand-bg border border-brand-primary/30 rounded-lg pl-3 pr-8 py-2 text-brand-light focus:ring-brand-secondary focus:border-brand-secondary transition-colors appearance-none">
                <option value="">-- General Inquiry --</option>
                {allServices.map(service => (
                  <option key={service.id} value={service.id}>{service.title}</option>
                ))}
              </select>
              <div id="contact-modal-form-select-icon-wrapper" className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-brand-gray">
                  <ChevronDown size={16} />
              </div>
            </div>
          </div>
          <div id="contact-modal-form-message-wrapper">
            <label htmlFor="message" className="block text-sm font-medium text-brand-gray mb-1">Your Message <span className="text-brand-secondary">*</span></label>
            <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} rows={5} required className="w-full bg-brand-bg border border-brand-primary/30 rounded-lg px-3 py-2 text-brand-light focus:ring-brand-secondary focus:border-brand-secondary transition-colors resize-y"/>
          </div>
          
          <div id="contact-modal-form-submit-wrapper" className="pt-4">
            <button type="submit" disabled={status === 'loading' || status === 'success'} className="w-full flex items-center justify-center px-6 py-3 font-bold rounded-lg text-brand-dark-text bg-brand-secondary hover:bg-yellow-500 disabled:bg-brand-gray disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100">
              {status === 'loading' && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {status === 'success' ? 'Redirecting to Email...' : 'Craft & Send Inquiry'}
              {status !== 'loading' && status !== 'success' && <Send className="ml-2 h-5 w-5" />}
            </button>
          </div>

          {status === 'error' && <p className="text-sm text-red-400 mt-2 text-center">{error}</p>}
          {status === 'success' && <p className="text-sm text-green-400 mt-2 text-center">Success! Your email client is opening.</p>}
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
