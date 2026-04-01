import { ref } from 'vue';
import type { PackageMetadata, BundleResult, PackageStats } from '@/types/bundle';
import axios from 'axios';

async function compressData(data: string, format: 'gzip' | 'deflate'): Promise<number> {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(data));
      controller.close();
    }
  });

  const compressedStream = stream.pipeThrough(
    new CompressionStream(format)
  );

  const reader = compressedStream.getReader();
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
  }

  return totalBytes;
}

export function useBundleAnalyzer() {
  const isAnalyzing = ref(false);
  const error = ref<string | null>(null);
  const metadata = ref<PackageMetadata | null>(null);
  const stats = ref<PackageStats | null>(null);
  const fullBundle = ref<BundleResult | null>(null);
  const namedBundle = ref<BundleResult | null>(null);

  async function fetchMetadata(packageName: string): Promise<PackageMetadata | null> {
    try {
      const response = await axios.get(`https://registry.npmjs.org/${packageName}`);
      const data = response.data;
      const latestVersion = data['dist-tags'].latest;
      const versionData = data.versions[latestVersion];

      const hasESM = Boolean(
        versionData.module ||
        versionData.exports?.['.']?.import ||
        versionData.type === 'module'
      );

      const hasTypes = Boolean(
        versionData.types ||
        versionData.typings ||
        versionData.exports?.['.']?.types
      );

      return {
        name: packageName,
        version: latestVersion,
        description: versionData.description,
        hasESM,
        hasTypes,
        exports: versionData.exports,
        main: versionData.main,
        module: versionData.module,
        types: versionData.types || versionData.typings,
        license: versionData.license,
        repository: versionData.repository,
        homepage: versionData.homepage,
        keywords: versionData.keywords,
        dependencies: versionData.dependencies,
        devDependencies: versionData.devDependencies,
        peerDependencies: versionData.peerDependencies
      };
    } catch (err) {
      return null;
    }
  }

  async function fetchStats(packageName: string): Promise<PackageStats | null> {
    try {
      const [registryRes, downloadsRes] = await Promise.all([
        axios.get(`https://registry.npmjs.org/${packageName}`),
        axios.get(`https://api.npmjs.org/downloads/point/last-month/${packageName}`)
      ]);

      const data = registryRes.data;
      const time = data.time;
      const versions = Object.keys(time).filter(v => v !== 'created' && v !== 'modified');
      const lastVersion = versions[versions.length - 1];

      if (!lastVersion) {
        return null;
      }

      return {
        lastPublish: time[lastVersion],
        weeklyDownloads: Math.round(downloadsRes.data.downloads / 4),
        monthlyDownloads: downloadsRes.data.downloads
      };
    } catch (err) {
      return null;
    }
  }

  async function analyzeBundle(
    packageName: string,
    version: string,
    namedImport?: string
  ): Promise<BundleResult | null> {
    return new Promise((resolve) => {
      const worker = new Worker(
        new URL('../workers/bundler.worker.ts', import.meta.url),
        { type: 'module' }
      );

      worker.postMessage({ packageName, version, namedImport });

      worker.onmessage = async (e) => {
        if (e.data.success) {
          const code = e.data.code;
          const rawSize = new TextEncoder().encode(code).length;
          const gzipSize = await compressData(code, 'gzip');
          const brotliSize = await compressData(code, 'deflate');

          resolve({
            packageName,
            version,
            namedImport,
            rawSize,
            minifiedSize: rawSize,
            gzipSize,
            brotliSize,
            hasESM: true,
            metafile: e.data.metafile
          });
        } else {
          resolve(null);
        }
        worker.terminate();
      };

      worker.onerror = () => {
        resolve(null);
        worker.terminate();
      };
    });
  }

  async function analyze(packageName: string, namedImport?: string, userVersion?: string) {
    isAnalyzing.value = true;
    error.value = null;
    fullBundle.value = null;
    namedBundle.value = null;
    stats.value = null;

    try {
      const [meta, packageStats] = await Promise.all([
        fetchMetadata(packageName),
        fetchStats(packageName)
      ]);

      if (!meta) {
        error.value = 'Package not found';
        return;
      }

      metadata.value = meta;
      stats.value = packageStats;
      const targetVersion = userVersion || meta.version;

      const fullResult = await analyzeBundle(packageName, targetVersion);
      if (!fullResult) {
        error.value = 'Failed to bundle package';
        return;
      }

      fullBundle.value = fullResult;

      if (namedImport && meta.hasESM) {
        const namedResult = await analyzeBundle(packageName, targetVersion, namedImport);
        if (namedResult) {
          namedBundle.value = namedResult;
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Analysis failed';
    } finally {
      isAnalyzing.value = false;
    }
  }

  return {
    isAnalyzing,
    error,
    metadata,
    stats,
    fullBundle,
    namedBundle,
    analyze
  };
}
