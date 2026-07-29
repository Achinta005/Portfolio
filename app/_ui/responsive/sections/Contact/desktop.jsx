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

export default function ContactDesktop() {
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
      <section className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-pulse w-16 h-16 rounded-full border-4 border-slate-700 border-t-blue-500" />
      </section>
    );
  }

  return (
    <section id="contact" className="relative py-28 bg-slate-950 text-white overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="text-center mb-14">
          <span className="text-sm font-mono tracking-widest text-indigo-400">06 · CONTACT</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold">Let's work together.</h2>
          <p className="mt-3 text-slate-400">Open to opportunities, projects &amp; collaborations.</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 md:p-10 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
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
            </div>

            <Field label="Subject">
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                type="text"
                placeholder="Project collaboration, freelance work, etc."
                className="c-input"
              />
            </Field>

            <Field label="Message" required>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell me about your project or idea…"
                rows={5}
                className="c-input resize-none"
              />
            </Field>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg font-medium text-sm bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-blue-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send size={15} /> Send Message
                </>
              )}
            </button>

            {status.text && (
              <p
                className={`text-sm text-center font-medium ${
                  status.type === "success" ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {status.text}
              </p>
            )}
          </form>

          <div className="h-px bg-slate-800 my-8" />

          <div className="flex flex-wrap items-center justify-between gap-6">
            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map(({ label, href, Icon, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={label}
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:-translate-y-1 hover:text-white transition-all"
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = color || "#6366f1"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = ""; }}
                  >
                    <Icon size={17} />
                  </a>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-2 text-sm">
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors font-mono"
              >
                <Mail size={14} />
                {contact.email}
                <ArrowUpRight size={12} className="opacity-40" />
              </a>
              <div className="flex items-center gap-2 text-slate-500 font-mono">
                <MapPin size={14} />
                {contact.location}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .c-input {
          width: 100%;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(51, 65, 85, 0.6);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 14px;
          color: #e2e8f0;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .c-input::placeholder {
          color: #64748b;
        }
        .c-input:focus {
          border-color: #06b6d4;
          box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
        }
      `}</style>
    </section>
  );
}

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium tracking-wide uppercase text-slate-500 font-mono">
        {label} {required && <span className="text-cyan-400">*</span>}
      </label>
      {children}
    </div>
  );
}
