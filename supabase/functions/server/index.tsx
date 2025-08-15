import { Hono } from 'npm:hono';
import { logger } from 'npm:hono/logger';
import { cors } from 'npm:hono/cors';
import { createClient } from 'npm:@supabase/supabase-js';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Configure CORS and logging
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Email sending function using Resend
async function sendNotificationEmail(application: any) {
  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY environment variable not set');
      return { success: false, error: 'Email service not configured' };
    }

    const emailBody = `
New Vendor Application Submitted - Amherst Artisan Market

Application Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 BASIC INFORMATION
• Business Name: ${application.businessName}
• Contact Person: ${application.contactName}
• Email: ${application.email}
• Phone: ${application.phone}
• Website: ${application.website || 'Not provided'}
• Vendor Type: ${application.vendorType}

📝 BUSINESS DETAILS
• Description: ${application.description}
• Products/Services: ${application.productsServices}
• Experience: ${application.experience || 'Not provided'}

🍽️ FOOD PERMITS
${application.foodPermits || 'Not provided'}

📅 AVAILABILITY
• Start Week: ${application.availabilityStartWeek || 'Not provided'}

⚙️ SPECIAL REQUIREMENTS
${application.specialRequirements || 'None specified'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Application ID: ${application.id}
Submitted: ${new Date(application.submittedAt).toLocaleString()}

You can review this application in the admin dashboard.

Best regards,
Amherst Artisan Market System
    `.trim();

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Amherst Artisan Market <onboarding@resend.dev>',
        to: ['christian.nanas@gmail.com'],
        subject: `New Vendor Application: ${application.businessName}`,
        text: emailBody,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Email sending failed:', result);
      return { success: false, error: result.message || 'Failed to send email' };
    }

    console.log('Notification email sent successfully:', result.id);
    return { success: true, emailId: result.id };

  } catch (error) {
    console.error('Error sending notification email:', error);
    return { success: false, error: error.message };
  }
}

