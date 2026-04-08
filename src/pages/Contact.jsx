import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! We will get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="page">
      <h1>Contact Us</h1>
      <p>Have questions or feedback? We would love to hear from you!</p>
      
      <form onSubmit={handleSubmit} className="contactForm">
        <div className="formGroup">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="formGroup">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div className="formGroup">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            rows="5"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="submitBtn">
          Send Message
        </button>
      </form>

      <div className="contactInfo">
        <h3>Other Ways to Reach Us</h3>
        <p>Email: support@bittask.com</p>
        <p>Phone: +7 (747) 776-5875</p>
        <p>Address: 8 microdistrict 37 house, Almaty, Kazakhstan</p>
      </div>
    </div>
  );
}
