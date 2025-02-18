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


    const handleDelete = async (uid) => {
        try {
            const playerRef = dbRef(db, `players/${uid}`);  
            await update(playerRef, {
                linked_teacher_id: null,  
            });
        } catch (err) {
            console.error("Error fetching player data:", err);
            setError("An error occurred while searching.");
        }
        console.log("Deleting student with ID: ", uid);
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
                            {/* <th>Photo</th> */}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.uid}>
                                <td>{student.first_name}</td>
                                <td>{student.last_name}</td>
                                <td>
                                    {student.birthday
                                    ? new Date(student.birthday).toISOString().split("T")[0]
                                    : "N/A"}
                                </td>
                                <td>{student.school_grade}</td>
                                <td>{student.gender}</td>

                                <td className="actions">  
                                    {/* Deleting will result on remove the student from the learning analytics analysis (it shouldn't delete the player account or any of the data related to the game only) */}
                                    <button
                                        onClick={() => handleDelete(student.uid)}
                                        className="icon-button"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
            <Link to="/register-student">
                <button>Add Student</button>
            </Link>
        </>
    );
};

export default StudentTable;
