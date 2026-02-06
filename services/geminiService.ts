
import { GoogleGenAI, Type } from "@google/genai";
import { ContractAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function analyzeContract(text: string): Promise<ContractAnalysisResult> {
  const model = "gemini-3-pro-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: `Analyze the following legal contract text for an Indian SME owner.
    
    1. Detect Language: Identify if text is English, Hindi, or mixed.
    2. Context: Focus on Indian laws (Contract Act 1872, Companies Act, Arbitration & Conciliation Act).
    3. Entities: Extract Parties, Financial amounts, and Jurisdiction.
    4. Categorize: Group clauses into Liability, IP, Termination, etc.
    5. Risk: Provide a 0-100 composite score and clause-level risk assessment.
    6. Explanations: Use simple business English/Hindi (Plain Language).
    7. Strategy: Suggest renegotiation alternatives for high-risk clauses.

    Contract Text:
    ${text}`,
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 4000 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          contractType: { type: Type.STRING },
          parties: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                role: { type: Type.STRING }
              }
            }
          },
          summary: { type: Type.STRING },
          compositeRiskScore: { type: Type.NUMBER },
          financials: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                description: { type: Type.STRING },
                amount: { type: Type.STRING }
              }
            }
          },
          keyDates: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                date: { type: Type.STRING },
                description: { type: Type.STRING }
              }
            }
          },
          jurisdiction: { type: Type.STRING },
          governingLaw: { type: Type.STRING },
          isHindiDetected: { type: Type.BOOLEAN },
          clauses: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                originalText: { type: Type.STRING },
                explanation: { type: Type.STRING },
                riskLevel: { type: Type.STRING, description: "LOW, MEDIUM, HIGH, CRITICAL" },
                riskReason: { type: Type.STRING },
                suggestedAlternative: { type: Type.STRING },
                category: { type: Type.STRING }
              }
            }
          }
        },
        required: ["contractType", "parties", "summary", "compositeRiskScore", "clauses"]
      }
    }
  });

  const data = JSON.parse(response.text || "{}");
  return {
    ...data,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString()
  } as ContractAnalysisResult;
}
