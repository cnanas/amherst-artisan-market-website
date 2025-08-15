import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface VendorApplication {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  vendorType: string;
  description: string;
  productsServices: string;
  experience: string;
  specialRequirements: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes: string;
}

interface ApplicationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [applications, setApplications] = useState<VendorApplication[]>([]);
  const [stats, setStats] = useState<ApplicationStats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-ff2da156/vendor-applications`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch applications: ${response.status}`);
      }

      const result = await response.json();
      setApplications(result.applications || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-ff2da156/vendor-applications/stats`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.status}`);
      }

      const result = await response.json();
      setStats(result);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateApplication = async (applicationId: string, status: string, notes: string) => {
    setUpdating(applicationId);
    
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-ff2da156/vendor-applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          status,
          notes,
          reviewedBy: 'admin'
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update application: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        toast.success('Application updated successfully');
        
        // Update the local state
        setApplications(prev => 
          prev.map(app => 
            app.id === applicationId 
              ? { ...app, status: status as any, notes, reviewedAt: new Date().toISOString(), reviewedBy: 'admin' }
              : app
          )
        );
        
        // Refresh stats
        fetchStats();
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const filteredApplications = applications.filter(app => 
    selectedFilter === 'all' || app.status === selectedFilter
  );

  if (loading) {
    return (
      <div className="py-20 bg-gradient-to-b from-emerald-50 to-green-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600">Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-gradient-to-b from-emerald-50 to-green-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-6">
            <div></div>
            <div className="inline-block bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-2 rounded-full">
              <span className="font-medium">Admin Dashboard</span>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </Button>
          </div>
          <h2 className="text-emerald-800 mb-4">Vendor Applications Management</h2>
          <p className="text-slate-700 max-w-2xl mx-auto">
            Review and manage vendor applications for the Amherst Artisans Market.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-emerald-200">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-emerald-800">{stats.total}</div>
              <div className="text-sm text-slate-600">Total Applications</div>
            </CardContent>
          </Card>
          <Card className="border-yellow-200">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
              <div className="text-sm text-slate-600">Pending Review</div>
            </CardContent>
          </Card>
          <Card className="border-green-200">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-700">{stats.approved}</div>
              <div className="text-sm text-slate-600">Approved</div>
            </CardContent>
          </Card>
          <Card className="border-red-200">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-red-700">{stats.rejected}</div>
              <div className="text-sm text-slate-600">Rejected</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <Tabs value={selectedFilter} onValueChange={(value) => setSelectedFilter(value as any)} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Applications List */}
        <div className="space-y-6">
          {filteredApplications.length === 0 ? (
            <Card className="border-emerald-200">
              <CardContent className="p-12 text-center">
                <div className="text-slate-500 mb-4">
                  <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-slate-700 mb-2">No applications found</h3>
                <p className="text-slate-500">
                  {selectedFilter === 'all' 
                    ? 'No vendor applications have been submitted yet.' 
                    : `No ${selectedFilter} applications found.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map((application) => (
              <ApplicationCard 
                key={application.id} 
                application={application} 
                onUpdate={updateApplication}
                isUpdating={updating === application.id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ApplicationCard({ 
  application, 
  onUpdate, 
  isUpdating 
}: { 
  application: VendorApplication; 
  onUpdate: (id: string, status: string, notes: string) => void;
  isUpdating: boolean;
}) {
  const [notes, setNotes] = useState(application.notes || '');
  const [status, setStatus] = useState(application.status);

  const handleUpdate = () => {
    onUpdate(application.id, status, notes);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <Card className="border-emerald-200 bg-white/95 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-emerald-800">{application.businessName}</CardTitle>
            <CardDescription>
              Contact: {application.contactName} • {application.email} • {application.phone}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(application.status)}>
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-slate-800 mb-2">Business Information</h4>
            <div className="space-y-2 text-sm">
              <p><strong>Type:</strong> {application.vendorType}</p>
              <p><strong>Website:</strong> {application.website || 'Not provided'}</p>
              <p><strong>Submitted:</strong> {new Date(application.submittedAt).toLocaleDateString()}</p>
              {application.reviewedAt && (
                <p><strong>Reviewed:</strong> {new Date(application.reviewedAt).toLocaleDateString()}</p>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-slate-800 mb-2">Requirements</h4>
            <div className="text-sm text-slate-600">
              {application.specialRequirements || 'No special requirements'}
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-slate-800 mb-2">Business Description</h4>
          <p className="text-sm text-slate-600 leading-relaxed">{application.description}</p>
        </div>

        <div>
          <h4 className="font-medium text-slate-800 mb-2">Products/Services</h4>
          <p className="text-sm text-slate-600 leading-relaxed">{application.productsServices}</p>
        </div>

        {application.experience && (
          <div>
            <h4 className="font-medium text-slate-800 mb-2">Experience</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{application.experience}</p>
          </div>
        )}

        <div className="border-t border-emerald-200 pt-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor={`status-${application.id}`} className="text-slate-800">Update Status</Label>
              <Select value={status} onValueChange={setStatus} disabled={isUpdating}>
                <SelectTrigger id={`status-${application.id}`} className="border-emerald-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor={`notes-${application.id}`} className="text-slate-800">Admin Notes</Label>
              <Textarea
                id={`notes-${application.id}`}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes for this application..."
                className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                disabled={isUpdating}
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button 
              onClick={handleUpdate}
              disabled={isUpdating || (status === application.status && notes === application.notes)}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
            >
              {isUpdating ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </div>
              ) : (
                'Update Application'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}