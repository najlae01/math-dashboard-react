import React, { useState } from "react";
import { getDatabase, ref, query, orderByChild, equalTo, get } from "firebase/database";
import { app } from "../firebase"; 
import { useNavigate } from "react-router-dom";

const SearchStudentForm = ({ onFoundPlayer }) => {
  const [playerName, setPlayerName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    const database = getDatabase(app);
    const playersRef = ref(database, "players");
    const playerQuery = query(playersRef, orderByChild("player_name"), equalTo(playerName));

    try {
      const snapshot = await get(playerQuery);
      if (snapshot.exists()) {
        const playerData = snapshot.val();
        const playerUID = Object.keys(playerData)[0];
        onFoundPlayer(playerData[playerUID], playerUID);
        navigate("/register-student", {
            state: {
              playerData: playerData[playerUID],
              playerUID,
            },
          });
      } else {
        setError("Player not found.");
      }
    } catch (err) {
      console.error("Error fetching player data:", err);
      setError("An error occurred while searching.");
    }
  };

  return (
    <>
        <div>
        <h2>Search Student by Player Name</h2>
        <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter Player Name"
        />
        </div>
        <div>
            <button onClick={handleSearch}>Search</button>
            {error && <p>{error}</p>}
        </div>
    </>
  );
};

export default SearchStudentForm;
