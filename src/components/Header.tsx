"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
          <Link href="/contact" className={styles.link} onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
        </nav>
      </div>
    </header>
  );
}
