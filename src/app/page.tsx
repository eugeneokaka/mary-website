import React from 'react';
import Image from 'next/image';
import Button from '@/components/Button';
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={styles.homeWrapper}>
      <section className={styles.hero}>
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Evidence Based Wellness Solutions for Modern Organizations</h1>
            <p className={styles.heroSubtitle}>
              Helping health brands, corporates, and schools communicate wellness with credibility, clarity, and impact.
            </p>
            <div className={styles.heroActions}>
              <Button href="/services" variant="primary">Our Services</Button>
              <Button href="/contact" variant="outline">Contact Us</Button>
            </div>
          </div>
          <div className={styles.heroImageWrapper}>
            <div className={styles.heroImageShape}></div>
            <Image 
              src="/ella-olsson-KPDbRyFOTnE-unsplash.jpg" 
              alt="Healthy vibrant wellness" 
              width={600} 
              height={600} 
              className={styles.heroImage}
              priority
            />
          </div>
        </div>
      </section>

      <section className={styles.intro}>
        <div className={`container ${styles.introContainer}`}>
          <div className={styles.introText}>
            <h2>Welcome to Oasis Wellness Consultancy</h2>
            <p>
              We transform complex health information into engaging, credible content that builds trust, authority, and audience engagement. With over 10 years of experience in nutrition and wellness, Oasis Wellness Consultancy combines scientific expertise with practical solutions that create meaningful impact.
            </p>
            <Button href="/about" variant="secondary">Meet the Founder</Button>
          </div>
        </div>
      </section>

      <section className={styles.services}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Our Core Services</h2>
            <p>Tailored solutions for your organization&apos;s unique needs.</p>
          </div>
          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard}>
              <div className={styles.serviceImageWrapper}>
                <Image 
                  src="/towfiqu-barbhuiya-G5w8OSzHDhI-unsplash.jpg"
                  alt="Social Media Management"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={styles.serviceImage}
                />
              </div>
              <div className={styles.serviceCardContent}>
                <h3>Health & Wellness Social Media Management</h3>
                <p>Strategic content development and social media management for health and wellness brands. We create credible, engaging content that educates audiences and strengthens brand trust.</p>
                <Button href="/services#social-media" variant="secondary">Learn More</Button>
              </div>
            </div>
            
            <div className={styles.serviceCard}>
              <div className={styles.serviceImageWrapper}>
                <Image 
                  src="/joseph-gonzalez-fdlZBWIP0aM-unsplash.jpg"
                  alt="Wellness Training"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={styles.serviceImage}
                />
              </div>
              <div className={styles.serviceCardContent}>
                <h3>Corporate & School Wellness Training</h3>
                <p>Interactive wellness education programs designed to improve health knowledge, productivity, and long-term wellbeing. Engaging sessions on healthy eating and lifestyle habits.</p>
                <Button href="/services#training" variant="secondary">Learn More</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className={styles.whyUs}>
        <div className="container">
          <h2 className={styles.whyUsTitle}>Why Work With Us?</h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>✓</div>
              <h4>10+ Years Expertise</h4>
              <p>Deep knowledge of nutrition and wellness science to back every claim.</p>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>✓</div>
              <h4>Evidence Based</h4>
              <p>Rooted in science, free from fads, and focused on practical solutions.</p>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>✓</div>
              <h4>Targeted Communication</h4>
              <p>We know how to translate complex science into engaging, clear messaging.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
