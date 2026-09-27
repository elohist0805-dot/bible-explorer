import { getStore } from "@netlify/blobs";

const STORE_NAME = "bible-explorer-stats";
const KEY = "global-visits";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store, max-age=0",
    },
  });
}

async function readCount(store) {
  const entry = await store.getWithMetadata(KEY, {
    consistency: "strong",
    type: "json",
  });
  if (!entry) return { count: 0, etag: null };
  return {
    count: Number(entry.data?.count || 0),
    etag: entry.etag,
  };
}

async function increment(store) {
  // Optimistic concurrency prevents simultaneous visitors from overwriting each other.
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const current = await readCount(store);
    const next = current.count + 1;

    if (current.etag === null) {
      const created = await store.setJSON(
        KEY,
        { count: next, updatedAt: new Date().toISOString() },
        { onlyIfNew: true }
      );
      if (created.modified) return next;
    } else {
      const updated = await store.setJSON(
        KEY,
        { count: next, updatedAt: new Date().toISOString() },
        { onlyIfMatch: current.etag }
      );
      if (updated.modified) return next;
    }

    await new Promise((resolve) => setTimeout(resolve, 15 * (attempt + 1)));
  }

  throw new Error("Could not update visit counter after retries");
}

export default async (req) => {
  const store = getStore({
    name: STORE_NAME,
    consistency: "strong",
  });

  if (req.method === "GET") {
    const { count } = await readCount(store);
    return json({ count });
  }

  if (req.method === "POST") {
    const count = await increment(store);
    return json({ count });
  }

  return json({ error: "Method not allowed" }, 405);
};
