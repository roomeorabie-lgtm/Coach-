import React from 'react';
import { useApp } from '../context/AppContext';
import { BeforeAfterCard } from '../components/BeforeAfterCard';
import { HorizontalCarousel } from '../components/HorizontalCarousel';
import { Trophy, Flame } from 'lucide-react';

export const TransformationsView: React.FC = () => {
  const { db, t } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest">
          <Trophy className="w-4 h-4" />
          {t('provenSuccess')}
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
          {t('clientTransformations')}
        </h1>
        <p className="text-sm text-gray-300 max-w-2xl mx-auto">
          {t('transformationsPageSubtitle')}
        </p>
      </div>

      {/* Transformations Carousel */}
      {db.transformations.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-3">
          <Flame className="w-12 h-12 text-gray-500 mx-auto stroke-1" />
          <h3 className="font-heading font-bold text-lg text-white">{t('noTransformationsYet')}</h3>
          <p className="text-xs text-gray-400">
            {t('checkBackSoon')}
          </p>
        </div>
      ) : (
        <HorizontalCarousel itemGap="gap-8">
          {db.transformations.map((tf) => (
            <div key={tf.id} className="w-[88vw] sm:w-[500px] shrink-0 snap-center">
              <BeforeAfterCard transformation={tf} />
            </div>
          ))}
        </HorizontalCarousel>
      )}

    </div>
  );
};
