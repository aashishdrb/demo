import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { Sparkles, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Home() {
  const { products, setCurrentPage, setSelectedProductId } = useContext(AppContext);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const bestSellers = products.filter((p) => p.bestSeller);

  const categories = [
    { name: 'Serums', query: 'Serum', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=120&auto=format&fit=crop&q=80' },
    { name: 'Cleansers', query: 'Facewash', img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=120&auto=format&fit=crop&q=80' },
    { name: 'Moisturizers', query: 'Moisturizer', img: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=120&auto=format&fit=crop&q=80' },
    { name: 'Sun protection', query: 'Sunscreen', img: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=120&auto=format&fit=crop&q=80' },
    { name: 'Lip Care', query: 'Lip Balm', img: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=120&auto=format&fit=crop&q=80' },
    { name: 'Makeup', query: 'Lipstick', img: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=120&auto=format&fit=crop&q=80' }
  ];

  const concerns = [
    { title: 'Glow & Radiance', color: '#FFEBEF', query: 'Serum' },
    { title: 'Anti-Aging & Firming', color: '#FAF4F0', query: 'Moisturizer' },
    { title: 'Hydration & Barrier Care', color: '#EAF6FF', query: 'Moisturizer' },
    { title: 'Sun Protection & Tan', color: '#FFF6EB', query: 'Sunscreen' }
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

  const handleCategoryClick = (query) => {
    // Navigate to shop with category preset (mocked by navigation)
    setCurrentPage('shop');
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div className="home-container animate-fade-up">
        {/* Full-screen Hero Section */}
        <section className="hero-banner">
          <div className="hero-img-overlay"></div>
          <img 
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80" 
            alt="Skincare Hero" 
            className="hero-bg-img"
          />
          <div className="hero-content">
            <span className="hero-subtitle">ESSENTIAL LUXURY</span>
            <h1 className="hero-title">Glow Beyond Trends</h1>
            <button className="btn btn-accent hero-btn" onClick={() => setCurrentPage('shop')}>
              <span>Shop Collection</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* Categories Section */}
        <section className="home-section">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <button className="text-link-btn" onClick={() => setCurrentPage('shop')}>View All</button>
          </div>
          <div className="categories-slider">
            {categories.map((cat, idx) => (
              <div 
                key={idx} 
                className="category-circle-item"
                onClick={() => handleCategoryClick(cat.query)}
              >
                <div className="circle-img-wrapper">
                  <img src={cat.img} alt={cat.name} />
                </div>
                <span>{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Best Sellers Section */}
        <section className="home-section bg-peach-tint">
          <div className="section-header">
            <h2>The Best Sellers</h2>
            <button className="text-link-btn" onClick={() => setCurrentPage('shop')}>View All</button>
          </div>
          <p className="section-subtitle">Curated essentials for your skincare ritual.</p>
          
          <div className="card-slider">
            {bestSellers.map((product) => (
              <div key={product.id} className="slider-card-wrapper">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

        {/* Solution by Concern Section */}
        <section className="home-section">
          <div className="section-header">
            <h2>Rituals by Concern</h2>
          </div>
          <div className="concern-grid">
            {concerns.map((concern, idx) => (
              <div 
                key={idx} 
                className="concern-card" 
                style={{ backgroundColor: concern.color }}
                onClick={() => handleCategoryClick(concern.query)}
              >
                <h3>{concern.title}</h3>
                <span className="concern-action-btn">
                  Explore <ArrowRight size={14} />
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Carousel Section */}
        <section className="home-section bg-pink-tint">
          <h2>Lumière Stories</h2>
          
          <div className="testimonial-card">
            <div className="quote-icon">“</div>
            <p className="testimonial-text">{testimonials[activeTestimonial].text}</p>
            <div className="testimonial-author">
              <span className="author-name">{testimonials[activeTestimonial].author}</span>
              {testimonials[activeTestimonial].verified && (
                <span className="verified-badge">
                  <CheckCircle2 size={12} color="var(--success)" />
                  <span>Verified Ritualist</span>
                </span>
              )}
            </div>
            
            <div className="carousel-nav">
              <button 
                onClick={() => setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                aria-label="Previous Testimonial"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="carousel-indicators">
                {testimonials.map((_, idx) => (
                  <span 
                    key={idx} 
                    className={`indicator-dot ${idx === activeTestimonial ? 'active' : ''}`}
                    onClick={() => setActiveTestimonial(idx)}
                  ></span>
                ))}
              </div>
              <button 
                onClick={() => setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                aria-label="Next Testimonial"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </section>

        {/* Instagram Grid Section */}
        <section className="home-section">
          <div className="section-header">
            <h2>@lumierebeauty</h2>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-link-btn">Follow Us</a>
          </div>
          <p className="section-subtitle" style={{ marginTop: '-8px', marginBottom: '16px' }}>Share your glow using #lumiereglow</p>
          <div className="insta-grid">
            <div className="insta-item">
              <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&q=80" alt="Insta Post" />
            </div>
            <div className="insta-item">
              <img src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&q=80" alt="Insta Post" />
            </div>
            <div className="insta-item">
              <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&q=80" alt="Insta Post" />
            </div>
            <div className="insta-item">
              <img src="https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=300&q=80" alt="Insta Post" />
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .home-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        /* Hero Banner */
        .hero-banner {
          position: relative;
          height: 520px;
          display: flex;
          align-items: flex-end;
          padding: 32px 20px;
          overflow: hidden;
        }
        .hero-bg-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 25%;
          z-index: 1;
        }
        .hero-img-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, rgba(107, 83, 76, 0.1) 40%, rgba(107, 83, 76, 0.7) 100%);
          z-index: 2;
        }
        .hero-content {
          position: relative;
          z-index: 3;
          color: var(--bg-white);
          text-align: left;
          width: 100%;
        }
        .hero-subtitle {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          opacity: 0.9;
          margin-bottom: 8px;
          display: block;
        }
        .hero-title {
          font-size: 38px;
          color: var(--bg-white);
          line-height: 1.1;
          margin-bottom: 20px;
          font-weight: 500;
        }
        .hero-btn {
          padding: 14px 28px;
          font-size: 14px;
          width: auto;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        /* General Section */
        .home-section {
          padding: 32px 16px;
          background-color: var(--bg-white);
        }
        .bg-peach-tint {
          background-color: var(--bg-peach);
        }
        .bg-pink-tint {
          background-color: var(--bg-pink);
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .section-header h2 {
          font-size: 22px;
          font-weight: 500;
        }
        .section-subtitle {
          font-size: 13px;
          color: var(--text-light);
          margin-top: -12px;
          margin-bottom: 20px;
        }
        .text-link-btn {
          font-size: 13px;
          font-weight: 600;
          color: var(--primary);
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        /* Categories List */
        .categories-slider {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          padding: 8px 4px 16px;
          scrollbar-width: none;
        }
        .categories-slider::-webkit-scrollbar {
          display: none;
        }
        .category-circle-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          min-width: 76px;
        }
        .circle-img-wrapper {
          width: 70px;
          height: 70px;
          border-radius: var(--radius-full);
          overflow: hidden;
          border: 2px solid var(--border);
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
        }
        .category-circle-item:active .circle-img-wrapper {
          border-color: var(--primary);
          transform: scale(0.94);
        }
        .circle-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .category-circle-item span {
          font-size: 12px;
          font-weight: 500;
          color: var(--text-dark);
          text-align: center;
          white-space: nowrap;
        }

        /* Slider Wrapper */
        .slider-card-wrapper {
          min-width: 180px;
          max-width: 180px;
        }

        /* Concern Grid */
        .concern-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .concern-card {
          padding: 24px 16px;
          border-radius: var(--radius-md);
          text-align: left;
          height: 140px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
        }
        .concern-card:active {
          transform: scale(0.97);
        }
        .concern-card h3 {
          font-size: 16px;
          font-weight: 500;
          line-height: 1.3;
          color: var(--text-dark);
        }
        .concern-action-btn {
          font-size: 12px;
          font-weight: 600;
          color: var(--primary);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Testimonials */
        .testimonial-card {
          background-color: var(--bg-white);
          padding: 24px;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          position: relative;
          margin-top: 16px;
        }
        .quote-icon {
          font-family: var(--font-serif);
          font-size: 60px;
          color: var(--bg-pink);
          line-height: 0.1;
          margin-bottom: 24px;
          text-align: left;
        }
        .testimonial-text {
          font-size: 15px;
          font-style: italic;
          color: var(--text-medium);
          line-height: 1.5;
          margin-bottom: 20px;
          text-align: left;
        }
        .testimonial-author {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .author-name {
          font-weight: 600;
          font-size: 14px;
          color: var(--text-dark);
        }
        .verified-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: var(--success);
          font-weight: 500;
        }
        .carousel-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--border);
          padding-top: 16px;
        }
        .carousel-indicators {
          display: flex;
          gap: 6px;
        }
        .indicator-dot {
          width: 6px;
          height: 6px;
          border-radius: var(--radius-full);
          background-color: var(--border-focus);
          cursor: pointer;
        }
        .indicator-dot.active {
          background-color: var(--primary);
          width: 16px;
        }

        /* Insta Grid */
        .insta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .insta-item {
          aspect-ratio: 1;
          overflow: hidden;
          border-radius: var(--radius-md);
          background-color: var(--bg-cream);
        }
        .insta-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .insta-item img:hover {
          transform: scale(1.05);
        }
      `}</style>
    </>
  );
}
