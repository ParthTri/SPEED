import { FormEvent, useState } from "react";
import formStyles from "../../styles/Form.module.scss";

const NewDiscussion = () => {
	const [title, setTitle] = useState("");
	const [authors, setAuthors] = useState<string[]>([]);
	const [source, setSource] = useState("");
	const [pubYear, setPubYear] = useState<number>(0);
	const [doi, setDoi] = useState("");
	const [summary, setSummary] = useState("");
	const [linkedDiscussion, setLinkedDiscussion] = useState("");
	const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Error handling state

	const validateForm = () => {
		let newErrors: { [key: string]: string } = {};

		if (!title.trim()) {
			newErrors.title = "Title is required.";
		}

		if (authors.length === 0 || authors.some((author) => author.trim() === "")) {
			newErrors.authors = "At least one author is required.";
		}

		if (!source.trim()) {
			newErrors.source = "Source is required.";
		}

		const pubYearNumber = parseInt(pubYear.toString(), 10); // Convert pubYear to a number
		if (!pubYear || isNaN(pubYearNumber) || pubYearNumber < 1000 || pubYearNumber > new Date().getFullYear()) {
			newErrors.pubYear = "Please enter a valid publication year.";
		}

		if (!doi.trim()) {
			newErrors.doi = "DOI is required.";
		}

		return newErrors;
	};

	const submitNewArticle = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		// Validate the form before submitting
		const formErrors = validateForm();
		if (Object.keys(formErrors).length > 0) {
			setErrors(formErrors);
			return;
		}

		const body: string = JSON.stringify({
			title,
			authors,
			source,
			pubyear: pubYear,
			doi,
			summary,
			linked_discussion: linkedDiscussion,
			state: "pending"
		});

		try {
			const res = await fetch("http://localhost:3000/api/articles", {
				method: "POST",
				body: body,
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			});
		} catch (e) {
			console.log(e);
		}
	};

	const addAuthor = () => {
		setAuthors(authors.concat([""]));
	};

	const removeAuthor = (index: number) => {
		setAuthors(authors.filter((_, i) => i !== index));
	};

	const changeAuthor = (index: number, value: string) => {
		setAuthors(
			authors.map((oldValue, i) => (index === i ? value : oldValue))
		);
	};

	return (
		<div className="container">
			<h1>New Article</h1>
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
		</div>
	);
};

export default NewDiscussion;
