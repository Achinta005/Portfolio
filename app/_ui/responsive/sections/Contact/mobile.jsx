"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send, ArrowUpRight, Linkedin, Github, Twitter, Facebook, Sparkles } from "lucide-react";
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

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

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
    <section id="contact" className="relative py-20 px-5 pb-32 bg-transparent text-white">
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-blue-600/8 rounded-full blur-3xl" />
      </div>

      <div className="text-center mb-10">
        <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 mb-4">
          <Sparkles size={14} className="text-cyan-400" />
          <span className="text-[10px] font-[family-name:var(--font-jetbrains)] font-semibold tracking-[0.25em] uppercase text-cyan-400">
            06 · CONTACT
          </span>
          <Sparkles size={14} className="text-cyan-400" />
        </motion.div>
        <motion.h2 {...fadeUp(0.05)} className="text-[28px] font-extrabold tracking-tight">
          Let&apos;s work together.
        </motion.h2>
        <motion.p {...fadeUp(0.1)} className="mt-2 text-[13px] text-slate-400 font-light">
          Open to opportunities &amp; collaborations.
        </motion.p>
      </div>

      <motion.div {...fadeUp(0.15)} className="rounded-2xl border border-slate-800/50 bg-gradient-to-b from-slate-900/50 to-slate-900/20 p-5">
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

          <motion.button
            type="submit"
            disabled={submitting}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/15 transition-all disabled:opacity-50 tracking-wide"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Send size={14} strokeWidth={2.5} /> Send Message
              </>
            )}
          </motion.button>

          {status.text && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-[11px] text-center font-bold tracking-wide ${
                status.type === "success" ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {status.text}
            </motion.p>
          )}
        </form>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent my-7" />

        {socialLinks.length > 0 && (
          <div className="flex justify-center gap-3 mb-6">
            {socialLinks.map(({ label, href, Icon }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={label}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-800/50 bg-white/[0.03] text-slate-400 transition-colors"
              >
                <Icon size={16} strokeWidth={2.2} />
              </motion.a>
            ))}
          </div>
        )}

        <div className="flex flex-col items-center gap-2.5 text-[11px]">
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-2 text-slate-400 font-[family-name:var(--font-jetbrains)] font-medium hover:text-white transition-colors"
          >
            <Mail size={12} strokeWidth={2.5} />
            {contact.email}
            <ArrowUpRight size={10} className="opacity-40" />
          </a>
          <div className="flex items-center gap-2 text-slate-500 font-[family-name:var(--font-jetbrains)]">
            <MapPin size={12} strokeWidth={2.5} />
            {contact.location}
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .c-input {
          width: 100%;
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(51, 65, 85, 0.4);
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 13px;
          font-weight: 400;
          color: #e2e8f0;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          font-family: var(--font-inter);
        }
        .c-input::placeholder {
          color: #475569;
          font-weight: 300;
        }
        .c-input:focus {
          border-color: #22d3ee;
          box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.08);
        }
      `}</style>
    </section>
  );
}

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500 font-[family-name:var(--font-jetbrains)]">
        {label} {required && <span className="text-cyan-400">*</span>}
      </label>
      {children}
    </div>
  );
}
