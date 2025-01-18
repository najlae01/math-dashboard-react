import React, { useState } from "react";
import { getDatabase, ref, update } from "firebase/database";

const UpdateStudentForm = ({ playerData, playerUID, teacherID }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthday: "",
    grade: "",
    gender: "",
    photo: "",
    IsAuthenticatedByTeacher: true,
    LinkedTeacherID: teacherID,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const database = getDatabase();
    const playerRef = ref(database, `players/${playerUID}`);

    try {
      await update(playerRef, formData);
      alert("Student registered successfully!");
    } catch (err) {
      console.error("Error updating player data:", err);
      alert("An error occurred while registering the student.");
    }
  };

  return (
    <div>
      <h2>Update Student Information</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
        />
        <input
          type="date"
          name="birthday"
          value={formData.birthday}
          onChange={handleChange}
        />
        <input
          type="text"
          name="grade"
          placeholder="Grade"
          value={formData.grade}
          onChange={handleChange}
        />
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input
          type="text"
          name="photo"
          placeholder="Photo URL"
          value={formData.photo}
          onChange={handleChange}
        />
        <button type="submit">Register Student</button>
      </form>
    </div>
  );
};

export default UpdateStudentForm;
