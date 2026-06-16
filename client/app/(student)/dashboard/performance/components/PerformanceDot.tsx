import { PERFORMANCE_DATA } from "@/lib/mock/performance";

const PerformanceDot = ({}) => {
  return (
    <div className="flex flex-wrap gap-1">
      {PERFORMANCE_DATA.studyHeatmap.map((day, idx) => {
        const intensity =
          day.count === 0
            ? "bg-gray-100"
            : day.count === 1
              ? "bg-green-200"
              : day.count === 2
                ? "bg-green-300"
                : day.count === 3
                  ? "bg-green-400"
                  : day.count === 4
                    ? "bg-green-500"
                    : "bg-green-600";
        return (
          <div
            key={idx}
            title={`${day.date}: ${day.count} session${day.count !== 1 ? "s" : ""}`}
            className={`w-3 h-3 rounded-sm ${intensity} cursor-pointer transition-opacity hover:opacity-70`}
          />
        );
      })}
    </div>
  );
};

export default PerformanceDot;
