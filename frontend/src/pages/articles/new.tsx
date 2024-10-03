import { FormEvent, useState } from "react";
import BibtexForm from "@/components/forms/BibTexForm";
import Switch from "react-switch";
import SubmissionForm from "@/components/forms/SubmissionForm";
import { ArticleInterface } from "@/utils/article.interface";
import { useRouter } from "next/router";

enum FormType {
	STANDARD,
	BIBTEX,
}

export interface Errors {
	title: string;
	authors: string;
	source: string;
	pubYear: string;
	doi: string;
	summary: string;
	linkedDiscussion: string;
}

const NewDiscussion = () => {
	const router = useRouter();
	const [body, setBody] = useState<ArticleInterface[]>([]);

	const [formType, setFormType] = useState<FormType>(FormType.BIBTEX);
	const [checked, setChecked] = useState<boolean>(true);

	const submitNewArticle = async () => {
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/articles`,
				{
					method: "POST",
					body: JSON.stringify(body),
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
				}
			);

			alert("Article Submited");
			router.push("/");
		} catch (e) {
			console.log(e);
		}
	};

	const handleSwitch = () => {
		setFormType((prev) => {
			if (prev == FormType.STANDARD) {
				return FormType.BIBTEX;
			}
			return FormType.STANDARD;
		});
		setChecked((prev) => !prev);
	};

	return (
		<div className="container">
			<h1>New Article</h1>
			<div
				style={{
					display: "flex",
					maxWidth: "40%",
					justifyContent: "space-evenly",
				}}
			>
				<span>Standard Input</span>
				<Switch
					onChange={handleSwitch}
					checked={checked}
					checkedIcon={false}
					uncheckedIcon={false}
				/>
				<span>Bibtex Input</span>
			</div>
			{formType == FormType.STANDARD ? (
				<SubmissionForm setBody={setBody} submitArticle={submitNewArticle} />
			) : (
				<BibtexForm />
			)}
		</div>
	);
};

export default NewDiscussion;
