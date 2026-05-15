import { RegisterForm } from '@/components/features/auth/RegisterForm';
import Image from 'next/image';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#020B1D] md:grid md:grid-cols-2">
      
      {/* Sidebar marketing (gauche) avec logo */}
      <div className="hidden md:flex bg-[#17356D] p-16 flex-col justify-center">
        <div className="max-w-md">
          {/* Logo en haut de la sidebar */}
          <div className="mb-8">
            <Image
              src="/logo.png"
              alt="Seil Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </div>
          {/* Badge */}
          <div className="text-xs font-medium text-[#B8C1D1] mb-4">
            No marketing experience needed
          </div>
          {/* Titre */}
          <h1 className="text-4xl font-semibold text-white leading-tight mb-4">
            Marketing strategies, made human.
          </h1>
          {/* Description */}
          <p className="text-lg text-[#B8C1D1] leading-8 mb-6">
            A solution designed to accelerate your business growth efficiently, meeting your needs without the necessity of a marketing degree.
          </p>
          {/* Liste */}
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-[#B8C1D1]">
              <span className="text-[#2F6BFF] text-xl">✓</span>
              Step-by-step simple guided setup.
            </li>
            <li className="flex items-start gap-2 text-[#B8C1D1]">
              <span className="text-[#2F6BFF] text-xl">✓</span>
              Tailored solutions for your business needs.
            </li>
            <li className="flex items-start gap-2 text-[#B8C1D1]">
              <span className="text-[#2F6BFF] text-xl">✓</span>
              Built for non-marketers.
            </li>
          </ul>
        </div>
      </div>

      {/* Formulaire Register (droite) – sans logo */}
      <div className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}