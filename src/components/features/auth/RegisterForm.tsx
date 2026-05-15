'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';

// Schéma de validation avec confirmation du mot de passe
const registerSchema = z.object({
  fullName: z.string().min(2, 'Nom complet requis'),
  email: z.string().email('Email invalide'),
  country: z.string().min(1, 'Pays requis'),
  password: z.string().min(6, '6 caractères minimum'),
  confirmPassword: z.string().min(6, 'Confirmation requise'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setError('');
    try {
      // Simuler une inscription (remplacer par appel API plus tard)
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log('Inscription réussie', data);
      // Rediriger vers login après inscription
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'inscription');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Full name */}
      <div>
        <label className="block text-sm font-medium text-[#B8C1D1] mb-1">
          Full name
        </label>
        <input
          type="text"
          {...register('fullName')}
          className="w-full h-12 px-4 rounded-md border border-[#2E4D7B] bg-transparent text-white text-sm placeholder:text-[#7E8CA0] focus:outline-none focus:ring-2 focus:ring-[#2F6BFF] focus:border-transparent"
          placeholder="John Doe"
        />
        {errors.fullName && (
          <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-[#B8C1D1] mb-1">
          Email address
        </label>
        <input
          type="email"
          {...register('email')}
          className="w-full h-12 px-4 rounded-md border border-[#2E4D7B] bg-transparent text-white text-sm placeholder:text-[#7E8CA0] focus:outline-none focus:ring-2 focus:ring-[#2F6BFF] focus:border-transparent"
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Country */}
      <div>
        <label className="block text-sm font-medium text-[#B8C1D1] mb-1">
          Country
        </label>
        <select
          {...register('country')}
          className="w-full h-12 px-4 rounded-md border border-[#2E4D7B] bg-transparent text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2F6BFF] appearance-none"
        >
          <option value="">Select a country</option>
          <option value="FR">France</option>
          <option value="US">United States</option>
          <option value="UK">United Kingdom</option>
          <option value="CA">Canada</option>
        </select>
        {errors.country && (
          <p className="text-red-400 text-xs mt-1">{errors.country.message}</p>
        )}
      </div>

      {/* Password avec œil */}
      <div>
        <label className="block text-sm font-medium text-[#B8C1D1] mb-1">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            className="w-full h-12 px-4 rounded-md border border-[#2E4D7B] bg-transparent text-white text-sm placeholder:text-[#7E8CA0] focus:outline-none focus:ring-2 focus:ring-[#2F6BFF] pr-10"
            placeholder="••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#7E8CA0] hover:text-white"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password avec œil */}
      <div>
        <label className="block text-sm font-medium text-[#B8C1D1] mb-1">
          Confirm password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword')}
            className="w-full h-12 px-4 rounded-md border border-[#2E4D7B] bg-transparent text-white text-sm placeholder:text-[#7E8CA0] focus:outline-none focus:ring-2 focus:ring-[#2F6BFF] pr-10"
            placeholder="••••••"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#7E8CA0] hover:text-white"
          >
            {showConfirmPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Terms text */}
      <p className="text-sm text-[#7E8CA0]">
        By signing up you agree to our{' '}
        <a href="/terms" className="text-[#3B82F6] hover:underline">
          Terms & Privacy
        </a>
      </p>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      {/* Register button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#2F6BFF] hover:bg-[#2459D6] text-white py-3 rounded-md font-semibold transition mt-2"
      >
        {isLoading ? 'Création...' : 'Create account'}
      </Button>

      {/* Link to login */}
      <p className="text-center text-sm text-[#7E8CA0] mt-6">
        Already have an account?{' '}
        <a href="/login" className="text-[#3B82F6] font-medium hover:underline">
          Log in
        </a>
      </p>

      {/* Google button */}
      <button
        type="button"
        className="w-full border border-[#2E4D7B] bg-transparent text-white py-2.5 rounded-md font-medium flex items-center justify-center gap-2 hover:bg-white/5 transition"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>
    </form>
  );
}