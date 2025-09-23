/**
 * Skeleton loading component for tables
 * Props: rows, columns
 */

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export default function SkeletonTable({ rows = 5, columns = 3 }: SkeletonTableProps) {
  return (
    <div className="rounded-2xl bg-[--brand-primary]/30 p-6 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[--brand-tertiary]/30">
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="px-4 py-3 text-left">
                  <div className="h-4 bg-[--brand-tertiary]/20 rounded animate-pulse"></div>
                </th>
              ))}
              <th className="px-4 py-3 text-right w-32">
                <div className="h-4 bg-[--brand-tertiary]/20 rounded animate-pulse"></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-[--brand-tertiary]/20">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-4 py-3">
                    <div className="h-4 bg-[--brand-tertiary]/20 rounded animate-pulse"></div>
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-2 justify-end">
                    <div className="h-8 w-16 bg-[--brand-tertiary]/20 rounded animate-pulse"></div>
                    <div className="h-8 w-16 bg-[--brand-tertiary]/20 rounded animate-pulse"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <div className="h-10 w-full bg-[--brand-tertiary]/20 rounded animate-pulse"></div>
      </div>
    </div>
  );
}
