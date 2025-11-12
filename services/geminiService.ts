import { GoogleGenAI } from "@google/genai";
import type { FormState, GeneratedContent } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const buildPrompt = (formState: FormState): string => {
    return `
    You are an expert curriculum developer and teacher for Indonesian Madrasah Tsanawiyah (MTs) specializing in creating high-quality exam materials based on Kurikulum Merdeka.

    Your task is to generate a complete exam package based on the following specifications. Follow every instruction carefully.

    **SPECIFICATIONS:**
    - **Nama Mata Pelajaran:** ${formState.subject}
    - **Fase/Kelas:** Fase D (Kelas ${formState.kelas} MTs)
    - **Topik/Materi:** ${formState.topic}
    - **Alokasi Waktu:** 90 menit
    - **Jumlah Soal:** ${formState.questionCount} butir
    - **Bentuk Soal yang Diinginkan:** ${formState.bentukSoal.join(', ')}

    **STRUCTURE AND CONTENT REQUIREMENTS:**

    **🧩 Bagian 1. Identitas Soal**
    - Fill this section with the specifications provided above.

    **🎯 Bagian 2. Tujuan Pembelajaran**
    - Write learning objectives that are relevant to the topic and the Kurikulum Merdeka Phase D Learning Outcomes (Capaian Pembelajaran) for the specified class (${formState.kelas}).

    **🧮 Bagian 3. Kisi-Kisi Soal (Tabel)**
    - Create a detailed exam blueprint table with the following columns: | No | Capaian Pembelajaran | Tujuan Pembelajaran | Indikator Soal | Level Kognitif (C1–C6) | Bentuk Soal | Tingkat Kesulitan (M/S/S) | Nomor Soal |
    - Ensure the content of the blueprint aligns perfectly with the questions you create. The "Bentuk Soal" column must only contain types from the requested list: ${formState.bentukSoal.join(', ')}.

    **✏️ Bagian 4. Soal Ujian**
    - Create exactly ${formState.questionCount} questions.
    - **IMPORTANT: You MUST ONLY use the following selected question types: ${formState.bentukSoal.join(', ')}. Do not use any other type.**
    - Distribute the number of questions for each type logically.
    - For each question, you MUST provide:
        1. The question number and type (e.g., "Pilihan Ganda", "Benar atau Salah").
        2. The main question text.
        3. Answer choices (if applicable).
        4. The correct answer key.
        5. A brief explanation/discussion (pembahasan).
        - For Mathematics, include the step-by-step solution in the explanation.
        - For Arabic, include harakat, transliteration, and translation.

    **📋 Bagian 5. Kunci Jawaban dan Pembahasan (Tabel)**
    - If the user did NOT request the answer key directly under each question, create a final summary table with these columns: | No | Bentuk Soal | Jawaban Benar | Pembahasan Singkat |
    - Note: For this task, **ALWAYS include the answer key and discussion directly under each question in Bagian 4**. You can either omit Bagian 5 or create it as an additional summary. For simplicity and better user experience, providing it in Bagian 4 is sufficient. Create the final summary table in Bagian 5 as well for completeness.
    
    **GENERAL RULES:**
    - Use clear, communicative language appropriate for MTs students of class ${formState.kelas}.
    - Vary the difficulty level (easy, medium, hard).
    - Use a range of cognitive levels (C1-C6, Bloom's Taxonomy).
    - Use real-world contexts relevant to students' lives for PAI and language subjects.

    **OUTPUT FORMAT:**
    Your final and ONLY output must be a single, valid JSON object. Do not include any text, explanations, or markdown formatting like \`\`\`json before or after the JSON object. The JSON object must strictly conform to this TypeScript interface:

    \`\`\`typescript
    interface IdentitasSoal {
      mataPelajaran: string;
      faseKelas: string;
      topikMateri: string;
      alokasiWaktu: string;
      jumlahSoal: number;
    }

    interface KisiKisiItem {
      no: number;
      capaianPembelajaran: string;
      tujuanPembelajaran: string;
      indikatorSoal: string;
      levelKognitif: string;
      bentukSoal: string; // e.g., "Pilihan Ganda"
      tingkatKesulitan: string; // "Mudah", "Sedang", or "Sulit"
      nomorSoal: string;
    }

    interface SoalUjianItem {
      nomor: number;
      bentukSoal: string; // e.g., "Pilihan Ganda"
      soal: string;
      pilihan?: string[]; // For PG, PGK. e.g., ["A. Jawaban 1", "B. Jawaban 2"]
      kunciJawaban: string | string[]; // string for most, string[] for PGK
      pembahasan: string;
    }

    interface KunciJawabanTabelItem {
      no: number;
      bentukSoal: string;
      jawabanBenar: string | string[];
      pembahasanSingkat: string;
    }
    
    interface GeneratedContent {
      identitasSoal: IdentitasSoal;
      tujuanPembelajaran: string[];
      kisiKisi: KisiKisiItem[];
      soalUjian: SoalUjianItem[];
      kunciJawabanTabel: KunciJawabanTabelItem[];
    }
    \`\`\`

    Now, generate the exam package.
    `;
};


export const generateExamContent = async (formState: FormState): Promise<GeneratedContent> => {
  const prompt = buildPrompt(formState);
  
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
    });

    const text = response.text;
    
    // Clean the response text to ensure it's a valid JSON
    const cleanedText = text.replace(/^```json\s*|```\s*$/g, '').trim();

    try {
        const parsedContent: GeneratedContent = JSON.parse(cleanedText);
        return parsedContent;
    } catch (e) {
        console.error("Failed to parse JSON:", cleanedText);
        throw new Error("The AI returned an invalid format. Please try again.");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate content from the AI. Please check your API key and try again later.");
  }
};