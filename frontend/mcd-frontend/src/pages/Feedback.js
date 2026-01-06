import "./PageStyles.css";
import { useState } from "react";

function Feedback() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [visit, setVisit] = useState("");
  const [food, setFood] = useState([]);
  const [timeSlot, setTimeSlot] = useState("");
  const [image, setImage] = useState(null);

  const handleFoodChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setFood([...food, value]);
    } else {
      setFood(food.filter((item) => item !== value));
    }
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("time_slot", timeSlot);
    food.forEach((f) => formData.append("food", f));
    formData.append("image", image);

    try {
      const response = await fetch("http://127.0.0.1:9000/feedback", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Validation failed");
      }

      alert("Thank you for your feedback!");
      e.target.reset();
    } catch (err) {
      alert("Validation failed or server error");
    }
  };

  return (
    <div className="feedback-page">
    <div className="feedback-container">

      <h2>Customer Feedback Form</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>Name:</label><br />
        <input type="text" onChange={(e) => setName(e.target.value)} required /><br /><br />

        <label>Phone Number:</label><br />
        <input type="text" onChange={(e) => setPhone(e.target.value)} required /><br /><br />

        <label>Email:</label><br />
        <input type="email" onChange={(e) => setEmail(e.target.value)} required /><br /><br />

        

        <label>Which Food You Liked?</label><br />
        <input type="checkbox" value="Burger" onChange={handleFoodChange} /> Burger<br />
        <input type="checkbox" value="Fries" onChange={handleFoodChange} /> Fries<br />
        <input type="checkbox" value="Pizza" onChange={handleFoodChange} /> Pizza<br />
        <input type="checkbox" value="McFlurry" onChange={handleFoodChange} /> McFlurry<br />
        <input type="checkbox" value="Nuggets" onChange={handleFoodChange} /> Nuggets<br /><br />

        <label>Preferred Time Slot:</label><br />
        <select onChange={(e) => setTimeSlot(e.target.value)} required>
          <option value="">Select</option>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Evening">Evening</option>
        </select><br /><br />

        <label>Upload Image:</label><br />
        <input
          type="file"
          name="image"
          onChange={handleFileChange}
          required
        /><br /><br />

        <button type="submit" style={{ background: "red", color: "white" }}>
          Submit Feedback
        </button>
      </form>
    </div>
    </div>
  );
}

export default Feedback;
