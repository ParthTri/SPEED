import React, { useEffect, useState } from 'react';
import { ArticleInterface } from '@/utils/article.interface';
import styles from '../styles/ArticleDetail.module.scss';

interface ArticleDetailProps {
  article: ArticleInterface;
  onClose: () => void;
}

interface RatingData {
  averageRating: number;
  userRating?: number;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onClose }) => {
  const [ratingData, setRatingData] = useState<RatingData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(0);

  useEffect(() => {
    fetchRating();
  }, [article.id]);

  const fetchRating = async () => {
    try {
      const response = await fetch(`/api/articles/${article.id}/rating`);
      if (!response.ok) throw new Error('Failed to fetch rating');
      const data = await response.json();
      setRatingData(data);
      if (data.userRating) {
        setSelectedRating(data.userRating);
      }
    } catch (err) {
      setError('Failed to load rating');
      console.error(err);
    }
  };

  const handleRate = async (rating: number) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/articles/${article.id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
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
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalBody}>
          <h3 className={styles.modalTitle}>{article.title}</h3>
          
          <div className={styles.ratingContainer}>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => !isSubmitting && handleRate(star)}
                  className={`${styles.starBtn} ${selectedRating >= star ? styles.selected : ''} ${isSubmitting ? styles.submitting : ''}`}
                  disabled={isSubmitting}
                >
                  ★
                </button>
              ))}
            </div>
            {ratingData && (
              <div className={styles.averageRating}>
                Average Rating: {ratingData.averageRating.toFixed(1)} ★
              </div>
            )}
            {error && (
              <p className={styles.errorMessage}>{error}</p>
            )}
          </div>

          <div className={styles.articleDetails}>
            <p>
              <strong>Authors:</strong> {article.authors}<br/>
              <strong>Source:</strong> {article.source}<br/>
              <strong>Publication Year:</strong> {article.pubyear}<br/>
              <strong>DOI:</strong> {article.doi}<br/>
              <strong>Claim:</strong> {article.claim}<br/>
              <strong>Evidence:</strong> {article.evidence}
            </p>
          </div>
          <div className={styles.modalFooter}>
            <button onClick={onClose} className={styles.closeBtn}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;