import React, { useEffect, useState } from "react";
import axios from "axios";

interface GitHubStatsProps {
  darkMode: boolean;
}

export const GithubStats: React.FC<GitHubStatsProps> = ({ darkMode }) => {
  const [commitCount, setCommitCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get("/api/github-stats");
        setCommitCount(response.data.commitCount);
      } catch (error) {
        setError("Failed to fetch GitHub stats. Please try again later.");
      }
    };

    getData();
  }, []);

  return (
    <div
      className={`my-4 rounded border-2 p-4 shadow-lg ${
        darkMode
          ? "bg-gradient-to-r from-indigo-800 via-pink-900 to-purple-800"
          : "bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500"
      }`}
    >
      <p
        className={`text-shadow text-3xl font-semibold ${
          darkMode ? "text-white" : "text-black"
        }`}
      >
        GitHub Stats
      </p>
      {error ? (
        <p
          className={`text-2xl mt-2 ${darkMode ? "text-white" : "text-black"}`}
        >
          {error}
        </p>
      ) : commitCount !== null ? (
        <p
          className={`text-2xl mt-2 ${darkMode ? "text-white" : "text-black"}`}
        >
          Commits this year: {commitCount}
        </p>
      ) : (
        <p
          className={`text-2xl mt-2 ${darkMode ? "text-white" : "text-black"}`}
        >
          Loading...
        </p>
      )}
    </div>
  );
};
