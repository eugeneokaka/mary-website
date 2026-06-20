import React from 'react';
import type { Metadata } from 'next';
import styles from './Services.module.css';

export const metadata: Metadata = {
  title: 'Our Services | Oasis Wellness Consultancy',
  description: 'Evidence-based Health & Wellness Social Media Management and Corporate & School Wellness Training services.',
};

export default function Services() {
  return (
    <div className={styles.servicesPage}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>Our Services</h1>
          <p className={styles.subtitle}>
            Transforming complex health information into engaging, credible content that builds trust and audience engagement.
          </p>
        </div>

        <div className={styles.serviceSection} id="social-media">
          <div className={styles.textContent}>
            <h2>1. Health & Wellness Social Media Management</h2>
            <p className={styles.lead}>
              Strategic content development and social media management for health and wellness brands.
            </p>
            
            <p>
              We work with clinics, healthcare professionals, supplement companies, and wellness brands to create credible, engaging content that educates audiences and strengthens brand trust. Our content is grounded in nutrition science while remaining practical and easy to understand.
            </p>

            <h3>Services Include:</h3>
            <ul className={styles.list}>
              <li>Social media strategy</li>
              <li>Content planning and content calendars</li>
              <li>Evidence-based health content creation</li>
              <li>Educational campaigns</li>
              <li>Brand messaging</li>
              <li>Audience engagement strategies</li>
              <li>Nutrition and wellness communication</li>
              <li>Thought leadership content</li>
            </ul>

            <h3>Ideal Clients:</h3>
            <div className={styles.tags}>
              <span className={styles.tag}>Clinics</span>
              <span className={styles.tag}>Hospitals</span>
              <span className={styles.tag}>Supplement companies</span>
              <span className={styles.tag}>Wellness brands</span>
              <span className={styles.tag}>Healthcare professionals</span>
              <span className={styles.tag}>Medical practices</span>
            </div>
            
            <div className={styles.highlightBox}>
              <strong>Key Message:</strong> We transform complex health information into engaging, credible content that builds trust, authority, and audience engagement.
            </div>
          </div>
        </div>

        <div className={`${styles.serviceSection} ${styles.altSection}`} id="training">
          <div className={styles.textContent}>
            <h2>2. Corporate & School Wellness Training</h2>
            <p className={styles.lead}>
              Interactive wellness education programs designed to improve health knowledge, productivity, and long-term wellbeing.
            </p>
            
            <p>
              We provide interactive wellness training for corporates, schools, and community groups on topics such as healthy eating, lifestyle habits, and disease prevention. Our sessions are evidence-based, engaging, and designed to help people make sustainable changes to their health and wellbeing.
            </p>

            <h3>Topics Include:</h3>
            <ul className={styles.list}>
              <li>Healthy eating habits</li>
              <li>Workplace wellness</li>
              <li>Lifestyle disease prevention</li>
              <li>Nutrition for productivity and performance</li>
              <li>Family and school nutrition</li>
              <li>Sustainable healthy living</li>
              <li>Healthy habits for children and adolescents</li>
            </ul>

            <h3>Delivery Formats:</h3>
            <ul className={styles.list}>
              <li>Corporate workshops</li>
              <li>School training programs</li>
              <li>Wellness seminars</li>
              <li>Keynote presentations</li>
              <li>Health awareness events</li>
              <li>Virtual and in-person sessions</li>
            </ul>
            
            <div className={styles.highlightBox}>
              <strong>Key Message:</strong> Evidence-based wellness education delivered in a practical, engaging, and actionable format.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
