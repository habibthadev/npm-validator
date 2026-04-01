export interface PackageMetadata {
  name: string;
  version: string;
  description?: string;
  hasESM: boolean;
  hasTypes: boolean;
  exports?: Record<string, unknown>;
  main?: string;
  module?: string;
  types?: string;
  license?: string;
  repository?: {
    type: string;
    url: string;
  };
  homepage?: string;
  keywords?: string[];
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

export interface DownloadsData {
  downloads: number;
  start: string;
  end: string;
}

export interface PackageStats {
  lastPublish: string;
  weeklyDownloads: number;
  monthlyDownloads: number;
  dependentsCount?: number;
}

export interface BundleResult {
  packageName: string;
  version: string;
  namedImport?: string;
  rawSize: number;
  minifiedSize: number;
  gzipSize: number;
  brotliSize: number;
  hasESM: boolean;
  metafile?: {
    inputs: Record<string, { bytes: number }>;
    outputs: Record<string, { bytes: number }>;
  };
}

export interface TreemapNode {
  name: string;
  value: number;
  children?: TreemapNode[];
}

export interface BundleAnalysisState {
  metadata: PackageMetadata | null;
  stats: PackageStats | null;
  fullBundle: BundleResult | null;
  namedBundle: BundleResult | null;
  isAnalyzing: boolean;
  error: string | null;
}
