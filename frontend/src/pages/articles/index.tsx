import { GetStaticProps, NextPage } from "next";
import React, { useState } from "react";
import ArticleDetail from "../../components/ArticleDetail";
import data from "../../utils/dummydata";

interface ArticleInterface {
  id: string;
  title: string;
  authors: string;
  source: string;
  pubyear: string;
  doi: string;
  claim: string;
  evidence: string;
}

type ArticlesProps = {
  articles: ArticleInterface[];
};

const Articles: NextPage<ArticlesProps> = ({ articles }) => {
  const [selectedArticle, setSelectedArticle] = useState<ArticleInterface | null>(null);

  const handleArticleClick = (article: ArticleInterface) => {
    setSelectedArticle(article);
  };

  const handleCloseDetail = () => {
    setSelectedArticle(null);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold my-4">Articles Index Page</h1>
      <p className="mb-4">Click on an article title to view details:</p>
      <ul className="divide-y divide-gray-200">
        {articles.map((article) => (
          <li
            key={article.id}
            className="py-4 cursor-pointer hover:bg-gray-100"
            onClick={() => handleArticleClick(article)}
          >
            {article.title}
          </li>
        ))}
      </ul>
      {selectedArticle && (
        <ArticleDetail article={selectedArticle} onClose={handleCloseDetail} />
      )}
    </div>
  );
};

export const getStaticProps: GetStaticProps<ArticlesProps> = async (_) => {
  const articles = data.map((article) => ({
    id: article.id ?? article._id,
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