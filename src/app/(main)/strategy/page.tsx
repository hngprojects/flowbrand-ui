"use client";

import { useMemo, useState } from "react";
import { Check, CircleHelp, FileText } from "lucide-react";

type ResourceLink = {
  label: string;
  href: string;
};

type Task = {
  id: number;
  title: string;
  description: string;
  resources: ResourceLink[];
};

type StrategySection = {
  id: string;
  title: string;
  subtitle: string;
  progress: string;
  step: number;
  tasks: Task[];
};

const resources = [
  {
    label: "https//www.share-images.com",
    href: "#",
  },
  {
    label: "https//www.social-media-marketing/series.com",
    href: "#",
  },
  {
    label: "https//www.frigbom/entertainment.com",
    href: "#",
  },
];

const STRATEGIES: StrategySection[] = [
  {
    id: "get-noticed",
    title: "Get Noticed",
    subtitle:
      "To get noticed, help people discover your product for the first time, using these methods outlined below.",
    progress: "5/5 task this week",
    step: 1,

    tasks: [
      {
        id: 1,
        title: "Clear Description",
        description:
          "When describing your product, it's essential to provide a comprehensive overview that not only highlights its features but also educates potential customers on its benefits and applications.\n\nStart by detailing what the product is, its primary functions, and the problems it solves. For instance, if you're selling a smart home device, explain how it can enhance convenience and security in daily life.\n\nIncorporate examples to illustrate your points. For example, you might say, 'Imagine being able to control your home lighting and temperature from your smartphone, no matter where you are. This not only saves energy but also allows for a personalized living environment.'\n\nBy creating a detailed and informative product description, you can engage your audience effectively and encourage them to explore your offering further.",
        resources,
      },

      {
        id: 2,
        title: "Post Weekly",
        description:
          "Share three captivating photos of your product each week to enhance your marketing strategy. Consistent posting not only keeps your audience engaged but also showcases your product's features and benefits.\n\nBy regularly updating your followers with fresh visuals, you can attract new customers and nurture existing relationships, ultimately driving more sales.",
        resources,
      },

      {
        id: 3,
        title: "Visual Proof",
        description:
          "Share three captivating photos of your product each week to enhance your marketing strategy. Consistent posting not only keeps your audience engaged but also showcases your product's features and benefits.\n\nBy regularly updating your followers with fresh visuals, you can attract new customers and nurture existing relationships, ultimately driving more sales.",
        resources,
      },

      {
        id: 4,
        title: "Social Proof",
        description:
          "Customer feedback is invaluable for any business, as it provides insights into the customer experience and highlights areas for improvement.\n\nFor instance, consider a review from Sarah, a recent customer of our software. She mentioned how our platform streamlined her workflow, saving her hours each week. Sarah appreciated the user-friendly interface and the responsive customer support team that helped her navigate any challenges.\n\nHer feedback not only reassured potential users about the effectiveness of our product but also motivated our team to continue enhancing features based on user needs.\n\nSharing such reviews is crucial because they build trust and credibility, showing that real people benefit from our services. By listening to our customers, we can adapt and grow, ensuring we meet their expectations and maintain a competitive edge.",
        resources,
      },
    ],
  },

  {
    id: "spark-interest",
    title: "Spark interest",
    subtitle:
      "To get noticed, help people discover your product for the first time, using these methods outlined below.",
    progress: "0/10 task this week",
    step: 2,

    tasks: [
      {
        id: 1,
        title: "Clear Description",
        description:
          "When describing your product, it's essential to provide a comprehensive overview that not only highlights its features but also educates potential customers on its benefits and applications.\n\nStart by detailing what the product is, its primary functions, and the problems it solves. For instance, if you're selling a smart home device, explain how it can enhance convenience and security in daily life.\n\nIncorporate examples to illustrate your points. For example, you might say, 'Imagine being able to control your home lighting and temperature from your smartphone, no matter where you are. This not only saves energy but also allows for a personalized living environment.'\n\nBy creating a detailed and informative product description, you can engage your audience effectively and encourage them to explore your offering further.",
        resources,
      },

      {
        id: 2,
        title: "Post Weekly",
        description:
          "Share three captivating photos of your product each week to enhance your marketing strategy. Consistent posting not only keeps your audience engaged but also showcases your product's features and benefits.\n\nBy regularly updating your followers with fresh visuals, you can attract new customers and nurture existing relationships, ultimately driving more sales.",
        resources,
      },

      {
        id: 3,
        title: "Visual Proof",
        description:
          "Share three captivating photos of your product each week to enhance your marketing strategy. Consistent posting not only keeps your audience engaged but also showcases your product's features and benefits.\n\nBy regularly updating your followers with fresh visuals, you can attract new customers and nurture existing relationships, ultimately driving more sales.",
        resources,
      },

      {
        id: 4,
        title: "Social Proof",
        description:
          "Customer feedback is invaluable for any business, as it provides insights into the customer experience and highlights areas for improvement.\n\nFor instance, consider a review from Sarah, a recent customer of our software. She mentioned how our platform streamlined her workflow, saving her hours each week. Sarah appreciated the user-friendly interface and the responsive customer support team that helped her navigate any challenges.\n\nHer feedback not only reassured potential users about the effectiveness of our product but also motivated our team to continue enhancing features based on user needs.\n\nSharing such reviews is crucial because they build trust and credibility, showing that real people benefit from our services. By listening to our customers, we can adapt and grow, ensuring we meet their expectations and maintain a competitive edge.",
        resources,
      },
    ],
  },

  {
    id: "make-first-sale",
    title: "Make first sale",
    subtitle:
      "To make your first sale, you have to make ordering ridiculously easy.",
    progress: "1/7 task this week",
    step: 3,

    tasks: [
      {
        id: 1,
        title: "Make ordering ridiculously easy",
        description:
          "The number one reason people don't buy is confusion about how to do it. Don't make your customers figure it out, tell them exactly what to do. Create one clear order process and stick to it every time.\n\nFor example, pin a message to the top of your WhatsApp Business account that says: 'To order, send me your name, delivery address, and the item you want. I'll confirm your order within 10 minutes.' That's it. Clean, simple, no guesswork.\n\nThe fewer steps between 'I want this' and 'I bought it,' the more sales you'll make. Review your current process and ask: could a first-time customer figure this out in 30 seconds?",
        resources,
      },

      {
        id: 2,
        title: "Send a Personal Follow-Up to Warm Leads",
        description:
          "A warm lead is someone who has liked your post, commented, asked a question, or sent you a DM and but hasn't bought yet.\n\nThese people are your closest opportunity, and a simple personal message can convert them. Five genuine outreaches per week adds up to over 200 potential customers per month.",
        resources,
      },

      {
        id: 3,
        title: "Show Your Price Clearly",
        description:
          "Hiding your price is one of the most common mistakes product sellers make. People will scroll past rather than ask, especially on mobile.\n\nWhen you show your price upfront, you eliminate one barrier to buying. Include your price in every product post, every story, and every DM you send.\n\nIf you're worried about competitors seeing your prices, consider this: the customers you lose to confusion are more costly than any competitor who looks at your feed.",
        resources,
      },

      {
        id: 4,
        title: "Offer a First-Time Buyer Incentive",
        description:
          "A small incentive can be the push a hesitant customer needs. This doesn't have to mean a discount, it could be free delivery for first-time orders, a small free add-on, or a handwritten thank you note.\n\nThe key is to make it time-limited and clearly communicated.\n\nFor example: 'First 10 orders this week get free delivery. DM me to order.' This creates urgency without devaluing your product permanently.\n\nOnce someone buys from you once, they're far more likely to buy again. A first-purchase incentive is an investment in a long-term customer, not just a one-time sale.",
        resources,
      },
    ],
  },

  {
    id: "bring-them-back",
    title: "Bring them back",
    subtitle:
      "You've made a sale congratulations! But the real value of a customer isn't just the first purchase. This stage is about turning one-time buyers into loyal regulars who come back, spend more, and tell others.",
    progress: "0/3 task this week",
    step: 4,

    tasks: [
      {
        id: 1,
        title: "Send a thank you message",
        description:
          "After every sale, send your customer a personal thank-you. It sounds simple because it is but most sellers don't do it, which means doing it sets you apart immediately.\n\nYour message doesn't need to be long. Something like: 'Hi [Name], thank you so much for your order! I hope you love your [product]. If you have any questions or need anything, I'm right here.' That's enough to make someone feel valued.\n\nPeople buy again from sellers who made them feel good the first time. This one message is your most affordable retention tool.",
        resources,
      },

      {
        id: 2,
        title: "Create a repeat order incentive",
        description:
          "Give your existing customers a reason to come back. A repeat-order incentive rewards loyalty and keeps your product top of mind. The best incentives are simple and easy to redeem.\n\nExamples: 'Order again within 30 days and get 10% off,' or 'Every 5th order is on us,' or 'Refer a friend and get a free item with your next order.' Choose one, keep it consistent, and tell every customer about it.\n\nDon't make it complicated. A loyalty programme that's hard to understand won't be used. One clear rule that customers can remember and share is worth more than a complex points system.",
        resources,
      },

      {
        id: 3,
        title: "Ask for reviews & referrals",
        description:
          "Share three captivating photos of your product each week to enhance your marketing strategy. Consistent posting not only keeps your audience engaged but also showcases your product's features and benefits.\n\nBy regularly updating your followers with fresh visuals, you can attract new customers and nurture existing relationships, ultimately driving more sales.",
        resources,
      },

      {
        id: 4,
        title: "Stay in touch with a broadcast list",
        description:
          "A WhatsApp broadcast list lets you send one message to many customers at once but each person receives it as a private message, making it feel personal. This is one of the most effective tools available to product sellers.\n\nAdd every customer to your broadcast list after their first purchase (with their permission). Then send one valuable message per week: a new product, a behind-the-scenes look, a limited offer, or a helpful tip related to your product.\n\nThe golden rule: don't spam. One message per week maximum. Every message should give the reader something like information, entertainment, or value — not just ask them to buy.\n\nBroadcasts that feel like spam get blocked. Broadcasts that feel friendly get responses.",
        resources,
      },
    ],
  },
];

