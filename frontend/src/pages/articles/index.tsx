import { GetStaticProps, NextPage } from "next";
import { useState } from "react";
import SortableTable from "../../components/table/SortableTable";
import ArticleDetail from "../../components/ArticleDetail";
import data from "../../utils/dummydata";
import { ArticleInterface } from "@/utils/article.interface";

type ArticlesProps = {
  articles: ArticleInterface[];
};

const Articles: NextPage<ArticlesProps> = ({ articles }) => {
  // State to manage sorting and selected article for detail view
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ArticleInterface;
    direction: string;
  } | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<ArticleInterface | null>(null);

  // Sorting logic
  const sortedArticles = [...articles].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) {
      return direction === "ascending" ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Handle sorting
  const handleSort = (column: keyof ArticleInterface) => {
    let direction = "ascending";
    if (sortConfig?.key === column && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key: column, direction });
  };

  // Handle article selection for detail view
  const handleArticleClick = (article: ArticleInterface) => {
    setSelectedArticle(article);
  };

  // Close article detail view
  const handleCloseDetail = () => {
    setSelectedArticle(null);
  };

  // Table headers
  const headers: { key: keyof ArticleInterface; label: string }[] = [
    { key: "title", label: "Title" },
  ];

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold my-4">Articles Index Page</h1>
      <p className="mb-4">Click on an article title to view details or sort the columns:</p>

      {/* If an article is selected, display the detail view */}
      {selectedArticle ? (
        <ArticleDetail article={selectedArticle} onClose={handleCloseDetail} />
      ) : (
        // Otherwise, show the sortable table
        <SortableTable
          headers={headers}
          data={sortedArticles}
          onSort={handleSort}
          sortConfig={sortConfig}
          onRowClick={handleArticleClick} // Enable clicking to view article details
        />
      )}
    </div>
  );
};

// Fetch articles as static props
export const getStaticProps: GetStaticProps<ArticlesProps> = async () => {
  // Ensure all articles have consistent properties
  const articles = data.map((article) => ({
    id: article.id ?? article.id,
    title: article.title,
    authors: article.authors,
    source: article.source,
    pubyear: article.pubyear,
    doi: article.doi,
    claim: article.claim,
    evidence: article.evidence,
  }));

  return {
    props: {
      articles,
    },
  };
};

export default Articles;
