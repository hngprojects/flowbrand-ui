"use client";
import SideBar from "@/components/SideBar";
import Navbar from "@/components/navigation/navbar";
import { LoadingIcon } from "@/components/icons/loading-icon";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { StrategyIcon } from "@/components/icons/strategy";
import { LinkIcon } from "@/components/icons/link";
const Funnel = () => {
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState<React.ReactNode>(
    "We are building your marketing strategy...",
  );
  useEffect(() => {
    const loadingSteps = [
      <div key={"step-1"} className="flex flex-col gap-4">
        <h3 className="text-[16px] text-black-300">Information Provided</h3>

        <p className="text-[18px] text-gray-900  p-3">
          I sell small chops and pastries for events and walk in customers who
          are typically Young women in Lagos who want affordable snacks. I get
          most of my customers from TikTok...
        </p>

        <div className="p-3 mt-2">
          <p className="text-[16px] text-foreground">
            We have created a tailored marketing strategy for your unique use
            case and problem.
          </p>
        </div>
      </div>,
    ];

    let currentStep = 0;

    const stepInterval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        setSteps(loadingSteps[currentStep]);
        currentStep++;
      }
    }, 2000);

    const timer = setTimeout(() => {
      clearInterval(stepInterval);

      setLoading(false);
    }, 5000);
    return () => {
      clearInterval(stepInterval);
      clearTimeout(timer);
    };
  }, []);
  return (
    <>
      <Navbar />
      <div className="flex">
        <SideBar steps={steps} loading={loading} />
        <div className="md:w-2/3 w-full p-default">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-screen w-full gap-default">
              <LoadingIcon className="animate-spin" />
              <p className="text-[16px] text-black-300">
                Building your marketing strategy...
              </p>
            </div>
          ) : (
            <div className="space-y-large flex flex-col items-end w-full">
              <div className="w-full">
                <div className="flex justify-between text-[16px] text-black-300">
                  <p>This week&apos;s focus</p>
                  <p>1 of 4</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[24px] text-foreground flex items-center gap-[12px] ">
                    <StrategyIcon /> Get Noticed
                  </p>
                  <p className="md:text-[16px] text-[14px] text-black-300">
                    To get noticed, help people discover your product for the
                    first time, using these methods outlined below.
                  </p>
                </div>
              </div>

              <div className="space-y-default w-full">
                <div className="w-full space-y-2 border border-gray-500 rounded-[18px] p-section bg-[#FFFFFF]">
                  <div className="flex items-center justify-between">
                    <h2>Clear Description</h2>
                    <input type="checkbox" />
                  </div>
                  <div className="text-black-300 text-sm space-y-3">
                    <p>
                      When describing your product, it&apos;s essential to
                      provide a comprehensive overview that not only highlights
                      its features but also educates potential customers on its
                      benefits and applications. Start by detailing what the
                      product is, its primary functions, and the problems it
                      solves. For instance, if you&apos;re selling a smart home
                      device, explain how it can enhance convenience and
                      security in daily life.
                    </p>

                    <p>
                      Incorporate examples to illustrate your points. For
                      example, you might say, &quot;Imagine being able to
                      control your home lighting and temperature from your
                      smartphone, no matter where you are. This not only saves
                      energy but also allows for a personalized living
                      environment.&quot;
                    </p>

                    <p>
                      By creating a detailed and informative product
                      description, you can engage your audience effectively and
                      encourage them to explore your offering further.
                    </p>

                    <div>
                      <p className="text-[14px] text-black-300 capitalize">
                        More Resources
                      </p>
                      <div className="flex items-center gap-[4px]">
                        <LinkIcon />
                        <p className="text-sm text-primary">
                          https//www.share-images.com
                        </p>
                      </div>
                      <div className="flex items-center gap-[4px]">
                        <LinkIcon />
                        <p className="text-sm text-primary">
                          https//www.social-media-marketing/series.com
                        </p>
                      </div>
                      <div className="flex items-center gap-[4px]">
                        <LinkIcon />
                        <p className="text-sm text-primary">
                          https//www.frigbom/entertainment.com
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-default w-full">
                <div className="w-full space-y-2 border border-gray-500 rounded-[18px] p-section bg-[#FFFFFF]">
                  <div className="flex items-center justify-between">
                    <h2>Post Weekly</h2>
                    <input type="checkbox" />
                  </div>
                  <div className="text-black-300 text-sm space-y-3">
                    <p>
                      Share three captivating photos of your product each week
                      to enhance your marketing strategy. Consistent posting not
                      only keeps your audience engaged but also showcases your
                      product&apos;s features and benefits. By regularly
                      updating your followers with fresh visuals, you can
                      attract new customers and nurture existing relationships,
                      ultimately driving more sales.
                    </p>

                    <div>
                      <p className="text-[14px] text-black-300 capitalize">
                        More Resources
                      </p>
                      <div className="flex items-center gap-[4px]">
                        <LinkIcon />
                        <p className="text-sm text-primary">
                          https//www.share-images.com
                        </p>
                      </div>
                      <div className="flex items-center gap-[4px]">
                        <LinkIcon />
                        <p className="text-sm text-primary">
                          https//www.social-media-marketing/series.com
                        </p>
                      </div>
                      <div className="flex items-center gap-[4px]">
                        <LinkIcon />
                        <p className="text-sm text-primary">
                          https//www.frigbom/entertainment.com
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-default w-full">
                <div className="w-full space-y-2 border border-gray-500 rounded-[18px] p-section bg-[#FFFFFF]">
                  <div className="flex items-center justify-between">
                    <h2>Visual Proof</h2>
                    <input type="checkbox" />
                  </div>
                  <div className="text-black-300 text-sm space-y-3">
                    <p>
                      Share three captivating photos of your product each week
                      to enhance your marketing strategy. Consistent posting not
                      only keeps your audience engaged but also showcases your
                      product&apos;s features and benefits. By regularly
                      updating your followers with fresh visuals, you can
                      attract new customers and nurture existing relationships,
                      ultimately driving more sales.
                    </p>

                    <div>
                      <p className="text-[14px] text-black-300 capitalize">
                        More Resources
                      </p>
                      <div className="flex items-center gap-[4px]">
                        <LinkIcon />
                        <p className="text-sm text-primary">
                          https//www.share-images.com
                        </p>
                      </div>
                      <div className="flex items-center gap-[4px]">
                        <LinkIcon />
                        <p className="text-sm text-primary">
                          https//www.social-media-marketing/series.com
                        </p>
                      </div>
                      <div className="flex items-center gap-[4px]">
                        <LinkIcon />
                        <p className="text-sm text-primary">
                          https//www.frigbom/entertainment.com
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-default w-full">
                <div className="w-full space-y-2 border border-gray-500 rounded-[18px] p-section bg-[#FFFFFF]">
                  <div className="flex items-center justify-between">
                    <h2>Social Proof</h2>
                    <input type="checkbox" />
                  </div>
                  <div className="text-black-300 text-sm space-y-3">
                    <p>
                      Customer feedback is invaluable for any business, as it
                      provides insights into the customer experience and
                      highlights areas for improvement. For instance, consider a
                      review from Sarah, a recent customer of our software. She
                      mentioned how our platform streamlined her workflow,
                      saving her hours each week. Sarah appreciated the
                      user-friendly interface and the responsive customer
                      support team that helped her navigate any challenges. Her
                      feedback not only reassured potential users about the
                      effectiveness of our product but also motivated our team
                      to continue enhancing features based on user needs.
                      Sharing such reviews is crucial because they build trust
                      and credibility, showing that real people benefit from our
                      services. By listening to our customers, we can adapt and
                      grow, ensuring we meet their expectations and maintain a
                      competitive edge.
                    </p>

                    <div>
                      <p className="text-[14px] text-black-300 capitalize">
                        More Resources
                      </p>
                      <div className="flex items-center gap-[4px]">
                        <LinkIcon />
                        <p className="text-sm text-primary">
                          https//www.share-images.com
                        </p>
                      </div>
                      <div className="flex items-center gap-[4px]">
                        <LinkIcon />
                        <p className="text-sm text-primary">
                          https//www.social-media-marketing/series.com
                        </p>
                      </div>
                      <div className="flex items-center gap-[4px]">
                        <LinkIcon />
                        <p className="text-sm text-primary">
                          https//www.frigbom/entertainment.com
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-[310px] rounded-[10px] bg-primary-100">
                Submit
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Funnel;
