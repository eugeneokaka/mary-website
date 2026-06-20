"use client";

import React, { useState, useRef } from 'react';
import Button from '@/components/Button';
import styles from '@/app/contact/Contact.module.css';
import { sendEmail } from '@/app/actions/sendEmail';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);

    const result = await sendEmail(formData);

    if (result.error) {
      setStatus('error');
      setErrorMessage(result.error);
    } else {
      setStatus('success');
      formRef.current.reset();
    }
  };

  if (status === 'success') {
    return (
      <div className={styles.formCard} style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2>Thank You!</h2>
        <p style={{ margin: '1rem 0' }}>Your message has been sent successfully. We will get back to you soon.</p>
        <Button variant="primary" onClick={() => setStatus('idle')}>Send Another Message</Button>
      </div>
    );
  }

  return (
    <div className={styles.formCard}>
      <h2>Book a Consultation</h2>
      {status === 'error' && (
        <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fee' }}>
          {errorMessage}
        </div>
      )}
      <form className={styles.form} ref={formRef} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" name="name" placeholder="Jane Doe" className={styles.input} required />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" name="email" placeholder="jane@example.com" className={styles.input} required />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows={5} placeholder="Tell us about your needs..." className={styles.textarea} required></textarea>
        </div>
        
        <button type="submit" disabled={status === 'loading'} className={styles.submitBtn} style={{ padding: '0.85rem 2rem', fontSize: '1rem', fontWeight: 600, borderRadius: '9999px', cursor: status === 'loading' ? 'not-allowed' : 'pointer', border: 'none', backgroundColor: 'var(--color-accent)', color: 'var(--color-primary)', opacity: status === 'loading' ? 0.7 : 1 }}>
          {status === 'loading' ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}
