import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import StudentTable from './components/StudentTable'
import TeacherDashboard from './components/TeacherDashboard';

function App() {
  const [studentData, setStudentData] = useState(null);
  const [studentUID, setStudentUID] = useState(null);

  const [teacherUID, setTeacherUID] = useState(null);

  const handleFoundPlayer = (playerData, playerUID) => {
    setStudentData(playerData);
    setStudentUID(playerUID);
    console.log("Player found:", playerData, "Player UID:", playerUID);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Welcome to Mathoria Teacher Dashboard</h1>
          <Routes>
            {/* Route for the StudentTable (default route) */}
            <Route path="/" element={<StudentTable onFoundPlayer={handleFoundPlayer} teacherUID={teacherUID}/>} />

            {/* Route for the Student Registration Form */}
            <Route path="/register-student"
              element={<TeacherDashboard teacherUID={teacherUID} />}
            />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
