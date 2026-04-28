import { useMemo, useState } from "react";
import {
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Shield,
  Smartphone,
  Globe2,
  BadgeCheck,
} from "lucide-react";

type LanguageCode = "fr" | "en" | "es" | "ar";

type Translation = {
  languageLabel: string;
  title: string;
  subtitle: string;
  email: string;
  password: string;
  remember: string;
  forgot: string;
  submit: string;
  or: string;
  continueGoogle: string;
  continueMicrosoft: string;
  benefitsTitle: string;
  benefits: string[];
  signupPrompt: string;
  signupLink: string;
  successMessage: string;
  errorMessage: string;
};

const translations: Record<LanguageCode, Translation> = {
  fr: {
    languageLabel: "Fr Français",
    title: "Connexion à ACTOR Hub",
    subtitle: "ACTOR Hub est une plateforme de Actor Hub",
    email: "Adresse email",
    password: "Mot de passe",
    remember: "Se souvenir de moi",
    forgot: "Mot de passe oublié ?",
    submit: "Se connecter",
    or: "OU",
    continueGoogle: "Continuer avec Google",
    continueMicrosoft: "Continuer avec Microsoft",
    benefitsTitle: "Pourquoi ACTOR Hub ?",
    benefits: [
      "Centre d'appels cloud complet",
      "SMS Bulk & Marketing",
      "WhatsApp Business intégré",
      "Email Marketing professionnel",
      "Support multi-langue (10 langues)",
      "Sécurité & conformité RGPD",
    ],
    signupPrompt: "Vous n'avez pas de compte ?",
    signupLink: "Créer un compte",
    successMessage: "Connexion simulée réussie pour",
    errorMessage: "Veuillez renseigner votre email et votre mot de passe.",
  },
  en: {
    languageLabel: "EN English",
    title: "Sign in to ACTOR Hub",
    subtitle: "ACTOR Hub is the unified platform for modern customer engagement",
    email: "Email address",
    password: "Password",
    remember: "Remember me",
    forgot: "Forgot password?",
    submit: "Sign in",
    or: "OR",
    continueGoogle: "Continue with Google",
    continueMicrosoft: "Continue with Microsoft",
    benefitsTitle: "Why ACTOR Hub?",
    benefits: [
      "Complete cloud call center",
      "SMS Bulk & Marketing",
      "Integrated WhatsApp Business",
      "Professional Email Marketing",
      "Multi-language support (10 languages)",
      "Security & GDPR compliance",
    ],
    signupPrompt: "Don't have an account?",
    signupLink: "Create an account",
    successMessage: "Simulated login successful for",
    errorMessage: "Please enter your email and password.",
  },
  es: {
    languageLabel: "ES Español",
    title: "Conexión a ACTOR Hub",
    subtitle: "ACTOR Hub es una plataforma unificada para comunicaciones empresariales",
    email: "Correo electrónico",
    password: "Contraseña",
    remember: "Recordarme",
    forgot: "¿Olvidaste tu contraseña?",
    submit: "Iniciar sesión",
    or: "O",
    continueGoogle: "Continuar con Google",
    continueMicrosoft: "Continuar con Microsoft",
    benefitsTitle: "¿Por qué ACTOR Hub?",
    benefits: [
      "Centro de llamadas cloud completo",
      "SMS Bulk y Marketing",
      "WhatsApp Business integrado",
      "Email Marketing profesional",
      "Soporte multilingüe (10 idiomas)",
      "Seguridad y cumplimiento RGPD",
    ],
    signupPrompt: "¿No tienes una cuenta?",
    signupLink: "Crear una cuenta",
    successMessage: "Conexión simulada correcta para",
    errorMessage: "Completa tu correo y contraseña.",
  },
  ar: {
    languageLabel: "AR العربية",
    title: "تسجيل الدخول إلى ACTOR Hub",
    subtitle: "ACTOR Hub منصة موحدة للتواصل متعدد القنوات",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    remember: "تذكرني",
    forgot: "هل نسيت كلمة المرور؟",
    submit: "تسجيل الدخول",
    or: "أو",
    continueGoogle: "المتابعة مع Google",
    continueMicrosoft: "المتابعة مع Microsoft",
    benefitsTitle: "لماذا ACTOR Hub؟",
    benefits: [
      "مركز اتصالات سحابي متكامل",
      "رسائل SMS جماعية وتسويقية",
      "واتساب بيزنس مدمج",
      "بريد إلكتروني احترافي",
      "دعم متعدد اللغات (10 لغات)",
      "الأمان والامتثال للائحة RGPD",
    ],
    signupPrompt: "ليس لديك حساب؟",
    signupLink: "إنشاء حساب",
    successMessage: "تم تسجيل الدخول التجريبي للحساب",
    errorMessage: "يرجى إدخال البريد الإلكتروني وكلمة المرور.",
  },
};

