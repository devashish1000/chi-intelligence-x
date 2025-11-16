import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ServiceSelection = () => {
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const starCanvasRef = useRef<HTMLCanvasElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);

  const services = [
    { name: "Neurosciences", icon: "brain-icon" },
    { name: "Pain Management", icon: "pain-icon" },
    { name: "Podiatry", icon: "foot-icon" },
    { name: "PM&R", icon: "rehab-icon" },
  ];

  const locations = [
    "Bergan Mercy",
    "Lakeside",
    "Immanuel",
    "Mercy Council Bluffs",
    "Other",
  ];

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const toggleLocation = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location]
    );
  };

  const canContinue = selectedServices.length > 0 && selectedLocations.length > 0;

  useEffect(() => {
    const starCanvas = starCanvasRef.current;
    const particleCanvas = particleCanvasRef.current;
    if (!starCanvas || !particleCanvas) return;

    const starCtx = starCanvas.getContext("2d");
    const particleCtx = particleCanvas.getContext("2d");
    if (!starCtx || !particleCtx) return;

    const resizeCanvases = () => {
      starCanvas.width = window.innerWidth;
      starCanvas.height = window.innerHeight;
      particleCanvas.width = window.innerWidth;
      particleCanvas.height = window.innerHeight;
    };

    resizeCanvases();
    window.addEventListener("resize", resizeCanvases);

    const stars: { x: number; y: number; r: number }[] = [];
    for (let i = 0; i < 80; i++) {
      stars.push({
        x: Math.random() * starCanvas.width,
        y: Math.random() * starCanvas.height,
        r: Math.random() * 1.5 + 0.5,
      });
    }

    const particles: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * particleCanvas.width,
        y: Math.random() * particleCanvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 0.8,
      });
    }

    let animationId: number;

    const animate = () => {
      starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
      stars.forEach((s) => {
        starCtx.beginPath();
        starCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        starCtx.fillStyle = "rgba(255,255,255,0.8)";
        starCtx.fill();
      });

      particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > particleCanvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > particleCanvas.height) p.vy *= -1;
        particleCtx.beginPath();
        particleCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        particleCtx.fillStyle = "rgba(255,255,255,0.4)";
        particleCtx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvases);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#150b3b] via-[#1d0f52] to-black">
      <canvas
        ref={starCanvasRef}
        className="absolute inset-0 z-[1]"
      />
      <canvas
        ref={particleCanvasRef}
        className="absolute inset-0 z-[2]"
      />
      
      <div className="absolute inset-0 z-[3] pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-[450px] h-[450px] rounded-full blur-[90px] opacity-65 bg-gradient-to-br from-purple-600/45 to-transparent animate-float-1" />
        <div className="absolute bottom-[5%] right-[-10%] w-[450px] h-[450px] rounded-full blur-[90px] opacity-65 bg-gradient-to-br from-blue-500/35 to-transparent animate-float-2" />
        <div className="absolute top-[45%] left-[20%] w-[450px] h-[450px] rounded-full blur-[90px] opacity-65 bg-gradient-to-br from-teal-400/30 to-transparent animate-float-3" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-4xl glass-card rounded-2xl p-8 space-y-8 animate-fade-in">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold text-foreground">
              Choose Your Service Lines & Locations
            </h2>
            <p className="text-muted-foreground text-lg">
              Customize the data you want to analyze.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">
                Service Lines
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {services.map((service) => (
                  <button
                    key={service.name}
                    onClick={() => toggleService(service.name)}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                      selectedServices.includes(service.name)
                        ? "border-primary bg-primary/20 cosmic-glow"
                        : "border-border/30 bg-card/50 hover:border-primary/50"
                    }`}
                  >
                    <div className={`w-16 h-16 mx-auto mb-3 rounded-full ${service.icon} ${
                      selectedServices.includes(service.name)
                        ? "bg-primary/30"
                        : "bg-muted"
                    }`} />
                    <span className="text-foreground font-medium">
                      {service.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">
                CHI Omaha Locations
              </h3>
              <div className="flex flex-wrap gap-3">
                {locations.map((location) => (
                  <button
                    key={location}
                    onClick={() => toggleLocation(location)}
                    className={`px-6 py-3 rounded-full border-2 transition-all duration-300 ${
                      selectedLocations.includes(location)
                        ? "border-primary bg-primary/20 text-primary-foreground"
                        : "border-border/30 bg-card/50 text-foreground hover:border-primary/50"
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 space-y-4 border border-primary/30">
              <h3 className="text-xl font-semibold text-foreground">
                Your Selection
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-muted-foreground font-medium">
                    Service Lines:{" "}
                  </span>
                  <span className="text-foreground">
                    {selectedServices.length > 0
                      ? selectedServices.join(", ")
                      : "No services selected"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium">
                    Locations:{" "}
                  </span>
                  <span className="text-foreground">
                    {selectedLocations.length > 0
                      ? selectedLocations.join(", ")
                      : "No locations selected"}
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => navigate("/dashboard")}
              disabled={!canContinue}
              size="lg"
              className="w-full text-lg cosmic-glow"
            >
              Continue to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSelection;
