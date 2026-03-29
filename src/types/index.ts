export type ValidationStatus = 'idle' | 'validating' | 'done' | 'error';
export type AvailabilityStatus = 'available' | 'taken' | 'unknown' | 'error' | 'loading';
export type RiskLevel = 'high' | 'moderate' | 'low' | 'none';

export interface ValidationError {
  message: string;
  code: string;
}

export interface ValidationWarning {
  message: string;
  code: string;
}

export interface SyntaxResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface SimilarPackage {
  name: string;
  description: string;
  version: string;
  author: string;
  weeklyDownloads?: number;
  npmUrl: string;
  similarityScore: number;
  riskLevel: RiskLevel;
}

export interface ValidationResult {
  name: string;
  syntax: SyntaxResult;
  availability: AvailabilityStatus;
  similar: SimilarPackage[];
  checkedAt: Date;
}

export interface NpmSearchResult {
  objects: Array<{
    package: {
      name: string;
      description?: string;
      version: string;
      publisher?: {
        username: string;
      };
      links?: {
        npm?: string;
      };
    };
    score?: {
      detail?: {
        popularity?: number;
      };
    };
  }>;
}

export interface NpmRegistryResponse {
  name: string;
  description?: string;
  version?: string;
}
