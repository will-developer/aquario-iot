import type { LucideIcon } from 'lucide-react';

type FormFieldProps = {
  id: string;
  icon: LucideIcon;
  type: 'email' | 'password' | 'text';
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
};

export function FormField({
  id,
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
}: FormFieldProps) {
  return (
    <label
      htmlFor={id}
      className="flex min-h-15.5 items-center gap-3.5 rounded-field border border-field-border bg-field-bg pr-4.5 pl-3.5 focus-within:outline-2 focus-within:outline-field-focus focus-within:outline-offset-2 max-mobile:min-h-14 max-mobile:pl-3"
    >
      <span
        aria-hidden="true"
        className="inline-flex w-6 min-w-6 items-center justify-center text-field-icon opacity-90"
      >
        <Icon size={18} />
      </span>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        className="w-full border-none bg-transparent text-[1.1rem] text-field-text outline-none placeholder:text-field-placeholder"
      />
    </label>
  );
}
