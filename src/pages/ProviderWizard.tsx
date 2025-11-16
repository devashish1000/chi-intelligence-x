import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ProviderWizard = () => {
  const navigate = useNavigate();
  const starCanvasRef = useRef<HTMLCanvasElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const [currentStep, setCurrentStep] = useState(1);

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

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

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

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-2xl animate-fade-in">
          <div className="glass-card cosmic-glow rounded-2xl p-8 shadow-2xl">
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
            <div className="min-h-[300px] flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  {currentStep === 1 && "Step 1: Basic Information"}
                  {currentStep === 2 && "Step 2: Preferences"}
                  {currentStep === 3 && "Step 3: Confirmation"}
                </h2>
                <p className="text-muted-foreground">
                  {currentStep === 1 && "Configure your provider information"}
                  {currentStep === 2 && "Set your preferences and settings"}
                  {currentStep === 3 && "Review and confirm your setup"}
                </p>
              </div>
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
                {currentStep === 3 ? "Complete" : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderWizard;
