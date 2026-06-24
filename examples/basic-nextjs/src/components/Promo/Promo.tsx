import React, { JSX } from 'react';
import {
  Field,
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

  return (
    <section
      className={`component promo ${props.params?.styles || ''}`}
      style={{
        maxWidth: '1200px',
        margin: '48px auto',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
      }}
    >
      {/* Header */}
      <div
        style={{
          borderTop: '6px solid #14b8a6',
          padding: '40px',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(2rem, 4vw, 3.25rem)',
            fontWeight: 700,
            color: '#0f172a',
            margin: 0,
            marginBottom: '16px',
            lineHeight: 1.1,
          }}
        >
          {title?.value}
        </h1>

        <p
          style={{
            fontSize: '1.125rem',
            color: '#64748b',
            lineHeight: 1.7,
            margin: 0,
            maxWidth: '850px',
          }}
        >
          {summary?.value}
        </p>
      </div>

      {/* Main Content */}
      <div
        style={{
          padding: '40px',
          borderTop: '1px solid #e2e8f0',
          color: '#334155',
          lineHeight: 1.9,
          fontSize: '1rem',
        }}
      >
        {mainContent && <ContentSdkRichText field={mainContent} />}
      </div>

      {/* Metadata */}
      <div
        style={{
          padding: '40px',
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
        }}
      >
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#0f172a',
            marginTop: 0,
            marginBottom: '24px',
          }}
        >
          Content Details
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          <Card
            label="Product / Service"
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

          <Card
            label="Author"
            value={author?.value as string}
          />

          <Card
            label="Last Reviewed"
            value={lastReviewedDate?.value as string}
          />
        </div>
      </div>
    </section>
  );
};

const Card = ({
  label,
  value,
}: {
  label: string;
  value?: string;
}) => (
  <div
    style={{
      backgroundColor: '#ffffff',
      border: '1px solid #cbd5e1',
      borderTop: '3px solid #14b8a6',
      padding: '18px',
      minHeight: '100px',
    }}
  >
    <div
      style={{
        fontSize: '0.75rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: '#14b8a6',
        marginBottom: '10px',
      }}
    >
      {label}
    </div>

    <div
      style={{
        color: '#0f172a',
        fontSize: '0.95rem',
        lineHeight: 1.5,
        fontWeight: 500,
      }}
    >
      {value || 'Not specified'}
    </div>
  </div>
);

export default Default;