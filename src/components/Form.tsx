/**
 * Reusable form component for the entire project
 * Props: fields, onSubmit, submitLabel, className
 */

import { useState, useEffect } from 'react';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  value?: string;
}

interface FormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => void;
  submitLabel?: string;
  className?: string;
  initialData?: Record<string, string>;
}

export default function Form({ fields, onSubmit, submitLabel = "Enviar", className = "", initialData = {} }: FormProps) {
  const [formData, setFormData] = useState<Record<string, string>>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData(initialData);
  }, [JSON.stringify(initialData)]);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <label htmlFor={field.name} className="block text-sm font-medium text-[--foreground]">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          {field.type === 'textarea' ? (
            <textarea
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              required={field.required}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className="w-full px-3 py-2 border border-[--brand-tertiary]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[--brand-quaternary] focus:border-[--brand-quaternary]"
              rows={3}
            />
          ) : field.type === 'select' ? (
            <select
              id={field.name}
              name={field.name}
              required={field.required}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className="w-full px-3 py-2 border border-[--brand-tertiary]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[--brand-quaternary] focus:border-[--brand-quaternary]"
            >
              <option value="">Seleccionar...</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              required={field.required}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className="w-full px-3 py-2 border border-[--brand-tertiary]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[--brand-quaternary] focus:border-[--brand-quaternary]"
            />
          )}
        </div>
      ))}
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-[--brand-quaternary] text-[--brand-secondary] font-medium rounded-md hover:bg-[--brand-quaternary]/90 focus:outline-none focus:ring-2 focus:ring-[--brand-quaternary] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Enviando...' : submitLabel}
      </button>
    </form>
  );
}
