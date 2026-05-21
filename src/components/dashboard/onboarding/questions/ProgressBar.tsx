interface ProgressBarProps {
  currentStep: number;
}

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="space-y-1 mb-default select-none">
      <p className="text-xs font-medium text-gray-800">
        {currentStep} of 3 steps completed
      </p>
      <div className="flex w-28 gap-1">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              step <= currentStep ? "bg-progress" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
