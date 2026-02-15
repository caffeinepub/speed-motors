import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { t } from '@/lib/i18n';

export default function AuthControls() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <div className="flex items-center gap-3">
      {!isAuthenticated && (
        <p className="hidden text-xs text-muted-foreground md:block">
          {t('auth.sign_in_required')}
        </p>
      )}
      <Button
        onClick={handleAuth}
        disabled={isLoggingIn}
        variant={isAuthenticated ? 'outline' : 'default'}
        size="sm"
        className="gap-2"
      >
        {isAuthenticated ? (
          <>
            <LogOut className="h-4 w-4" />
            <span>{t('auth.sign_out')}</span>
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4" />
            <span>{isLoggingIn ? t('auth.signing_in') : t('auth.sign_in')}</span>
          </>
        )}
      </Button>
    </div>
  );
}
