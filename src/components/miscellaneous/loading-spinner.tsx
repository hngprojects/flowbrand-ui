export default function LoadingSpinner({ className }: { className?: string }) {
  return (
    <span
      className={className}
      aria-hidden
      style={{
        display: "inline-block",
        width: "1em",
        height: "1em",
        border: "2px solid currentColor",
        borderRightColor: "transparent",
        borderRadius: "50%",
        animation: "spin 0.6s linear infinite",
      }}
    />
  );
}
