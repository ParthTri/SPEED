import { useState } from 'react';
import data from "../../utils/dummydata";

const ModerationPage = () => {
  //Set initial state with the dummy data
  const [articles, setArticles] = useState(data);

  //function to handle removing an article from the list
  const handleRemove = (indexToRemove: number) => {
    setArticles(articles.filter((_, index) => index !== indexToRemove));
  };

  //function to handle accepted articles
  const acceptArticle = (index: number) => {
    handleRemove(index)
  };

  //function to handle article rejection
  const rejectArticle = (index: number) => {
    handleRemove(index)
  };

  //list of articles that have been submitted
  const queueList = articles.map((article, index) => (
    <li key={index}>
      <p><strong>Submission {index + 1}</strong></p>
      <p>
        <strong>Title: </strong>{article.title}<br />
        <strong>Authors: </strong> {article.authors}<br />
        <strong>Source: </strong> {article.source}<br />
        <strong>Publication Year: </strong> {article.pubyear}<br />
        <strong>DOI: </strong> {article.doi}<br />
        <strong>Claim: </strong> {article.claim}<br />
        <strong>Evidence: </strong> {article.evidence}
      </p>
      <button onClick={() => acceptArticle(index)}>Accept</button>       <button onClick={() => rejectArticle(index)}>Reject</button>
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
