"use client";

import { useState } from "react";
import { FAQ } from "@/types";

interface FAQSectionProps {
  faqs: FAQ[];
  heading: string;
}

export default function FAQSection({ faqs, heading }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section aria-labelledby="faq-heading">
      <h2
        id="faq-heading"
        className="font-serif text-2xl font-bold text-ink-900 mb-6"
      >
        {heading}
      </h2>
      <dl className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-ink-100 rounded-lg overflow-hidden"
          >
            <dt>
              <button
                type="button"
                className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-ink-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="font-semibold text-ink-800 text-sm pe-4">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-brand-600 shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </dt>
            <dd
              id={`faq-answer-${index}`}
              className={`overflow-hidden transition-all duration-200 ${
                openIndex === index ? "max-h-96" : "max-h-0"
              }`}
            >
              <p className="px-5 py-4 text-ink-600 text-sm leading-relaxed bg-brand-50 border-t border-ink-100">
                {faq.answer}
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
