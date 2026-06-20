import React from 'react';
import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import styles from './Contact.module.css';

export const metadata: Metadata = {
  title: 'Contact Us | Oasis Wellness Consultancy',
  description: 'Book a consultation with Oasis Wellness Consultancy. Get in touch for health communication and corporate wellness training.',
};

export default function Contact() {
  return (
    <div className={styles.contactPage}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>Contact Us</h1>
          <p className={styles.subtitle}>
            Ready to communicate wellness with credibility? Let&apos;s talk about how we can support your organization.
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.infoCol}>
            <h2>Get in Touch</h2>
            <p>
              Whether you are looking for strategic health communication or corporate wellness training, we are here to help.
            </p>
            
            <div className={styles.contactDetails}>
              <div className={styles.detailItem}>
                <h3>Email</h3>
                <p>maryathat@gmail.com</p>
              </div>
              <div className={styles.detailItem}>
                <h3>Phone</h3>
                <p>+254 721 427 803</p>
              </div>
              <div className={styles.detailItem}>
                <h3>Connect</h3>
                <div className={styles.socialLinks}>
                  <a href="https://www.linkedin.com/in/mary-adhiambo/" aria-label="LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--color-primary)' }}>
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.formCol}>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
