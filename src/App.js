import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Book from './player/Book';
import BookEditor from './editor/BookEditor';
import story from './books/ronin_malgre_vous.json';
import './App.css';

function App() {
  return (
    <div className="App">  
    <Router>
      <header>
        <nav>
          <ul>
          <li><Link to="/play">Commencer</Link></li>
          <li><Link to="/edit">Editer</Link></li>
          </ul>
        </nav>
      </header>
      <Routes>
      <Route path="/play/:paragraphNumber?" element={<Book story={story} />} />
      <Route path="/edit" exact element={<BookEditor story={story}/>} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;