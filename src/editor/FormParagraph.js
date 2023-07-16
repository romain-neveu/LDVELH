import React, { useState } from 'react';

const FormParagraph = ({story, paragraph}) => {

	const [number, setNumber] = useState(paragraph.number);
	const [text, setText] = useState(paragraph.text.join("\n"));

	function handleSubmit(e) {
		// Prevent the browser from reloading the page
		e.preventDefault();
	
		// Read the form data
		const form = e.target;
		const formData = new FormData(form);
		
		// Or you can work with it as a plain object:
		const formJson = Object.fromEntries(formData.entries());
		console.log(formJson);
	}

	return (
		<form onSubmit={handleSubmit}>
			<h3>
				Paragraphe
				<input type="number" name="number" value={number} onChange={(e)=>setNumber(e.value)} />
			</h3>
			<div>
				<textarea name="text" onChange={(e)=>setText(e.value)}>{text}</textarea>
			</div>
			<nav>{paragraph.links.map((link) => 
				<Link link={link} />
				)}</nav>

			<input type="submit" value="OK" />
		</form>	
	)
}

const Link = ({link}) => {
	const [number, setNumber] = useState(link.number);
	const [text, setText] = useState(link.text);

	return (<>
		<input type="text" name="text" value={text} onChange={(e)=>setText(e.value)} />
		, rendez-vous au paragraphe <input type="number" name="number" value={number} onChange={(e)=>setNumber(e.value)} />
	</>)
}

export default FormParagraph;
