export default function About() {
  return (
    <div className="page">
      <h1>About Us</h1>
      <p>
        BitTask is a modern task management application designed to help you stay organized
        and productive. Built with React and love, our platform provides simple yet
        powerful tools for managing your daily tasks, priorities, and progress.
      </p>
      <div className="aboutCards">
        <div className="aboutCard">
          <h3>Our Mission</h3>
          <p>To simplify task management for everyone, everywhere.</p>
        </div>
        <div className="aboutCard">
          <h3>Our Vision</h3>
          <p>A world where productivity is effortless and accessible.</p>
        </div>
        <div className="aboutCard">
          <h3>Our Values</h3>
          <p>Simplicity, efficiency, and user-centric design.</p>
        </div>
      </div>
    </div>
  );
}
