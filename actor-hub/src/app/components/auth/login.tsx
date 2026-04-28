import { useState } from "react";
import { Lock, Mail, Eye, EyeOff, Languages, Phone, Shield, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

export function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("fr");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (email && password) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", email);

      toast.success("Connexion réussie !", {
        description: "Bienvenue sur ACTOR Hub",
      });

      navigate("/");
    } else {
      toast.error("Erreur de connexion", {
        description: "Veuillez remplir tous les champs",
      });
    }
  };

  const languages = [
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "pt", name: "Português", flag: "🇵🇹" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "sw", name: "Kiswahili", flag: "🇹🇿" },
    { code: "am", name: "አማርኛ", flag: "🇪🇹" },
  ];

  const translations: Record<string, Record<string, string | string[]>> = {
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
      featuresTitle: "Pourquoi ACTOR Hub ?",
      features: [
        "Centre d'appels cloud complet",
        "SMS Bulk & Marketing",
        "WhatsApp Business intégré",
        "Email Marketing professionnel",
        "Support multi-langue (10 langues)",
        "Sécurité & conformité RGPD",
      ],
    },
    en: {
      title: "Sign in to ACTOR Hub",
      subtitle: "ACTOR Hub is a platform by Biar group Africa Sarlu",
      email: "Email address",
      password: "Password",
      rememberMe: "Remember me",
      forgotPassword: "Forgot password?",
      signIn: "Sign in",
      noAccount: "Don't have an account?",
      signUp: "Sign up",
      or: "OR",
      ssoGoogle: "Continue with Google",
      ssoMicrosoft: "Continue with Microsoft",
      featuresTitle: "Why ACTOR Hub?",
      features: [
        "Complete cloud call center",
        "SMS Bulk & Marketing",
        "WhatsApp Business integrated",
        "Professional Email Marketing",
        "Multi-language support (10 languages)",
        "Security & GDPR compliance",
      ],
    },
    es: {
      title: "Iniciar sesión en ACTOR Hub",
      subtitle: "ACTOR Hub es una plataforma de Biar group Africa Sarlu",
      email: "Correo electrónico",
      password: "Contraseña",
      rememberMe: "Recuérdame",
      forgotPassword: "¿Olvidaste tu contraseña?",
      signIn: "Iniciar sesión",
      noAccount: "¿No tienes una cuenta?",
      signUp: "Registrarse",
      or: "O",
      ssoGoogle: "Continuar con Google",
      ssoMicrosoft: "Continuar con Microsoft",
      featuresTitle: "¿Por qué ACTOR Hub?",
      features: [
        "Centro de llamadas en la nube completo",
        "SMS Bulk y Marketing",
        "WhatsApp Business integrado",
        "Marketing por correo profesional",
        "Soporte multilingüe (10 idiomas)",
        "Seguridad y cumplimiento RGPD",
      ],
    },
    ar: {
      title: "تسجيل الدخول إلى ACTOR Hub",
      subtitle: "ACTOR Hub منصة من Biar group Africa Sarlu",
      email: "عنوان البريد الإلكتروني",
      password: "كلمة المرور",
      rememberMe: "تذكرني",
      forgotPassword: "هل نسيت كلمة المرور؟",
      signIn: "تسجيل الدخول",
      noAccount: "ليس لديك حساب؟",
      signUp: "إنشاء حساب",
      or: "أو",
      ssoGoogle: "متابعة مع Google",
      ssoMicrosoft: "متابعة مع Microsoft",
      featuresTitle: "لماذا ACTOR Hub؟",
      features: [
        "مركز اتصال سحابي كامل",
        "رسائل SMS جماعية وتسويقية",
        "واتساب بيزنس متكامل",
        "تسويق بريد إلكتروني احترافي",
        "دعم متعدد اللغات (10 لغات)",
        "الأمان والامتثال للقانون العام لحماية البيانات",
      ],
    },
  };

  const t = translations[selectedLanguage] || translations.fr;
  const features = t.features as string[];

  const featureIcons = ["📞", "📱", "💬", "📧", "🌍", "🔒"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Language Selector */}
          <div className="flex justify-end mb-6">
            <div className="relative">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-lg appearance-none cursor-pointer hover:border-primary transition-colors text-sm shadow-sm"
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg shadow-primary/25">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900">{t.title as string}</h1>
            <p className="text-gray-500">{t.subtitle as string}</p>
          </div>

          {/* Login Form */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.email as string}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemple@email.com"
                    className="w-full pl-11 pr-4 py-3 bg-primary/5 border border-primary/20 rounded-lg outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.password as string}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 bg-primary/5 border border-primary/20 rounded-lg outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-600">{t.rememberMe as string}</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline font-medium">
                  {t.forgotPassword as string}
                </Link>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 text-base"
              >
                {t.signIn as string}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-400">{t.or as string}</span>
                </div>
              </div>

              {/* SSO Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-3 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="font-medium text-gray-700">{t.ssoGoogle as string}</span>
                </button>
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-3 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#f25022" d="M1 1h10v10H1z"/>
                    <path fill="#7fba00" d="M13 1h10v10H13z"/>
                    <path fill="#00a4ef" d="M1 13h10v10H1z"/>
                    <path fill="#ffb900" d="M13 13h10v10H13z"/>
                  </svg>
                  <span className="font-medium text-gray-700">{t.ssoMicrosoft as string}</span>
                </button>
              </div>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-500 mt-6">
              {t.noAccount as string}{" "}
              <Link to="/signup" className="text-primary font-semibold hover:underline">
                {t.signUp as string}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-orange-600 p-12 items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-lg text-white">
          <Shield className="w-16 h-16 mb-6 opacity-90" />
          <h2 className="text-4xl font-bold mb-8">{t.featuresTitle as string}</h2>
          <div className="space-y-4">
            {features.map((item: string, index: number) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors"
              >
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-xl">
                  {featureIcons[index]}
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <CheckCircle2 className="w-5 h-5 text-white/80 flex-shrink-0" />
                  <span className="text-lg text-white">{item}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-white/20">
            <p className="text-white/70 text-sm">© {new Date().getFullYear()} BIAR GROUP AFRICA SARLU. Tous droits réservés.</p>
            <p className="text-white/60 text-sm mt-1">Pour vous, on se dépasse.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
