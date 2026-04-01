import * as esbuild from 'esbuild-wasm';

let initialized = false;

async function ensureInitialized() {
  if (!initialized) {
    await esbuild.initialize({
      wasmURL: 'https://cdn.jsdelivr.net/npm/esbuild-wasm@0.27.4/esbuild.wasm'
    });
    initialized = true;
  }
}

interface PackageJson {
  name: string;
  version: string;
  main?: string;
  module?: string;
  exports?: any;
}

async function fetchPackageJson(packageName: string, version: string): Promise<PackageJson> {
  const response = await fetch(`https://unpkg.com/${packageName}@${version}/package.json`);
  if (!response.ok) {
    throw new Error(`Package not found: ${packageName}@${version}`);
  }
  return response.json();
}

async function fetchFile(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${url}`);
  }
  return response.text();
}

function resolveFilePath(base: string, target: string): string {
  if (target.startsWith('/')) {
    return target;
  }
  
  const baseParts = base.split('/').slice(0, -1);
  const targetParts = target.split('/');
  
  for (const part of targetParts) {
    if (part === '..') {
      baseParts.pop();
    } else if (part !== '.') {
      baseParts.push(part);
    }
  }
  
  return '/' + baseParts.filter(p => p).join('/');
}

function getEntryPoint(pkg: PackageJson): string {
  if (pkg.module) return pkg.module;
  if (pkg.exports) {
    if (typeof pkg.exports === 'string') return pkg.exports;
    if (pkg.exports['.']) {
      const exp = pkg.exports['.'];
      if (typeof exp === 'string') return exp;
      if (exp.import) return exp.import;
      if (exp.require) return exp.require;
      if (exp.default) return exp.default;
    }
  }
  return pkg.main || 'index.js';
}

self.onmessage = async (e: MessageEvent) => {
  const { packageName, version, namedImport } = e.data;

  try {
    await ensureInitialized();

    const pkgJson = await fetchPackageJson(packageName, version);
    let entryPoint = getEntryPoint(pkgJson);
    
    if (entryPoint.startsWith('./')) {
      entryPoint = entryPoint.slice(2);
    }

    const baseUrl = `https://unpkg.com/${packageName}@${version}`;
    const fileCache = new Map<string, string>();

    const entryCode = namedImport
      ? `export { ${namedImport} } from '${packageName}';`
      : `export * from '${packageName}';`;

    const result = await esbuild.build({
      stdin: {
        contents: entryCode,
        loader: 'js',
        resolveDir: '/'
      },
      bundle: true,
      minify: true,
      format: 'esm',
      platform: 'browser',
      write: false,
      metafile: true,
      treeShaking: true,
      plugins: [{
        name: 'unpkg-resolver',
        setup(build) {
          build.onResolve({ filter: /.*/ }, async (args) => {
            if (args.path === packageName) {
              return {
                path: '/' + entryPoint,
                namespace: 'unpkg'
              };
            }

            if (args.path.startsWith('.')) {
              const importer = args.pluginData?.currentPath || '/' + entryPoint;
              const resolved = resolveFilePath(importer, args.path);
              return {
                path: resolved,
                namespace: 'unpkg',
                pluginData: { currentPath: resolved }
              };
            }

            return { path: args.path, external: true };
          });

          build.onLoad({ filter: /.*/, namespace: 'unpkg' }, async (args) => {
            try {
              let filePath = args.path;
              
              const possibleExtensions = ['', '.js', '.mjs', '.jsx', '/index.js'];
              let code: string | null = null;
              let actualPath = filePath;

              for (const ext of possibleExtensions) {
                const tryPath = filePath + ext;
                const url = baseUrl + tryPath;
                
                if (fileCache.has(tryPath)) {
                  code = fileCache.get(tryPath)!;
                  actualPath = tryPath;
                  break;
                }

                try {
                  code = await fetchFile(url);
                  fileCache.set(tryPath, code);
                  actualPath = tryPath;
                  break;
                } catch {
                  continue;
                }
              }

              if (!code) {
                return {
                  errors: [{
                    text: `Cannot resolve: ${filePath}`
                  }]
                };
              }

              return {
                contents: code,
                loader: 'js',
                pluginData: { currentPath: actualPath }
              };
            } catch (error) {
              return {
                errors: [{
                  text: error instanceof Error ? error.message : String(error)
                }]
              };
            }
          });
        }
      }]
    });

    const output = result.outputFiles?.[0];
    if (!output) {
      self.postMessage({
        success: false,
        error: 'No output generated'
      });
      return;
    }

    const code = output.text;

    self.postMessage({
      success: true,
      code,
      metafile: result.metafile
    });
  } catch (error) {
    self.postMessage({
      success: false,
      error: error instanceof Error ? error.message : 'Bundle failed'
    });
  }
};
