"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import styles from "./Login.module.css";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const login = useMutation(api.auth.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      if (!username || !password) {
        throw new Error("Please enter both username and password");
      }

      const result = await login({ username, password });
      
      if (result.success) {
        setSuccess(true);
        // Save the JWT token in a cookie so it can be automatically sent and validated 
        // across requests, including Next.js server components and middleware.
        document.cookie = `blog_jwt=${result.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        
        setTimeout(() => {
          router.push("/"); // Redirect to home (or later a dashboard)
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Log in to manage your blogs</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={isLoading || success}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <div className={styles.passwordInputWrapper}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isLoading || success}
              />
              <button
                type="button"
                className={styles.showPasswordButton}
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading || success}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && <div className={styles.errorMsg}>{error}</div>}
          {success && (
            <div className={styles.successMsg}>
              Logged in successfully! Redirecting...
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading || success}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
          
          <div className={styles.linkText}>
            Don&apos;t have an account? <Link href="/signup" className={styles.link}>Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
