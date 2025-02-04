import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as dbRef, update } from "firebase/database";
import { app } from "../firebase";  

const StudentRegistrationForm = ({ playerData, playerUID, teacherUID }) => {
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
 

  useEffect(() => {
    if (playerData) {
        setFormData({
            firstName: playerData.first_name || "",
            lastName: playerData.last_name || "",
            birthday: playerData.birthday ? new Date(playerData.birthday).toISOString().split("T")[0] : "",
            grade: playerData.school_grade || 1,
            gender: playerData.gender || "",
            photo: null,
            IsAuthenticatedByTeacher: playerData.is_authenticated_by_teacher || false,
            LinkedTeacherID: playerData.linked_teacher_id || "",
        });
      }
      else
      {
        console.error("Error: playerData is undefined, preventing update.");
      }
  }, [playerData]);

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

    try {
        let photoURL = formData.photo_url || ""; // Preserve existing photo URL if no new photo is uploaded
        if (formData.photo) {
            const storageRef = ref(storage, `students/${playerUID || `${formData.firstName}-${formData.lastName}-${Date.now()}`}/${formData.photo.name}`);
            await uploadBytes(storageRef, formData.photo);
            photoURL = await getDownloadURL(storageRef);
        }

        const db = getDatabase(app);
        const playerRef = dbRef(db, `players/${playerUID}`); // Use playerUID for updates

        // Update or create the player
        await update(playerRef, {
            first_name: formData.firstName,
            last_name: formData.lastName,
            birthday: parseDate(formData.birthday),
            school_grade: formData.grade,
            gender: formData.gender,
            photo_url: photoURL,
            is_authenticated_by_teacher: true,
            linked_teacher_id: teacherUID || "tempTeacherID", // Use the actual teacherUID
        });

        alert(playerUID ? "Student updated successfully!" : "Student registered successfully!");
        if (!playerUID) {
          console.error("Error: playerUID is undefined, preventing update.");
            // Reset form only for new registrations
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
        } 
    } catch (error) {
        console.error("Error registering/updating student:", error);
        alert("Failed to register/update student.");
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
      <h2>{playerUID ? "Edit Student" : "Register a New Student"}</h2>
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
            <option value="1">Grade 1</option>
            <option value="2">Grade 2</option>
            <option value="3">Grade 3</option>
            <option value="4">Grade 4</option>
            <option value="5">Grade 5</option>
            <option value="6">Grade 6</option>
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
            {isSubmitting ? "Submitting..." : playerUID ? "Update Student" : "Register Student"}
        </button>
      </form>
    </div>
  );
};

export default StudentRegistrationForm;
