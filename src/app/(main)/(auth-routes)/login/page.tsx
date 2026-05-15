import { LoginForm } from '@/components/features/auth/LoginForm';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Logo en haut à gauche */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-10">
        <Image
          src="/logo.png"
          alt="Seil Logo"
          width={120}
          height={40}
          className="h-10 w-auto"
        />
      </div>

      {/* Conteneur des deux colonnes */}
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* COLONNE GAUCHE – SIDEBAR MARKETING */}
        <div className="hidden md:flex flex-1 bg-[#EBF0FA] items-center justify-center p-12">
          <div className="max-w-md">
            <h2 className="text-2xl font-medium text-[#152D58] mb-4">
              Marketing strategies, made human.
            </h2>
            <p className="text-[#32476D] mb-6">
              A solution designed to accelerate your business growth efficiently, meeting your needs without the necessity of a marketing degree.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-[#32476D]">
                <span className="text-[#326AD1] text-xl">✓</span>
                Step-by-step simple guided setup.
              </li>
              <li className="flex items-start gap-2 text-[#32476D]">
                <span className="text-[#326AD1] text-xl">✓</span>
                Tailored solutions for your business needs.
              </li>
              <li className="flex items-start gap-2 text-[#32476D]">
                <span className="text-[#326AD1] text-xl">✓</span>
                Built for non-marketers.
              </li>
            </ul>
          </div>
        </div>

        {/* COLONNE DROITE – FORMULAIRE */}
        <div className="flex-1 bg-white flex flex-col justify-center p-6 md:p-12">
          <div className="w-full max-w-md mx-auto md:mx-0">
            <h1 className="text-3xl md:text-4xl font-semibold text-[#030D1F] mb-2">
              Welcome back
            </h1>
            <p className="text-[#32476D] mb-8">
              Log in to keep building your marketing strategy.
            </p>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}