import React, { useState, useMemo } from "react";
import { Search, Users, User } from "lucide-react";

const getHighlightedText = (text, highlight) => {
  if (!highlight.trim()) return text;

  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark
            key={i}
            className="bg-yellow-200 font-semibold px-1 rounded"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

export default function SearchList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [isCaseSensitive, setIsCaseSensitive] = useState(false);

  
  const sampleUsers = useMemo(() => {
    const stored = localStorage.getItem("users");
    return stored ? JSON.parse(stored) : [];
  }, []);

  const filteredUsers = useMemo(() => {
    let filtered = [...sampleUsers];

    if (searchQuery.trim()) {
      const query = isCaseSensitive ? searchQuery : searchQuery.toLowerCase();
      filtered = filtered.filter((user) => {
        const nameField = isCaseSensitive ? user.name : user.name.toLowerCase();
        const emailField = isCaseSensitive ? user.email : user.email.toLowerCase();
        return nameField.includes(query) || emailField.includes(query);
      });
    }

    if (sortBy === "match" && searchQuery.trim()) {
      filtered.sort((a, b) => {
        const queryLower = searchQuery.toLowerCase();
        const aIndex = a.name.toLowerCase().indexOf(queryLower);
        const bIndex = b.name.toLowerCase().indexOf(queryLower);

        if (aIndex !== bIndex) {
          return aIndex - bIndex;
        }
        return a.name.localeCompare(b.name);
      });
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [searchQuery, sortBy, isCaseSensitive, sampleUsers]);

  const totalMatches = useMemo(() => {
    if (!searchQuery.trim()) return 0;
    const query = isCaseSensitive ? searchQuery : searchQuery.toLowerCase();
    return sampleUsers.reduce((count, user) => {
      const nameField = isCaseSensitive ? user.name : user.name.toLowerCase();
      const emailField = isCaseSensitive ? user.email : user.email.toLowerCase();
      return nameField.includes(query) || emailField.includes(query)
        ? count + 1
        : count;
    }, 0);
  }, [searchQuery, isCaseSensitive, sampleUsers]);

  return (
    <div className="max-w-full sm:max-w-4xl mx-auto p-4 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Live Search with Highlighting
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Search through registered users (name & email) with real-time filtering
          and highlighting
        </p>
      </div>

  
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="relative mb-4 sm:mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>

   
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-gray-500" />
              <span className="text-gray-700 text-sm sm:text-base">
                Showing {filteredUsers.length} of {sampleUsers.length} users
              </span>
            </div>
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm">
              {totalMatches} match{totalMatches !== 1 ? "es" : ""} found
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              <option value="name">Sort by Name</option>
              <option value="match">Sort by Match</option>
            </select>

            <label className="flex items-center gap-2 cursor-pointer text-sm sm:text-base">
              <input
                type="checkbox"
                checked={isCaseSensitive}
                onChange={(e) => setIsCaseSensitive(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">Case sensitive</span>
            </label>
          </div>
        </div>
      </div>


      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="p-3 sm:p-4 bg-gray-50">
            <div className="flex items-center gap-2 text-gray-700 text-sm sm:text-base">
              <User size={18} />
              <span className="font-medium">Search Results</span>
            </div>
          </div>
        </div>

        {filteredUsers.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredUsers.map((user, index) => (
              <div
                key={index}
                className="p-3 sm:p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-medium text-sm sm:text-base">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-sm sm:text-lg break-words">
                    {getHighlightedText(user.name, searchQuery)}{" "}
                    <span className="text-xs sm:text-sm text-gray-500">
                      ({getHighlightedText(user.email, searchQuery)})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 sm:p-8 text-center text-gray-500">
            {searchQuery.trim() ? (
              <>
                <Search size={36} className="sm:size-48 mx-auto mb-4 text-gray-300" />
                <p className="text-base sm:text-lg">
                  No users found for "{searchQuery}"
                </p>
                <p className="text-xs sm:text-sm mt-2">Try a different search term</p>
              </>
            ) : (
              <>
                <Users size={36} className="sm:size-48 mx-auto mb-4 text-gray-300" />
                <p className="text-base sm:text-lg">Enter a search term to find users</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}