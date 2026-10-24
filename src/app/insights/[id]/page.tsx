"use client";

import React, { use, useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RichContentViewer from "@/components/RichContentViewer";
import { authClient } from "@/lib/auth-client";
import { claimViewInSession, getViewerId, isBot } from "@/lib/analytics-client";
import styles from "./BlogDetail.module.css";

export default function BlogDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const blogId = resolvedParams.id as Id<"blogs">;

  const blog = useQuery(api.blogs.getById, { blogId });
  const { data: session } = authClient.useSession();
  const removeBlog = useMutation(api.blogs.remove);
  const recordView = useMutation(api.analytics.recordView);
  const recordRead = useMutation(api.analytics.recordRead);
  const router = useRouter();

  // Only the author of this article may edit or delete it.
  const canManage = !!session?.user && !!blog && session.user.id === blog.authorId;
  const [isDeleting, setIsDeleting] = useState(false);

  // Analytics: one view per article per session, plus time spent reading.
  // Read time is flushed when the tab is hidden or the page unmounts.
  const readStartRef = useRef<number | null>(null);
  const readSentRef = useRef(false);
  const postId = blog?._id;

  useEffect(() => {
    if (!postId || canManage || isBot()) return;

    const viewerId = getViewerId();
    if (viewerId && claimViewInSession(postId)) {
      recordView({ postId, viewerId }).catch(() => {});
    }

    readStartRef.current = Date.now();
    readSentRef.current = false;

    const flush = () => {
      if (readSentRef.current || readStartRef.current === null) return;
      readSentRef.current = true;
      const durationMs = Date.now() - readStartRef.current;
      if (durationMs >= 5000) {
        recordRead({ postId, durationMs }).catch(() => {});
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") flush();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pagehide", flush);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [postId, canManage, recordView, recordRead]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this blog? This action cannot be undone.")) return;

    setIsDeleting(true);
    try {
      await removeBlog({ blogId });
      router.push("/insights");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete blog");
      setIsDeleting(false);
    }
  };

  if (blog === undefined) {
    return (
      <div className={styles.pageContainer}>
        <div className={`container ${styles.loadingState}`}>
          <div className={styles.loadingBar} />
          <p>Loading article…</p>
        </div>
      </div>
    );
  }

  if (blog === null) {
    return (
      <div className={styles.pageContainer}>
        <div className={`container ${styles.notFoundState}`}>
          <h1>Article not found</h1>
          <p>This article may have been removed or moved.</p>
          <Link href="/insights" className={styles.backLink}>
            &larr; Back to Insights
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <article className={styles.article}>
        <div className={`container ${styles.articleInner}`}>
          {/* Top bar */}
          <div className={styles.actionRow}>
            <Link href="/insights" className={styles.backLink}>
              &larr; All insights
            </Link>
            <div className={styles.actionButtons}>
              {canManage && (
                <>
                  <Link href={`/dashboard?edit=${blog._id}`} className={styles.editButton}>
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    className={styles.deleteButton}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting…" : "Delete"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Header */}
          <header className={styles.header}>
            <span className={styles.eyebrow}>Insights</span>
            <h1 className={styles.title}>{blog.title}</h1>
            <div className={styles.metaBar}>
              <span className={styles.date}>
                {new Date(blog.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className={styles.readTime}>{estimateReadTime(blog.content)} min read</span>
            </div>
          </header>

          {/* Cover image */}
          {blog.imageUrl && (
            <div className={styles.imageWrapper}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={blog.imageUrl} alt={blog.title} className={styles.image} />
            </div>
          )}

          {/* Rich content */}
          <div className={styles.content}>
            <RichContentViewer content={blog.content} postId={blog._id} />
          </div>

          {/* Footer */}
          <footer className={styles.articleFooter}>
            <Link href="/insights" className={styles.backLink}>
              &larr; Back to all insights
            </Link>
          </footer>
        </div>
      </article>
    </div>
  );
}

function estimateReadTime(content: string): number {
  if (!content) return 1;
  let text = content;
  try {
    const parsed = JSON.parse(content);
    text = extractText(parsed);
  } catch {
    // already plain text
  }
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function extractText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as { type?: string; text?: string; content?: unknown[] };
  if (n.type === "text" && typeof n.text === "string") return n.text;
  if (Array.isArray(n.content)) return n.content.map(extractText).join("");
  return "";
}