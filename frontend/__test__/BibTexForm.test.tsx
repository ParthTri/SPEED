import { expect, test } from "vitest";
import { formatData } from "../src/components/forms/BibTexForm";
import { BibtexParser } from "bibtex-js-parser";
import { ArticleInterface } from "@/utils/article.interface";

const input: string = `@article{einstein1905,
author = {Einstein, Albert and Planck, Max and Lorentz, Hendrik A.},
title = {Zur Elektrodynamik bewegter Körper},
journal = {Annalen der Physik},
year = {1905},
doi = {10.1002/andp.19053221004}
}`;

const expected: ArticleInterface[] = [
	{
		title: "Zur Elektrodynamik bewegter Körper",
		source: "Annalen der Physik",
		pubyear: 1905,
		doi: "10.1002/andp.19053221004",
		authors: ["Einstein, Albert", "Planck, Max", "Lorentz, Hendrik A."],
	},
];

const doc: any[] = BibtexParser.parseToJSON(input);

const result: ArticleInterface[] = formatData(doc);

test("An object is parsed", () => {
	expect(result.length).eq(1);
});

test("Title Parsed Correctly", () => {
	expect(result[0].title).eq(expected[0].title);
});

test("Authors Parsed Correctly", () => {
	result[0].authors.forEach((val, index) => {
		expect(val).eq(result[0].authors[index]);
	});
});

test("Publication Year is parsed correctly", () => {
	expect(result[0].pubyear).eq(expected[0].pubyear);
});

test("DOI is paresd correctly", () => {
	expect(result[0].doi).eq(expected[0].doi);
});

test("Source is parsed", () => {
	expect(result[0].source).eq(expected[0].source);
});
