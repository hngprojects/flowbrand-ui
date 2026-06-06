import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface StepThreeProps {
  selected: string[];
  onToggle: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const CHANNELS = [
  "Instagram",
  "Facebook",
  "TikTok",
  "Physical Location",
  "Others",
] as const;

export default function StepThree({
  selected,
  onToggle,
  onSubmit,
  isLoading,
}: StepThreeProps) {
  const hasSelection = selected.length > 0;

  return (
    <div className="space-y-default">
      <div className="space-y-small">
        <h1 className="text-xl lg:text-3xl font-semibold tracking-wide lg:tracking-tight leading-tight">
          How do most of your customers find you right now?
        </h1>
        <p className="text-sm lg:tracking-normal tracking-wide leading-tight text-muted-foreground">
          Select all channels where customers discover your business.
        </p>
      </div>

      <div className="space-y-small">
        {CHANNELS.map((channel) => {
          const active = selected.includes(channel);
          const sanitizedId = channel.toLowerCase().replace(/\s+/g, "-");

          return (
            <div
              key={channel}
              onClick={() => onToggle(channel)}
              className={`flex items-center space-x-3 p-2 border rounded-sm cursor-pointer transition select-none ${
                active
                  ? "border-primary-100/60 bg-primary-100/40"
                  : "border-gray-400 bg-card hover:bg-gray-50"
              }`}
            >
              <Checkbox
                id={sanitizedId}
                checked={active}
                onClick={(e) => e.stopPropagation()}
                onCheckedChange={() => onToggle(channel)}
                className={`h-4 w-4 rounded transition ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-gray-500"
                }`}
              />
              <label
                htmlFor={sanitizedId}
                className="text-sm font-medium text-label cursor-pointer select-none"
              >
                {channel}
              </label>
            </div>
          );
        })}
      </div>

      <Button
        disabled={!hasSelection || isLoading}
        onClick={onSubmit}
        className="w-full bg-primary hover:bg-primary-600 text-primary-foreground disabled:bg-primary-300 disabled:text-primary-500 font-bold py-default rounded-lg transition"
      >
        {isLoading ? "Processing..." : "Create my strategy"}
      </Button>
    </div>
  );
}
