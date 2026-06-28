"use client";

import React, { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import styles from "./Dashboard.module.css";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const createBlog = useMutation(api.blogs.create);
  const generateUploadUrl = useMutation(api.blogs.generateUploadUrl);
  const router = useRouter();

  useEffect(() => {
    // Basic check to see if the user has a token
    const token = document.cookie.split("; ").find(row => row.startsWith("blog_jwt="))?.split("=")[1];
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const token = document.cookie.split("; ").find(row => row.startsWith("blog_jwt="))?.split("=")[1];
      if (!token) {
        throw new Error("You must be logged in to post a blog");
      }

      let imageId = undefined;

      // 2-Step Image Upload Process for Convex
      if (image) {
        const postUrl = await generateUploadUrl();
        const uploadResult = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if (!uploadResult.ok) {
          throw new Error("Failed to upload image");
        }

        const { storageId } = await uploadResult.json();
        imageId = storageId;
      }

      await createBlog({ token, title, content, imageId });
      
      setMessage("Blog created successfully! It is now live on the Insights page.");
      setTitle("");
      setContent("");
      setImage(null);
      
    } catch (err: any) {
      setError(err.message || "Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.title}>Author Dashboard</h1>
      <div className={styles.formCard}>
        <h2>Publish a New Blog</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="title">Blog Title</label>
            <input 
              id="title"
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., The Future of Workplace Wellness"
              required
              disabled={loading}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="image">Cover Image (Optional)</label>
            <input 
              id="image"
              type="file"
              accept="image/*"
              className={styles.input}
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              disabled={loading}
              style={{ padding: "0.5rem" }} // Tweak for file inputs
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="content">Content</label>
            <textarea 
              id="content"
              className={styles.textarea}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your insightful content here..."
              required
              disabled={loading}
            />
          </div>
          
          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? "Publishing..." : "Publish Blog"}
          </button>

          {error && <p className={styles.error}>{error}</p>}
          {message && <p className={styles.message}>{message}</p>}
        </form>
      </div>
    </div>
  );
}
