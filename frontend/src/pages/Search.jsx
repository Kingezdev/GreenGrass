import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getProfileByUsername } from "../api/accounts";
import SearchResults from "./SearchResults";
import { useHandle404Redirect } from "../utils/handleErrors";
import HandleLoading from "../utils/HandleLoading";

const Search = () => {
  const { accessToken } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handle404 = useHandle404Redirect();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const profile = await getProfileByUsername(query.trim(), accessToken);
      setResults([profile]); // wrap in array for SearchResults
    } catch (err) {
      setError(err.message || "User not found");
      handle404(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter username (or first/last name)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Search
        </button>
      </form>

      <HandleLoading loading={loading}>
        {error && <p className="text-red-600">{error}</p>}
        {results.length > 0 && <SearchResults profiles={results} />}
      </HandleLoading>
    </div>
  );
};

export default Search;
