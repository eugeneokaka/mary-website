import React from 'react';
import Image from 'next/image';
import type { Metadata } from 'next';
import Button from '@/components/Button';
import styles from './Services.module.css';

export const metadata: Metadata = {
  title: 'Our Services | Oasis Wellness Consultancy',
  description:
    'Credibility-first health communication, school nutrition & wellness, and corporate wellness workshops from Oasis Wellness Consultancy.',
};

export default function Services() {
  return (
    <div className={styles.servicesPage}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>Our Services</h1>
          <p className={styles.subtitle}>
             Helping you communicate health information effectively.
          </p>
        </div>

        <div className={`container ${styles.serviceNav}`}>
          <a href="#health-communication" className={styles.serviceNavLink}>
            <span className={styles.serviceNavNumber}>01</span>
            <span className={styles.serviceNavTitle}>Health Communication</span>
            <span className={styles.serviceNavDesc}>
              Credibility-first content &amp; social media for health brands
            </span>
          </a>
          <a href="#school-nutrition" className={styles.serviceNavLink}>
            <span className={styles.serviceNavNumber}>02</span>
            <span className={styles.serviceNavTitle}>School Nutrition &amp; Wellness</span>
            <span className={styles.serviceNavDesc}>
              Evidence-based nutrition solutions for healthier learning environments
            </span>
          </a>
          <a href="#corporate-wellness" className={styles.serviceNavLink}>
            <span className={styles.serviceNavNumber}>03</span>
            <span className={styles.serviceNavTitle}>Corporate Wellness Workshops</span>
            <span className={styles.serviceNavDesc}>
              Performance workshops helping teams feel &amp; work better
            </span>
          </a>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SERVICE 1 Health Communication                          */}
      {/* ========================================================= */}
      <section className={styles.serviceBlock} id="health-communication">
        <div className={`container ${styles.serviceIntro}`}>
          <div className={styles.serviceIntroContent}>
            <span className={styles.eyebrow}>Oasis Wellness Consultancy</span>
            <h2>
              Credibility-First Health Communication for Brands That Can’t Afford to
              Get It Wrong
            </h2>
            <p className={styles.lead}>
              We help health brands and organizations communicate on social media with
              clarity, credibility, and confidence.
            </p>
            <p>
              Today, anyone can post health advice online. As misinformation grows,
              health-conscious consumers have become more discerning about who they
              trust. The conversation is shifting away from influencers and toward
              qualified experts.
            </p>
            <p>
              For health brands, credibility is no longer a nice to have. It’s your
              greatest competitive advantage. That’s where we come in. We create
              expert led, ethical health communication that builds trust, strengthens
              your reputation, and helps your audience make informed decisions.
            </p>
            <p className={styles.closingLine}>
              Because in healthcare, credibility isn’t optional. It’s your most
              valuable asset.
            </p>
            <Button href="/contact" variant="primary">Book a Discovery Call</Button>
          </div>
          <div className={styles.serviceIntroImage}>
            <Image
              src="/socila-media.jpg"
              alt="Health professional communicating wellness content on mobile"
              width={600}
              height={700}
              priority
              className={styles.introImg}
            />
          </div>
        </div>

        <div className={`container ${styles.subBlock}`}>
          <h3 className={styles.subHeading}>Health Communication Is Different</h3>
          <p>
            Healthcare isn’t like fashion, technology, or retail. Every piece of
            communication has the power to influence health decisions, shape public
            perception, and build (or damage) trust.
          </p>
          <p>Yet many health brands struggle with:</p>
          <div className={styles.challengeGrid}>
            <span className={styles.challengeItem}>Inconsistent messaging</span>
            <span className={styles.challengeItem}>Generic social media content</span>
            <span className={styles.challengeItem}>Poor audience engagement</span>
            <span className={styles.challengeItem}>Difficulty explaining complex health topics</span>
            <span className={styles.challengeItem}>Limited time to create educational content</span>
            <span className={styles.challengeItem}>Concerns about inaccurate or misleading health claims</span>
          </div>
          <div className={styles.approachBox}>
            <p>
              At Oasis Wellness Consultancy, we bridge the gap between scientific
              expertise and effective communication. Our approach combines health
              expertise with strategic marketing to help organisations educate their
              audiences while protecting the credibility they’ve worked hard to build.
            </p>
          </div>
        </div>

        <div className={`container ${styles.subServicesHeader}`}>
          <h3>Our Services</h3>
          <p className={styles.subServicesSub}>Four ways we help you communicate with credibility.</p>
        </div>

        <div className={`container ${styles.subServicesGrid}`}>
          <article className={styles.subServiceCard}>
            <h4>Strategic Health Communication</h4>
            <p>
              We develop communication strategies that align your expertise with your
              business goals.
            </p>
            <ul className={styles.cardList}>
              <li>Brand messaging</li>
              <li>Communication strategy</li>
              <li>Audience profiling</li>
              <li>Content pillars</li>
              <li>Campaign planning</li>
              <li>Thought leadership strategy</li>
            </ul>
          </article>

          <article className={styles.subServiceCard}>
            <h4>Credibility-First Social Media Strategy</h4>
            <p>Purposeful social media built on education, not trends.</p>
            <ul className={styles.cardList}>
              <li>Monthly content strategy</li>
              <li>Educational content calendars</li>
              <li>Instagram strategy</li>
              <li>LinkedIn strategy</li>
              <li>Evidence-based captions</li>
              <li>Patient &amp; consumer education</li>
              <li>Performance reviews</li>
            </ul>
          </article>

          <article className={styles.subServiceCard}>
            <h4>Content Creation</h4>
            <p>
              Professional content that makes complex health information accessible and
              engaging.
            </p>
            <ul className={styles.cardList}>
              <li>Educational social media posts</li>
              <li>Carousel copy</li>
              <li>Blog articles</li>
              <li>Website copy</li>
              <li>Email newsletters</li>
              <li>Patient education resources</li>
              <li>Myth-busting campaigns</li>
              <li>Awareness campaigns</li>
            </ul>
          </article>

          <article className={styles.subServiceCard}>
            <h4>Health Communication Consulting</h4>
            <p>
              Project-based communication support for organisations delivering health
              programmes and public facing initiatives.
            </p>
            <div className={styles.idealFor}>
              <span>Ideal for:</span>
              <div className={styles.tags}>
                <span className={styles.tag}>NGOs</span>
                <span className={styles.tag}>Hospitals</span>
                <span className={styles.tag}>Schools</span>
                <span className={styles.tag}>Corporate wellness</span>
                <span className={styles.tag}>Public health campaigns</span>
                <span className={styles.tag}>Development partners</span>
              </div>
            </div>
            <ul className={styles.cardList}>
              <li>Behaviour Change Communication (BCC)</li>
              <li>Campaign messaging</li>
              <li>Community education materials</li>
              <li>Technical content translation</li>
              <li>Health promotion resources</li>
            </ul>
          </article>
        </div>

        <div className={`container ${styles.serviceCTA}`}>
          <h3>Let’s Build Trust Together</h3>
          <p>
            Whether you’re launching a wellness brand, growing a healthcare
            organisation, or leading a public health campaign, we’re here to help you
            communicate with clarity and confidence. Let’s create communication that
            informs, inspires, and earns trust.
          </p>
          <Button href="/contact" variant="primary">Book a Discovery Call</Button>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SERVICE 2 School Nutrition & Wellness        */}
      {/* ========================================================= */}
      <section className={`${styles.serviceBlock} ${styles.blockAlt}`} id="school-nutrition">

        <div className={`container ${styles.serviceIntro} ${styles.introReversed}`}>
          <div className={styles.serviceIntroContent}>
            <span className={styles.eyebrow}>School Nutrition &amp; Wellness</span>
            <h2>Creating Healthier Learning Environments</h2>
            <p className={styles.lead}>
              At Oasis Wellness Consultancy, we partner with schools in Nairobi to create healthier
              learning environments through expert, evidence-based nutrition solutions.
            </p>
            <p>
              Our founder, a clinical nutritionist, recognized that many of our lifelong
              eating habits, both healthy and unhealthy, are established during
              childhood and adolescence. These formative years shape our relationship
              with food long before we reach adulthood.
            </p>
            <p>
              That insight inspired the development of our School Nutrition Program: a
              proactive approach designed to help students build healthy eating habits
              early, reducing the risk of preventable nutrition related challenges later
              in life. By equipping schools with practical, evidence-based nutrition
              strategies, we help nurture healthier students, support academic
              performance, and create lifelong habits that extend well beyond the
              classroom.
            </p>
          </div>
          <div className={styles.serviceIntroImage}>
            <Image
              src="/children-studying.jpg"
              alt="Children studying in a healthy learning environment"
              width={600}
              height={700}
              className={styles.introImg}
            />
          </div>
        </div>

        <div className={`container ${styles.subServicesHeader}`}>
          <h3>Our Services</h3>
          <p className={styles.subServicesSub}>
            Evidence-based nutrition support tailored to your school.
          </p>
        </div>

        <div className={`container ${styles.subServicesGrid}`}>
          <article className={styles.subServiceCard}>
            <h4>Menu Review &amp; Recommendations</h4>
            <p>
              Healthy eating begins with a well-planned menu. We review school meal
              programmes to ensure they provide balanced, nutritious, and
              age appropriate meals that support students’ growth, learning, and
              wellbeing.
            </p>
            <ul className={styles.cardList}>
              <li>Nutritional assessment of school menus</li>
              <li>Recommendations for balanced, child-friendly meals</li>
              <li>Guidance on portion sizes</li>
              <li>Suggestions to reduce excess sugar, salt &amp; unhealthy fats</li>
              <li>Practical recommendations tailored to your budget &amp; operations</li>
            </ul>
          </article>

          <article className={styles.subServiceCard}>
            <h4>Special Dietary Support</h4>
            <p>
              Every child deserves to feel safe and included at mealtimes. We provide
              professional nutrition support for students with allergies,
              intolerances, and other medically prescribed dietary needs.
            </p>
            <ul className={styles.cardList}>
              <li>Individual dietary guidance</li>
              <li>Nutrition care plans</li>
              <li>Safe meal recommendations</li>
              <li>Kitchen guidance on allergen management</li>
              <li>Parent &amp; school collaboration</li>
            </ul>
          </article>

          <article className={styles.subServiceCard}>
            <h4>Student Nutrition Education</h4>
            <p>
              Healthy habits are built through education. Our engaging, age appropriate
              workshops equip students with the knowledge and confidence to make
              healthier food choices in and out of the classroom.
            </p>
            <p className={styles.listLabel}>Topics may include:</p>
            <ul className={styles.cardList}>
              <li>Building a balanced plate</li>
              <li>Healthy snacks</li>
              <li>Hydration</li>
              <li>Understanding sugar</li>
              <li>Food hygiene</li>
              <li>Nutrition for learning &amp; sports</li>
            </ul>
          </article>

          <article className={styles.subServiceCard}>
            <h4>Student Wellness Check-Ups</h4>
            <p>
              Regular wellness assessments help schools monitor students’ growth and
              identify nutrition related concerns early.
            </p>
            <p className={styles.listLabel}>Our quarterly check-ups may include:</p>
            <ul className={styles.cardList}>
              <li>Growth monitoring</li>
              <li>Nutrition screening</li>
              <li>Individual feedback where appropriate</li>
              <li>Practical recommendations for parents</li>
              <li>Referral guidance when needed</li>
            </ul>
          </article>

          <article className={styles.subServiceCard}>
            <h4>Parent Education Sessions</h4>
            <p>
              Healthy habits begin at home. Our interactive parent workshops provide
              practical, evidence-based guidance to help families make confident
              nutrition decisions that support children’s growth, wellbeing, and
              academic success.
            </p>
            <p className={styles.listLabel}>Popular topics include:</p>
            <ul className={styles.cardList}>
              <li>Healthy lunchboxes</li>
              <li>Managing picky eating</li>
              <li>Healthy snacking</li>
              <li>Reducing sugar</li>
              <li>Nutrition for learning &amp; concentration</li>
              <li>Building lifelong healthy eating habits</li>
            </ul>
          </article>
        </div>

        <div className={`container ${styles.serviceCTA}`}>
          <h3>Let’s Start the Conversation</h3>
          <p>
            Whether you’re looking to enhance your school meal programme, support
            students with special dietary needs, or strengthen your school’s wellbeing
            initiatives, we’d love to partner with you. Contact Oasis Wellness
            Consultancy today to discuss how we can support your school’s nutrition and
            wellness.
          </p>
          <Button href="/contact" variant="primary">Contact Us</Button>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SERVICE 3 Corporate Wellness & Performance Workshops    */}
      {/* ========================================================= */}
      <section className={styles.serviceBlock} id="corporate-wellness">
        <div className={`container ${styles.serviceIntro}`}>
          <div className={styles.serviceIntroContent}>
            <span className={styles.eyebrow}>Oasis Wellness Consultancy</span>
            <h2>Corporate Wellness &amp; Performance Workshops</h2>
            <p className={styles.lead}>
              Helping Teams Feel Better, Think Better and Perform Better
            </p>
            <p>
              At Oasis Wellness Consultancy, we believe that healthy employees are
              productive employees. Our evidence-based workshops equip teams with
              practical nutrition and wellness strategies that improve energy, focus,
              resilience and overall wellbeing.
            </p>
          </div>
          <div className={styles.serviceIntroImage}>
            <Image
              src="/people-in-meeting.jpg"
              alt="Corporate team in a wellness workshop meeting"
              width={600}
              height={700}
              className={styles.introImg}
            />
          </div>
        </div>

        <div className={`container ${styles.subServicesHeader}`}>
          <h3>Our Signature Workshops</h3>
          <p className={styles.subServicesSub}>
            Practical, evidence-based sessions your team can apply immediately.
          </p>
        </div>

        <div className={`container ${styles.subServicesGrid}`}>
          <article className={styles.workshopCard}>
            <h4>The 3PM Slump: Eating for Energy, Focus &amp; Productivity</h4>
            <p>Participants will learn:</p>
            <ul className={styles.cardList}>
              <li>Why energy crashes happen</li>
              <li>Foods that improve concentration</li>
              <li>Balanced meals</li>
              <li>Healthy snacks</li>
              <li>Smart caffeine &amp; hydration</li>
            </ul>
            <div className={styles.workshopMeta}>
              <span><strong>Ideal for:</strong> Corporate offices, Banks, NGOs, Tech, Call centres</span>
              <span><strong>Duration:</strong> 60–90 minutes</span>
            </div>
          </article>

          <article className={styles.workshopCard}>
            <h4>Zoom Fatigue Is Real: Wellness for the Hybrid Workforce</h4>
            <p>Participants will learn:</p>
            <ul className={styles.cardList}>
              <li>Managing screen fatigue</li>
              <li>Healthy remote work routines</li>
              <li>Preventing strain</li>
              <li>Staying active</li>
              <li>Work-life boundaries</li>
            </ul>
            <div className={styles.workshopMeta}>
              <span><strong>Ideal for:</strong> Remote teams, Professional services, Tech</span>
              <span><strong>Duration:</strong> 60–90 minutes</span>
            </div>
          </article>

          <article className={styles.workshopCard}>
            <h4>Eat Well on a Busy Salary: Practical Nutrition for Busy Professionals</h4>
            <p>Participants will learn:</p>
            <ul className={styles.cardList}>
              <li>Budget-friendly nutrition</li>
              <li>Meal planning</li>
              <li>Affordable protein</li>
              <li>Smart shopping</li>
              <li>Healthy eating on busy weeks</li>
            </ul>
            <div className={styles.workshopMeta}>
              <span><strong>Ideal for:</strong> Manufacturing, Government, NGOs, SMEs</span>
              <span><strong>Duration:</strong> 60–90 minutes</span>
            </div>
          </article>

          <article className={styles.workshopCard}>
            <h4>Stress Less, Digest Better: Gut Health for Busy Professionals</h4>
            <p>Participants will learn:</p>
            <ul className={styles.cardList}>
              <li>Gut-brain connection</li>
              <li>Foods for digestive health</li>
              <li>Managing bloating &amp; reflux</li>
              <li>Healthy habits</li>
              <li>When to seek support</li>
            </ul>
            <div className={styles.workshopMeta}>
              <span><strong>Ideal for:</strong> Professional services, Insurance, Leadership</span>
              <span><strong>Duration:</strong> 75–90 minutes</span>
            </div>
          </article>

          <article className={styles.workshopCard}>
            <h4>Burnout to Balance: Sustainable Performance Without Exhaustion</h4>
            <p>Participants will learn:</p>
            <ul className={styles.cardList}>
              <li>Recognising burnout</li>
              <li>Nutrition &amp; sleep</li>
              <li>Recovery strategies</li>
              <li>Stress management</li>
              <li>Personal wellbeing plan</li>
            </ul>
            <div className={styles.workshopMeta}>
              <span><strong>Ideal for:</strong> Leadership, HR, High-performance workplaces</span>
              <span><strong>Duration:</strong> 90 minutes</span>
            </div>
          </article>
        </div>

        <div className={`container`} style={{ marginTop: '4rem' }}>
          <div className={styles.deliveryCard}>
            <h4>Delivery Options</h4>
            <p>In-person, Virtual and Hybrid.</p>
            <p>
              Includes interactive facilitation, digital workbook, Q&amp;A, action plan
              and customisation.
            </p>
          </div>
        </div>

        <div className={`container ${styles.serviceCTA}`}>
          <h3>Bring Wellness to Your Team</h3>
          <p>
            Ready to help your team feel better, think better, and perform better? Let’s
            design a workshop programme that fits your organisation.
          </p>
          <Button href="/contact" variant="primary">Book a Discovery Call</Button>
        </div>
      </section>
    </div>
  );
}