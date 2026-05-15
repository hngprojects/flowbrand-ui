'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const sections = [
  { id: 'overview', title: 'Overview' },
  { id: 'use-of-platform', title: 'Use of the Platform' },
  { id: 'user-responsibilities', title: 'User Responsibilities' },
  { id: 'generated-content', title: 'Generated Content' },
  { id: 'account-access', title: 'Account & Access' },
  { id: 'limitation-liability', title: 'Limitation of Liability' },
  { id: 'changes-terms', title: 'Changes to the Terms' },
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* Navbar avec logo et bouton Back */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-white">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Seil Logo" width={100} height={32} className="h-8 w-auto" />
          <span className="text-xl font-semibold text-[#0F172A]">Seil</span>
        </div>
        <Link
          href="/register"
          className="rounded-full border border-[#E5E7EB] px-5 py-2 flex items-center gap-2 text-sm font-medium text-[#111827] bg-white hover:bg-gray-50 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </Link>
      </header>

      <div className="grid md:grid-cols-[270px_1fr]">
        {/* Sidebar Table of Contents */}
        <aside className="hidden md:block border-r border-[#E5E7EB] bg-white px-6 py-8 sticky top-0 h-screen overflow-y-auto">
          <h3 className="text-lg font-semibold text-[#0F172A] mb-6">Contents</h3>
          <nav className="space-y-6">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection(section.id);
                  document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`block text-lg transition ${
                  activeSection === section.id
                    ? 'text-[#2563EB] border-l-2 border-[#2563EB] pl-4 -ml-4'
                    : 'text-[#374151] hover:text-[#2563EB]'
                }`}
              >
                {section.title}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="px-6 md:px-10 py-8 md:py-12 max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-semibold text-[#0F172A] leading-tight mb-4">
            Terms and Conditions
          </h1>
          <p className="text-sm font-semibold text-[#374151] mb-8">Last updated: May 15, 2026</p>

          <div className="space-y-8">
            {/* Overview */}
            <section id="overview">
              <h2 className="text-base font-semibold text-[#111827] mb-3">Overview</h2>
              <p className="text-base leading-7 text-[#374151]">
                Welcome to Seil. By accessing or using our platform, you agree to comply with and be bound by these Terms and Conditions. Please read them carefully.
              </p>
            </section>

            <hr className="border-[#E5E7EB] my-8" />

            {/* Use of the Platform */}
            <section id="use-of-platform">
              <h2 className="text-base font-semibold text-[#111827] mb-3">1. Use of the Platform</h2>
              <p className="text-base leading-7 text-[#374151] mb-3">
                You agree to use the platform only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account.
              </p>
              <p className="text-base leading-7 text-[#374151]">
                You may not use the platform in any way that could damage, disable, or impair our services.
              </p>
            </section>

            <hr className="border-[#E5E7EB] my-8" />

            {/* User Responsibilities */}
            <section id="user-responsibilities">
              <h2 className="text-base font-semibold text-[#111827] mb-3">2. User Responsibilities</h2>
              <p className="text-base leading-7 text-[#374151]">
                You are solely responsible for any content you submit, post, or display on the platform. You warrant that you own or have the necessary licenses to use such content.
              </p>
            </section>

            <hr className="border-[#E5E7EB] my-8" />

            {/* Generated Content */}
            <section id="generated-content">
              <h2 className="text-base font-semibold text-[#111827] mb-3">3. Generated Content</h2>
              <p className="text-base leading-7 text-[#374151]">
                Seil may generate content based on your inputs. While we strive for accuracy, we do not guarantee the completeness or reliability of generated content.
              </p>
            </section>

            <hr className="border-[#E5E7EB] my-8" />

            {/* Account & Access */}
            <section id="account-access">
              <h2 className="text-base font-semibold text-[#111827] mb-3">4. Account & Access</h2>
              <p className="text-base leading-7 text-[#374151]">
                You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized access. We reserve the right to suspend or terminate accounts that violate these Terms.
              </p>
            </section>

            <hr className="border-[#E5E7EB] my-8" />

            {/* Limitation of Liability */}
            <section id="limitation-liability">
              <h2 className="text-base font-semibold text-[#111827] mb-3">5. Limitation of Liability</h2>
              <p className="text-base leading-7 text-[#374151]">
                To the fullest extent permitted by law, Seil shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.
              </p>
            </section>

            <hr className="border-[#E5E7EB] my-8" />

            {/* Changes to the Terms */}
            <section id="changes-terms">
              <h2 className="text-base font-semibold text-[#111827] mb-3">6. Changes to the Terms</h2>
              <p className="text-base leading-7 text-[#374151]">
                We may update these Terms from time to time. Continued use of the platform after changes constitutes acceptance of the new Terms.
              </p>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-[#E5E7EB] text-sm text-[#374151]">
            <p>© {new Date().getFullYear()} Seil. All rights reserved.</p>
          </div>
        </main>
      </div>
    </div>
  );
}