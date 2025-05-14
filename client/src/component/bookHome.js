import "../css/bookHome.css"
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
// const multer = require('multer');
// const upload = multer();
import axios from "axios";

function BookHomePageComponent() {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [books, setbooks] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [message, setMessage] = useState("");
    const [selectedBook, setSelectedBook] = useState(null);


    const [formData, setFormData] = useState({
        title: "",
        author: "",
        genre: "",
        publication_year: "",

    });

    const resetForm = () => {
        setFormData({
            title: "",
            author: "",
            genre: "",
            publication_year: "",

        });
    };

    useEffect(() => {
        fetchAllBooks();
    }, []);


    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('author', formData.author);
        formDataToSend.append('genre', formData.genre);
        formDataToSend.append('publication_year', formData.publication_year);
        // Log the formData to see if all fields are being set
        for (let [key, value] of formDataToSend.entries()) {
            console.log(key, value);
        }

        try {
            const response = await axios.post('http://localhost:7000/books/add', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(response.data.message);
            alert("Book uploaded Successfully")
            resetForm(); // Reset the form after submission
            setShowPopup(false); // Close the popup
        } catch (error) {
            // console.error('Add error:', error);
            setMessage(error.response?.data?.error || 'Something went wrong.');
        }
    };



    const fetchAllBooks = () => {
        fetch("http://localhost:7000/books")
            .then(res => res.json())
            .then(data => setbooks(data))
            .catch(err => console.error("Error fetching blogs:", err));
    };

    const handleSearchChange = (e) => {
        setSearchTitle(e.target.value);
    };

    const handleSearch = () => {
        const title = searchTitle.trim();

        if (title.length > 0) {
            fetch(`http://localhost:7000/books/title/${encodeURIComponent(title)}`)
                .then(res => res.json())
                .then(data => setbooks(data))
                .catch(err => console.error("Error searching books:", err));
        } else {
            fetchAllBooks();
        }
    };

    const handleCategoryClick = (category) => {
        fetch(`http://localhost:7000/books/category/${category}`)
            .then(res => res.json())
            .then(data => setbooks(data))
            .catch(err => console.error("Error fetching by category:", err));
    };

    const handleNavigateTobookList = () => navigate("/bookList");
    // const handleNavigateToLogin = () => navigate("/login");
    return (<div>
        <header>
            <nav className="navbar">
                <h3>Book Library</h3>
                <div className="buttonHome">
                    <button className="regbtn" onClick={togglePopup}>Add Book</button>
                    <button className="lgnbtn" onClick={handleNavigateTobookList}>View All Books</button>
                </div>
            </nav>
        </header>

        <main>
            <div className="catagories">
                <h3>Categories:</h3>
                {["Fiction", "Action", "Programing", "Sci-fic", "Fairy-Tail", "Fantasy", "History"].map((cat) => (
                    <button key={cat} onClick={() => handleCategoryClick(cat)}>{cat}</button>
                ))}
                <button onClick={fetchAllBooks}>Show All</button>
            </div>

            <div className="blogsContainer">
                <div className="serchBar">
                    <input
                        type="text"
                        name="title"
                        id="title"
                        placeholder="Search Book by title"
                        value={searchTitle}
                        onChange={handleSearchChange}
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>
                <h1>Trending Books</h1>
                <div className="blogs">
                    {books.length > 0 ? books.map((book, index) => (
                        <div className="blog" key={index} onClick={() => setSelectedBook(book)}>
                            <h3>{book.title}</h3>
                            <h5>Author: {book.author}</h5>
                        </div>

                    )) : (
                        <p>No blogs found.</p>
                    )}
                </div>
                {/* add books popup */}
                {showPopup && (
                    <div className="popup">
                        <div className="popup-content">
                            <h2>Add Book</h2>
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <label>Title:</label>
                                <input type="text" name="title" value={formData.title} onChange={handleChange} required />

                                <label>Author:</label>
                                <input type="text" name="author" value={formData.author} onChange={handleChange} required />

                                <label>Genre:</label>
                                <input name="genre" value={formData.genre} onChange={handleChange} required />

                                <label>Publication_year:</label>
                                <input type="text" name="publication_year" value={formData.publication_year} onChange={handleChange} required />


                                <div className="popup-buttons">
                                    <button type="submit" className="button">Submit</button>
                                    <button type="button" className="button cancel" onClick={togglePopup}>Close</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

{/* //book details popup */}
                {selectedBook && (
                    <div className="popup">
                        <div className="popup-content">
                            <h2>Book Details</h2>
                            <p><strong>Title:</strong> {selectedBook.title}</p>
                            <p><strong>Author:</strong> {selectedBook.author}</p>
                            <p><strong>Genre:</strong> {selectedBook.genre}</p>
                            <p><strong>Publication Year:</strong> {selectedBook.publication_year}</p>
                            <div className="popup-buttons">
                                <button className="button cancel" onClick={() => setSelectedBook(null)}>Close</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </main>

        <footer>
            <div className="footer">
                <p>All Rights Reserved || Bloggers.com</p>
            </div>
        </footer>
    </div>);

}

export default BookHomePageComponent;