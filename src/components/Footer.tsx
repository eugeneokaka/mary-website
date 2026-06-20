import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.column}>
          <h3 className={styles.brand}>Oasis Wellness Consultancy</h3>
          <p className={styles.description}>
            Evidence-Based Wellness Solutions for Modern Organizations. Helping you communicate health information effectively.
          </p>
        </div>
        
        <div className={styles.column}>
          <h4 className={styles.title}>Quick Links</h4>
          <nav className={styles.nav}>
            <Link href="/" className={styles.link}>Home</Link>
            <Link href="/about" className={styles.link}>About</Link>
            <Link href="/services" className={styles.link}>Services</Link>
            <Link href="/insights" className={styles.link}>Insights</Link>
            <Link href="/contact" className={styles.link}>Contact</Link>
          </nav>
        </div>

        <div className={styles.column}>
          <h4 className={styles.title}>Contact Us</h4>
          <p className={styles.contactItem}>maryathat@gmail.com</p>
          <p className={styles.contactItem}>+254 721 427 803</p>
          <div className={styles.social}>
            <a href="https://www.linkedin.com/in/mary-adhiambo/" className={styles.socialLink} aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      <div className={styles.bottom}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Oasis Wellness Consultancy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
