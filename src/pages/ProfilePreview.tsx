import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, Share2, Mail, Phone, Award, Calendar, Languages, Heart, Shield } from "lucide-react";

interface ProviderData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseState: string;
  specialties: string[];
  yearsExperience: string;
  availability: string[];
  sessionTypes: string[];
  acceptsInsurance: string;
  languages: string[];
  therapeuticApproaches: string[];
}

const ProfilePreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const providerData = location.state?.providerData as ProviderData | undefined;

  // Fallback to localStorage if no state passed
  const storedData = localStorage.getItem("providerFormData");
  const data: ProviderData | null = providerData || (storedData ? JSON.parse(storedData) : null);

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="glass-card max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">No provider data found</p>
            <Button onClick={() => navigate("/provider-wizard")}>
              Go to Provider Wizard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${data.firstName} ${data.lastName} - Provider Profile`,
          text: `Check out my provider profile`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback - copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Hide on print */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10 print:hidden">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare} className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="default" onClick={handlePrint} className="gap-2">
              <Download className="h-4 w-4" />
              Print / Save PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Provider Header */}
        <Card className="glass-card mb-6">
          <CardHeader className="text-center pb-4">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl font-bold text-primary">
                {data.firstName[0]}{data.lastName[0]}
              </span>
            </div>
            <CardTitle className="text-3xl mb-2">
              {data.firstName} {data.lastName}
            </CardTitle>
            <div className="flex flex-wrap gap-2 justify-center">
              {data.specialties.map((specialty) => (
                <Badge key={specialty} variant="secondary" className="text-sm">
                  {specialty}
                </Badge>
              ))}
            </div>
          </CardHeader>
        </Card>

        {/* Contact Information */}
        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{data.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{data.phone}</span>
            </div>
          </CardContent>
        </Card>

        {/* Professional Details */}
        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Professional Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">License Information</h4>
              <p className="text-lg">
                {data.licenseNumber} ({data.licenseState})
              </p>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">Years of Experience</h4>
              <p className="text-lg">{data.yearsExperience}</p>
            </div>
          </CardContent>
        </Card>

        {/* Practice Preferences */}
        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Practice Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Availability
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.availability.map((day) => (
                  <Badge key={day} variant="outline">
                    {day}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">Session Types</h4>
              <div className="flex flex-wrap gap-2">
                {data.sessionTypes.map((type) => (
                  <Badge key={type} variant="outline">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Insurance
              </h4>
              <p className="text-lg">{data.acceptsInsurance}</p>
            </div>
          </CardContent>
        </Card>

        {/* Therapeutic Approaches */}
        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Therapeutic Approaches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.therapeuticApproaches.map((approach) => (
                <Badge key={approach} className="bg-primary/10 text-primary hover:bg-primary/20">
                  {approach}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Languages */}
        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              Languages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.languages.map((language) => (
                <Badge key={language} variant="secondary">
                  {language}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer - Hide on print */}
        <div className="text-center text-sm text-muted-foreground mt-8 print:hidden">
          <p>Profile created on {new Date().toLocaleDateString()}</p>
        </div>
      </main>

      {/* Print Styles */}
      <style>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          body {
            background: white;
          }
          .glass-card {
            box-shadow: none !important;
            border: 1px solid #e5e7eb;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePreview;
