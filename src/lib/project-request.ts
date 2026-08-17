/**
 * Shape and validation for a project enquiry.
 *
 * Deliberately dependency-free and shared by both the form component and the
 * API route, so the client and server can never disagree about what is valid.
 * Swap the internals for a schema library later without touching either caller.
 */

export type ProjectRequest = {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  service: string;
  projectType: string;
  budget: string;
  description: string;
  contactMethod: string;
};

export type FieldErrors = Partial<Record<keyof ProjectRequest, string>>;

export const emptyProjectRequest: ProjectRequest = {
  fullName: "",
  companyName: "",
  email: "",
  phone: "",
  service: "",
  projectType: "",
  budget: "",
  description: "",
  contactMethod: "Email",
};

// Intentionally permissive: rejecting unusual-but-valid addresses loses leads.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateProjectRequest(input: Partial<ProjectRequest>): {
  errors: FieldErrors;
  data: ProjectRequest;
} {
  // Copy known fields only. Spreading `input` wholesale would carry anything
  // the caller posted — the anti-spam fields, or arbitrary keys from someone
  // hitting the API directly — straight through to the webhook and CRM.
  const data = { ...emptyProjectRequest };

  (Object.keys(emptyProjectRequest) as (keyof ProjectRequest)[]).forEach((key) => {
    // `?? emptyProjectRequest[key]` keeps the defaults (e.g. contactMethod).
    // Normalising here too means " " never passes a required field.
    data[key] = String(input[key] ?? emptyProjectRequest[key] ?? "").trim();
  });

  const errors: FieldErrors = {};

  if (data.fullName.length < 2) {
    errors.fullName = "Please enter your name.";
  }
  if (!EMAIL.test(data.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!data.service) {
    errors.service = "Please select the service you need.";
  }
  if (data.description.length < 20) {
    errors.description =
      "A little more detail helps — 20 characters or more, please.";
  }
  // Phone is optional overall, but required if it is the only way to reach them.
  if (data.contactMethod === "Phone" && data.phone.length < 6) {
    errors.phone = "Add a phone number, or choose email as your contact method.";
  }

  return { errors, data };
}

export function hasErrors(errors: FieldErrors) {
  return Object.keys(errors).length > 0;
}

/** Short human-quotable reference so a caller can be matched to a submission. */
export function buildReference(now = new Date()) {
  const stamp = now.toISOString().slice(2, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SYN-${stamp}-${suffix}`;
}
