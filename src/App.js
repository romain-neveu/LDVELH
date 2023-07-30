import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Book from './player/Book';
import BookEditor from './editor/BookEditor';
import story from './books/ronin_malgre_vous.json';
import empty_story from './books/empty_story.json';
import './App.css';
import BookIntroduction from './player/BookIntroduction';

function App() {
  return (
    <div className="App">
    <Router>
      <header>
        <h1>{story.title} - Le livre dont vous êtes le héros</h1>
      </header>
      <Routes>
        <Route path="/" exact element={<BookIntroduction story={story} />} />
        <Route path="/paragraph/:number?" element={<Book story={story} />} />
        <Route path="/edit" exact element={<BookEditor initialStory={story}/>} />
        <Route path="/create" exact element={<BookEditor initialStory={empty_story}/>} />
      </Routes>
      <footer>
      <nav>
          <ul>
          <li><Link to="/paragraph/1">Commencer à jouer</Link></li>
          <li><Link to="/edit">Editer</Link></li>
          <li><Link to="/create">Créer un nouveau livre</Link></li>
          </ul>
        </nav>
      </footer>
    </Router>
    </div>
  );
}

export default App;