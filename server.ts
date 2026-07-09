import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API client on the server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Endpoint to fetch client IP address
app.get("/api/ip", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
  const formattedIp = Array.isArray(ip) ? ip[0] : ip;
  res.json({ ip: formattedIp.replace("::ffff:", "") });
});

// Endpoint to dynamically generate library science exercises via Gemini
app.post("/api/lessons/generate", async (req, res) => {
  const { gameType, level } = req.body;

  if (!gameType) {
    return res.status(400).json({ error: "gameType is required" });
  }

  try {
    let systemInstruction = "";
    let prompt = "";
    let responseSchema: any = null;

    if (gameType === "ddc") {
      if (Number(level) === 1) {
        systemInstruction = `You are a professional Library Science Professor. Generate an interactive Dewey Decimal Classification (DDC) matching question. 
The question must consist of a book title, a subject description, a correct DDC 3-digit class, and 4 matching options.
The book title can be in Burmese or English. Mix in local Myanmar flavor (e.g., Buddhism, Myanmar History, Culture, Agriculture).
Ensure one correct option and three plausible but incorrect options.
The correctDdc must exactly match one of the options.`;
        
        prompt = `Generate 1 new DDC level 1 Category Match question. Example DDC categories to use: 000 (Computer Science/General), 100 (Philosophy/Psychology), 200 (Religion), 300 (Social Sciences), 400 (Language), 500 (Science), 600 (Technology/Medicine), 700 (Arts), 800 (Literature), 900 (History/Geography).`;

        responseSchema = {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            subject: { type: Type.STRING },
            correctDdc: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  code: { type: Type.STRING },
                  label: { type: Type.STRING }
                },
                required: ["code", "label"]
              }
            }
          },
          required: ["id", "title", "subject", "correctDdc", "options"]
        };
      } else {
        systemInstruction = `You are a professional Library Science Professor. Generate 5 book objects to be sorted in ascending Dewey Decimal Classification decimal order.
Book titles can be in Burmese or English.
Provide call numbers which are decimal numbers (e.g. "510.3", "510.78", "512.09", "519.2", "519.5") that the user has to sort in correct numerical order.
Make sure they are not sorted inside the JSON array so the user actually has to sort them!`;

        prompt = `Generate a set of 5 books for DDC Level 2 Decimal Order sorting game. Include distinct call numbers that can be numerically ordered.`;

        responseSchema = {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            books: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  callNumber: { type: Type.STRING }
                },
                required: ["id", "title", "callNumber"]
              }
            }
          },
          required: ["id", "books"]
        };
      }
    } else if (gameType === "cataloging") {
      systemInstruction = `You are a professional Library Science Professor specializing in MARC 21 and AACR2/RDA Cataloging standards.
Generate a Book Title Page with detailed cataloging metadata (Title, Subtitle, Author, Publisher, Place, Year, ISBN, Edition).
Then, generate 3 cataloging multiple choice questions asking for the correct MARC 21 field values (such as Field 245 for Title/Responsibility, Field 100 for Author, Field 260/264 for Publication, or Field 020 for ISBN).
The language should be English, but can reference Burmese books or authors. Make sure options are challenging and realistic.`;

      prompt = `Generate 1 new full Cataloging book detail and a set of 3 MARC 21 multiple choice questions based on that book.`;

      responseSchema = {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          titlePage: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              subTitle: { type: Type.STRING },
              author: { type: Type.STRING },
              publisher: { type: Type.STRING },
              place: { type: Type.STRING },
              year: { type: Type.STRING },
              isbn: { type: Type.STRING },
              edition: { type: Type.STRING }
            },
            required: ["title", "author", "publisher", "place", "year", "isbn"]
          },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                marcField: { type: Type.STRING },
                fieldName: { type: Type.STRING },
                correctValue: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["id", "marcField", "fieldName", "correctValue", "options"]
            }
          }
        },
        required: ["id", "titlePage", "questions"]
      };
    } else if (gameType === "filing") {
      if (Number(level) === 1) {
        systemInstruction = `You are a professional Library Science Professor. Generate 5 English books to be sorted alphabetically based on Standard ALA/Library of Congress Filing Rules.
ALA Rules: Ignore initial articles 'A', 'An', and 'The' when sorting.
Provide a 'filedAs' field representing how they are filed (e.g. Title 'The Great Gatsby' is filed as 'Great Gatsby, The').
Provide a detailed 'ruleExplanation' explaining the filing rule in English or Burmese.`;

        prompt = `Generate a set of 5 English books for Level 1 English filing rules sorting. Include books starting with A, An, The, and other normal words.`;

        responseSchema = {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            books: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  author: { type: Type.STRING },
                  filedAs: { type: Type.STRING },
                  ruleExplanation: { type: Type.STRING }
                },
                required: ["id", "title", "author", "filedAs", "ruleExplanation"]
              }
            }
          },
          required: ["id", "books"]
        };
      } else {
        systemInstruction = `You are a professional Library Science Professor. Generate 5 Myanmar-titled books to be sorted alphabetically according to the Myanmar alphabet sequence (က, ခ, ဂ, ဃ, င, ... ည, ... တ, ထ, ...).
Provide a 'filedAs' field representing the first letter (or Burmese collation key) to sort by.
Provide a detailed explanation of why the sorting goes this way.`;

        prompt = `Generate a set of 5 Myanmar books for Level 2 Myanmar alphabetical sorting. Ensure they represent distinct, consecutive, or sequential letters of the Myanmar alphabet so sorting is clear.`;

        responseSchema = {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            books: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  author: { type: Type.STRING },
                  filedAs: { type: Type.STRING },
                  ruleExplanation: { type: Type.STRING }
                },
                required: ["id", "title", "author", "filedAs", "ruleExplanation"]
              }
            }
          },
          required: ["id", "books"]
        };
      }
    } else if (gameType === "subject") {
      systemInstruction = `You are a professional Library Science Professor specializing in Library of Congress Subject Headings (LCSH) or localized classifications.
Generate an exercise that provides a Book Title and a Description of what the book covers.
The user has to identify the correct Subject Heading out of 4 options.
Write in a combination of English and Burmese (Burmese translation in parentheses).`;

      prompt = `Generate 1 new Subject Heading identification question. Include realistic book title, description, and 4 subject options.`;

      responseSchema = {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          bookTitle: { type: Type.STRING },
          description: { type: Type.STRING },
          correctSubject: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["id", "bookTitle", "description", "correctSubject", "options"]
      };
    } else if (gameType === "gk") {
      systemInstruction = `You are a professional Library Science Professor. Generate a General Knowledge multiple-choice question derived from library science, information management, historical monastic catalogs, or library operations.
Provide 4 options, a correctIndex (0 to 3), and a detailed explanation of the answer in Burmese/English.
Question can be in Burmese or English.`;

      prompt = `Generate 1 library science General Knowledge multiple choice quiz question.`;

      responseSchema = {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          question: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          correctIndex: { type: Type.INTEGER },
          explanation: { type: Type.STRING }
        },
        required: ["id", "question", "options", "correctIndex", "explanation"]
      };
    }

    // Call the Gemini API
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text.trim());
    
    // Inject a random ID if not present or is placeholder
    if (!data.id || data.id.startsWith("ai_") === false) {
      data.id = `ai_${gameType}_${Math.random().toString(36).substring(2, 11)}`;
    }

    res.json(data);
  } catch (err: any) {
    console.error("Gemini generation failed:", err);
    res.status(500).json({ error: "သင်ခန်းစာအသစ် ထုတ်လုပ်ခြင်း မအောင်မြင်ပါ။ ကျေးဇူးပြု၍ ပြန်လည်ကြိုးစားပေးပါ။", details: err.message });
  }
});

// Configure Vite middleware in development or serve static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
