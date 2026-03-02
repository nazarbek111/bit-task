import React from "react";

function Greeting({ name }) {
  return <h3>Hello, {name}!</h3>;
}

function ProfileCard({ name, profession, image, active }) {
  return (
    <div className="card">
      <img src={image} alt={name} width="120" />
      <h3>{name}</h3>
      <p>{profession}</p>
      <span>{active ? "Active" : "Inactive"}</span>
    </div>
  );
}

function JSXLab() {
  const name = "Nazarbek";
  const year = 2026;
  const age = 20;

  const fruits = ["Apple", "Banana", "Orange"];

  return (
    <>
      {/* Task 1 */}
      <h1>Welcome to JSX Lab</h1>
      <p>This is my JSX practice page.</p>

      {/* Task 2 */}
      <div className="container">
        <h2>JSX Example</h2>
        <p>This is correct JSX</p>
      </div>

      {/* Task 3 – Expressions */}
      <h2>Hello, {name}!</h2>
      <p>Current year: {year}</p>
      <p>5 + 5 = {5 + 5}</p>
      <p>10 &gt; 5 = {10 > 5 ? "true" : "false"}</p>
      <p>Status: {age >= 18 ? "Adult" : "Minor"}</p>

      {/* Logical && operator */}
      {age >= 18 && <p>You are allowed to register.</p>}

      {/* Task 4 – List Rendering */}
      <h2>Fruits List</h2>
      <ul>
        {fruits.map((fruit, index) => (
          <li key={index}>{fruit}</li>
        ))}
      </ul>

      {/* Task 5 – Reusable Component + Props */}
      <Greeting name="Aikumis" />

      {/* Task 6 – Dynamic Card */}
      <ProfileCard
        name="Nazarbek"
        profession="Frontend Developer"
        image="https://via.placeholder.com/120"
        active={true}
      />
    </>
  );
}

export default JSXLab;