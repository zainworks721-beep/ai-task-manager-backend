import Groq from 'groq-sdk';

let groqClient = null;

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured in environment variables.');
  }
  if (!groqClient) {
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
};


const planTask = async (req, res, next) => {
  try {
    const { description } = req.body;

   
    if (!description || typeof description !== 'string' || description.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task description is required and cannot be empty.',
      });
    }

  
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'AI Service is not configured. Missing GROQ_API_KEY in environment variables.',
      });
    }

    const groq = getGroqClient();

    const model = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
    

    
    const systemPrompt = `You are an expert productivity and project management assistant.
Your job is to analyze task descriptions and break them down into actionable execution plans.

Language Rule: Automatically detect the language of the task description. If the user writes in Roman Urdu/Hindi, generate the "summary" and "steps" in natural Roman Urdu. Otherwise, use English.

You MUST output ONLY a valid JSON object matching the exact schema below:
{
  "summary": "String (Task summary in user's language)",
  "priority": "low" | "medium" | "high",
  "estimatedHours": Number,
  "steps": [
    "String (Actionable step in user's language)",
    "String (Actionable step in user's language)"
  ]
}`;

    const userPrompt = `Generate a structured execution plan for the following task description:
"${description.trim()}"`;

   
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      model: model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
    });

    const rawResponse = completion.choices?.[0]?.message?.content;

    if (!rawResponse) {
      return res.status(502).json({
        success: false,
        message: 'Received empty response from AI service.',
      });
    }

    let parsedPlan;
    try {
    
      const cleanedResponse = rawResponse
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      parsedPlan = JSON.parse(cleanedResponse);

    
      parsedPlan = {
        summary: parsedPlan.summary || description.trim().slice(0, 150),
        priority: ['low', 'medium', 'high'].includes(String(parsedPlan.priority).toLowerCase())
          ? String(parsedPlan.priority).toLowerCase()
          : 'medium',
        estimatedHours: typeof parsedPlan.estimatedHours === 'number'
          ? parsedPlan.estimatedHours
          : Number(parsedPlan.estimatedHours) || 1,
        steps: Array.isArray(parsedPlan.steps) ? parsedPlan.steps : [],
      };
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', rawResponse);
      return res.status(502).json({
        success: false,
        message: 'Failed to parse AI-generated plan into structured format.',
        raw: rawResponse,
      });
    }


    return res.status(200).json({
      success: true,
      plan: parsedPlan,
    });
  } catch (error) {
    if (error.status) {
      console.error(`Groq API Error (${error.status}):`, error.message);
      return res.status(error.status >= 400 && error.status < 600 ? error.status : 502).json({
        success: false,
        message: `AI Service Error: ${error.message}`,
      });
    }
    next(error);
  }
};

export{
  planTask,
};
