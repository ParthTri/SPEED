export interface ArticleInterface {
	id?: string;
	title: string;
	authors: string[] | string;
	source: string;
	pubyear: number;
	doi: string;
	claim?: string;
	evidence?: string;
}
