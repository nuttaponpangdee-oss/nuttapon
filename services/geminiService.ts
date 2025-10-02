
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const explainKValue = async (kValue: number): Promise<string> => {
  try {
    const prompt = `อธิบายความหมายของค่า K งานก่อสร้างที่คำนวณได้เท่ากับ ${kValue.toFixed(4)} แบบสั้นๆ และเข้าใจง่ายสำหรับผู้รับเหมา โดยบอกว่าค่าก่อสร้างเพิ่มขึ้นหรือลดลงกี่เปอร์เซ็นต์`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "เกิดข้อผิดพลาดในการเรียกใช้ AI เพื่อสร้างคำอธิบาย โปรดลองอีกครั้ง";
  }
};