function Checkbox({
  checked,
  onClick,
}: {
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-all duration-200 ${
        checked ? "border-[#2F6FED] bg-[#2F6FED]" : "border-[#D0D5DD] bg-white"
      }`}
    >
      {checked && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
    </button>
  );
}

export default function StrategyPage() {
  const [activeStrategy, setActiveStrategy] =
    useState<string>("make-first-sale");

  const [checkedTasks, setCheckedTasks] = useState<string[]>([]);

  const [expandedCards, setExpandedCards] = useState<string[]>([]);

  const currentStrategy = useMemo(
    () => STRATEGIES.find((item) => item.id === activeStrategy)!,
    [activeStrategy],
  );

  const toggleTask = (taskId: number) => {
    const uniqueId = `${activeStrategy}-${taskId}`;

    setCheckedTasks((prev) =>
      prev.includes(uniqueId)
        ? prev.filter((id) => id !== uniqueId)
        : [...prev, uniqueId],
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const hasCheckedTask = checkedTasks.some((id) =>
    id.startsWith(activeStrategy),
  );

  const handleSubmit = () => {
    const currentIndex = STRATEGIES.findIndex(
      (item) => item.id === activeStrategy,
    );

    const nextStrategy = STRATEGIES[currentIndex + 1];

    if (nextStrategy) {
      setActiveStrategy(nextStrategy.id);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      alert("Strategy completed!");
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <div className="flex">
        {/* SIDEBAR */}
        <aside className="hidden w-[320px] shrink-0 border-r border-[#EAECF0] bg-[#FAFAFA] px-8 py-8 lg:block">
          <div>
            <p className="mb-5 text-[15px] font-medium text-[#344054]">
              Documents uploaded
            </p>

            <div className="flex items-center justify-between rounded-[18px] border border-[#EAECF0] bg-white px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#EAECF0]">
                  <FileText className="h-5 w-5 text-[#2F6FED]" />
                </div>

                <div>
                  <p className="max-w-[120px] truncate text-sm font-medium text-[#101828]">
                    Business requ...
                  </p>

                  <p className="mt-1 text-xs font-semibold text-[#2F6FED]">
                    DOCX
                  </p>
                </div>
              </div>

              <p className="text-sm text-[#667085]">2.5MB</p>
            </div>
          </div>

          <p className="mt-10 text-[15px] leading-7 text-[#667085]">
            We have created a tailored marketing strategy for your unique use
            case and problem.
          </p>

          <div className="mt-10">
            <h2 className="mb-5 text-base font-medium text-[#344054]">
              Your Strategy
            </h2>

            <div className="space-y-3">
              {STRATEGIES.map((item) => {
                const active = currentStrategy.id === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveStrategy(item.id)}
                    className={`flex w-full items-center justify-between rounded-[18px] border px-4 py-4 text-left transition-all duration-200 ${
                      active
                        ? "border-[#EAECF0] bg-white"
                        : "border-transparent hover:bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-[3px] h-5 w-5 rounded-full border-[5px] border-[#2F6FED]" />

                      <div>
                        <div className="flex items-center gap-1">
                          <p className="text-[15px] font-medium text-[#101828]">
                            {item.title}
                          </p>

                          <CircleHelp className="h-4 w-4 text-[#98A2B3]" />
                        </div>

                        <p className="mt-1 text-sm text-[#667085]">
                          {item.progress}
                        </p>
                      </div>
                    </div>

                    <div className="h-3 w-3 rounded-full bg-[#F59E0B]" />
                  </button>
                );
              })}
            </div>
          </div>

          <p className="mt-10 text-[15px] leading-7 text-[#667085]">
            If you need to create more funnels for specific use cases, click on
            the button below.
          </p>
        </aside>

        {/* CONTENT */}
        <section className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          {/* MOBILE TABS */}
          <div className="mb-6 flex gap-3 overflow-x-auto pb-2 lg:hidden">
            {STRATEGIES.map((item) => {
              const active = item.id === currentStrategy.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveStrategy(item.id)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-[#2F6FED] text-white"
                      : "border border-[#EAECF0] bg-white text-[#667085]"
                  }`}
                >
                  {item.title}
                </button>
              );
            })}
          </div>

          {/* HEADER */}
          <div className="mb-8 flex items-start justify-between gap-5">
            <div>
              <p className="mb-3 text-[15px] text-[#667085]">
                This week’s focus
              </p>

              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full border-[5px] border-[#2F6FED]" />

                <h1 className="text-[22px] font-semibold leading-tight text-[#101828] lg:text-[38px]">
                  {currentStrategy.title}
                </h1>
              </div>

              <p className="mt-3 max-w-[950px] text-[16px] leading-8 text-[#667085]">
                {currentStrategy.subtitle}
              </p>
            </div>

            <p className="shrink-0 text-base font-medium text-[#667085]">
              {currentStrategy.step} of 4
            </p>
          </div>

          {/* TASKS */}
          <div className="space-y-5">
            {currentStrategy.tasks.map((task) => {
              const checked = checkedTasks.includes(
                `${activeStrategy}-${task.id}`,
              );

              const expanded = expandedCards.includes(
                `${activeStrategy}-${task.id}`,
              );

              return (
                <div
                  key={task.id}
                  className="rounded-[24px] border border-[#EAECF0] bg-white p-6 lg:p-8"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex-1">
                      <h2 className="text-[20px] font-medium text-[#101828] lg:text-[32px]">
                        {task.title}
                      </h2>

                      <div className="mt-5 space-y-5">
                        {task.description
                          .split("\n\n")
                          .map((paragraph, index) => (
                            <p
                              key={index}
                              className="text-[15px] leading-8 text-[#667085]"
                            >
                              {paragraph}
                            </p>
                          ))}
                      </div>

                      {/* DESKTOP RESOURCES */}
                      <div className="mt-8 hidden lg:block">
                        <p className="mb-4 text-sm font-semibold tracking-wide text-[#667085]">
                          MORE RESOURCES
                        </p>

                        <div className="space-y-2">
                          {task.resources.map((resource, index) => (
                            <a
                              key={index}
                              href={resource.href}
                              className="block text-sm text-[#2F6FED] hover:underline"
                            >
                              {resource.label}
                            </a>
                          ))}
                        </div>
                      </div>

                      {/* MOBILE RESOURCES */}
                      <div className="lg:hidden">
                        <button
                          onClick={() =>
                            toggleExpand(`${activeStrategy}-${task.id}`)
                          }
                          className="mt-4 text-base font-medium text-[#2F6FED]"
                        >
                          {expanded ? "See Less" : "See More"}
                        </button>

                        {expanded && (
                          <div className="mt-5">
                            <p className="mb-4 text-sm font-semibold tracking-wide text-[#667085]">
                              MORE RESOURCES
                            </p>

                            <div className="space-y-2">
                              {task.resources.map((resource, index) => (
                                <a
                                  key={index}
                                  href={resource.href}
                                  className="block text-sm text-[#2F6FED] hover:underline"
                                >
                                  {resource.label}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <Checkbox
                      checked={checked}
                      onClick={() => toggleTask(task.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* SUBMIT */}
          <div className="mt-10 flex justify-end">
            <button
              disabled={!hasCheckedTask}
              onClick={handleSubmit}
              className={`h-[56px] w-full rounded-2xl text-base font-medium transition-all duration-200 lg:w-[280px]
                ${
                  hasCheckedTask
                    ? "bg-[#2F6FED] text-white hover:bg-[#1D4ED8]"
                    : "cursor-not-allowed bg-[#C7D7FF] text-[#5A78E6]"
                }`}
            >
              Submit
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
