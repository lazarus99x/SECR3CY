import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Shield,
  Eye,
  Lock,
  Target,
  Globe,
  Brain,
  ArrowRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";

interface LandingProps {
  onAuth: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export const Landing = ({ onAuth, theme, onToggleTheme }: LandingProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-b from-slate-900 via-gray-900 to-black text-white"
          : "bg-gradient-to-b from-blue-50 via-white to-gray-100 text-gray-900"
      }`}
    >
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />

      {/* Header */}
      <header
        className={`border-b backdrop-blur-sm transition-all duration-300 ${
          theme === "dark"
            ? "border-gray-800 bg-black/50"
            : "border-gray-200 bg-white/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 animate-fade-in">
            <div className="relative group">
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="36" height="36" rx="18" fill="#181A20" />
                <g>
                  <path
                    d="M18 9C18 9 27 12 27 18C27 24 18 27 18 27C18 27 9 24 9 18C9 12 18 9 18 9Z"
                    stroke="#7C3AED"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    fill="#23262F"
                  />
                  <path
                    d="M18 15C19.6569 15 21 16.3431 21 18C21 19.6569 19.6569 21 18 21C16.3431 21 15 19.6569 15 18C15 16.3431 16.3431 15 18 15Z"
                    stroke="#00E0CA"
                    strokeWidth="2"
                    fill="#181A20"
                  />
                </g>
              </svg>
            </div>
            <span className="font-bold bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent ">
              SECR3CY
            </span>
          </div>

          <div
            className={`text-xs font-mono hidden sm:block transition-colors duration-300 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            CLASSIFICATION: AI/HUMAN CLASSIFIED
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 sm:mb-8 animate-fade-in">
            <div
              className={`inline-block px-3 sm:px-4 py-2 border rounded mb-4 sm:mb-6 transition-all duration-300 ${
                theme === "dark"
                  ? "bg-red-900/20 border-red-700/30"
                  : "bg-red-100/80 border-red-300/50"
              }`}
            >
              <span
                className={`font-mono text-xs sm:text-sm transition-colors duration-300 ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                ● SYSTEM OPERATIONAL
              </span>
            </div>

            <h1 className="bg-gradient-to-r from-red-300 to-purple-500 bg-clip-text text-transparent text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 tracking-tight animate-scale-in">
              <span className="bg-gradient-to-r from-red-300 to-purple-500 flowing-text">
                SECR3CY
              </span>
            </h1>

            <div
              className={`text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 font-mono animate-fade-in transition-colors duration-300 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              PRIVACY • ANONIMITY • PEACE OF MIND & CONTROL
            </div>

            <p
              className={`text-base sm:text-lg mb-8 sm:mb-12 max-w-2xl mx-auto px-4 animate-fade-in transition-colors duration-300 ${
                theme === "dark" ? "text-gray-500" : "text-gray-600"
              }`}
            >
              Advanced artificial intelligence system with enhanced security
              protocols, uncensored responses, and deep analytical capabilities.
              <br />
              <p className="bg-gradient-to-r from-red-300 to-purple-500 flowing-text">
                {" "}
                "This is Truly the right way to use AI." - Anonymous
              </p>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 animate-scale-in">
            {showSignUp ? (
              <SignUpButton mode="modal" fallbackRedirectUrl="/">
                <Button
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  SIGN UP
                  <ArrowRight
                    className={`w-4 h-4 sm:w-5 sm:h-5 ml-2 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`}
                  />
                </Button>
              </SignUpButton>
            ) : (
              <SignInButton mode="modal" fallbackRedirectUrl="/">
                <Button
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  ACCESS SYSTEM
                  <ArrowRight
                    className={`w-4 h-4 sm:w-5 sm:h-5 ml-2 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`}
                  />
                </Button>
              </SignInButton>
            )}

            <Button
              variant="outline"
              onClick={() => setShowSignUp(!showSignUp)}
              className={`w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg transition-all duration-300 hover:scale-105 ${
                theme === "dark"
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-400 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {showSignUp ? "Already have access?" : "Need access?"}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section
        className={`py-12 sm:py-16 px-4 sm:px-6 border-t transition-all duration-300 ${
          theme === "dark" ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              SYSTEM CAPABILITIES
            </h2>
            <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-red-600 to-red-700 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <Card
              className={`p-4 sm:p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-2 animate-fade-in ${
                theme === "dark"
                  ? "bg-gray-900/50 border-gray-700 hover:bg-gray-800/50 hover:shadow-glow-purple"
                  : "bg-white/80 border-gray-200 hover:bg-white hover:shadow-lg"
              }`}
            >
              <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 mb-3 sm:mb-4 animate-pulse" />
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                Deep Analysis
              </h3>
              <p
                className={`text-sm sm:text-base transition-colors duration-300 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Advanced reasoning capabilities with multi-layered thinking
                processes for comprehensive problem-solving.
              </p>
            </Card>

            <Card
              className={`p-4 sm:p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-2 animate-fade-in ${
                theme === "dark"
                  ? "bg-gray-900/50 border-gray-700 hover:bg-gray-800/50 hover:shadow-glow-cyan"
                  : "bg-white/80 border-gray-200 hover:bg-white hover:shadow-lg"
              }`}
            >
              <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mb-3 sm:mb-4 animate-pulse" />
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                Research Integration
              </h3>
              <p
                className={`text-sm sm:text-base transition-colors duration-300 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Simulated internet research capabilities providing contextual,
                well-researched responses with factual accuracy.
              </p>
            </Card>

            <Card
              className={`p-4 sm:p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-2 animate-fade-in ${
                theme === "dark"
                  ? "bg-gray-900/50 border-gray-700 hover:bg-gray-800/50 hover:shadow-glow-pink"
                  : "bg-white/80 border-gray-200 hover:bg-white hover:shadow-lg"
              }`}
            >
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mb-3 sm:mb-4 animate-pulse" />
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                Uncensored Responses
              </h3>
              <p
                className={`text-sm sm:text-base transition-colors duration-300 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Direct, honest communication without content restrictions,
                maintaining intellectual honesty and transparency.
              </p>
            </Card>

            <Card
              className={`p-4 sm:p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-2 animate-fade-in ${
                theme === "dark"
                  ? "bg-gray-900/50 border-gray-700 hover:bg-gray-800/50 hover:shadow-glow-purple"
                  : "bg-white/80 border-gray-200 hover:bg-white hover:shadow-lg"
              }`}
            >
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 mb-3 sm:mb-4 animate-pulse" />
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                Privacy First
              </h3>
              <p
                className={`text-sm sm:text-base transition-colors duration-300 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Your conversations remain private and secure with advanced
                encryption and local storage protocols.
              </p>
            </Card>

            <Card
              className={`p-4 sm:p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-2 animate-fade-in ${
                theme === "dark"
                  ? "bg-gray-900/50 border-gray-700 hover:bg-gray-800/50 hover:shadow-glow-cyan"
                  : "bg-white/80 border-gray-200 hover:bg-white hover:shadow-lg"
              }`}
            >
              <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-500 mb-3 sm:mb-4 animate-pulse" />
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                Complete Control
              </h3>
              <p
                className={`text-sm sm:text-base transition-colors duration-300 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Full control over your data, conversations, and AI interactions
                with transparent system operations.
              </p>
            </Card>

            <Card
              className={`p-4 sm:p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-2 animate-fade-in ${
                theme === "dark"
                  ? "bg-gray-900/50 border-gray-700 hover:bg-gray-800/50 hover:shadow-glow-pink"
                  : "bg-white/80 border-gray-200 hover:bg-white hover:shadow-lg"
              }`}
            >
              <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 mb-3 sm:mb-4 animate-pulse" />
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                Secure Architecture
              </h3>
              <p
                className={`text-sm sm:text-base transition-colors duration-300 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Military-grade security protocols ensuring your information
                remains classified and protected at all times.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`border-t py-6 sm:py-8 px-4 sm:px-6 mt-12 sm:mt-20 transition-all duration-300 ${
          theme === "dark" ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div
            className={`text-xs sm:text-sm font-mono mb-3 sm:mb-4 transition-colors duration-300 ${
              theme === "dark" ? "text-gray-500" : "text-gray-600"
            }`}
          >
            WARNING: This system is for authorized personnel only. All
            activities are not monitored or logged.
          </div>

          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-8 text-xs transition-colors duration-300 ${
              theme === "dark" ? "text-gray-600" : "text-gray-500"
            }`}
          >
            <span>CLASSIFICATION: AI/HUMAN CLASSIFIED</span>
            <span className="hidden sm:inline">•</span>
            <span>VERSION: 1.0.0</span>
            <span className="hidden sm:inline">•</span>
            <span>STATUS: OPERATIONAL</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
