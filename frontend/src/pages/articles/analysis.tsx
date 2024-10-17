import { useEffect, useState } from 'react';
import { ArticleInterface } from "@/utils/article.interface";

const AnalysisQueuePage = () => {

var current = 1

  // API call function
const fetchArticles = async () => {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/approved`); // fetch all approved articles
		if (!response.ok) {
			throw new Error("Failed to fetch");
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching articles:", error);
		return null; // Return null if there's an error
	}
};

  const [articles, setArticles] = useState<ArticleInterface[]>([]);

	useEffect(() => {
		const getArticles = async () => {
			const fetchedArticles = await fetchArticles();
			if (fetchedArticles) {
				setArticles(fetchedArticles);
			}
		};
		getArticles();
	}, []);

  //list of articles that have been submitted
  const queueList = articles.map((article) => (
    <li key={(article as any)._id}>
      <p><strong>Submission{' '+current++}</strong></p>
      <p>
        <strong>Title: </strong>{article.title}<br />
        <strong>Authors: </strong> {article.authors}<br />
        <strong>Source: </strong> {article.source}<br />
        <strong>Publication Year: </strong> {article.pubyear}<br />
        <strong>DOI: </strong> {article.doi}<br />
        <strong>Claim: </strong> {article.claim}<br />
        <strong>Evidence: </strong> {article.evidence}
      </p>
      <button onClick={() => window.location.href = `/articles/analysis/${(article as any)._id}`}>Analysis Form</button>
      <br /><br />
    </li>
  ));

  return (
    <div className="container">
      <h1>Analysis Queue</h1>
      <ul>{queueList}</ul>
    </div>
  );
};

export default AnalysisQueuePage;
