import React from 'react';
import { ShieldCheck, Heart, Leaf, Award } from 'lucide-react';

export default function AboutBrand() {
  return (
    <>
      <div className="about-brand-container animate-fade-up">
        {/* Brand Banner */}
        <div className="about-hero">
          <img src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80" alt="Ethos Banner" />
          <div className="overlay"></div>
          <div className="hero-content">
            <h1>Our Ethos</h1>
            <span>Pure. Mindful. Luxury.</span>
          </div>
        </div>

        {/* Brand Story */}
        <div className="about-section">
          <h2>The Lumière Story</h2>
          <p>Founded in Noida, India, Lumière was born out of a desire to create clean, high-performance skincare that combines the wisdom of traditional botanicals with modern dermatological science.</p>
          <p>We believe skincare should be an indulgent ritual of self-love. Every drop of our formulations is crafted to feed your skin cells with biocompatible nutrients that restore your natural, glass-like glow without compromising on luxury.</p>
        </div>

        {/* Standards Grid */}
        <div className="about-section bg-peach-tint">
          <h2>Our Clean Standards</h2>
          
          <div className="standards-grid">
            <div className="standard-item-box">
              <Leaf size={24} color="var(--primary)" />
              <h3>100% Vegan</h3>
              <p>We never use animal-derived ingredients like carmine or lanolin in our skincare formulations.</p>
            </div>
            
            <div className="standard-item-box">
              <Heart size={24} color="var(--primary)" />
              <h3>Cruelty Free</h3>
              <p>Lumière is PETA-certified. We never test our ingredients or finished formulations on animals.</p>
            </div>

            <div className="standard-item-box">
              <ShieldCheck size={24} color="var(--primary)" />
              <h3>Derm Tested</h3>
              <p>All items undergo rigorous clinical trials to ensure they are safe and gentle for sensitive skin.</p>
            </div>

            <div className="standard-item-box">
              <Award size={24} color="var(--primary)" />
              <h3>Paraben Free</h3>
              <p>Our formulas are free from parabens, phthalates, mineral oils, and synthetic fragrances.</p>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="ethos-quote-section">
          <div className="quote-mark">“</div>
          <p>Skincare is not about quick-fixes or hiding your texture. It is a slow, mindful ritual of honoring your glow.</p>
          <span>- Team Lumière</span>
        </div>
      </div>

      <style>{`
        .about-brand-container {
          text-align: left;
        }
        .about-hero {
          position: relative;
          height: 240px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .about-hero img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
        }
        .about-hero .overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(107, 83, 76, 0.55);
        }
        .about-hero .hero-content {
          position: relative;
          z-index: 5;
          text-align: center;
          color: var(--bg-white);
        }
        .about-hero h1 {
          color: var(--bg-white);
          font-size: 32px;
          font-weight: 500;
          margin-bottom: 4px;
        }
        .about-hero span {
          font-size: 13px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .about-section {
          padding: 32px 16px;
          background-color: var(--bg-white);
        }
        .about-section.bg-peach-tint {
          background-color: var(--bg-peach);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .about-section h2 {
          font-size: 22px;
          font-weight: 500;
          margin-bottom: 14px;
        }
        .about-section p {
          font-size: 14px;
          color: var(--text-medium);
          line-height: 1.6;
          margin-bottom: 14px;
        }
        .about-section p:last-child {
          margin-bottom: 0;
        }

        /* Standards Grid */
        .standards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 20px;
        }
        .standard-item-box {
          background-color: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 16px;
          box-shadow: var(--shadow-sm);
        }
        .standard-item-box h3 {
          font-family: var(--font-sans);
          font-size: 14px;
          font-weight: 600;
          margin-top: 8px;
          margin-bottom: 4px;
        }
        .standard-item-box p {
          font-size: 11px;
          color: var(--text-light);
          line-height: 1.4;
        }

        /* Quote Section */
        .ethos-quote-section {
          padding: 40px 20px;
          text-align: center;
          background-color: var(--bg-pink);
        }
        .quote-mark {
          font-family: var(--font-serif);
          font-size: 60px;
          line-height: 0.1;
          color: var(--primary);
          margin-bottom: 24px;
        }
        .ethos-quote-section p {
          font-size: 16px;
          font-style: italic;
          color: var(--text-dark);
          line-height: 1.5;
          margin-bottom: 12px;
        }
        .ethos-quote-section span {
          font-size: 12px;
          font-weight: 600;
          color: var(--primary);
          text-transform: uppercase;
        }
      `}</style>
    </>
  );
}
