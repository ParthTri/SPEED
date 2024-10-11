import { useEffect, useState } from 'react';
import { ArticleInterface } from "@/utils/article.interface";

const ModerationPage = () => {

var current = 1

  // API call function
const fetchArticles = async () => {
	try {
		const response = await fetch("http://localhost:3000/api/articles/pending"); // fetch all pending articles
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

// Function to handle removing an article from the list
const handleRemove = (idToRemove: string) => {
  setArticles(articles.filter(article => (article as any)._id !== idToRemove));
};

// Function to handle approve articles
const approveArticle = async (id: string) => {
  try {
    const response = await fetch(`http://localhost:3000/api/articles/${id}/approved`, {
      method: 'PATCH',
    });
    if (response.ok) {
      handleRemove(id);
    } else {
      console.error('Failed to approve article');
    }
  } catch (error) {
    console.error('Error accepting article:', error);
  }
};

//function to handle article rejection
const rejectArticle = async (id: string) => {
  try {
    const response = await fetch(`http://localhost:3000/api/articles/${id}/reject`, {
      method: 'PATCH',
    });
    if (response.ok) {
      handleRemove(id);
    } else {
      console.error('Failed to reject article');
    }
  } catch (error) {
    console.error('Error rejecting article:', error);
  }
};

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
      <button onClick={() => approveArticle((article as any)._id)}>Accept</button>
      <button onClick={() => rejectArticle((article as any)._id)}>Reject</button>
      <br /><br />
    </li>
  ));

  return (
    <div className="container">
      <h1>Moderation Queue</h1>
      <ul>{queueList}</ul>
    </div>
  );
};

export default ModerationPage;
