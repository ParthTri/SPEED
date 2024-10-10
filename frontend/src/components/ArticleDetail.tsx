import React, { useEffect, useState } from 'react';
import { ArticleInterface } from '@/utils/article.interface';
import styles from '../styles/ArticleDetail.module.scss';

interface ArticleDetailProps {
  article: ArticleInterface;
  onClose: () => void;
}

interface RatingData {
  average_rating: number;
  total_ratings: number;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onClose }) => {
  const [ratingData, setRatingData] = useState<RatingData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(0);

  useEffect(() => {
    fetchRating();
  }, [article._id]); // Change article.id to article._id to match MongoDB

  const fetchRating = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/articles/${article._id}/rating`);
      if (!response.ok) throw new Error('Failed to fetch rating');
      const data = await response.json();
      setRatingData(data);
    } catch (err) {
      setError('Failed to load rating');
      console.error(err);
    }
  };

  const handleRate = async (rating: number) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:3000/api/articles/${article._id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          rating,
          user_id: 'user123' 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }

      setSelectedRating(rating);
      await fetchRating();
    } catch (err) {
      setError('Failed to submit rating');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        
        <h2 className={styles.title}>{article.title}</h2>
        
        <div className={styles.ratingSection}>
          <div className={styles.starRating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => !isSubmitting && handleRate(star)}
                className={`${styles.star} ${selectedRating >= star ? styles.active : ''}`}
                disabled={isSubmitting}
              >
                ★
              </button>
            ))}
          </div>
          
          {ratingData && (
            <div className={styles.ratingInfo}>
              <span>Average Rating: {ratingData.average_rating.toFixed(1)} ★</span>
              <span>Total Ratings: {ratingData.total_ratings}</span>
            </div>
          )}
          
          {error && <p className={styles.error}>{error}</p>}
        </div>

        <div className={styles.details}>
          <div className={styles.field}>
            <label>Authors:</label>
            <span>{article.authors.join(', ')}</span>
          </div>
          
          <div className={styles.field}>
            <label>Source:</label>
            <span>{article.source}</span>
          </div>
          
          <div className={styles.field}>
            <label>Publication Year:</label>
            <span>{article.pubyear}</span>
          </div>
          
          <div className={styles.field}>
            <label>DOI:</label>
            <span>{article.doi}</span>
          </div>
          
          <div className={styles.field}>
            <label>Summary:</label>
            <p>{article.summary}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;