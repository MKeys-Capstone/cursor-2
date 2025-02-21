import React, { useState } from "react";
import { Disc, UserDisc } from "../types/disc";
import { discService } from "../services/discService";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface DiscSearchProps {
  onAddDisc: (disc: UserDisc) => void;
}

export const DiscSearch: React.FC<DiscSearchProps> = ({ onAddDisc }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Disc[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const results = await discService.searchDiscs(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching discs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDisc = (disc: Disc) => {
    const userDisc: UserDisc = {
      ...disc,
      condition: "New",
      weight: 175, // Default weight
      inBag: false,
      color: "#FFFFFF", // Default to white
    };
    onAddDisc(userDisc);
  };

  return (
    <div className="disc-search">
      <h2>Search Discs</h2>
      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for discs..."
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="search-results-list">
        {searchResults.map((disc) => (
          <div key={disc.discId} className="search-result-item">
            <div className="disc-info">
              <span className="disc-name">{disc.name}</span>&nbsp;
              <span className="manufacturer">({disc.manufacturer})</span>
              <span className="flight-numbers">
                Speed: {disc.speed} | Glide: {disc.glide} | Turn: {disc.turn} |
                Fade: {disc.fade}
              </span>
            </div>
            <IconButton
              onClick={() => handleAddDisc(disc)}
              aria-label="Add to collection"
              color="primary"
            >
              <AddIcon />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
};
