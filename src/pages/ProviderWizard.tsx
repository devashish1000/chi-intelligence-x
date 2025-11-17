import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { User, Settings, CheckCircle, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Validation schemas for each step
const step1Schema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits").max(15),
  specialty: z.string().min(2, "Specialty is required"),
  licenseNumber: z.string().min(5, "License number is required"),
});

const step2Schema = z.object({
  preferredLocations: z.string().min(1, "Please select at least one location"),
  availability: z.enum(["full-time", "part-time", "flexible"], {
    required_error: "Please select availability",
  }),
  yearsExperience: z.string().min(1, "Years of experience is required"),
  additionalNotes: z.string().optional(),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

const ProviderWizard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const starCanvasRef = useRef<HTMLCanvasElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Step1Data & Step2Data>>({});
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: formData as Step1Data,
  });

  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: formData as Step2Data,
  });

  useEffect(() => {
    if (currentStep === 1) {
      step1Form.reset(formData as Step1Data);
    } else if (currentStep === 2) {
      step2Form.reset(formData as Step2Data);
    }
  }, [currentStep]);

  useEffect(() => {
    const starCanvas = starCanvasRef.current;
    const particleCanvas = particleCanvasRef.current;
    if (!starCanvas || !particleCanvas) return;

    const starCtx = starCanvas.getContext("2d");
    const particleCtx = particleCanvas.getContext("2d");
    if (!starCtx || !particleCtx) return;

    // Set canvas dimensions
    const resizeCanvases = () => {
      starCanvas.width = window.innerWidth;
      starCanvas.height = window.innerHeight;
      particleCanvas.width = window.innerWidth;
      particleCanvas.height = window.innerHeight;
    };
    resizeCanvases();

    // Stars
    const stars: { x: number; y: number; r: number }[] = [];
    for (let i = 0; i < 80; i++) {
      stars.push({
        x: Math.random() * starCanvas.width,
        y: Math.random() * starCanvas.height,
        r: Math.random() * 1.5 + 0.5,
      });
    }

    // Particles
    const particles: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * particleCanvas.width,
        y: Math.random() * particleCanvas.height,
        vx: (Math.random() * 1 - 0.5) * 0.4,
        vy: (Math.random() * 1 - 0.5) * 0.4,
        r: Math.random() * 2 + 0.8,
      });
    }

    // Animation loops
    const animateStars = () => {
      starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
      stars.forEach((s) => {
        starCtx.beginPath();
        starCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        starCtx.fillStyle = "rgba(255, 255, 255, 0.8)";
        starCtx.fill();
      });
      requestAnimationFrame(animateStars);
    };

    const animateParticles = () => {
      particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > particleCanvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > particleCanvas.height) p.vy *= -1;
        particleCtx.beginPath();
        particleCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        particleCtx.fillStyle = "rgba(255, 255, 255, 0.4)";
        particleCtx.fill();
      });
      requestAnimationFrame(animateParticles);
    };

    animateStars();
    animateParticles();

    window.addEventListener("resize", resizeCanvases);
    return () => window.removeEventListener("resize", resizeCanvases);
  }, []);

  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await step1Form.trigger();
      if (!isValid) return;
      
      const data = step1Form.getValues();
      setFormData((prev) => ({ ...prev, ...data }));
      setCompletedSteps((prev) => new Set(prev).add(1));
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const isValid = await step2Form.trigger();
      if (!isValid) return;
      
      const data = step2Form.getValues();
      setFormData((prev) => ({ ...prev, ...data }));
      setCompletedSteps((prev) => new Set(prev).add(2));
      setCurrentStep(3);
    } else {
      toast({
        title: "Setup Complete!",
        description: "Your provider profile has been created successfully.",
      });
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEditStep = (step: number) => {
    setCurrentStep(step);
  };

  const handleStepClick = (step: number) => {
    if (completedSteps.has(step) || step < currentStep) {
      setCurrentStep(step);
      setIsMobileSidebarOpen(false); // Close mobile menu after navigation
    }
  };

  const steps = [
    { number: 1, title: "Basic Info", icon: User },
    { number: 2, title: "Preferences", icon: Settings },
    { number: 3, title: "Confirm", icon: CheckCircle },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0a021f] via-[#150b3b] to-black">
      {/* Background layers */}
      <canvas
        ref={starCanvasRef}
        className="absolute inset-0 z-0"
        style={{ pointerEvents: "none" }}
      />
      <canvas
        ref={particleCanvasRef}
        className="absolute inset-0 z-[1]"
        style={{ pointerEvents: "none" }}
      />
      
      {/* Floating blobs */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-purple-600/30 to-transparent blur-[90px] animate-float-1" />
        <div className="absolute bottom-[5%] right-[-10%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-blue-600/25 to-transparent blur-[90px] animate-float-2" />
        <div className="absolute top-[45%] left-[20%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-green-500/20 to-transparent blur-[90px] animate-float-3" />
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        {/* Mobile Hamburger Menu Button */}
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="md:hidden fixed top-4 left-4 z-50 p-3 bg-background/90 backdrop-blur-sm border border-border rounded-lg shadow-lg hover:bg-accent transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Overlay */}
        {isMobileSidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        <div className="flex gap-6 w-full max-w-5xl">
          {/* Sidebar Navigation */}
          <div className={cn(
            "glass-card rounded-2xl shadow-2xl backdrop-blur-xl border border-white/10 p-6 w-64 h-fit animate-fade-in",
            "md:block", // Always visible on desktop
            "transition-transform duration-300 ease-in-out",
            // Mobile: fixed positioned, slide in/out
            "fixed md:relative top-20 md:top-0 left-4 md:left-0 z-50 md:z-auto",
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-[calc(100%+2rem)] md:translate-x-0"
          )}>
            <h2 className="text-lg font-semibold text-foreground mb-6">Setup Steps</h2>
            <div className="space-y-3">
              {steps.map((step) => {
                const Icon = step.icon;
                const isCompleted = completedSteps.has(step.number);
                const isCurrent = currentStep === step.number;
                const isClickable = isCompleted || step.number < currentStep;

                return (
                  <button
                    key={step.number}
                    onClick={() => handleStepClick(step.number)}
                    disabled={!isClickable && !isCurrent}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
                      isCurrent && "bg-primary/20 border border-primary/30",
                      isClickable && !isCurrent && "hover:bg-muted/30 cursor-pointer",
                      !isClickable && !isCurrent && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full transition-all",
                        isCurrent && "bg-primary text-primary-foreground",
                        isCompleted && !isCurrent && "bg-primary/40 text-primary-foreground",
                        !isCompleted && !isCurrent && "bg-muted/30 text-muted-foreground"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="text-left flex-1">
                      <div className="text-sm font-medium text-foreground">
                        Step {step.number}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {step.title}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main wizard content */}
          <div className="flex-1 glass-card cosmic-glow rounded-2xl p-8 shadow-2xl animate-fade-in">
            <h1 className="mb-2 text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-center">
              Provider Setup Wizard
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              Step {currentStep} of 3
            </p>

            {/* Progress indicator */}
            <div className="flex gap-2 mb-8">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    step <= currentStep ? "bg-primary" : "bg-border"
                  }`}
                />
              ))}
            </div>

            {/* Step content */}
            <div className="min-h-[400px]">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold text-foreground mb-2">
                      Basic Information
                    </h2>
                    <p className="text-muted-foreground">
                      Tell us about yourself
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        placeholder="Dr. John Smith"
                        {...step1Form.register("fullName")}
                        className="glass-card border-border/50"
                      />
                      {step1Form.formState.errors.fullName && (
                        <p className="text-sm text-red-400">
                          {step1Form.formState.errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john.smith@example.com"
                        {...step1Form.register("email")}
                        className="glass-card border-border/50"
                      />
                      {step1Form.formState.errors.email && (
                        <p className="text-sm text-red-400">
                          {step1Form.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        placeholder="(555) 123-4567"
                        {...step1Form.register("phone")}
                        className="glass-card border-border/50"
                      />
                      {step1Form.formState.errors.phone && (
                        <p className="text-sm text-red-400">
                          {step1Form.formState.errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialty">Medical Specialty *</Label>
                      <Input
                        id="specialty"
                        placeholder="Neurosciences, Pain Management, etc."
                        {...step1Form.register("specialty")}
                        className="glass-card border-border/50"
                      />
                      {step1Form.formState.errors.specialty && (
                        <p className="text-sm text-red-400">
                          {step1Form.formState.errors.specialty.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">License Number *</Label>
                      <Input
                        id="licenseNumber"
                        placeholder="NE-12345"
                        {...step1Form.register("licenseNumber")}
                        className="glass-card border-border/50"
                      />
                      {step1Form.formState.errors.licenseNumber && (
                        <p className="text-sm text-red-400">
                          {step1Form.formState.errors.licenseNumber.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold text-foreground mb-2">
                      Preferences
                    </h2>
                    <p className="text-muted-foreground">
                      Set your working preferences
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="preferredLocations">Preferred Locations *</Label>
                      <Input
                        id="preferredLocations"
                        placeholder="Bergan Mercy, Lakeside, etc."
                        {...step2Form.register("preferredLocations")}
                        className="glass-card border-border/50"
                      />
                      {step2Form.formState.errors.preferredLocations && (
                        <p className="text-sm text-red-400">
                          {step2Form.formState.errors.preferredLocations.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label>Availability *</Label>
                      <RadioGroup
                        onValueChange={(value) => step2Form.setValue("availability", value as "full-time" | "part-time" | "flexible")}
                        defaultValue={step2Form.getValues("availability")}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="full-time" id="full-time" />
                          <Label htmlFor="full-time" className="font-normal cursor-pointer">
                            Full-time
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="part-time" id="part-time" />
                          <Label htmlFor="part-time" className="font-normal cursor-pointer">
                            Part-time
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="flexible" id="flexible" />
                          <Label htmlFor="flexible" className="font-normal cursor-pointer">
                            Flexible
                          </Label>
                        </div>
                      </RadioGroup>
                      {step2Form.formState.errors.availability && (
                        <p className="text-sm text-red-400">
                          {step2Form.formState.errors.availability.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="yearsExperience">Years of Experience *</Label>
                      <Input
                        id="yearsExperience"
                        type="number"
                        placeholder="10"
                        {...step2Form.register("yearsExperience")}
                        className="glass-card border-border/50"
                      />
                      {step2Form.formState.errors.yearsExperience && (
                        <p className="text-sm text-red-400">
                          {step2Form.formState.errors.yearsExperience.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="additionalNotes">Additional Notes</Label>
                      <Textarea
                        id="additionalNotes"
                        placeholder="Any additional information you'd like to share..."
                        {...step2Form.register("additionalNotes")}
                        className="glass-card border-border/50 min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold text-foreground mb-2">
                      Review & Confirm
                    </h2>
                    <p className="text-muted-foreground">
                      Please review your information
                    </p>
                  </div>

                  <div className="space-y-4 glass-card p-6 rounded-lg border border-border/50">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-foreground">
                          Basic Information
                        </h3>
                        <button
                          onClick={() => handleEditStep(1)}
                          className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span className="text-foreground">{formData.fullName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email:</span>
                          <span className="text-foreground">{formData.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phone:</span>
                          <span className="text-foreground">{formData.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Specialty:</span>
                          <span className="text-foreground">{formData.specialty}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">License:</span>
                          <span className="text-foreground">{formData.licenseNumber}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border/30 pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-foreground">
                          Preferences
                        </h3>
                        <button
                          onClick={() => handleEditStep(2)}
                          className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Locations:</span>
                          <span className="text-foreground">{formData.preferredLocations}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Availability:</span>
                          <span className="text-foreground capitalize">
                            {formData.availability?.replace("-", " ")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Experience:</span>
                          <span className="text-foreground">{formData.yearsExperience} years</span>
                        </div>
                        {formData.additionalNotes && (
                          <div className="pt-2">
                            <span className="text-muted-foreground block mb-1">Notes:</span>
                            <span className="text-foreground text-xs block">
                              {formData.additionalNotes}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-4 justify-between mt-8">
              <Button
                onClick={handleBack}
                variant="outline"
                className="glass-card border-border/50"
                disabled={currentStep === 1}
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                className="bg-primary hover:bg-primary/90"
              >
                {currentStep === 3 ? "Complete Setup" : "Next Step"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderWizard;
