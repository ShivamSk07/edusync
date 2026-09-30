import Groq from "groq-sdk";
import { createServerFn } from "@tanstack/react-start";

// Comprehensive intelligent offline & fallback knowledge response generator
function generateLocalAIResponse(query: string, lang: "en" | "hi" = "en", context?: string): string {
  const q = query.toLowerCase();
  const isHi = lang === "hi" || /[\u0900-\u097F]/.test(query);

  // 1. Photosynthesis & Botany
  if (q.includes("photo") || q.includes("प्रकाश") || q.includes("plant") || q.includes("chlorophyll") || q.includes("leaf")) {
    if (isHi) {
      return `### प्रकाश-संश्लेषण (Photosynthesis) 🌿

**परिभाषा:**
प्रकाश-संश्लेषण वह जैव-रासायनिक प्रक्रिया है जिसके द्वारा हरे पौधे सूर्य के प्रकाश और क्लोरोफिल की उपस्थिति में जल ($H_2O$) और कार्बन डाइऑक्साइड ($CO_2$) से कार्बोहाइड्रेट (ग्लूकोज) का निर्माण करते हैं तथा ऑक्सीजन ($O_2$) मुक्त करते हैं।

#### रासायनिक समीकरण:
\`\`\`
6CO₂ + 6H₂O + सूर्य का प्रकाश (Sunlight) → C₆H₁₂O₆ (Glucose) + 6O₂
\`\`\`

#### मुख्य चरण:
1. **प्रकाशिक अभिक्रिया (Light Reaction - Thylakoids):** सौर ऊर्जा का अवशोषण, जल का प्रकाशीय अपघटन (Photolysis) और $ATP$ तथा $NADPH$ का निर्माण।
2. **अप्रकाशिक अभिक्रिया (Dark Reaction / Calvin Cycle - Stroma):** $CO_2$ का स्थिरीकरण और ग्लूकोज का संश्लेषण।

#### परीक्षा उपयोगी तथ्य:
- **मुख्य वर्णक:** क्लोरोफिल-ए (Chlorophyll-a)
- **उत्सर्जित गैस:** ऑक्सीजन ($O_2$), जो जल के अणुओं के टूटने से निकलती है।`;
    }

    return `### Photosynthesis Explained 🌿

**Definition:**
Photosynthesis is the biochemical process by which autotrophic green plants synthesize organic nutrients (glucose) from carbon dioxide ($CO_2$) and water ($H_2O$) in the presence of solar radiant energy and chlorophyll, releasing oxygen ($O_2$) as a byproduct.

#### Chemical Equation:
\`\`\`
6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ (Glucose) + 6O₂
\`\`\`

#### Two Essential Phases:
1. **Light-Dependent Phase (Thylakoid Membrane):** Chlorophyll absorbs photons, splitting $H_2O$ molecules into protons, electrons, and $O_2$ while generating $ATP$ and $NADPH$.
2. **Light-Independent Phase / Calvin Cycle (Chloroplast Stroma):** $CO_2$ fixation catalyzed by RuBisCO to synthesize 3-carbon sugars and eventually glucose.

#### Board Exam Takeaways:
- **Oxygen Source:** Derived entirely from the photolysis of water ($H_2O$), not from carbon dioxide.
- **Limiting Factors (Blackman's Law):** Light intensity, $CO_2$ concentration, and temperature.`;
  }

  // 2. Ohm's Law & Electricity
  if (q.includes("ohm") || q.includes("current") || q.includes("voltage") || q.includes("resist") || q.includes("विद्युत") || q.includes("ओम")) {
    if (isHi) {
      return `### ओम का नियम (Ohm's Law) ⚡

**कथन:**
यदि किसी चालक की भौतिक अवस्थाएं (जैसे तापमान, दाब) स्थिर रहें, तो चालक के सिरों पर लगाया गया विभवांतर ($V$) उसमें प्रवाहित होने वाली विद्युत धारा ($I$) के अनुक्रमानुपाती होता है।

#### गणितीय सूत्र:
$$V \\propto I \\implies V = I \\cdot R$$

जहाँ:
- $V$ = विभवांतर (Voltage, वोल्ट / Volts)
- $I$ = विद्युत धारा (Current, एम्पीयर / Amperes)
- $R$ = चालक का प्रतिरोध (Resistance, ओम / $\\Omega$)

#### प्रतिरोध की निर्भरता:
$$R = \\rho \\frac{L}{A}$$
- $L$ = चालक की लम्बाई
- $A$ = अनुप्रस्थ काट का क्षेत्रफल
- $\\rho$ = विशिष्ट प्रतिरोध (Resistivity)`;
    }

    return `### Ohm's Law & Electric Circuits ⚡

**Statement:**
Ohm's Law states that the potential difference (voltage $V$) across the ends of a metallic conductor is directly proportional to the electric current ($I$) flowing through it, provided physical conditions such as temperature remain constant.

#### Mathematical Formulation:
$$V = I \\cdot R$$

Where:
- $V$ = Electric Potential Difference (Volts, $\\text{V}$)
- $I$ = Electric Current (Amperes, $\\text{A}$)
- $R$ = Electrical Resistance (Ohms, $\\Omega$)

#### Factors Affecting Resistance ($R$):
$$R = \\rho \\frac{L}{A}$$
1. **Length ($L$):** Resistance is directly proportional to conductor length ($R \\propto L$).
2. **Cross-Sectional Area ($A$):** Resistance is inversely proportional to area ($R \\propto 1/A$).
3. **Resistivity ($\\rho$):** Material-dependent intrinsic property measured in $\\Omega\\cdot\\text{m}$.`;
  }

  // 3. Newton's Laws & Mechanics
  if (q.includes("newton") || q.includes("motion") || q.includes("force") || q.includes("gravit") || q.includes("गति") || q.includes("बल")) {
    if (isHi) {
      return `### न्यूटन के गति के नियम (Newton's Laws of Motion) ⚛️

#### 1. प्रथम नियम (जड़त्व का नियम - Law of Inertia):
प्रत्येक वस्तु अपनी विरामावस्था अथवा सरल रेखा में एकसमान गति की अवस्था में तब तक बनी रहती है जब तक कि उस पर कोई बाह्य असंतुलित बल न लगाया जाए।

#### 2. द्वितीय नियम (संवेग परिवर्तन का नियम):
किसी वस्तु के संवेग परिवर्तन की दर उस पर लगाए गए बाह्य बल के समानुपाती होती है:
$$\\vec{F} = \\frac{d\\vec{p}}{dt} = m \\cdot \\vec{a}$$

#### 3. तृतीय नियम (क्रिया-प्रतिक्रिया का नियम):
प्रत्येक क्रिया की सदैव समान एवं विपरीत दिशा में प्रतिक्रिया होती है ($F_{AB} = -F_{BA}$)।`;
    }

    return `### Newton's Laws of Motion & Classical Mechanics ⚛️

#### 1. First Law (Law of Inertia):
A body continues in its state of rest or uniform motion in a straight line unless compelled to change that state by a net external unbalanced force.

#### 2. Second Law (Fundamental Law of Force):
The time rate of change of linear momentum of a body is directly proportional to the applied resultant force and occurs in the direction of the force:
$$\\vec{F} = \\frac{d\\vec{p}}{dt} = m\\vec{a}$$

#### 3. Third Law (Action-Reaction):
Whenever one body exerts a force on a second body, the second body exerts an equal and opposite force on the first body simultaneously ($F_{12} = -F_{21}$).`;
  }

  // 4. Cell Biology & Genetics
  if (q.includes("cell") || q.includes("dna") || q.includes("rna") || q.includes("gene") || q.includes("कोशिका") || q.includes("माइटोकॉन्ड्रिया")) {
    return `### Cell Structure & Molecular Biology 🔬

#### Core Components:
1. **Plasma Membrane:** Fluid mosaic phospholipid bilayer regulating selective permeability.
2. **Mitochondria (Powerhouse):** Generates cellular energy through oxidative phosphorylation ($ATP$).
3. **Nucleus:** Houses genomic chromatin ($DNA$), directing transcription and cellular replication.
4. **Ribosomes (70S/80S):** Sites of mRNA translation and polypeptide synthesis.

#### Mitosis vs Meiosis:
- **Mitosis:** Equational division producing 2 identical diploid ($2n$) somatic daughter cells.
- **Meiosis:** Reductional division producing 4 genetically diverse haploid ($n$) gametes via crossing over.`;
  }

  // 5. Calculus, Algebra & Mathematics
  if (q.includes("calculus") || q.includes("deriv") || q.includes("integ") || q.includes("trig") || q.includes("math") || q.includes("कलन") || q.includes("गणित")) {
    return `### Core Mathematical Theorems & Formula Sheet 📐

#### Differentiation Rules:
- **Power Rule:** $\\frac{d}{dx}[x^n] = n x^{n-1}$
- **Product Rule:** $\\frac{d}{dx}[u \\cdot v] = u \\frac{dv}{dx} + v \\frac{du}{dx}$
- **Quotient Rule:** $\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{v \\frac{du}{dx} - u \\frac{dv}{dx}}{v^2}$
- **Chain Rule:** $\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)$

#### Standard Trigonometric Identities:
- $\\sin^2 \\theta + \\cos^2 \\theta = 1$
- $1 + \\tan^2 \\theta = \\sec^2 \\theta$
- $\\sin(2\\theta) = 2\\sin\\theta\\cos\\theta$
- $\\cos(2\\theta) = \\cos^2\\theta - \\sin^2\\theta = 2\\cos^2\\theta - 1$`;
  }

  // 6. Generic Academic Dynamic Response
  if (isHi) {
    return `### शैक्षणिक अवधारणा विश्लेषण: "${query}"

**1. मूलभूत सिद्धांत (Fundamental Principle):**
इस विषय का अध्ययन पाठ्यक्रम मानकों के अनुसार मुख्य सिद्धांतों, परिभाषाओं और बुनियादी नियमों पर आधारित है।

**2. मुख्य बिंदु एवं सूत्र (Key Points & Formulas):**
- संबंधित भौतिक / रासायनिक / गणितीय नियमों का चरणबद्ध पालन करें।
- मुख्य अवधारणाओं को अलग-अलग घटकों में विभाजित करके समझें।

**3. परीक्षा सुझाव (Exam Tips):**
- महत्वपूर्ण परिभाषाओं और सूत्रों को याद रखें।
- संबंधित पाठ के पिछले वर्षों के प्रश्नों (PYQs) का अभ्यास करें।`;
  }

  return `### Academic Conceptual Breakdown: "${query}"

**1. Fundamental Definition:**
According to official curriculum standards, this topic focuses on foundational definitions, scientific principles, and governing equations.

**2. Step-by-Step Mechanisms & Properties:**
- Identify the key variables, constraints, and relationships governing this concept.
- Review standard proofs, diagrams, or derivations presented in your NCERT/State Board textbook.

**3. Exam Preparation Checklist:**
- Practice 3–5 representative questions from the textbook exercises.
- Ensure all standard formulas, SI units, and labelled diagrams are mastered.`;
}

