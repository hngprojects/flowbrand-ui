"use client";

import { motion } from "framer-motion";

const sections = [
  {
    title: "How do we use Cookies",
    content: (
      <p className="text-md  md:text-base">
        This Cookie Policy explains how Seil uses cookies and similar
        technologies to recognize you when you visit our website. It explains
        what these technologies are and why we use them.
      </p>
    ),
  },
  {
    title: "What are cookies",
    content: (
      <p className="text-md  md:text-base">
        Cookies are small text files stored on your device when you visit a
        website. They help websites remember your actions and preferences over
        time.
      </p>
    ),
  },
  {
    title: "What are cookies",
    content: (
      <>
        <h4 className="text-md  md:text-base">We use cookies to:</h4>
        <ol className="list-decimal list-inside">
          <li className="text-md  md:text-base mt-[2px] md:mt-[10px]">
            Keep the website functioning properly
          </li>
          <li className="text-md  md:text-base mt-[5px] md:mt-[8px]">
            Understand how users interact with our product
          </li>
          <li className="text-md  md:text-base mt-[5px] md:mt-[8px]">
            Improve performance and user experience
          </li>
          <li className="text-md  md:text-base mt-[5px] md:mt-[8px]">
            Remember your preferences and settings
          </li>
        </ol>
      </>
    ),
  },
  {
    title: "Types of cookies we use",
    content: (
      <div>
        <h3 className="mb-[12px] text-md  font-medium md:text-xl">
          Essential Cookies
        </h3>
        <p className="text-md  md:text-base">
          These are required for the website to work. They enable basic features
          like navigation and access to secure areas.
        </p>
        <h3 className="mt-[14px] mb-[12px] text-md  font-medium md:mt-[25px] md:text-xl">
          Performance Cookies
        </h3>
        <p className="text-md  md:text-base">
          These help us understand how visitors use our website so we can
          improve functionality and user experience.
        </p>
        <h3 className="mt-[14px] mb-[12px] text-md  font-medium md:mt-[25px] md:text-xl">
          Functional Cookies
        </h3>
        <p className="text-md  md:text-base">
          These remember your preferences, such as saved settings, to provide a
          more personalized experience.
        </p>
      </div>
    ),
  },
  {
    title: "Managing Cookies",
    content: (
      <p className="text-md  md:text-base">
        You can control or disable cookies through your browser settings. Please
        note that disabling certain cookies may affect how the website
        functions.
      </p>
    ),
  },
  {
    title: "Updates on this policy",
    content: (
      <p className="text-md  md:text-base">
        We may update this Cookie Policy from time to time to reflect changes in
        technology or legal requirements. Any updates will be posted on this
        page.
      </p>
    ),
  },
  {
    title: "Contact us",
    content: (
      <p className="text-md  md:text-base">
        If you have any questions about our use of cookies, please contact us
        at: seil@gmail.com
      </p>
    ),
  },
];

const CookiesPolicyView = () => {
  return (
    <>
      <motion.div
        className="flex h-[114px] flex-col items-center justify-center bg-primary-50 pt-[15px] md:h-[272px] md:pt-[0px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h1
          className="text-xl md:text-5xl "
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
        >
          Cookies Policy
        </motion.h1>
        <motion.p
          className="text-md  text-black-300  md:text-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1] as const,
            delay: 0.15,
          }}
        >
          Effective date : 10-Apr-2026
        </motion.p>
        <motion.p
          className="text-md  text-black-300  md:text-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1] as const,
            delay: 0.22,
          }}
        >
          Last updated : 10-Apr-2026
        </motion.p>
      </motion.div>

      <div className="flex flex-col section-class space-y-5">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1] as const,
              delay: 0.05 * index,
            }}
          >
            <h2 className="mb-[12px] text-base font-medium md:text-2xl">
              {section.title}
            </h2>
            {section.content}
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default CookiesPolicyView;
