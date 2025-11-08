import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Zap, Palette, Code2, Sparkles, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface Preset {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  colors: string[];
}

const PRESETS: Preset[] = [
  {
    id: "dev-builder",
    name: "Dev Builder",
    description: "Perfect for Roblox creators and game developers",
    icon: <Code2 className="w-8 h-8" />,
    category: "Portfolio",
    colors: ["#6FC3DF", "#C0A7FF", "#FF8CBA"],
  },
  {
    id: "artist-light",
    name: "Artist Light",
    description: "Bright, minimal design with focus on visual work",
    icon: <Palette className="w-8 h-8" />,
    category: "Portfolio",
    colors: ["#F9F9FB", "#6FC3DF", "#C0A7FF"],
  },
  {
    id: "minimal-pro",
    name: "Minimal Pro",
    description: "Clean, professional CV-style portfolio",
    icon: <Sparkles className="w-8 h-8" />,
    category: "Portfolio",
    colors: ["#FFFFFF", "#0A0A0A", "#6FC3DF"],
  },
  {
    id: "showcase-classic",
    name: "Showcase Classic",
    description: "Bold layouts with animated project showcases",
    icon: <Zap className="w-8 h-8" />,
    category: "Portfolio",
    colors: ["#0A0A0A", "#FFFFFF", "#C0A7FF"],
  },
  {
    id: "custom",
    name: "Custom",
    description: "Start blank and design your own",
    icon: <Sparkles className="w-8 h-8" />,
    category: "Portfolio",
    colors: ["#6FC3DF", "#C0A7FF", "#FF8CBA"],
  },
];

export default function Index() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const handleStartCreating = (presetId: string) => {
    setSelectedPreset(presetId);
    setShowEditor(true);
  };

  const handleBeginButton = () => {
    if (user) {
      navigate("/build");
    } else {
      navigate("/register");
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowEditor(false);
  };

  if (showEditor) {
    return (
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-grotesk font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              CosmosPort
            </h1>
            <button
              onClick={() => setShowEditor(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back
            </button>
          </div>
        </header>

        {/* Editor Placeholder */}
        <div className="relative z-10 min-h-[calc(100vh-80px)] flex items-center justify-center">
          <div className="text-center max-w-2xl mx-auto px-4">
            <h2 className="text-4xl font-grotesk font-bold mb-4 glow">
              Editor Coming Soon
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              You selected the <span className="text-primary font-semibold">{selectedPreset}</span> preset.
            </p>
            <p className="text-muted-foreground mb-8">
              The full WYSIWYG editor with inline editing, preset customization, and Firebase integration is being built.
            </p>
            <button
              onClick={() => setShowEditor(false)}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg border border-white/15 bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 transition-all glow-button hover:glow-pulse"
            >
              Choose Different Preset
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Main Content with relative positioning to sit above starfield */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-grotesk font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              CosmosPort
            </h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              Create • Customize • Publish
            </p>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm">
              <span className="text-xs text-muted-foreground uppercase tracking-widest">
                ✦ Your Portfolio, Your Universe
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-grotesk font-bold mb-6 leading-tight">
              Crée ton monde,{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                montre ton talent
              </span>
              .
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Sans compte. Sans code. Sans limites. Crée ton portfolio en quelques minutes, 
              personnalise-le, et partage-le au monde. Tout ça, instantanément.
            </p>

            <button
              onClick={() => setShowEditor(true)}
              className={cn(
                "inline-flex items-center gap-3 px-8 py-4 rounded-lg",
                "border border-white/15 hover:border-white/30",
                "bg-gradient-to-r from-primary/10 to-secondary/10",
                "hover:from-primary/20 hover:to-secondary/20",
                "transition-all duration-300",
                "group font-grotesk font-semibold text-lg",
                "glow-button hover:glow-pulse"
              )}
            >
              Commencer
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>

        {/* Presets Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-grotesk font-bold mb-4">Choisis ton style</h3>
            <p className="text-muted-foreground text-lg">
              Commence avec un preset, puis personnalise chaque détail
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRESETS.map((preset) => (
              <div
                key={preset.id}
                onClick={() => handleStartCreating(preset.id)}
                className={cn(
                  "p-6 rounded-xl border transition-all duration-300 cursor-pointer",
                  "hover:border-white/30 hover:bg-white/5",
                  "group",
                  selectedPreset === preset.id
                    ? "border-primary bg-primary/10"
                    : "border-white/10 bg-white/[0.02]"
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    "p-3 rounded-lg transition-colors",
                    selectedPreset === preset.id
                      ? "bg-primary/20 text-primary"
                      : "bg-white/10 text-muted-foreground group-hover:bg-white/15"
                  )}>
                    {preset.icon}
                  </div>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest">
                    {preset.category}
                  </span>
                </div>

                <h4 className="text-xl font-grotesk font-bold mb-2">{preset.name}</h4>
                <p className="text-muted-foreground text-sm mb-6">{preset.description}</p>

                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {preset.colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="w-6 h-6 rounded-full border border-white/10"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground ml-auto group-hover:text-primary transition-colors">
                    Personnalise →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20 border-t border-white/10">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="mb-4 text-4xl">✨</div>
              <h4 className="text-xl font-grotesk font-bold mb-3">Edition en direct</h4>
              <p className="text-muted-foreground">
                Modifie ton contenu en temps réel. Chaque changement s'affiche instantanément.
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 text-4xl">🚀</div>
              <h4 className="text-xl font-grotesk font-bold mb-3">Publication instantanée</h4>
              <p className="text-muted-foreground">
                Clique sur « Publier » et ton portfolio est en ligne. Pas d'attente, pas de configuration.
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 text-4xl">🌌</div>
              <h4 className="text-xl font-grotesk font-bold mb-3">Lien direct</h4>
              <p className="text-muted-foreground">
                https://cosmosport.com/@tonnom — C'est tout ce dont tu as besoin.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 mt-20 py-12">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p>Made with ✦ CosmosPort</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
