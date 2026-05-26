import { useAddRatingMutation } from "../redux/api";
import { useState } from "react";
import styles from "./RatingForm.module.scss";
import Rating from "@mui/material/Rating"; 

interface RatingFormProps {
  freelancerId: number;
  onClose: () => void;
}

export const RatingForm = ({ freelancerId, onClose }: RatingFormProps) => {
  const [addRating] = useAddRatingMutation();
  const [ratingData, setRatingData] = useState({ stars: 5, comment: "" });

  const handleSubmit = async () => {
    try {
      await addRating({ freelancerId, ...ratingData }).unwrap();
      alert("Rating submitted successfully!");
      onClose();
    } catch {
      alert("Failed to submit rating.");
    }
  };

  return (
    <div className={styles.modalCard}>
      <div className={styles.modalHeader}>
        <h2>Add Rating</h2>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          &times;
        </button>
      </div>

      <div className={styles.modalBody}>
        <div className={styles.formGroup}>
          <label>Stars </label>
          <div className={styles.starsContainer}>
            <Rating
              name="freelancer-rating"
              value={ratingData.stars}
              precision={1}
              size="large"  
              onChange={(_, newValue) => {
                if (newValue !== null) {
                  setRatingData({ ...ratingData, stars: newValue });
                }
              }}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="rating-comment">Comment </label>
          <textarea
            id="rating-comment"
            className={styles.textareaField}
            placeholder="Write a brief comment..."
            value={ratingData.comment}
            onChange={(e) => setRatingData({ ...ratingData, comment: e.target.value })}
          />
        </div>
      </div>

      <div className={styles.modalFooter}>
        <button className={styles.btnCancel} onClick={onClose}>
          Cancel
        </button>
        <button className={styles.btnSubmit} onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};