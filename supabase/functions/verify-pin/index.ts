import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Simple hash function for PIN (in production, use bcrypt)
async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + 'tailor_master_salt_2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, pin } = await req.json()

    // Validate input
    if (!action || (action !== 'check_exists' && !pin)) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate PIN format (4-6 digits)
    if (pin && (!/^\d{4,6}$/.test(pin))) {
      return new Response(
        JSON.stringify({ error: 'PIN must be 4-6 digits' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client with service role (bypasses RLS)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (action === 'check_exists') {
      // Check if PIN exists
      const { data, error } = await supabaseAdmin
        .from('app_settings')
        .select('id')
        .eq('setting_key', 'pin')
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      return new Response(
        JSON.stringify({ exists: !!data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'set') {
      // Hash the PIN before storing
      const hashedPin = await hashPin(pin)

      const { error } = await supabaseAdmin
        .from('app_settings')
        .upsert({
          setting_key: 'pin',
          setting_value: hashedPin,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'setting_key'
        })

      if (error) throw error

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'verify') {
      // Get stored PIN
      const { data, error } = await supabaseAdmin
        .from('app_settings')
        .select('setting_value')
        .eq('setting_key', 'pin')
        .single()

      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: 'PIN not set' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const storedValue = data.setting_value
      const hashedPin = await hashPin(pin)
      
      // Check if stored PIN is plaintext (legacy) or hashed
      // Plaintext PINs are 4-6 digits, hashed PINs are 64 hex chars
      const isPlaintext = /^\d{4,6}$/.test(storedValue)
      
      let isValid = false
      if (isPlaintext) {
        // Legacy plaintext comparison - then migrate to hashed
        isValid = storedValue === pin
        if (isValid) {
          // Migrate to hashed PIN
          await supabaseAdmin
            .from('app_settings')
            .update({ 
              setting_value: hashedPin,
              updated_at: new Date().toISOString()
            })
            .eq('setting_key', 'pin')
        }
      } else {
        // Compare hashed values
        isValid = storedValue === hashedPin
      }

      if (!isValid) {
        return new Response(
          JSON.stringify({ success: false }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})