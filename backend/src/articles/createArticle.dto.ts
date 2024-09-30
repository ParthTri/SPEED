export interface CreateArticleDTO {
  title: string;
  authors: string[];
  source: string;
  pubyear: number;
  doi: string;
  summary: string;
  linked_discussion: string;
  state: string;
}
