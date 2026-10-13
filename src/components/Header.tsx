"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { authClient } from '@/lib/auth-client';
import styles from './Header.module.css';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Only show the dashboard links once an authorised user is signed in.
  const viewer = useQuery(api.auth.viewer);
  const isLoggedIn = !!viewer?.authorized;
  const router = useRouter();

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    await authClient.signOut();
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