// Preferred chat completion models in order of priority (handles standard & partner accounts)
const PREFERRED_CHAT_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "qwen/qwen3.8-27b",
  "openai/gpt-oss-20b",
  "mixtral-8x7b-32768",
  "gemma2-9b-it",
  "openai/gpt-oss-120b",
  "allam-2-7b",
];

// In-memory cache for available Groq models per API key
const modelCache = new Map<string, { models: string[]; timestamp: number }>();
const MODEL_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

async function resolveGroqModels(groq: Groq, apiKey: string): Promise<string[]> {
  const cached = modelCache.get(apiKey);
  if (cached && Date.now() - cached.timestamp < MODEL_CACHE_TTL) {
    return cached.models;
  }

  try {
    const list = await groq.models.list();
    const available = new Set(list.data.map((m) => m.id));
    const sorted = PREFERRED_CHAT_MODELS.filter((m) => available.has(m));

    if (sorted.length > 0) {
      modelCache.set(apiKey, { models: sorted, timestamp: Date.now() });
      return sorted;
    }

    // Filter out speech/guard models if none of the preferred matched
    const chatLike = list.data
      .map((m) => m.id)
      .filter((id) => !id.includes("whisper") && !id.includes("guard") && !id.includes("orpheus"));

    const finalModels = chatLike.length > 0 ? chatLike : PREFERRED_CHAT_MODELS;
    modelCache.set(apiKey, { models: finalModels, timestamp: Date.now() });
    return finalModels;
  } catch (err) {
    console.warn("[EdSync AI] Could not list models dynamically, falling back to priority list:", err);
    return PREFERRED_CHAT_MODELS;
  }
}

