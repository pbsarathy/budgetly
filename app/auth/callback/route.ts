import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { Database } from '@/types/supabase';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    // Create a Supabase client with the same configuration as the main client
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      }
    );

    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Error exchanging code for session:', error);
      // Redirect to home with error
      return NextResponse.redirect(new URL('/?error=auth_error', requestUrl.origin));
    }

    console.log('Session created successfully:', data.session?.user?.email);
  }

  // Redirect to home page after sign in
  return NextResponse.redirect(new URL('/', requestUrl.origin));
}
