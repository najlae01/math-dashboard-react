import React, { useState } from "react";
import SearchStudentForm from "./SearchStudentForm";
import UpdateStudentForm from "./UpdateStudentForm";

const TeacherDashboard = ({ teacherID }) => {
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
        <SearchStudentForm onFoundPlayer={handleFoundPlayer} />
      ) : (
        <UpdateStudentForm
          playerData={studentData}
          playerUID={studentUID}
          teacherID={teacherID}
        />
      )}
    </div>
  );
};

export default TeacherDashboard;
