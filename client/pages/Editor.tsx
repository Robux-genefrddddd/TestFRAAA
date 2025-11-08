import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Plus, Save, LogOut, Eye, Settings, Trash2, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  type: "hero" | "projects" | "about" | "contact";
  title: string;
  content: string;
  image?: string;
}

interface PortfolioData {
  title: string;
  description: string;
  username: string;
  sections: Section[];
  theme: {
    primaryColor: string;
    backgroundColor: string;
    fontFamily: string;
  };
}

const SECTION_TEMPLATES = {
  hero: {
    type: "hero" as const,
    title: "Welcome to my portfolio",
    content: "I'm a creative developer building amazing things.",
  },
  projects: {
    type: "projects" as const,
    title: "My Projects",
    content: "Here are some of my best works...",
  },
  about: {
    type: "about" as const,
    title: "About Me",
    content: "I'm passionate about creating digital experiences.",
  },
  contact: {
    type: "contact" as const,
    title: "Get in Touch",
    content: "Feel free to reach out to me.",
  },
};

export default function Editor() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState<PortfolioData>({
    title: "My Portfolio",
    description: "Welcome to my creative universe",
    username: user?.displayName || "creator",
    sections: [
      {
        id: `hero-${Date.now()}`,
        ...SECTION_TEMPLATES.hero,
      } as Section,
    ],
    theme: {
      primaryColor: "#6FC3DF",
      backgroundColor: "#0A0A0A",
      fontFamily: "Space Grotesk",
    },
  });

  const [saving, setSaving] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      loadPortfolio();
      loadPresetTheme();
    }
  }, [user, navigate]);

  const loadPresetTheme = () => {
    const presetId = localStorage.getItem("cosmosport-preset");
    if (presetId) {
      const presetThemes: Record<string, any> = {
        "dev-builder": {
          primaryColor: "#6FC3DF",
          backgroundColor: "#0A0A0A",
          fontFamily: "Space Grotesk",
        },
        "artist-light": {
          primaryColor: "#FF8CBA",
          backgroundColor: "#F9F9FB",
          fontFamily: "Poppins",
        },
        "minimal-pro": {
          primaryColor: "#6FC3DF",
          backgroundColor: "#FFFFFF",
          fontFamily: "Inter",
        },
        "showcase-classic": {
          primaryColor: "#C0A7FF",
          backgroundColor: "#0A0A0A",
          fontFamily: "Space Grotesk",
        },
      };

      if (presetThemes[presetId]) {
        setPortfolio((prev) => ({
          ...prev,
          theme: presetThemes[presetId],
        }));
      }
      localStorage.removeItem("cosmosport-preset");
    }
  };

  useEffect(() => {
    const timer = setTimeout(savePortfolio, 2000);
    return () => clearTimeout(timer);
  }, [portfolio]);

  const loadPortfolio = async () => {
    if (!user) return;
    try {
      const docRef = doc(db, "portfolios", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPortfolio(docSnap.data() as PortfolioData);
      }
    } catch (error) {
      console.error("Error loading portfolio:", error);
    }
  };

  const savePortfolio = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const docRef = doc(db, "portfolios", user.uid);
      await setDoc(docRef, {
        ...portfolio,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error saving portfolio:", error);
    } finally {
      setSaving(false);
    }
  };

  const addSection = (type: keyof typeof SECTION_TEMPLATES) => {
    const newSection: Section = {
      id: `${type}-${Date.now()}-${Math.random()}`,
      ...SECTION_TEMPLATES[type],
    };
    setPortfolio((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  const updateSection = (id: string, updates: Partial<Section>) => {
    setPortfolio((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === id ? { ...s, ...updates } : s,
      ),
    }));
  };

  const deleteSection = (id: string) => {
    setPortfolio((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== id),
    }));
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-40 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-grotesk font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              CosmosPort Editor
            </h1>
            <p className="text-xs text-muted-foreground">
              Editing as {user?.displayName || user?.email}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={savePortfolio}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg",
                "border border-white/15 hover:border-white/30",
                "bg-gradient-to-r from-primary/10 to-secondary/10",
                "hover:from-primary/20 hover:to-secondary/20",
                "transition-all text-sm font-medium",
                saving && "opacity-50",
              )}
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save"}
            </button>

            <button
              onClick={() => navigate(`/@${portfolio.username}`)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg",
                "border border-white/15 hover:border-white/30",
                "bg-white/5 hover:bg-white/10",
                "transition-all text-sm font-medium",
              )}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>

            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg",
                "border border-white/15 hover:border-white/30",
                "bg-white/5 hover:bg-white/10",
                "transition-all text-sm font-medium",
              )}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Editor Area */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Portfolio Settings */}
            <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
              <h3 className="text-lg font-grotesk font-bold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Portfolio Info
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Portfolio Title
                  </label>
                  <input
                    type="text"
                    value={portfolio.title}
                    onChange={(e) =>
                      setPortfolio((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className={cn(
                      "w-full px-3 py-2 rounded-lg",
                      "border border-white/10 bg-white/5",
                      "focus:bg-white/10 focus:border-primary/50",
                      "text-sm outline-none transition-colors",
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Username (@cosmosport.com)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      @
                    </span>
                    <input
                      type="text"
                      value={portfolio.username}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          username: e.target.value,
                        }))
                      }
                      className={cn(
                        "w-full pl-6 pr-3 py-2 rounded-lg",
                        "border border-white/10 bg-white/5",
                        "focus:bg-white/10 focus:border-primary/50",
                        "text-sm outline-none transition-colors",
                      )}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={portfolio.description}
                    onChange={(e) =>
                      setPortfolio((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className={cn(
                      "w-full px-3 py-2 rounded-lg",
                      "border border-white/10 bg-white/5",
                      "focus:bg-white/10 focus:border-primary/50",
                      "text-sm outline-none transition-colors resize-none",
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Add Sections */}
            <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
              <h3 className="text-lg font-grotesk font-bold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Sections
              </h3>

              <div className="space-y-2">
                {Object.keys(SECTION_TEMPLATES).map((type) => (
                  <button
                    key={type}
                    onClick={() =>
                      addSection(type as keyof typeof SECTION_TEMPLATES)
                    }
                    className={cn(
                      "w-full px-4 py-2 rounded-lg text-sm font-medium",
                      "border border-white/15 hover:border-white/30",
                      "bg-white/5 hover:bg-white/10",
                      "transition-all text-left capitalize",
                    )}
                  >
                    + {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Settings */}
            <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
              <h3 className="text-lg font-grotesk font-bold mb-4">Theme</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Primary Color
                  </label>
                  <input
                    type="color"
                    value={portfolio.theme.primaryColor}
                    onChange={(e) =>
                      setPortfolio((prev) => ({
                        ...prev,
                        theme: {
                          ...prev.theme,
                          primaryColor: e.target.value,
                        },
                      }))
                    }
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Font Family
                  </label>
                  <select
                    value={portfolio.theme.fontFamily}
                    onChange={(e) =>
                      setPortfolio((prev) => ({
                        ...prev,
                        theme: {
                          ...prev.theme,
                          fontFamily: e.target.value,
                        },
                      }))
                    }
                    className={cn(
                      "w-full px-3 py-2 rounded-lg",
                      "border border-white/10 bg-white/5",
                      "focus:bg-white/10 focus:border-primary/50",
                      "text-sm outline-none transition-colors",
                    )}
                  >
                    <option>Space Grotesk</option>
                    <option>Inter</option>
                    <option>Poppins</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Sections Editor */}
          <div className="lg:col-span-2 space-y-6">
            {portfolio.sections.map((section) => (
              <div
                key={section.id}
                onClick={() => setSelectedSection(section.id)}
                className={cn(
                  "p-6 rounded-xl border transition-all cursor-pointer",
                  selectedSection === section.id
                    ? "border-primary bg-primary/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20",
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">
                      {section.type}
                    </span>
                    <h4 className="text-lg font-grotesk font-bold mt-1">
                      {section.title || "Untitled Section"}
                    </h4>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSection(section.id);
                    }}
                    className="p-2 rounded-lg hover:bg-destructive/20 transition-colors text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {selectedSection === section.id && (
                  <div className="space-y-4 mt-4 pt-4 border-t border-white/10">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) =>
                          updateSection(section.id, { title: e.target.value })
                        }
                        className={cn(
                          "w-full px-3 py-2 rounded-lg",
                          "border border-white/10 bg-white/5",
                          "focus:bg-white/10 focus:border-primary/50",
                          "text-sm outline-none transition-colors",
                        )}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Content
                      </label>
                      <textarea
                        value={section.content}
                        onChange={(e) =>
                          updateSection(section.id, { content: e.target.value })
                        }
                        rows={5}
                        className={cn(
                          "w-full px-3 py-2 rounded-lg",
                          "border border-white/10 bg-white/5",
                          "focus:bg-white/10 focus:border-primary/50",
                          "text-sm outline-none transition-colors resize-none",
                        )}
                      />
                    </div>

                    {section.type !== "contact" && (
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Image URL (optional)
                        </label>
                        <input
                          type="url"
                          value={section.image || ""}
                          onChange={(e) =>
                            updateSection(section.id, { image: e.target.value })
                          }
                          placeholder="https://example.com/image.jpg"
                          className={cn(
                            "w-full px-3 py-2 rounded-lg",
                            "border border-white/10 bg-white/5",
                            "focus:bg-white/10 focus:border-primary/50",
                            "text-sm outline-none transition-colors",
                          )}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
