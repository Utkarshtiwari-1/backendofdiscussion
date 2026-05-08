const { GoogleGenAI } = require("@google/genai");

require("dotenv").config();

exports.Newchatwithgemini = async (req, res) => {
  try {
    const { ques } = req.body;

    if (!ques) {
      return res.status(400).json({
        success: false,
        message: "Please Enter your Query",
      });
    }

       const finalPrompt = `
        You are a helpful AI assistant.

        IMPORTANT INSTRUCTIONS:
        - Always respond in VALID MARKDOWN format.
        - Use proper headings using # and ##.
        - Use bullet points using - .
        - Add blank lines between sections.
        - Keep responses clean and beautifully formatted.
        - Never return everything in one paragraph.

        User Question:
        ${ques}
        `;

    // Initialize Gemini
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_KEY,
    });

    // Generate response
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: finalPrompt,
    });

    // console.log(response);

    return res.status(200).json({
      success: true,
      message: "Query solution generated successfully",
      solution: response.text,
    });

  } catch (error) {
    console.log("Error while generating response using Gemini:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};