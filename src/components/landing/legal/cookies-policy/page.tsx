const CookiesPolicyView = () => {
  return (
    <>
      <div className="flex h-[114px] flex-col items-center justify-center bg-[#EBF0FA] pt-[15px] md:h-[272px] md:pt-[0px]">
        <h1 className="text-[20px] md:text-[40px]">Cookies Policy</h1>
        <p className="text-[14px] text-[#565D69] md:text-[20px]">
          Effective date : 10-Apr-2026
        </p>
        <p className="text-[14px] text-[#565D69] md:text-[20px]">
          Last updated : 10-Apr-2026
        </p>
      </div>

      <div className="flex flex-col section-class space-y-5">
        <div>
          <h2 className="mb-[12px] text-[16px] font-[500] md:text-[24px]">
            How do we use Cookies
          </h2>
          <p className="text-[14px] md:text-[16px]">
            This Cookie Policy explains how Seil uses cookies and similar
            technologies to recognize you when you visit our website. It
            explains what these technologies are and why we use them.
          </p>
        </div>

        <div>
          <h2 className="mb-[12px] text-[16px] font-[500] md:text-[24px]">
            What are cookies
          </h2>
          <p className="text-[14px] md:text-[16px]">
            Cookies are small text files stored on your device when you visit a
            website. They help websites remember your actions and preferences
            over time.
          </p>
        </div>
        <div>
          <h2 className="font-[500] mb-[12px] text-[16px] md:text-[24px]">
            What are cookies
          </h2>
          <h4 className="text-[14px] md:text-[16px]">We use cookies to:</h4>
          <ol className="list-decimal list-inside">
            <li className="text-[14px] md:text-[16px] mt-[2px] md:mt-[10px]">
              Keep the website functioning properly
            </li>
            <li className="text-[14px] md:text-[16px] mt-[5px] md:mt-[8px]">
              Understand how users interact with our product
            </li>
            <li className="text-[14px] md:text-[16px] mt-[5px] md:mt-[8px]">
              Improve performance and user experience
            </li>
            <li className="text-[14px] md:text-[16px] mt-[5px] md:mt-[8px]">
              Remember your preferences and settings
            </li>
          </ol>
        </div>

        <div>
          <h2 className="mb-[12px] text-[16px] font-[500] md:text-[24px]">
            Types of cookies we use
          </h2>
          <div>
            <h3 className="mb-[12px] text-[14px] font-[500] md:text-[20px]">
              Essential Cookies
            </h3>
            <p className="text-[14px] md:text-[16px]">
              These are required for the website to work. They enable basic
              features like navigation and access to secure areas.
            </p>
            <h3 className="mt-[14px] mb-[12px] text-[14px] font-[500] md:mt-[25px] md:text-[20px]">
              Performance Cookies
            </h3>
            <p className="text-[14px] md:text-[16px]">
              These help us understand how visitors use our website so we can
              improve functionality and user experience.
            </p>
            <h3 className="mt-[14px] mb-[12px] text-[14px] font-[500] md:mt-[25px] md:text-[20px]">
              Functional Cookies
            </h3>
            <p className="text-[14px] md:text-[16px]">
              These remember your preferences, such as saved settings, to
              provide a more personalized experience.
            </p>
          </div>
        </div>

        <div>
          <h2 className="mb-[12px] text-[16px] font-[500] md:text-[24px]">
            Managing Cookies
          </h2>
          <p className="text-[14px] md:text-[16px]">
            You can control or disable cookies through your browser settings.
            Please note that disabling certain cookies may affect how the
            website functions.
          </p>
        </div>
        <div>
          <h2 className="mb-[12px] text-[16px] font-[500] md:text-[24px]">
            Updates on this policy
          </h2>
          <p className="text-[14px] md:text-[16px]">
            We may update this Cookie Policy from time to time to reflect
            changes in technology or legal requirements. Any updates will be
            posted on this page.
          </p>
        </div>
        <div>
          <h2 className="mb-[12px] text-[16px] font-[500] md:text-[24px]">
            Contact us
          </h2>
          <p className="text-[14px] md:text-[16px]">
            If you have any questions about our use of cookies, please contact
            us at: seil@gmail.com
          </p>
        </div>
      </div>
    </>
  );
};

export default CookiesPolicyView;
