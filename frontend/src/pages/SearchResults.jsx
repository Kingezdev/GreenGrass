// pages/SearchResults.jsx
import React from "react";
import { Link } from "react-router-dom";

const SearchResults = ({ results }) => {
  if (!results || results.length === 0) return <p>No results found.</p>;

  return (
    <div className="grid gap-4">
      {results.map((user) => (
        <div
          key={user.id}
          className="p-4 bg-white shadow-md rounded-md flex justify-between items-center"
        >
          <div>
            <p className="font-bold">{user.full_name || user.username}</p>
            <p className="text-gray-500">@{user.username}</p>
          </div>
          <Link
            to={`/profile/${user.username}`}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            View Profile
          </Link>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
