
const find_paragraph = (story, paragraphNumber) => {
	let paragraph = story.paragraphs[0];
	if (paragraphNumber) {
		paragraph = story.paragraphs.find(parag => parag.number == paragraphNumber);
	}
	return paragraph;
}

const find_path_to_death = (story, paragraph) => {
	let path_to_death = {shortest: 0, longest: 0};
	if(paragraph && !is_death(paragraph)) {
		let links_paths_to_death = [];
		paragraph.links.forEach(link => {
			links_paths_to_death.push(find_path_to_death(story, find_paragraph(story, link.number)));				
		});
		path_to_death.shortest = 1 + Math.min(...links_paths_to_death.map((path) => path.shortest));
		path_to_death.longest = 1 + Math.max(...links_paths_to_death.map((path) => path.longest));
	}
	return path_to_death;
}

const is_death = (paragraph) => {
	return has_no_link(paragraph) || has_link_to_start(paragraph);
}

const has_no_link = (paragraph) => !paragraph.links.length;

const has_link_to_start = (paragraph) => {
	let has_link_to_start = false;
	paragraph.links.forEach(link => {
		if(link.number === 1) {
			has_link_to_start = true;
		}
	});
	return has_link_to_start;
}

const find_ancestors = (story, paragraphNumber) => 
	 story.paragraphs.filter((paragraph) => paragraph.links.map((link) => link.number).includes(paragraphNumber));


const existing_numbers = (story) =>  story.paragraphs.map((paragraph) => paragraph.number).sort()

const number_exists = (story, number) =>  existing_numbers(story).includes(number);

const first_number_available = (story) =>  {
	let number = 1;
	while (existing_numbers(story).includes(number)) {
		number++;
	}
	return number;
}


export { find_paragraph, find_path_to_death, find_ancestors, existing_numbers, number_exists, first_number_available };
