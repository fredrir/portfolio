"use client";

import { ContactForm } from "@/components/HomePage/Contact/ContactForm";
import type { ContactProps } from "@/components/HomePage/Contact/types";

export function ContactPane({ contact }: ContactProps) {
  return <ContactForm contact={contact} />;
}
