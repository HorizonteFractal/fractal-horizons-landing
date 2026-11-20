import { z } from "zod";

export const QUOTE_MODELS = ["Site Essencial", "Site Profissional"] as const;
export type QuoteModel = (typeof QUOTE_MODELS)[number];

const singleLine = /^[^\p{Cc}\p{Zl}\p{Zp}<>]+$/u;
const email = z.string().email();

export const quoteSchema = z.object({
  name: z.string().max(100, "Use até 100 caracteres.").trim()
    .min(2, "Informe seu nome.").regex(singleLine, "Informe um nome válido."),
  office: z.string().max(120, "Use até 120 caracteres.").trim()
    .min(2, "Informe o nome do escritório.").regex(singleLine, "Informe um escritório válido."),
  model: z.enum(QUOTE_MODELS, { message: "Escolha um dos dois modelos." }),
  contact: z.string().max(254, "Use até 254 caracteres.").trim().refine((value) => {
    const digits = value.replace(/\D/g, "");
    const phone = /^\+?[\d(). -]+$/.test(value) && digits.length >= 10 && digits.length <= 15;
    return singleLine.test(value) && (phone || email.safeParse(value).success);
  }, "Informe um telefone com DDD ou um e-mail válido."),
  website: z.literal(""),
});