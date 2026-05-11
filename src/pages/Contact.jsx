import { useState } from "react";

const EMPTY = { name: "", email: "", message: "" };

function validate({ name, email, message }) {
    const errors = {};
    if (!name.trim())                        errors.name    = "Name is required.";
    if (!email.trim())                       errors.email   = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        errors.email   = "Enter a valid email address.";
    if (!message.trim())                     errors.message = "Message cannot be empty.";
    else if (message.trim().length < 10)     errors.message = "Message must be at least 10 characters.";
    return errors;
}

export default function Contact() {
    const [formData, setFormData]   = useState(EMPTY);
    const [errors, setErrors]       = useState({});
    const [submitted, setSubmitted] = useState(false);

    const set = (field) => (e) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
        // clear error on change
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate(formData);
        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }
        setSubmitted(true);
        setFormData(EMPTY);
        setErrors({});
    };

    return (
        <div className="page">
            <h1>Contact Us</h1>
            <p>Have questions or feedback? We would love to hear from you!</p>

            {submitted ? (
                <div className="successBanner">
                    ✓ Message sent! We'll get back to you soon.
                    <button
                        className="successBannerClose"
                        onClick={() => setSubmitted(false)}
                    >
                        Send another
                    </button>
                </div>
            ) : (
                <div className="contactForm">
                    <div className="formGroup">
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={set("name")}
                            className={errors.name ? "inputError" : ""}
                            placeholder="e.g. Nazarbek"
                        />
                        {errors.name && <span className="fieldError">{errors.name}</span>}
                    </div>

                    <div className="formGroup">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="text"
                            value={formData.email}
                            onChange={set("email")}
                            className={errors.email ? "inputError" : ""}
                            placeholder="you@example.com"
                        />
                        {errors.email && <span className="fieldError">{errors.email}</span>}
                    </div>

                    <div className="formGroup">
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            rows="5"
                            value={formData.message}
                            onChange={set("message")}
                            className={errors.message ? "inputError" : ""}
                            placeholder="Write your message here..."
                        />
                        {errors.message && <span className="fieldError">{errors.message}</span>}
                    </div>

                    <button className="submitBtn" onClick={handleSubmit}>
                        Send Message
                    </button>
                </div>
            )}

            <div className="contactInfo">
                <h3>Other Ways to Reach Us</h3>
                <p>Email: support@bittask.com</p>
                <p>Phone: +7 (747) 776-5875</p>
                <p>Address: 8 microdistrict 37 house, Almaty, Kazakhstan</p>
            </div>
        </div>
    );
}