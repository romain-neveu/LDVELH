import React, { useState } from 'react';
import { find_path_to_death, find_ancestors, existing_numbers, number_exists, first_number_available } from '../utils/book_utils'
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenNib, faXmark } from '@fortawesome/free-solid-svg-icons'


const BookEditor = ({initialStory}) => {

	const [ story, setStory ] = useState(initialStory);



	return (
		<div className="BookEditor">
			
			<h1>Editeur de livre - Le livre dont vous êtes l'auteur</h1>

			<BookLength story={story} />

			<Paragraphs story={story} />

			<ParagraphCreate story={story} setStory={setStory} />
			
			<BookJson story={story} />

		</div>
	)
}

const BookLength = ({story}) => {
	const death_length = find_path_to_death(story, story.paragraphs[0]);
	return <i>Fin: entre {death_length.shortest} et {death_length.longest} choix</i>
}

const Paragraphs = ({story}) => <ul id="paragraphs">
	{story.paragraphs.map((paragraph) => 
		<li><Paragraph paragraph={paragraph} story={story} /></li>
	)}</ul>

const Paragraph = ({paragraph, story}) => {
	const [mode, setMode] = useState("display");
	
	return (
		<>
			<section id={"paragraph-" + paragraph.number}>
				{(mode === "edit") ? 
					<>
						<ParagraphEdit story={story} paragraph={paragraph} setMode={setMode} />
						<a onClick={()=>{setMode("display")}}>
							<FontAwesomeIcon icon={faXmark} />
							Cancel
						</a>
					</>
					: 
					<>
						<ParagraphDisplay story={story} paragraph={paragraph} />
						<a onClick={()=>{setMode("edit")}}>
							<FontAwesomeIcon icon={faPenNib} />
							Edit
						</a>
						
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


const ParagraphEdit = ({paragraph, story, setMode}) => {

	const [number, setNumber] = useState(paragraph.number);
	const [text, setText] = useState(paragraph.text);

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
			<input type="submit" value="OK" />
			<button onClick={e => setMode("display")}>Cancel</button>
		</form>	
	)
}

const LinkEdit = ({link}) => {
	const [number, setNumber] = useState(link.number);
	const [text, setText] = useState(link.text);

	return (<>
		<input type="text" name="text" value={text} onChange={(e)=>setText(e.value)} />
		, rendez-vous au paragraphe <input type="number" name="number" value={number} onChange={(e)=>setNumber(e.value)} />
	</>)
}


const ParagraphCreate = ({story, setStory}) => {

	const [number, setNumber] = useState(first_number_available(story));
	const [numberError, setNumberError] = useState("");
	const [text, setText] = useState("");
	const [textError, setTextError] = useState("");
	const [links, setLinks] = useState([{ text: "", number: 0 }]);
	const [linkErrors, setLinkErrors] = useState([""]);

	const addParagraph = (paragraph) => {
		setStory(previousStory => { return {...previousStory, paragraphs: [...previousStory.paragraphs, paragraph].sort((paragA, paragB) => paragA.number-paragB.number)}});
	}

	const validateNumber = (number) => {
		if (number < 1) {
			setNumberError("Le numéro de paragraphe doit être supérieur à 0")
			return false;
		}
		if (number_exists(story, number)) {
			setNumberError("Le numéro de paragraphe existe déjà")
			return false;
		}
		setNumberError("")
		return true;
	}

	const validateText = (text) => {
		if (!text) {
			setTextError("Le texte ne peut pas être vide")
			return false;
		}
		setTextError("")
		return true;
	}

	const validateLinks = (links) => {
		return links.map((link, index) => validateLink(index, link.number, link.text)).every((result)=>result);
	}

	const validateLinkText = (index, text) => {
		return validateLink(index, text, links[index].number);
	}

	const validateLinkNumber = (index, number) => {
		return validateLink(index, links[index].text, number);
	}

	const validateLink = (index, number, text) => {
		if (text && !number) {
			setLinkErrors(errors => errors.map((error, i) => i === index ? "Le numéro de paragraphe ne peut pas être vide" : error))
			return false;
		}
		if (number && !text) {
			setLinkErrors(errors => errors.map((error, i) => i === index ? "Le texte ne peut pas être vide" : error))
			return false;
		}
		setLinkErrors(errors => errors.map((error, i) => i === index ? "" : error))
		return true;
	}

	const createParagraph = (e) => {
		e.preventDefault()
		if (!validateNumber(number) || !validateText(text) || !validateLinks(links)) {
			return
		}
		const paragraph = {
			number: number,
			text: text, 
			links: links.filter(link => link.text && link.number)
		};
		addParagraph(paragraph);
	}

	const addLinkInput = () => {
		setLinks([...links, { text: "", number: 0 }]);
	}

	const setLinkText = (index, text) => {
		setLinks(links => links
			.map((link, i)=> i===index ? {...link, text: text}:link)
			.concat(links.some(link => !link.number && !link.text) ? [] : [{text: "", number: 0}]))
	}

	const setLinkNumber = (index, number) => {
		setLinks(links => links.map((link, i)=> i===index ? {...link, number: number}:link))
	}

	const deleteLink = (index) => {
		setLinks(links => links.toSpliced(index, 1))
	}
	
	return (
		<form onSubmit={createParagraph}>
			<fieldset>
				<input placeholer="numéro" type="number" name="number" min="1" value={number} onChange={(e)=>{setNumber(parseInt(e.target.value)); validateNumber(parseInt(e.target.value));}} />
				{numberError && <span className="error">{numberError}</span>}
			</fieldset>
			<fieldset>
				<textarea placeholder="Texte" name="text" onChange={(e)=>{setText(e.target.value); validateText(e.target.value)}}>{text}</textarea>
				{textError && <span className="error">{textError}</span>}
			</fieldset>
			{links.map((link, index) => <fieldset
				draggable="true" 
				onDragStart={e=>{e.dataTransfer.setData("originalIndex", index)}} 
				onDrop={(e)=>{let originalIndex = parseInt(e.dataTransfer.getData("originalIndex")); let originalLink=links[originalIndex]; setLinks(links=>
					originalIndex <= index 
						? links.map((lk, i) => i==index 
							? {...originalLink}
							: (i >= originalIndex && i < index ? {...links[i+1] } : lk)
							)
						: links.reverse().map((lk, i) => i==index 
							? {...originalLink}
							: (i > index && i <= originalIndex ? {...links[i-1] } : lk)
						)
					)}} 
				onDragOver={e=>{e.preventDefault()}}
					>
				<input type="text" name={"links["+index+"][text]"} value={link.text} onChange={(e) => { validateLinkText(index, e.target.value); setLinkText(index, e.target.value)}} />
				, rendez-vous au paragraphe
				<input type="number" name={"links["+index+"][number]"} value={link.number} onChange={(e) => { validateLinkNumber(index, parseInt(e.target.value)); setLinkNumber(index, parseInt(e.target.value)) }} />
				<button onClick={e=>deleteLink(index)}>Enlever le lien</button>
				{linkErrors[index] && <span className="error">{linkErrors[index]}</span>}
			</fieldset>)}
			<button onClick={addLinkInput}>Ajouter un lien vers un paragraphe</button>
			<input type="submit" value="OK" disabled={numberError || textError}/>
		</form>	
	)
}

const BookJson = ({story}) => {
	const copyToClipboard = (text) => navigator.clipboard.writeText(text);
	const book = JSON.stringify(story, null, 2);
	return (<>
		<pre>{book}</pre>
		<button onClick={e => copyToClipboard(book)}>Copier le livre</button>
	</>)
}











const CreateForm = ({story}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	
	const validate_number = (value) =>  {
		if (story.paragraphs.find(parag => parag.number === value)) {
			return false;			
		}
		return true; 
	}

	return (
		<form id="create_form" onSubmit={handleSubmit(createParagraph)}>
			<fieldset>
				<legend>Ajouter un paragraphe</legend>
				<label htmlFor="create_form_id">Numéro</label><br/>
				<input id="create_form_id" type="number" min="1" {...register('number', { min: 1, validate: value => validate_number(value) })} />
				{errors.number && <span>Choisir un numéro disponible</span>}
				<br/>
				<label htmlFor="create_form_text">Texte</label><br/>
				<textarea id="create_form_text" {...register('text', { required: true })}></textarea>
				{errors.text && <span>Définir un texte</span>}
				<br/>
				<fieldset>
			<label>Ajouter un lien</label>
			<input type="text" {...register('link[].text[]', { })}/>
			<select  {...register('link.number[]', { })}>{existing_numbers(story).map((number) => <option value={number}>{number}</option>)}</select>
		</fieldset>
		<fieldset>
			<label>Ajouter un lien</label>
			<input type="text" {...register('link[].text', { })}/>
			<select  {...register('link.number', { })}>{existing_numbers(story).map((number) => <option value={number}>{number}</option>)}</select>
		</fieldset>
				{/* <label htmlFor="create_form_links">Liens</label><br/>
				<textarea id="create_form_links" {...register('links')}></textarea>
				{errors.links && <span>Définir des liesn vers d'autres paragraphes</span>}
				<br/> */}
				<button type="submit">Ajouter</button>
			</fieldset>
		</form>
	)
}

const CreateInputLInks = ({story}) => {
	return (
		<fieldset>
			<label>Ajouter un lien</label>
			<input type="text" name="link[].text" />
			<select name="link[].number">{existing_numbers(story).map((number) => <option value={number}>{number}</option>)}</select>
		</fieldset>
	)
}

const createParagraph = (data) => {
	console.log(data);

}



export default BookEditor;
