import React, { JSX } from 'react';
import {
  Field,
  ImageField,
  RichText as ContentSdkRichText,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

type PromoProps = ComponentProps;

export const Default = (props: PromoProps): JSX.Element => {
  const routeFields = props.page?.layout?.sitecore?.route?.fields;

  if (!routeFields) {
    return <span>No content found</span>;
  }

  const title = routeFields['Title'] as Field<string>;
  const summary = routeFields['Summary'] as Field<string>;
  const mainContent = routeFields['Main Content'] as Field<string>;

  const productOrService = routeFields['Product Or Service'] as Field<string>;
  const industry = routeFields['Industry'] as Field<string>;
  const audience = routeFields['Audience'] as Field<string>;
  const region = routeFields['Region'] as Field<string>;
  const author = routeFields['Author'] as Field<string>;
  const lastReviewedDate = routeFields['Last Reviewed Date'] as Field<string>;

  const heroImage = routeFields['Hero Image'] as ImageField;

  return (
    <section
      className={`component promo ${props.params?.styles || ''}`}
      style={{
        fontFamily: 'Arial, sans-serif',
        background: '#fff',
      }}
    >
      {/* HERO */}

      <section
        style={{
          color: '#fff',
          padding: '100px 60px',
          backgroundImage: heroImage?.value?.src
            ? `linear-gradient(
                90deg,
                rgba(8,47,73,.82),
                rgba(15,118,110,.65),
                rgba(20,184,166,.45)
              ),
              url(${heroImage.value.src})`
            : 'linear-gradient(135deg,#0f766e,#14b8a6)',

          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: '8px 18px',
              background: 'rgba(255,255,255,.15)',
              borderRadius: '999px',
              marginBottom: 24,
            }}
          >
            {productOrService?.value}
          </div>

          <h1
            style={{
              fontSize: 'clamp(3rem,6vw,5rem)',
              margin: 0,
              maxWidth: '700px',
            }}
          >
            {title?.value}
          </h1>

          <p
            style={{
              fontSize: '1.25rem',
              maxWidth: '700px',
              lineHeight: 1.8,
              marginTop: 30,
            }}
          >
            {summary?.value}
          </p>

          <div
            style={{
              display: 'flex',
              gap: 18,
              marginTop: 42,
              flexWrap: 'wrap',
            }}
          >
            <button
              style={{
                background: '#fff',
                color: '#0f766e',
                border: 'none',
                padding: '16px 34px',
                borderRadius: 6,
                fontWeight: 700,
              }}
            >
              Apply Now
            </button>

            <button
              style={{
                background: 'transparent',
                color: '#fff',
                border: '2px solid rgba(255,255,255,.4)',
                padding: '16px 34px',
                borderRadius: 6,
              }}
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}

      <section
        style={{
          maxWidth: '900px',
          margin: '90px auto',
          padding: '0 32px',
          lineHeight: 1.9,
          color: '#334155',
          fontSize: '1.08rem',
        }}
      >
        <ContentSdkRichText field={mainContent} />
      </section>

      {/* OUR COMMITMENT */}

      <section
        style={{
          maxWidth: '1200px',
          margin: '100px auto',
          padding: '0 32px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '70px',
          alignItems: 'center',
        }}
      >
        <div>
          <img
            src="https://img.magnific.com/free-photo/front-view-happy-parents-with-kids-home_23-2150231655.jpg?semt=ais_hybrid&w=740&q=80"
            alt="Our Commitment"
            style={{
              width: '100%',
              height: '520px',
              objectFit: 'cover',
              borderRadius: '14px',
              boxShadow: '0 20px 45px rgba(0,0,0,.12)',
            }}
          />
        </div>

        <div>
          <div
            style={{
              color: '#14b8a6',
              fontWeight: 700,
              letterSpacing: '1px',
              marginBottom: 14,
            }}
          >
            OUR COMMITMENT
          </div>

          <h2
            style={{
              fontSize: '2.8rem',
              color: '#0f172a',
              marginTop: 0,
              marginBottom: '24px',
            }}
          >
            Helping people achieve financial confidence.
          </h2>

          <p
            style={{
              color: '#64748b',
              lineHeight: 1.9,
              fontSize: '1.05rem',
            }}
          >
            At NorthBank, we believe financial services should be simple,
            transparent, and tailored to your goals. Whether you're buying
            your first home, protecting your loved ones, or planning for the
            future, our team is committed to providing expert guidance and
            dependable support every step of the way.
          </p>

          <ul
            style={{
              marginTop: '30px',
              lineHeight: 2,
              color: '#334155',
              paddingLeft: '20px',
            }}
          >
            <li>Trusted financial expertise</li>
            <li>Personalized banking solutions</li>
            <li>Transparent pricing with no hidden surprises</li>
            <li>Secure digital experiences backed by modern technology</li>
          </ul>
        </div>
      </section>

      {/* WHY CHOOSE NORTHBANK */}

      <section
        style={{
          background: '#f8fafc',
          padding: '100px 32px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1.1fr .9fr',
            gap: '70px',
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                color: '#14b8a6',
                fontWeight: 700,
                letterSpacing: '1px',
                marginBottom: 14,
              }}
            >
              WHY NORTHBANK
            </div>

            <h2
              style={{
                fontSize: '2.6rem',
                color: '#0f172a',
                marginTop: 0,
                marginBottom: '20px',
              }}
            >
              Built around trust, innovation and exceptional service.
            </h2>

            <p
              style={{
                color: '#64748b',
                marginBottom: '40px',
                lineHeight: 1.8,
              }}
            >
              We combine modern digital banking with experienced financial
              professionals to deliver products that help individuals and
              businesses reach their goals.
            </p>

            <div
              style={{
                display: 'grid',
                gap: '22px',
              }}
            >
              <FeatureCard
                title="Fast Processing"
                text="Quick approvals and streamlined applications from start to finish."
              />

              <FeatureCard
                title="Competitive Rates"
                text="Transparent pricing designed to provide long-term value."
              />

              <FeatureCard
                title="Trusted Support"
                text="Dedicated specialists ready to help whenever you need assistance."
              />
            </div>
          </div>

          <div>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIZMyY8fwqpfDvIy4JHiARbJQ3h-Oy17j49QjkOlc6h30y0kHnkhQR__qy&s=10"
              alt="Why Choose NorthBank"
              style={{
                width: '100%',
                height: '680px',
                objectFit: 'cover',
                borderRadius: '14px',
                boxShadow: '0 20px 45px rgba(0,0,0,.12)',
              }}
            />
          </div>
        </div>
      </section>
            {/* FINANCIAL STRENGTH */}

      <section
        style={{
          maxWidth: '1200px',
          margin: '100px auto',
          padding: '0 32px',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: '60px',
          }}
        >
          <div
            style={{
              color: '#14b8a6',
              fontWeight: 700,
              letterSpacing: '1px',
              marginBottom: '14px',
            }}
          >
            OUR IMPACT
          </div>

          <h2
            style={{
              fontSize: '2.6rem',
              color: '#0f172a',
              marginTop: 0,
            }}
          >
            Trusted by customers across the country
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
            gap: '30px',
          }}
        >
          <StatCard number="1M+" label="Customers Served" />
          <StatCard number="25+" label="Years of Experience" />
          <StatCard number="99%" label="Customer Satisfaction" />
          <StatCard number="24/7" label="Support Available" />
        </div>
      </section>

      {/* PRODUCT OVERVIEW */}

      <section
        style={{
          background: '#f8fafc',
          padding: '100px 32px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          <h2
            style={{
              textAlign: 'center',
              fontSize: '2.5rem',
              color: '#0f172a',
              marginBottom: '55px',
            }}
          >
            Product Overview
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
              gap: '22px',
            }}
          >
            <Card
              label="Product"
              value={productOrService?.value as string}
            />

            <Card
              label="Industry"
              value={industry?.value as string}
            />

            <Card
              label="Audience"
              value={audience?.value as string}
            />

            <Card
              label="Region"
              value={region?.value as string}
            />
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}

      <section
        style={{
          maxWidth: '1200px',
          margin: '100px auto',
          padding: '0 32px',
          display: 'grid',
          gridTemplateColumns: '.9fr 1.1fr',
          gap: '70px',
          alignItems: 'center',
        }}
      >
        <div>
          <img
            src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80"
            alt="Customer Support"
            style={{
              width: '100%',
              height: '600px',
              objectFit: 'cover',
              borderRadius: '14px',
              boxShadow: '0 20px 45px rgba(0,0,0,.12)',
            }}
          />
        </div>

        <div>
          <div
            style={{
              color: '#14b8a6',
              fontWeight: 700,
              letterSpacing: '1px',
              marginBottom: '12px',
            }}
          >
            FAQ
          </div>

          <h2
            style={{
              fontSize: '2.5rem',
              color: '#0f172a',
              marginTop: 0,
            }}
          >
            Frequently Asked Questions
          </h2>

          <div
            style={{
              display: 'grid',
              gap: '18px',
              marginTop: '40px',
            }}
          >
            <FaqCard
              question="How long does the application process take?"
              answer="Most applications are reviewed quickly, although processing times may vary depending on the product."
            />

            <FaqCard
              question="Can I apply online?"
              answer="Yes. Our digital application process is available 24 hours a day for your convenience."
            />

            <FaqCard
              question="Is my personal information secure?"
              answer="Absolutely. We use modern security standards and encryption to help protect your information."
            />
          </div>
        </div>
      </section>

      {/* EDITORIAL */}

      <section
        style={{
          maxWidth: '1200px',
          margin: '0 auto 80px',
          padding: '0 32px',
        }}
      >
        <div
          style={{
            padding: '28px',
            border: '1px solid #e2e8f0',
            background: '#f8fafc',
            borderRadius: '10px',
            color: '#64748b',
          }}
        >
          <strong>Author:</strong> {author?.value || 'NorthBank Editorial'}

          <br />
          <br />

          <strong>Last Reviewed:</strong>{' '}
          {lastReviewedDate?.value || 'Not available'}
        </div>
      </section>

      {/* CTA */}

      <section
        style={{
          padding: '110px 32px',
          textAlign: 'center',
          color: '#fff',

          backgroundImage:
            "linear-gradient(rgba(15,118,110,.85),rgba(15,118,110,.85)),url('https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRvkEjYiE2iNN3EgMgg1xvSQx-vFlKYn6LaFKYZs96MY9aL98OS')",

          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '700px',
            margin: '0 auto',
          }}
        >
          <h2
            style={{
              fontSize: '3rem',
              marginTop: 0,
            }}
          >
            Ready to take the next step?
          </h2>

          <p
            style={{
              lineHeight: 1.9,
              fontSize: '1.1rem',
              marginBottom: '42px',
            }}
          >
            Discover financial products designed to support your goals today
            and tomorrow. Our specialists are ready to help you find the
            right solution.
          </p>

          <button
            style={{
              background: '#fff',
              color: '#0f766e',
              border: 'none',
              padding: '18px 42px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '1rem',
            }}
          >
            Apply Today
          </button>
        </div>
      </section>
    </section>
  );
};

