export default function Header() {
  return (
    <header className="header">
      <div>
        <h1 className="logo">BitTask</h1>
        <p className="headerSub">Task flow for student sprint work</p>
      </div>
      <nav className="nav">
        <a href="/">Dashboard</a>
        <a href="/#board">Tasks</a>
      </nav>
    </header>
  );
}
