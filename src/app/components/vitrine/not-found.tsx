import { Link } from "react-router";
import { Button } from "../ui/button";
import { Phone, Home, ArrowLeft } from "lucide-react";
import { useLanguage } from "../../i18n/language-context";

export function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background px-4">
      <div className="text-center max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">
            ACTOR <span className="text-primary">Hub</span>
          </span>
        </Link>

        <div className="mb-8">
          <h1 className="text-8xl font-bold bg-gradient-to-r from-primary via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {t("notfound.title")}
          </h2>
          <p className="text-muted-foreground">
            {t("notfound.description")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button className="bg-gradient-to-r from-primary via-blue-600 to-cyan-600 text-white">
              <Home className="mr-2 h-4 w-4" />
              {t("notfound.home")}
            </Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Page précédente
          </Button>
        </div>
      </div>
    </div>
  );
}
