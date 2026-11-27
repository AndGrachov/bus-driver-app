/**
 * Sign-in route. Reachable only without a session; after sign-in the
 * protected stack takes the driver to their assignments.
 */
import { SignInForm } from '@/features/auth';
import { Screen } from '@/shared/ui';

export default function SignInRoute() {
  return (
    <Screen keyboard>
      <SignInForm />
    </Screen>
  );
}
