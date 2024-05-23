'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useAuthContext } from 'src/auth/hooks';

import { SplashScreen } from 'src/components/loading-screen';

function CallbackPage() {
  const { login, user } = useAuthContext();

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      login(code);
    }
  }, [login, router, searchParams]);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [router, user]);

  return <SplashScreen />;
}

export default function Page() {
  return (
    <Suspense fallback={<div className="">Loading...</div>}>
      <CallbackPage />
    </Suspense>
  );
}
