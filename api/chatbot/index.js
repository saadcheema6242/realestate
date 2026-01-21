const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Helper functions
const readJSONFile = (fileName, defaultData = []) => {
    try {
        const filePath = path.join(process.cwd(), 'database', fileName);
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        }
        return defaultData;
    } catch (error) {
        console.error(`Error reading ${fileName}:`, error);
        return defaultData;
    }
};

const writeJSONFile = (fileName, data) => {
    try {
        const filePath = path.join(process.cwd(), 'database', fileName);
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing ${fileName}:`, error);
        return false;
    }
};

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message, context } = req.body;

        // Simple AI simulation based on keywords
        let response = '';
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            response = "Hello! I'm your real estate assistant. I can help you find properties. What are you looking for?";
        } else if (lowerMessage.includes('2 bed') || lowerMessage.includes('2 bedroom')) {
            response = "Great! I have several 2-bedroom properties available. What's your budget range? And which area do you prefer?";
        } else if (lowerMessage.includes('3 bed') || lowerMessage.includes('3 bedroom')) {
            response = "Perfect! I have beautiful 3-bedroom properties. What's your budget? When would you like to schedule a visit?";
        } else if (lowerMessage.includes('budget') || lowerMessage.includes('price')) {
            response = "Thanks for sharing your budget! I can show you properties in that range. Please share your phone number so I can send you property details and schedule a visit.";
        } else if (lowerMessage.includes('visit') || lowerMessage.includes('viewing')) {
            response = "I'd be happy to arrange a property visit for you! Please provide your name, phone number, and preferred date/time.";
        } else if (lowerMessage.includes('phone') || lowerMessage.match(/\d{10,}/)) {
            response = "Thank you! I've saved your contact information. Our team will call you within 24 hours to schedule your property visit. Is there anything specific you'd like to know about the properties?";

            // Save lead if phone number is provided
            const phoneMatch = message.match(/\d{10,}/);
            if (phoneMatch) {
                const leads = readJSONFile('leads.json', []);
                const newLead = {
                    id: uuidv4(),
                    source: 'chatbot',
                    phone: phoneMatch[0],
                    message: message,
                    context: context || {},
                    status: 'new',
                    createdAt: new Date().toISOString()
                };
                leads.push(newLead);
                writeJSONFile('leads.json', leads);
            }
        } else {
            response = "I understand you're interested in real estate. Can you tell me more about what you're looking for? For example: number of bedrooms, preferred location, or budget range?";
        }

        res.json({ response, timestamp: new Date().toISOString() });
    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({ error: 'Chatbot error' });
    }
}