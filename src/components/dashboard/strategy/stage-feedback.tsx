"use client";

export function StageFeedback({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="rounded-[16px] border border-primary-80 bg-white p-5 md:p-6">
      <h3 className="mb-3 text-base font-semibold text-neutral-900">
        How did your week go?
      </h3>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Tell us how your week went....."
        rows={4}
        className="w-full resize-none rounded-lg border border-gray-200 p-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none disabled:opacity-60"
      />
    </div>
  );
}
