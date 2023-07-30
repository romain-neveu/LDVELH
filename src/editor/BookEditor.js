import React, { useState } from 'react';
import { find_path_to_death, find_ancestors } from '../utils/book_utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenNib, faXmark } from '@fortawesome/free-solid-svg-icons'
import ParagraphEdit from './ParagraphEdit';


const BookEditor = ({initialStory}) => {

	const [ story, setStory ] = useState(initialStory);



	return (
		<div className="BookEditor">
			
			<h1>Editeur de livre - Le livre dont vous êtes l'auteur</h1>

			<BookLength story={story} />

			<Paragraphs story={story} setStory={setStory} />

			<ParagraphEdit story={story} setStory={setStory} />
			
			<BookJson story={story} />

		</div>
	)
}

const BookLength = ({story}) => {
	const death_length = find_path_to_death(story, story.paragraphs[0]);
	return <i>Fin: entre {death_length.shortest} et {death_length.longest} choix</i>
}

const Paragraphs = ({story, setStory}) => <ul id="paragraphs">
	{story.paragraphs.map((paragraph) => 
		<li><Paragraph paragraph={paragraph} story={story} setStory={setStory} /></li>
	)}</ul>

const Paragraph = ({paragraph, story, setStory}) => {
	const [mode, setMode] = useState("display");
	
	return (
		<>
			<section id={"paragraph-" + paragraph.number}>
				{(mode === "edit") ? 
					<>
						<ParagraphEdit story={story} originalParagraph={paragraph} setStory={setStory} setMode={setMode} />
						<button onClick={()=>{setMode("display")}}>
							<FontAwesomeIcon icon={faXmark} />
							Cancel
						</button>
					</>
					: 
					<>
						<ParagraphDisplay story={story} paragraph={paragraph} />
						<button onClick={()=>{setMode("edit")}}>
							<FontAwesomeIcon icon={faPenNib} />
							Edit
						</button>
						
					</>
				}
			</section>
			<hr />
		</>
	)
}

const ParagraphDisplay = ({paragraph, story}) => <>
		<h3>Paragraphe {paragraph.number}</h3>
		<p>{paragraph.text.split("\n").map(line => <>{line}<br/></>)}</p>
		<nav><ul>{paragraph.links.map((link) => 
			<li><a href={"#paragraph-" + link.number}>{link.text}, rendez-vous au paragraphe {link.number}</a></li>
		)}</ul></nav>
		<nav><ul>Liens depuis paragraphes {find_ancestors(story, paragraph.number).map((parag, index) => 
			<li><a key={index} href={"#paragraph-" + parag.number}>#{parag.number}</a></li>
		)}</ul></nav>
	</>


const BookJson = ({story}) => {
	const copyToClipboard = (text) => navigator.clipboard.writeText(text);
	const book = JSON.stringify(story, null, 2);
	return (<>
		<pre>{book}</pre>
		<button onClick={e => copyToClipboard(book)}>Copier le livre</button>
	</>)
}

export default BookEditor;
