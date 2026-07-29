"use client";
import { useEffect, useState } from "react";
import { Mail, MapPin, Send, ArrowUpRight, Linkedin, Github, Twitter, Facebook } from "lucide-react";
import { portfolioApi } from "@/app/lib/api/portfolioApi";

const ICON_MAP = {
  LinkedIn: Linkedin,
  Linkedin: Linkedin,
  Github: Github,
  GitHub: Github,
  Twitter: Twitter,
  Facebook: Facebook,
  Mail: Mail,
};

export default function ContactMobile() {
  const [contact, setContact] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  useEffect(() => {
    portfolioApi.getContact().then(setContact).catch(console.error);
    portfolioApi.getHero()
      .then((data) => {
        if (Array.isArray(data?.socialLinks)) {
          setSocialLinks(
            data.socialLinks
              .filter((l) => l.href)
              .map((l) => ({ ...l, Icon: ICON_MAP[l.icon] ?? ArrowUpRight }))
          );
        }
      })
      .catch(console.error);
  }, []);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ type: "error", text: "Please fill in all required fields." });
      return;
    }

    setSubmitting(true);
    setStatus({ type: "", text: "" });

    try {
      await portfolioApi.sendContact(form);
      setForm({ name: "", email: "", subject: "", message: "" });
      setStatus({ type: "success", text: "Message sent — I'll get back to you soon." });
    } catch (err) {
      console.error("Contact submit error:", err);
      setStatus({ type: "error", text: err.message || "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  if (!contact) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center bg-slate-950">
        <div className="animate-pulse w-12 h-12 rounded-full border-4 border-slate-700 border-t-blue-500" />
      </section>
    );
  }

  return (
    <section id="contact" className="relative py-16 px-5 bg-slate-950 text-white">
      <div className="text-center mb-8">
        <span className="text-xs font-mono tracking-widest text-indigo-400">06 · CONTACT</span>
        <h2 className="mt-2 text-2xl font-bold">Let's work together.</h2>
        <p className="mt-2 text-sm text-slate-400">Open to opportunities &amp; collaborations.</p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Full Name" required>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              placeholder="Your name"
              className="c-input"
            />
          </Field>

          <Field label="Email" required>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="you@example.com"
              className="c-input"
            />
          </Field>

          <Field label="Subject">
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              type="text"
              placeholder="What's this about?"
              className="c-input"
            />
          </Field>

          <Field label="Message" required>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell me about your project…"
              rows={4}
              className="c-input resize-none"
            />
          </Field>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-blue-600 to-cyan-500 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Send size={14} /> Send Message
              </>
            )}
          </button>

          {status.text && (
            <p
              className={`text-xs text-center font-medium ${
                status.type === "success" ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {status.text}
            </p>
          )}
        </form>

        <div className="h-px bg-slate-800 my-6" />

        {socialLinks.length > 0 && (
          <div className="flex justify-center gap-3 mb-5">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={label}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-800 text-slate-400 active:scale-90 transition-transform"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        )}

        <div className="flex flex-col items-center gap-2 text-xs">
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-1.5 text-slate-400 font-mono"
          >
            <Mail size={12} />
            {contact.email}
            <ArrowUpRight size={10} className="opacity-40" />
          </a>
          <div className="flex items-center gap-1.5 text-slate-500 font-mono">
            <MapPin size={12} />
            {contact.location}
          </div>
        </div>
      </div>

      <style jsx>{`
        .c-input {
          width: 100%;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(51, 65, 85, 0.6);
          border-radius: 10px;
          padding: 11px 14px;
          font-size: 13px;
          color: #e2e8f0;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .c-input::placeholder {
          color: #64748b;
        }
        .c-input:focus {
          border-color: #06b6d4;
        }
      `}</style>
    </section>
  );
}

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-medium tracking-wide uppercase text-slate-500 font-mono">
        {label} {required && <span className="text-cyan-400">*</span>}
      </label>
      {children}
    </div>
  );
}
