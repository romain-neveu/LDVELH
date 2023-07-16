import React, { useState } from 'react';
import { find_path_to_death, find_ancestors, existing_numbers } from '../utils/book_utils'
import { useForm } from 'react-hook-form';
import FormParagraph from './FormParagraph';

const BookEditor = ({story}) => {

	return (
		<div className="BookEditor">
			
			<h1>Editeur de livre - Le livre dont vous êtes l'auteur</h1>

			<BookLength story={story} />

			<Paragraphs story={story} />

			<CreateForm story={story} />
			
			<BookJson story={story} />

		</div>
	)
}

const Paragraphs = ({story}) => <ul id="paragraphs">{story.paragraphs.map((paragraph) => 
	<Paragraph paragraph={paragraph} story={story} />
)}</ul>

const Paragraph = ({paragraph, story}) => {
	const [mode, setMode] = useState("display");

	const actions = () => (mode === "edit") ?
		<button onClick={()=>{setMode("display")}}>Cancel</button>
		: 
		<button onClick={()=>{setMode("edit")}}>Edit</button>
	
	return (
		<section id={"paragraph-" + paragraph.number}>
			{actions()}
			{(mode === "edit") ? 
			<FormParagraph story={story} paragraph={paragraph} /> 
			: 
			<ParagraphDisplay story={story} paragraph={paragraph} />}
		</section>
	)
}

const ParagraphDisplay = ({paragraph, story}) => <>
		<h3>Paragraphe {paragraph.number}</h3>
		<div>{paragraph.text.map((line, index) => 
			<p key={index}>{line}</p>
		)}</div>
		<nav>{paragraph.links.map((link) => 
			<a href={"#paragraph-" + link.number}>{link.text}, rendez-vous au paragraphe {link.number}</a>
		)}</nav>
		<nav>Liens depuis paragraphes {find_ancestors(story, paragraph.number).map((parag, index) => 
			<a key={index} href={"#paragraph-" + parag.number}>#{parag.number}</a> 
		)}</nav>
	</>


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

const BookLength = ({story}) => {
	const death_length = find_path_to_death(story, story.paragraphs[0]);
	return <i>Fin: entre {death_length.shortest} et {death_length.longest} choix</i>
}

const BookJson = ({story}) => <pre>{JSON.stringify(story, null, 2)}</pre>

export default BookEditor;
