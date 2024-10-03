import { ArticleInterface } from "@/utils/article.interface";
import { FormEvent } from "react";

export interface FormProps {
	setBody: (val: ArticleInterface[]) => void;
	submitArticle: () => void;
}
