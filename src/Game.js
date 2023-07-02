import React, { useState } from 'react';
import Book from './Book';
import story from './books/ronin_malgre_vous.json';
import BookEditor from './BookEditor';

const Game = () => {

	const [action, setAction] = useState(window.location.pathname === '/edit' ? 'edit' : 'play');

	return (
		<div className="Game">
			{action === 'play' && <>
				<Book story={story} />
				<button onClick={() => setAction('edit')}>Ecrire le livre</button>
			</>}
			{action === 'edit' && <>
				<BookEditor story={story} />
				<button onClick={() => setAction('play')}>Jouer le livre</button>
			</>}
		</div>
	)
}

export default Game;
