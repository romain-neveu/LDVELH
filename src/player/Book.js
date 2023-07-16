import React from 'react';
import { find_paragraph } from '../utils/book_utils'
import Paragraph from './Paragraph';
import { useParams } from 'react-router-dom';

const Book = ({story}) => {

	const { paragraphNumber } = useParams();
	
	let paragraph = new Paragraph(find_paragraph(story, paragraphNumber))

	console.log(paragraph);

	return (
		<div className="Book">
			<h1>{story.title}</h1>
			<section>
				<h2>{paragraph.title()}</h2>
				<div>{paragraph.text()}</div>
				<nav>{paragraph.links()}</nav>
			</section>
		</div>
	)

}

export default Book;
