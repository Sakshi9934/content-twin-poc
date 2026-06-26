// src/lib/twin-contract.ts
// The fixed shape every Content Twin must conform to, plus a validator that
// rejects malformed AI output before it is ever scored or saved.

// A subject–predicate–object triple, e.g. Home Loan -> suitableFor -> First-Time Buyer
export interface TwinRelationship {
  subject: string;
  predicate: string;
  object: string;
}

// Where the twin came from in the source system.
export interface TwinSource {
  system: string; // e.g. "XM Cloud"
  path: string; // content path or route path
  itemId: string; // Sitecore item id
}

// The portion the AI returns. The generate API validates exactly this.
export interface GeneratedTwin {
  machineSummary: string;
  shortAnswer: string;
  keyFacts: string[];
  entities: string[];
  topics: string[];
  relationships: TwinRelationship[];
  schemaType: string;
  schemaJson: Record<string, unknown>;
  recommendedQuestions: string[];
  missingFields: string[];
}

// The full stored twin = AI output + fields the generate API adds afterwards.
export interface ContentTwin extends GeneratedTwin {
  id: string;
  title: string;
  humanUrl: string;
  //twinScore: number;
  source: TwinSource;
  lastGenerated: string; // ISO timestamp
  lastReviewedDate: string; // YYYY-MM-DD
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// Validate that an unknown value is a structurally-correct GeneratedTwin.
// This checks SHAPE, not quality — minimum-count quality lives in the score rules.
export function validateGeneratedTwin(input: unknown): ValidationResult {
  const errors: string[] = [];

  if (typeof input !== 'object' || input === null) {
    return { valid: false, errors: ['Twin output is not an object'] };
  }
  const t = input as Record<string, unknown>;

  // Required non-empty strings.
  for (const f of ['machineSummary', 'shortAnswer']) {
    if (typeof t[f] !== 'string' || (t[f] as string).trim() === '') {
      errors.push(`Missing or empty string field: ${f}`);
    }
  }

  // schemaType must be a string (may be empty; generate API can default it).
  if (typeof t.schemaType !== 'string') {
    errors.push('schemaType must be a string');
  }

  // String-array fields.
  for (const f of ['keyFacts', 'entities', 'topics', 'recommendedQuestions', 'missingFields']) {
    const v = t[f];
    if (!Array.isArray(v) || !v.every((x) => typeof x === 'string')) {
      errors.push(`Field ${f} must be an array of strings`);
    }
  }

  // Relationships must be triples of strings.
  if (!Array.isArray(t.relationships)) {
    errors.push('relationships must be an array');
  } else {
    t.relationships.forEach((r, i) => {
      const rel = r as Record<string, unknown>;
      if (
        typeof rel !== 'object' ||
        rel === null ||
        typeof rel.subject !== 'string' ||
        typeof rel.predicate !== 'string' ||
        typeof rel.object !== 'string'
      ) {
        errors.push(`relationships[${i}] must have string subject, predicate, object`);
      }
    });
  }

  // schemaJson must be a plain object (not array, not null).
  if (typeof t.schemaJson !== 'object' || t.schemaJson === null || Array.isArray(t.schemaJson)) {
    errors.push('schemaJson must be a JSON object');
  }

  return { valid: errors.length === 0, errors };
}