/**
 * @file Test API Endpoint for Development
 * @description Route: /api/test
 * @description Provides simple GET and POST handlers for testing API connectivity
 * and request/response formats during development.
 */
import type { APIRoute } from "astro";

/**
 * GET handler that returns a simple success message.
 *
 * Useful for testing API connectivity and baseline functionality.
 * Returns JSON with confirmation that the API endpoint is working.
 *
 * @returns JSON response with success message
 */
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ message: "API working" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

/**
 * POST handler that echoes back the received data.
 *
 * Accepts any JSON payload and returns it in the response.
 * Useful for testing request body parsing and response formatting.
 *
 * @param request - Astro request object with JSON body
 * @returns JSON response containing the received data
 */
export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
  return new Response(JSON.stringify({ received: data }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
