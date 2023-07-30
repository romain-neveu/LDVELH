import React from 'react';
import { find_paragraph } from '../utils/book_utils'
import { Link, useParams } from 'react-router-dom';

const Book = ({story}) => {

	const params = useParams()
	params.number = parseInt(params.number)
	const { number } = params
	
	let paragraph = find_paragraph(story, number)

	return (
		<div className="Book">
			<section>
				<h2>Paragraphe {paragraph.number}</h2>
				<p>{paragraph.text}</p>
				<nav>{paragraph.links.map((link) => 
					<Link to={"/paragraph/" + link.number}>{link.text}, rendez-vous au paragraphe {link.number}</Link>
				)}</nav>
			</section>
		</div>
	)

}

export default Book;
