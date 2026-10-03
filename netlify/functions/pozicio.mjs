import { getStore } from "@netlify/blobs";

const K = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX","XX","XXI","XXII","XXIII"];
const H = { "content-type": "application/json", "cache-control": "no-store" };

export default async (req) => {
  const store = getStore("pozicio");
  if (req.method === "POST") {
    const pin = req.headers.get("x-pin");
    if (!process.env.ADMIN_PIN || pin !== process.env.ADMIN_PIN) {
      return new Response(JSON.stringify({ error: "Hibás PIN" }), { status: 401, headers: H });
    }
    let body = {};
    try { body = await req.json(); } catch (e) {}
    const k = body.kerulet || "";
    if (k !== "" && !K.includes(k)) {
      return new Response(JSON.stringify({ error: "Hibás kerület" }), { status: 400, headers: H });
    }
    await store.setJSON("aktualis", { kerulet: k, ido: Date.now() });
    return new Response(JSON.stringify({ ok: true, kerulet: k }), { headers: H });
  }
  const d = await store.get("aktualis", { type: "json" });
  return new Response(JSON.stringify(d || { kerulet: "" }), { headers: H });
};

export const config = { path: "/api/pozicio" };
