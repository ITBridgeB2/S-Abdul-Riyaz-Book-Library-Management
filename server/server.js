const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
const multer = require('multer');
const upload = multer();
require("dotenv").config();


const app = express();
app.use(cors())
app.use(express.json());


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL database.");
});


//this is to get the all books 
app.get('/books',(req,res)=>{
    db.query('select * from books ORDER BY publication_year DESC',(err,result)=>{
        if(err) return res.status(500).send(err)
            res.json(result)
    })
} )


//this is to post a book
app.post('/books/add', upload.none(), (req, res) => {
    const { title, author, genre, publication_year } = req.body;
    // console.log("FormData received:", req.body);

    if (!title || !author || !genre || !publication_year) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    db.query(
        'INSERT INTO books (title, author, genre, publication_year) VALUES (?, ?, ?, ?)',
        [title, author, genre, publication_year],
        (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ error: "Database error occurred" });
            }
            res.status(200).json({ message: 'Book added successfully' });
        }
    );
});


//this is to get the book by the title
app.get('/books/category/:category', (req, res) => {
  const category = req.params.category; // Just access it directly

  db.query('SELECT * FROM books WHERE genre = ?', [category], (err, result) => {
    if (err) return res.status(500).send(err);
     console.error("DB Insert Error:", err);
    res.json(result);
  });
});

//this is to get the books bu title
app.get('/books/title/:title',(req,res)=>{
    const title = req.params.title;
    db.query('select * from books where title = ?',[title],(err,result)=>{
        if(err) return res.status(404).send(err);
        res.json(result)
    })
})

//updating the books
app.put('/books/:id', (req, res) => {
    const bookId = req.params.id;
    const { title, author, genre, publication_year } = req.body;

    const query = 'UPDATE books SET title = ?, author = ?, genre = ?, publication_year = ? WHERE id = ?';

    db.query(query, [title, author, genre, publication_year, bookId], (err, result) => {
        if (err) {
            console.error('Update error:', err);
            return res.status(500).json({ error: 'Failed to update book' });
        }
        res.status(200).json({ message: 'Book updated successfully' });
    });
});


//for deleting pages
app.delete('/books/:id', (req, res) => {
    const bookId = req.params.id;

    const query = 'DELETE FROM books WHERE id = ?';

    db.query(query, [bookId], (err, result) => {
        if (err) {
            console.error('Delete error:', err);
            return res.status(500).json({ error: 'Failed to delete book' });
        }
        res.status(200).json({ message: 'Book deleted successfully' });
    });
});


app.listen(7000, () => console.log("The server is running on port 7000"));
