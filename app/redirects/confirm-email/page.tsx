import { redirect } from 'next/navigation';
import { confirmEmailWithToken } from '@/app/lib/actions/auth/confirm-email-actions';
import { auth } from '@/auth';

export default async function ConfirmEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string }>;
}) {
  const params = await searchParams;
  const { token, email } = params;

  // console.log('token', token);
  // console.log('email', email);

  if (!token || !email) {
    redirect('/auth/login?error=Invalid confirmation link');
  }

  const result = await confirmEmailWithToken(email, token);
  console.log('Confirm emailresult', result);

  // Check if user is logged in
  const session = await auth();

  // console log if user is signed in
  if (session) {
    console.log('User is signed in');
  } else {
    console.log('User is not signed in');
  }

  if (session) {
    console.log('redirecting to refresh-tokens');
    redirect('/redirects/refresh-tokens');
  }

  console.log('redirecting to login');
  redirect('/auth/login?message=Email confirmed successfully');
}
