import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AUTH_KEY = 'tailor_master_auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasPin, setHasPin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if already authenticated in this session
      const authStatus = localStorage.getItem(AUTH_KEY);
      
      // Check if PIN exists in database
      const { data, error } = await supabase
        .from('app_settings')
        .select('setting_value')
        .eq('setting_key', 'pin')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking PIN:', error);
      }

      setHasPin(!!data);
      setIsAuthenticated(authStatus === 'true' && !!data);
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setPin = async (pin: string) => {
    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          setting_key: 'pin',
          setting_value: pin,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'setting_key'
        });

      if (error) throw error;

      localStorage.setItem(AUTH_KEY, 'true');
      setHasPin(true);
      setIsAuthenticated(true);
      toast.success('پن کوڈ سیٹ ہو گیا');
      return true;
    } catch (error) {
      console.error('Error setting PIN:', error);
      toast.error('پن کوڈ سیٹ کرنے میں مسئلہ ہوا');
      return false;
    }
  };

  const verifyPin = async (pin: string) => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('setting_value')
        .eq('setting_key', 'pin')
        .single();

      if (error) throw error;

      if (data.setting_value === pin) {
        localStorage.setItem(AUTH_KEY, 'true');
        setIsAuthenticated(true);
        toast.success('خوش آمدید!');
        return true;
      } else {
        toast.error('غلط پن کوڈ');
        return false;
      }
    } catch (error) {
      console.error('Error verifying PIN:', error);
      toast.error('پن کوڈ چیک کرنے میں مسئلہ ہوا');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    toast.success('لاگ آؤٹ ہو گیا');
  };

  return {
    isAuthenticated,
    hasPin,
    isLoading,
    setPin,
    verifyPin,
    logout,
  };
}
