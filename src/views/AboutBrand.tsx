'use client';

import React from 'react';
import { ShieldCheck, Heart, Leaf, Award } from 'lucide-react';

export default function AboutBrand() {
  return (
    <div className="w-full animate-fade-up text-left font-sans">
      
      {/* Brand Hero Banner */}
      <div className="relative h-[280px] sm:h-[400px] w-full overflow-hidden flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1200&auto=format&fit=crop&q=80" 
          alt="Ethos Banner" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-primary/45 backdrop-blur-xs"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl sm:text-5xl font-serif font-medium tracking-wide">Our Ethos</h1>
          <span className="text-xs sm:text-sm tracking-[4px] uppercase text-bg-cream block mt-2">Pure. Mindful. Luxury.</span>
        </div>
      </div>

      {/* Brand Story Section */}
      <div className="bg-white py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col gap-6">
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-text-dark">The Lumière Story</h2>
          <p className="text-sm sm:text-base text-text-medium leading-relaxed">
            Founded in Noida, India, Lumière was born out of a desire to create clean, high-performance skincare that combines the wisdom of traditional botanicals with modern dermatological science.
          </p>
          <p className="text-sm sm:text-base text-text-medium leading-relaxed">
            We believe skincare should be an indulgent ritual of self-love. Every drop of our formulations is crafted to feed your skin cells with biocompatible nutrients that restore your natural, glass-like glow without compromising on luxury.
          </p>
        </div>
      </div>

      {/* Clean Standards Section */}
      <div className="bg-bg-peach py-12 sm:py-16 border-y border-border-lumi">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-text-dark text-center mb-10">Our Clean Standards</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-border-lumi rounded-2xl p-6 shadow-xs flex flex-col items-center sm:items-start text-center sm:text-left gap-3">
              <div className="w-10 h-10 rounded-full bg-bg-peach flex items-center justify-center text-primary border border-border-lumi">
                <Leaf size={20} />
              </div>
              <h3 className="text-sm font-bold text-text-dark uppercase tracking-wider">100% Vegan</h3>
              <p className="text-xs text-text-light leading-relaxed">
                We never use animal-derived ingredients like carmine or lanolin in our skincare formulations.
              </p>
            </div>
            
            <div className="bg-white border border-border-lumi rounded-2xl p-6 shadow-xs flex flex-col items-center sm:items-start text-center sm:text-left gap-3">
              <div className="w-10 h-10 rounded-full bg-bg-peach flex items-center justify-center text-primary border border-border-lumi">
                <Heart size={20} />
              </div>
              <h3 className="text-sm font-bold text-text-dark uppercase tracking-wider">Cruelty Free</h3>
              <p className="text-xs text-text-light leading-relaxed">
                Lumière is PETA-certified. We never test our ingredients or finished formulations on animals.
              </p>
            </div>

            <div className="bg-white border border-border-lumi rounded-2xl p-6 shadow-xs flex flex-col items-center sm:items-start text-center sm:text-left gap-3">
              <div className="w-10 h-10 rounded-full bg-bg-peach flex items-center justify-center text-primary border border-border-lumi">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-sm font-bold text-text-dark uppercase tracking-wider">Derm Tested</h3>
              <p className="text-xs text-text-light leading-relaxed">
                All items undergo rigorous clinical trials to ensure they are safe and gentle for sensitive skin.
              </p>
            </div>

            <div className="bg-white border border-border-lumi rounded-2xl p-6 shadow-xs flex flex-col items-center sm:items-start text-center sm:text-left gap-3">
              <div className="w-10 h-10 rounded-full bg-bg-peach flex items-center justify-center text-primary border border-border-lumi">
                <Award size={20} />
              </div>
              <h3 className="text-sm font-bold text-text-dark uppercase tracking-wider">Paraben Free</h3>
              <p className="text-xs text-text-light leading-relaxed">
                Our formulas are free from parabens, phthalates, mineral oils, and synthetic fragrances.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ethos Quote Section */}
      <div className="bg-bg-pink py-16 text-center flex flex-col items-center justify-center gap-4">
        <div className="font-serif text-6xl text-primary leading-none h-6 select-none">“</div>
        <p className="text-lg sm:text-xl font-serif italic text-text-dark max-w-2xl px-6 leading-relaxed">
          Skincare is not about quick-fixes or hiding your texture. It is a slow, mindful ritual of honoring your glow.
        </p>
        <span className="text-xs font-bold text-primary tracking-widest uppercase mt-2">- Team Lumière</span>
      </div>

    </div>
  );
}
