import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, description, price, currency, company_name, manufacturing_country, keywords } = await req.json();

    console.log('Processing text input:', { title, description, price, currency, company_name, manufacturing_country, keywords });

    // Use GPT to enrich the product description and suggest category
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a product categorization and description enhancement AI. Given product information, you should:
            1. Enhance the description to be more compelling and detailed
            2. Suggest an appropriate product category
            3. Return the response in this exact JSON format:
            {
              "enhanced_description": "enhanced description text",
              "category": "suggested category"
            }`
          },
          {
            role: 'user',
            content: `Product: ${title}
Description: ${description}
Price: ${price} ${currency}
Company: ${company_name}
Manufacturing Country: ${manufacturing_country}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    const aiData = await response.json();
    
    console.log('OpenAI API response:', JSON.stringify(aiData, null, 2));
    
    if (!aiData.choices || aiData.choices.length === 0) {
      throw new Error(`OpenAI API error: ${JSON.stringify(aiData)}`);
    }
    
    const aiResponse = JSON.parse(aiData.choices[0].message.content);

    // Structure the response according to the expected format
    const result = {
      product_info: {
        title: title,
        description: aiResponse.enhanced_description || description,
        pricing: {
          amount: parseFloat(price),
          currency: currency
        },
        category: aiResponse.category || "General",
        company_name: company_name,
        manufacturing_country: manufacturing_country
      },
      keyword_timestamps: [], // Empty since no video
      keywords: keywords || []
    };

    console.log('Generated result:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-from-text function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});