import { useQuery } from '@tanstack/react-query';

interface ArtifactAvailability {
  zipAvailable: boolean;
  sourceDocAvailable: boolean;
  sourceZipAvailable: boolean;
}

async function checkArtifactAvailability(path: string): Promise<boolean> {
  try {
    // Add cache-busting query parameter to ensure fresh check
    const url = `${path}?t=${Date.now()}`;
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

export function useStaticArtifactAvailability() {
  return useQuery<ArtifactAvailability>({
    queryKey: ['staticArtifacts'],
    queryFn: async () => {
      const [zipAvailable, sourceDocAvailable, sourceZipAvailable] = await Promise.all([
        checkArtifactAvailability('/artifacts/app-build.zip'),
        checkArtifactAvailability('/artifacts/SOURCE_CODE.md'),
        checkArtifactAvailability('/artifacts/source-code.zip'),
      ]);

      return {
        zipAvailable,
        sourceDocAvailable,
        sourceZipAvailable,
      };
    },
    staleTime: 30000, // Cache for 30 seconds
    retry: false, // Don't retry on failure
  });
}
