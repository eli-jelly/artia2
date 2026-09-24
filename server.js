require("dotenv").config();
console.log("server file started");

// Importing the backend tools
const path = require("path");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 5,
    fileSize: 10 * 1024 * 1024
  }
});
app.use(cors());

// Conects Gemini- the ai that will be used
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/analyze-room", upload.array("images", 5), async (req, res) => {
  try {
    console.log("request reached server");
    console.log("prompt:", req.body.prompt);
    console.log("files:", req.files ? req.files.length : 0);

    const userPrompt = req.body.prompt || "";

    // These are the instructions that I sent to AI
    const fullPrompt =  `
You are an interior design expert.

The user uploaded inspiration images.

User goal / description:
${userPrompt}

IMPORTANT:
If the user gives an extra request or question in their written prompt:
- Answer it first in a separate short section before the main style guide.
- Make sure the request is fully answered.
- Do not hide the answer inside another category.

Create a personalised interior design style guide based on all uploaded images.

IMPORTANT:
- Write as a GUIDE, not a report
- Use short paragraphs (no long blocks of text)
- Avoid bullet points unless really necessary
- Be specific: say WHAT to use, WHERE to apply it, and WHY it works
- Keep it clear, helpful, and not overwhelming
- If multiple images are uploaded, analyse them together and find common patterns
- If styles are mixed, clearly explain the main style and secondary influence

Structure your response EXACTLY like this:

1. Style Direction
(Short paragraph explaining the style and overall mood)

2. Colours to Focus On
(Guide paragraph: what colours to use, where to apply them, and why)

3. Materials & Textures
(Guide paragraph: what materials to use and how they support the style)

4. Furniture & Decor Guide
(Guide paragraph: what to look for when choosing pieces)

5. Lighting & Atmosphere
(Guide paragraph: how lighting should feel and be used)

6. Cohesion Rules
(Guide paragraph: how to keep the design consistent and connected)

7. What to Avoid
(Guide paragraph: common mistakes to avoid)

8. Where to Start
(Short practical paragraph with 2-3 simple first steps)

Write in a friendly, slightly inspirational tone.
Make the user feel confident and guided.

Do not use Markdown formatting. Do not use asterisks, hashtags, or bullet symbols. Use plain text only.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const imageParts = [];

    // Converting images into a readable format for Gemini
    for (const file of req.files || []) {
      const base64Image = file.buffer.toString("base64");

      imageParts.push({
        inlineData: {
          data: base64Image,
          mimeType: file.mimetype,
        },
      });
    }

    console.log("calling gemini");

    // Sending the user's prompt and image to Gemini
    const result = await model.generateContent([
      fullPrompt,
      ...imageParts
    ]);

    console.log("gemini returned");

    // Getting Gemini's responds
    const response = await result.response;
    const text = response.text();

    res.json({ result: text });
  } 
  catch (error) {
    console.error("server error:", error);
    res.status(500).json({ error: error.message });
  }
});

console.log("about to start server");

// Starting the backend server
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
