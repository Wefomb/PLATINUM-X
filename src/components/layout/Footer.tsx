import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { subscribeNewsletter } from '../../services/api.ts';
import { PlatinumWordmark } from '../brand/BrandMarks.tsx';

export function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatus('error');
      setFeedback('Please enter an email address.');
      return;
    }

    setStatus('submitting');
    setFeedback('');
    try {
      const res = await subscribeNewsletter(email.trim());
      setStatus('success');
      setFeedback(res.message);
      if (!res.alreadySubscribed) setEmail('');
    } catch (err: any) {
      setStatus('error');
      setFeedback(err?.message || 'Unable to join the list right now.');
    }
  };

  return (
    <footer className="bg-[#F5F3EE] text-[#101010] border-t border-[#DCDAD5] px-6 sm:px-10 lg:px-14 pt-16 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-14 border-b border-[#DCDAD5] items-end">
          <div className="lg:col-span-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#6A6967] mb-3">
              THE PRIVATE LIST
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-light leading-[1.08] text-[#101010]">
              Good things. In good time.
            </h2>
            <p className="text-xs text-[#6A6967] mt-4">
              New releases, studio notes and considered updates.
            </p>
          </div>

          <div className="lg:col-span-6">
            <form onSubmit={handleSubmit} noValidate>
              <div className="flex items-center justify-between gap-4 border-b border-[#101010]/25 focus-within:border-[#101010] pb-2.5 transition-colors">
                <label htmlFor="px-footer-email" className="sr-only">
                  Your email address
                </label>
                <input
                  id="px-footer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  disabled={status === 'submitting'}
                  className="w-full bg-transparent text-xs sm:text-sm text-[#101010] placeholder:text-[#6A6967] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="inline-flex items-center gap-1.5 text-xs text-[#101010] hover:opacity-70 transition-opacity whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-40"
                >
                  <span>{status === 'submitting' ? 'Joining...' : 'Join the list'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {feedback && (
                <p
                  role="status"
                  className={`mt-2.5 text-xs ${
                    status === 'error' ? 'text-[#101010] font-medium' : 'text-[#6A6967]'
                  }`}
                >
                  {feedback}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="pt-8 flex flex-col gap-6">
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#6A6967]"
          >
            <Link to="/collection" className="hover:text-[#101010] transition-colors">
              Collection
            </Link>
            <Link to="/story" className="hover:text-[#101010] transition-colors">
              Our story
            </Link>
            <Link to="/journal" className="hover:text-[#101010] transition-colors">
              Journal
            </Link>
            <Link to="/" className="hover:text-[#101010] transition-colors">
              Back to home
            </Link>
            <Link to="/contact" className="hover:text-[#101010] transition-colors">
              Contact
            </Link>
            <Link to="/policies" className="hover:text-[#101010] transition-colors">
              Shipping &amp; returns
            </Link>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
            <PlatinumWordmark className="text-xl sm:text-2xl tracking-[0.24em] text-[#101010]" />
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#6A6967]">
              LESS NOISE. MORE PRESENCE. / &copy; PLATINUM X {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
