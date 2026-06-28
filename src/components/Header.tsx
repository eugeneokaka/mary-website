"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Header.module.css';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    // Check for the auth cookie. It re-runs whenever the route changes (e.g. after login)
    const hasToken = document.cookie.includes("blog_jwt=");
    setIsLoggedIn(hasToken);
  }, [pathname]);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    document.cookie = "blog_jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
    router.push('/');
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.container}`}>
        <Link href="/" className={styles.logo} onClick={() => setIsMobileMenuOpen(false)}>
          Oasis Wellness Consultancy
        </Link>
        
        <button className={styles.hamburger} onClick={toggleMenu} aria-label="Toggle Menu">
          <span className={`${styles.bar} ${isMobileMenuOpen ? styles.bar1Open : ''}`}></span>
          <span className={`${styles.bar} ${isMobileMenuOpen ? styles.bar2Open : ''}`}></span>
          <span className={`${styles.bar} ${isMobileMenuOpen ? styles.bar3Open : ''}`}></span>
        </button>

        <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ''}`}>
          <Link href="/" className={styles.link} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link href="/about" className={styles.link} onClick={() => setIsMobileMenuOpen(false)}>About</Link>
          <Link href="/services" className={styles.link} onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
          <Link href="/insights" className={styles.link} onClick={() => setIsMobileMenuOpen(false)}>Insights</Link>
          {isLoggedIn && (
            <>
              <Link href="/dashboard" className={styles.link} onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
              <button className={`${styles.link} ${styles.logoutBtn}`} onClick={handleLogout}>Logout</button>
            </>
          )}
          <Link href="/contact" className={styles.link} onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
        </nav>
      </div>
    </header>
  );
}
