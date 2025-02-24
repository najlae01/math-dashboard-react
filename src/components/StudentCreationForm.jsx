import React, { useState } from "react";
import { auth  } from "../firebase";
import { getDatabase, ref, set } from "firebase/database";
import { createUserWithEmailAndPassword } from "firebase/auth";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";

const StudentCreationForm = ({ teacherUID }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthday: "",
    grade: "",
    gender: "",
    LinkedTeacherID: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrCodeURL, setQrCodeURL] = useState(""); 
 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, "password");
      const studentUID = userCredential.user.uid;

      const db = getDatabase();
      const studentRef = ref(db, 'players/' + studentUID);

        // create the player
        set(studentRef, {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            birthday: parseDate(formData.birthday),
            school_grade: convertToInt(formData.grade),
            gender: formData.gender,
            linked_teacher_id: teacherUID || "tempTeacherID", // Use the actual teacherUID
            uid: studentUID,
        });

        //  Generate the QR code text with the student UID
        const codeText = `${studentUID}`;

        // Set the QR code Text for rendering the QR code
        setQrCodeURL(codeText);

        // Generate the PDF with the QR code
        generatePDF(codeText);

        alert("Student registered successfully!");

            // Reset form only for new registrations
            setFormData({
              firstName: "",
              lastName: "",
              email: "",
              birthday: "",
              grade: "",
              gender: "",
              LinkedTeacherID: "",
          });
          
      } catch (error) {
          console.error("Error registering student:", error.message);
  
          if (error.code === "auth/email-already-in-use") {
              alert("This email is already registered. Try logging in instead.");
          } else {
              alert("Failed to register student. Please try again.");
          }
      } finally {
          setIsSubmitting(false);
      }
  };

    // Convert birthday string to a Date object
    const parseDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString();
      };

    const convertToInt = (schoolGradeString) => {
      return parseInt(schoolGradeString);
    };

    
     // Function to generate the PDF
     const generatePDF = (codeText) => {
        QRCode.toDataURL(codeText, (err, url) => {
          if (err) {
            console.error("Erreur lors de la génération du QR code:", err);
            return;
          }
      
          const doc = new jsPDF();
      
          // Ajouter le titre
          doc.setFontSize(16);
          doc.text("Code QR de connexion de l'étudiant", 20, 20);
      
          // Ajouter les informations de l'étudiant
          doc.setFontSize(12);
          doc.text(`Prénom : ${formData.firstName}`, 20, 30);
          doc.text(`Nom : ${formData.lastName}`, 20, 40);
          doc.text(`Classe : ${formData.grade}`, 20, 50);
          doc.text(`Email : ${formData.email}`, 20, 60);
          doc.text(`Date de naissance : ${formData.birthday}`, 20, 70);
          doc.text(`Sexe : ${formData.gender}`, 20, 80);
      
          // Ajouter un texte explicatif
          doc.text("Scannez le code QR ci-dessous pour vous connecter au jeu :", 20, 100);
      
          // Ajouter l'image du QR code au PDF
          doc.addImage(url, "PNG", 20, 110, 100, 100); // Position et taille du QR code
      
          // Générer le nom du fichier PDF en utilisant les informations de l'étudiant
          const filename = `etudiant-${formData.firstName}-${formData.lastName}-Classe${formData.grade}.pdf`;
      
          // Sauvegarder le PDF avec le nom dynamique
          doc.save(filename);
        });
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
          <label>Email</label>
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={formData.email}
            onChange={handleChange} 
            required />        
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

        <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Register Student"}
        </button>
      </form>

    </div>
  );
};

export default StudentCreationForm;
