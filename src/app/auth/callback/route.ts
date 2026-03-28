import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Check if the user has a family set up (i.e. has completed onboarding)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: families } = await supabase
          .from('families')
          .select('id')
          .eq('owner_id', user.id)
          .limit(1);

        const hasFamily = families && families.length > 0;
        return NextResponse.redirect(`${origin}${hasFamily ? next : '/onboarding'}`);
      }
    }
  }

  // Something went wrong — send to auth page with error indicator
  return NextResponse.redirect(`${origin}/auth?error=callback_failed`);
}
