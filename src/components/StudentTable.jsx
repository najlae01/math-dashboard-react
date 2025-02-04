import React, { useState, useEffect } from "react";
import { getDatabase, ref as dbRef, query, orderByChild, equalTo, get, update } from "firebase/database";
import { app } from "../firebase"; 
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const StudentTable = ({ onFoundPlayer, teacherUID }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const [error, setError] = useState("");

    // Firebase Realtime Database reference
    const db = getDatabase(app);
    const studentsRef = dbRef(db, "players");

    // Fetching student data from Realtime Database
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const snapshot = await get(studentsRef);
                if (snapshot.exists()) {
                    const studentData = snapshot.val();
                    const studentList = Object.keys(studentData)
                        .map((key) => ({
                            id: key,
                            ...studentData[key],
                        }))
                        .filter(
                            (student) =>
                                student.is_authenticated_by_teacher === true &&
                                // student.linked_teacher_id === teacherUID 
                                student.linked_teacher_id === "tempTeacherID" // using the "tempTeacherID" for now
                        ); 
                    
                    setStudents(studentList);
                } else {
                    console.log("No student data found.");
                    setStudents([]);
                }
            } catch (error) {
                console.error("Error fetching student data: ", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchStudents();
    }, [teacherUID]);
    

    if (loading) {
        return <div>Loading students...</div>;
    }

    const handleEdit = async (playerName) => {
        console.log("Editing student with playerName:", playerName);
        try {
            const playerQuery = query(studentsRef, orderByChild("player_name"), equalTo(playerName));
            const snapshot = await get(playerQuery);
            
            if (snapshot.exists()) {
                const playerData = snapshot.val();
                const playerUID = Object.keys(playerData)[0];
                onFoundPlayer(playerData[playerUID], playerUID);
                navigate("/register-student", {
                    state: {
                        playerData: playerData[playerUID],
                        playerUID,
                        teacherUID
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

    const handleDelete = async (playerName) => {
        try {
            const playerQuery = query(studentsRef, orderByChild("player_name"), equalTo(playerName));
            const snapshot = await get(playerQuery);
            
            if (snapshot.exists()) {
                const playerData = snapshot.val();
                const playerUID = Object.keys(playerData)[0];
                const playerRef = dbRef(db, `players/${playerUID}`);  
                await update(playerRef, {
                    is_authenticated_by_teacher: false,
                    linked_teacher_id: null,  
                });
            } else {
                setError("Player not found.");
            }
        } catch (err) {
            console.error("Error fetching player data:", err);
            setError("An error occurred while searching.");
        }
        console.log("Deleting student with ID: ", playerName);
    };

    const handleInfos = (playerName) => {
        // Implement delete logic here
        console.log("See more about the student: ", playerName);
    };

    return (
        <>
            <div className="student-table">
                <h2>Student List</h2>
                <table>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Birth Date</th>
                            <th>Grade</th>
                            <th>Gender</th>
                            <th>Photo</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.player_name}>
                                <td>{student.first_name}</td>
                                <td>{student.last_name}</td>
                                <td>
                                    {student.birthday
                                    ? new Date(student.birthday).toISOString().split("T")[0]
                                    : "N/A"}
                                </td>
                                <td>{student.school_grade}</td>
                                <td>{student.gender}</td>
                                <td>
                                    {student.photo_url ? (
                                        <img
                                            src={student.photo_url}
                                            alt={`${student.first_name} ${student.last_name}`}
                                            width="50"
                                            height="50"
                                        />
                                    ) : (
                                        <span>No Photo</span>
                                    )}
                                </td>
                                <td className="actions">
                                    <button
                                        onClick={() => handleEdit(student.player_name)}
                                        className="icon-button"
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    
                                    {/* Deleting will result on remove the student from the learning analytics analysis (it shouldn't delete the player account or any of the data related to the game only) */}
                                    <button
                                        onClick={() => handleDelete(student.player_name)}
                                        className="icon-button"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                    
                                    {/* <button
                                        onClick={() => handleInfos(student.player_name)}
                                        className="icon-button"
                                    >
                                        <i className="fas fa-info-circle"></i>
                                    </button> */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
            <Link to="/search-student">
                <button>Add Student</button>
            </Link>
        </>
    );
};

export default StudentTable;
