import React, { useState } from 'react';
import { first_number_available, number_exists } from '../utils/book_utils';

const ParagraphEdit = ({story, setStory, originalParagraph, setMode}) => {

	const createState = (paragraph) => {
		let number = paragraph ? paragraph.number : first_number_available(story)
		let numberError = get_number_error(number, story, paragraph)
		let text = paragraph ? paragraph.text : ""
		let textError = get_text_error(text)
		let links = paragraph ? [...paragraph.links] : [{ text: "", number: 0 }]
		let linkErrors = links.map(get_link_error)
		return {
			number: number,
			numberError: numberError,
			text: text,
			textError: textError,
			links: links,
			linkErrors: linkErrors
		}
	}

	const [ { number, text, links, numberError, textError, linkErrors }, setState] = 
		useState(createState(originalParagraph))


	const setNumber = (number) => { 
		let error = get_number_error(number, story, originalParagraph);
		setState(prevState => ({...prevState, number:number, numberError: error }))
	}

	const setText = (text) => { 
		let error = get_text_error(text, story, originalParagraph);
		setState(prevState => ({...prevState, text: text, textError: error }))
	}
				
	const setLinkText = (index, text) => 
		setLink(index, { text: text, number: links[index].number})
				
	const setLinkNumber = (index, number) => 
		setLink(index, { text: links[index].text, number: number})

	const setLink= (index, link) => { 
		let error = get_link_error(link);
		links[index] = link
		linkErrors[index] = error
		setState(prevState => ({...prevState, links: links, linkErrors: linkErrors }))
	}

	const is_valid = () => !(numberError || textError || linkErrors.some(e=>e))

	const edit = () => {
		if (is_valid()) {
			let paragraphs = [...story.paragraphs]
			if (originalParagraph) {
				paragraphs = paragraphs.filter(paragraph => paragraph.number !== originalParagraph.number)
			}
			paragraphs.push({number: number, text: text, links: links.filter(is_active_link)})
			paragraphs.sort((paragA, paragB) => paragA.number-paragB.number)
			setStory(previousStory => ({...previousStory, paragraphs: paragraphs}))
			setMode && setMode("display")
			if (!originalParagraph) {
				setState(createState());
			}
		}
	}

	return (
		<form onSubmit={e=>{e.preventDefault(); edit()}}>
			<fieldset>
				<input placeholer="numéro" type="number" name="number" min="1" value={number} onChange={e=>setNumber(parseInt(e.target.value))} />
				{numberError && <span className="error">{numberError}</span>}
			</fieldset>
			<fieldset>
				<textarea placeholder="Texte" name="text" value={text} onChange={e=>setText(e.target.value)}></textarea>
				{textError && <span className="error">{textError}</span>}
			</fieldset>
			{links.map((link, index) => <fieldset>
				<input type="text" name={"links["+index+"][text]"} value={link.text} onChange={e => setLinkText(index, e.target.value)} />
				, rendez-vous au paragraphe
				<input type="number" name={"links["+index+"][number]"} value={link.number} onChange={e => setLinkNumber(index, parseInt(e.target.value)) } />
				{linkErrors[index] && <span className="error">{linkErrors[index]}</span>}
			</fieldset>)}
			<input type="submit" value="OK" disabled={!is_valid()} />
		</form>
	)
}

const is_active_link = (link) => (link.text || link.number)

const get_number_error = (number, story, originalParagraph) => {
	if (number < 1) {
		return "Le numéro de paragraphe doit être supérieur à 0"
	}
	if (!originalParagraph && number_exists(story, number)) {
		return "Le numéro de paragraphe existe déjà"
	}
	if (originalParagraph && originalParagraph.number !== number && number_exists(story, number)) {
		return "Le numéro de paragraphe existe déjà"
	}
	return ""
}

const get_text_error = (text) => {
	if (!text) {
		return "Le texte ne peut pas être vide"
	}
	return ""
}

const get_link_error = (link) => {
	if (is_active_link(link)) {
		if (!link.text) {
			return "Le texte ne peut pas être vide"
		}
		if (!link.number) {
			return "Le numéro de paragraphe ne peut pas être vide"
		}
	}
	return ""
}

export default ParagraphEdit;
