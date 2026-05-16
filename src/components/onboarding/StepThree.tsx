import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface StepThreeProps {
  selected: string;
  onSelect: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const CHANNELS = [
  "Instagram",
  "Facebook",
  "TikTok",
  "Physical Location",
  "Others",
];

export default function StepThree({
  selected,
  onSelect,
  onSubmit,
  isLoading,
}: StepThreeProps) {
  return (
    <div className="space-y-default">
      <div className="space-y-small">
        <h1 className="text-3xl font-base">
          How do most of your customer find you right now?
        </h1>
        <p className="text-sm text-gray-800">
          Pick the one channel that brings you the most customers right now.
        </p>
      </div>

      <div className="space-y-small">
        {CHANNELS.map((channel) => {
          const active = selected === channel;
          // CodeRabbit Fix: Convert spaces to lowercase tokens to make IDs valid HTML specification strings
          const sanitizedId = channel.toLowerCase().replace(/\s+/g, "-");

          return (
            <div
              key={channel}
              onClick={() => onSelect(channel)}
              className={`flex items-center space-x-3 p-2 border rounded-sm cursor-pointer transition select-none ${
                active
                  ? "border-primary-100/60 bg-primary-100/40"
                  : "border-gray-400 bg-card hover:bg-gray-50"
              }`}
            >
              <Checkbox
                id={sanitizedId}
                checked={active}
                onCheckedChange={() => onSelect(channel)}
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
        disabled={!selected || isLoading}
        onClick={onSubmit}
        className="w-full bg-primary hover:bg-primary-600 text-primary-foreground disabled:bg-primary-300 disabled:text-primary-500 font-bold py-default rounded-lg transition"
      >
        {isLoading ? "Processing..." : "Create my strategy"}
      </Button>
    </div>
  );
}
