#!/usr/bin/env node
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const LISTEN_HOST = "127.0.0.1";
const LISTEN_PORT = 4790;
const EXECUTOR_ORIGIN = "http://127.0.0.1:4789";
const PUBLIC_ORIGIN = "https://executor.local";
const OAUTH_CALLBACK_URL = "http://localhost:4789/api/oauth/callback";
const OAUTH_REDIRECT_PATHS = new Set([
  "/api/oauth/clients",
  "/api/oauth/clients/register-dynamic",
  "/api/oauth/start",
]);
const SERVER_PATH = join(homedir(), ".executor", "v2", "cli", "server.json");

function readToken() {
  return JSON.parse(readFileSync(SERVER_PATH, "utf8")).password;
}

function injectedProfileScript() {
  const profile = {
    version: 1,
    activeKey: `http:${PUBLIC_ORIGIN}`,
    profiles: [
      {
        kind: "http",
        key: `http:${PUBLIC_ORIGIN}`,
        origin: PUBLIC_ORIGIN,
        apiBaseUrl: `${PUBLIC_ORIGIN}/api`,
        displayName: "executor.local",
      },
    ],
  };

  return `<script>
try {
  localStorage.setItem("executor.serverConnections.v1", ${JSON.stringify(JSON.stringify(profile))});
  localStorage.removeItem("executor.authToken");
} catch (_) {}
</script>`;
}

function stripHopByHop(headers) {
  const next = new Headers(headers);
  for (const name of [
    "connection",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade",
    "content-length",
    "host",
  ]) {
    next.delete(name);
  }
  return next;
}

async function proxyRequestBody(req, url) {
  if (req.method === "GET" || req.method === "HEAD") return undefined;
  if (!OAUTH_REDIRECT_PATHS.has(url.pathname)) return req;

  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  const rawBody = Buffer.concat(chunks).toString("utf8");

  try {
    const payload = JSON.parse(rawBody);
    if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
      return rawBody;
    }

    // Linear and other local OAuth clients register the native loopback callback,
    // not the friendly HTTPS alias used to display Executor's UI.
    return JSON.stringify({ ...payload, redirectUri: OAUTH_CALLBACK_URL });
  } catch {
    return rawBody;
  }
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", EXECUTOR_ORIGIN);
    const headers = stripHopByHop(req.headers);
    headers.set("authorization", `Bearer ${readToken()}`);
    headers.set("host", "127.0.0.1:4789");

    const upstream = await fetch(url, {
      method: req.method,
      headers,
      body: await proxyRequestBody(req, url),
      duplex: "half",
      redirect: "manual",
    });

    const responseHeaders = stripHopByHop(upstream.headers);
    const contentType = upstream.headers.get("content-type") ?? "";

    if (contentType.includes("text/html")) {
      const html = await upstream.text();
      const body = html.includes("<head>")
        ? html.replace("<head>", `<head>${injectedProfileScript()}`)
        : `${injectedProfileScript()}${html}`;
      responseHeaders.set("content-length", String(Buffer.byteLength(body)));
      res.writeHead(upstream.status, Object.fromEntries(responseHeaders));
      res.end(body);
      return;
    }

    res.writeHead(upstream.status, Object.fromEntries(responseHeaders));
    if (upstream.body) {
      for await (const chunk of upstream.body) {
        res.write(Buffer.from(chunk));
      }
    }
    res.end();
  } catch (error) {
    res.writeHead(502, { "content-type": "text/plain" });
    res.end(`executor-local-proxy failed: ${error instanceof Error ? error.message : String(error)}\n`);
  }
});

server.listen(LISTEN_PORT, LISTEN_HOST, () => {
  console.log(`executor-local-proxy listening on http://${LISTEN_HOST}:${LISTEN_PORT}`);
});
