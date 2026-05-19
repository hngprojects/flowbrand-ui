import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface StepTwoProps {
  theyAre: string[];
  toggleTheyAre: (v: string) => void;
  whoWantTo: string[];
  toggleWhoWantTo: (v: string) => void;
  locatedIn: string[];
  toggleLocatedIn: (v: string) => void;
  customInput: string;
  setCustomInput: (v: string) => void;
  onNext: () => void;
}

const SECTIONS = {
  theyAre: [
    "Women",
    "Men",
    "Young adults",
    "Parent",
    "Professionals",
    "Business owner",
    "Students",
    "Anyone",
  ],
  whoWantTo: [
    "Look good",
    "Save time",
    "Grow their business",
    "Eat well",
    "Feel Confident",
    "Learn something",
    "Solve a problem",
  ],
  locatedIn: [
    "My city",
    "Nigeria",
    "Africa",
    "Anywhere online",
    "My neighborhood",
  ],
};

export default function StepTwo(props: StepTwoProps) {
  const isSelected = (list: string[], item: string) => list.includes(item);
  const pillClass = (selected: boolean) =>
    `px-1.5 py-1 text-2sm rounded-sm border transition text-left ${
      selected
        ? "border-primary-100 bg-primary-50 text-primary-600/60"
        : "border-gray-700 bg-card text-gray-700 hover:bg-gray-50"
    }`;

  const isNextDisabled =
    props.theyAre.length === 0 &&
    props.whoWantTo.length === 0 &&
    props.locatedIn.length === 0 &&
    !props.customInput.trim();

  return (
    <div className="space-y-default">
      <div className="space-y-small">
        <h1 className="text-3xl font-base text-label tracking-tight">
          Who is your ideal customer?
        </h1>
        <p className="text-sm text-gray-800">
          Tap to build a picture of the person you most want to reach.
        </p>
      </div>

      <div className="space-y-default">
        <div>
          <span className="text-xs font-semibold text-gray-800 block mb-small">
            They are:
          </span>
          <div className="flex flex-wrap gap-2">
            {SECTIONS.theyAre.map((opt) => {
              const active = isSelected(props.theyAre, opt);
              return (
                <button
                  key={opt}
                  type="button"
                  aria-pressed={active}
                  onClick={() => props.toggleTheyAre(opt)}
                  className={pillClass(active)}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold text-gray-800 block mb-small">
            Who want to:
          </span>
          <div className="flex flex-wrap gap-2">
            {SECTIONS.whoWantTo.map((opt) => {
              const active = isSelected(props.whoWantTo, opt);
              return (
                <button
                  key={opt}
                  type="button"
                  aria-pressed={active}
                  onClick={() => props.toggleWhoWantTo(opt)}
                  className={pillClass(active)}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold text-gray-800 block mb-small">
            Located In:
          </span>
          <div className="flex flex-wrap gap-2">
            {SECTIONS.locatedIn.map((opt) => {
              const active = isSelected(props.locatedIn, opt);
              return (
                <button
                  key={opt}
                  type="button"
                  aria-pressed={active}
                  onClick={() => props.toggleLocatedIn(opt)}
                  className={pillClass(active)}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-small pt-small">
          <span className="text-xs font-semibold text-gray-800 block">
            Or write your own
          </span>
          <Textarea
            placeholder="e.g Young women in Lagos who want affordable stylish clothing"
            value={props.customInput}
            onChange={(e) => props.setCustomInput(e.target.value.slice(0, 500))}
            className="min-h-[70px] resize-none bg-card border border-gray-700 text-label placeholder:text-gray-700 rounded-lg text-sm"
          />
        </div>
      </div>

      <Button
        onClick={props.onNext}
        disabled={isNextDisabled}
        className="w-full bg-primary hover:bg-primary-600 text-primary-foreground disabled:bg-primary-300 disabled:text-primary-500 font-bold py-default rounded-lg transition"
      >
        Next
      </Button>
    </div>
  );
}
