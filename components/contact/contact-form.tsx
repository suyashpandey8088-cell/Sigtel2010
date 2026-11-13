"use client";

import { useEffect, useRef, useState } from "react";
import { enquiryCategories } from "@/lib/validation";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const startedAt = useRef<number>(Date.now());
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("startedAt", String(startedAt.current));
    formData.set("consent", formData.get("consent") === "on" ? "true" : "false");

    setStatus("submitting");
    setErrors({});
    setMessage("");

    try {
      const response = await fetch("/api/contact", { method: "POST", body: formData });
      const data = (await response.json()) as {
        ok: boolean;
        message?: string;
        fieldErrors?: Record<string, string>;
      };

      if (!response.ok || !data.ok) {
        setStatus("error");
        setErrors(data.fieldErrors ?? {});
        setMessage(data.message ?? "Something went wrong. Please call us instead.");
        return;
      }

      setStatus("success");
      setMessage("Enquiry received. Our team will respond, usually the same working day.");
      form.reset();
      setFileName("");
      startedAt.current = Date.now();
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again, or call +91 93200 01996.");
    }
  }

  if (status === "success") {
    return (
      <div className="border-t-2 border-eng bg-navy-800 p-8">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-eng/60 text-eng">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden>
            <path d="M1 6l4.5 4.5L15 1.5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </span>
        <h3 className="mt-5 font-display text-2xl uppercase tracking-[-0.02em] text-ink">Enquiry received.</h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
          Your details have reached our engineering team. We usually respond the same working day between
          10 am and 7 pm, Monday to Saturday.
        </p>
        <p className="mt-4 text-sm text-muted">
          Urgent? Call <a className="text-eng" href="tel:+919320001996">+91 93200 01996</a>.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setMessage("");
          }}
          className="mt-6 label-tight border-b border-line-strong pb-1 text-muted hover:text-ink"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="relative">
      <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
        <Field label="Name" required error={errors.name}>
          <input className="field" name="name" autoComplete="name" placeholder="Your name" aria-invalid={!!errors.name} />
        </Field>

        <Field label="Company / Railway office" error={errors.company}>
          <input className="field" name="company" autoComplete="organization" placeholder="Organisation" />
        </Field>

        <Field label="Email" required error={errors.email}>
          <input className="field" type="email" name="email" autoComplete="email" placeholder="name@company.com" aria-invalid={!!errors.email} />
        </Field>

        <Field label="Phone" required error={errors.phone}>
          <input className="field" type="tel" name="phone" autoComplete="tel" placeholder="+91" aria-invalid={!!errors.phone} />
        </Field>

        <Field label="Enquiry category" required error={errors.category}>
          <select className="field appearance-none" name="category" defaultValue="" aria-invalid={!!errors.category}>
            <option value="" disabled>
              Select a category
            </option>
            {enquiryCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Project location" error={errors.location}>
          <input className="field" name="location" placeholder="Section, station or route" />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Work details" required error={errors.message}>
            <textarea
              className="field min-h-[130px] resize-y"
              name="message"
              placeholder="Tender reference, scope, route or the system you need maintained."
              aria-invalid={!!errors.message}
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <p className="field-label mb-2">Attachment — optional (PDF, DWG, image · max 5 MB)</p>
          <label className="flex cursor-pointer items-center justify-between gap-4 border border-dashed border-line-strong px-4 py-4 transition-colors hover:border-eng/60">
            <span className="flex items-center gap-3">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M8 11V2m0 0L4.5 5.5M8 2l3.5 3.5M2 11.5V13a1 1 0 001 1h10a1 1 0 001-1v-1.5" stroke="currentColor" strokeWidth="1.1" className="text-eng" />
              </svg>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                {fileName || "Attach drawings or a tender PDF"}
              </span>
            </span>
            <span className="label-tight text-tech">Browse</span>
            <input
              type="file"
              name="attachment"
              className="sr-only"
              accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.dwg,.xls,.xlsx"
              onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
            />
          </label>
        </div>
      </div>

      {/* honeypot */}
      <div className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden>
        <label htmlFor="website-field">Website</label>
        <input id="website-field" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-8 flex flex-col gap-5 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex max-w-md cursor-pointer items-start gap-3 text-[0.78rem] leading-relaxed text-muted">
          <input
            type="checkbox"
            name="consent"
            className="mt-[3px] h-3.5 w-3.5 shrink-0 accent-[#183B56]"
            aria-invalid={!!errors.consent}
          />
          <span>
            I agree that SIG-TEL may use these details to respond to my enquiry, as described in the{" "}
            <a href="/privacy" className="text-eng underline decoration-line-strong underline-offset-2 hover:text-signal">
              privacy policy
            </a>
            .
          </span>
        </label>

        <button
          type="submit"
          disabled={status === "submitting"}
          className={cn("btn btn-solid shrink-0", status === "submitting" && "opacity-60")}
          data-cursor-label="Send"
        >
          <span>{status === "submitting" ? "Sending…" : "Send enquiry"}</span>
          {status === "submitting" ? (
            <span className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
          ) : (
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden>
              <path d="M0 5h13M9 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          )}
        </button>
      </div>

      <div aria-live="polite" className="mt-4">
        {errors.consent ? <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-signal">{errors.consent}</p> : null}
        {status === "error" && message ? (
          <p className="border border-signal/40 bg-signal/[0.06] px-4 py-3 text-sm text-signal/90">{message}</p>
        ) : null}
      </div>
      <p className="mt-4 font-mono text-[8.5px] uppercase leading-relaxed tracking-[0.14em] text-tech">
        Enquiries are stored securely and accessible only to the SIG-TEL team. We do not share your details.
      </p>
    </form>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="field-label mb-1 block">
        {label} {required ? <span className="text-signal">*</span> : null}
      </span>
      {children}
      {error ? <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.1em] text-signal">{error}</span> : null}
    </label>
  );
}
