const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Database file paths
const DB_PATH = path.join(__dirname, '../database');
const PROPERTIES_FILE = path.join(DB_PATH, 'properties.json');
const LEADS_FILE = path.join(DB_PATH, 'leads.json');
const BOOKINGS_FILE = path.join(DB_PATH, 'bookings.json');
const USERS_FILE = path.join(DB_PATH, 'users.json');

// Ensure database directory exists
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH, { recursive: true });
}

// Helper functions for database operations
const readJSONFile = (filePath, defaultData = []) => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    return defaultData;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return defaultData;
  }
};

const writeJSONFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
};

// Initialize sample data
const initializeData = () => {
  // Sample properties
  const sampleProperties = [
    {
      id: '1',
      title: 'Luxury 3 Bedroom Apartment',
      price: 85000,
      location: 'E-11, Islamabad',
      bedrooms: 3,
      bathrooms: 2,
      area: 1200,
      images: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500',
        'https://images.unsplash.com/photo-1560449752-2dd9b55c0d3e?w=500',
        'https://images.unsplash.com/photo-1560448075-bb485b067938?w=500'
      ],
      description: 'Modern luxury apartment with stunning city views',
      featured: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Cozy 2 Bedroom House',
      price: 65000,
      location: 'F-10, Islamabad',
      bedrooms: 2,
      bathrooms: 1,
      area: 900,
      images: [
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500&crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwyfHxob3VzZXxlbnwwfHx8fDE2OTQwMDk2MjN8MA&ixlib=rb-4.0.3&q=80&w=1080'
      ],
      description: 'Perfect family home in quiet neighborhood',
      featured: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Modern Studio Apartment',
      price: 35000,
      location: 'G-9, Islamabad',
      bedrooms: 1,
      bathrooms: 1,
      area: 600,
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500'
      ],
      description: 'Compact and efficient studio for young professionals',
      featured: false,
      createdAt: new Date().toISOString()
    }
  ];

  // Sample admin user
  const sampleUsers = [
    {
      id: '1',
      email: 'admin@demo.com',
      password: bcrypt.hashSync('password123', 10),
      role: 'admin',
      name: 'Admin User'
    }
  ];

  // Initialize files if they don't exist
  if (!fs.existsSync(PROPERTIES_FILE)) {
    writeJSONFile(PROPERTIES_FILE, sampleProperties);
  }
  if (!fs.existsSync(LEADS_FILE)) {
    writeJSONFile(LEADS_FILE, []);
  }
  if (!fs.existsSync(BOOKINGS_FILE)) {
    writeJSONFile(BOOKINGS_FILE, []);
  }
  if (!fs.existsSync(USERS_FILE)) {
    writeJSONFile(USERS_FILE, sampleUsers);
  }
};
// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = readJSONFile(USERS_FILE, []);

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Image upload route
app.post('/api/upload-images', authenticateToken, upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    const imageUrls = req.files.map(file => {
      return `http://localhost:5000/uploads/${file.filename}`;
    });

    res.json({
      message: 'Images uploaded successfully',
      images: imageUrls
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

// Properties routes
app.get('/api/properties', (req, res) => {
  try {
    const properties = readJSONFile(PROPERTIES_FILE, []);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

app.get('/api/properties/:id', (req, res) => {
  try {
    const properties = readJSONFile(PROPERTIES_FILE, []);
    const property = properties.find(p => p.id === req.params.id);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

app.post('/api/properties', authenticateToken, (req, res) => {
  try {
    const properties = readJSONFile(PROPERTIES_FILE, []);
    const newProperty = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString()
    };

    properties.push(newProperty);
    writeJSONFile(PROPERTIES_FILE, properties);

    res.status(201).json(newProperty);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create property' });
  }
});

app.put('/api/properties/:id', authenticateToken, (req, res) => {
  try {
    const properties = readJSONFile(PROPERTIES_FILE, []);
    const index = properties.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Property not found' });
    }

    properties[index] = { ...properties[index], ...req.body };
    writeJSONFile(PROPERTIES_FILE, properties);

    res.json(properties[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update property' });
  }
});

app.delete('/api/properties/:id', authenticateToken, (req, res) => {
  try {
    const properties = readJSONFile(PROPERTIES_FILE, []);
    const filteredProperties = properties.filter(p => p.id !== req.params.id);

    if (properties.length === filteredProperties.length) {
      return res.status(404).json({ error: 'Property not found' });
    }

    writeJSONFile(PROPERTIES_FILE, filteredProperties);
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete property' });
  }
});
// Bookings routes
app.get('/api/bookings', authenticateToken, (req, res) => {
  try {
    const bookings = readJSONFile(BOOKINGS_FILE, []);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

app.post('/api/bookings', (req, res) => {
  try {
    const bookings = readJSONFile(BOOKINGS_FILE, []);
    const newBooking = {
      id: uuidv4(),
      ...req.body,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    bookings.push(newBooking);
    writeJSONFile(BOOKINGS_FILE, bookings);

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

app.put('/api/bookings/:id', authenticateToken, (req, res) => {
  try {
    const bookings = readJSONFile(BOOKINGS_FILE, []);
    const index = bookings.findIndex(b => b.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    bookings[index] = { ...bookings[index], ...req.body, updatedAt: new Date().toISOString() };
    writeJSONFile(BOOKINGS_FILE, bookings);

    res.json(bookings[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// Leads routes
app.get('/api/leads', authenticateToken, (req, res) => {
  try {
    const leads = readJSONFile(LEADS_FILE, []);
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

app.post('/api/leads', (req, res) => {
  try {
    const leads = readJSONFile(LEADS_FILE, []);
    const newLead = {
      id: uuidv4(),
      ...req.body,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    leads.push(newLead);
    writeJSONFile(LEADS_FILE, leads);

    res.status(201).json(newLead);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

app.put('/api/leads/:id', authenticateToken, (req, res) => {
  try {
    const leads = readJSONFile(LEADS_FILE, []);
    const index = leads.findIndex(l => l.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    leads[index] = { ...leads[index], ...req.body, updatedAt: new Date().toISOString() };
    writeJSONFile(LEADS_FILE, leads);

    res.json(leads[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update lead' });
  }
});
// Chatbot simulation
app.post('/api/chatbot', (req, res) => {
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
        const leads = readJSONFile(LEADS_FILE, []);
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
        writeJSONFile(LEADS_FILE, leads);
      }
    } else {
      response = "I understand you're interested in real estate. Can you tell me more about what you're looking for? For example: number of bedrooms, preferred location, or budget range?";
    }

    res.json({ response, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Chatbot error' });
  }
});

// Dashboard stats
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  try {
    const properties = readJSONFile(PROPERTIES_FILE, []);
    const leads = readJSONFile(LEADS_FILE, []);
    const bookings = readJSONFile(BOOKINGS_FILE, []);

    res.json({
      totalProperties: properties.length,
      totalLeads: leads.length,
      totalBookings: bookings.length,
      featuredProperties: properties.filter(p => p.featured).length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Initialize data and start server
initializeData();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});