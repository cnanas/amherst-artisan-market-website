import { useState } from 'react';
const marketLogo = import.meta.env.BASE_URL + 'logo.png';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isAdminAuthenticated?: boolean;
}

export function Header({ activeSection, setActiveSection, isAdminAuthenticated = false }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Navigation items without Home (logo/title will handle homepage navigation)
  const navItems = [
    { id: 'vendors', label: 'Our Vendors' },
    { id: 'application', label: 'Vendor Application' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleLogoClick = () => {
    setActiveSection('home');
    setIsMobileMenuOpen(false); // Close mobile menu if open
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={handleLogoClick}>
            <img 
              src={marketLogo} 
              alt="Amherst Artisan and Crafters Market Logo" 
              className="w-16 h-16 object-contain rounded-full group-hover:scale-105 transition-transform duration-200"
            />
            <div>
              <h1 className="text-slate-800 group-hover:text-emerald-700 transition-colors">
                Amherst Artisan and Crafters Market
              </h1>
              <p className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors">
                Featuring local artisans, crafters and food vendors
              </p>
            </div>
          </div>
          
          <nav className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`transition-colors hover:text-emerald-600 ${
                  activeSection === item.id 
                    ? 'text-emerald-700 border-b-2 border-emerald-600 pb-1' 
                    : 'text-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:text-emerald-600 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-emerald-100 bg-white">
            <nav className="px-6 py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left py-2 px-3 rounded-lg transition-colors ${
                    activeSection === item.id 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'text-slate-700 hover:bg-emerald-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}