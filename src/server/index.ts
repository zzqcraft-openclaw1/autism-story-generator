import { createServer } from 'node:http';
import { Readable } from 'node:stream';
import { handleRequest } from './app.ts';

export function startServer(port = 3000) {
  const server = createServer(async (req, res) => {
    const origin = `http://${req.headers.host ?? `127.0.0.1:${port}`}`;
    const init = {
      headers: Object.entries(req.headers).flatMap(([key, value]) =>
        Array.isArray(value) ? value.map((item) => [key, item] as [string, string]) : value ? [[key, value] as [string, string]] : [],
      ),
    } as RequestInit & { duplex?: 'half'; body?: unknown };

    if (req.method) {
      init.method = req.method;
    }

    if (req.method && !['GET', 'HEAD'].includes(req.method)) {
      init.body = Readable.toWeb(req);
      init.duplex = 'half';
    }

    const request = new Request(new URL(req.url ?? '/', origin), init);

    const response = await handleRequest(request);

    res.statusCode = response.status;
    response.headers.forEach((value, key) => res.setHeader(key, value));

    if (!response.body) {
      res.end();
      return;
    }

    const reader = response.body.getReader();
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      res.write(Buffer.from(chunk.value));
    }
    res.end();
  });

  server.listen(port);
  return server;
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const port = Number(process.env.PORT ?? 3000);
  startServer(port);
  console.log(`Autism Story Generator server listening on http://127.0.0.1:${port}`);
}
