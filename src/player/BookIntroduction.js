import React from 'react';
import { find_paragraph } from '../utils/book_utils'
import { Link, useParams } from 'react-router-dom';

const BookIntroduction = ({story}) => {

	const { number } = useParams();
	
	let paragraph = find_paragraph(story, number)

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
