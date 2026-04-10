'use client';

import { useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PostAdWizard from '@/components/post-ad/PostAdWizard';

export default function PostAdWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const showWizard = useMemo(() => {
    return searchParams.get('post-ad') === 'true';
  }, [searchParams]);

  const handleClose = () => {
    // Remove the post-ad parameter from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('post-ad');
    router.push(url.pathname + url.search);
  };

  if (!showWizard) {
    return null;
  }

  return <PostAdWizard onClose={handleClose} />;
}
