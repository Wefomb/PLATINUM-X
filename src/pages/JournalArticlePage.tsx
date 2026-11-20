import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { JournalArticle } from '../../shared/types.ts';
import { fetchJournalArticle } from '../services/api.ts';
import { SafeImage } from '../components/common/SafeImage.tsx';
import { EditorialReveal } from '../animations/EditorialReveal.tsx';

export function JournalArticlePage() {
  const { slug = 'presence-is-a-quiet-thing' } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<JournalArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchJournalArticle(slug)
      .then((item) => {
        if (active) setArticle(item);
      })
      .catch((err: any) => {
        if (active) setError(err?.message || 'Article not found.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <section className="bg-[#F5F3EE] px-6 sm:px-10 lg:px-12 py-16">
        <div className="max-w-4xl mx-auto animate-pulse space-y-6">
          <div className="h-4 w-32 bg-[#DCDAD5]" />
          <div className="h-12 w-2/3 bg-[#DCDAD5]" />
          <div className="aspect-[4/3] bg-[#E5E3DC]" />
        </div>
      </section>
    );
  }

  if (error || !article) {
    return (
      <section className="bg-[#F5F3EE] px-6 sm:px-10 lg:px-12 py-24">
        <div className="max-w-xl mx-auto">
          <h1 className="font-serif text-4xl font-light text-[#101010] mb-4">Note not found.</h1>
          <Link to="/journal" className="px-link-underline text-xs text-[#101010]">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            <span>Back to Journal</span>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <article className="bg-[#F5F3EE] text-[#101010] px-6 sm:px-10 lg:px-12 pt-12 pb-24">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/journal"
          className="inline-flex items-center gap-2 text-xs text-[#6A6967] hover:text-[#101010] transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Journal</span>
        </Link>

        <p className="text-[10px] uppercase tracking-[0.2em] text-[#6A6967] mb-3">
          {article.eyebrow}
        </p>
        <EditorialReveal
          as="h1"
          immediate
          lines={[article.title]}
          className="font-serif text-4xl sm:text-5xl lg:text-[52px] font-light leading-[1.06] text-[#101010] mb-10"
        />

        <div className="aspect-[640/560] bg-[#101010] border border-[#DCDAD5] overflow-hidden mb-10">
          <SafeImage
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-2xl space-y-5 text-sm leading-relaxed text-[#101010]/85">
          {article.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[#DCDAD5]">
          <Link
            to={article.ctaTo}
            className="inline-flex items-center justify-between gap-6 bg-[#101010] text-[#F5F3EE] px-6 py-3.5 text-xs tracking-[0.04em] hover:bg-[#171716] transition-colors"
          >
            <span>{article.ctaLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
