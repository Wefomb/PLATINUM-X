import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { submitContactInquiry } from '../services/api.ts';
import { EditorialReveal } from '../animations/EditorialReveal.tsx';

export function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'Sizing & garment measurements',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setFeedback('');
    try {
      const res = await submitContactInquiry(form);
      setStatus('success');
      setFeedback(`${res.message} Reference: ${res.reference}`);
      setForm({ name: '', email: '', subject: 'Sizing & garment measurements', message: '' });
    } catch (err: any) {
      setStatus('error');
      setFeedback(err?.message || 'Unable to send your message.');
    }
  };

  return (
    <section className="bg-[#F5F3EE] text-[#101010] px-6 sm:px-10 lg:px-12 pt-14 pb-24">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#6A6967] mb-3">
            STUDIO CONTACT
          </p>
          <EditorialReveal
            as="h1"
            immediate
            lines={['Speak with', 'the studio.']}
            className="font-serif text-4xl sm:text-5xl font-light leading-[1.06] text-[#101010] mb-5"
          />
          <p className="text-xs sm:text-sm text-[#6A6967] leading-relaxed mb-8">
            Request garment measurements for Collection 001, confirm availability, or enquire
            about private releases.
          </p>
          <div className="border-t border-[#DCDAD5] pt-5 space-y-3 text-xs text-[#6A6967]">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#101010]">
              DIRECT ENQUIRIES
            </p>
            <p>Measurements, sizing and order confirmation are handled directly by the studio.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="px-contact-name" className="block text-[10px] uppercase tracking-[0.18em] text-[#6A6967] mb-2">
                Name
              </label>
              <input
                id="px-contact-name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-[#DCDAD5] bg-transparent px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#101010]"
              />
            </div>
            <div>
              <label htmlFor="px-contact-email" className="block text-[10px] uppercase tracking-[0.18em] text-[#6A6967] mb-2">
                Email
              </label>
              <input
                id="px-contact-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-[#DCDAD5] bg-transparent px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#101010]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="px-contact-subject" className="block text-[10px] uppercase tracking-[0.18em] text-[#6A6967] mb-2">
              Subject
            </label>
            <select
              id="px-contact-subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full border border-[#DCDAD5] bg-[#F5F3EE] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#101010]"
            >
              <option value="Sizing & garment measurements">Sizing &amp; garment measurements</option>
              <option value="Collection 001 availability">Collection 001 availability</option>
              <option value="Order follow-up">Order follow-up</option>
              <option value="Press & editorial">Press &amp; editorial</option>
            </select>
          </div>

          <div>
            <label htmlFor="px-contact-msg" className="block text-[10px] uppercase tracking-[0.18em] text-[#6A6967] mb-2">
              Message
            </label>
            <textarea
              id="px-contact-msg"
              rows={5}
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Share the piece and size you are considering..."
              className="w-full border border-[#DCDAD5] bg-transparent px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#101010]"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="inline-flex items-center justify-between gap-6 bg-[#101010] text-[#F5F3EE] px-6 py-3.5 text-xs tracking-[0.04em] hover:bg-[#171716] transition-colors cursor-pointer disabled:opacity-45"
          >
            <span>{status === 'submitting' ? 'Sending...' : 'Send enquiry'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {feedback && (
            <p role="status" className="text-xs text-[#101010] pt-1">
              {feedback}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
