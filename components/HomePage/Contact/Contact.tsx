"use client";

import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import toast from "react-hot-toast";
import Image from "next/image";

interface Props {
  contact: {
    title: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    submit: string;
    submitSuccess: string;
    submitError: string;
    submitLoading: string;
    recaptchaError: string;
  };
}

const Contact = ({ contact }: Props) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [buttonText, setButtonText] = useState(contact.submit);
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
      toast.error(contact.recaptchaError);
      return;
    }
    setButtonText(contact.submitLoading);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, recaptchaToken }),
      });

      if (response.ok) {
        setStatus({ submitted: true, message: contact.submitSuccess });
        setButtonText(contact.submit);
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
        setRecaptchaToken(null);
        toast.success(contact.submitSuccess);
      } else {
        setStatus({ submitted: true, message: contact.submitError });
        setButtonText(contact.submit);
        toast.error(contact.submitError);
      }
    } catch (error) {
      console.error(contact.submitError + ": ", error);
      toast.error(contact.submitError);
      setButtonText(contact.submit);
    }
  };

  return (
    <div className="flex flex-col px-4">
      <div
        id="contact"
        className="flex flex-col md:flex-row gap-4 justify-center items-stretch  py-10 mt-24 container mx-auto border-solid rounded-2xl border-2 border-gray-400 dark:border-gray-600"
      >
        <div className="flex flex-col w-full max-w-md p-4 mx-auto">
          <h1 className="text-center font-semibold text-4xl mb-6">
            {contact.title}
          </h1>
          <form onSubmit={handleSubmit} className="w-full text-xl">
            <label
              className="text-shadow block text-xl font-medium"
              htmlFor="name"
            >
              {contact.name}:
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
              {contact.email}:
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
              {contact.phone}:
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
              {contact.message}:
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className="my-2 p-2 h-40 w-full rounded-3xl bg-inherit border-solid border-2 border-gray-400 dark:border-gray-600 transition-none outline-none focus:border-blue-400 dark:focus:border-blue-600"
            />
            <div className="my-4 flex justify-center overflow-hidden">
              <div className=" transform scale-90 sm:scale-100">
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                  onChange={(token) => setRecaptchaToken(token)}
                  onExpired={() => setRecaptchaToken(null)}
                />
              </div>
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
        <div className="items-center hidden md:flex justify-center w-full max-w-md mx-auto">
          <Image
            src={"/Contact_Fredrik_Carsten_Hansteen.png"}
            alt={"Contact Fredrik Carsten Hansteen"}
            width={500}
            height={500}
            loading="lazy"
            className="object-contain transform scale-x-[-1]"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
