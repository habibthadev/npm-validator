# npm Package Name Validator

> Validate npm package names before publishing. Check naming rules compliance, registry availability, and detect potential typosquatting risk.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- **Instant Syntax Validation** - Real-time validation against official npm naming rules
- **Registry Availability Check** - Live lookup to see if package name is already taken
- **Typosquatting Detection** - Similarity scoring using Levenshtein distance to find similar packages
- **Comprehensive Feedback** - Detailed error messages and warnings for all validation issues
- **Validation History** - Automatic persistence of previous searches with localStorage
- **Clean UI Design** - Apple HIG-inspired interface with smooth animations

## Tech Stack

- **Frontend**: Vue 3 (Composition API + script setup)
- **Type Safety**: TypeScript (strict mode)
- **Styling**: TailwindCSS v4
- **State Management**: Pinia with persistence
- **Data Fetching**: TanStack Vue Query
- **Routing**: Vue Router
- **Build Tool**: Vite

## Installation

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

## Build

```bash
pnpm build
```

## Type Check

```bash
pnpm type-check
```

## Validation Rules

The validator checks for:

- Empty or whitespace-only names
- Length exceeding 214 characters
- Uppercase letters (npm requires lowercase)
- Names starting with `.` or `_`
- Non-URL-safe characters
- Blacklisted names (node_modules, favicon.ico, etc.)
- Scoped package format validation
- Core Node.js module conflicts
- Popular package name conflicts
- Consecutive dots or hyphens
- Single character names
- `.git` suffix

## API Endpoints

- **Registry Check**: `https://registry.npmjs.org/{package}`
- **Search**: `https://registry.npmjs.org/-/v1/search?text={name}&size=20`

## Project Structure

```
src/
├── assets/           # Global styles
├── components/
│   ├── layout/       # Header, Footer
│   ├── ui/           # Reusable UI components
│   └── validator/    # Validation panels
├── composables/      # Vue composables
├── lib/             # Core validation logic
├── router/          # Vue Router setup
├── stores/          # Pinia stores
├── types/           # TypeScript types
└── views/           # Page components
```

## License

MIT

## Author

Created by [Habib Adebayo](https://habibthadev.tech)

## Deployment

This project is optimized for deployment on Vercel with edge runtime support for dynamic OG image generation.
