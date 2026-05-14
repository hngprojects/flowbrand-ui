import { Email } from "@/icons/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
const ContactUs = () => {
  return (
    <main>
      <div className="bg-accent-50 h-[291px] md:h-[400px] w-full relative flex flex-col items-center justify-center overflow-hidden">
        <div className="max-w-[721px] space-y-section text-center px-4">
          <h1 className="text-[25px] md:text-[40px] text-black-500 font-medium">
            We would love to work with you
          </h1>

          <p className="md:text-[18px] text-black-300">
            Have a question, need support, or just want to learn more about
            seil? <br /> Reach out--we&apos;d love to hear from you.
          </p>
        </div>

        {/* ----CLOUD IMAGES---- */}
        <Image
          src="/assets/big-cloud.png"
          aria-hidden
          alt="Cloud"
          width={445}
          height={447}
          className="absolute left-0 top-0"
        />
        <Image
          src="/assets/small-cloud.png"
          aria-hidden
          alt="Cloud"
          width={286}
          height={264}
          className="absolute right-0 bottom-0 my-auto top-0"
        />
      </div>
      <div className="px-10 md:px-25 mt-10 mb-30 space-y-10 md:space-y-18">
        <div className="flex items-center gap-5">
          <div className="bg-accent rounded-full p-1.5">
            <Email className="text-white" />
          </div>

          <div>
            <h2 className="text-[14px] md:text-lg text-black-500 font-semibold">
              Email us at
            </h2>
            <p className="text-primary-800 text-[14px] md:text-[16px]">
              useseilhq@email.com
            </p>
          </div>
        </div>

        <form className="space-y-4 flex flex-col items-center md:items-end w-full">
          <div className="w-full mb-8">
            <h2 className="font-medium text-[16px] md:text-[24px]">
              Send us a message
            </h2>
            <p className="text-black-300 text-[14px] md:text-[16px]">
              Fill this in and we&apos;ll get back to you within one business day
            </p>
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="name">Full Name</Label>
            <Input placeholder="John Doe" id="name" />
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="email">Email</Label>
            <Input placeholder="you@gmail.com" id="email" />
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="business-name">Business Name</Label>
            <Input placeholder="cards & last" id="business-name" />
          </div>

          <div className="space-y-2 w-full">
            <Label>How did you week go?</Label>
            <Textarea
              placeholder="Tell us how your week went"
              className="min-h-[100px]"
            />
          </div>

          <Button disabled className="text-primary-900 w-full md:w-[345px]">
            Submit
          </Button>
        </form>
      </div>
    </main>
  );
};

export default ContactUs;
