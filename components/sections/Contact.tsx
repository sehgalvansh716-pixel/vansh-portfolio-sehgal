"use client";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/data/site.config";
import { Mail, Phone, Linkedin, Send } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current!;
    
    // Basic frontend validation check
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setStatus("sending");
    const data = new FormData(form);
    
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const subject = data.get("subject") as string || `Portfolio Contact from ${name}`;
    const message = data.get("message") as string;

    const mailtoSubject = encodeURIComponent(subject);
    const mailtoBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${siteConfig.email}&su=${mailtoSubject}&body=${mailtoBody}`;

    // Add a tiny delay for UX so the button changes state before redirect
    setTimeout(() => {
      window.open(gmailLink, "_blank");
      setStatus("sent");
      form.reset();
      
      // Reset button state after a few seconds
      setTimeout(() => setStatus("idle"), 3000);
    }, 500);
  };

  return (
    <section
      id="contact"
      aria-label="Contact Vansh Sehgal"
      className="relative py-28 px-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 60% 40%, rgba(16,185,129,0.05) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-5xl mx-auto">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-accent-primary/60" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent-primary">
            06 — Contact
          </span>
        </div>

        <h2
          className="font-display font-bold mb-6"
          style={{ fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
        >
          Let&apos;s build
          <br />
          <span className="gradient-text">something great.</span>
        </h2>
        <p className="font-body text-brand-white/50 mb-16 max-w-lg" style={{ fontSize: "16px" }}>
          Whether you have a role, a project, or just want to connect — my inbox is always open.
        </p>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact info */}
          <div className="space-y-8">
            <ContactLink
              icon={<Mail size={18} />}
              label="Email"
              value={siteConfig.email}
              href={`mailto:${siteConfig.email}`}
            />
            <ContactLink
              icon={<Phone size={18} />}
              label="Phone"
              value={siteConfig.phone}
              href={`tel:${siteConfig.phone}`}
            />
            <ContactLink
              icon={<Linkedin size={18} />}
              label="LinkedIn"
              value="vansh-sehgal-383834322"
              href={siteConfig.linkedin}
              external
            />

            {/* Availability badge */}
            <div className="glass rounded-xl px-5 py-4 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-wider text-brand-white/60">
                Available for full-time & freelance
              </span>
            </div>
          </div>

          {/* Form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-5"
            aria-label="Contact form"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <FormField id="contact-name" name="name" label="Name" type="text" required />
              <FormField id="contact-email" name="email" label="Email" type="email" required />
            </div>
            <FormField id="contact-subject" name="subject" label="Subject" type="text" />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-message" className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                placeholder="Tell me about the opportunity..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-brand-white font-body text-sm placeholder:text-brand-white/20 focus:outline-none focus:border-accent-primary/50 transition-colors duration-300 resize-none"
              />
            </div>

            <MagneticButton className="w-full">
              <button
                type="submit"
                disabled={status === "sending" || status === "sent"}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-full font-mono text-sm font-semibold uppercase tracking-widest bg-btn-indigo-bg/15 backdrop-blur-md border border-btn-indigo-border/30 border-t-btn-indigo-top/40 shadow-[0_4px_10px_rgba(0,0,0,0.1),inset_0_1px_3px_rgb(var(--btn-indigo-top)/0.25),inset_0_-1px_4px_rgba(0,0,0,0.2)] text-brand-white hover:bg-btn-indigo-bg/30 hover:border-btn-indigo-border/50 hover:shadow-[0_6px_15px_rgba(0,0,0,0.15),inset_0_1px_3px_rgb(var(--btn-indigo-top)/0.45)] transition-all duration-300 disabled:opacity-50"
              >
                <Send size={16} aria-hidden="true" />
                {status === "idle" && "Send Message"}
                {status === "sending" && "Sending..."}
                {status === "sent" && "Redirecting... ✓"}
                {status === "error" && "Try Again"}
              </button>
            </MagneticButton>

            {status === "error" && (
              <p className="font-mono text-xs text-red-400 text-center">
                Something went wrong. Please email me directly.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function FormField({
  id, name, label, type, required = false,
}: {
  id: string; name: string; label: string; type: string; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        {label}{required && <span className="text-accent-primary ml-0.5">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-brand-white font-body text-sm placeholder:text-brand-white/20 focus:outline-none focus:border-accent-primary/50 transition-colors duration-300"
        placeholder={`Your ${label.toLowerCase()}...`}
      />
    </div>
  );
}

function ContactLink({
  icon, label, value, href, external = false,
}: {
  icon: React.ReactNode; label: string; value: string; href: string; external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex items-center gap-4 group"
      aria-label={`${label}: ${value}`}
    >
      <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-accent-primary group-hover:bg-accent-primary group-hover:text-brand-black transition-all duration-300">
        {icon}
      </div>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted">{label}</p>
        <p className="font-body text-brand-white/80 text-sm group-hover:text-accent-primary transition-colors duration-200">
          {value}
        </p>
      </div>
    </a>
  );
}
