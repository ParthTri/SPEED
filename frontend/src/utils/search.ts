import { ArticleInterface } from './article.interface'; // Adjust path if needed

export function searchArticles(articles: ArticleInterface[], searchTerm: string): ArticleInterface[] {
  const lowercasedTerm = searchTerm.toLowerCase();
  return articles.filter(article =>
    article.title?.toLowerCase().includes(lowercasedTerm) || // Optional chaining in case title is undefined
    (Array.isArray(article.authors) ? article.authors.join(' ').toLowerCase() : article.authors?.toLowerCase()).includes(lowercasedTerm) ||
    article.claim?.toLowerCase().includes(lowercasedTerm) || // Handle possibly undefined claim
    article.evidence?.toLowerCase().includes(lowercasedTerm) || // Handle possibly undefined evidence
    article.source?.toLowerCase().includes(lowercasedTerm) ||   // Handle possibly undefined source
    article.doi?.toLowerCase().includes(lowercasedTerm)         // Handle possibly undefined doi
  );
}