const StatCard = ({
  number,
  label,
}: {
  number: string;
  label: string;
}) => (
  <div
    style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderTop: '5px solid #14b8a6',
      padding: '40px',
      textAlign: 'center',
      borderRadius: '10px',
    }}
  >
    <div
      style={{
        fontSize: '3rem',
        fontWeight: 700,
        color: '#14b8a6',
      }}
    >
      {number}
    </div>

    <div
      style={{
        marginTop: '12px',
        color: '#475569',
        fontSize: '1rem',
      }}
    >
      {label}
    </div>
  </div>
);

const FaqCard = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => (
  <div
    style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '10px',
      padding: '24px',
    }}
  >
    <h3
      style={{
        marginTop: 0,
        color: '#0f172a',
      }}
    >
      {question}
    </h3>

    <p
      style={{
        marginBottom: 0,
        lineHeight: 1.8,
        color: '#64748b',
      }}
    >
      {answer}
    </p>
  </div>
);

const Card = ({
  label,
  value,
}: {
  label: string;
  value?: string;
}) => (
  <div
    style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderTop: '4px solid #14b8a6',
      padding: '24px',
      borderRadius: '10px',
    }}
  >
    <div
      style={{
        color: '#14b8a6',
        fontSize: '.75rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        marginBottom: '10px',
      }}
    >
      {label}
    </div>

    <div
      style={{
        color: '#0f172a',
        fontWeight: 600,
      }}
    >
      {value || 'Not specified'}
    </div>
  </div>
);

const FeatureCard = ({
  title,
  text,
}: {
  title: string;
  text: string;
}) => (
  <div
    style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '10px',
      padding: '28px',
    }}
  >
    <h3
      style={{
        marginTop: 0,
        color: '#0f172a',
      }}
    >
      {title}
    </h3>

    <p
      style={{
        marginBottom: 0,
        lineHeight: 1.8,
        color: '#64748b',
      }}
    >
      {text}
    </p>
  </div>
);

export default Default;