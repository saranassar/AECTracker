export type ProcessedPart = {
  row: number;
  partNumber: string;
  manufacturer: string;
  aecStatus: string;
  aecStandard: string;
  grade: string;
  source: string;
  notes: string;
  confidence: number;
  error?: string;
};

export type ProcessResponse = {
  summary: { total: number; qualified: number; unknown: number; invalid: number };
  results: ProcessedPart[];
};
