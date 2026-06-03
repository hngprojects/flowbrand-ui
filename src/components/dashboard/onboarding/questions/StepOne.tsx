import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BUSINESS_DESCRIPTION_MAX_WORDS } from "@/schema/onboarding";
import { countWords, truncateToMaxWords } from "@/lib/word-count";

interface StepOneProps {
  value: string;
  onChange: (val: string) => void;
  onNext: () => void;
}

export default function StepOne({ value, onChange, onNext }: StepOneProps) {
  const wordCount = countWords(value);

  return (
    <div className="space-y-default">
      <div className="space-y-small">
        <h1 className="lg:text-3xl text-2xl font-semibold text-label tracking-tight">
          What does your business sell?
        </h1>
        <p className="leading-snug text-muted-foreground max-w-2sm">
          Describe your product or service in your own words keep it simple.
          There are no wrong answers here.
        </p>
      </div>

      <div className="space-y-small">
        <Textarea
          placeholder="e.g I sell small chops and pastries for events and walk in customers..."
          value={value}
          onChange={(e) =>
            onChange(
              truncateToMaxWords(
                e.target.value,
                BUSINESS_DESCRIPTION_MAX_WORDS,
              ),
            )
          }
          className="min-h-[120px] resize-none bg-card border-gray-600 text-label placeholder:text-gray-700 rounded-lg focus-visible:ring-1 focus-visible:ring-primary"
        />
        <div className="text-right text-xs text-gray-700">
          {wordCount}/{BUSINESS_DESCRIPTION_MAX_WORDS} words
        </div>
      </div>

      <Button
        disabled={!value.trim()}
        onClick={onNext}
        className="w-full bg-primary hover:bg-primary-600 text-primary-foreground disabled:bg-primary-300 disabled:text-primary-500 font-bold py-default rounded-lg transition"
      >
        Next
      </Button>
    </div>
  );
}
