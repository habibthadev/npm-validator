import { computed, watch, shallowRef, ref, type Ref } from 'vue';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { registryClient, searchClient } from '@/lib/axios';
import { validatePackageName, extractPackageNameFromUrl } from '@/lib/validate-name';
import {
  calculateSimilarityScore,
  getRiskLevel,
  getPackageNamePart
} from '@/lib/levenshtein';
import type {
  SyntaxResult,
  AvailabilityStatus,
  SimilarPackage,
  NpmSearchResult,
  ValidationResult
} from '@/types';

export function useValidator(input: Ref<string>) {
  const queryClient = useQueryClient();
  const submittedName = ref('');

  const processedInput = computed(() => {
    const raw = input.value.trim();
    return extractPackageNameFromUrl(raw);
  });

  const wasUrlExtracted = computed(() => {
    const raw = input.value.trim();
    return raw !== processedInput.value && processedInput.value.length > 0;
  });

  const syntaxResult = computed<SyntaxResult>(() => {
    const name = processedInput.value;
    if (!name) {
      return { valid: false, errors: [], warnings: [] };
    }
    return validatePackageName(name);
  });

  const shouldQuery = computed(() => {
    return submittedName.value.length > 0 && syntaxResult.value.valid;
  });

  const registryQuery = useQuery({
    queryKey: computed(() => ['npm-registry', submittedName.value] as const),
    queryFn: async () => {
      const name = submittedName.value;
      const encodedName = encodeURIComponent(name).replace(/^%40/, '@');
      const response = await registryClient.get(`/${encodedName}`);
      return response.status === 404 ? null : response.data;
    },
    enabled: shouldQuery
  });

  const searchQuery = useQuery({
    queryKey: computed(() => ['npm-search', submittedName.value] as const),
    queryFn: async () => {
      const name = submittedName.value;
      const searchTerm = getPackageNamePart(name);
      const response = await searchClient.get<NpmSearchResult>('/search', {
        params: {
          text: searchTerm,
          size: 20
        }
      });
      return response.data;
    },
    enabled: shouldQuery
  });

  const availability = computed<AvailabilityStatus>(() => {
    if (!shouldQuery.value) return 'unknown';
    if (registryQuery.isLoading.value) return 'loading';
    if (registryQuery.isError.value) return 'error';
    return registryQuery.data.value === null ? 'available' : 'taken';
  });

  const similarPackages = shallowRef<SimilarPackage[]>([]);

  watch(
    [() => searchQuery.data.value, () => submittedName.value],
    ([data, currentName]) => {
      if (!data?.objects || !currentName) {
        similarPackages.value = [];
        return;
      }

      const inputNamePart = getPackageNamePart(currentName);
      const results: SimilarPackage[] = [];

      for (const obj of data.objects) {
        const pkg = obj.package;
        if (pkg.name.toLowerCase() === currentName.toLowerCase()) {
          continue;
        }

        const pkgNamePart = getPackageNamePart(pkg.name);
        const scoreAgainstPart = calculateSimilarityScore(inputNamePart, pkgNamePart);
        const scoreAgainstFull = calculateSimilarityScore(currentName, pkg.name);
        const score = Math.max(scoreAgainstPart, scoreAgainstFull);

        if (score >= 40) {
          results.push({
            name: pkg.name,
            description: pkg.description ?? '',
            version: pkg.version,
            author: pkg.publisher?.username ?? '',
            npmUrl: pkg.links?.npm ?? `https://www.npmjs.com/package/${pkg.name}`,
            similarityScore: score,
            riskLevel: getRiskLevel(score)
          });
        }
      }

      results.sort((a, b) => b.similarityScore - a.similarityScore);
      similarPackages.value = results.slice(0, 8);
    },
    { immediate: true }
  );

  const isLoading = computed(() => {
    return registryQuery.isLoading.value || searchQuery.isLoading.value;
  });

  const searchError = computed(() => searchQuery.isError.value);

  const isDone = computed(() => {
    if (!shouldQuery.value) return false;
    return !registryQuery.isLoading.value && !searchQuery.isLoading.value;
  });

  const hasHighRisk = computed(() => {
    return similarPackages.value.some(p => p.riskLevel === 'high');
  });

  const hasSubmitted = computed(() => submittedName.value.length > 0);

  const validationResult = computed<ValidationResult | null>(() => {
    if (!submittedName.value) return null;
    return {
      name: submittedName.value,
      syntax: syntaxResult.value,
      availability: availability.value,
      similar: similarPackages.value,
      checkedAt: new Date()
    };
  });

  function submit() {
    const name = processedInput.value;
    if (name && syntaxResult.value.valid) {
      submittedName.value = name;
    }
  }

  function retryRegistry() {
    queryClient.invalidateQueries({
      queryKey: ['npm-registry', submittedName.value]
    });
  }

  function retrySearch() {
    queryClient.invalidateQueries({
      queryKey: ['npm-search', submittedName.value]
    });
  }

  function reset() {
    submittedName.value = '';
    similarPackages.value = [];
  }

  return {
    processedInput,
    wasUrlExtracted,
    syntaxResult,
    availability,
    similarPackages,
    isLoading,
    isDone,
    searchError,
    hasHighRisk,
    hasSubmitted,
    validationResult,
    submit,
    retryRegistry,
    retrySearch,
    reset
  };
}
