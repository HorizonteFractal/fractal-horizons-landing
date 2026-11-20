import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { quoteSchema } from "../commercial-quote";

export const registerQuoteRequest = createServerFn({ method: "POST" })
  .inputValidator(quoteSchema)
  .handler(async ({ data: { name, office, model, contact } }) => {
    if (getRequestHeader("sec-fetch-site") === "cross-site") return { ok: false };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("quote_requests").insert({ name, office, model, contact });
    return { ok: !error };
  });