import React, { JSX } from 'react';
import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

type FAQProps = ComponentProps;

export const Default = (props: FAQProps): JSX.Element => {
  const routeFields = props.page?.layout?.sitecore?.route?.fields;

  if (!routeFields) {
    return <span>No content found</span>;
  }

  const author = routeFields['Author'] as Field<string>;
  const lastReviewedDate = routeFields['Last Reviewed Date'] as Field<string>;

  return (
    <section
      className={`component faq ${props.params?.styles || ''}`}
      style={{
        fontFamily: 'Arial, sans-serif',
        background: '#fff',
      }}
    >
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
    </section>
  );
};

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

export default Default;