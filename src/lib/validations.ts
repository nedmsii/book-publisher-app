import { z } from "zod";

export interface ContactValidationMessages {
  nameMin: string;
  nameMax: string;
  email: string;
  subjectMax: string;
  messageMin: string;
  messageMax: string;
  bot: string;
}

const defaultMessages: ContactValidationMessages = {
  nameMin: "Name must be at least 2 characters",
  nameMax: "Name must be under 100 characters",
  email: "Please enter a valid email address",
  subjectMax: "Subject must be under 200 characters",
  messageMin: "Message must be at least 10 characters",
  messageMax: "Message must be under 2000 characters",
  bot: "Bot detected",
};

export function buildContactFormSchema(messages: ContactValidationMessages = defaultMessages) {
  return z.object({
    name: z
      .string()
      .min(2, messages.nameMin)
      .max(100, messages.nameMax),
    email: z.string().email(messages.email),
    subject: z
      .string()
      .max(200, messages.subjectMax)
      .optional()
      .or(z.literal("")),
    message: z
      .string()
      .min(10, messages.messageMin)
      .max(2000, messages.messageMax),
    honeypot: z.string().max(0, messages.bot).optional(),
  });
}

// Default (English) schema — used by the API route.
export const contactFormSchema = buildContactFormSchema();

export type ContactFormValues = z.infer<typeof contactFormSchema>;
