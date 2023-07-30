import React from 'react';
import { Link } from 'react-router-dom';

const BookIntroduction = ({story}) => {

	return (
		<div className="Book introduction">
			<section>
				<h2>{story.title}</h2>
				<p>{story.introduction}</p>
					<Link to="/paragraph/1">Commencer à jouer</Link>
			</section>
		</div>
	)

}

export default BookIntroduction;
