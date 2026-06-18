import { Suspense } from 'react';
import AcceptInviteContent from '@/components/accept-invite/AcceptInviteContent';

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AcceptInviteContent />
    </Suspense>
  );
}