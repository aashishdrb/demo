'use client';

import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/lib/db';

export default function Home() {
  const context = useContext(AppContext);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  if (!context) return null;
  const { products, setCurrentPage, setSearchQuery } = context;

  const bestSellers = products.filter((p: Product) => p.bestSeller);
  const trendingProducts = products.filter((p: Product) => (p.rating || 0) >= 4.7 && (p.reviewsCount || 0) >= 50).slice(0, 4);
  const newArrivals = products.slice(-6); 
  const recommendedProducts = products.filter((p: Product) => (p.rating || 0) >= 4.8).slice(0, 4);
  const skincareEssentials = products.filter((p: Product) => ['Facewash', 'Sunscreen', 'Serum', 'Moisturizer'].includes(p.category)).slice(0, 4);

  const categories = [
    { name: 'Serums', query: 'Serum', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=120&auto=format&fit=crop&q=80' },
    { name: 'Cleansers', query: 'Facewash', img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=120&auto=format&fit=crop&q=80' },
    { name: 'Moisturizers', query: 'Moisturizer', img: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=120&auto=format&fit=crop&q=80' },
    { name: 'Sun protection', query: 'Sunscreen', img: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=120&auto=format&fit=crop&q=80' },
    { name: 'Lip Care', query: 'Lip Care', img: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=120&auto=format&fit=crop&q=80' },
    { name: 'Hair Care', query: 'Hair Care', img: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=120&auto=format&fit=crop&q=80' },
    { name: 'Makeup', query: 'Makeup', img: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=120&auto=format&fit=crop&q=80' },
    { name: 'Body Wash', query: 'Body Wash', img: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=120&auto=format&fit=crop&q=80' }
  ];

  const concerns = [
    { title: 'Glow & Radiance', color: 'bg-bg-pink border-primary-light/10', query: 'Serum' },
    { title: 'Anti-Aging & Firming', color: 'bg-bg-cream border-primary-light/10', query: 'Moisturizer' },
    { title: 'Hydration & Barrier Care', color: 'bg-bg-peach border-primary-light/10', query: 'Moisturizer' },
    { title: 'Sun Protection & Tan', color: 'bg-bg-pink border-primary-light/10', query: 'Sunscreen' }
  ];

  const testimonials = [
    {
      text: "The Silk Serum transformed my dry patches in a week! It's like an invisible veil of hydration that stays all day. Truly premium quality.",
      author: "Sarah M.",
      verified: true
    },
    {
      text: "I love the clean aesthetics and the gentle foaming wash. No artificial fragrances or parabens, my sensitive skin is in love!",
      author: "Janice L.",
      verified: true
    },
    {
      text: "Their Bridal Glow kit is absolute gold! Complete luxury packaging and feels incredibly gentle. Best skin startup in India.",
      author: "Aakanksha R.",
      verified: true
    }
  ];

  const handleCategoryClick = (query: string) => {
    setSearchQuery(query);
    setCurrentPage('shop');
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      
      {/* Full-screen Responsive Hero Section */}
      <section className="relative h-[320px] sm:h-[460px] lg:h-[580px] w-full rounded-3xl overflow-hidden flex items-end p-6 md:p-12 shadow-md">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=80" 
          alt="Skincare Hero" 
          className="absolute inset-0 w-full h-full object-cover object-center sm:object-[center_20%] select-none pointer-events-none"
        />
        <div className="relative z-20 text-white text-left max-w-lg flex flex-col gap-2 md:gap-4">
          <span className="text-[10px] sm:text-xs font-semibold tracking-[3px] uppercase text-bg-pink">ESSENTIAL LUXURY</span>
          <h1 className="text-3xl sm:text-5xl font-serif leading-tight font-medium">Glow Beyond Trends</h1>
          <p className="text-xs sm:text-sm text-bg-cream leading-relaxed hidden sm:block">
            Formulated to preserve your skin's natural protective moisture barrier with active amino acids and bio-silk proteins.
          </p>
          <button 
            className="w-fit mt-2 px-6 py-3 rounded-full bg-accent-gold hover:bg-accent-hover text-text-dark font-semibold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 select-none shadow-lg active:scale-95 transition-all" 
            onClick={() => {
              setSearchQuery('');
              setCurrentPage('shop');
            }}
          >
            <span>Shop Collection</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Categories Horizontal Scroll Section */}
      <section className="bg-white rounded-3xl p-6 border border-border-lumi">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-serif font-medium text-text-dark">Shop by Category</h2>
          <button 
            className="text-[10px] font-bold text-primary uppercase tracking-wider border-b border-primary/30 hover:border-primary pb-0.5 transition-all duration-300 hover:tracking-widest cursor-pointer select-none" 
            onClick={() => {
              setSearchQuery('');
              setCurrentPage('shop');
            }}
          >
            View All
          </button>
        </div>
        <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-border-lumi">
          {categories.map((cat, idx) => (
            <div 
              key={idx} 
              className="flex flex-col items-center gap-3 cursor-pointer min-w-[80px] group select-none"
              onClick={() => handleCategoryClick(cat.query)}
            >
              <div className="w-[70px] h-[70px] sm:w-[84px] sm:h-[84px] rounded-full overflow-hidden border-2 border-border-lumi shadow-sm transition-all group-active:scale-95 group-hover:border-primary-light">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <span className="text-xs font-semibold text-text-dark tracking-wide group-hover:text-primary transition-colors text-center">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="bg-bg-peach rounded-3xl p-6 sm:p-8 border border-border-lumi">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-serif font-medium text-text-dark">Trending Rituals</h2>
          <button 
            className="text-[10px] font-bold text-primary uppercase tracking-wider border-b border-primary/30 hover:border-primary pb-0.5 transition-all duration-300 hover:tracking-widest cursor-pointer select-none" 
            onClick={() => {
              setSearchQuery('');
              setCurrentPage('shop');
            }}
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pb-4 md:pb-0">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-border-lumi">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-serif font-medium text-text-dark">The Best Sellers</h2>
          <button 
            className="text-[10px] font-bold text-primary uppercase tracking-wider border-b border-primary/30 hover:border-primary pb-0.5 transition-all duration-300 hover:tracking-widest cursor-pointer select-none" 
            onClick={() => {
              setSearchQuery('');
              setCurrentPage('shop');
            }}
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pb-4 md:pb-0">
          {bestSellers.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="bg-bg-peach rounded-3xl p-6 sm:p-8 border border-border-lumi">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-serif font-medium text-text-dark">New Arrivals</h2>
          <button 
            className="text-[10px] font-bold text-primary uppercase tracking-wider border-b border-primary/30 hover:border-primary pb-0.5 transition-all duration-300 hover:tracking-widest cursor-pointer select-none" 
            onClick={() => {
              setSearchQuery('');
              setCurrentPage('shop');
            }}
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pb-4 md:pb-0">
          {newArrivals.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Recommended For You Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-border-lumi">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-serif font-medium text-text-dark">Recommended For You</h2>
          <button 
            className="text-[10px] font-bold text-primary uppercase tracking-wider border-b border-primary/30 hover:border-primary pb-0.5 transition-all duration-300 hover:tracking-widest cursor-pointer select-none" 
            onClick={() => {
              setSearchQuery('');
              setCurrentPage('shop');
            }}
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pb-4 md:pb-0">
          {recommendedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Skin Care Essentials Section */}
      <section className="bg-bg-peach rounded-3xl p-6 sm:p-8 border border-border-lumi">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-serif font-medium text-text-dark">Skincare Essentials</h2>
          <button 
            className="text-[10px] font-bold text-primary uppercase tracking-wider border-b border-primary/30 hover:border-primary pb-0.5 transition-all duration-300 hover:tracking-widest cursor-pointer select-none" 
            onClick={() => {
              setSearchQuery('');
              setCurrentPage('shop');
            }}
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pb-4 md:pb-0">
          {skincareEssentials.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Solution by Concern Section */}
      <section className="bg-white rounded-3xl p-6 border border-border-lumi">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-serif font-medium text-text-dark">Rituals by Concern</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {concerns.map((concern, idx) => (
            <div 
              key={idx} 
              className={`p-6 rounded-2xl border ${concern.color} flex flex-col justify-between h-[130px] sm:h-[150px] cursor-pointer transition-all active:scale-[0.98] hover:shadow-md hover:-translate-y-0.5`}
              onClick={() => handleCategoryClick(concern.query)}
            >
              <h3 className="font-serif text-sm sm:text-base font-semibold text-text-dark leading-tight">{concern.title}</h3>
              <span className="text-[11px] font-semibold text-primary flex items-center gap-1">
                Explore <ArrowRight size={13} />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Carousel Section */}
      <section className="bg-bg-pink rounded-3xl p-6 sm:p-8 border border-border-lumi text-center flex flex-col items-center">
        <h2 className="text-xl sm:text-2xl font-serif font-medium text-text-dark mb-6">Lumière Stories</h2>
        
        <div className="bg-white border border-border-lumi max-w-2xl w-full p-6 sm:p-8 rounded-2xl shadow-sm relative">
          <div className="font-serif text-5xl text-primary-light/20 absolute top-4 left-6 leading-none select-none">“</div>
          
          <p className="text-sm sm:text-base text-text-medium italic leading-relaxed text-left pl-6 pr-4 mt-2">
            {testimonials[activeTestimonial].text}
          </p>
          
          <div className="flex justify-between items-center mt-6 pl-6">
            <span className="text-xs sm:text-sm font-semibold text-text-dark">{testimonials[activeTestimonial].author}</span>
            {testimonials[activeTestimonial].verified && (
              <span className="flex items-center gap-1 text-[10px] sm:text-xs text-success font-semibold">
                <CheckCircle2 size={12} />
                <span>Verified Ritualist</span>
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between border-t border-border-lumi pt-4 mt-6">
            <button 
              className="p-1 rounded-full border border-border-lumi bg-bg-cream hover:bg-bg-pink active:scale-90"
              onClick={() => setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-1.5">
              {testimonials.map((_, idx) => (
                <span 
                  key={idx} 
                  className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all ${idx === activeTestimonial ? 'bg-primary w-4' : 'bg-border-lumi'}`}
                  onClick={() => setActiveTestimonial(idx)}
                ></span>
              ))}
            </div>
            <button 
              className="p-1 rounded-full border border-border-lumi bg-bg-cream hover:bg-bg-pink active:scale-90"
              onClick={() => setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Instagram Grid Section */}
      <section className="bg-white rounded-3xl p-6 border border-border-lumi">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-serif font-medium text-text-dark">@lumierebeauty</h2>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[10px] font-bold text-primary uppercase tracking-wider border-b border-primary/30 hover:border-primary pb-0.5 transition-all duration-300 hover:tracking-widest cursor-pointer select-none"
          >
            Follow Us
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="aspect-square rounded-2xl overflow-hidden bg-bg-cream border border-border-lumi">
            <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&q=80" alt="Insta Post" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-bg-cream border border-border-lumi">
            <img src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&q=80" alt="Insta Post" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-bg-cream border border-border-lumi">
            <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&q=80" alt="Insta Post" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-bg-cream border border-border-lumi">
            <img src="https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=300&q=80" alt="Insta Post" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        </div>
      </section>
      
    </div>
  );
}
