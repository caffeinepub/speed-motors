import { useEffect, useRef } from 'react';
import { useInternetIdentity } from './useInternetIdentity';
import { useActor } from './useActor';
import { extractErrorMessage } from '@/lib/errorMessage';
import { toast } from 'sonner';

/**
 * Hook that automatically bootstraps authenticated users for core app access.
 * Runs once after successful login to ensure the user can perform CRUD operations.
 */
export function useAuthBootstrap() {
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const hasBootstrapped = useRef(false);

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  useEffect(() => {
    // Only run if authenticated, actor is ready, and we haven't bootstrapped yet
    if (!isAuthenticated || !actor || hasBootstrapped.current) {
      return;
    }

    const bootstrap = async () => {
      try {
        // Check if user already has a profile
        const profile = await actor.getCallerUserProfile();
        
        if (!profile) {
          // Create a default profile for the user
          const principal = identity!.getPrincipal().toString();
          const defaultName = `User ${principal.slice(0, 8)}`;
          
          await actor.saveCallerUserProfile({
            name: defaultName,
            role: 'user',
          });
        }

        // Mark as bootstrapped
        hasBootstrapped.current = true;
      } catch (error) {
        const errorMsg = extractErrorMessage(error);
        console.error('Bootstrap error:', error);
        
        // Only show error if it's not an "already exists" type error
        if (!errorMsg.toLowerCase().includes('already')) {
          toast.error(`Authentication setup failed: ${errorMsg}`);
        }
      }
    };

    bootstrap();
  }, [isAuthenticated, actor, identity]);

  return { isBootstrapped: hasBootstrapped.current };
}
