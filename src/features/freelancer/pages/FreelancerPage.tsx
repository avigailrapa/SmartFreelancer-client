import { useState, useMemo, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useGetAllFreelancersQuery } from "../redux/api";
import { useClickOutside } from "../hooks/useClickOutside";
import { FreelancerCard } from "../components/FreelancerCard";
import styles from "./FreelancerPage.module.scss";

const experienceLabels: Record<string, string> = {
  All: "Experience Level",
  Junior: "Junior",
  MidLevel: "Mid-Level",
  Senior: "Senior",
  Expert: "Expert",
};

export const FreelancersPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";

  const { data: freelancers, isLoading } = useGetAllFreelancersQuery();

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [priceRange, setPriceRange] = useState<[number, number]>([20, 1500]);
  const [selectedLevel, setSelectedLevel] = useState<string>("All");

  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);

  const budgetRef = useRef<HTMLDivElement>(null);
  const expRef = useRef<HTMLDivElement>(null);

  useClickOutside(budgetRef, () => setIsBudgetOpen(false));
  useClickOutside(expRef, () => setIsExperienceOpen(false));

  useEffect(() => {
    setSearchTerm(initialSearch);
  }, [initialSearch]);

  const filteredFreelancers = useMemo(() => {
    if (!freelancers) return [];
    const term = searchTerm.toLowerCase().trim();

    return freelancers.filter((f) => {
      const matchesSearch =
        !term ||
        f.userName?.toLowerCase().includes(term) ||
        f.mainCategoryName?.toLowerCase().includes(term) ||
        f.skillNames?.some((s: string) => s.toLowerCase().includes(term));

      const matchesPrice =
        (f.hourlyRate || 0) >= priceRange[0] &&
        (f.hourlyRate || 0) <= priceRange[1];

      const matchesLevel =
        selectedLevel === "All" || String(f.experienceLevel) === selectedLevel;

      return matchesSearch && matchesPrice && matchesLevel;
    });
  }, [freelancers, searchTerm, priceRange, selectedLevel]);

  if (isLoading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.browseContainer}>
      <nav className={styles.filtersNav}>
        <div className={styles.filtersInner}>
          <div className={styles.filterButtonsGroup}>
            <div className={styles.filterWrapper} ref={expRef}>
              <button
                className={`${styles.minimalBtn} ${selectedLevel !== "All" ? styles.activeFilter : ""}`}
                onClick={() => setIsExperienceOpen(!isExperienceOpen)}
              >
                {experienceLabels[selectedLevel]} ▾
              </button>

              {isExperienceOpen && (
                <div className={styles.dropdownPanel}>
                  {Object.keys(experienceLabels).map((level) => (
                    <div
                      key={level}
                      className={`${styles.dropdownOption} ${selectedLevel === level ? styles.selected : ""}`}
                      onClick={() => {
                        setSelectedLevel(level);
                        setIsExperienceOpen(false);
                      }}
                    >
                      {level === "All" ? "All Levels" : experienceLabels[level]}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.filterWrapper} ref={budgetRef}>
              <button
                className={`${styles.minimalBtn} ${priceRange[0] > 20 || priceRange[1] < 1500 ? styles.activeFilter : ""}`}
                onClick={() => setIsBudgetOpen(!isBudgetOpen)}
              >
                Budget ▾
              </button>

              {isBudgetOpen && (
                <div
                  className={`${styles.dropdownPanel} ${styles.budgetPanel}`}
                >
                  <div className={styles.budgetHeader}>
                    Price Range:{" "}
                    <strong>
                      ${priceRange[0]} - ${priceRange[1]}
                    </strong>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="1500"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className={styles.budgetSlider}
                  />
                  <div className={styles.budgetActions}>
                    <button
                      className={styles.clearBtnText}
                      onClick={() => setPriceRange([20, 1500])}
                    >
                      Clear
                    </button>
                    <button
                      className={styles.applyBtnSmall}
                      onClick={() => setIsBudgetOpen(false)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {(selectedLevel !== "All" ||
              priceRange[0] > 20 ||
              priceRange[1] < 1500) && (
              <button
                className={styles.clearAllLink}
                onClick={() => {
                  setSelectedLevel("All");
                  setPriceRange([20, 1500]);
                }}
              >
                Clear All
              </button>
            )}
          </div>

          <div className={styles.resultsInfo}>
            <strong>{filteredFreelancers.length}</strong> services available
          </div>
        </div>
      </nav>

      <main className={styles.cardsGridLayout}>
        {filteredFreelancers.map((f) => (
          <FreelancerCard key={f.freelancerId} f={f} />
        ))}
      </main>
    </div>
  );
};
