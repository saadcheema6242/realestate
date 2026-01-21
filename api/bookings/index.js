const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

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

const authenticateToken = (req) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return null;
    }

    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'GET') {
            const user = authenticateToken(req);
            if (!user) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            const bookings = readJSONFile('bookings.json', []);
            return res.json(bookings);
        }

        if (req.method === 'POST') {
            const bookings = readJSONFile('bookings.json', []);
            const newBooking = {
                id: uuidv4(),
                ...req.body,
                status: 'pending',
                createdAt: new Date().toISOString()
            };

            bookings.push(newBooking);
            writeJSONFile('bookings.json', bookings);

            return res.status(201).json(newBooking);
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Bookings API error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}