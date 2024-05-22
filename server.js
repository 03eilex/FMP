const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// MySQL connection configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'ccs'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'proflog.html'));
});

// Serve home.html
app.get('/home.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Handle form submission
app.post('/submit', (req, res) => {
    const { profname, email, availability } = req.body;
    const query = 'INSERT INTO professor (profname, email, availability) VALUES (?, ?, ?)';
    db.query(query, [profname, email, availability], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).json({ message: 'Error inserting data' });
        } else {
            res.json({ message: 'New record created successfully' });
        }
    });
});

// Handle fetching all professor records
app.get('/api/professors', (req, res) => {
    const query = 'SELECT * FROM professor';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ message: 'Error fetching data' });
        } else {
            res.json(results);
        }
    });
});

// Handle updating a professor's availability
app.post('/update_availability', (req, res) => {
    const { email, availability } = req.body;
    const query = 'UPDATE professor SET availability = ? WHERE email = ?';
    db.query(query, [availability, email], (err, result) => {
        if (err) {
            console.error('Error updating data:', err);
            res.status(500).json({ message: 'Error updating data' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: 'No professor found with that email' });
        } else {
            res.json({ message: 'Record updated successfully' });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
