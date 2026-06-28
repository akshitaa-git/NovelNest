const { GoogleGenerativeAI } = require("@google/generative-ai");
const BookShelf = require('../models/BookShelf');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

exports.getBookSummary = async (req, res) => {
    try {
        const { title, author } = req.body;

        const prompt = `You are a sophisticated, cozy, and well-read librarian at "NovelNest". 
        Write a compelling, evocative summary for the book "${title}" by ${author}. 
        Keep it around 3-4 sentences. Focus on the vibe, the emotional core, and why someone should read it. 
        Don't use spoilers. Use an elegant, editorial tone.`;

        const result = await model.generateContent(prompt);
        const summary = result.response.text();

        res.json({ summary });
    } catch (err) {
        console.error('AI Summary Error:', err);
        res.status(500).json({ error: 'Failed to generate summary' });
    }
};

exports.getAIRecommendations = async (req, res) => {
    try {
        const { query } = req.body;
        const userId = req.user;

        // Fetch user's shelf to personalize
        const userShelf = await BookShelf.find({ userId, status: 'read' }).limit(5);
        const likedBooks = userShelf.map(b => `${b.title} by ${b.authors?.join(', ')}`).join(', ');

        const prompt = `You are the NovelNest AI Librarian. A user is looking for book recommendations with the query: "${query}".
        User's favorite books recently: [${likedBooks}].
        
        Suggest 5 books that fit the query and the user's taste. 
        Format your response AS A STRICT JSON ARRAY of objects. Each object MUST have:
        "title": string,
        "author": string,
        "reason": A short 1-sentence explanation why this fits their profile and query.
        
        Do not include any markdown formatting like \`\`\`json or \`\`\`. Just the raw JSON array.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();

        // Clean potential markdown if Gemini adds it anyway
        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '');
        const recommendationsData = JSON.parse(cleanedText);

        res.json(recommendationsData);
    } catch (err) {
        console.error('AI Recommendation Error:', err);
        res.status(500).json({ error: 'Failed to generate recommendations' });
    }
};

exports.chatWithLibrarian = async (req, res) => {
    try {
        const { message, chatHistory } = req.body;
        const userId = req.user;

        // Fetch user context
        const userShelf = await BookShelf.find({ userId }).limit(10);
        const context = userShelf.map(b => `${b.title} (${b.status})`).join(', ');

        const systemPrompt = `You are the "NovelNest Librarian", a sophisticated, warm, and highly knowledgeable bibliophile. 
        Your goal is to help users find their next great read. 
        You know the user has these books on their shelf: [${context}].
        Be conversational, slightly formal but very welcoming (like an old library). 
        If asked for recommendations, give 2-3 specific titles with brief enticing descriptions.`;

        // We can use startChat for stateful conversations if desired, 
        // but for a simple REST API, we'll just pass the history.

        const historyData = chatHistory?.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        })) || [];

        const chat = model.startChat({
            history: historyData,
            systemInstruction: systemPrompt
        });

        const result = await chat.sendMessage(message);
        const response = result.response.text();

        res.json({ response });
    } catch (err) {
        console.error('AI Chat Error:', err);
        res.status(500).json({ error: 'The Librarian is currently away from their desk.' });
    }
};
