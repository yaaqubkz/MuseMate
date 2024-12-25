import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import "../style/App.css";

const Notebook = () => {
  const [songs, setSongs] = useState([]);
  const [activeSongIndex, setActiveSongIndex] = useState(null); // Track which song's details are displayed
  const { user } = useUser();
  const userId = user?.emailAddresses[0]?.emailAddress;

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch(
          `http://localhost:3232/getsonghistory?userId=${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          setSongs(data);
        } else {
          console.error("Failed to fetch song history");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchSongs();
  }, [userId]);

  const handleSongClick = (index) => {
    // Toggle the active song: show details if it's not active, hide if it's active
    setActiveSongIndex((prevActiveSongIndex) =>
      prevActiveSongIndex === index ? null : index
    );
  };

  return (
    <div>
      <h2>Your Songs</h2>
      <ul>
        {songs.map((song, index) => (
          <li key={index}>
            <button onClick={() => handleSongClick(index)}>{song.title}</button>

            {/* Only display song details for the clicked song */}
            {activeSongIndex === index && (
              <div className="song-details">
                <h3>Chords</h3>
                <pre>{song.chords}</pre>
                <h3>Lyrics</h3>
                <pre>{song.lyrics}</pre>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notebook;
