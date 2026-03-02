export default function MainContent() {
  return (
    <main className="main">
      <section className="card">
        <h2>Task Manager (Bitrix-style)</h2>
        <p>
          This is the base structure of my semester project. Next weeks I will add
          tasks, statuses, filters, and persistence.
        </p>
      </section>

      <section className="card">
        <h3>MVP for this stage</h3>
        <ul>
          <li>Project structure (components/pages/assets)</li>
          <li>3 functional components</li>
          <li>Basic clean UI styling</li>
        </ul>
      </section>
    </main>
  );
}
