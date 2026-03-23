import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllFreelancersQuery } from "../features/freelancer/redux/api";
import { useGetAllCategoriesQuery } from "../features/category/redux/api";
import SearchIcon from "@mui/icons-material/Search";
import "./HomePage.css";

export const HomePage = () => {
  const navigate = useNavigate();
  const { data: freelancers } = useGetAllFreelancersQuery();
  const { data: categories } = useGetAllCategoriesQuery();

  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearchNavigation = (term: string) => {
    const finalTerm = term.trim() || searchTerm.trim();
    navigate(`/freelancers?search=${encodeURIComponent(finalTerm)}`);
  };

  const topFreelancers = useMemo(() => {
    if (!freelancers) return [];
    return [...freelancers]
      .sort((a, b) => (b.averageStars || 0) - (a.averageStars || 0))
      .slice(0, 4);
  }, [freelancers]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="home-wrapper">
      <section className="fiverr-hero-dark">
        <div className="hero-content-wrapper">
          <h1 className="hero-main-title">
            Our freelancers <br /> will take it from here
          </h1>

          <div className="search-wrapper-relative" ref={searchRef}>
            <div className="fiverr-search-bar">
              <input
                type="text"
                placeholder="Search for any service..."
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
                className="search-submit-btn"
                onClick={() => handleSearchNavigation(searchTerm)}
              >
                <SearchIcon sx={{ fontSize: 24 }} />
              </button>
            </div>
          </div>

          <div className="hero-popular-categories">
            {categories
              ?.filter((c) => !c.parentCategoryId)
              .map((cat) => (
                <button
                  key={cat.categoryId}
                  className="fiverr-pill"
                  onClick={() => handleSearchNavigation(cat.name || "")}
                >
                  {cat.name}
                </button>
              ))}
          </div>
        </div>
      </section>

      <section className="results-container">
        <div className="container-inner">
          <h2 className="results-heading">Top Rated Professionals</h2>
          <div className="fiverr-grid">
            {topFreelancers.map((f) => (
              <div
                key={f.freelancerId}
                className="fiverr-card"
                onClick={() => navigate("/freelancers")}
              >
                <div className="card-image-placeholder">{f.userName?.[0]}</div>
                <div className="card-info">
                  <div className="seller-name">{f.userName}</div>
                  <div className="skills-tags-row">
                    {f.skillNames?.slice(0, 2).map((s) => (
                      <span key={s} className="tag">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="card-footer">
                    <span className="price">From ${f.hourlyRate}</span>
                    <span className="rating">
                      ⭐ {f.averageStars?.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
