"use client";

import React from 'react';
import Link from 'next/link';
import styles from './Insights.module.css';
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function Insights() {
  const dynamicBlogs = useQuery(api.blogs.get);

  return (
    <div className={styles.insightsPage}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>Insights & Resources</h1>
          <p className={styles.subtitle}>
            Evidence-based perspectives on nutrition, wellness, and health communication.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Render dynamic blogs from Convex */}
          {dynamicBlogs && dynamicBlogs.map((blog) => (
            <article key={blog._id} className={styles.card}>
              {blog.imageUrl && (
                <div style={{ width: '100%', height: '200px', position: 'relative', marginBottom: '1.5rem', borderRadius: '4px', overflow: 'hidden' }}>
                  <img src={blog.imageUrl} alt={blog.title} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                </div>
              )}
              <div className={styles.cardHeader}>
                <span className={styles.category}>Community Blog</span>
                <span className={styles.date}>{new Date(blog.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <h2 className={styles.articleTitle}>{blog.title}</h2>
              <p className={styles.excerpt}>
                {blog.content.length > 150 ? `${blog.content.substring(0, 150)}...` : blog.content}
              </p>
              <Link href={`/insights/${blog._id}`} className={styles.readMore}>
                Read More &rarr;
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
