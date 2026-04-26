/**
 * Next.js throws a special NEXT_REDIRECT error when redirect() is called inside a server action.
 * Client-side catch blocks must re-throw it so Next.js can handle the navigation.
 * Without this, the catch block swallows the redirect and shows a false error toast.
 */
export function isNextRedirect(err: unknown): boolean {
  return (
    typeof (err as any)?.digest === 'string' &&
    (err as any).digest.startsWith('NEXT_REDIRECT')
  )
}
