import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface ShoeLifeProgressProps {
  percentage: number;
}

export default function ShoeLifeProgress({
  percentage,
}: ShoeLifeProgressProps) {
  return (
    <div className="w-50 h-50">
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        strokeWidth={12}
        styles={buildStyles({
          pathColor: "#1E7F4F",
          trailColor: "#2A2F35",
          textColor: "#CBD5E1",
          textSize: "16px",
          pathTransitionDuration: 0.8,
        })}
      />
    </div>
  );
}
