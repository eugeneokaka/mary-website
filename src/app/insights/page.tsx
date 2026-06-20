import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './Insights.module.css';

export const metadata: Metadata = {
  title: 'Insights & Blog | Oasis Wellness Consultancy',
  description: 'Articles and insights on nutrition science, workplace wellness, school nutrition, health communication, lifestyle medicine, and wellness trends.',
};

export default function Insights() {
  const articles = [
    {
      title: 'The Role of Nutrition Science in Workplace Productivity',
      category: 'Workplace Wellness',
      date: 'June 2026',
      excerpt: 'Discover how evidence-based nutritional strategies can enhance focus, reduce absenteeism, and boost overall team performance.',
    },
    {
      title: 'Effective Health Communication: Building Trust with Your Audience',
      category: 'Health Communication',
      date: 'May 2026',
      excerpt: 'Learn why scientific accuracy combined with relatable messaging is the key to successful health marketing campaigns.',
    },
    {
      title: 'School Nutrition Programs That Actually Work',
      category: 'School Nutrition',
      date: 'April 2026',
      excerpt: 'A deep dive into creating sustainable, appealing, and nutritious meal programs for educational institutions.',
    },
    {
      title: 'Separating Fact from Fiction: Lifestyle Medicine Trends',
      category: 'Lifestyle Medicine',
      date: 'March 2026',
      excerpt: 'An analysis of current wellness trends—what the science supports and what is just another fad.',
    }
  ];

  return (
    <div className={styles.insightsPage}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>Insights & Resources</h1>
          <p className={styles.subtitle}>
            Evidence-based perspectives on nutrition, wellness, and health communication.
          </p>
        </div>

        <div className={styles.grid}>
          {articles.map((article, index) => (
            <article key={index} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.category}>{article.category}</span>
                <span className={styles.date}>{article.date}</span>
              </div>
              <h2 className={styles.articleTitle}>{article.title}</h2>
              <p className={styles.excerpt}>{article.excerpt}</p>
              <Link href="#" className={styles.readMore}>
                Read Article &rarr;
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
