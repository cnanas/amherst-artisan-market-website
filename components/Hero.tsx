import { ImageWithFallback } from './figma/ImageWithFallback';
const marketLogo = import.meta.env.BASE_URL + 'logo.png';

interface HeroProps {
  onNavigate?: (section: string) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  return (
    <div className="relative bg-white py-20 overflow-hidden">
      {/* Nature/Flower Background */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1655241238128-018bd3a70821?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aWxkZmxvd2VyJTIwbWVhZG93JTIwbmF0dXJlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NTUxMzM0ODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Wildflower meadow background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-white/60"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-slate-200">
              <div className="text-center">
                {/* Featured Logo */}
                <div className="mb-6">
                  <img 
                    src={marketLogo} 
                    alt="Amherst Artisan and Crafters Market Logo" 
                    className="w-32 h-32 mx-auto object-contain rounded-full shadow-lg border-4 border-white"
                  />
                </div>
                
                <div className="inline-block bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-full mb-6 shadow-lg">
                  <span className="font-medium">Now Open • Season 2025</span>
                </div>
                
                <h2 className="text-slate-800 mb-2">Amherst Artisan and Crafters Market</h2>
                <p className="text-slate-700 mb-8">Featuring local artisans, crafters and food vendors!</p>
                
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full flex items-center justify-center shadow-md">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Thursdays, 3 - 7 PM</p>
                      <p className="text-sm text-slate-600">Weekly throughout the season</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full flex items-center justify-center shadow-md">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Amherst Town Hall</p>
                      <p className="text-sm text-slate-600">4 Boltwood Ave, Amherst, MA</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full flex items-center justify-center shadow-md">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">May - October 2025</p>
                      <p className="text-sm text-slate-600">Seasonal outdoor market</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-slate-200">
              <h2 className="mb-6 text-slate-800">Welcome to Our Community!</h2>
              <p className="text-slate-700 mb-6 leading-relaxed">
                Volunteers and employees of the historic Amherst Farmers' Market are working together to organize and establish an Amherst Artisan and Crafters Market. Serving the Amherst Farmers' Market on a volunteer basis has given us the amazing opportunity to establish relationships with the local community. From those relationships, we have heard your sincere desire to connect artists and community members around the area. We believe the Amherst Artisan and Crafters Market can fill this need while also continuing to strengthen our local community.
              </p>
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-emerald-900">
                  <strong>Now accepting artisan, musician, and food vendors!</strong> Please note that we are not accepting food trucks at this time.
                </p>
              </div>
              
              <p className="text-slate-600 text-sm mb-6">
                Join us every <strong>Thursday from 3pm-7pm</strong> in front of <strong>Amherst Town Hall</strong> located at <strong>4 Boltwood Ave, Amherst, MA 01002</strong>. We will be running the market every Thursday until October!
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  onClick={() => onNavigate?.('application')}
                >
                  Apply to Join Our Market
                </button>
                
                <button 
                  className="flex-1 bg-white text-emerald-700 border-2 border-emerald-200 px-6 py-3 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 shadow-md hover:shadow-lg"
                  onClick={() => onNavigate?.('vendors')}
                >
                  View Our Vendors
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}