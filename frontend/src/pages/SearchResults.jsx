import React from "react";
import { Link } from "react-router-dom";

const SearchResult = ({ profile }) => {
  return (
    <div className="border rounded-lg shadow p-4 bg-white">
      <h2 className="text-xl font-semibold">{profile.first_name} {profile.last_name}</h2>
      <p className="text-gray-600">@{profile.username}</p>
      <p className="text-gray-700 mt-2">{profile.bio || "No bio available"}</p>

      <Link
        to={`/profile/${profile.username}`}
        className="inline-block mt-3 text-green-600 font-medium hover:underline"
      >
        View Profile
      </Link>
    </div>
  );
};

export default SearchResult;
