import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Vendor {
  id: string;
  created_at: string;
  name: string;
  website?: string;
  image: string;
  vendor_type: string;
}

interface VendorShowcaseProps {
  onNavigate?: (section: string) => void;
}

export function VendorShowcase({ onNavigate }: VendorShowcaseProps) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      console.log('Fetching vendors from API...');
      setLoading(true);
      setError(null);

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-ff2da156/vendors`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      const result = await response.json();
      console.log('Vendors API response:', result);

      if (!response.ok) {
        throw new Error(result.error || `Server error: ${response.status}`);
      }

      if (result.success) {
        setVendors(result.vendors || []);
        console.log(`Successfully loaded ${result.vendors?.length || 0} vendors`);
      } else {
        throw new Error(result.error || 'Unknown error occurred');
      }

    } catch (error) {
      console.error('Error fetching vendors:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-slate-800 mb-4">Meet Our Talented Vendors</h2>
            <p className="text-slate-700 max-w-3xl mx-auto">
              Discover amazing local artisans, crafters, and food vendors who bring their passion and creativity to our weekly market.
            </p>
          </div>
          
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600">Loading our wonderful vendors...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-slate-800 mb-4">Meet Our Talented Vendors</h2>
            <p className="text-slate-700 max-w-3xl mx-auto">
              Discover amazing local artisans, crafters, and food vendors who bring their passion and creativity to our weekly market.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-2xl mx-auto">
              <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-red-800 mb-2">Unable to Load Vendors</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button 
                onClick={fetchVendors}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-slate-800 mb-4">Meet Our Talented Vendors</h2>
          <p className="text-slate-700 max-w-3xl mx-auto">
            Discover amazing local artisans, crafters, and food vendors who bring their passion and creativity to our weekly market. Each vendor offers something unique to our vibrant community.
          </p>
        </div>
        
        {vendors.length === 0 ? (
          <div className="text-center">
            <div className="bg-white border border-slate-200 rounded-2xl p-12 max-w-2xl mx-auto shadow-sm">
              <svg className="w-16 h-16 text-slate-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-slate-800 mb-3">No Vendors Listed Yet</h3>
              <p className="text-slate-700 mb-6">
                We're currently working on adding our amazing vendor profiles. Check back soon to meet our talented local artisans and food vendors!
              </p>
              <button 
                onClick={fetchVendors}
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {vendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        )}
        
        <div className="text-center mt-16">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-3xl mx-auto shadow-lg">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-slate-800 mb-3">Interested in becoming a vendor?</h3>
            <p className="text-slate-700 mb-6 leading-relaxed">
              Join our vibrant community of local artisans and food vendors. We're always looking for talented creators who share our passion for handmade goods and community connection.
            </p>
            <button 
              className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-3 rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={() => onNavigate?.('application')}
            >
              Apply to Join Our Market
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function VendorCard({ vendor }: { vendor: Vendor }) {
  const handleCardClick = () => {
    if (vendor.website) {
      // Open website in new tab
      window.open(vendor.website.startsWith('http') ? vendor.website : `https://${vendor.website}`, '_blank');
    }
  };

  return (
    <div 
      className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden group hover:-translate-y-1 ${vendor.website ? 'cursor-pointer' : ''}`}
      onClick={handleCardClick}
    >
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback 
          src={vendor.image}
          alt={`${vendor.name} - ${vendor.vendor_type}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        {vendor.website && (
          <div className="absolute top-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-medium text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">{vendor.name}</h3>
        <p className="text-sm text-slate-600 mb-3">{vendor.vendor_type}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-emerald-600 text-sm">
            {vendor.website ? (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span>Visit Website</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Find us at the market</span>
              </>
            )}
          </div>
          {vendor.website && (
            <div className="text-xs text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              →
            </div>
          )}
        </div>
      </div>
    </div>
  );
}