import { useState } from "react";
import { Lock, Mail, Eye, EyeOff, Languages, Phone, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

export function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("fr");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", email);
      toast.success("Connexion réussie !", { description: "Bienvenue sur ACTOR Hub" });
      navigate("/");
    } else {
      toast.error("Erreur de connexion", { description: "Veuillez remplir tous les champs" });
    }
  };

  const languages = [
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "pt", name: "Português", flag: "🇵🇹" },
  ];

  const t: Record<string, any> = {
    fr: {
      title: "Connexion à ACTOR Hub",
      subtitle: "ACTOR Hub est une plateforme de Actor Hub",
      email: "Adresse email",
      password: "Mot de passe",
      rememberMe: "Se souvenir de moi",
      forgotPassword: "Mot de passe oublié ?",
      signIn: "Se connecter",
      noAccount: "Vous n'avez pas de compte ?",
      signUp: "Créer un compte",
      or: "OU",
      ssoGoogle: "Continuer avec Google",
      ssoMicrosoft: "Continuer avec Microsoft",
      features: {
        title: "Pourquoi ACTOR Hub ?",
        items: [
          "Centre d'appels cloud complet",
          "SMS Bulk & Marketing",
          "WhatsApp Business intégré",
          "Email Marketing professionnel",
          "Support multi-langue (10 langues)",
          "Sécurité & conformité RGPD",
        ],
      },
    },
  };

  const currentT = t[selectedLanguage] || t.fr;

  const featureIcons = ["📞", "📱", "💬", "📧", "🌍", "🔒"];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#FAFBFC]">
        <div className="w-full max-w-md">
          {/* Language Selector */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-full appearance-none cursor-pointer hover:border-[#FE5B29] transition-colors text-sm"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
              <Languages className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FE5B29] rounded-2xl mb-4 shadow-lg">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#010133] mb-2">{currentT.title}</h1>
            <p className="text-gray-500 text-sm">{currentT.subtitle}</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#010133] mb-2">{currentT.email}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemple@email.com"
                    className="w-full pl-11 pr-4 py-3 bg-[#FE5B29]/5 border border-[#FE5B29]/20 rounded-lg outline-none focus:ring-2 focus:ring-[#FE5B29]/30 transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#010133] mb-2">{currentT.password}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 bg-[#FE5B29]/5 border border-[#FE5B29]/20 rounded-lg outline-none focus:ring-2 focus:ring-[#FE5B29]/30 transition-all text-sm"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-[#FE5B29] focus:ring-[#FE5B29]" />
                  <span className="text-sm text-gray-600">{currentT.rememberMe}</span>
                </label>
                <span className="text-sm text-[#FE5B29] hover:underline cursor-pointer">{currentT.forgotPassword}</span>
              </div>

              <button type="submit" className="w-full py-3 bg-[#FE5B29] text-white font-semibold rounded-lg hover:bg-[#E5521A] transition-colors shadow-lg shadow-[#FE5B29]/25">
                {currentT.signIn}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-400">{currentT.or}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button type="button" className="w-full flex items-center justify-center gap-3 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                  {currentT.ssoGoogle}
                </button>
                <button type="button" className="w-full flex items-center justify-center gap-3 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                  {currentT.ssoMicrosoft}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 p-12 items-center justify-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, #FE5B29 0%, #FF8052 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>

        <div className="relative z-10 max-w-lg text-white">
          <Shield className="w-16 h-16 mb-6" />
          <h2 className="text-4xl font-bold mb-8">{currentT.features.title}</h2>
          <div className="space-y-4">
            {currentT.features.items.map((item: string, index: number) => (
              <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">{featureIcons[index]}</span>
                </div>
                <span className="text-lg font-medium">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-white/20">
            <p className="text-white/80 text-sm">© 2026 BIAR GROUP AFRICA SARLU. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
