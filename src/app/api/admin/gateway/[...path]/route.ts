import { proxyAdminBackend } from "@/lib/admin-api-proxy";

type RouteContext = { params: Promise<{ path: string[] }> };

async function handle(request: Request, ctx: RouteContext) {
  const { path } = await ctx.params;
  return proxyAdminBackend(request, path.join("/"));
}

export async function GET(request: Request, ctx: RouteContext) {
  return handle(request, ctx);
}

export async function POST(request: Request, ctx: RouteContext) {
  return handle(request, ctx);
}

export async function PATCH(request: Request, ctx: RouteContext) {
  return handle(request, ctx);
}

export async function DELETE(request: Request, ctx: RouteContext) {
  return handle(request, ctx);
}
