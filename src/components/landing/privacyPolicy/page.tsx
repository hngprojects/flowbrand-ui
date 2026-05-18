const PrivacyPolicyView = () => {
  return (
    <>
      <div className="flex h-[114px] md:h-[272px] flex-col items-center justify-center bg-[#EBF0FA] pt-[15px] md:pt-[0px]">
        <h1 className="text-[20px] md:text-[40px]">Privacy Policy</h1>
        <p className="text-[14px] md:text-[20px] text-[#565D69]">
          Last updated : 10-Apr-2026
        </p>
      </div>

      <div className="flex flex-col section-class space-y-5">
        <div>
          <h2 className="text-[16px] md:text-[24px] font-[500] mb-[12px]">
            Your privacy matters to us
          </h2>
          <p className="text-[14px] md:text-[16px]">
            This Privacy Policy explains how Seil collects, uses, and protects
            the information you share when using the platform. It is written in
            plain language so you can clearly understand how your data is
            handled.
            <span className="block mt-[8px] md:mt-[16px]">
              By using Seil, you agree to the practices described in this
              policy.
            </span>
          </p>
        </div>

        <div>
          <h2 className="font-[500] text-[16px] md:text-[24px] mb-[12px]">
            How we use your information
          </h2>
          <p className="text-[14px] md:text-[16px]">
            Your information is used to generate tailored marketing
            recommendations, maintain your account, and improve the overall Seil
            experience.
            <span className="block mt-[8px] md:mt-[16px]">
              We may also use aggregated, non-identifiable data to analyze
              trends and refine the quality of our suggestions.
            </span>
          </p>
        </div>

        <div>
          <h2 className="text-[16px] md:text-[24px] font-[500] mb-[12px]">
            Data sharing
          </h2>
          <p className="text-[14px] md:text-[16px]">
            We do not sell your personal information. We only share data with
            trusted service providers that help us operate the platform, and
            only to the extent necessary to deliver our services.
            <span className="block mt-[8px] md:mt-[16px]">
              We may disclose information when required by law or to protect the
              rights, safety, and integrity of Seil and its users.
            </span>
          </p>
        </div>

        <div>
          <h2 className="text-[16px] md:text-[24px] font-[500] mb-[12px]">
            Data security
          </h2>
          <p className="text-[14px] md:text-[16px]">
            We apply reasonable technical and organizational measures to protect
            your information from unauthorized access, loss, or misuse.
            <span className="block mt-[8px] md:mt-[16px]">
              While no system can be guaranteed to be completely secure, we
              continuously work to safeguard your data and respond promptly to
              any concerns.
            </span>
          </p>
        </div>

        <div>
          <h2 className="text-[16px] md:text-[24px] font-[500] mb-[12px]">
            Your rights
          </h2>
          <p className="text-[14px] md:text-[16px]">
            You have the right to access, update, or request deletion of the
            personal information we hold about you. You can manage most details
            directly from your account settings.
            <span className="block mt-[8px] md:mt-[16px]">
              For any additional requests, you may contact us and we will
              respond within a reasonable timeframe.
            </span>
          </p>
        </div>

        <div>
          <h2 className="text-[16px] md:text-[24px] font-[500] mb-[12px]">
            Changes to the policy
          </h2>
          <p className="text-[14px] md:text-[16px]">
            We may update this Privacy Policy from time to time to reflect
            changes in the platform, our services, or applicable regulations.
            <span className="block mt-[8px] md:mt-[16px]">
              When meaningful updates are made, we will take reasonable steps to
              inform users so they remain aware of how their information is
              handled.
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyView;