export const askEdSyncAI = createServerFn({
  method: "POST",
})
  .validator(
    (data: {
      message: string;
      context?: string | undefined;
      lang?: ("en" | "hi") | undefined;
      apiKey?: string | undefined;
    }) => {
      const message = data.message?.trim();
      const context = data.context?.trim();
      const lang = data.lang || "en";
      const apiKey = data.apiKey?.trim();

      if (!message) {
        throw new Error("Message cannot be empty");
      }

      if (message.length > 4000) {
        throw new Error("Message is too long");
      }

      if (context && context.length > 8000) {
        throw new Error("Context is too long");
      }

      return {
        message,
        context,
        lang,
        apiKey,
      };
    }
  )
  .handler(async ({ data }) => {
    const apiKey =
      data.apiKey ||
      process.env["AI_API_KEY"] ||
      process.env["VITE_AI_API_KEY"] ||
      process.env["GROQ_API_KEY"] ||
      process.env["VITE_GROQ_API_KEY"] ||
      "";

    const isHindi = data.lang === "hi" || /[\u0900-\u097F]/.test(data.message);

    const systemPrompt = `You are EdSync AI, an expert academic tutor built into the EdSync educational platform for Indian curriculum students (CBSE, ICSE, State Boards Classes 6-12, JEE, NEET).

STRICT IDENTITY RULES:
- Your name is strictly "EdSync Academic AI Tutor" or "EdSync AI".
- NEVER reveal or mention underlying AI model names (such as Llama, OpenAI, GPT, Groq, Anthropic, Claude, Gemini, Qwen, etc.).
- NEVER mention API providers, credentials, or internal server details.
- Always provide direct, comprehensive, educational answers without generic disclaimers.

LANGUAGE INSTRUCTIONS:
- ${isHindi ? "Respond in clear, friendly student Hindi (हिन्दी) or Hinglish with English terms in brackets." : "Respond in clear, accessible academic English."}

RESPONSE STRUCTURE:
- Provide clear headings, bold key concepts, and formatted mathematical/chemical formulas in LaTeX or code blocks.
- For derivations and numericals, show complete step-by-step reasoning.
- End with 1-2 important exam tips or key takeaways.`;

    const userMessage = data.context
      ? `Student Context: ${data.context}\n\nStudent Query: ${data.message}`
      : data.message;

    if (apiKey) {
      try {
        const groq = new Groq({ apiKey });
        const candidateModels = await resolveGroqModels(groq, apiKey);

        for (const model of candidateModels) {
          try {
            const completion = await groq.chat.completions.create({
              model,
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage },
              ],
              temperature: 0.5,
              max_tokens: 1500,
            });

            const answer = completion.choices[0]?.message?.content?.trim();
            if (answer && answer.length > 20) {
              return {
                success: true,
                answer,
                modelUsed: "edsync-ai",
                isOffline: false,
              };
            }
          } catch (modelError: any) {
            console.warn(`[EdSync AI] Model ${model} failed:`, modelError?.message || modelError);
            continue;
          }
        }
      } catch (groqErr) {
        console.warn("[EdSync AI] Groq client error:", groqErr);
      }
    }

    // Try secondary open-access educational API as fallback
    try {
      const fallbackRes = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "EdSync-Educational-Platform/2.0",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          model: "openai",
        }),
        signal: AbortSignal.timeout(6000),
      });

      if (fallbackRes.ok) {
        const text = await fallbackRes.text();
        if (text && text.trim().length > 30 && !text.includes("Error")) {
          return {
            success: true,
            answer: text.trim(),
            modelUsed: "edsync-ai",
            isOffline: false,
          };
        }
      }
    } catch {
      // Offline fallback
    }

    // Dynamic offline knowledge base response
    const offlineNotice = isHindi
      ? "> 📚 *[ऑफलाइन मोड] इंटरनेट या AI सेवा व्यस्त होने के कारण पाठ्यक्रम संदर्भ नोट्स प्रदर्शित किए जा रहे हैं:*\n\n"
      : "> 📚 *[Offline Reference Mode] AI connection unavailable. Displaying verified curriculum notes:*\n\n";

    return {
      success: true,
      answer: offlineNotice + generateLocalAIResponse(data.message, data.lang, data.context),
      modelUsed: "offline-curriculum",
      isOffline: true,
    };
  });