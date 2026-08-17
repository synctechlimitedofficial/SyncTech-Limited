import type { ReactNode } from "react";
import { AlertIcon, ChevronDownIcon } from "@/components/icons";

const control =
  "w-full rounded-xl border bg-white/[0.03] px-4 py-3.5 text-[0.9375rem] text-chalk placeholder:text-slate-dim/80 outline-none transition-all duration-300 focus:border-cyan-glow/60 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(34,211,238,0.12)]";

function borderFor(error?: string) {
  return error ? "border-rose-400/60" : "border-white/10 hover:border-white/18";
}

function Wrapper({
  id,
  label,
  required,
  hint,
  error,
  children,
  className = "",
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 flex items-baseline gap-1.5 text-[0.8125rem] font-medium text-mist"
      >
        {label}
        {required ? (
          <span className="text-cyan-glow" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="text-slate-dim/70">(optional)</span>
        )}
      </label>

      {children}

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 flex items-center gap-1.5 text-[0.8125rem] text-rose-300"
        >
          <AlertIcon className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-2 text-[0.8125rem] text-slate-dim">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type BaseProps = {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
};

export function TextField({
  id,
  label,
  required,
  hint,
  error,
  className,
  ...rest
}: BaseProps & Omit<React.ComponentPropsWithoutRef<"input">, "id" | "className">) {
  return (
    <Wrapper {...{ id, label, required, hint, error, className }}>
      <input
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`${control} ${borderFor(error)}`}
        {...rest}
      />
    </Wrapper>
  );
}

export function TextAreaField({
  id,
  label,
  required,
  hint,
  error,
  className,
  ...rest
}: BaseProps &
  Omit<React.ComponentPropsWithoutRef<"textarea">, "id" | "className">) {
  return (
    <Wrapper {...{ id, label, required, hint, error, className }}>
      <textarea
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`${control} ${borderFor(error)} min-h-40 resize-y leading-relaxed`}
        {...rest}
      />
    </Wrapper>
  );
}

export function SelectField({
  id,
  label,
  required,
  hint,
  error,
  className,
  placeholder,
  options,
  ...rest
}: BaseProps & {
  placeholder?: string;
  options: readonly string[];
} & Omit<React.ComponentPropsWithoutRef<"select">, "id" | "className">) {
  return (
    <Wrapper {...{ id, label, required, hint, error, className }}>
      <div className="relative">
        <select
          id={id}
          name={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
          className={`${control} ${borderFor(error)} cursor-pointer appearance-none pr-11`}
          {...rest}
        >
          {placeholder ? (
            <option value="" className="bg-elevated">
              {placeholder}
            </option>
          ) : null}
          {options.map((option) => (
            <option key={option} value={option} className="bg-elevated">
              {option}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-slate-dim"
          aria-hidden="true"
        />
      </div>
    </Wrapper>
  );
}

/** Segmented control — nicer than a select for two or three short choices. */
export function ChoiceField({
  id,
  label,
  required,
  hint,
  error,
  className,
  options,
  value,
  onChange,
}: BaseProps & {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Wrapper {...{ id, label, required, hint, error, className }}>
      <div
        role="radiogroup"
        aria-label={label}
        className="flex gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-1.5"
      >
        {options.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option)}
              className={`flex-1 rounded-lg px-3 py-2.5 text-[0.875rem] transition-all duration-300 ${
                selected
                  ? "bg-white/10 font-medium text-chalk shadow-[0_0_0_1px_rgba(34,211,238,0.35)]"
                  : "text-mist hover:bg-white/5 hover:text-chalk"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </Wrapper>
  );
}
