'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Doc } from '../../convex/_generated/dataModel';
import styles from './InsightsPreview.module.css';

type Blog = Doc<'blogs'> & { imageUrl: string | null };

function excerptFrom(content: string, limit = 120): string {
  if (!content) return '';
  let parsed: Record<string, unknown> | null = null;
  try {
    parsed = JSON.parse(content) as Record<string, unknown>;
  } catch {
    return content.length > limit ? `${content.substring(0, limit)}\u2026` : content;
  }
  const text = extractText(parsed);
  return text.length > limit ? `${text.substring(0, limit)}\u2026` : text;
}

function extractText(node: unknown): string {
  if (!node || typeof node !== 'object') return '';
  const n = node as { type?: string; text?: string; content?: unknown[] };
  if (n.type === 'text' && typeof n.text === 'string') return n.text;
  if (Array.isArray(n.content)) return n.content.map(extractText).join('');
  return '';
}

export default function InsightsPreview() {
  const blogs = useQuery(api.blogs.get) as Blog[] | undefined;

  const latest = (blogs ?? []).slice(0, 3);

  if (blogs !== undefined && latest.length === 0) {
    return null;
  }

  return (
    <div className={styles.previewGrid}>
      {latest.map((blog) => (
        <article key={blog._id} className={styles.previewCard}>
          {blog.imageUrl ? (
            <Link href={`/insights/${blog._id}`} className={styles.previewImageWrap}>
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className={styles.previewImage}
              />
            </Link>
          ) : (
            <Link href={`/insights/${blog._id}`} className={styles.previewImageWrap}>
              <div className={styles.previewImagePlaceholder} />
            </Link>
          )}
          <div className={styles.previewBody}>
            <div className={styles.previewMeta}>
              <span className={styles.previewCategory}>Insights</span>
              <span className={styles.previewDate}>
                {new Date(blog.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <h3 className={styles.previewTitle}>
              <Link href={`/insights/${blog._id}`}>{blog.title}</Link>
            </h3>
            <p className={styles.previewExcerpt}>{excerptFrom(blog.content)}</p>
            <Link href={`/insights/${blog._id}`} className={styles.previewReadMore}>
              Read More &rarr;
            </Link>
          </div>
        </article>
      ))}

      {blogs === undefined &&
        [0, 1, 2].map((i) => (
          <article key={i} className={styles.previewCard}>
            <div className={styles.previewImageWrap}>
              <div className={styles.previewSkeleton} />
            </div>
            <div className={styles.previewBody}>
              <div className={styles.previewSkeletonLine} style={{ width: '40%' }} />
              <div className={styles.previewSkeletonLine} style={{ width: '90%', height: '1.5rem' }} />
              <div className={styles.previewSkeletonLine} style={{ width: '70%' }} />
            </div>
          </article>
        ))}
    </div>
  );
}