// Health check endpoint
app.get('/make-server-ff2da156/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Submit vendor application
app.post('/make-server-ff2da156/vendor-applications', async (c) => {
  try {
    const body = await c.req.json();
    console.log('Received vendor application:', body);

    // Validate required fields - updated to include new fields
    const requiredFields = ['businessName', 'contactName', 'email', 'phone', 'vendorType', 'description', 'productsServices', 'foodPermits', 'availabilityStartWeek'];
    for (const field of requiredFields) {
      if (!body[field]) {
        console.log(`Missing required field: ${field}`);
        return c.json({ 
          error: `Missing required field: ${field}`,
          field: field 
        }, 400);
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      console.log('Invalid email format:', body.email);
      return c.json({ 
        error: 'Invalid email format',
        field: 'email' 
      }, 400);
    }

    // Create application object with timestamp and status - updated to include new fields
    const application = {
      id: crypto.randomUUID(),
      businessName: body.businessName,
      contactName: body.contactName,
      email: body.email,
      phone: body.phone,
      website: body.website || '',
      vendorType: body.vendorType,
      description: body.description,
      productsServices: body.productsServices,
      experience: body.experience || '',
      specialRequirements: body.specialRequirements || '',
      foodPermits: body.foodPermits,
      availabilityStartWeek: body.availabilityStartWeek,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      reviewedAt: null,
      reviewedBy: null,
      notes: ''
    };

    // Store in KV store with application ID as key
    await kv.set(`vendor_application_${application.id}`, application);
    
    // Also store in a list for easy retrieval
    const existingApplications = await kv.get('vendor_applications_list') || [];
    existingApplications.push(application.id);
    await kv.set('vendor_applications_list', existingApplications);

    console.log('Successfully stored vendor application:', application.id);

    // Send notification email
    console.log('Sending notification email...');
    const emailResult = await sendNotificationEmail(application);
    
    if (emailResult.success) {
      console.log('Notification email sent successfully');
    } else {
      console.error('Failed to send notification email:', emailResult.error);
      // Continue with the application submission even if email fails
    }

    return c.json({ 
      success: true, 
      applicationId: application.id,
      message: 'Application submitted successfully!',
      emailSent: emailResult.success
    });

  } catch (error) {
    console.error('Error processing vendor application:', error);
    return c.json({ 
      error: 'Failed to process application. Please try again.',
      details: error.message 
    }, 500);
  }
});

// Get all vendor applications (for admin)
app.get('/make-server-ff2da156/vendor-applications', async (c) => {
  try {
    console.log('Fetching all vendor applications');

    const applicationIds = await kv.get('vendor_applications_list') || [];
    console.log('Found application IDs:', applicationIds);

    if (applicationIds.length === 0) {
      return c.json({ applications: [] });
    }

    // Get all applications
    const applications = [];
    for (const id of applicationIds) {
      const application = await kv.get(`vendor_application_${id}`);
      if (application) {
        applications.push(application);
      }
    }

    // Sort by submission date (newest first)
    applications.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    console.log(`Successfully retrieved ${applications.length} applications`);

    return c.json({ applications });

  } catch (error) {
    console.error('Error fetching vendor applications:', error);
    return c.json({ 
      error: 'Failed to fetch applications',
      details: error.message 
    }, 500);
  }
});

// Update application status (for admin)
app.put('/make-server-ff2da156/vendor-applications/:id', async (c) => {
  try {
    const applicationId = c.req.param('id');
    const body = await c.req.json();
    
    console.log('Updating application:', applicationId, 'with:', body);

    // Get existing application
    const existingApplication = await kv.get(`vendor_application_${applicationId}`);
    if (!existingApplication) {
      return c.json({ error: 'Application not found' }, 404);
    }

    // Update application
    const updatedApplication = {
      ...existingApplication,
      status: body.status || existingApplication.status,
      notes: body.notes || existingApplication.notes,
      reviewedAt: new Date().toISOString(),
      reviewedBy: body.reviewedBy || 'admin'
    };

    await kv.set(`vendor_application_${applicationId}`, updatedApplication);

    console.log('Successfully updated application:', applicationId);

    return c.json({ 
      success: true, 
      application: updatedApplication,
      message: 'Application updated successfully!' 
    });

  } catch (error) {
    console.error('Error updating vendor application:', error);
    return c.json({ 
      error: 'Failed to update application',
      details: error.message 
    }, 500);
  }
});

// Get application statistics
app.get('/make-server-ff2da156/vendor-applications/stats', async (c) => {
  try {
    const applicationIds = await kv.get('vendor_applications_list') || [];
    
    let pending = 0;
    let approved = 0;
    let rejected = 0;
    let total = applicationIds.length;

    // Count by status
    for (const id of applicationIds) {
      const application = await kv.get(`vendor_application_${id}`);
      if (application) {
        switch (application.status) {
          case 'pending':
            pending++;
            break;
          case 'approved':
            approved++;
            break;
          case 'rejected':
            rejected++;
            break;
        }
      }
    }

    return c.json({
      total,
      pending,
      approved,
      rejected
    });

  } catch (error) {
    console.error('Error fetching application stats:', error);
    return c.json({ 
      error: 'Failed to fetch statistics',
      details: error.message 
    }, 500);
  }
});

// Get all vendors from the database
app.get('/make-server-ff2da156/vendors', async (c) => {
  try {
    console.log('Fetching vendors from database');

    const { data: vendors, error } = await supabase
      .from('Vendors')
      .select('id, created_at, name, website, image, vendor_type')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error fetching vendors:', error);
      return c.json({ 
        error: 'Failed to fetch vendors from database',
        details: error.message 
      }, 500);
    }

    console.log(`Successfully fetched ${vendors?.length || 0} vendors`);

    return c.json({ 
      success: true,
      vendors: vendors || []
    });

  } catch (error) {
    console.error('Error fetching vendors:', error);
    return c.json({ 
      error: 'Failed to fetch vendors',
      details: error.message 
    }, 500);
  }
});

console.log('Starting server...');

Deno.serve(app.fetch);