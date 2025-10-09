"use client";

import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { Header } from "../../components/organisms/Header/Header";

export default function HelpPage() {
  return (
    <div className="container bg-white min-h-screen min-w-full">
      <Header />
      <h1 className="text-2xl font-bold text-black font-semibold text-center my-4">
        Developer Support
      </h1>
      <p className="text-center mb-6 text-black">
        If you are facing any issues or have questions about the app, feel free
        to get in touch.
      </p>

      <div className="contact-info bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl text-black mb-4">Contact Information</h2>
        <ul className="list-none text-sm space-y-2">
          <li className="flex items-center gap-2 text-black">
            <Mail className="h-4 w-4 text-blue-600" /> Email:{" "}
            <a
              href="mailto:senthilkumar@mentorbridge.in"
              className="text-blue-600"
            >
              senthilkumar@mentorbridge.in
            </a>
          </li>
          <li className="flex items-center gap-2 text-black">
            <Github className="h-4 w-4 text-blue-600" />
            Github:{" "}
            <a
              href="https://github.com/senthilkumar979"
              className="text-blue-600"
            >
              github.com/senthilkumar979
            </a>
          </li>
          <li className="flex items-center gap-2 text-black">
            <Twitter className="h-4 w-4 text-blue-600" />
            Twitter:{" "}
            <a href="https://twitter.com/senthilk979" className="text-blue-600">
              @senthilk979
            </a>
          </li>
          <li className="flex items-center gap-2 text-black">
            <Linkedin className="h-4 w-4 text-blue-600" />
            LinkedIn:{" "}
            <a
              href="https://www.linkedin.com/in/senthilk979"
              className="text-blue-600"
            >
              linkedin.com/in/senthilk979
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
