import { useRef, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { quoteSchema, QUOTE_MODELS, type QuoteModel } from "@/lib/commercial-quote";
import { registerQuoteRequest } from "@/lib/api/commercial-quote.functions";
import { getCommercialWhatsAppUrl } from "@/lib/commercial-sites";

const fields = [
  { name: "name", label: "Nome", autoComplete: "name", maxLength: 100 },
  { name: "office", label: "Escritório", autoComplete: "organization", maxLength: 120 },
  { name: "contact", label: "Telefone com DDD ou e-mail", maxLength: 254 },
] as const;

export function CommercialQuoteForm({ model, onModelChange }: {
  model: QuoteModel | "";
  onModelChange: (model: QuoteModel | "") => void;
}) {
  const register = useServerFn(registerQuoteRequest);
  const inFlight = useRef(false);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<"name" | "office" | "model" | "contact", string[]>>>({});
  const [failed, setFailed] = useState(false);
  const [savedUrl, setSavedUrl] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || savedUrl) return;
    const form = event.currentTarget;
    const parsed = quoteSchema.safeParse(Object.fromEntries(new FormData(form)));
    setFailed(false);
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      const first = parsed.error.issues[0]?.path[0];
      if (typeof first === "string") document.getElementById(`quote-${first}`)?.focus();
      return;
    }

    setErrors({});
    inFlight.current = true;
    setPending(true);
    let tab: Window | null = null;
    try {
      tab = window.open("about:blank", "_blank");
      if (tab) tab.opener = null;
    } catch {
      // The manual WhatsApp link remains available after a successful save.
    }
    try {
      const result = await register({ data: parsed.data });
      if (!result.ok) throw new Error("Quote was not saved");
      const url = getCommercialWhatsAppUrl(parsed.data.model);
      setSavedUrl(url);
      if (tab && !tab.closed) {
        try { tab.location.replace(url); } catch { tab.close(); }
      }
    } catch {
      tab?.close();
      setFailed(true);
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  if (savedUrl) return (
    <div className="mx-auto mt-8 max-w-xl">
      <p role="status" className="text-foreground">Pedido registrado. Continue a conversa pelo WhatsApp.</p>
      <Button asChild className="mt-4 rounded-full bg-sunset px-6 shadow-soft">
        <a href={savedUrl} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" />Abrir WhatsApp</a>
      </Button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Pedido de orçamento" aria-busy={pending} className="mx-auto mt-8 max-w-xl border-t border-border pt-6 text-left">
      <fieldset disabled={pending} className="grid min-w-0 gap-4 sm:grid-cols-2">
        {fields.map(({ name, label, ...props }) => (
          <div key={name} className={name === "contact" ? "sm:col-span-2" : ""}>
            <label htmlFor={`quote-${name}`} className="mb-1.5 block text-sm font-medium">{label}</label>
            <Input id={`quote-${name}`} name={name} required {...props} className="h-11 bg-background" onChange={() => {
              if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
            }} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `quote-${name}-error` : undefined} />
            {errors[name]?.[0] && <p id={`quote-${name}-error`} role="alert" className="mt-1 text-sm text-destructive">{errors[name][0]}</p>}
          </div>
        ))}
        <div className="sm:col-span-2">
          <label htmlFor="quote-model" className="mb-1.5 block text-sm font-medium">Modelo escolhido</label>
          <select id="quote-model" name="model" required value={model} onChange={(event) => {
            const value = QUOTE_MODELS.find((option) => option === event.target.value);
            onModelChange(value ?? "");
            setErrors((current) => ({ ...current, model: undefined }));
          }} aria-invalid={Boolean(errors.model)} aria-describedby={errors.model ? "quote-model-error" : undefined} className="h-11 w-full rounded-md border border-input bg-background px-3 text-base text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm">
            <option value="">Selecione um modelo</option>
            {QUOTE_MODELS.map((option) => <option key={option}>{option}</option>)}
          </select>
          {errors.model?.[0] && <p id="quote-model-error" role="alert" className="mt-1 text-sm text-destructive">{errors.model[0]}</p>}
        </div>
        <div hidden><label htmlFor="quote-website">Site</label><input id="quote-website" name="website" tabIndex={-1} autoComplete="off" /></div>
      </fieldset>
      <p id="quote-purpose" className="mt-4 text-sm text-muted-foreground">A Horizonte Fractal usa esses dados para responder ao seu pedido de orçamento.</p>
      {failed && <p role="alert" className="mt-3 text-sm text-destructive">Não foi possível registrar o pedido. Tente novamente.</p>}
      <div className="mt-5 pr-14 sm:pr-0">
        <Button type="submit" disabled={pending} aria-describedby="quote-purpose" className="h-auto min-h-11 w-full whitespace-normal rounded-full bg-sunset px-4 py-3 shadow-soft sm:w-auto">
          <MessageCircle aria-hidden="true" />{pending ? "Registrando pedido…" : "Solicitar orçamento e abrir WhatsApp"}<ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </form>
  );
}