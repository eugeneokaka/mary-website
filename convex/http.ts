import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { authComponent, createAuth } from "./auth";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

function safeFileName(raw: string | null): string {
  const name = (raw ?? "").replace(/[\\/\r\n"]/g, "").trim();
  return name || "download";
}

// Public: streams a stored file back with an attachment disposition so any
// visitor can download documents attached to published articles.
http.route({
  path: "/download",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const storageId = url.searchParams.get("id");
    if (!storageId) {
      return new Response("Missing file id", { status: 400 });
    }

    const blob = await ctx.storage.get(storageId as Id<"_storage">);
    if (!blob) {
      return new Response("File not found", { status: 404 });
    }

    const postId = url.searchParams.get("postId");
    if (postId) {
      try {
        await ctx.runMutation(internal.analytics.recordDownloadForPost, {
          postId: postId as Id<"blogs">,
        });
      } catch {
        // Analytics must never block a download.
      }
    }

    const fileName = encodeURIComponent(safeFileName(url.searchParams.get("name")));

    return new Response(blob, {
      headers: {
        "Content-Type": blob.type || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${fileName}"; filename*=UTF-8''${fileName}`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }),
});

export default http;
