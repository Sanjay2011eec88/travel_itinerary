import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TripDetails {
  destination: string;
  budget_level: string;
  start_date: string;
  end_date: string;
  num_travelers: number;
  accommodation_type: string;
  travel_mode: string;
  activities: string[];
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tripDetails } = await req.json() as { tripDetails: TripDetails };
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Calculate trip duration
    const startDate = new Date(tripDetails.start_date);
    const endDate = new Date(tripDetails.end_date);
    const tripDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const systemPrompt = `You are an expert travel planner AI. Create detailed, personalized travel itineraries based on user preferences.

Always respond with a valid JSON array containing the itinerary for each day. Each day should have this structure:
{
  "day_number": 1,
  "title": "Day title (e.g., 'Arrival & Old Town Exploration')",
  "activities": [
    {
      "time": "09:00",
      "title": "Activity name",
      "description": "Detailed description of the activity",
      "location": "Specific location or address",
      "cost": "Estimated cost (e.g., '$20-30' or 'Free')",
      "duration": "Estimated duration (e.g., '2 hours')",
      "tips": "Helpful tips for this activity"
    }
  ]
}

Guidelines:
- Consider the budget level when suggesting activities and dining options
- Include a mix of activities matching the user's interests
- Add practical tips for each activity
- Include realistic time estimates
- Suggest local dining options for meals
- Consider the travel mode for day trips
- Include some free activities and hidden gems
- Add cultural context and local insights`;

    const userPrompt = `Create a ${tripDays}-day travel itinerary for ${tripDetails.destination}.

Trip Details:
- Duration: ${tripDays} days (${tripDetails.start_date} to ${tripDetails.end_date})
- Travelers: ${tripDetails.num_travelers} ${tripDetails.num_travelers === 1 ? 'person' : 'people'}
- Budget Level: ${tripDetails.budget_level}
- Accommodation: ${tripDetails.accommodation_type}
- Travel Mode: ${tripDetails.travel_mode}
- Interests: ${tripDetails.activities.join(', ')}

Create a detailed day-by-day itinerary with activities, times, locations, costs, and tips. Make it practical and memorable.

Return ONLY a valid JSON array with no additional text or markdown.`;

    console.log(`Generating ${tripDays}-day itinerary for ${tripDetails.destination}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    console.log("AI response received, parsing itinerary...");

    // Parse the JSON response
    let itinerary;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        itinerary = JSON.parse(jsonMatch[0]);
      } else {
        itinerary = JSON.parse(content);
      }
    } catch (parseError) {
      console.error("Failed to parse itinerary JSON:", parseError);
      console.error("Raw content:", content);
      throw new Error("Failed to parse itinerary from AI response");
    }

    console.log(`Successfully generated itinerary with ${itinerary.length} days`);

    return new Response(
      JSON.stringify({ itinerary }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in generate-itinerary:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});