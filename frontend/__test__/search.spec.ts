import { describe, it, expect } from 'vitest';
import data from '../../utils/dummydata'; // Adjust the relative path
import { searchArticles } from "../../utils/search"; // Adjusted to relative path

describe('Search Articles with dummy data', () => {
  it('should return articles matching the search term in the title', () => {
    const searchTerm = 'Test-Driven';
    const result = searchArticles(data, searchTerm);
    expect(result.length).toBe(2); // Two articles have 'Test-Driven' in the title
    expect(result[0].title).toContain('Test-Driven Development');
    expect(result[1].title).toContain('Test-Driven Development');
  });

  it('should return articles matching the search term in the authors', () => {
    const searchTerm = 'Janzen';
    const result = searchArticles(data, searchTerm);
    expect(result.length).toBe(1); // Only one article has 'Janzen' as an author
    expect(result[0].authors).toContain('Janzen, D. S.');
  });

  it('should return articles matching the search term in the claim', () => {
    const searchTerm = 'code quality';
    const result = searchArticles(data, searchTerm);
    expect(result.length).toBe(3); // Three articles claim 'code quality improvement'
    expect(result[0].claim).toBe('code quality improvement');
  });

  it('should return an empty array when no match is found', () => {
    const searchTerm = 'Non-Existent';
    const result = searchArticles(data, searchTerm);
    expect(result.length).toBe(0);
  });
});
