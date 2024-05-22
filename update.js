const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; // You can change this to any port you prefer

// MySQL database connection parameters
const db = mysql.createConnection({
    host: 'localhost', // Change this to your MySQL server hostname
    user: 'root', // Change this to your MySQL username
    password: 'password', // Change this to your MySQL password
    database: 'ccs' // Change this to your MySQL database name
});

// Connect to MySQL database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL database');
});

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: false }));

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());

// Handle form submission
app.post('/update_availability', (req, res) => {
    const profName = req.body.profName;
    const availability = req.body.availability;

    // SQL to update availability
    const sql = `UPDATE professor SET availability='${availability}' WHERE profname='${profName}'`;

    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).send('Error updating record');
            throw err;
        }
        console.log(`Updated availability for ${profName} to ${availability}`);
        res.send('Record updated successfully');
    });
});

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
