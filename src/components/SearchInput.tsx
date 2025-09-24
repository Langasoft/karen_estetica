/**
 * Reusable search input component
 * Props: placeholder, onSearch, className
 */

interface SearchInputProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
}

export default function SearchInput({ 
  placeholder = "Buscar...", 
  onSearch, 
  className = "" 
}: SearchInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        onChange={handleInputChange}
        className="w-full px-3 py-2 pl-10 border border-[--brand-tertiary]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[--brand-quaternary] focus:border-[--brand-quaternary]"
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-4 w-4 text-[--brand-tertiary]/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
}
