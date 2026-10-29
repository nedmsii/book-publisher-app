import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations";
import { sendContactNotification } from "@/lib/ses";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    const result = contactFormSchema.safeParse(body);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = String(err.path[0]);
        errors[field] = err.message;
      });
      return NextResponse.json(
        { success: false, message: "Validation failed", errors },
        { status: 400 }
      );
    }

    const { name, email, subject, message, honeypot } = result.data;

    // Honeypot check — silently succeed but don't send
    if (honeypot && honeypot.length > 0) {
      return NextResponse.json({ success: true, message: "Thank you for your message." });
    }

    // Send email notification. There is no database fallback, so a failed send
    // must surface to the user as an error.
    try {
      await sendContactNotification({
        name,
        email,
        subject,
        message,
        submittedAt: new Date(),
      });
    } catch (emailError) {
      console.error("SES email notification failed:", emailError);
      return NextResponse.json(
        { success: false, message: "Something went wrong. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Thank you for your message. Ibrahim will be in touch soon." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
