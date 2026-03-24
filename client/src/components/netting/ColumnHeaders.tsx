export function ColumnHeaders() {
  return (
    <div className="hidden sm:grid grid-cols-[2fr_2fr_1.5fr] gap-0 border-b border-gray-100 bg-gray-50 sticky top-0 z-10">
      {[
        { label: "Entity Position", sub: "Exposure since start point" },
        { label: "In-Flight", sub: "Actions initiated" },
        { label: "Completed", sub: "Settled this period" },
      ].map((col, i) => (
        <div
          key={col.label}
          className={`px-5 py-2.5 ${i > 0 ? "border-l border-gray-100" : ""}`}
        >
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
            {col.label}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{col.sub}</p>
        </div>
      ))}
    </div>
  );
}
