import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function GoogleCallback() {
  const [, setLocation] = useLocation();
  const { handleGoogleCallback } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          console.error('Google OAuth error:', error);
          setLocation('/auth?error=oauth_error');
          return;
        }

        if (code) {
          await handleGoogleCallback(code);
          setLocation('/'); // Redirect to home page after successful login
        } else {
          setLocation('/auth?error=missing_code');
        }
      } catch (error) {
        console.error('Google callback error:', error);
        setLocation('/auth?error=callback_failed');
      }
    };

    handleCallback();
  }, [handleGoogleCallback, setLocation]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <CardTitle>Completing Login</CardTitle>
          <CardDescription>
            Please wait while we complete your Google login...
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground mt-4">
            This should only take a moment
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
