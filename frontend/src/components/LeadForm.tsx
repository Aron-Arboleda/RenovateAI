import {useMemo, useState} from "react";
import type {FormEvent} from "react";

type LeadFormData = {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  location: string;
  timeline: string;
  description: string;
};

type LeadFormErrors = Partial<Record<keyof LeadFormData, string>>;

const INITIAL_VALUES: LeadFormData = {
  name: "",
  email: "",
  phone: "",
  projectType: "",
  budget: "",
  location: "",
  timeline: "",
  description: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateLeadForm(values: LeadFormData): LeadFormErrors {
  const errors: LeadFormErrors = {};

  if (!values.name.trim()) errors.name = "Name is required.";
  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.phone.trim()) errors.phone = "Phone is required.";
  if (!values.projectType.trim())
    errors.projectType = "Project type is required.";
  if (!values.budget.trim()) errors.budget = "Budget is required.";
  if (!values.location.trim()) errors.location = "Location is required.";
  if (!values.timeline.trim()) errors.timeline = "Timeline is required.";
  if (!values.description.trim())
    errors.description = "Description is required.";

  return errors;
}

export default function LeadForm() {
  const [values, setValues] = useState<LeadFormData>(INITIAL_VALUES);
  const [errors, setErrors] = useState<LeadFormErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const isValid = useMemo(
    () => Object.keys(validateLeadForm(values)).length === 0,
    [values],
  );

  const handleChange = (field: keyof LeadFormData, value: string): void => {
    const nextValues = {...values, [field]: value};
    setValues(nextValues);

    if (hasSubmitted) {
      setErrors(validateLeadForm(nextValues));
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setHasSubmitted(true);

    const nextErrors = validateLeadForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      // Step 1 only: UI validation proof. Webhook POST is added in Step 3.
      console.log("Lead form is valid and ready for webhook wiring.", values);
    }
  };

  return (
    <section className="rounded-3xl border border-white/15 bg-white p-6 text-stone-900 shadow-2xl shadow-black/30 sm:p-8">
      <h2 className="font-sora text-2xl font-semibold text-stone-900 sm:text-3xl">
        Start Your Project
      </h2>
      <p className="mt-2 text-sm text-stone-600">
        Fill in every field to test validation. Submission integration comes in
        the next phase step.
      </p>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="name"
            label="Name"
            value={values.name}
            error={errors.name}
            onChange={(value) => handleChange("name", value)}
            placeholder="Jordan Lee"
          />
          <Field
            id="email"
            label="Email"
            type="email"
            value={values.email}
            error={errors.email}
            onChange={(value) => handleChange("email", value)}
            placeholder="jordan@email.com"
          />
          <Field
            id="phone"
            label="Phone"
            value={values.phone}
            error={errors.phone}
            onChange={(value) => handleChange("phone", value)}
            placeholder="(555) 010-1234"
          />
          <SelectField
            id="projectType"
            label="Project Type"
            value={values.projectType}
            error={errors.projectType}
            onChange={(value) => handleChange("projectType", value)}
            options={[
              "Kitchen Renovation",
              "Bathroom Remodel",
              "Whole Home Renovation",
              "Basement Finishing",
              "Home Addition",
              "Other",
            ]}
          />
          <SelectField
            id="budget"
            label="Budget"
            value={values.budget}
            error={errors.budget}
            onChange={(value) => handleChange("budget", value)}
            options={[
              "Under $15,000",
              "$15,000 - $35,000",
              "$35,000 - $75,000",
              "$75,000 - $150,000",
              "$150,000+",
            ]}
          />
          <Field
            id="location"
            label="Location"
            value={values.location}
            error={errors.location}
            onChange={(value) => handleChange("location", value)}
            placeholder="Austin, TX"
          />
        </div>

        <SelectField
          id="timeline"
          label="Timeline"
          value={values.timeline}
          error={errors.timeline}
          onChange={(value) => handleChange("timeline", value)}
          options={[
            "ASAP (Within 30 days)",
            "1-3 months",
            "3-6 months",
            "6+ months",
            "Just exploring for now",
          ]}
        />

        <TextAreaField
          id="description"
          label="Project Description"
          value={values.description}
          error={errors.description}
          onChange={(value) => handleChange("description", value)}
          placeholder="Describe your renovation goals, must-haves, and constraints."
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-stone-900 px-4 py-3 font-semibold text-white transition hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
        >
          Validate Lead Details
        </button>

        {hasSubmitted && (
          <p
            className={`rounded-xl px-4 py-3 text-sm font-medium ${
              isValid
                ? "bg-emerald-100 text-emerald-900"
                : "bg-rose-100 text-rose-900"
            }`}
          >
            {isValid
              ? "All required fields look valid. Next step is wiring the n8n webhook."
              : "Please fix the highlighted fields before continuing."}
          </p>
        )}
      </form>
    </section>
  );
}

type FieldProps = {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email";
};

function Field({
  id,
  label,
  value,
  error,
  onChange,
  placeholder,
  type = "text",
}: FieldProps) {
  return (
    <label className="block text-sm font-medium text-stone-800" htmlFor={id}>
      {label}
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`mt-1 w-full rounded-xl border px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
          error ? "border-rose-400 bg-rose-50" : "border-stone-300 bg-white"
        }`}
      />
      {error && (
        <span className="mt-1 block text-xs text-rose-700">{error}</span>
      )}
    </label>
  );
}

type SelectFieldProps = {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  options: string[];
};

function SelectField({
  id,
  label,
  value,
  error,
  onChange,
  options,
}: SelectFieldProps) {
  return (
    <label className="block text-sm font-medium text-stone-800" htmlFor={id}>
      {label}
      <select
        id={id}
        name={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-1 w-full rounded-xl border px-3 py-2.5 text-sm text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
          error ? "border-rose-400 bg-rose-50" : "border-stone-300 bg-white"
        }`}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && (
        <span className="mt-1 block text-xs text-rose-700">{error}</span>
      )}
    </label>
  );
}

type TextAreaFieldProps = {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

function TextAreaField({
  id,
  label,
  value,
  error,
  onChange,
  placeholder,
}: TextAreaFieldProps) {
  return (
    <label className="block text-sm font-medium text-stone-800" htmlFor={id}>
      {label}
      <textarea
        id={id}
        name={id}
        rows={5}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`mt-1 w-full rounded-xl border px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
          error ? "border-rose-400 bg-rose-50" : "border-stone-300 bg-white"
        }`}
      />
      {error && (
        <span className="mt-1 block text-xs text-rose-700">{error}</span>
      )}
    </label>
  );
}
