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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'GET') {
            const properties = readJSONFile('properties.json', []);
            return res.json(properties);
        }

        if (req.method === 'POST') {
            const user = authenticateToken(req);
            if (!user) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            const properties = readJSONFile('properties.json', []);
            const newProperty = {
                id: uuidv4(),
                ...req.body,
                createdAt: new Date().toISOString()
            };

            properties.push(newProperty);
            writeJSONFile('properties.json', properties);

            return res.status(201).json(newProperty);
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Properties API error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}