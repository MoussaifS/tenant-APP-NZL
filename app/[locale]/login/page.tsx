'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { useAuth } from '../../components/AuthProvider';
import Logo from '../../../assets/NZL-LOGO-New.svg';
import { getMessages } from '@/messages';


console.log("this is the logo", Logo);
// Translations moved to messages folder

export default function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [locale, setLocale] = useState('en');
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get locale from params
    params.then(({ locale: paramLocale }) => {
      setLocale(paramLocale || 'en');
    });
  }, [params]);

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      router.push(`/${locale}`);
    }
  }, [isAuthenticated, locale, router]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 10) { // Allow up to 10 digits for booking reference
      setAccessCode(value);
      setError(''); // Clear error when user types
    }
  };

  const handleLogin = async () => {
    if (accessCode.length < 3) { // Minimum 3 digits for booking reference
      setError('MISSING_REFERENCE:' + getMessages(locale as 'en' | 'ar').codeRequired);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await login(accessCode);
      
      if (result.success) {
        router.push(`/${locale}`);
      } else {
        // Pass error code to display different error styles
        console.log('Login result:', result);
        const errorPrefix = result.errorCode ? `${result.errorCode}:` : '';
        const errorMessage = result.error || getMessages(locale as 'en' | 'ar').invalidCode;
        // Ensure error message is always a string
        const safeErrorMessage = typeof errorMessage === 'string' ? errorMessage : String(errorMessage);
        console.log('Setting error:', errorPrefix + safeErrorMessage);
        setError(errorPrefix + safeErrorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('CONNECTION_ERROR:An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  if (isAuthenticated) {
    return null; // Will redirect
  }

  const t = getMessages(locale as 'en' | 'ar');
  const isRTL = locale === 'ar';

  // Parse error to get error code and message
  const getErrorDisplay = (error: string, currentLocale: string): {
    code: string;
    message: string;
    variant: 'destructive';
    icon: string;
    className: string;
  } => {
    console.log('getErrorDisplay called with:', error, typeof error);
    
    if (!error) {
      return {
        code: '',
        message: '',
        variant: 'destructive',
        icon: '⚠️',
        className: 'border-red-200 bg-red-50 text-red-900'
      };
    }
    
    const parts = error.includes(':') ? error.split(':') : ['', error];
    const code = parts[0];
    let message = parts.slice(1).join(':');
    
    console.log('Parsed error - code:', code, 'message:', message);
    
    // Ensure message is always a string
    if (typeof message !== 'string') {
      message = String(message);
    }
    
    // Define different styles for each error type
    const errorStyles = {
      'MISSING_REFERENCE': {
        variant: 'destructive' as const,
        icon: '📝',
        className: 'border-amber-200 bg-amber-50 text-amber-900'
      },
      'INVALID_REFERENCE': {
        variant: 'destructive' as const,
        icon: '❌',
        className: 'border-red-300 bg-red-50 text-red-900'
      },
      'TOO_EARLY': {
        variant: 'destructive' as const,
        icon: '⏰',
        className: 'border-blue-200 bg-blue-50 text-blue-900'
      },
      'TOO_LATE': {
        variant: 'destructive' as const,
        icon: '🔒',
        className: 'border-orange-300 bg-orange-50 text-orange-900'
      },
      'SERVER_ERROR': {
        variant: 'destructive' as const,
        icon: '⚠️',
        className: 'border-red-200 bg-red-50 text-red-900'
      },
      'CONNECTION_ERROR': {
        variant: 'destructive' as const,
        icon: '🌐',
        className: 'border-gray-300 bg-gray-50 text-gray-900'
      }
    };

    const style = errorStyles[code as keyof typeof errorStyles] || errorStyles['SERVER_ERROR'];
    
    // Add support contact for certain error types
    const errorsWithSupportContact = ['TOO_LATE', 'SERVER_ERROR', 'CONNECTION_ERROR'];
    let finalMessage = message;
    
    if (errorsWithSupportContact.includes(code)) {
      const supportText = getMessages(currentLocale as 'en' | 'ar').supportContact;
      finalMessage = message + (message ? ' ' : '') + supportText;
    }
    
    return {
      code,
      message: finalMessage,
      ...style
    };
  };

  const errorDisplay = getErrorDisplay(error, locale);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Welcome Section */}
        <div className="text-center mb-8 flex justify-center">
          <img src={Logo.src} alt="Nuzul Logo" className="w-100 h-20" />
        </div>
        {/* Login Card */}
        <Card className="border border-gray-300 bg-white shadow-xl">
          <CardHeader className="text-center bg-[#CDB990] bg-opacity-10 border-b border-[#C1B29E] border-opacity-30">
            <CardTitle className={`text-xl font-bold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t.title}  🏠
            </CardTitle>
            <CardDescription className={`text-gray-700 font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
              {t.description}
            </CardDescription>
          </CardHeader>
          <CardContent >
            {error && (
              <Alert variant={errorDisplay.variant} className={errorDisplay.className}>
                <AlertDescription className="font-medium flex items-start gap-2">
                  <span className="text-lg">{errorDisplay.icon}</span>
                  <span>{errorDisplay.message}</span>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <div className="space-y-2">
                <label 
                  htmlFor="accessCode" 
                  className={`text-sm font-bold text-gray-800 ${isRTL ? 'text-right block' : 'text-left block'}`}
                >
                  {t.codeLabel}
                </label>
                <div className="relative">
                  <Input
                    id="accessCode"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder={t.codePlaceholder}
                    value={accessCode}
                    onChange={handleCodeChange}
                    onKeyPress={handleKeyPress}
                    className={`text-center text-xl tracking-widest border-gray-300 focus:border-[#C1B29E] focus:ring-[#C1B29E] py-4 ${isRTL ? 'text-right' : 'text-left'}`}
                    maxLength={10}
                    disabled={isLoading}
                  />
                  {/* <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {accessCode.length}/10
                    </div>
                  </div> */}
                </div>
                <div className={`text-xs text-gray-600 font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                  {accessCode.length > 0 ? `${accessCode.length} digits entered` : 'Enter your booking reference'}
                </div>
              </div>

              <Button 
                onClick={handleLogin} 
                className="w-full bg-[#C1B29E] hover:bg-[#CDB990] text-white font-bold py-3 text-lg" 
                disabled={isLoading || accessCode.length < 3}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t.loading}
                  </div>
                ) : (
                  t.loginButton
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
