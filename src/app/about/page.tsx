import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import styles from './About.module.css';

export const metadata: Metadata = {
  title: 'About the Founder | Mary Adhiambo',
  description: 'Meet Mary Adhiambo, a Nutritionist and Wellness Consultant with over 10 years of experience helping organizations share accurate, engaging health information.',
};

export default function About() {
  return (
    <div className={styles.aboutPage}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>Meet the Founder</h1>
          <p className={styles.subtitle}>Mary Adhiambo, Registered Dietician (RD) & Wellness Consultant</p>
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.imageCol}>
            <div className={styles.imageWrapper}>
              <Image 
                src="/Mary.jpeg" 
                alt="Mary Adhiambo, Founder" 
                width={400} 
                height={500} 
                className={styles.founderImage} 
                priority
              />
            </div>
            
            <div className={styles.credentialsBox}>
              <h3>Credentials</h3>
              <ul className={styles.credentialsList}>
                <li>Bachelor&apos;s Degree in Nutrition, Kenyatta University (Top of Class)</li>
                <li>Licensed by the Kenya Nutritionists and Dieticians Institute (KNDI)</li>
                <li>10+ years of experience in nutrition, wellness education, and health communication</li>
              </ul>
            </div>
          </div>
          
          <div className={styles.textCol}>
            <h2>Separating Nutrition Facts from Fiction</h2>
            <p>
              I&apos;m Mary, a Nutritionist and Wellness Consultant with over 10 years of experience helping people separate nutrition facts from nutrition fiction.
            </p>
            <p>
              After graduating top of my class with a Bachelor&apos;s Degree in Nutrition from Kenyatta University and becoming licensed by the Kenya Nutritionists and Dieticians Institute (KNDI), I spent years working with clients and patients. One thing became clear: people are surrounded by health advice, but not all of it is good advice. Between social media gurus, miracle cures, and the latest &quot;life-changing&quot; diet trends, it&apos;s easy to see why so many people are confused.
            </p>
            <p>
              <strong>That&apos;s why I founded Oasis Wellness Consultancy.</strong>
            </p>
            <p>
              My mission is simple: to help organizations share health and wellness information that is accurate, engaging, and actually useful. No fear-mongering. No fad diets. No detox teas promising enlightenment.
            </p>
            <p>
              Through health communication, social media strategy, and wellness training, I help brands, schools, and corporates educate their audiences in ways that build trust, inspire action, and create real value.
            </p>
            
            <h3 className={styles.sectionTitle}>My Philosophy</h3>
            <p>I believe health information should be:</p>
            <ul className={styles.philosophyList}>
              <li><strong>Science-based</strong>, not trend-based.</li>
              <li><strong>Practical</strong>, not overwhelming.</li>
              <li><strong>Engaging</strong>, not boring.</li>
              <li><strong>Honest</strong>, even when the answer isn&apos;t &quot;drink this miracle smoothie.&quot;</li>
            </ul>
            <p>
              Because when people receive credible information in a way they can understand, they&apos;re far more likely to make healthier choices—and keep making them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