const benefitIcons = [
  Phone,
  Smartphone,
  Globe2,
  Mail,
  BadgeCheck,
  Shield,
];

function App() {
  const [language, setLanguage] = useState<LanguageCode>("fr");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; text: string } | null>(
    null,
  );

  const t = useMemo(() => translations[language], [language]);
  const isRtl = language === "ar";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email && password) {
      setFeedback({ tone: "success", text: `${t.successMessage} ${email}` });
      return;
    }

    setFeedback({ tone: "error", text: t.errorMessage });
  };

  return (
    <main className="app-shell" dir={isRtl ? "rtl" : "ltr"}>
      <div className="auth-layout">
        <section className="auth-main">
          <div className="auth-panel">
            <div className="language-bar">
              <div className="language-select-wrap">
                <select
                  className="language-select"
                  aria-label="Choisir la langue"
                  value={language}
                  onChange={(event) => setLanguage(event.target.value as LanguageCode)}
                >
                  <option value="fr">Fr Français</option>
                  <option value="en">EN English</option>
                  <option value="es">ES Español</option>
                  <option value="ar">AR العربية</option>
                </select>
                <ChevronDown className="language-icon" size={16} />
              </div>
            </div>

            <div className="brand-block">
              <div className="brand-icon" aria-hidden="true">
                <Phone size={24} />
              </div>
              <h1>{t.title}</h1>
              <p>{t.subtitle}</p>
            </div>

            <section className="login-card">
              <form className="login-form" onSubmit={handleSubmit}>
                <div className="field-group">
                  <label className="field-label" htmlFor="email">
                    {t.email}
                  </label>
                  <div className="input-shell">
                    <Mail className="input-icon" size={18} />
                    <input
                      id="email"
                      type="email"
                      placeholder="exemple@email.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="password">
                    {t.password}
                  </label>
                  <div className="input-shell">
                    <Lock className="input-icon" size={18} />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                    <button
                      className="password-toggle"
                      type="button"
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      onClick={() => setShowPassword((value) => !value)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="login-meta">
                  <label className="remember-row">
                    <input type="checkbox" />
                    <span>{t.remember}</span>
                  </label>
                  <a className="forgot-link" href="#forgot">
                    {t.forgot}
                  </a>
                </div>

                <button className="submit-button" type="submit">
                  {t.submit}
                </button>

                {feedback ? (
                  <p className={`feedback-banner ${feedback.tone}`} role="status" aria-live="polite">
                    {feedback.text}
                  </p>
                ) : null}

                <div className="divider" aria-hidden="true">
                  <span>{t.or}</span>
                </div>

                <div className="oauth-stack">
                  <button type="button" className="oauth-button">
                    <span className="oauth-badge google">G</span>
                    {t.continueGoogle}
                  </button>
                  <button type="button" className="oauth-button">
                    <span className="oauth-badge microsoft">M</span>
                    {t.continueMicrosoft}
                  </button>
                </div>

                <p className="signup-copy">
                  {t.signupPrompt} <a href="#signup">{t.signupLink}</a>
                </p>
              </form>
            </section>
          </div>
        </section>

        <aside className="feature-panel">
          <div className="feature-content">
            <div className="feature-badge" aria-hidden="true">
              <Shield size={30} />
            </div>
            <h2>{t.benefitsTitle}</h2>

            <div className="feature-list">
              {t.benefits.map((benefit, index) => {
                const Icon = benefitIcons[index];
                return (
                  <article className="feature-item" key={benefit}>
                    <div className="feature-item-icon">
                      <Icon size={16} />
                    </div>
                    <span>{benefit}</span>
                  </article>
                );
              })}
            </div>

            <p className="feature-footer">© 2026 ACTOR Hub. Tous droits réservés.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default App;
