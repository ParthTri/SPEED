import React, { FormEvent, useState } from "react";
import formStyles from "../../styles/Form.module.scss";
import { FormProps } from "./FormProps.interface";

import { ArticleInterface } from "@/utils/article.interface";

export default function SubmissionForm({ setBody, submitArticle }: FormProps) {
	const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Error handling state

	const [title, setTitle] = useState("");
	const [authors, setAuthors] = useState<string[]>([]);
	const [source, setSource] = useState("");
	const [pubYear, setPubYear] = useState<number>(0);
	const [doi, setDoi] = useState("");
	const [summary, setSummary] = useState("");
	const [linkedDiscussion, setLinkedDiscussion] = useState("");

	const validateForm = () => {
		let newErrors: { [key: string]: string } = {};
		if (!title.trim()) {
			newErrors.title = "Title is required.";
		}

		if (
			authors.length === 0 ||
			authors.some((author) => author.trim() === "")
		) {
			newErrors.authors = "At least one author is required.";
		}

		if (!source.trim()) {
			newErrors.source = "Source is required.";
		}

		const pubYearNumber = parseInt(pubYear.toString(), 10); // Convert pubYear to a number
		if (
			!pubYear ||
			isNaN(pubYearNumber) ||
			pubYearNumber < 1000 ||
			pubYearNumber > new Date().getFullYear()
		) {
			newErrors.pubYear = "Please enter a valid publication year.";
		}

		if (!doi.trim()) {
			newErrors.doi = "DOI is required.";
		}

		return newErrors;
	};

	const addAuthor = () => {
		setAuthors(authors.concat([""]));
	};

	const removeAuthor = (index: number) => {
		setAuthors(authors.filter((_, i) => i !== index));
	};

	const changeAuthor = (index: number, value: string) => {
		setAuthors(authors.map((oldValue, i) => (index === i ? value : oldValue)));
	};

	const submitNewArticle = (e: FormEvent) => {
		e.preventDefault();
		const article: ArticleInterface = {
			title: title,
			authors: authors,
			source: source,
			pubyear: pubYear,
			doi: doi,
		};
		setBody([article]);

		// Validate the form before submitting
		const formErrors = validateForm();
		if (Object.keys(formErrors).length > 0) {
			setErrors(formErrors);
			return;
		}

		submitArticle(e);
	};

	return (
		<form className={formStyles.form} onSubmit={submitNewArticle}>
			<label htmlFor="title">Title:</label>
			<input
				className={formStyles.formItem}
				type="text"
				name="title"
				id="title"
				value={title}
				onChange={(event) => setTitle(event.target.value)}
			/>
			{errors.title && <p className={formStyles.error}>{errors.title}</p>}

			<label htmlFor="author">Authors:</label>
			{authors.map((author, index) => (
				<div key={`author ${index}`} className={formStyles.arrayItem}>
					<input
						type="text"
						name="author"
						value={author}
						onChange={(event) => changeAuthor(index, event.target.value)}
						className={formStyles.formItem}
					/>
					<button
						onClick={() => removeAuthor(index)}
						className={formStyles.buttonItem}
						style={{ marginLeft: "3rem" }}
						type="button"
					>
						Remove
					</button>
				</div>
			))}
			{errors.authors && <p className={formStyles.error}>{errors.authors}</p>}
			<button
				onClick={() => addAuthor()}
				className={formStyles.buttonItemSmall}
				style={{ marginLeft: "auto" }}
				type="button"
			>
				Add Author
			</button>

			<label htmlFor="source">Source:</label>
			<input
				className={formStyles.formItem}
				type="text"
				name="source"
				id="source"
				value={source}
				onChange={(event) => setSource(event.target.value)}
			/>
			{errors.source && <p className={formStyles.error}>{errors.source}</p>}

			<label htmlFor="pubYear">Publication Year:</label>
			<input
				className={formStyles.formItem}
				type="number"
				name="pubYear"
				id="pubYear"
				value={pubYear}
				onChange={(event) => setPubYear(parseInt(event.target.value))}
			/>
			{errors.pubYear && <p className={formStyles.error}>{errors.pubYear}</p>}

			<label htmlFor="doi">DOI:</label>
			<input
				className={formStyles.formItem}
				type="text"
				name="doi"
				id="doi"
				value={doi}
				onChange={(event) => setDoi(event.target.value)}
			/>
			{errors.doi && <p className={formStyles.error}>{errors.doi}</p>}

			<label htmlFor="summary">Summary:</label>
			<textarea
				className={formStyles.formTextArea}
				name="summary"
				value={summary}
				onChange={(event) => setSummary(event.target.value)}
			/>

			<button className={formStyles.formItem} type="submit">
				Submit
			</button>
		</form>
	);
}
