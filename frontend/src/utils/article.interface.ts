export interface ArticleInterface {

	_id?: string;
	title: string;
	authors: string[] | string;
	source: string;
	pubyear: number;
	doi: string;
	summary?: string;
	ratings?: Array<{
	  user_id: string;
	  rating: number;
	}>;
	average_rating?: number;
}
