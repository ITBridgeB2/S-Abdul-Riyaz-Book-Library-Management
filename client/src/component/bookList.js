import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/bookList.css"
function BookListPageComponent() {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [editBook, setEditBook] = useState(null); // Holds the book being edited
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        genre: "",
        publication_year: ""
    });

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await axios.get("http://localhost:7000/books");
            setBooks(response.data);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    const handleNavigateToHome = () => navigate("/");

    const handleEditClick = (book) => {
        setEditBook(book);
        setFormData(book);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm("Are you sure you want to delete this book?")) {
            try {
                await axios.delete(`http://localhost:7000/books/${id}`);
                fetchBooks(); // Refresh book list
            } catch (error) {
                console.error("Delete error:", error);
            }
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:7000/books/${editBook.id}`, formData);
            setEditBook(null);
            fetchBooks();
        } catch (error) {
            console.error("Update error:", error);
        }
    };

     const handleSearch = () => {
        const title = searchTitle.trim();

        if (title.length > 0) {
            fetch(`http://localhost:7000/books/title/${encodeURIComponent(title)}`)
                .then(res => res.json())
                .then(data => setBooks(data))
                .catch(err => console.error("Error searching blogs:", err));
        } else {
            fetchBooks();
        }
    };

    const handleSearchChange = (e) => {
        setSearchTitle(e.target.value);
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const closePopup = () => {
        setEditBook(null);
    };

    return (
        <div>
            <header>
                <nav className="listNavbar">
                    <button onClick={handleNavigateToHome}>Back</button>
                </nav>
            </header>
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
            <main>
                <h2>All Books</h2>
                <table border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Genre</th>
                            <th>Publication Year</th>
                            <th >Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book) => (
                            <tr key={book.id}>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>{book.genre}</td>
                                <td>{book.publication_year}</td>
                                <td className="action-buttons">
                                    <button className="edit-btn " onClick={() => handleEditClick(book)}>Edit</button>
                                    <button className="delete-btn" onClick={() => handleDeleteClick(book.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Edit Popup */}
                {editBook && (
                    <div className="popup">
                        <div className="popup-content">
                            <h3>Edit Book</h3>
                            <form onSubmit={handleUpdate}>
                                <label>Title:</label>
                                <input type="text" name="title" value={formData.title} onChange={handleChange} required />

                                <label>Author:</label>
                                <input type="text" name="author" value={formData.author} onChange={handleChange} required />

                                <label>Genre:</label>
                                <input type="text" name="genre" value={formData.genre} onChange={handleChange} required />

                                <label>Publication Year:</label>
                                <input type="text" name="publication_year" value={formData.publication_year} onChange={handleChange} required />

                                <div className="popup-buttons">
                                    <button className="button" type="submit">Update</button>
                                    <button className="button" type="button" onClick={closePopup}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>

            {/* Simple CSS */}
            <style>{`
                .popup {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .popup-content {
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 10px;
                    width: 400px;
                    box-shadow: 0 0 15px rgba(0,0,0,0.3);
                }
                .popup-buttons {
                    margin-top: 10px;
                    display: flex;
                    gap: 10px;
                    justify-content: flex-end;
                }
                table {
                    margin-top: 20px;
                    width: 100%;
                }
            `}</style>
        </div>
    );
}

export default BookListPageComponent;
