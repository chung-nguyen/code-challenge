import { RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type CircularRefreshButtonProps = {
  startTime: number;
  totalTime: number;
  radius: number;
  onClick: () => void;
};

export const CircularRefreshButton = (props: CircularRefreshButtonProps) => {
  const { startTime, totalTime, radius, onClick } = props;
  const circumference = 2 * Math.PI * radius;

  const [progress, setProgress] = useState(0);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      setProgress(Math.min(1, elapsedTime / totalTime) * 100);
      setIsEnabled(elapsedTime >= totalTime);
    }, 100);

    return () => clearInterval(interval);
  }, [startTime, totalTime]);

  const onButtonClicked = () => {
    if (isEnabled && onClick) {
      onClick();
    }
  };

  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative w-12 h-12 ${isEnabled ? "cursor-pointer" : ""}`} onClick={onButtonClicked}>
      <svg className="w-full h-full" viewBox="0 0 50 50">
        <circle
          cx="25"
          cy="25"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-base-300"
        />
        <circle
          cx="25"
          cy="25"
          r={radius}
          fill="none"
          className="text-success"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 25 25)"
        />
      </svg>

      {/* Centered black refresh icon */}
      <div className={`absolute inset-0 flex items-center justify-center ${isEnabled ? "" : "animate-spin"}`}>
        <RefreshCw className="text-black w-5 h-5" />
      </div>
    </div>
  );
};
