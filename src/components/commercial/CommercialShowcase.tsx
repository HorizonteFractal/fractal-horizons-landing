import { useEffect, useRef, useState } from "react";
import { ArrowRight, ExternalLink, Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ESSENCIAL_SITE_URL, PROFISSIONAL_SITE_URL } from "@/lib/commercial-sites";
import { QUOTE_MODELS, type QuoteModel } from "@/lib/commercial-quote";
import { CommercialContact } from "./CommercialChrome";

const models = [
  {
    id: "essencial",
    label: "Essencial",
    quoteModel: QUOTE_MODELS[0],
    url: ESSENCIAL_SITE_URL,
    audience: "Para advogados autônomos",
    description: "Uma apresentação direta do advogado, das áreas de atuação e das etapas do atendimento.",
    sections: [
      ["Perfil do advogado", "advogado"],
      ["Áreas de atuação", "areas"],
      ["Diferenciais do atendimento", "diferenciais"],
      ["Etapas do atendimento", "processo"],
    ],
  },
  {
    id: "profissional",
    label: "Profissional",
    quoteModel: QUOTE_MODELS[1],
    url: PROFISSIONAL_SITE_URL,
    audience: "Para advogados e escritórios",
    description: "Uma presença institucional mais completa, com espaço para a equipe, perguntas frequentes e conteúdo jurídico.",
    sections: [
      ["Apresentação do escritório", "institucional"],
      ["Áreas de atuação", "areas"],
      ["Corpo jurídico", "advogado"],
      ["Artigos jurídicos", "blog"],
    ],
  },
];

type Model = (typeof models)[number];
type Device = "desktop" | "mobile";

function DemoScreen({ model, device, section }: { model: Model; device: Device; section: string }) {
  const viewport = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const mobile = device === "mobile";
  const width = mobile ? size.width : Math.max(1024, size.width);
  const scale = mobile ? 1 : size.width / width;

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex min-w-0 items-start justify-center rounded-lg border border-border bg-muted/40 p-2 sm:p-4">
      <div className={`w-full min-w-0 overflow-hidden rounded-lg border border-border bg-background shadow-soft ${mobile ? "max-w-[390px]" : ""}`}>
        <div aria-hidden="true" className="flex h-8 items-center gap-1.5 border-b border-border px-3">
          {mobile ? <span className="mx-auto h-1 w-9 rounded-full bg-muted-foreground/60" /> : (
            <><span className="size-1.5 rounded-full bg-brand-orange" /><span className="size-1.5 rounded-full bg-muted-foreground/60" /><span className="size-1.5 rounded-full bg-muted-foreground/60" /></>
          )}
        </div>
        <div ref={viewport} className={`relative overflow-hidden bg-muted ${mobile ? "h-[460px] sm:h-[510px]" : "h-[310px] sm:h-[510px]"}`}>
          {size.width > 0 && size.height > 0 && (
            <iframe
              id={`showcase-preview-${model.id}`}
              title={`Demonstração do Site ${model.label}`}
              src={section ? `${model.url}#${section}` : model.url}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin"
              referrerPolicy="no-referrer"
              className="absolute left-0 top-0 block origin-top-left border-0"
              style={{ width, height: size.height / scale, transform: `scale(${scale})` }}
            />
          )}
        </div>
        {mobile && <div aria-hidden="true" className="flex h-5 items-center border-t border-border"><span className="mx-auto h-1 w-20 rounded-full bg-muted-foreground/60" /></div>}
      </div>
    </div>
  );
}

function ModelPreview({ model, device, onSelectModel }: { model: Model; device: Device; onSelectModel: (model: QuoteModel) => void }) {
  const [destination, setDestination] = useState({ section: "", revision: 0 });
  const screen = useRef<HTMLDivElement>(null);

  function openSection(section: string) {
    setDestination((current) => ({
      section,
      revision: current.revision + (current.section === section ? 1 : 0),
    }));
    if (window.matchMedia("(max-width: 1023px)").matches) {
      screen.current?.scrollIntoView({ block: "start", behavior: "instant" });
    }
  }

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-8">
      <div ref={screen} className="min-w-0 scroll-mt-24">
        <DemoScreen key={destination.revision} model={model} device={device} section={destination.section} />
      </div>
      <div className="min-w-0 lg:pt-2">
        <p className="text-xs font-medium uppercase text-brand-orange">{model.audience}</p>
        <h4 className="mt-2 font-display text-2xl font-semibold">Site {model.label}</h4>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{model.description}</p>
        <ul className="mt-5 border-t border-border">
          {[["Início do modelo", ""], ...model.sections].map(([label, hash]) => (
            <li key={hash} className="border-b border-border">
              <Button type="button" variant="ghost" aria-controls={`showcase-preview-${model.id}`} onClick={() => openSection(hash)} className="h-auto min-h-10 w-full justify-between whitespace-normal px-2 text-left hover:bg-muted hover:text-foreground">
                {label}<ArrowRight className="text-brand-orange" aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-center gap-2 lg:flex-col lg:items-start">
          <CommercialContact onSelect={() => onSelectModel(model.quoteModel)} className="whitespace-normal px-4 text-center">Quero o {model.label}</CommercialContact>
          <Button asChild variant="ghost" className="whitespace-normal px-2 text-muted-foreground">
            <a href={model.url} target="_blank" rel="noopener noreferrer">Abrir demonstração<ExternalLink aria-hidden="true" /></a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CommercialShowcase({ onSelectModel }: { onSelectModel: (model: QuoteModel) => void }) {
  const [device, setDevice] = useState<Device>("desktop");

  useEffect(() => {
    if (window.matchMedia("(max-width: 639px)").matches) setDevice("mobile");
  }, []);

  return (
    <section id="showcase" className="mt-20 scroll-mt-28 border-t border-border/60 pt-10 md:mt-24" aria-labelledby="showcase-title">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase text-brand-orange">Demonstrações</p>
          <h3 id="showcase-title" className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Explore os modelos</h3>
        </div>
        <ToggleGroup type="single" value={device} aria-label="Formato da tela" onValueChange={(value) => {
          if (value === "desktop" || value === "mobile") setDevice(value);
        }} className="inline-flex w-fit rounded-lg border border-border bg-muted p-1">
          <ToggleGroupItem value="desktop" className="h-9 gap-2 px-3 data-[state=on]:bg-background data-[state=on]:text-brand-orange"><Monitor className="size-4" aria-hidden="true" /> Computador</ToggleGroupItem>
          <ToggleGroupItem value="mobile" className="h-9 gap-2 px-3 data-[state=on]:bg-background data-[state=on]:text-brand-orange"><Smartphone className="size-4" aria-hidden="true" /> Celular</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <Tabs defaultValue="essencial" activationMode="manual" className="mt-6">
        <TabsList aria-label="Modelos de site" className="grid h-11 w-full grid-cols-2 sm:w-fit">
          {models.map((model) => <TabsTrigger key={model.id} value={model.id} className="h-full sm:px-6">{model.label}</TabsTrigger>)}
        </TabsList>
        {models.map((model) => (
          <TabsContent key={model.id} value={model.id} className="mt-4">
            <ModelPreview model={model} device={device} onSelectModel={onSelectModel} />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}