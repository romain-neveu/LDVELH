import React, { useState } from 'react';
import { find_paragraph } from './book_utils'

const Book = ({story, paragraph_number}) => {

	return (
		<div className="Book">
			<h1>{story.title}</h1>
			<Paragraph story={story} paragraph_number={paragraph_number} />
  		</div>
	)

}


const Paragraph = ({story, paragraph_number}) => {

	const [paragraphNumber, setParagraphNumber] = useState(paragraph_number);

	let paragraph = find_paragraph(story, paragraphNumber);

	return (<section>
		<h2>Paragraphe {paragraph.number}</h2>
		<div>
			{paragraph.text.map((line, index) => 
				<p key={index}>{line}</p>
			)}
		</div>
		<nav>
			{paragraph.links.map((link, index) => 
				<a key={index} href onClick={() => setParagraphNumber(link.number)}>
					{link.text}, rendez-vous au paragraphe {link.number}
				</a>
			)}
		</nav>
	</section>)

}

export default Book;
