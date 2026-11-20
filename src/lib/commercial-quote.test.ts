import assert from "node:assert/strict";
import { test } from "node:test";
import { quoteSchema } from "./commercial-quote";

const request = { name: "Lia Costa", office: "Costa Advocacia", model: "Site Essencial", contact: "(11) 99999-0101", website: "" };

for (const field of ["name", "office", "contact", "model"] as const) {
  test(`o pedido exige ${field}`, () => {
    assert.equal(quoteSchema.safeParse({ ...request, [field]: "" }).success, false);
  });
}

test("somente Site Essencial e Site Profissional podem ser escolhidos", () => {
  for (const model of ["Site Essencial", "Site Profissional"]) {
    assert.equal(quoteSchema.safeParse({ ...request, model }).success, true);
  }
  assert.equal(quoteSchema.safeParse({ ...request, model: "Outro" }).success, false);
});

test("o contato aceita telefone com DDD ou e-mail, mas não texto genérico", () => {
  assert.equal(quoteSchema.safeParse({ ...request, contact: "lia@example.com" }).success, true);
  assert.equal(quoteSchema.safeParse({ ...request, contact: "ligar depois" }).success, false);
});