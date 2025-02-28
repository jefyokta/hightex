import { bibToObject, objectToBib } from "bibtex.js";

const bibtexEntry = `@article{sample,
  author = {John Doe},
  title = {Example Article},
  journal = {Sample Journal},
  year = {2024}
}`;;
const cite = bibToObject(bibtexEntry);
console.log(cite);  // JavaScript object from BibTeX entry

const bib = objectToBib(cite);
console.log(bib);  // Converts back to BibTeX format
