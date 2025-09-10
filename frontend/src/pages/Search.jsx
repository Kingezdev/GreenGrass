// src/pages/Search.jsx
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
    if (!query) return;

    try {
      setLoading(true);
      setError(null);
      const profile = await getProfileByUsername(query, accessToken);
      setResults([profile]);
    } catch (err) {
      handle404(err);
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSearch} className="flex mb-4">
        <input
          type="text"
          placeholder="Search by username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-r-md hover:bg-green-600"
        >
          Search
        </button>
      </form>

      <HandleLoading loading={loading}>
        {!error && results.length > 0 && <SearchResults results={results} />}
        {!error && results.length === 0 && query && (
          <p className="text-gray-500">No users found.</p>
        )}
      </HandleLoading>
    </div>
  );
};

export default Search;
