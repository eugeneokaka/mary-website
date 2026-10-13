"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useConvex } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import type { JSONContent } from "@tiptap/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import RichEditor from "@/components/RichEditor";
import styles from "./Dashboard.module.css";

export default function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editingId = searchParams.get("edit") as Id<"blogs"> | null;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState<JSONContent | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loadedEditId, setLoadedEditId] = useState<string | null>(null);

  const convex = useConvex();
  const createBlog = useMutation(api.blogs.create);
  const editBlog = useMutation(api.blogs.edit);
  const generateUploadUrl = useMutation(api.blogs.generateUploadUrl);

  // Who is signed in and whether they may manage content (server-verified).
  const viewer = useQuery(api.auth.viewer);

  // Authenticated list: only the current author's blogs, verified server-side.
  const allBlogs = useQuery(
    api.blogs.listMine,
    viewer?.authorized ? {} : "skip",
  ) as
    | {
        _id: Id<"blogs">;
        title: string;
        imageUrl: string | null;
        createdAt: number;
      }[]
    | undefined;
  const editingBlog = useQuery(
    api.blogs.getById,
    editingId ? { blogId: editingId } : "skip",
  ) as
    | {
        _id: Id<"blogs">;
        title: string;
        content: string;
        imageUrl: string | null;
        createdAt: number;
      }
    | undefined
    | null;

  // Redirect unauthenticated visitors to login, and unauthorised users home.
  useEffect(() => {
    if (viewer === null) {
      router.push("/login");
    } else if (viewer && !viewer.authorized) {
      router.push("/");
    }
  }, [viewer, router]);

  // Populate the form when the edit target changes / data arrives,
  // and reset it when leaving edit mode.
  if (editingId && editingBlog && editingId !== loadedEditId) {
    setLoadedEditId(editingId);
    setTitle(editingBlog.title);
    try {
      setContent(JSON.parse(editingBlog.content) as JSONContent);
    } catch {
      setContent({
        type: "doc",
        content: [{ type: "paragraph", content: [{ type: "text", text: editingBlog.content }] }],
      });
    }
    setExistingImageUrl(editingBlog.imageUrl);
    setImage(null);
    setMessage("");
    setError("");
  } else if (!editingId && loadedEditId !== null) {
    setLoadedEditId(null);
    setTitle("");
    setContent(null);
    setExistingImageUrl(null);
    setImage(null);
    setMessage("");
    setError("");
  }

  // Upload an image inserted inside the rich editor. Returns a public URL that
  // the editor embeds directly into the document.
  const handleEditorImageUpload = async (file: File): Promise<string> => {
    const postUrl = await generateUploadUrl();
    const res = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!res.ok) throw new Error("Failed to upload image");
    const { storageId } = await res.json();
    const url = (await convex.query(api.blogs.getStorageUrl, {
      storageId,
    })) as string | null;
    if (!url) throw new Error("Uploaded image could not be located");
    return url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      if (!content) throw new Error("Please add some content to your article");
      const contentJson = JSON.stringify(content);

      let imageId: Id<"_storage"> | undefined = undefined;

      if (image) {
        const postUrl = await generateUploadUrl();
        const uploadResult = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });
        if (!uploadResult.ok) throw new Error("Failed to upload image");
        const { storageId } = await uploadResult.json();
        imageId = storageId;
      }

      if (editingId) {
        await editBlog({ blogId: editingId, title, content: contentJson, imageId });
        setMessage("Article updated successfully!");
      } else {
        await createBlog({ title, content: contentJson, imageId });
        setMessage("Article published! It is now live on the Insights page.");
        setTitle("");
        setContent(null);
        setImage(null);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    router.push("/dashboard");
  };

  const sortedBlogs = useMemo(() => {
    if (!allBlogs) return [];
    return [...allBlogs].sort((a, b) => b.createdAt - a.createdAt);
  }, [allBlogs]);

  if (viewer === undefined || viewer === null || !viewer.authorized) {
    return <div className={styles.dashboardContainer} />;
  }

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.pageHeader}>
        <span className={styles.eyebrow}>Author Dashboard</span>
        <h1 className={styles.title}>
          {editingId ? "Edit Article" : "Publish a New Article"}
        </h1>
        <p className={styles.subtitle}>
          {editingId
            ? "Update the title, content, or cover image of this article."
            : "Write and format your article using the editor below."}
        </p>
      </header>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="title">
              Article Title
            </label>
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
            <label className={styles.label} htmlFor="image">
              Cover Image {editingId && !image ? "(replace)" : "(optional)"}
            </label>
            {editingId && existingImageUrl && !image && (
              <div className={styles.currentImage}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={existingImageUrl} alt="Current cover" />
                <span>Current cover</span>
              </div>
            )}
            <input
              id="image"
              type="file"
              accept="image/*"
              className={styles.fileInput}
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Content</label>
            <RichEditor
              value={content}
              onChange={(json) => setContent(json)}
              onImageUpload={handleEditorImageUpload}
              placeholder="Start writing your article. use the toolbar to format text, add headings, lists, links, and images."
            />
          </div>

          <div className={styles.actionsRow}>
            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading
                ? editingId
                  ? "Updating…"
                  : "Publishing…"
                : editingId
                  ? "Update Article"
                  : "Publish Article"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className={styles.cancelButton}
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>

          {error && <p className={styles.error}>{error}</p>}
          {message && (
            <p className={styles.message}>
              {message}{" "}
              {editingId && (
                <Link href={`/insights/${editingId}`} className={styles.viewLink}>
                  View article &rarr;
                </Link>
              )}
            </p>
          )}
        </form>
      </div>

      {/* Existing posts management */}
      {!editingId && (
        <section className={styles.postsSection}>
          <h2 className={styles.postsHeading}>Your Published Articles</h2>
          {sortedBlogs.length === 0 ? (
            <p className={styles.postsEmpty}>
              You haven&apos;t published any articles yet. Use the form above to write your first one.
            </p>
          ) : (
            <ul className={styles.postsList}>
              {sortedBlogs.map((post) => (
                <li key={post._id} className={styles.postRow}>
                  <Link href={`/insights/${post._id}`} className={styles.postRowThumb}>
                    {post.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.imageUrl} alt={post.title} />
                    ) : (
                      <div className={styles.postRowPlaceholder} />
                    )}
                  </Link>
                  <div className={styles.postRowInfo}>
                    <Link href={`/insights/${post._id}`} className={styles.postRowTitle}>
                      {post.title}
                    </Link>
                    <span className={styles.postRowDate}>
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className={styles.postRowActions}>
                    <Link href={`/dashboard?edit=${post._id}`} className={styles.postRowEdit}>
                      Edit
                    </Link>
                    <Link href={`/insights/${post._id}`} className={styles.postRowView}>
                      View
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
