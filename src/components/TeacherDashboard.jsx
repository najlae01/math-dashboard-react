import React, { useState } from "react";
import StudentCreationForm from "./StudentCreationForm";

const TeacherDashboard = ({ teacherUID }) => {
  return (
    <div>
      <h1>Teacher Dashboard</h1>
        <StudentCreationForm
          teacherUID={teacherUID}
        />
    </div>
  );
};

export default TeacherDashboard;
