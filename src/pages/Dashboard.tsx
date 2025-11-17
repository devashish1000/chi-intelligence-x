import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return;
    }
    
    navigate("/");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#150b3b] via-[#1d0f52] to-black">
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-4xl animate-fade-in">
          <div className="glass-card cosmic-glow rounded-2xl p-12 shadow-2xl">
            <h1 className="mb-4 text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-center">
              Dashboard
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              Your personalized analytics dashboard
            </p>
            
            <div className="space-y-6">
              <div className="glass-card rounded-xl p-6 border border-primary/30">
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  Welcome to Your Dashboard
                </h2>
                <p className="text-muted-foreground">
                  This is where your customized analytics will appear based on your selected service lines and locations.
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => navigate("/service-selection")}
                  variant="outline"
                  className="glass-card border-border/50 hover:bg-secondary/50"
                >
                  Modify Selection
                </Button>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="glass-card border-border/50 hover:bg-secondary/50"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
