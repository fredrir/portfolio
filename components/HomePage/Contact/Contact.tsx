"use client";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import toast from "react-hot-toast";
import Image from "next/image";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [buttonText, setButtonText] = useState("Submit");
  const [status, setStatus] = useState({ submitted: false, message: "" });
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!recaptchaToken) {
      toast.error("Please complete the reCAPTCHA.");
      return;
    }
    setButtonText("Sending...");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, recaptchaToken }),
      });

      if (response.ok) {
        setStatus({ submitted: true, message: "Message sent successfully" });
        setButtonText("Submit");
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
        setRecaptchaToken(null);
        toast.success("Message sent successfully");
      } else {
        setStatus({ submitted: true, message: "Failed to send message" });
        setButtonText("Submit");
        toast.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending email: ", error);
      toast.error("Error sending message");
      setButtonText("Submit");
    }
  };

  return (
    <div
      id="contact"
      className="flex flex-row gap-4 justify-center items-stretch px-4 py-10 mt-24 container mx-auto border-solid rounded-2xl border-2 border-gray-400 dark:border-gray-600"
    >
      <div className="flex flex-col w-full max-w-md p-4">
        <h1 className="text-center font-semibold text-4xl mb-6">Contact me</h1>
        <form onSubmit={handleSubmit} className="w-full text-xl">
          <label
            className="text-shadow block text-xl font-medium"
            htmlFor="name"
          >
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="my-2 p-2 w-full rounded-3xl bg-inherit border-solid border-2 border-gray-400 dark:border-gray-600 transition-none outline-none focus:border-blue-400 dark:focus:border-blue-600"
          />
          <label
            className="text-shadow block text-xl font-medium"
            htmlFor="email"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="my-2 p-2 w-full rounded-3xl bg-inherit border-solid border-2 border-gray-400 dark:border-gray-600 transition-none outline-none focus:border-blue-400 dark:focus:border-blue-600"
          />
          <label
            className="text-shadow block text-xl font-medium"
            htmlFor="phone"
          >
            Phone:
          </label>
          <input
            type="phone"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="my-2 p-2 w-full rounded-3xl bg-inherit border-solid border-2 border-gray-400 dark:border-gray-600 transition-none outline-none focus:border-blue-400 dark:focus:border-blue-600"
          />
          <label
            className="text-shadow block text-xl font-medium"
            htmlFor="message"
          >
            Message:
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="my-2 p-2 h-40 w-full rounded-3xl bg-inherit border-solid border-2 border-gray-400 dark:border-gray-600 transition-none outline-none focus:border-blue-400 dark:focus:border-blue-600"
          />
          <div className="my-4 flex items-center justify-center">
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              onChange={(token) => setRecaptchaToken(token)}
              onExpired={() => setRecaptchaToken(null)}
            />
          </div>
          <div className="py-5 text-center">
            <button
              type="submit"
              className="font-medium text-center py-3 px-6 transition-all rounded-lg inline-flex items-center gap-4 bg-inherit dark:hover:border-green-600 dark:hover:text-green-600 hover:scale-105 border-solid border-2 border-green-700 dark:border-green-400 dark:text-green-400 text-green-700"
            >
              {buttonText}
            </button>
          </div>
        </form>
      </div>
      <div className="items-center hidden md:flex justify-center w-full max-w-md">
        <Image
          src={"/Fredrik_Hansteen_Pointing.png"}
          alt={"Contact me"}
          layout="responsive"
          width={500}
          height={500}
          className="object-contain transform scale-x-[-1]"
        />
      </div>
    </div>
  );
};

export default Contact;
