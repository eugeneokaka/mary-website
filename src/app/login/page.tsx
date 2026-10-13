"use client";

import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import styles from "./Login.module.css";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setIsLoading(true);

    try {
      if (!email) {
        throw new Error("Please enter your email address");
      }

      const { error: sendError } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });

      if (sendError) {
        if (sendError.status === 403) {
          // Not an authorised email — send them home quietly.
          router.push("/");
          return;
        }
        setError(sendError.message || "Could not send the code. Please try again.");
        return;
      }

      setStep("otp");
      setOtp("");
      setNotice(`We sent a 6-digit code to ${email}. It expires in 5 minutes.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!otp) {
        throw new Error("Please enter the code we emailed you");
      }

      const { error: verifyError } = await authClient.signIn.emailOtp({
        email,
        otp,
      });

      if (verifyError) {
        if (verifyError.status === 403) {
          router.push("/");
          return;
        }
        setError(verifyError.message || "That code is invalid or has expired");
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
      errorCallbackURL: "/",
    });
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to manage your blogs</p>

        {step === "email" ? (
          <form onSubmit={sendCode}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={isLoading}
              />
            </div>

            {error && <div className={styles.errorMsg}>{error}</div>}

            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? "Sending code..." : "Email me a code"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyCode}>
            {notice && <div className={styles.successMsg}>{notice}</div>}

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="otp">
                Verification code
              </label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                className={styles.input}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit code"
                disabled={isLoading}
              />
            </div>

            {error && <div className={styles.errorMsg}>{error}</div>}

            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? "Verifying..." : "Sign in"}
            </button>

            <div className={styles.linkText}>
              <button
                type="button"
                className={styles.link}
                style={{ background: "none", border: "none", cursor: "pointer" }}
                onClick={sendCode}
                disabled={isLoading}
              >
                Resend code
              </button>
              {" · "}
              <button
                type="button"
                className={styles.link}
                style={{ background: "none", border: "none", cursor: "pointer" }}
                onClick={() => {
                  setStep("email");
                  setOtp("");
                  setError("");
                  setNotice("");
                }}
                disabled={isLoading}
              >
                Change email
              </button>
            </div>
          </form>
        )}

        <button
          type="button"
          className={styles.submitButton}
          style={{ marginTop: "1rem", background: "#fff", color: "#111", border: "1px solid #ddd" }}
          onClick={handleGoogle}
          disabled={isLoading}
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
