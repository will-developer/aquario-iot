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
      className="flex min-h-[62px] items-center gap-3.5 rounded-[18px] border border-[rgba(14,96,122,0.08)] bg-[rgba(123,209,228,0.24)] pr-[18px] pl-3.5 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[rgba(18,152,184,0.3)] max-tablet:border-white/30 max-tablet:bg-white/[0.16] max-mobile:min-h-[56px] max-mobile:pl-3"
    >
      <span
        aria-hidden="true"
        className="inline-flex w-6 min-w-6 items-center justify-center text-brand-800 opacity-90 max-tablet:text-[#eaf6fb]"
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
        className="w-full border-none bg-transparent text-[1.1rem] text-brand-600 outline-none placeholder:text-[rgba(16,71,99,0.7)] max-tablet:text-[#f5fbff] max-tablet:placeholder:text-[rgba(245,251,255,0.75)]"
      />
    </label>
  );
}
