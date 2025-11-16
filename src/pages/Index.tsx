import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Index = () => {
  const navigate = useNavigate();
  const starCanvasRef = useRef<HTMLCanvasElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const mouseBlobRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const starCanvas = starCanvasRef.current;
    const particleCanvas = particleCanvasRef.current;
    if (!starCanvas || !particleCanvas) return;

    const starCtx = starCanvas.getContext("2d");
    const particleCtx = particleCanvas.getContext("2d");
    if (!starCtx || !particleCtx) return;

    // Set canvas sizes
    const resizeCanvases = () => {
      starCanvas.width = window.innerWidth;
      starCanvas.height = window.innerHeight;
      particleCanvas.width = window.innerWidth;
      particleCanvas.height = window.innerHeight;
    };
    resizeCanvases();
    window.addEventListener("resize", resizeCanvases);

    // Stars
    const stars: { x: number; y: number; r: number }[] = [];
    for (let i = 0; i < 50; i++) {
      stars.push({
        x: Math.random() * starCanvas.width,
        y: Math.random() * starCanvas.height,
        r: Math.random() * 1.5 + 0.5,
      });
    }

    // Particles
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
    }[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * particleCanvas.width,
        y: Math.random() * particleCanvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.8,
      });
    }

    // Animation loops
    const animateStars = () => {
      starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
      stars.forEach((s) => {
        starCtx.beginPath();
        starCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        starCtx.fillStyle = "white";
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

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseBlobRef.current) {
        mouseBlobRef.current.style.transform = `translate(${e.clientX - 110}px, ${e.clientY - 110}px)`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", resizeCanvases);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password });
    navigate("/service-selection");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[hsl(var(--cosmic-bg))]">
      {/* Background Container */}
      <div className="absolute inset-0 z-0">
        <canvas
          ref={starCanvasRef}
          className="absolute inset-0 z-[2]"
        />
        <canvas
          ref={particleCanvasRef}
          className="absolute inset-0 z-[1]"
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#090924] to-[#030313] animate-hue-rotate" />
        
        {/* Floating Blobs */}
        <div className="absolute inset-0 z-[3] pointer-events-none">
          <div
            className="absolute w-[450px] h-[450px] rounded-full blur-[90px] opacity-65 top-[10%] -left-[10%] animate-float-1"
            style={{
              background: "radial-gradient(circle at 30% 70%, rgba(123, 31, 162, 0.45), transparent 60%)",
            }}
          />
          <div
            className="absolute w-[450px] h-[450px] rounded-full blur-[90px] opacity-65 bottom-[5%] -right-[10%] animate-float-2"
            style={{
              background: "radial-gradient(circle at 70% 20%, rgba(33, 150, 243, 0.35), transparent 60%)",
            }}
          />
          <div
            className="absolute w-[450px] h-[450px] rounded-full blur-[90px] opacity-65 top-[45%] left-[20%] animate-float-3"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(0, 230, 118, 0.30), transparent 70%)",
            }}
          />
        </div>

        {/* Mouse Blob */}
        <div
          ref={mouseBlobRef}
          className="absolute w-[220px] h-[220px] rounded-full blur-[80px] opacity-35 pointer-events-none z-[4]"
          style={{
            background: "hsl(var(--cosmic-accent-glow) / 0.55)",
          }}
        />
      </div>

      {/* Login Card */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="glass-card cosmic-glow rounded-2xl p-8 shadow-2xl">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-muted-foreground">
                Sign in to your cosmic account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-card border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-card border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold transition-opacity"
              >
                Sign In
              </Button>

              <div className="text-center">
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="glass-card border-border/50 hover:bg-secondary/50"
                >
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="glass-card border-border/50 hover:bg-secondary/50"
                >
                  GitHub
                </Button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <a
                href="#"
                className="font-semibold text-primary hover:text-accent transition-colors"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
