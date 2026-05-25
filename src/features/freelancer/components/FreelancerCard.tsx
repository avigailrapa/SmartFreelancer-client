import { useState } from "react";
import type { Freelancer } from "../../../types/freelancer";
import styles from "../pages/FreelancerPage.module.scss";

export const FreelancerCard = ({ f }: { f: Freelancer }) => {
  const [expanded, setExpanded] = useState(false);
  console.log(f.latestRating?.userName);

  return (
    <div className={styles.fiverrCard} onClick={() => setExpanded(!expanded)}>
      <div className={styles.cardInnerContent}>
        <div className={styles.topRow}>
          <div className={styles.sellerRow}>
            <div className={styles.miniAvatar}>{f.userName?.[0]}</div>
            <div>
              <span className={styles.sellerName}>{f.userName}</span>
              <span className={styles.sellerLevel}>
                {f.mainCategoryName || "Freelancer"}
              </span>
            </div>
          </div>
          <div className={styles.priceBlock}>
            <span className={styles.price}>${f.hourlyRate}</span>
            <span className={styles.perHr}>per hour</span>
          </div>
        </div>

        <div className={styles.divider} />

        <p className={styles.cardDescription}>
          {f.bio
            ? f.bio.length > 90
              ? `${f.bio.substring(0, 90)}...`
              : f.bio
            : `Professional ${f.mainCategoryName || "freelancer"} available for hire.`}
        </p>

        <div className={styles.skillsTags}>
          {f.skillNames?.slice(0, 3).map((s: string) => (
            <span key={s} className={styles.skillTag}>
              {s}
            </span>
          ))}
          {(f.skillNames?.length || 0) > 3 && (
            <span className={styles.skillTag}>
              +{(f.skillNames?.length || 0) - 3}
            </span>
          )}
        </div>

        <div className={styles.divider} />

        <div className={styles.cardRating}>
          <span className={styles.starIcon}>★</span>
          <span className={styles.ratingNum}>
            {f.averageStars ? f.averageStars.toFixed(1) : "New"}
          </span>
          <span className={styles.ratingDot}>·</span>
          <span className={styles.availableHours}>{f.experienceLevel}</span>
          <span className={styles.ratingDot}>·</span>
          <span className={styles.availableHours}>
            {f.availableHours}h/week
          </span>
        </div>

        {f.latestRating && (
          <div className={styles.reviewContent}>
            <div className={styles.reviewAvatar}>
              {f.latestRating.userName?.[0]}
            </div>
            <p className={styles.reviewText}>
              "
              {f.latestRating.comment.length > 80
                ? `${f.latestRating.comment.substring(0, 80)}...`
                : f.latestRating.comment}
              "
            </p>
          </div>
        )}

        {expanded && (
          <div
            className={styles.cardExpandedInfo}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.infoItem}>
              <strong>Email</strong>
              <span>{f.email}</span>
            </div>
            {f.specializationNames && f.specializationNames.length > 0 && (
              <div className={styles.infoItem}>
                <strong>Specializations</strong>
                <div className={styles.skillsTags}>
                  {f.specializationNames.map((s: string) => (
                    <span key={s} className={styles.skillTag}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
