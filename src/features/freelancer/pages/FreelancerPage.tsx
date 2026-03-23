import { useState, useMemo, useEffect } from "react";
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
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);

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
        f.specializationNames?.some((s: string) =>
          s.toLowerCase().includes(term),
        ) ||
        f.skillNames?.some((s: string) => s.toLowerCase().includes(term));

      const matchesPrice = (f.hourlyRate || 0) <= maxPrice;
      const matchesLevel =
        selectedLevel === "All" || f.experienceLevel === selectedLevel;

      return matchesSearch && matchesPrice && matchesLevel;
    });
  }, [freelancers, searchTerm, maxPrice, selectedLevel]);

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="browse-wrapper">
      <section className="filters-top-bar">
        <div className="filter-group">
          <div className="filter-item-wrapper">
            <button className="filter-btn">
              {selectedLevel === "All"
                ? "Experience"
                : experienceLabels[selectedLevel]}{" "}
              ▾
            </button>
            <select
              className="hidden-select"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="All">All Levels</option>
              <option value="Junior">Junior</option>{" "}
              <option value="MidLevel">Mid-Level</option>{" "}
              <option value="Senior">Senior</option>{" "}
              <option value="Expert">Expert</option>{" "}
            </select>
          </div>

          <div className="filter-item-wrapper">
            <button
              className={`filter-btn ${isBudgetOpen ? "active" : ""}`}
              onClick={() => setIsBudgetOpen(!isBudgetOpen)}
            >
              Budget (${maxPrice}) ▾
            </button>

            {isBudgetOpen && (
              <div className="budget-popover">
                <div className="popover-header">
                  <span>
                    Max Price: <strong>${maxPrice}</strong>
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1500"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="budget-slider"
                />
                <div className="popover-footer">
                  <button
                    className="apply-btn"
                    onClick={() => setIsBudgetOpen(false)}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="results-count">
          {filteredFreelancers.length}+ results
        </div>
      </section>
      <main className="results-area">
        <div className="fiverr-grid">
          {filteredFreelancers.map((f) => (
            <div key={f.freelancerId} className="fiverr-card">
              <div className="card-image-container">
                <div className="card-image-placeholder">
                  <span className="user-initial">{f.userName?.[0]}</span>
                </div>
              </div>

              <div className="card-content">
                <div className="seller-info-row">
                  <div className="seller-avatar-mini">{f.userName?.[0]}</div>
                  <div className="seller-text-details">
                    <span className="seller-name">{f.userName}</span>
                    <span className="experience-badge">
                      {experienceLabels[f.experienceLevel]}
                    </span>
                  </div>
                </div>

                <p className="card-title">
                  I will provide professional {f.mainCategoryName || "services"}{" "}
                  for your business
                </p>

                <div className="card-rating">
                  <span className="star-icon">★</span>
                  <span className="rating-num">
                    {f.averageStars?.toFixed(1) || "5.0"}
                  </span>
                  <span className="reviews-count">
                    ({Math.floor(Math.random() * 100) + 1})
                  </span>
                </div>
              </div>

              <div className="card-footer">
                <div className="price-section">
                  <span className="starting-at">STARTING AT</span>
                  <span className="actual-price">${f.hourlyRate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
