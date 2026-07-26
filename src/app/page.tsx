import React from 'react';
import Image from 'next/image';
import Button from '@/components/Button';
import InsightsPreview from '@/components/InsightsPreview';
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={styles.homeWrapper}>
      <section className={styles.hero}>
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Credibility-First Health Communication for Brands That Can’t Afford to Get It Wrong</h1>
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
              src="/hero.jpg" 
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
          <div className={styles.servicesGrid + ' ' + styles.servicesGridThree}>
            <div className={styles.serviceCard}>
              <div className={styles.serviceImageWrapper}>
                <Image
                  src="/socila-media.jpg"
                  alt="Health communication and social media management"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                  className={styles.serviceImage}
                />
              </div>
              <div className={styles.serviceCardContent}>
                <h3>Health Communication</h3>
                <p>Credibility-first content and social media strategy for health brands that can&apos;t afford to get it wrong.</p>
                <Button href="/services#health-communication" variant="secondary">Learn More</Button>
              </div>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceImageWrapper}>
                <Image
                  src="/children-studying.jpg"
                  alt="School nutrition and wellness program"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={styles.serviceImage}
                />
              </div>
              <div className={styles.serviceCardContent}>
                <h3>School Nutrition &amp; Wellness</h3>
                <p>Evidence-based nutrition solutions that create healthier learning environments.</p>
                <Button href="/services#school-nutrition" variant="secondary">Learn More</Button>
              </div>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceImageWrapper}>
                <Image
                  src="/people-in-meeting.jpg"
                  alt="Corporate wellness and performance workshop"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={styles.serviceImage}
                />
              </div>
              <div className={styles.serviceCardContent}>
                <h3>Corporate Wellness Workshops</h3>
                <p>Performance workshops that help teams feel better, think better, and perform better.</p>
                <Button href="/services#corporate-wellness" variant="secondary">Learn More</Button>
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

      {/* ============ Our Process ============ */}
      <section className={styles.process}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Our Process</h2>
            <p>A simple, proven approach to building credible health communication.</p>
          </div>
          <div className={styles.processSteps}>
            <div className={styles.processStep}>
              <div className={styles.processNumber}>01</div>
              <h3>Discover</h3>
              <p>We learn about your brand, audience, and goals to understand what credibility means for you.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.processNumber}>02</div>
              <h3>Strategize</h3>
              <p>We design a credibility-first communication plan aligned with your expertise and business objectives.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.processNumber}>03</div>
              <h3>Create</h3>
              <p>We craft evidence-based content that informs, engages, and earns the trust of your audience.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.processNumber}>04</div>
              <h3>Refine</h3>
              <p>We measure performance, gather feedback, and continuously improve to keep your message sharp.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Insights Preview ============ */}
      <section className={styles.insightsPreview}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Latest Insights</h2>
            <p>Evidence-based perspectives on nutrition, wellness, and health communication.</p>
          </div>
          <InsightsPreview />
          <div className={styles.insightsPreviewCTA}>
            <Button href="/insights" variant="outline">View All Insights</Button>
          </div>
        </div>
      </section>

      {/* ============ Final CTA ============ */}
      <section className={styles.finalCTA}>
        <div className="container">
          <div className={styles.finalCTAInner}>
            <h2>Let&apos;s Build Trust Together</h2>
            <p>
              Whatever your goal, launching a wellness brand, growing a healthcare
              organisation, or leading a public health campaign, we&apos;re here to help
              you communicate with clarity and confidence.
            </p>
            <Button href="/contact" variant="primary">Book a Discovery Call</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
