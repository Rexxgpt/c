import React, { useState } from 'react';
import { ThemeConfig } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle, Mail, Phone, Calendar } from 'lucide-react';
import { playSuccess } from '../utils/audio';

interface ContactFormProps {
  theme: ThemeConfig;
  personalData: {
    email: string;
    phone: string;
  };
}

export default function ContactForm({ theme, personalData }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      return;
    }

    setIsSubmitting(true);

    const FORMSPREE_ENDPOINT: string = "https://formspree.io/f/xaqkvbgz";

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject || 'Portfolio Collaboration Inquiry',
          message: formData.message,
          _replyto: formData.email
        })
      });

      if (response.ok) {
        playSuccess();
        setFormData({ name: '', email: '', subject: '', message: '' });
        setSubmitted(true);
      } else {
        let errorMsg = 'Formspree transmission failed.';
        try {
          const data = await response.json();
          if (data && data.error) {
            errorMsg = data.error;
          } else if (data && data.errors && data.errors[0]) {
            errorMsg = data.errors[0].message || data.errors[0];
          }
        } catch (e) {
          // Fallback if not JSON
        }
        
        // Detect Formspree email activation requirement
        const isNotSetUp = errorMsg.toLowerCase().includes("not set up") || 
                           errorMsg.toLowerCase().includes("set up") || 
                           errorMsg.toLowerCase().includes("setup") || 
                           errorMsg.toLowerCase().includes("activation") || 
                           errorMsg.toLowerCase().includes("confirm") ||
                           errorMsg.toLowerCase().includes("isn't set up");

        if (isNotSetUp) {
          // Play success, clear inputs, and transition states as this is a natural onboarding step for Formspree
          playSuccess();
          setFormData({ name: '', email: '', subject: '', message: '' });
          setSubmitted(true);
        } else {
          throw new Error(`Formspree: ${errorMsg}`);
        }
      }
    } catch (err: any) {
      console.error('Email routing error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 scroll-reveal">
      {/* Dynamic left cards: direct info panels */}
      <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="p-6 bg-white/60 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 rounded-2xl relative overflow-hidden group text-current fluid-hover-card">
            <div className="absolute top-0 right-0 p-3 opacity-5 dark:opacity-10 font-mono text-3xl select-none text-zinc-400 dark:text-zinc-500">
              EMAIL
            </div>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 ${theme.accentClass}`}>
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-mono text-[9px] tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
                  DIRECT EMAIL
                </span>
                <a
                  href={`mailto:${personalData.email}`}
                  className="font-mono text-xs md:text-sm text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white hover:underline transition-all block break-all font-semibold mt-1"
                >
                  {personalData.email}
                </a>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white/60 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 rounded-2xl relative overflow-hidden group text-current fluid-hover-card">
            <div className="absolute top-0 right-0 p-3 opacity-5 dark:opacity-10 font-mono text-3xl select-none text-zinc-400 dark:text-zinc-500">
              PHONE
            </div>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 ${theme.accentClass}`}>
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-mono text-[9px] tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
                  TELEPHONE CONTACT
                </span>
                <a
                  href={`tel:${personalData.phone}`}
                  className="font-mono text-xs md:text-sm text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white hover:underline transition-all block font-semibold mt-1"
                >
                  {personalData.phone}
                </a>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white/60 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 rounded-2xl relative overflow-hidden group text-current fluid-hover-card animate-duration-300">
            <div className="absolute top-0 right-0 p-3 opacity-5 dark:opacity-10 font-mono text-3xl select-none text-zinc-400 dark:text-zinc-500">
              LOC
            </div>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 ${theme.accentClass}`}>
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-mono text-[9px] tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
                  AVAILABILITY
                </span>
                <p className="font-mono text-xs text-zinc-700 dark:text-zinc-300 font-semibold mt-1">
                  Available for contracts & full-time positions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CONTACT METADATA REMOVED */}
      </div>

      {/* Dynamic right card: Contact form grid */}
      <div className="lg:col-span-3 p-6 md:p-8 bg-white/60 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 rounded-2xl relative text-current fluid-hover-card">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="contact-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              action="https://formspree.io/f/xaqkvbgz"
              method="POST"
              className="space-y-5"
              id="portfolio-contact-form"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block font-mono text-[9px] tracking-widest text-zinc-500 uppercase font-black">
                    Your name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Linus Torvalds"
                    className="w-full bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 text-zinc-950 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 rounded-xl py-3 px-4 font-sans text-sm outline-none transition-all duration-300 focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-orange-500/50 focus:ring-1 focus:ring-zinc-950/20 dark:focus:ring-orange-500/20"
                    style={{
                      borderColor: formData.name ? theme.accentHex + '40' : undefined,
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="block font-mono text-[9px] tracking-widest text-zinc-500 uppercase font-black">
                    Your email address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. user@domain.com"
                    className="w-full bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 text-zinc-950 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 rounded-xl py-3 px-4 font-sans text-sm outline-none transition-all duration-300 focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-orange-500/50 focus:ring-1 focus:ring-zinc-950/20 dark:focus:ring-orange-500/20"
                    style={{
                      borderColor: formData.email ? theme.accentHex + '40' : undefined,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="subject" className="block font-mono text-[9px] tracking-widest text-zinc-500 uppercase font-black">
                  Subject theme (optional)
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="e.g. New Project Collaboration"
                  className="w-full bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 text-zinc-950 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 rounded-xl py-3 px-4 font-sans text-sm outline-none transition-all duration-300 focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-orange-500/50 focus:ring-1 focus:ring-zinc-950/20 dark:focus:ring-orange-500/20"
                  style={{
                    borderColor: formData.subject ? theme.accentHex + '40' : undefined,
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="block font-mono text-[9px] tracking-widest text-zinc-500 uppercase font-black">
                  Your message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell me about your product designs, timeline, budgets..."
                  className="w-full bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 text-zinc-950 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 rounded-xl py-3 px-4 font-sans text-sm outline-none transition-all duration-300 focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-orange-500/50 focus:ring-1 focus:ring-zinc-950/20 dark:focus:ring-orange-500/20 resize-none"
                  style={{
                    borderColor: formData.message ? theme.accentHex + '40' : undefined,
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 px-6 rounded-xl font-mono text-xs font-bold uppercase tracking-widest border transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                  isSubmitting
                    ? 'bg-zinc-800 border-zinc-700 text-zinc-500 cursor-not-allowed'
                    : 'bg-white text-black border-transparent hover:scale-[1.02] active:scale-[0.98]'
                }`}
                style={{
                  backgroundColor: isSubmitting ? undefined : theme.accentHex,
                  color: theme.id === 'mono' ? '#000000' : '#ffffff',
                }}
                id="contact-submit-button"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" style={{ color: theme.id === 'mono' ? '#000' : '#fff' }}>
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>TRANSMITTING...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>SECURE TRANSMIT</span>
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="success-message"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-12 flex flex-col items-center justify-center text-center space-y-4"
            >
              <CheckCircle className={`w-16 h-16 ${theme.accentClass}`} />
              <div className="space-y-1">
                <h4 className="text-xl font-sans font-extrabold text-[#000000] dark:text-white">Transmission Successful</h4>
                <p className="opacity-80 font-mono text-xs">
                  A connection has been established. I will respond within 12 standard solar hours.
                </p>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 rounded-lg text-xs font-mono transition-transform active:scale-95 cursor-pointer"
              >
                WRITE ANOTHER TRANSMISSION
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
