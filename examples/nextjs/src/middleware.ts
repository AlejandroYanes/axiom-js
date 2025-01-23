import { logger } from '@/lib/axiom/server';
import { transformMiddlewareRequest } from '@axiomhq/nextjs';
import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  logger.info(...transformMiddlewareRequest(request));

  event.waitUntil(logger.flush());
  return NextResponse.next();
}
