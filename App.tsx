import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { VendorShowcase } from './components/VendorShowcase';
import { VendorApplication } from './components/VendorApplication';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { Footer } from './components/Footer';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Check for stored admin authentication and URL path on app load
  useEffect(() => {
    const storedAuth = localStorage.getItem('amherst_market_admin_auth');
    if (storedAuth === 'authenticated') {
      setIsAdminAuthenticated(true);
    }

    // Check if URL ends with the admin path
    const checkAdminPath = () => {
      const path = window.location.pathname;
      if (path.endsWith('/amherstmarket') || path.endsWith('/amherstmarket/')) {
        setIsAdminMode(true);
        setActiveSection('admin');
      } else {
        setIsAdminMode(false);
      }
    };

    checkAdminPath();

    // Listen for URL changes (for single page apps)
    window.addEventListener('popstate', checkAdminPath);
    return () => window.removeEventListener('popstate', checkAdminPath);
  }, []);

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    localStorage.setItem('amherst_market_admin_auth', 'authenticated');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('amherst_market_admin_auth');
    setActiveSection('home');
    // Navigate away from admin URL
    window.history.pushState({}, '', import.meta.env.BASE_URL);
    setIsAdminMode(false);
  };

  const handleNavigation = (section: string) => {
    setActiveSection(section);
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    // Show admin interface if in admin mode (URL ends with /amherstmarket)
    if (isAdminMode) {
      if (!isAdminAuthenticated) {
        return <AdminLogin onLogin={handleAdminLogin} />;
      }
      return <AdminDashboard onLogout={handleAdminLogout} />;
    }

    // Regular site navigation
    switch (activeSection) {
      case 'vendors':
        return <VendorShowcase onNavigate={handleNavigation} />;
      case 'application':
        return <VendorApplication />;
      case 'contact':
        return (
          <div className="min-h-screen bg-gray-50 py-20">
            <div className="max-w-5xl mx-auto px-6">
              <div className="text-center mb-12">
                <div className="inline-block bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-2 rounded-full mb-6">
                  <span className="font-medium">Get In Touch</span>
                </div>
                <h2 className="mb-4 text-slate-800">Contact Us</h2>
                <p className="text-slate-700 max-w-2xl mx-auto">
                  Have questions about the market, vendor applications, or want to learn more? We'd love to hear from you!
                </p>
              </div>
              
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="p-8 bg-slate-50">
                    <h3 className="mb-6 text-slate-800 flex items-center">
                      <svg className="w-6 h-6 mr-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Market Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 bg-white/70 rounded-lg">
                        <svg className="w-5 h-5 text-emerald-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="font-medium text-slate-900">When:</p>
                          <p className="text-slate-700">Thursdays, 3-7 PM</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-white/70 rounded-lg">
                        <svg className="w-5 h-5 text-emerald-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                          <p className="font-medium text-slate-900">Where:</p>
                          <p className="text-slate-700">Amherst Town Hall</p>
                          <p className="text-sm text-slate-600">4 Boltwood Ave, Amherst, MA 01002</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-white/70 rounded-lg">
                        <svg className="w-5 h-5 text-emerald-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="font-medium text-slate-900">Season:</p>
                          <p className="text-slate-700">May - October 2025</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <h3 className="mb-6 text-slate-800 flex items-center">
                      <svg className="w-6 h-6 mr-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Get in Touch
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="text-sm text-slate-600">Email:</p>
                          <a href="mailto:info@amherstartisansmarket.com" className="text-emerald-700 hover:text-emerald-800 transition-colors">
                            info@amherstartisansmarket.com
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <div>
                          <p className="text-sm text-slate-600">Phone:</p>
                          <a href="tel:+14135550123" className="text-emerald-700 hover:text-emerald-800 transition-colors">
                            (413) 555-0123
                          </a>
                        </div>
                      </div>
                      
                      <div className="mt-8">
                        <p className="text-sm text-slate-600 mb-4">Follow us on social media:</p>
                        <div className="flex gap-3">
                          <a href="#" className="p-3 bg-slate-100 hover:bg-slate-200 text-emerald-600 rounded-lg transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </a>
                          <a href="#" className="p-3 bg-slate-100 hover:bg-slate-200 text-emerald-600 rounded-lg transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                            </svg>
                          </a>
                          <a href="#" className="p-3 bg-slate-100 hover:bg-slate-200 text-emerald-600 rounded-lg transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <>
            <Hero onNavigate={handleNavigation} />
            <VendorShowcase onNavigate={handleNavigation} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hide header if in admin mode */}
      {!isAdminMode && (
        <Header 
          activeSection={activeSection} 
          setActiveSection={setActiveSection}
          isAdminAuthenticated={isAdminAuthenticated}
        />
      )}
      <main>
        {renderContent()}
      </main>
      {/* Hide footer if in admin mode */}
      {!isAdminMode && <Footer />}
    </div>
  );
}