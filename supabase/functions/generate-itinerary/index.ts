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
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    // Default to OpenAI, fallback to Lovable
    const useOpenAI = !!OPENAI_API_KEY;
    
    if (!useOpenAI && !LOVABLE_API_KEY) {
      throw new Error("Neither OPENAI_API_KEY nor LOVABLE_API_KEY is configured");
    }

    // Calculate trip duration
    const startDate = new Date(tripDetails.start_date);
    const endDate = new Date(tripDetails.end_date);
    const tripDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const systemPrompt = useOpenAI 
      ? `You are an expert travel planner AI. Create detailed, personalized travel itineraries based on user preferences.

Respond with a JSON object containing an "itinerary" array. Each day should have this structure:
{
  "itinerary": [
    {
      "day_number": 1,
      "title": "Day title (e.g., 'Arrival & Old Town Exploration')",
      "activities": [
        {
          "time": "09:00",
          "title": "Activity name",
          "description": "Detailed description of the activity",
          "location": "Specific location or address",
          "cost": "Estimated cost in USD (e.g., '$20-30' or 'Free')",
          "duration": "Estimated duration (e.g., '2 hours')",
          "tips": "Helpful tips for this activity"
        }
      ]
    }
  ]
}

Guidelines:
- IMPORTANT: Always use USD ($) for all cost estimates, regardless of destination
- Consider the budget level when suggesting activities and dining options
- Include a mix of activities matching the user's interests
- Add practical tips for each activity
- Include realistic time estimates
- Suggest local dining options for meals
- Consider the travel mode for day trips
- Include some free activities and hidden gems
- Add cultural context and local insights`
      : `You are an expert travel planner AI. Create detailed, personalized travel itineraries based on user preferences.

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
      "cost": "Estimated cost in USD (e.g., '$20-30' or 'Free')",
      "duration": "Estimated duration (e.g., '2 hours')",
      "tips": "Helpful tips for this activity"
    }
  ]
}

Guidelines:
- IMPORTANT: Always use USD ($) for all cost estimates, regardless of destination
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

    console.log(`Generating ${tripDays}-day itinerary for ${tripDetails.destination} using ${useOpenAI ? 'OpenAI' : 'Lovable AI'}`);

    let response;
    let usedFallback = false;
    
    if (useOpenAI) {
      try {
        // Use OpenAI API - gpt-4o-mini is cheaper and better than gpt-3.5-turbo
        response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 4000,
            response_format: { type: "json_object" },
          }),
        });

        // If OpenAI rate limited and Lovable API is available, fallback
        if ((response.status === 429 || response.status === 400) && LOVABLE_API_KEY) {
          const errorText = await response.text();
          console.log(`OpenAI error (${response.status}): ${errorText}`);
          console.log("Falling back to Lovable AI...");
          usedFallback = true;
          
          response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
              max_tokens: 4000,
            }),
          });
        }
      } catch (error) {
        // If OpenAI fails and Lovable is available, try fallback
        if (LOVABLE_API_KEY) {
          console.log("OpenAI error, falling back to Lovable AI...");
          console.error("Error:", error);
          usedFallback = true;
          
          response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
              max_tokens: 4000,
            }),
          });
        } else {
          throw error;
        }
      }
    } else {
      // Use Lovable AI as primary
      response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
          max_tokens: 4000,
        }),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      // Return detailed error information
      return new Response(
        JSON.stringify({ 
          error: `AI gateway error: ${response.status}`,
          details: errorText,
          provider: usedFallback ? 'Lovable AI' : (useOpenAI ? 'OpenAI' : 'Lovable AI')
        }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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
      console.log("Raw AI response (first 500 chars):", content.substring(0, 500));
      
      let parsed;
      
      // Try to parse the content as JSON
      try {
        parsed = JSON.parse(content);
      } catch (e) {
        // If direct parsing fails, try to extract JSON from markdown or text
        const jsonMatch = content.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Could not find valid JSON in response");
        }
      }
      
      // Extract the itinerary array from various possible structures
      if (Array.isArray(parsed)) {
        itinerary = parsed;
      } else if (parsed.itinerary && Array.isArray(parsed.itinerary)) {
        itinerary = parsed.itinerary;
      } else if (parsed.days && Array.isArray(parsed.days)) {
        itinerary = parsed.days;
      } else if (typeof parsed === 'object') {
        // Try to find an array in the object
        const possibleArray = Object.values(parsed).find(val => Array.isArray(val));
        if (possibleArray) {
          itinerary = possibleArray;
        } else {
          throw new Error("Could not find itinerary array in response object");
        }
      } else {
        throw new Error("Unexpected response format");
      }
      
      if (!Array.isArray(itinerary) || itinerary.length === 0) {
        throw new Error("Itinerary is not a valid non-empty array");
      }
      
      console.log(`Successfully parsed ${itinerary.length} days`);
    } catch (parseError) {
      console.error("Failed to parse itinerary JSON:", parseError);
      console.error("Raw content:", content);
      throw new Error(`Failed to parse itinerary from AI response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }

    console.log(`Successfully generated itinerary with ${itinerary.length} days`);

    return new Response(
      JSON.stringify({ itinerary }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in generate-itinerary:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        details: error instanceof Error ? error.stack : undefined
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
