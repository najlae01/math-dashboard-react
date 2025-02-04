import React, { useState } from "react";
import SearchStudentForm from "./SearchStudentForm";
import StudentRegistrationForm from "./StudentRegistrationForm";

const TeacherDashboard = ({ teacherUID }) => {
  const [studentData, setStudentData] = useState(null);
  const [studentUID, setStudentUID] = useState(null);

  const handleFoundPlayer = (playerData, playerUID) => {
    setStudentData(playerData);
    setStudentUID(playerUID);
  };

  return (
    <div>
      <h1>Teacher Dashboard</h1>
      {!studentData ? (
        <SearchStudentForm onFoundPlayer={handleFoundPlayer}  />
      ) : (
        <StudentRegistrationForm
          playerData={studentData}
          playerUID={studentUID}
          teacherUID={teacherUID}
        />
      )}
    </div>
  );
};

export default TeacherDashboard;
