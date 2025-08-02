'use client'
import React from "react";
import { useForm } from "react-hook-form";

const ContactForm2 = () => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      console.log(result.message);
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <section className="py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <form
          id="contact-form"
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-800 mb-2 "
              >
                Full Name
              </label>

              <input
                placeholder="Your name"
                {...register("name", {
                  required: { value: true, message: "This field is required" },
                })}
                type="text"
                className="w-full text-gray-950 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              {errors.name && (
                <p className="text-red-700">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-800 mb-2 "
              >
                Email Address
              </label>
              <input
                placeholder="your.email@example.com"
                {...register("email", {
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email format",
                  },
                })}
                type="text"
                className="w-full text-gray-950 px-4 py-3 border dark:text-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              {errors.email && (
                <p className="text-red-700">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-800 mb-2 "
            >
              Subject
            </label>
            <input
              placeholder="What's this about?"
              {...register("subject")}
              type="text"
              className="w-full text-gray-950 px-4 py-3 border dark:text-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-800 mb-2 "
            >
              Message
            </label>
            <textarea
              rows={6}
              placeholder="What Do You Want To Tell Me..."
              {...register("message")}
              type="text"
              className="w-full text-gray-950 px-4 py-3 border dark:text-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <p className="text-xs text-gray-500 mt-1"></p>
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            value="submit"
            className="w-full h-10 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors cursor-pointer whitespace-nowrap"
          >
            {isSubmitting ? "Submiting..." : "SUBMIT"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm2;
