import React, { FormEvent, useState } from "react";
import formStyles from "../../styles/bibtexform.module.scss";
import { BibtexParser } from "bibtex-js-parser";
import { FormProps } from "./FormProps.interface";
import { ArticleInterface } from "@/utils/article.interface";

export function formatData(data: any[]): ArticleInterface[] {
	const articles: ArticleInterface[] = [];
	data.forEach((obj) => {
		const article: ArticleInterface = {
			title: obj["title"],
			authors: obj["author"].split(" and "),
			source: obj["journal"],
			pubyear: Number.parseInt(obj["year"]),
			doi: obj["doi"],
		};

		articles.push(article);
	});

	return articles;
}

export default function BibtexForm({ setBody, submitArticle }: FormProps) {
	const [bibtex, setBib] = useState<string>("");
	const [errors, setErrors] = useState<any[]>([]); // Error handling state

	const validate = (): any[] => {
		const body = BibtexParser.parseToJSON(bibtex);
		let newErrors: { [key: string]: string }[] = [];

		body.forEach((entry) => {
			let newErr: { [key: string]: string } = {};
			if (!entry.title.trim()) {
				newErr.title = "Title is required.";
			}

			if (entry.author == null || entry.author?.length === 0) {
				newErr.author = "At least one author is required.";
			}

			if (!entry.journal?.trim()) {
				newErr.source = "Source is required.";
			}

			if (entry.year == null) {
				newErr.pubYear = "Please enter a valid publication date";
			} else {
				const pubYearNumber = Number.parseInt(entry.year, 10); // Convert pubYear to a number
				if (
					!entry.year ||
					isNaN(pubYearNumber) ||
					pubYearNumber < 1000 ||
					pubYearNumber > new Date().getFullYear()
				) {
					newErr.pubYear = "Please enter a valid publication year.";
				}
			}

			if (!entry.doi?.trim()) {
				newErr.doi = "DOI is required.";
			}

			if (Object.keys(newErr).length > 0) newErrors.push(newErr);
		});

		return newErrors;
	};

	const onSubmit = (e: FormEvent) => {
		e.preventDefault();
		const body = BibtexParser.parseToJSON(bibtex);
		const errs = validate();
		if (errs.length !== 0) {
			setErrors(errs);
			return;
		}

		const formatted = formatData(body);
		console.log(formatted);
		setBody(formatted);

		submitArticle();
	};

	const changeTextArea = (update: string) => {
		setBib(update);
	};

	return (
		<>
			<h2>BibTex</h2>
			<p>Please use "journal" field for the source</p>
			<div className={formStyles.main}>
				<form className="form" action="POST" onSubmit={(e) => onSubmit(e)}>
					<label htmlFor="bibtex">
						<p>BibTex:</p>
						<textarea
							name="bibtex"
							id="bibtex"
							className="bibtex-area"
							cols={75}
							rows={30}
							onChange={(e) => changeTextArea(e.currentTarget.value)}
						></textarea>
					</label>
					<input type="submit" className={formStyles.submit} value={"Submit"} />
				</form>
				<div>
					{errors.map((val, index) => (
						<ul key={index}>
							{Object.entries(val).map(([, text], index) => (
								<li key={index}>{text}</li>
							))}
						</ul>
					))}
				</div>
			</div>
		</>
	);
}
