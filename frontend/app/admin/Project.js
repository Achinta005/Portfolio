'use client'
import React from "react";
import { useForm } from "react-hook-form";

const Project = () => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const formData=new FormData();
    formData.append("title",data.title);
    formData.append("technologies",data.technologies);
    formData.append("image",data.image[0]);
    formData.append("liveUrl",data.liveUrl);
    formData.append("githubUrl",data.githubUrl);
    formData.append("description",data.description);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
        method: "POST",
        body: formData, 
      });

      const result = await res.json();
      console.log("Upload success:", result);
      reset();
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };


  return (
    <section className="py-20 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-gray-950 absolute top-20 left-130 font-bold text-3xl">Enter Project Info</h1>
        <form
          id="contact-form"
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >


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
                {...register("technologies", { })}
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
              {...register("image",{required:{value:true,message:"This field is required"}})}
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
            {isSubmitting ? "Submiting..." : "SUBMIT"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Project;
