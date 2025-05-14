// import logo from './logo.svg';
import './App.css';
import { Route,Routes } from 'react-router-dom';
import BookHomePageComponent from './component/bookHome';
import BookListPageComponenet from './component/bookList'

function App() {
  return (
    <div className="App">
     <Routes>
      <Route path="/"  element={<BookHomePageComponent></BookHomePageComponent>}></Route>
      <Route path="/bookList"  element={<BookListPageComponenet></BookListPageComponenet>}></Route>
     </Routes>
    </div>
  );
}

export default App;
