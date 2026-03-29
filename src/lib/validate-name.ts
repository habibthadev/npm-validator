import type { SyntaxResult, ValidationError, ValidationWarning } from '@/types';

const BLACKLIST = new Set([
  'node_modules',
  'favicon.ico',
  '__proto__',
  'constructor',
  'prototype'
]);

const CORE_MODULES = new Set([
  'assert', 'buffer', 'child_process', 'cluster', 'console', 'crypto',
  'dns', 'domain', 'events', 'fs', 'http', 'https', 'net', 'os', 'path',
  'process', 'querystring', 'readline', 'stream', 'tls', 'url', 'util',
  'v8', 'vm', 'zlib'
]);

const POPULAR_PACKAGES = new Set([
  'react', 'vue', 'angular', 'svelte', 'next', 'nuxt', 'express',
  'lodash', 'webpack', 'vite', 'rollup', 'esbuild', 'typescript',
  'eslint', 'prettier', 'axios', 'pinia', 'zustand'
]);

const VALID_CHARS_UNSCOPED = /^[a-z0-9._~-]+$/;
const VALID_CHARS_SCOPE = /^[a-z0-9._~-]+$/;
const VALID_CHARS_NAME = /^[a-z0-9._~-]+$/;

export function validatePackageName(name: string): SyntaxResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  const trimmed = name.trim();

  if (trimmed === '' || name.length === 0) {
    errors.push({
      message: 'Package name cannot be empty',
      code: 'ERR_EMPTY'
    });
    return { valid: false, errors, warnings };
  }

  if (name !== trimmed) {
    errors.push({
      message: 'Package name cannot have leading or trailing spaces',
      code: 'ERR_LEADING_TRAILING_SPACES'
    });
    return { valid: false, errors, warnings };
  }

  if (name.length > 214) {
    errors.push({
      message: 'Package name cannot exceed 214 characters',
      code: 'ERR_TOO_LONG'
    });
    return { valid: false, errors, warnings };
  }

  if (/[A-Z]/.test(name)) {
    errors.push({
      message: 'Package name cannot contain uppercase letters',
      code: 'ERR_UPPERCASE'
    });
  }

  if (name.startsWith('.')) {
    errors.push({
      message: 'Package name cannot start with a period',
      code: 'ERR_STARTS_WITH_PERIOD'
    });
  }

  if (name.startsWith('_')) {
    errors.push({
      message: 'Package name cannot start with an underscore',
      code: 'ERR_STARTS_WITH_UNDERSCORE'
    });
  }

  if (BLACKLIST.has(name.toLowerCase())) {
    errors.push({
      message: `"${name}" is a blacklisted package name`,
      code: 'ERR_BLACKLISTED'
    });
  }

  const isScoped = name.startsWith('@');

  if (isScoped) {
    const scopeResult = validateScopedPackage(name, errors);
    if (!scopeResult.valid) {
      return { valid: false, errors, warnings };
    }

    const slashIndex = name.indexOf('/');
    const packageName = name.slice(slashIndex + 1);

    addWarningsForName(packageName, warnings);
  } else {
    if (!VALID_CHARS_UNSCOPED.test(name)) {
      const invalidChars = findInvalidChars(name, VALID_CHARS_UNSCOPED);
      errors.push({
        message: `Package name contains URL-unsafe characters: ${invalidChars}`,
        code: 'ERR_UNSAFE_CHARS'
      });
    }

    addWarningsForName(name, warnings);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

function validateScopedPackage(
  name: string,
  errors: ValidationError[]
): { valid: boolean } {
  const slashIndex = name.indexOf('/');

  if (slashIndex === -1) {
    errors.push({
      message: 'Scoped package must follow @scope/name format',
      code: 'ERR_SCOPED_NO_SLASH'
    });
    return { valid: false };
  }

  const scope = name.slice(1, slashIndex);
  const packageName = name.slice(slashIndex + 1);

  if (scope === '') {
    errors.push({
      message: 'Scope cannot be empty',
      code: 'ERR_EMPTY_SCOPE'
    });
    return { valid: false };
  }

  if (packageName === '') {
    errors.push({
      message: 'Package name cannot be empty',
      code: 'ERR_EMPTY_PACKAGE_NAME'
    });
    return { valid: false };
  }

  if (!VALID_CHARS_SCOPE.test(scope)) {
    const invalidChars = findInvalidChars(scope, VALID_CHARS_SCOPE);
    errors.push({
      message: `Scope contains invalid characters: ${invalidChars}`,
      code: 'ERR_INVALID_SCOPE_CHARS'
    });
  }

  if (!VALID_CHARS_NAME.test(packageName)) {
    const invalidChars = findInvalidChars(packageName, VALID_CHARS_NAME);
    errors.push({
      message: `Package name contains URL-unsafe characters: ${invalidChars}`,
      code: 'ERR_UNSAFE_CHARS'
    });
  }

  if (packageName.startsWith('.')) {
    errors.push({
      message: 'Package name cannot start with a period',
      code: 'ERR_STARTS_WITH_PERIOD'
    });
  }

  if (packageName.startsWith('_')) {
    errors.push({
      message: 'Package name cannot start with an underscore',
      code: 'ERR_STARTS_WITH_UNDERSCORE'
    });
  }

  return { valid: errors.length === 0 };
}

function addWarningsForName(name: string, warnings: ValidationWarning[]): void {
  if (CORE_MODULES.has(name)) {
    warnings.push({
      message: `"${name}" is a Node.js core module name`,
      code: 'WARN_CORE_MODULE'
    });
  }

  if (POPULAR_PACKAGES.has(name.toLowerCase())) {
    warnings.push({
      message: `"${name}" is very similar to a popular package`,
      code: 'WARN_POPULAR_PACKAGE'
    });
  }

  if (name.startsWith('node-')) {
    warnings.push({
      message: 'Names starting with "node-" are conventionally reserved',
      code: 'WARN_NODE_PREFIX'
    });
  }

  if (/--/.test(name)) {
    warnings.push({
      message: 'Name contains double hyphens which may be visually confusing',
      code: 'WARN_DOUBLE_HYPHEN'
    });
  }

  if (/\.\./.test(name)) {
    warnings.push({
      message: 'Name contains double dots which may be visually confusing',
      code: 'WARN_DOUBLE_DOT'
    });
  }

  if (name.length === 1) {
    warnings.push({
      message: 'Single character names are too generic and likely to conflict',
      code: 'WARN_SINGLE_CHAR'
    });
  }

  if (name.endsWith('.git')) {
    warnings.push({
      message: 'Names ending with ".git" are conventionally used for git remotes',
      code: 'WARN_GIT_SUFFIX'
    });
  }
}

function findInvalidChars(str: string, validPattern: RegExp): string {
  const invalid: string[] = [];
  for (const char of str) {
    if (!validPattern.test(char) && !invalid.includes(char)) {
      invalid.push(char);
    }
  }
  return invalid.map(c => `"${c}"`).join(', ');
}

export function extractPackageNameFromUrl(input: string): string {
  const patterns = [
    /^https?:\/\/(?:www\.)?npmjs\.com\/package\/(@?[^/\s]+(?:\/[^/\s]+)?)/i,
    /^https?:\/\/(?:www\.)?npm\.im\/(@?[^/\s]+(?:\/[^/\s]+)?)/i
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match?.[1]) {
      return decodeURIComponent(match[1]);
    }
  }

  return input;
}
