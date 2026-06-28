"use client";

import React, { use, useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./BlogDetail.module.css";

export default function BlogDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const blogId = resolvedParams.id as Id<"blogs">;
  
  const blog = useQuery(api.blogs.getById, { blogId });
  const removeBlog = useMutation(api.blogs.remove);
  const router = useRouter();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Check if the user has the auth cookie
    setIsLoggedIn(document.cookie.includes("blog_jwt="));
  }, []);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this blog? This action cannot be undone.")) return;
    
    setIsDeleting(true);
    try {
      const token = document.cookie.split("; ").find(row => row.startsWith("blog_jwt="))?.split("=")[1];
      if (!token) throw new Error("Not authenticated");
      
      await removeBlog({ token, blogId });
      router.push("/insights");
    } catch (err: any) {
      alert(err.message || "Failed to delete blog");
      setIsDeleting(false);
    }
  };

  if (blog === undefined) {
    return (
      <div className={styles.pageContainer}>
        <div className="container" style={{ textAlign: 'center', padding: '5rem' }}>
          Loading article...
        </div>
      </div>
    );
  }

  if (blog === null) {
    return (
      <div className={styles.pageContainer}>
        <div className="container" style={{ textAlign: 'center', padding: '5rem' }}>
          <h1>Blog not found</h1>
          <Link href="/insights" className={styles.backLink}>&larr; Back to Insights</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={`container ${styles.blogContainer}`}>
        <div className={styles.actionRow}>
          <Link href="/insights" className={styles.backLink} style={{ marginBottom: 0 }}>
            &larr; Back to all Insights
          </Link>
          
          {isLoggedIn && (
            <button 
              onClick={handleDelete} 
              className={styles.deleteButton}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Blog"}
            </button>
          )}
        </div>
        
        <div className={styles.header}>
          <h1 className={styles.title}>{blog.title}</h1>
          <div className={styles.meta}>
            Published on {new Date(blog.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {blog.imageUrl && (
          <div className={styles.imageWrapper}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={blog.imageUrl} alt={blog.title} className={styles.image} />
          </div>
        )}

        <div className={styles.content}>
          {blog.content}
        </div>
      </div>
    </div>
  );
}
