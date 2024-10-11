import { ArticleInterface } from './article.interface'; // Adjust path if needed

export function searchArticles(articles: ArticleInterface[], searchTerm: string): ArticleInterface[] {
  const lowercasedTerm = searchTerm.toLowerCase();
  return articles.filter(article =>
    article.title.toLowerCase().includes(lowercasedTerm) ||
    article.authors.toLowerCase().includes(lowercasedTerm) ||
    article.claim.toLowerCase().includes(lowercasedTerm) ||
    article.evidence.toLowerCase().includes(lowercasedTerm) || // Include evidence field
    article.source.toLowerCase().includes(lowercasedTerm) ||   // Include source field
    article.doi.toLowerCase().includes(lowercasedTerm)         // Include DOI field
  );
}
