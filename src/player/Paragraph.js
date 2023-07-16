import React from 'react';
import { Link } from 'react-router-dom';

const Paragraph = (paragraph) => {
    return {
        title: () => <>Paragraphe {paragraph.number}</>,
     
        text: () => paragraph.text.map((line) => <p>{line}</p>),
     
        links: () => paragraph.links.map((link) => 
            <Link to={"/play/" + link.number}>{link.text}, rendez-vous au paragraphe {link.number}</Link> 
        )
    }
}


export default Paragraph;