"use client";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [buttonText, setButtonText] = useState("Submit");
  const [status, setStatus] = useState({ submitted: false, message: "" });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setButtonText("Sending...");

    await fetch("https://formspree.io/f/xeqyqwqv", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        setStatus({ submitted: true, message: "Message sent successfully" });
        setButtonText("Submit");
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      })
      .catch((err) => {
        setStatus({ submitted: false, message: "Error sending message" });
        setButtonText("Submit");
      });
  };
  return (
    <div className="flex flex-col items-center w-full py-10 px-10">
      <div className="flex flex-col w-full  max-w-lg bg-[#D0C6DF] dark:bg-[#301856] p-4 mx-auto border-solid rounded-2xl border border-gray-400 dark:border-gray-700">
        <h1 className="text-center font-bold text-3xl">Contact me</h1>
        <form onSubmit={handleSubmit} className="w-full">
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
            className="my-2 p-2 w-full"
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
            className="my-2 p-2 w-full"
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
            className="my-2 p-2 w-full"
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
            className="my-2 p-2 w-full"
          />
          <div className="py-5 text-center">
            <button
              type="submit"
              className={
                "font-medium  text-center py-3 px-2 transition-all rounded-lg shadow-sm focus:ring focus:ring-primary-200 inline-flex items-center gap-4 bg-portfolio-white text-online-darkBlue hover:text-portfolio-darkBlue border dark:bg-inherit dark:text-white dark:hover:text-gray-300 dark:hover:border-gray-300"
              }
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
