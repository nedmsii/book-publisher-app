"use client";

import { useMemo, useState } from "react";
import { buildContactFormSchema, type ContactFormValues } from "@/lib/validations";
import type { Dictionary } from "@/i18n";

interface ContactFormProps {
  dict: Dictionary;
}

type FieldErrors = Partial<Record<keyof ContactFormValues, string>>;
type FormStatus = "idle" | "submitting" | "success" | "error";

export default function ContactForm({ dict }: ContactFormProps) {
  const t = dict.contact.form;
  const schema = useMemo(
    () => buildContactFormSchema(t.validation),
    [t.validation]
  );

  const [formData, setFormData] = useState<ContactFormValues>({
    name: "",
    email: "",
    subject: "",
    message: "",
    honeypot: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [serverMessage, setServerMessage] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormValues]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Client-side validation
    const result = schema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ContactFormValues;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setStatus("submitting");
    setErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "", honeypot: "" });
      } else {
        setStatus("error");
        setServerMessage(data.message ?? t.genericError);
        if (data.errors) setErrors(data.errors);
      }
    } catch {
      setStatus("error");
      setServerMessage(t.networkError);
    }
  }

  if (status === "success") {
    return (
      <div
        role="alert"
        className="bg-green-50 border border-green-200 rounded-lg p-8 text-center"
      >
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-serif text-xl font-bold text-ink-900 mb-2">
          {t.successHeading}
        </h3>
        <p className="text-ink-600 text-sm leading-relaxed mb-6">{t.successBody}</p>
        <button
          onClick={() => setStatus("idle")}
          className="text-brand-600 hover:text-brand-700 font-semibold text-sm transition-colors"
        >
          {t.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label={t.ariaLabel}>
      {status === "error" && serverMessage && (
        <div role="alert" className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-sm">{serverMessage}</p>
        </div>
      )}

      {/* Honeypot — hidden from real users, catches bots */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">{t.honeypotLabel}</label>
        <input
          id="website"
          name="honeypot"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={formData.honeypot}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-ink-700 mb-1.5">
            {t.name} <span className="text-red-500" aria-label={t.required}>*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors ${
              errors.name ? "border-red-400 bg-red-50" : "border-ink-200"
            }`}
          />
          {errors.name && (
            <p id="name-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink-700 mb-1.5">
            {t.email} <span className="text-red-500" aria-label={t.required}>*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors ${
              errors.email ? "border-red-400 bg-red-50" : "border-ink-200"
            }`}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Subject */}
      <div className="mb-5">
        <label htmlFor="subject" className="block text-sm font-medium text-ink-700 mb-1.5">
          {t.subject}
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          autoComplete="off"
          value={formData.subject}
          onChange={handleChange}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors ${
            errors.subject ? "border-red-400 bg-red-50" : "border-ink-200"
          }`}
          placeholder={t.subjectPlaceholder}
        />
        {errors.subject && (
          <p id="subject-error" role="alert" className="mt-1 text-xs text-red-600">
            {errors.subject}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="mb-6">
        <label htmlFor="message" className="block text-sm font-medium text-ink-700 mb-1.5">
          {t.message} <span className="text-red-500" aria-label={t.required}>*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          value={formData.message}
          onChange={handleChange}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : "message-hint"}
          className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors resize-y ${
            errors.message ? "border-red-400 bg-red-50" : "border-ink-200"
          }`}
          placeholder={t.messagePlaceholder}
        />
        <p id="message-hint" className="mt-1 text-xs text-ink-400">
          {t.messageHint}
        </p>
        {errors.message && (
          <p id="message-error" role="alert" className="mt-1 text-xs text-red-600">
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 disabled:bg-ink-300 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded transition-colors"
        aria-live="polite"
      >
        {status === "submitting" ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {t.sending}
          </>
        ) : (
          <>
            {t.send}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
