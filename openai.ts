import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface HealthcareGuidanceRequest {
  message: string;
  language: string;
  conversationHistory?: Array<{ role: string; content: string }>;
}

export interface HealthcareGuidanceResponse {
  response: string;
  suggestions?: string[];
  needsHumanHelp?: boolean;
}

export async function getHealthcareGuidance({
  message,
  language,
  conversationHistory = []
}: HealthcareGuidanceRequest): Promise<HealthcareGuidanceResponse> {
  try {
    const getSystemPrompt = (lang: string) => {
      const basePrompt = `You are CareBot, a healthcare assistant helping people navigate the healthcare system, especially underserved communities and first-generation immigrants. Provide helpful guidance on:

- Finding healthcare providers
- Understanding insurance options  
- Preparing for appointments
- Basic treatment options
- Healthcare system navigation

Always be empathetic, clear, and helpful. If a question requires specific medical advice, recommend consulting with a healthcare professional.`;

      const languageInstructions: Record<string, string> = {
        'es': 'Responde SIEMPRE en español. Responde en formato JSON con: {"response": "tu respuesta", "suggestions": ["sugerencia1", "sugerencia2"], "needsHumanHelp": boolean}',
        'fr': 'Répondez TOUJOURS en français. Répondez au format JSON avec: {"response": "votre réponse", "suggestions": ["suggestion1", "suggestion2"], "needsHumanHelp": boolean}',
        'de': 'Antworten Sie IMMER auf Deutsch. Antworten Sie im JSON-Format mit: {"response": "Ihre Antwort", "suggestions": ["Vorschlag1", "Vorschlag2"], "needsHumanHelp": boolean}',
        'it': 'Rispondi SEMPRE in italiano. Rispondi in formato JSON con: {"response": "la tua risposta", "suggestions": ["suggerimento1", "suggerimento2"], "needsHumanHelp": boolean}',
        'pt': 'Responda SEMPRE em português. Responda em formato JSON com: {"response": "sua resposta", "suggestions": ["sugestão1", "sugestão2"], "needsHumanHelp": boolean}',
        'zh': '始终用中文回答。以JSON格式回答: {"response": "您的回答", "suggestions": ["建议1", "建议2"], "needsHumanHelp": boolean}',
        'ja': '必ず日本語で回答してください。JSON形式で回答: {"response": "あなたの回答", "suggestions": ["提案1", "提案2"], "needsHumanHelp": boolean}',
        'ko': '항상 한국어로 답변하세요. JSON 형식으로 답변: {"response": "당신의 답변", "suggestions": ["제안1", "제안2"], "needsHumanHelp": boolean}',
        'ar': 'اجب دائماً بالعربية. اجب بصيغة JSON: {"response": "إجابتك", "suggestions": ["اقتراح1", "اقتراح2"], "needsHumanHelp": boolean}',
        'hi': 'हमेशा हिंदी में जवाब दें। JSON प्रारूप में जवाब दें: {"response": "आपका जवाब", "suggestions": ["सुझाव1", "सुझाव2"], "needsHumanHelp": boolean}',
        'ru': 'Всегда отвечайте на русском языке. Отвечайте в формате JSON: {"response": "ваш ответ", "suggestions": ["предложение1", "предложение2"], "needsHumanHelp": boolean}',
        'en': 'Always respond in English. Respond in JSON format with: {"response": "your response", "suggestions": ["suggestion1", "suggestion2"], "needsHumanHelp": boolean}'
      };

      return basePrompt + '\n\n' + (languageInstructions[lang] || languageInstructions['en']);
    };

    const systemPrompt = getSystemPrompt(language);

    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: message }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages as any,
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      response: result.response || "I'm here to help with your healthcare questions.",
      suggestions: result.suggestions || [],
      needsHumanHelp: result.needsHumanHelp || false
    };
  } catch (error) {
    console.error("Error getting healthcare guidance:", error);
    throw new Error("Failed to get healthcare guidance: " + (error as Error).message);
  }
}

export async function generateInsuranceGuidance(
  userSituation: string,
  language: string = 'en'
): Promise<HealthcareGuidanceResponse> {
  const systemPrompt = language === 'es'
    ? `Eres un experto en seguros de salud que ayuda a personas sin seguro o con preguntas sobre seguros. Proporciona orientación práctica y específica basada en su situación. Responde en español en formato JSON.`
    : `You are a health insurance expert helping people who are uninsured or have insurance questions. Provide practical, specific guidance based on their situation. Respond in JSON format.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userSituation }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      response: result.response || "I can help you understand your insurance options.",
      suggestions: result.suggestions || [],
      needsHumanHelp: result.needsHumanHelp || false
    };
  } catch (error) {
    console.error("Error generating insurance guidance:", error);
    throw new Error("Failed to generate insurance guidance: " + (error as Error).message);
  }
}
