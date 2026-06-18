import { Suspense } from 'react';
import AcceptInvitePage from '@/components/accept-invite/AcceptInviteContent';

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AcceptInvitePage />
    </Suspense>
  );
}