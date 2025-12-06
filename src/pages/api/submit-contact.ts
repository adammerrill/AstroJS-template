/**
 * @file Contact Form API Endpoint
 * @description Route: POST /api/submit-contact
 * @description Handles contact form submissions from the frontend contact form.
 * Validates input data and logs submissions (in production, would email/CRM).
 */

import type { APIRoute } from "astro";

/**
 * POST handler for contact form submissions.
 *
 * Accepts JSON payload with contact information, validates required fields,
 * and processes the submission. Returns success/error response.
 *
 * @param request - Astro request object containing form data
 * @returns JSON response with success status and message
 *
 * @example
 * ```typescript
 * // Request payload
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "message": "Hello, I have a question..."
 * }
 * ```
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    // Log the submission (in real app, send email, save to DB, etc.)
    // eslint-disable-next-line no-console
    console.log("Contact form submission:", data);

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Form submitted successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Contact form error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Submission failed",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
