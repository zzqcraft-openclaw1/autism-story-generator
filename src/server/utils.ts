import { randomUUID } from 'node:crypto';

export function nowIsoString(): string {
  return new Date().toISOString();
}

export function makeId(prefix: string): string {
  return `${prefix}_${randomUUID().replace(/-/g, '').slice(0, 12)}`;
}

export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  });
}

export async function readJsonBody(request: Request): Promise<unknown> {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    throw new Error('Expected application/json request body');
  }

  return request.json();
}

export function htmlResponse(html: string, status = 200): Response {
  return new Response(html, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
    },
  });
}
