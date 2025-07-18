"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";

const Project = () => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [ButtonText, setButtonText] = useState("SUBMIT");

  const onSubmit = async (data) => {
    setButtonText("Submitting...");
    console.log(data)
    const formData = new FormData();
    formData.append("category",data.category)
    formData.append("title", data.title);
    formData.append("technologies", data.technologies);
    formData.append("image", data.image[0]);
    formData.append("liveUrl", data.liveUrl);
    formData.append("githubUrl", data.githubUrl);
    formData.append("description", data.description);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      // console.log("Upload success:", result);
      reset();
      setButtonText("Submitted Successfully");
      setTimeout(() => {
        setButtonText("SUBMIT");
      }, 3000);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };
  // {isSubmitting && <div>Loading...</div>}
  return (
    <section className="py-20 bg-white">
      <div className="max-w-2xl mx-auto w-[130vw] h-[140vh] px-4 sm:px-6 lg:px-8 border border-gray-200 rounded-2xl shadow-md hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-110">
        <form
          id="contact-form"
          className="space-y-6 mt-24"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label
              htmlFor="heading"
              className="block text-sm font-medium text-gray-700 mb-2"
            ></label>
            <h1 className=" text-gray-950 font-bold text-2xl relative top-[-60px] left-[180px]">
              Enter Project To Upload
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Project Title
              </label>

              <input
                placeholder="Project Title"
                {...register("title", {
                  required: { value: true, message: "This field is required" },
                })}
                type="text"
                className="w-full text-gray-950 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              {errors.title && (
                <p className="text-red-700">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Technologies
              </label>
              <input
                placeholder="Enter Technology Used"
                {...register("technologies", {})}
                type="text"
                className="w-full text-gray-950 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              {errors.technologies && (
                <p className="text-red-700">{errors.technologies.message}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Image
            </label>
            <input
              placeholder="Give Website Image"
              {...register("image", {
                required: { value: true, message: "This field is required" },
              })}
              type="file"
              accept="image/*"
              className="w-full text-gray-950 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            {errors.image && (
              <p className="text-red-700">{errors.image.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Catagory
            </label>
            <select
              id="color"
              {...register("category", { required: true })}
              className="w-full text-gray-950 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">-- Select Catagory --</option>
              <option value="Web Development">Web Development</option>
              <option value="Data Science">Data Science</option>
            </select>
            {errors.liveUrl && (
              <p className="text-red-700">{errors.liveUrl.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              LiveURL
            </label>
            <input
              placeholder="liveUrl"
              {...register("liveUrl")}
              type="text"
              className="w-full text-gray-950 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            {errors.liveUrl && (
              <p className="text-red-700">{errors.liveUrl.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              GitHubURL
            </label>
            <input
              placeholder="githubUrl"
              {...register("githubUrl")}
              type="text"
              className="w-full text-gray-950 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            {errors.githubUrl && (
              <p className="text-red-700">{errors.githubUrl.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              rows={6}
              placeholder="Tell me about your project..."
              {...register("description")}
              type="text"
              className="w-full text-gray-950 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <p className="text-xs text-gray-500 mt-1"></p>
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            value="submit"
            className="w-full h-10 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors cursor-pointer whitespace-nowrap"
          >
            {ButtonText}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Project;
