import { useState, useMemo, useEffect, useRef } from "react";
import { useGetAllFreelancersQuery } from "../features/freelancer/redux/api";
import { useGetAllCategoriesQuery } from "../features/category/redux/api";
import SearchIcon from "@mui/icons-material/Search";
import "./HomePage.css";

interface SubCategory {
  categoryId: number;
  name: string;
}

export const HomePage = () => {
  const { data: freelancers } = useGetAllFreelancersQuery();
  const { data: categories } = useGetAllCategoriesQuery();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

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

  const suggestions = useMemo(() => {
    if (!searchTerm.trim() || !categories || !freelancers) return [];
    const term = searchTerm.toLowerCase().trim();
    const results: string[] = [];

    categories.forEach((cat) => {
      if (cat.name?.toLowerCase().includes(term)) results.push(cat.name);
      cat.subCategories?.forEach((sub: SubCategory) => {
        if (sub.name?.toLowerCase().includes(term)) results.push(sub.name);
      });
    });

    freelancers.forEach((f) => {
      f.skillNames?.forEach((skill: string) => {
        if (skill.toLowerCase().includes(term)) results.push(skill);
      });
    });

    return Array.from(new Set(results)).slice(0, 8);
  }, [searchTerm, categories, freelancers]);

  const filteredFreelancers = useMemo(() => {
    if (!freelancers || (!searchTerm.trim() && !selectedCategory)) return [];

    const term = searchTerm.toLowerCase().trim();

    return freelancers.filter((f) => {
      const matchesCategory =
        !selectedCategory ||
        f.mainCategoryName?.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        term === "" ||
        f.userName?.toLowerCase().includes(term) ||
        f.skillNames?.some((s: string) => s.toLowerCase() === term) ||
        (f.skillNames?.some((s: string) => s.toLowerCase().includes(term)) &&
          term.length < 4);

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory, freelancers]);

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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              <button className="search-submit-btn" type="submit">
                <SearchIcon sx={{ fontSize: 24 }} />
              </button>
            </div>

            {/* רשימת הצעות (כמו בתמונה ששלחת) */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="fiverr-autocomplete-list">
                {suggestions.map((s, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setSearchTerm(s);
                      setShowSuggestions(false);
                    }}
                  >
                    <span className="suggestion-text">
                      {/* הדגשה של מה שהוקלד בתוך ההצעה */}
                      <strong>
                        {s.toLowerCase().startsWith(searchTerm.toLowerCase())
                          ? s.substring(0, searchTerm.length)
                          : ""}
                      </strong>
                      {s.toLowerCase().startsWith(searchTerm.toLowerCase())
                        ? s.substring(searchTerm.length)
                        : s}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="hero-popular-categories">
            {categories
              ?.filter((c) => !c.parentCategoryId)
              .map((cat) => (
                <button
                  key={cat.categoryId}
                  className={`fiverr-pill ${selectedCategory === cat.name ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat.name ?? null)}
                >
                  {cat.name}
                </button>
              ))}
          </div>
        </div>
      </section>

      {(searchTerm || selectedCategory) && (
        <section className="results-container">
          <div className="container-inner">
            <h2 className="results-heading">
              {filteredFreelancers.length} services available
            </h2>
            <div className="fiverr-grid">
              {filteredFreelancers.map((f) => (
                <div key={f.freelancerId} className="fiverr-card">
                  <div className="card-image-placeholder">
                    {f.userName?.[0]}
                  </div>
                  <div className="card-info">
                    <div className="seller-name">{f.userName}</div>
                    <div className="skills-tags-row">
                      {f.skillNames?.slice(0, 3).map((s: string) => (
                        <span key={s} className="tag">
                          {s}
                        </span>
                      ))}
                    </div>
                    <p className="seller-bio">{f.bio?.substring(0, 60)}...</p>
                    <div className="card-footer">
                      <span className="price">
                        Starting at ${f.hourlyRate || 50}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredFreelancers.length === 0 && (
              <div className="no-results-msg">
                No exact matches found. Try a different term.
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
