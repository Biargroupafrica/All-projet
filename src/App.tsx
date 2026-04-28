import { FormEvent, useMemo, useState } from "react";
import {
  BarChart3,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Globe2,
  Headphones,
  Languages,
  Lock,
  Mail,
  MessageCircle,
  Phone,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import "./styles.css";

type Locale = "fr" | "en" | "es" | "ar";

const languages: Array<{ code: Locale; name: string; short: string }> = [
  { code: "fr", name: "Français", short: "FR" },
  { code: "en", name: "English", short: "EN" },
  { code: "es", name: "Español", short: "ES" },
  { code: "ar", name: "العربية", short: "AR" },
];

const copy = {
  fr: {
    title: "Connexion à ACTOR Hub",
    subtitle: "ACTOR Hub est une plateforme de Actor Hub",
    email: "Adresse email",
    password: "Mot de passe",
    remember: "Se souvenir de moi",
    forgot: "Mot de passe oublié ?",
    submit: "Se connecter",
    divider: "OU",
    google: "Continuer avec Google",
    microsoft: "Continuer avec Microsoft",
    account: "Vous n'avez pas de compte ?",
    signup: "Créer un compte",
    why: "Pourquoi ACTOR Hub ?",
    heroItems: [
      ["phone", "Centre d'appels cloud complet"],
      ["sms", "SMS Bulk & Marketing"],
      ["whatsapp", "WhatsApp Business intégré"],
      ["email", "Email Marketing professionnel"],
      ["world", "Support multi-langue (10 langues)"],
      ["shield", "Sécurité & conformité RGPD"],
    ],
  },
  en: {
    title: "Sign in to ACTOR Hub",
    subtitle: "ACTOR Hub is a platform by Biar Group Africa Sarlu",
    email: "Email address",
    password: "Password",
    remember: "Remember me",
    forgot: "Forgot password?",
    submit: "Sign in",
    divider: "OR",
    google: "Continue with Google",
    microsoft: "Continue with Microsoft",
    account: "Don't have an account?",
    signup: "Create account",
    why: "Why ACTOR Hub?",
    heroItems: [
      ["phone", "Complete cloud call center"],
      ["sms", "SMS Bulk & Marketing"],
      ["whatsapp", "Integrated WhatsApp Business"],
      ["email", "Professional Email Marketing"],
      ["world", "Multi-language support (10 languages)"],
      ["shield", "Security & GDPR compliance"],
    ],
  },
  es: {
    title: "Iniciar sesión en ACTOR Hub",
    subtitle: "ACTOR Hub es una plataforma de Biar Group Africa Sarlu",
    email: "Correo electrónico",
    password: "Contraseña",
    remember: "Recuérdame",
    forgot: "¿Olvidaste tu contraseña?",
    submit: "Iniciar sesión",
    divider: "O",
    google: "Continuar con Google",
    microsoft: "Continuar con Microsoft",
    account: "¿No tienes una cuenta?",
    signup: "Crear cuenta",
    why: "¿Por qué ACTOR Hub?",
    heroItems: [
      ["phone", "Centro de llamadas cloud completo"],
      ["sms", "SMS Bulk & Marketing"],
      ["whatsapp", "WhatsApp Business integrado"],
      ["email", "Email Marketing profesional"],
      ["world", "Soporte multi-idioma (10 idiomas)"],
      ["shield", "Seguridad y cumplimiento RGPD"],
    ],
  },
  ar: {
    title: "تسجيل الدخول إلى ACTOR Hub",
    subtitle: "ACTOR Hub منصة من Biar Group Africa Sarlu",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    remember: "تذكرني",
    forgot: "هل نسيت كلمة المرور؟",
    submit: "تسجيل الدخول",
    divider: "أو",
    google: "المتابعة عبر Google",
    microsoft: "المتابعة عبر Microsoft",
    account: "ليس لديك حساب؟",
    signup: "إنشاء حساب",
    why: "لماذا ACTOR Hub؟",
    heroItems: [
      ["phone", "مركز اتصال سحابي كامل"],
      ["sms", "رسائل SMS وتسويق"],
      ["whatsapp", "واتساب للأعمال متكامل"],
      ["email", "تسويق بريد إلكتروني احترافي"],
      ["world", "دعم متعدد اللغات (10 لغات)"],
      ["shield", "الأمان والامتثال لـ RGPD"],
    ],
  },
};

const iconByKey = {
  phone: Phone,
  sms: MessageCircle,
  whatsapp: Headphones,
  email: Mail,
  world: Globe2,
  shield: Lock,
};

const proofPoints = [
  { icon: Zap, value: "99.9%", label: "Disponibilité" },
  { icon: BarChart3, value: "8M+", label: "Messages/mois" },
  { icon: Shield, value: "RGPD", label: "Conformité" },
];

export default function App() {
  const [locale, setLocale] = useState<Locale>("fr");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const t = copy[locale];
  const currentLanguage = useMemo(
    () => languages.find((language) => language.code === locale) ?? languages[0],
    [locale],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(
      email && password
        ? "Connexion simulée avec succès."
        : "Veuillez remplir l'adresse email et le mot de passe.",
    );
  }

  return (
    <main className={`page-shell ${locale === "ar" ? "rtl" : ""}`}>
      <section className="auth-panel" aria-labelledby="login-title">
        <div className="auth-content">
          <div className="language-select">
            <span>{currentLanguage.short}</span>
            <select
              aria-label="Choisir la langue"
              value={locale}
              onChange={(event) => setLocale(event.target.value as Locale)}
            >
              {languages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>
            <Languages aria-hidden="true" size={16} />
            <ChevronDown aria-hidden="true" size={14} />
          </div>

          <div className="brand-block">
            <div className="brand-icon">
              <Phone aria-hidden="true" size={30} strokeWidth={2.3} />
            </div>
            <h1 id="login-title">{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>

          <form className="login-card" onSubmit={handleSubmit}>
            <label>
              <span>{t.email}</span>
              <div className="input-wrap">
                <Mail aria-hidden="true" size={18} />
                <input
                  type="email"
                  placeholder="exemple@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </label>

            <label>
              <span>{t.password}</span>
              <div className="input-wrap">
                <Lock aria-hidden="true" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  className="icon-button"
                  type="button"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <div className="form-row">
              <label className="remember">
                <input type="checkbox" />
                <span>{t.remember}</span>
              </label>
              <a href="#forgot">{t.forgot}</a>
            </div>

            <button className="submit-button" type="submit">
              {t.submit}
            </button>

            <div className="divider">
              <span>{t.divider}</span>
            </div>

            <button className="sso-button" type="button">
              <span className="sso-mark google">G</span>
              {t.google}
            </button>
            <button className="sso-button" type="button">
              <span className="sso-mark microsoft">M</span>
              {t.microsoft}
            </button>

            <p className="signup-copy">
              {t.account} <a href="#signup">{t.signup}</a>
            </p>

            {message && <p className="status-message">{message}</p>}
          </form>
        </div>
      </section>

      <section className="feature-panel" aria-labelledby="features-title">
        <div className="pattern" aria-hidden="true" />
        <div className="glow glow-one" aria-hidden="true" />
        <div className="glow glow-two" aria-hidden="true" />

        <div className="feature-content">
          <Shield className="shield-icon" aria-hidden="true" size={54} />
          <h2 id="features-title">{t.why}</h2>

          <div className="feature-list">
            {t.heroItems.map(([iconKey, label]) => {
              const ItemIcon = iconByKey[iconKey as keyof typeof iconByKey];
              return (
                <div className="feature-pill" key={label}>
                  <span className="feature-icon">
                    <ItemIcon aria-hidden="true" size={18} />
                  </span>
                  <span>{label}</span>
                </div>
              );
            })}
          </div>

          <div className="proof-grid" aria-label="Indicateurs ACTOR Hub">
            {proofPoints.map(({ icon: ProofIcon, value, label }) => (
              <div className="proof-card" key={label}>
                <ProofIcon aria-hidden="true" size={18} />
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="promise">
            <Sparkles aria-hidden="true" size={18} />
            <span>One platform - Infinite connections</span>
          </div>
        </div>
      </section>

      <div className="mobile-benefits" aria-label="Avantages principaux">
        {proofPoints.map(({ label }) => (
          <span key={label}>
            <Check size={14} aria-hidden="true" />
            {label}
          </span>
        ))}
      </div>
    </main>
  );
}
