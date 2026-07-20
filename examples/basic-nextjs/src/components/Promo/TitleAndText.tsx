import React, { JSX } from 'react';
import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

type TitleAndTextProps = ComponentProps;

export const Default = (props: TitleAndTextProps): JSX.Element => {
  const routeFields = props.page?.layout?.sitecore?.route?.fields;

  if (!routeFields) {
    return <span>No content found</span>;
  }

  const productOrService = routeFields['Product Or Service'] as Field<string>;
  const industry = routeFields['Industry'] as Field<string>;
  const audience = routeFields['Audience'] as Field<string>;
  const region = routeFields['Region'] as Field<string>;

  return (
    <section
      className={`component title-and-text ${props.params?.styles || ''}`}
      style={{
        fontFamily: 'Arial, sans-serif',
        background: '#fff',
      }}
    >
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