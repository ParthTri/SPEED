import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import ArticleDetail from "../../components/ArticleDetail";
import { ArticleInterface } from "@/utils/article.interface";
import styles from '../../styles/Articles.module.scss';

interface ArticlesProps {
  articles: ArticleInterface[];
}

const Articles: NextPage<ArticlesProps> = ({ articles }) => {
  const [selectedArticle, setSelectedArticle] = useState<ArticleInterface | null>(null);
  const [sortField, setSortField] = useState<keyof ArticleInterface>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof ArticleInterface) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedArticles = [...articles].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    if (aValue < bValue) return -1 * direction;
    if (aValue > bValue) return 1 * direction;
    return 0;
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Articles</h1>
      
      <table className={styles.table}>
        <thead>
          <tr>
            <th onClick={() => handleSort('title')}>
              Title {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('pubyear')}>
              Year {sortField === 'pubyear' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th>Authors</th>
          </tr>
        </thead>
        <tbody>
          {sortedArticles.map((article) => (
            <tr 
              key={article._id}
              onClick={() => setSelectedArticle(article)}
              className={styles.tableRow}
            >
              <td>{article.title}</td>
              <td>{article.pubyear}</td>
              <td>{article.authors.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedArticle && (
        <ArticleDetail 
          article={selectedArticle} 
          onClose={() => setSelectedArticle(null)} 
        />
      )}
    </div>
  );
};

// Change to GetServerSideProps to get real-time data
export const getServerSideProps: GetServerSideProps<ArticlesProps> = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/articles');
    if (!response.ok) throw new Error('Failed to fetch articles');
    const articles = await response.json();

    return { props: { articles } };
  } catch (error) {
    console.error(error);
    return { props: { articles: [] } };
  }
};

export default Articles;