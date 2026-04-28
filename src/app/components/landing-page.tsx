import {
  Phone,
  MessageSquare,
  MessageCircle,
  Mail,
  ArrowRight,
  CheckCircle,
  Zap,
  BarChart3,
  Globe,
  Shield,
  HeadphonesIcon,
} from "lucide-react";
import { Link } from "react-router";

export function LandingPage() {
  const features = [
    {
      id: "call-center",
      title: "Centre d'Appels Cloud",
      description: "Solution complète de téléphonie avec softphone intégré, gestion d'agents en temps réel et IVR configurable.",
      icon: Phone,
      color: "bg-[#FE5B29]",
      stats: [
        { label: "Agents actifs", value: "150+" },
        { label: "Appels/jour", value: "12K+" },
        { label: "Disponibilité", value: "99.9%" },
      ],
      capabilities: ["Softphone Web intégré", "IVR intelligent", "Enregistrement d'appels", "Supervision temps réel"],
    },
    {
      id: "sms-marketing",
      title: "SMS Marketing",
      description: "Envoi massif de SMS avec protocole SMPP, personnalisation avancée et analytics détaillés.",
      icon: MessageSquare,
      color: "bg-blue-500",
      stats: [
        { label: "SMS/mois", value: "2M+" },
        { label: "Délivrabilité", value: "98.5%" },
        { label: "Pays couverts", value: "195+" },
      ],
      capabilities: ["Envoi programmé", "Personnalisation bulk", "API SMPP", "Rapports détaillés"],
    },
    {
      id: "whatsapp-business",
      title: "WhatsApp Business",
      description: "Messagerie professionnelle avec chatbots IA, API officielle et gestion multi-agents.",
      icon: MessageCircle,
      color: "bg-green-500",
      stats: [
        { label: "Messages/mois", value: "500K+" },
        { label: "Taux de lecture", value: "87%" },
        { label: "Chatbots actifs", value: "25+" },
      ],
      capabilities: ["API officielle WhatsApp", "Chatbots IA", "Templates approuvés", "Multi-agents"],
    },
    {
      id: "email-marketing",
      title: "Email Marketing",
      description: "Campagnes d'emailing professionnelles avec SMTP dédié, templates responsive et A/B testing.",
      icon: Mail,
      color: "bg-purple-500",
      stats: [
        { label: "Emails/mois", value: "5M+" },
        { label: "Délivrabilité", value: "96%" },
        { label: "Templates", value: "200+" },
      ],
      capabilities: ["SMTP dédié", "A/B Testing", "Templates responsive", "Automation avancée"],
    },
  ];

  const benefits = [
    { icon: Zap, title: "Rapidité d'Exécution", description: "Lancez vos campagnes en quelques clics" },
    { icon: BarChart3, title: "Analytics Avancés", description: "Suivez vos performances en temps réel" },
    { icon: Shield, title: "Sécurité Maximale", description: "Protection des données et conformité RGPD" },
    { icon: Globe, title: "Portée Mondiale", description: "Connectez-vous avec vos clients partout" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #FE5B29 0%, #2B7FFF 50%, #1FF5A0 100%)" }}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              ACTOR Hub Platform
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 mb-4">
              One platform - Infinite connections
            </p>
            <p className="text-lg sm:text-xl text-white/80 mb-4">
              Solution Multi-Canal Complète pour votre Business
            </p>
            <p className="text-lg text-white/80 mb-10 max-w-3xl mx-auto">
              Centre d'appels cloud, SMS Marketing, WhatsApp Business et Email Marketing - Tout ce dont vous avez besoin pour communiquer efficacement avec vos clients
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login"
                className="px-8 py-4 bg-white text-[#FE5B29] rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all inline-flex items-center gap-2"
              >
                Commencer Gratuitement
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all inline-flex items-center gap-2">
                <HeadphonesIcon className="w-5 h-5" />
                Contactez-nous
              </button>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Clients Actifs", value: "5,000+" },
              { label: "Messages/Mois", value: "8M+" },
              { label: "Satisfaction", value: "98%" },
              { label: "Disponibilité", value: "99.9%" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20">
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-white/80 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Nos Fonctionnalités Principales</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une plateforme complète pour gérer tous vos canaux de communication depuis un seul endroit
            </p>
          </div>

          <div className="space-y-24">
            {features.map((feature, index) => (
              <div key={feature.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${index % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
                <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                  <div className="bg-card border-2 border-border rounded-2xl overflow-hidden shadow-2xl p-12 flex items-center justify-center">
                    <feature.icon className="w-32 h-32 text-muted-foreground/30" />
                  </div>
                </div>

                <div className={index % 2 === 1 ? "lg:col-start-1" : ""}>
                  <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full ${feature.color} mb-4`}>
                    <feature.icon className="w-5 h-5 text-white" />
                    <span className="font-semibold text-white">{feature.title}</span>
                  </div>

                  <h3 className="text-3xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-lg text-muted-foreground mb-6">{feature.description}</p>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {feature.stats.map((stat) => (
                      <div key={stat.label} className="bg-muted rounded-lg p-3 text-center">
                        <p className="text-xl font-bold text-[#FE5B29]">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 mb-6">
                    {feature.capabilities.map((capability) => (
                      <div key={capability} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-foreground">{capability}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/login"
                    className={`inline-flex items-center gap-2 px-6 py-3 ${feature.color} text-white rounded-lg font-semibold hover:opacity-90 transition-opacity`}
                  >
                    Découvrir {feature.title}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pourquoi Choisir ACTOR Hub ?</h2>
            <p className="text-lg text-muted-foreground">Une plateforme conçue pour votre succès</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#FE5B29]/10 rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-[#FE5B29]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-3xl p-8 sm:p-12 shadow-2xl" style={{ background: "linear-gradient(135deg, #FE5B29 0%, #2B7FFF 100%)" }}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Prêt à Transformer votre Communication ?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Rejoignez plus de 5,000 entreprises qui nous font confiance
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login"
                className="px-8 py-4 bg-white text-[#FE5B29] rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all inline-flex items-center gap-2"
              >
                Essai Gratuit 30 Jours
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all">
                Planifier une Démo
              </button>
            </div>
            <p className="text-white/80 text-sm mt-6">
              Aucune carte de crédit requise • Configuration en 5 minutes
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">© 2026 BIAR GROUP AFRICA SARLU - Tous droits réservés</p>
          <p className="text-sm text-muted-foreground mt-2">For you, we go above and beyond.</p>
        </div>
      </footer>
    </div>
  );
}
