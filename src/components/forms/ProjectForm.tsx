"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { HONEYPOT_FIELD, TIMING_FIELD } from "@/lib/antispam";
import {
  ChoiceField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/forms/Field";
import { ArrowGlyph } from "@/components/ui/Button";
import { AlertIcon, CheckIcon, SpinnerIcon } from "@/components/icons";
import {
  budgetRanges,
  contactMethods,
  projectTypes,
  serviceOptions,
} from "@/lib/services";
import {
  emptyProjectRequest,
  hasErrors,
  validateProjectRequest,
  type FieldErrors,
  type ProjectRequest,
} from "@/lib/project-request";

type Status = "idle" | "submitting" | "success" | "error";

export function ProjectForm() {
  const searchParams = useSearchParams();

  // Service cards link here with ?service=… so the form arrives pre-filled.
  const requested = searchParams.get("service") ?? "";
  const preselected = serviceOptions.includes(
    requested as (typeof serviceOptions)[number],
  )
    ? requested
    : "";

  const [values, setValues] = useState<ProjectRequest>({
    ...emptyProjectRequest,
    service: preselected,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [reference, setReference] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Bot signals. `startedAt` is stamped from a ref callback rather than during
  // render — reading the clock while rendering isn't pure. 0 means "unknown",
  // which the server treats as no timing signal at all.
  const startedAt = useRef(0);
  const honeypot = useRef<HTMLInputElement>(null);

  const markStart = useCallback((node: HTMLFormElement | null) => {
    if (node && startedAt.current === 0) startedAt.current = Date.now();
  }, []);

  const set = (key: keyof ProjectRequest) => (value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    // Clear the error as soon as the user starts fixing the field.
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const { errors: found, data } = validateProjectRequest(values);
    if (hasErrors(found)) {
      setErrors(found);
      setStatus("idle");
      // Move focus to the first problem so keyboard/screen-reader users land there.
      const firstKey = Object.keys(found)[0];
      document.getElementById(firstKey)?.focus();
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      const response = await fetch("/api/project-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          [HONEYPOT_FIELD]: honeypot.current?.value ?? "",
          [TIMING_FIELD]: startedAt.current,
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        if (result?.errors) setErrors(result.errors);
        setFormError(result?.message ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setReference(result.reference ?? null);
      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setFormError(
        "We could not reach the server. Please check your connection and try again.",
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    return <Confirmation reference={reference} onReset={() => {
      setValues({ ...emptyProjectRequest, service: preselected });
      setStatus("idle");
      setReference(null);
    }} />;
  }

  const submitting = status === "submitting";

  return (
    <form ref={markStart} onSubmit={onSubmit} noValidate className="panel p-6 sm:p-9">
      {/*
        Honeypot. Positioned off-screen rather than display:none, because many
        bots skip hidden inputs but not offset ones. Hidden from assistive tech
        and unreachable by keyboard, so a real visitor can never fill it.
      */}
      <div className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor={HONEYPOT_FIELD}>Reference code</label>
        <input
          ref={honeypot}
          id={HONEYPOT_FIELD}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="fullName"
          label="Full Name"
          required
          autoComplete="name"
          placeholder="Jane Okafor"
          value={values.fullName}
          error={errors.fullName}
          onChange={(e) => set("fullName")(e.target.value)}
        />
        <TextField
          id="companyName"
          label="Company Name"
          autoComplete="organization"
          placeholder="Acme Ltd"
          value={values.companyName}
          error={errors.companyName}
          onChange={(e) => set("companyName")(e.target.value)}
        />
        <TextField
          id="email"
          label="Email"
          required
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={values.email}
          error={errors.email}
          onChange={(e) => set("email")(e.target.value)}
        />
        <TextField
          id="phone"
          label="Phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+000 000 0000"
          value={values.phone}
          error={errors.phone}
          onChange={(e) => set("phone")(e.target.value)}
        />

        <SelectField
          id="service"
          label="Service Required"
          required
          placeholder="Select a service"
          options={serviceOptions}
          value={values.service}
          error={errors.service}
          onChange={(e) => set("service")(e.target.value)}
        />
        <SelectField
          id="projectType"
          label="Project Type"
          placeholder="Select a project type"
          options={projectTypes}
          value={values.projectType}
          error={errors.projectType}
          onChange={(e) => set("projectType")(e.target.value)}
        />

        <SelectField
          id="budget"
          label="Budget Range"
          placeholder="Select a range"
          options={budgetRanges}
          value={values.budget}
          error={errors.budget}
          onChange={(e) => set("budget")(e.target.value)}
          className="sm:col-span-2"
          hint="An approximate range is enough — it helps us propose something realistic."
        />

        <TextAreaField
          id="description"
          label="Project Description"
          required
          className="sm:col-span-2"
          placeholder="What are you trying to build or fix? Who will use it? Anything already in place we should know about?"
          value={values.description}
          error={errors.description}
          onChange={(e) => set("description")(e.target.value)}
        />

        <ChoiceField
          id="contactMethod"
          label="Preferred Contact Method"
          required
          className="sm:col-span-2"
          options={contactMethods}
          value={values.contactMethod}
          error={errors.contactMethod}
          onChange={set("contactMethod")}
        />
      </div>

      {formError ? (
        <p
          role="alert"
          className="mt-6 flex items-start gap-2.5 rounded-xl border border-rose-400/30 bg-rose-500/8 px-4 py-3 text-[0.875rem] text-rose-200"
        >
          <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
          {formError}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-4 border-t border-white/8 pt-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-[0.8125rem] leading-relaxed text-slate-dim">
          We use your details only to respond to this enquiry.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary group w-full px-6 py-3.5 text-base disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          {submitting ? (
            <>
              <SpinnerIcon className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              Submit Project Request
              <ArrowGlyph />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function Confirmation({
  reference,
  onReset,
}: {
  reference: string | null;
  onReset: () => void;
}) {
  return (
    <div
      className="panel relative overflow-hidden p-8 text-center sm:p-14"
      role="status"
      aria-live="polite"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-24 h-64 bg-[radial-gradient(ellipse_50%_60%_at_50%_100%,rgba(52,211,153,0.22),transparent_70%)]"
      />

      <div className="relative">
        <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-mint/30 bg-mint/10 text-mint">
          <span className="absolute inset-0 rounded-2xl bg-mint/20 [animation:sy-pulse-ring_3s_ease-out_infinite]" />
          <CheckIcon className="relative h-7 w-7" />
        </span>

        <h2 className="mt-7 text-[clamp(1.6rem,4vw,2.25rem)] font-semibold text-chalk">
          Request Received
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-[1.0625rem] leading-relaxed text-mist">
          Thanks for reaching out to Synctech Limited. We&apos;ve received your
          project details and will review your requirements.
        </p>

        {reference ? (
          <p className="mt-7 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 font-mono text-[0.8125rem] text-mist">
            <span className="text-slate-dim">Reference</span>
            <span className="text-chalk">{reference}</span>
          </p>
        ) : null}

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/services" className="btn btn-ghost group">
            Explore Services
            <ArrowGlyph />
          </Link>
          <button type="button" onClick={onReset} className="btn btn-ghost">
            Send another request
          </button>
        </div>
      </div>
    </div>
  );
}
