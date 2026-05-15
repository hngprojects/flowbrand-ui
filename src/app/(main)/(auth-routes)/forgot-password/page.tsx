import { ForgotPasswordForm } from '@/components/features/auth/ForgotPasswordForm';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] md:grid md:grid-cols-2">
      
      {/* Sidebar marketing (gauche) */}
      <div className="hidden md:flex bg-[#E7EBF4] p-16 flex-col justify-center">
        <div className="max-w-md">
          {/* Logo (optionnel) */}
          <div className="mb-8">
            <Image
              src="/logo.png"
              alt="Seil Logo"
              width={100}
              height={32}
              className="h-8 w-auto"
            />
          </div>
          <h2 className="text-4xl font-semibold text-[#1E3A70] leading-tight mb-4">
            Marketing strategies, made human.
          </h2>
          <p className="text-lg text-[#7B7B7B] leading-8 mb-6">
            A solution designed to accelerate your business growth efficiently, meeting your needs without the necessity of a marketing degree.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-[#7B7B7B]">
              <span className="text-[#3B6DE0] text-xl">✓</span>
              Step-by-step simple guided setup.
            </li>
            <li className="flex items-start gap-2 text-[#7B7B7B]">
              <span className="text-[#3B6DE0] text-xl">✓</span>
              Tailored solutions for your business needs.
            </li>
            <li className="flex items-start gap-2 text-[#7B7B7B]">
              <span className="text-[#3B6DE0] text-xl">✓</span>
              Built for non-marketers.
            </li>
          </ul>
        </div>
      </div>

      {/* Forgot Password Form (droite) */}
      <div className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-semibold text-[#1E3A70] leading-tight mb-2">
            Forgot your password?
          </h1>
          <p className="text-lg text-[#7B7B7B] leading-8 mb-6">
            No worries. Just enter your email address and we’ll send you a reset link.
          </p>
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}