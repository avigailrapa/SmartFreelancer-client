import { useState, useMemo, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useGetAllFreelancersQuery } from "../redux/api";
import "../../HomePage.css";
import "./FreelancerPage.css";

const experienceLabels: Record<string, string> = {
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

  useEffect(() => {
    setSearchTerm(initialSearch);
  }, [initialSearch]);

  // סגירה בלחיצה מחוץ
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (budgetRef.current && !budgetRef.current.contains(e.target as Node)) {
        setIsBudgetOpen(false);
      }
      if (expRef.current && !expRef.current.contains(e.target as Node)) {
        setIsExperienceOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredFreelancers = useMemo(() => {
    if (!freelancers) return [];

    const term = searchTerm.toLowerCase().trim();

    return freelancers.filter((f) => {
      const matchesSearch =
        !term ||
        f.userName?.toLowerCase().includes(term) ||
        f.mainCategoryName?.toLowerCase().includes(term) ||
        f.specializationNames?.some((s: string) =>
          s.toLowerCase().includes(term)
        ) ||
        f.skillNames?.some((s: string) => s.toLowerCase().includes(term));

      const matchesPrice =
        (f.hourlyRate || 0) >= priceRange[0] &&
        (f.hourlyRate || 0) <= priceRange[1];

      const matchesLevel =
        selectedLevel === "All" || f.experienceLevel === selectedLevel;

      return matchesSearch && matchesPrice && matchesLevel;
    });
  }, [freelancers, searchTerm, priceRange, selectedLevel]);

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="browse-wrapper">
      <section className="filters-top-bar">
        <div className="filter-group">

          {/* EXPERIENCE */}
          <div className="filter-item-wrapper" ref={expRef}>
            <button
              className={`filter-btn ${isExperienceOpen ? "active" : ""}`}
              onClick={() => setIsExperienceOpen((prev) => !prev)}
            >
              {selectedLevel === "All"
                ? "Experience"
                : experienceLabels[selectedLevel]}{" "}
              ▾
            </button>

            {isExperienceOpen && (
              <div className="dropdown-menu">
                {["All", "Junior", "MidLevel", "Senior", "Expert"].map(
                  (level) => (
                    <div
                      key={level}
                      className={`dropdown-item ${
                        selectedLevel === level ? "selected" : ""
                      }`}
                      onClick={() => {
                        setSelectedLevel(level);
                        setIsExperienceOpen(false);
                      }}
                    >
                      {level === "All" ? "All Levels" : experienceLabels[level]}
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* BUDGET */}
          <div className="filter-item-wrapper" ref={budgetRef}>
            <button
              className={`filter-btn ${isBudgetOpen ? "active" : ""}`}
              onClick={() => setIsBudgetOpen((prev) => !prev)}
            >
              Budget (${priceRange[0]}–${priceRange[1]}) ▾
            </button>

            {isBudgetOpen && (
              <div className="budget-popover">
                <div className="popover-header">
                  Price:{" "}
                  <strong>
                    ${priceRange[0]} – ${priceRange[1]}
                  </strong>
                </div>

                <div className="range-track">
                  {/* Thumb תחתון - min */}
                  <input
                    type="range"
                    min="20"
                    max="1500"
                    step="10"
                    value={priceRange[0]}
                    onChange={(e) => {
                      const val = Math.min(
                        Number(e.target.value),
                        priceRange[1] - 10
                      );
                      setPriceRange([val, priceRange[1]]);
                    }}
                    className="range-input range-lower"
                  />
                  {/* Thumb עליון - max */}
                  <input
                    type="range"
                    min="20"
                    max="1500"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => {
                      const val = Math.max(
                        Number(e.target.value),
                        priceRange[0] + 10
                      );
                      setPriceRange([priceRange[0], val]);
                    }}
                    className="range-input range-upper"
                  />

                  {/* פס צבוע בין שני הthumb-ים */}
                  <div
                    className="range-fill"
                    style={{
                      left: `${((priceRange[0] - 20) / (1500 - 20)) * 100}%`,
                      right: `${
                        100 - ((priceRange[1] - 20) / (1500 - 20)) * 100
                      }%`,
                    }}
                  />
                </div>

                <button
                  className="apply-btn"
                  onClick={() => setIsBudgetOpen(false)}
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* CLEAR */}
          <button
            className="clear-btn"
            onClick={() => {
              setPriceRange([20, 1500]);
              setSelectedLevel("All");
            }}
          >
            Clear Filters
          </button>
        </div>

        <div className="results-count">{filteredFreelancers.length} results</div>
      </section>

      <main className="results-area">
        <div className="fiverr-grid">
          {filteredFreelancers.map((f) => (
            <div key={f.freelancerId} className="fiverr-card">
              <div className="card-image-container">
                <div className="card-image-placeholder">
                  <span>{f.userName?.[0]}</span>
                </div>
              </div>

              <div className="card-content">
                <div className="seller-info-row">
                  <div className="seller-avatar-mini">{f.userName?.[0]}</div>
                  <div>
                    <div className="seller-name">{f.userName}</div>
                    <div className="experience-badge">
                      {experienceLabels[f.experienceLevel]}
                    </div>
                  </div>
                </div>

                <p className="card-title">
                  I will provide professional{" "}
                  {f.mainCategoryName || "services"}
                </p>

                <div className="card-rating">
                  ★ {f.averageStars?.toFixed(1) || "5.0"}
                </div>
              </div>

              <div className="card-footer">
                <span>From</span>
                <strong>${f.hourlyRate}</strong>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};