import { createFileRoute } from "@tanstack/react-router";
import { CommercialLanding } from "@/components/commercial/CommercialLanding";

export const Route = createFileRoute("/sites")({
  head: () => {
    const title = "Sites Profissionais para Advogados | Horizonte Fractal";
    const description =
      "Sites profissionais para advogados e escritórios. Conheça os modelos Essencial e Profissional da Horizonte Fractal.";
    const url = "https://horizontefractal.com.br/sites";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: "Horizonte Fractal" },
        { property: "og:locale", content: "pt_BR" },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: CommercialLanding,
});
