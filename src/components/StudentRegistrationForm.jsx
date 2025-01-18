import React, { useState } from "react";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as dbRef, update } from "firebase/database";
import { app } from "../firebase"; 

const StudentRegistrationForm = ({ playerData, playerUID }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthday: "",
    grade: "",
    gender: "",
    photo: null,
    IsAuthenticatedByTeacher: false,
    LinkedTeacherID: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const studentId = `${formData.firstName}-${formData.lastName}-${Date.now()}`;

    try {
        let photoURL = "";
        if (formData.photo) {
            const storageRef = ref(storage, `students/${studentId}/${formData.photo.name}`);
            await uploadBytes(storageRef, formData.photo);
            photoURL = await getDownloadURL(storageRef);
        }

        const db = getDatabase(app);
        const playerRef = dbRef(db, `players/${playerUID}`);

        // Update only the provided fields
        await update(playerRef, {
            firstName: formData.firstName,
            lastName: formData.lastName,
            birthday: parseDate(formData.birthday),
            grade: formData.grade,
            gender: formData.gender,
            photoURL: photoURL,
            IsAuthenticatedByTeacher: true,
            LinkedTeacherID: "tempTeacherID",
        });

        alert("Student registered successfully!");
        setFormData({
            firstName: "",
            lastName: "",
            birthday: "",
            grade: "",
            gender: "",
            photo: null,
            IsAuthenticatedByTeacher: false,
            LinkedTeacherID: "",
        });
        } catch (error) {
        console.error("Error registering student:", error);
        alert("Failed to register student.");
        } finally {
        setIsSubmitting(false);
        }
    };

    // Convert birthday string to a Date object
    const parseDate = (dateString) => {
        return new Date(dateString); // Convert the string to a Date object
      };

  return (
    <div className="student-registration-form">
      <h2>Register a New Student</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Birth Date</label>
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Grade</label>
          <select
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            required
          >
            <option value="">Select Grade</option>
            <option value="Grade 1">Grade 1</option>
            <option value="Grade 2">Grade 2</option>
            <option value="Grade 3">Grade 3</option>
          </select>
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className="form-group">
          <label>Photo</label>
          <input type="file" onChange={handleFileChange} />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Register Student"}
        </button>
      </form>
    </div>
  );
};

export default StudentRegistrationForm;
