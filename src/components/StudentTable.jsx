import React, { useState, useEffect } from "react";
import { getDatabase, ref, get } from "firebase/database"; 
import { app } from "../firebase";
import { Link } from "react-router-dom";

const StudentTable = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Firebase Realtime Database reference
    const db = getDatabase(app);
    const studentsRef = ref(db, "players");

    // Fetching student data from Realtime Database
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const snapshot = await get(studentsRef);
                if (snapshot.exists()) {
                    const studentData = snapshot.val();
                    const studentList = Object.keys(studentData).map((key) => ({
                        id: key,
                        ...studentData[key],
                    }));
                    setStudents(studentList);
                } else {
                    console.log("No student data found.");
                }
            } catch (error) {
                console.error("Error fetching student data: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    if (loading) {
        return <div>Loading students...</div>;
    }

    // Handle Edit and Delete (example placeholders)
    const handleEdit = (id) => {
        // Implement edit logic here
        console.log("Editing student with ID: ", id);
    };

    const handleDelete = (id) => {
        // Implement delete logic here
        console.log("Deleting student with ID: ", id);
    };

    const handleInfos = (id) => {
        // Implement delete logic here
        console.log("See more about the student: ", id);
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
                            <tr key={student.id}>
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
                                        onClick={() => handleEdit(student.id)}
                                        className="icon-button"
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    
                                    {/* Deleting will result on remove the student from the learning analytics analysis (it shouldn't delete the player account or any of the data related to the game only) */}
                                    <button
                                        onClick={() => handleDelete(student.id)}
                                        className="icon-button"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                    
                                    <button
                                        onClick={() => handleInfos(student.id)}
                                        className="icon-button"
                                    >
                                        <i className="fas fa-info-circle"></i>
                                    </button>
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
