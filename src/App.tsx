/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';

// Use the environment variable for the Google Apps Script URL.
// To make it work in dev/preview, set VITE_APPS_SCRIPT_URL in the AI Studio Secrets panel.
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || '';

export default function App() {
  const [currentPage, setCurrentPage] = useState('Home');
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const navLinks = ['Home', 'Services', 'About', 'Contact'];

  const handleNav = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    if (!APPS_SCRIPT_URL) {
      console.warn('Apps Script URL is not configured. Simulating success... Please add VITE_APPS_SCRIPT_URL in the Secrets panel.');
      setTimeout(() => setFormStatus('success'), 1000);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors' // Google Apps Script often requires no-cors
      });
      // no-cors doesn't allow reading response, assume success
      setFormStatus('success');
    } catch (error) {
      console.error(error);
      setFormStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans">
      <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-sm z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-4 md:py-6 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
            <div className="flex items-center select-none cursor-pointer" onClick={() => handleNav('Home')}>
              <h1 className="text-3xl md:text-4xl font-display font-black tracking-normal uppercase flex items-center m-0">
                <span className="text-[#ce0e1d] italic mr-1">R²</span>
                <span className="text-[#fccb06]">CONSULTING GROUP</span>
              </h1>
            </div>
          <div className="flex flex-wrap justify-center gap-4 md:space-x-8 uppercase text-[10px] sm:text-xs font-bold tracking-widest text-gray-500">
            {navLinks.map(link => (
              <button key={link} onClick={() => handleNav(link)} className={`hover:text-white transition ${currentPage === link ? 'text-white' : ''}`}>
                {link}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="pt-32md:pt-40 pb-16 px-6 md:px-10 max-w-7xl mx-auto">
        {currentPage === 'Home' && (
          <section className="text-left py-10 md:py-20 min-h-[60vh] flex flex-col lg:flex-row justify-center items-center gap-12 mt-12 md:mt-0">
            <div className="flex-1 w-full">
              <h2 className="text-5xl sm:text-6xl md:text-8xl font-display font-black tracking-tight mb-6 md:mb-8 leading-[1.1] md:leading-[0.9] italic text-white underline decoration-[#ce0e1d] decoration-4 uppercase">
                BUILT FOR <br className="hidden sm:block" /> <span className="text-[#fccb06] not-italic">THE TRADES.</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 md:mb-12 max-w-2xl leading-relaxed">We help contractors, startups, and spray foam insulation businesses get online, grow digitally, and automate with AI to operate like larger teams.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => handleNav('Services')} className="bg-[#ce0e1d] text-white px-8 py-4 font-bold text-sm uppercase tracking-widest hover:bg-[#a60b16] transition shadow-lg shadow-[#ce0e1d]/20 text-center">See What We Do</button>
                <button onClick={() => handleNav('Contact')} className="border border-[#fccb06] text-[#fccb06] px-8 py-4 font-bold text-sm uppercase tracking-widest hover:bg-[#fccb06] hover:text-black transition text-center">Get a Free Consultation</button>
              </div>
            </div>
            <div className="flex-1 w-full flex justify-center lg:justify-end items-center">
              <div className="relative w-full max-w-lg aspect-square bg-[#0f0f0f] rounded-2xl overflow-hidden shadow-2xl shadow-[#ce0e1d]/20 border border-white/5">
                <video 
                  src="/logo.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover mix-blend-screen"
                />
              </div>
            </div>
          </section>
        )}

        {currentPage === 'Services' && (
          <section className="py-12 md:py-20 mt-12 md:mt-0">
            <h2 className="text-4xl md:text-5xl font-display font-black mb-10 md:mb-16 uppercase tracking-widest text-white/90">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Web Design', desc: 'Fast, mobile-first websites built for contractors.' },
                { title: 'Digital Marketing', desc: 'SEO & Local Ads for service businesses.' },
                { title: 'AI Systems', desc: 'Chatbots & Automations for small teams.' }
              ].map(service => (
                <div key={service.title} className="bg-white/[0.03] p-6 md:p-8 border border-white/5 flex flex-col justify-between group hover:border-[#fccb06]/50 transition">
                  <div>
                    <h3 className="text-xl font-display font-bold mb-4 text-white uppercase tracking-widest">{service.title}</h3>
                    <p className="text-gray-500 text-sm mb-8 md:mb-12 leading-relaxed">{service.desc}</p>
                  </div>
                  <button onClick={() => handleNav('Contact')} className="text-[#fccb06] font-bold text-xs uppercase tracking-widest self-start border-b border-[#fccb06]/30 hover:border-[#fccb06]">Learn More →</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {currentPage === 'About' && (
          <section className="py-12 md:py-20 max-w-3xl mt-12 md:mt-0">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#ce0e1d] mb-4">Our Origin</h2>
            <h2 className="text-4xl md:text-5xl font-display font-black mb-8 md:mb-10 tracking-tight text-white uppercase underline decoration-[#fccb06]">We Come From the Trades</h2>
            <div className="space-y-6 text-gray-400 text-sm sm:text-base leading-relaxed border-l-2 border-[#ce0e1d] pl-4 md:pl-6">
              <p>With a background in construction and spray foam insulation, we understand the unique challenges faced by small contractors. We aren't just tech consultants; we've been in your boots.</p>
              <p>We saw a gap between the quality of the work contractors do and the quality of their online presence. R2 Consulting Group was founded to bridge that gap, bringing modern technology and automation tools to the trade industry.</p>
              <p>Our mission is simple: Help you stop wasting time on manual tasks so you can focus on building your business.</p>
            </div>
          </section>
        )}

        {currentPage === 'Contact' && (
          <section className="py-12 md:py-20 max-w-xl mt-12 md:mt-0">
            <h2 className="text-4xl md:text-5xl font-display font-black mb-8 md:mb-10 tracking-tight text-white uppercase">Get in Touch</h2>
            {formStatus === 'success' ? (
              <div className="bg-[#fccb06]/10 border border-[#fccb06]/20 p-6 md:p-8 text-center text-white">
                <h3 className="text-xl md:text-2xl font-bold mb-2 uppercase text-[#fccb06]">Message Sent!</h3>
                <p className="text-gray-400 text-sm md:text-base">We will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input required name="name" placeholder="NAME" className="bg-transparent border border-white/10 p-4 text-xs text-white focus:border-[#fccb06] outline-none font-sans" />
                    <input required name="phone" type="tel" placeholder="PHONE" className="bg-transparent border border-white/10 p-4 text-xs text-white focus:border-[#fccb06] outline-none font-sans" />
                </div>
                <div>
                  <input required name="email" type="email" placeholder="EMAIL ADDRESS" className="w-full bg-transparent border border-white/10 p-4 text-xs text-white focus:border-[#fccb06] outline-none font-sans" />
                </div>
                <div>
                  <textarea required name="message" rows={4} placeholder="MESSAGE" className="w-full bg-transparent border border-white/10 p-4 text-xs text-white focus:border-[#fccb06] outline-none resize-none font-sans"></textarea>
                </div>
                <button type="submit" disabled={formStatus === 'submitting'} className="w-full bg-[#ce0e1d] text-white py-4 font-bold text-xs uppercase tracking-widest hover:bg-[#a60b16] transition disabled:opacity-50">
                  {formStatus === 'submitting' ? 'Sending...' : 'Submit Request'}
                </button>
              </form>
            )}
            {formStatus === 'error' && <p className="text-red-500 mt-4 text-center text-xs md:text-sm">Something went wrong. Please try again later.</p>}
          </section>
        )}
      </main>
    </div>
  );
}
