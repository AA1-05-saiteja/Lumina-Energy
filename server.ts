import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Parser limits increased to support image uploads for bill analysis
app.use(express.json({ limit: "15mb" }));

// Initialize Gemini client safely with the recommended headers for telemetry and build standards
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
} catch (error) {
  console.error("Failed to initialize GoogleGenAI client:", error);
}

// 1. Lumina Assistant Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Missing 'message' field in body." });
    }

    if (!ai) {
      // Elegant mock assistant response when API key is unconfigured
      return res.json({
        text: `I'm currently running in offline preview mode. Here's what I can analyze about your home:\n\n- **HVAC optimization**: Your heater is running nicely, but shifting its setpoint by 2°F before peak hours could save you up to ₹2,000 this month.\n\n*(To activate my live AI brain, please configure the **GEMINI_API_KEY** in the Secrets panel in AI Studio!)*`,
        mode: "offline"
      });
    }

    // Format chat history for Gemini
    // Gemini 3.5 API contents structure: [{ role: 'user' | 'model', parts: [{ text: '...' }] }]
    const formattedContents: any[] = [];
    
    // Inject system-level context or parameters as a system instruction
    const systemInstruction = `You are Lumina Energy Assistant, a highly advanced energy intelligence chatbot.
You help homeowners understand their smart-meter data, HVAC efficiency, EV charging schedules, and solar potential.
Ensure all financial numbers, bills, and potential savings you cite are exclusively in Indian Rupees (INR), utilizing the "₹" symbol.
Current Home Overview Context:
- Current HVAC usage is 15% higher than normal given outside temperature. Running diagnostics shows slight airflow restriction suggesting filter replacement.
- Active AI savings this year (YTD) stands at ₹22,760 (142 kWh shifted).
- Current power consumption is 842 kWh (down 4.2% vs last month).
- Eco Score is 82/100 (Excellent).
- Home contains a Central HVAC, Water Heater (Standby), basement Refrigerator (running high, potential maintenance item), and washer/dryer (currently off).
- Custom User settings context: ${JSON.stringify(context || {})}._
Be helpful, professional, concise, and scientifically accurate. Recommend shifting EV charging to late-night and pre-cooling before 16:00. Use standard Markdown in your response.`;

    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        formattedContents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        });
      });
    }

    formattedContents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      text: response.text || "I was unable to formulate a response. Please try again.",
      mode: "live"
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "Error processing chat request",
      details: error.message || error,
    });
  }
});

// 2. Bill Analysis API - processes base64 uploaded bill visuals
app.post("/api/bill-analysis", async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64 || !mimeType) {
      return res.status(400).json({ error: "Missing imageBase64 or mimeType." });
    }

    if (!ai) {
      // Mock parsing for offline environment
      return res.json({
        success: true,
        data: {
          billingPeriod: "May 1 - May 31, 2026",
          totalUsageKwh: 842,
          totalAmount: 11880.00,
          peakRateKwh: 12.00,
          offPeakRateKwh: 6.00,
          carbonIntensity: "Medium-Low (342 kg)",
          breakdownExplanations: "Extracted from simulated bill upload in Indian Rupees (INR). Base fuel charge and local power regulatory surcharges apply.",
          isMock: true
        }
      });
    }

    const imagePart = {
      inlineData: {
        data: imageBase64.split(",")[1] || imageBase64,
        mimeType,
      },
    };

    const promptText = `Analyze this utility energy bill carefully. Extract the following information in JSON format, calculating and converting all billing totals and electricity tariff charges strictly to Indian Rupees (INR) with standard Rupee format:
{
  "billingPeriod": "String containing start/end date",
  "totalUsageKwh": Number representing total kilowatt hours used,
  "totalAmount": Number representing total cost/bill amount in Indian Rupees (₹),
  "peakRateKwh": Number representing average rate per kWh in Rupees during peak times,
  "offPeakRateKwh": Number representing average rate per kWh in Rupees during offpeak times,
  "carbonIntensity": "Text summary of greenhouse emissions listed on the bill",
  "breakdownExplanations": "Bullet points highlighting any dynamic pricing fees, taxes, or grid transmission surcharges"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: [imagePart, { text: promptText }] },
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json({
      success: true,
      data: parsedData,
      isMock: false
    });
  } catch (error: any) {
    console.error("Bill Analysis error:", error);
    res.status(500).json({
      error: "Could not analyze energy bill.",
      details: error.message || error
    });
  }
});

// 3. Simulated/Triggerable active diagnostics
app.post("/api/diagnostics", (req, res) => {
  const { system } = req.body;
  if (system === "HVAC") {
    return res.json({
      status: "warning",
      score: 72,
      recommendations: [
        "Change the return air filter immediately (est. air flow restricted by 18%).",
        "Clean condenser coils to improve heat transfer coefficient.",
        "Set temperature setbacks to 76°F during peak outdoor thermal conditions (2 PM - 6 PM)."
      ],
      estimatedSavings: 1230.00,
    });
  }
  res.json({ status: "healthy", score: 98 });
});

// 4. Vite Dev Server Integration & Static Production Setup
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
    console.log(`Lumina Energy server up on http://localhost:${PORT}`);
  });
}

startServer();
