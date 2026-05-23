import { useState } from "react";
import type { Freelancer } from "../../../types/freelancer";
import styles from "../pages/FreelancerPage.module.scss";

export const FreelancerCard = ({ f }: { f: Freelancer }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={styles.fiverrCard}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className={styles.cardImagePlaceholder}>
        {f.userName?.[0]}
      </div>

      <div className={styles.cardInnerContent}>
        <div className={styles.sellerRow}>
          <div className={styles.miniAvatar}>{f.userName?.[0]}</div>
          <div>
            <span className={styles.sellerName}>{f.userName}</span>
            <span className={styles.sellerLevel}>{f.experienceLevel}</span>
          </div>
        </div>

        <p className={styles.cardDescription}>
          I will provide professional {f.mainCategoryName || "services"}
        </p>

        <div className={styles.cardRating}>
          <span>★</span>
          <span className={styles.ratingNum}>{f.averageStars?.toFixed(1) || "5.0"}</span>
        </div>

        {isExpanded && (
          <div className={styles.cardExpandedInfo} onClick={(e) => e.stopPropagation()}>
            <div className={styles.expandedDivider}></div>
            <div className={styles.infoItem}>
              <strong>Email:</strong> <span>{f.email}</span>
            </div>
            <div className={styles.infoItem}>
              <strong>Skills:</strong>
              <div className={styles.skillsTags}>
                {f.skillNames?.map((s: string) => (
                  <span key={s} className={styles.skillTag}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.fromText}>From</span>
        <span className={styles.price}>${f.hourlyRate}</span>
      </div>
    </div>
  );
};