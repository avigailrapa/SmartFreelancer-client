import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllFreelancersQuery } from "../freelancer/redux/api";
import { useGetAllCategoriesQuery } from "../category/redux/api";
import { useClickOutside } from "../../hooks/useClickOutside";
import { FreelancerCard } from "../freelancer/components/FreelancerCard";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./HomePage.module.scss";

export const HomePage = () => {
  const navigate = useNavigate();
  const { data: freelancers } = useGetAllFreelancersQuery();
  const { data: categories } = useGetAllCategoriesQuery();

  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearchNavigation = (term: string) => {
    const finalTerm = term.trim();
    if (finalTerm) {
      navigate(`/freelancers?search=${encodeURIComponent(finalTerm)}`);
      setShowSuggestions(false);
    }
  };

  const allSuggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase().trim();
    const suggestionsSet = new Set<string>();

    categories?.forEach((cat) => {
      if (cat.name?.toLowerCase().includes(term)) suggestionsSet.add(cat.name);
    });

    freelancers?.forEach((f) => {
      f.specializationNames?.forEach((s: string) => {
        if (s.toLowerCase().includes(term)) suggestionsSet.add(s);
      });
      f.skillNames?.forEach((s: string) => {
        if (s.toLowerCase().includes(term)) suggestionsSet.add(s);
      });
    });

    return Array.from(suggestionsSet).slice(0, 8);
  }, [searchTerm, categories, freelancers]);

  const topFreelancers = useMemo(() => {
    if (!freelancers) return [];
    return [...freelancers]
      .sort((a, b) => (b.averageStars || 0) - (a.averageStars || 0))
      .slice(0, 4);
  }, [freelancers]);

  useClickOutside(searchRef, () => setShowSuggestions(false));

  return (
    <div className={styles.wrapper}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Our professionals <br /> will take it from here
          </h1>

          <div ref={searchRef}>
            <div className={styles.searchWrapper}>
              <div className={styles.searchBar}>
                <input
                  type="text"
                  placeholder="What service are you looking for?"
                  value={searchTerm}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSearchNavigation(searchTerm)
                  }
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                />
                <button
                  className={styles.searchBtn}
                  onClick={() => handleSearchNavigation(searchTerm)}
                >
                  <SearchIcon sx={{ fontSize: 24 }} />
                </button>
              </div>

              {showSuggestions && allSuggestions.length > 0 && (
                <div className={styles.suggestions}>
                  {allSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className={styles.suggestionRow}
                      onClick={() => handleSearchNavigation(suggestion)}
                    >
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.popularCategories}>
              <span>Popular:</span>
              {categories
                ?.filter((c) => !c.parentCategoryId)
                .slice(0, 4)
                .map((cat) => (
                  <button
                    key={cat.categoryId}
                    className={styles.pill}
                    onClick={() => handleSearchNavigation(cat.name || "")}
                  >
                    {cat.name}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.results}>
        <div className={styles.resultsInner}>
          <h2 className={styles.resultsHeading}>Top Rated Professionals</h2>
          <div className={styles.grid}>
            {topFreelancers.map((f) => (
              <FreelancerCard key={f.freelancerId} f={f} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
