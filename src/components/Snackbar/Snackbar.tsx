interface Props {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const styles = {
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-800 shadow-emerald-100/80 dark:border-emerald-900/60 dark:bg-emerald-950/80 dark:text-emerald-200",
  error:
    "border-red-200 bg-red-50 text-red-800 shadow-red-100/80 dark:border-red-900/60 dark:bg-red-950/80 dark:text-red-200",
} as const;

const icons = {
  success: (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  ),
  error: (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
} as const;

const Snackbar = ({ message, type, onClose }: Props) => (
  <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex justify-center px-4">
    <div
      className={`pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur transition-all duration-300 ${styles[type]}`}
      role="status"
      aria-live="polite"
    >
      <span className="mt-0.5 shrink-0">{icons[type]}</span>
      <p className="flex-1 text-sm font-medium leading-6">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 rounded-full p-1 transition hover:bg-black/5 dark:hover:bg-white/10"
        aria-label="Close notification"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>
);

export default Snackbar;
