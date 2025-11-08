import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { ArrowLeft } from "lucide-react";

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

export default function Portfolio() {
  const { username } = useParams<{ username: string }>();
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadPortfolio = async () => {
      if (!username) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const portfoliosRef = collection(db, "portfolios");
        const q = query(portfoliosRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setNotFound(true);
        } else {
          const data = querySnapshot.docs[0].data() as PortfolioData;
          setPortfolio(data);
        }
      } catch (error) {
        console.error("Error loading portfolio:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (notFound || !portfolio) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-grotesk font-bold mb-4">Portfolio Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The portfolio @{username} doesn't exist or hasn't been published yet.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/15 hover:border-white/30 bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const fontFamilyMap: Record<string, string> = {
    "Space Grotesk": "font-grotesk",
    "Inter": "font-sans",
    "Poppins": "font-poppins",
  };

  return (
    <div
      className="min-h-screen text-foreground"
      style={{
        backgroundColor: portfolio.theme.backgroundColor,
        fontFamily: portfolio.theme.fontFamily,
      }}
    >
      {/* Header with back link */}
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ color: portfolio.theme.primaryColor }}>
            {portfolio.title}
          </h1>
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </header>

      {/* Portfolio Content */}
      <main className="container mx-auto px-4 py-12">
        {portfolio.sections.map((section) => (
          <section
            key={section.id}
            className="mb-16 py-12 border-b border-white/10 last:border-b-0"
          >
            {section.type === "hero" && (
              <div className="text-center max-w-2xl mx-auto">
                {section.image && (
                  <img
                    src={section.image}
                    alt="Hero"
                    className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
                  />
                )}
                <h2
                  className="text-5xl font-bold mb-4"
                  style={{ color: portfolio.theme.primaryColor }}
                >
                  {section.title}
                </h2>
                <p className="text-lg text-foreground/80 whitespace-pre-wrap">
                  {section.content}
                </p>
              </div>
            )}

            {section.type === "projects" && (
              <div>
                <h2
                  className="text-4xl font-bold mb-8"
                  style={{ color: portfolio.theme.primaryColor }}
                >
                  {section.title}
                </h2>
                <p className="text-foreground/80 whitespace-pre-wrap mb-6">
                  {section.content}
                </p>
                {section.image && (
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full rounded-lg object-cover max-h-96"
                  />
                )}
              </div>
            )}

            {section.type === "about" && (
              <div>
                <h2
                  className="text-4xl font-bold mb-8"
                  style={{ color: portfolio.theme.primaryColor }}
                >
                  {section.title}
                </h2>
                <div className="flex gap-8 items-center">
                  <div className="flex-1">
                    <p className="text-foreground/80 whitespace-pre-wrap text-lg">
                      {section.content}
                    </p>
                  </div>
                  {section.image && (
                    <div className="flex-shrink-0">
                      <img
                        src={section.image}
                        alt={section.title}
                        className="w-64 h-64 rounded-lg object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {section.type === "contact" && (
              <div className="text-center max-w-2xl mx-auto">
                <h2
                  className="text-4xl font-bold mb-8"
                  style={{ color: portfolio.theme.primaryColor }}
                >
                  {section.title}
                </h2>
                <p className="text-lg text-foreground/80 whitespace-pre-wrap">
                  {section.content}
                </p>
              </div>
            )}
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-foreground/60 text-sm">
          <p>Made with ✦ CosmosPort</p>
        </div>
      </footer>
    </div>
  );
}
