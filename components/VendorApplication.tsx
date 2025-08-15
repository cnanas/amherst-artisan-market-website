import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { toast } from "sonner";
import {
  projectId,
  publicAnonKey,
} from "../utils/supabase/info";

export function VendorApplication() {
  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    vendorType: "",
    description: "",
    productsServices: "",
    experience: "",
    specialRequirements: "",
    foodPermits: "",
    availabilityStartWeek: "",
    agreement: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreement) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Submitting vendor application:", formData);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ff2da156/vendor-applications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(formData),
        },
      );

      const result = await response.json();
      console.log("Server response:", result);

      if (!response.ok) {
        throw new Error(
          result.error || `Server error: ${response.status}`,
        );
      }

      if (result.success) {
        setApplicationId(result.applicationId);
        setIsSubmitted(true);

        toast.success(
          "Application submitted successfully! We'll be in touch soon.",
          {
            description: `Application ID: ${result.applicationId}`,
            duration: 5000,
          },
        );
      } else {
        throw new Error(
          result.error || "Unknown error occurred",
        );
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(
        "Failed to submit application. Please try again.",
        {
          description: error.message,
          duration: 5000,
        },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    field: string,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNewApplication = () => {
    setIsSubmitted(false);
    setApplicationId("");
    setFormData({
      businessName: "",
      contactName: "",
      email: "",
      phone: "",
      website: "",
      vendorType: "",
      description: "",
      productsServices: "",
      experience: "",
      specialRequirements: "",
      foodPermits: "",
      availabilityStartWeek: "",
      agreement: false,
    });
  };

  // Show thank you message if form has been successfully submitted
  if (isSubmitted) {
    return (
      <div className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-2 rounded-full mb-6">
              <span className="font-medium">
                Application Submitted
              </span>
            </div>
          </div>

          <Card className="shadow-xl border-slate-200 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="mb-8">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <h2 className="text-slate-800 mb-4">
                  Thank You for Your Application!
                </h2>

                <p className="text-slate-700 text-lg mb-6 max-w-2xl mx-auto">
                  We've received your vendor application and are
                  excited to learn more about your business. Our
                  team will review your submission and get back
                  to you soon.
                </p>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8 max-w-md mx-auto">
                  <h3 className="font-medium text-emerald-900 mb-2">
                    Application Reference
                  </h3>
                  <p className="text-emerald-800 font-mono text-sm break-all">
                    ID: {applicationId}
                  </p>
                  <p className="text-emerald-700 text-sm mt-2">
                    Save this ID for your records
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div className="bg-slate-50 rounded-xl p-6">
                    <h4 className="font-medium text-slate-800 mb-3 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      What Happens Next?
                    </h4>
                    <ul className="text-sm text-slate-700 space-y-2">
                      <li>
                        • Our team will review your application
                        within 5-7 business days
                      </li>
                      <li>
                        • We'll contact you via email with our
                        decision
                      </li>
                      <li>
                        • If approved, we'll send vendor
                        information and setup details
                      </li>
                      <li>
                        • Questions? Email us at
                        vendors@amherstartisansmarket.com
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-6">
                    <h4 className="font-medium text-slate-800 mb-3 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Important Reminder
                    </h4>
                    <p className="text-sm text-slate-700">
                      We are currently at capacity for vendor
                      participation. Your application has been
                      added to our waiting list, and we'll
                      contact you as soon as a spot becomes
                      available.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <Button
                    onClick={handleNewApplication}
                    variant="outline"
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  >
                    Submit Another Application
                  </Button>

                  <Button
                    onClick={() => (window.location.href = import.meta.env.BASE_URL)}
                    className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                  >
                    Return to Homepage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 shadow-lg">
              <p className="text-slate-600 text-sm">
                Follow us on social media for market updates and
                vendor spotlights at{" "}
                <span className="text-emerald-700 font-medium">
                  @AmherstArtisansMarket
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show the application form
  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-2 rounded-full mb-6">
            <span className="font-medium">
              Join Our Community
            </span>
          </div>
          <h2 className="text-slate-800 mb-4">
            Vendor Application
          </h2>
          <p className="text-slate-700 max-w-3xl mx-auto">
            Join the Amherst Artisans Market community! Fill out
            this application to become part of our vibrant
            weekly market featuring local artisans, crafters,
            and food vendors. We're excited to learn about your
            unique offerings.
          </p>
        </div>

        {/* Capacity Warning */}
        <div className="mb-8">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-amber-900 mb-2">
                  Currently At Capacity
                </h3>
                <p className="text-amber-800 leading-relaxed">
                  We are currently at capacity in terms of
                  vendor participation! Please feel free to
                  apply if you'd like to be added to our vendor
                  waiting list. We will contact you as soon as a
                  spot becomes available!
                </p>
              </div>
            </div>
          </div>
        </div>

        <Card className="shadow-xl border-slate-200 bg-white/95 backdrop-blur-sm">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <CardTitle className="text-slate-800">
              Application Form
            </CardTitle>
            <CardDescription className="text-slate-700">
              Please provide detailed information about your
              business and products. All fields marked with *
              are required.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="businessName"
                    className="text-slate-800"
                  >
                    Business/Vendor Name *
                  </Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) =>
                      handleChange(
                        "businessName",
                        e.target.value,
                      )
                    }
                    required
                    placeholder="Enter your business name"
                    className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="contactName"
                    className="text-slate-800"
                  >
                    Contact Person Name *
                  </Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) =>
                      handleChange(
                        "contactName",
                        e.target.value,
                      )
                    }
                    required
                    placeholder="Your full name"
                    className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="email"
                    className="text-slate-800"
                  >
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      handleChange("email", e.target.value)
                    }
                    required
                    placeholder="your@email.com"
                    className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="phone"
                    className="text-slate-800"
                  >
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      handleChange("phone", e.target.value)
                    }
                    required
                    placeholder="(555) 123-4567"
                    className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="website"
                  className="text-slate-800"
                >
                  Website/Social Media (optional)
                </Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) =>
                    handleChange("website", e.target.value)
                  }
                  placeholder="https://yourwebsite.com or @yoursocialmedia"
                  className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="vendorType"
                  className="text-slate-800"
                >
                  Vendor Type *
                </Label>
                <Select
                  value={formData.vendorType}
                  onValueChange={(value) =>
                    handleChange("vendorType", value)
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500">
                    <SelectValue placeholder="Select your vendor category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="artisan">
                      Artisan/Crafts
                    </SelectItem>
                    <SelectItem value="jewelry">
                      Jewelry
                    </SelectItem>
                    <SelectItem value="art">
                      Fine Art
                    </SelectItem>
                    <SelectItem value="pottery">
                      Pottery/Ceramics
                    </SelectItem>
                    <SelectItem value="textiles">
                      Textiles/Clothing
                    </SelectItem>
                    <SelectItem value="woodwork">
                      Woodworking
                    </SelectItem>
                    <SelectItem value="food">
                      Food Vendor
                    </SelectItem>
                    <SelectItem value="musician">
                      Musician/Performer
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="description"
                  className="text-slate-800"
                >
                  Business Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleChange("description", e.target.value)
                  }
                  required
                  placeholder="Tell us about your business, mission, and what makes you unique..."
                  rows={4}
                  className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="productsServices"
                  className="text-slate-800"
                >
                  Products/Services Offered *
                </Label>
                <Textarea
                  id="productsServices"
                  value={formData.productsServices}
                  onChange={(e) =>
                    handleChange(
                      "productsServices",
                      e.target.value,
                    )
                  }
                  required
                  placeholder="Describe the products or services you plan to offer at the market..."
                  rows={4}
                  className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="experience"
                  className="text-slate-800"
                >
                  Market/Vendor Experience
                </Label>
                <Textarea
                  id="experience"
                  value={formData.experience}
                  onChange={(e) =>
                    handleChange("experience", e.target.value)
                  }
                  placeholder="Tell us about your previous market or vendor experience (if any)..."
                  rows={3}
                  className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  disabled={isSubmitting}
                />
              </div>

              {/* New Food Permits Field */}
              <div className="space-y-3">
                <Label
                  htmlFor="foodPermits"
                  className="text-slate-800"
                >
                  Food Permits *
                </Label>
                <Textarea
                  id="foodPermits"
                  value={formData.foodPermits}
                  onChange={(e) =>
                    handleChange("foodPermits", e.target.value)
                  }
                  required
                  placeholder="If you are serving food of any kind, do you have required permits required by the town of Amherst? Answer NA if not applicable..."
                  rows={3}
                  className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  disabled={isSubmitting}
                />
              </div>

              {/* New Availability Start Week Field */}
              <div className="space-y-3">
                <Label
                  htmlFor="availabilityStartWeek"
                  className="text-slate-800"
                >
                  Availability Start Week *
                </Label>
                <Input
                  id="availabilityStartWeek"
                  value={formData.availabilityStartWeek}
                  onChange={(e) =>
                    handleChange(
                      "availabilityStartWeek",
                      e.target.value,
                    )
                  }
                  required
                  placeholder="What week specifically will you be available to start attending the market?"
                  className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="specialRequirements"
                  className="text-slate-800"
                >
                  Special Requirements
                </Label>
                <Textarea
                  id="specialRequirements"
                  value={formData.specialRequirements}
                  onChange={(e) =>
                    handleChange(
                      "specialRequirements",
                      e.target.value,
                    )
                  }
                  placeholder="Do you need electricity, special setup space, or have other requirements?"
                  rows={3}
                  className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  disabled={isSubmitting}
                />
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                <h3 className="font-medium text-emerald-900 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-emerald-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Important Market Information
                </h3>
                <ul className="text-sm text-emerald-800 space-y-2 mb-4">
                  <li>
                    • Market runs Thursdays 3-7 PM, May through
                    October
                  </li>
                  <li>
                    • Vendor fees: $25/week for artisans,
                    $35/week for food vendors
                  </li>
                  <li>
                    • You must provide your own table, tent, and
                    setup materials
                  </li>
                  <li>
                    • Food vendors must have appropriate permits
                    and licenses
                  </li>
                  <li>
                    • Setup begins at 2:00 PM, breakdown by 7:30
                    PM
                  </li>
                  <li>
                    • Rain or shine market (covered pavilion
                    available)
                  </li>
                </ul>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <Checkbox
                  id="agreement"
                  checked={formData.agreement}
                  onCheckedChange={(checked) =>
                    handleChange(
                      "agreement",
                      checked as boolean,
                    )
                  }
                  className="mt-1 border-emerald-400 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                  disabled={isSubmitting}
                />
                <Label
                  htmlFor="agreement"
                  className="text-sm text-slate-700 leading-relaxed"
                >
                  I agree to the terms and conditions and
                  understand the vendor requirements for the
                  Amherst Artisans Market. I confirm that all
                  information provided is accurate and complete.
                  *
                </Label>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !formData.agreement}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting Application...
                  </div>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 shadow-lg">
            <h4 className="font-medium text-slate-800 mb-2">
              Questions about the application process?
            </h4>
            <p className="text-slate-600 text-sm">
              Contact us at{" "}
              <a
                href="mailto:vendors@amherstartisansmarket.com"
                className="text-emerald-700 hover:text-emerald-800 underline transition-colors"
              >
                vendors@amherstartisansmarket.com
              </a>{" "}
              or call us at{" "}
              <a
                href="tel:+14135550123"
                className="text-emerald-700 hover:text-emerald-800 underline transition-colors"
              >
                (413) 555-0123
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}