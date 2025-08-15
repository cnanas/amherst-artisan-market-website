import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Admin password
  const ADMIN_PASSWORD = 'market2025admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate a brief loading time for security
    await new Promise(resolve => setTimeout(resolve, 500));

    if (password === ADMIN_PASSWORD) {
      toast.success('Welcome, Admin! Access granted.');
      onLogin();
    } else {
      toast.error('Invalid admin password. Please try again.');
      setPassword('');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-green-50 py-20">
      <div className="max-w-md mx-auto px-6">
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-2 rounded-full mb-6">
            <span className="font-medium">Admin Access</span>
          </div>
          <h2 className="text-slate-800 mb-4">Admin Portal</h2>
          <p className="text-slate-700">
            Enter the admin password to access the dashboard.
          </p>
        </div>

        <Card className="shadow-xl border-emerald-200 bg-white/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-200">
            <CardTitle className="text-emerald-800 flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure Admin Access
            </CardTitle>
            <CardDescription className="text-center text-slate-700">
              Please authenticate to access the vendor application management system.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="password" className="text-slate-800">Admin Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter admin password"
                  className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading || !password.trim()}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </div>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Login to Admin Dashboard
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 p-4 bg-gradient-to-r from-emerald-100 to-green-100 border border-emerald-300 rounded-lg">
              <h4 className="font-medium text-emerald-900 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Security Notice
              </h4>
              <p className="text-sm text-emerald-800">
                This admin area is accessible via direct URL only. Keep the access URL and password confidential to maintain security.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-sm text-slate-600">
            Demo password for testing: <code className="bg-emerald-100 px-2 py-1 rounded text-emerald-800">market2025admin</code>
          </p>
        </div>
      </div>
    </div>
  );
}