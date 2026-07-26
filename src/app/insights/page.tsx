"use client";

import React from "react";
import Link from "next/link";
import styles from "./Insights.module.css";
import type { JSONContent } from "@tiptap/react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

function excerptFrom(content: string, limit = 150): string {
  if (!content) return "";
  let parsed: JSONContent | null = null;
  try {
    parsed = JSON.parse(content);
  } catch {
    return content.length > limit ? `${content.substring(0, limit)}…` : content;
  }
  const text = extractText(parsed);
  return text.length > limit ? `${text.substring(0, limit)}…` : text;
}

function extractText(node: JSONContent | null | undefined): string {
  if (!node) return "";
  if (node.type === "text" && typeof node.text === "string") return node.text;
  if (Array.isArray(node.content)) {
    return node.content.map(extractText).join("");
  }
  return "";
}

export default function Insights() {
  const dynamicBlogs = useQuery(api.blogs.get);

  return (
    <div className={styles.insightsPage}>
      <div className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <span className={styles.eyebrow}>Insights</span>
          <h1 className={styles.title}>Evidence-based perspectives on nutrition &amp; wellness</h1>
          <p className={styles.subtitle}>
            Thought leadership and practical guidance from Oasis Wellness Consultancy
            helping you communicate health with clarity and credibility.
          </p>
        </div>
      </div>

      <div className={`container ${styles.container}`}>
        {dynamicBlogs === undefined ? (
          <div className={styles.grid}>
            {[0, 1, 2, 3].map((i) => (
              <article key={i} className={styles.card}>
                <div className={styles.cardImageWrap}>
                  <div className={styles.skeleton} />
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.skeletonLine} style={{ width: "40%" }} />
                  <div className={styles.skeletonLine} style={{ width: "90%", height: "1.5rem" }} />
                  <div className={styles.skeletonLine} style={{ width: "70%" }} />
                </div>
              </article>
            ))}
          </div>
        ) : dynamicBlogs.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>Articles coming soon</h2>
            <p>We&apos;re preparing evidence-based insights for you. Please check back shortly.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {dynamicBlogs.map((blog) => (
              <article key={blog._id} className={styles.card}>
                <Link href={`/insights/${blog._id}`} className={styles.cardImageWrap}>
                  {blog.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={blog.imageUrl} alt={blog.title} className={styles.cardImage} />
                  ) : (
                    <div className={styles.cardImagePlaceholder} />
                  )}
                </Link>
                <div className={styles.cardBody}>
                  <div className={styles.cardMeta}>
                    <span className={styles.category}>Insights</span>
                    <span className={styles.date}>
                      {new Date(blog.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <h2 className={styles.articleTitle}>
                    <Link href={`/insights/${blog._id}`}>{blog.title}</Link>
                  </h2>
                  <p className={styles.excerpt}>{excerptFrom(blog.content)}</p>
                  <Link href={`/insights/${blog._id}`} className={styles.readMore}>
                    Read article &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}