'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim() && message.trim()) {
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/919876543210?text=Hi%20LUMIERE%20support!', '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-up text-left font-sans">
      
      {/* Header */}
      <div className="text-center flex flex-col items-center gap-2 mb-10">
        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-text-dark">Connect With Us</h1>
        <p className="text-xs sm:text-sm text-text-light max-w-md">
          We are here to assist you with order inquiries, product recommendations, or collaborations.
        </p>
      </div>

      {/* Main Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        
        {/* Info Cards Side (2 Columns) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          
          <div 
            onClick={handleWhatsApp} 
            className="flex items-start gap-4 p-5 border border-border-lumi bg-white hover:border-primary-light/30 rounded-2xl shadow-xs cursor-pointer active:scale-99 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-bg-peach flex items-center justify-center text-primary flex-shrink-0 border border-border-lumi">
              <MessageCircle size={18} />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-medium mb-1">WhatsApp Chat</h3>
              <p className="text-sm font-bold text-primary">+91 98765 43210</p>
              <span className="text-[10px] text-text-light block mt-0.5">Instant Support (10 AM - 7 PM)</span>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 border border-border-lumi bg-white rounded-2xl shadow-xs transition-all">
            <div className="w-10 h-10 rounded-full bg-bg-peach flex items-center justify-center text-primary flex-shrink-0 border border-border-lumi">
              <Mail size={18} />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-medium mb-1">Email Support</h3>
              <p className="text-sm font-bold text-primary">support@lumiere.in</p>
              <span className="text-[10px] text-text-light block mt-0.5">Response within 24 hours</span>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 border border-border-lumi bg-white rounded-2xl shadow-xs transition-all">
            <div className="w-10 h-10 rounded-full bg-bg-peach flex items-center justify-center text-primary flex-shrink-0 border border-border-lumi">
              <MapPin size={18} />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-medium mb-1">Head Office</h3>
              <p className="text-sm font-bold text-primary">Lumière India Pvt Ltd</p>
              <span className="text-[10px] text-text-light block mt-0.5">Sector 62, Noida, UP - 201301</span>
            </div>
          </div>

        </div>

        {/* Message Form Side (3 Columns) */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-border-lumi rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-serif font-medium text-text-dark mb-5 border-b border-border-lumi pb-3">Send a Message</h2>
            
            {submitted ? (
              <div className="p-4 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-xl text-center">
                Your message has been sent successfully! We will get back to you shortly.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-text-medium uppercase tracking-wider">Your Name</label>
                  <input 
                    type="text" 
                    className="w-full text-sm py-3 px-4 bg-bg-peach border border-border-lumi rounded-xl outline-none focus:bg-white focus:border-primary-light transition-all" 
                    placeholder="Sarah Jenkins"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-text-medium uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full text-sm py-3 px-4 bg-bg-peach border border-border-lumi rounded-xl outline-none focus:bg-white focus:border-primary-light transition-all" 
                    placeholder="sarah.j@lumiere.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-text-medium uppercase tracking-wider">Your Message</label>
                  <textarea 
                    className="w-full text-sm py-3 px-4 bg-bg-peach border border-border-lumi rounded-xl outline-none focus:bg-white focus:border-primary-light h-32 resize-none transition-all" 
                    placeholder="Write your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-fit py-3.5 px-8 mt-2 bg-primary hover:bg-primary-light text-white rounded-xl font-semibold text-xs tracking-widest uppercase transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  <Send size={14} />
                  <span>Submit Query</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
