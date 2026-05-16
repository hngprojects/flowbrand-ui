import { PptImg } from "./icons/ppt-img";
import { PdfImg } from "./icons/pdf-img";
import { DocsImg } from "./icons/docs-img";
import { BlueBlackLogo } from "./icons/blueblack-logo";
import { StrategyIcon } from "./icons/strategy";

const SideBar = ({
  steps,
  loading,
}: {
  steps: React.ReactNode;
  loading: boolean;
}) => {
  const docs = [
    {
      id: 1,
      name: "Business requirement.Docx",
      size: "2.5MB",
      type: "DOCX",
      icon: <DocsImg />,
    },
    {
      id: 2,
      name: "Business strategy.PPT",
      size: "3.5MB",
      type: "PPT",
      icon: <PptImg />,
    },
    {
      id: 3,
      name: "Business marketing.PDF.pdf",
      size: "2.5MB",
      type: "PDF",
      icon: <PdfImg />,
    },
  ];

  const strategy = [
    {
      title: "Get Noticed",
      tasks: "0/5 tasks this week",
    },
    {
      title: "Spark interest",
      tasks: "0/10 tasks this week",
    },
    {
      title: "Make first sale",
      tasks: "0/7 tasks this week",
    },
    {
      title: "Bring them back",
      tasks: "0/3 tasks this week",
    },
  ];
  return (
    <aside className="h-screen border-r border-gray-200 bg-[#FFFFFF] py-large px-section space-y-section sticky left-0 top-0 md:w-1/3 hidden md:block overflow-auto">
      <div className="space-y-3">
        <div>
          <h2 className="text-[16px] text-black-300">Documents uploaded</h2>
        </div>
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="border border-gray-500 p-default flex items-center justify-between rounded-[20px]"
          >
            <div className="flex items-center gap-default">
              {doc.icon}
              <h3 className="text-[16px] text-foreground">
                {doc.name.slice(0, 13)}...
              </h3>
            </div>
            <p className="text-[14px] text-black-300">{doc.size}</p>
          </div>
        ))}
      </div>

      <p className="text-[16px] text-foreground flex items-center gap-default">
        {loading && <BlueBlackLogo className="w-[25px]" />}
        {loading ? (
          steps
        ) : (
          <div className="flex flex-col gap-[20px]">
            <p>
              We have created a tailored marketing strategy for your unique use
              case and problem.
            </p>
            <div className="space-y-[12px]">
              <h2 className="text-[16px] text-black-300">Your Strategy</h2>
              <div className="border border-gray-500 p-[20px] space-y-[20px] rounded-[20px]">
                {strategy.map((strategy) => (
                  <div
                    key={strategy.title}
                    className="flex items-start justify-between border-b pb-4 border-gray-500 last:border-none"
                  >
                    <div className="flex items-start gap-default">
                      <StrategyIcon />
                      <div className="flex flex-col">
                        <h3 className="text-[16px] text-foreground">
                          {strategy.title}
                        </h3>
                        <p className="text-[14px] text-black-300">
                          {strategy.tasks}
                        </p>
                      </div>
                    </div>
                    <div className="w-default h-default rounded-full bg-accent"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </p>

      <p className="text-[16px] text-black-300">
        If you need to create more funnels for specific use cases, click on the
        button below.
      </p>
    </aside>
  );
};

export default SideBar;
