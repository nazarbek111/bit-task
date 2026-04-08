export default function Services() {
  const services = [
    {
      title: "Task Management",
      description: "Organize your tasks with priorities, assignees, and status tracking.",
    },
    {
      title: "Progress Tracking",
      description: "Visualize your productivity with real-time progress indicators.",
    },
    {
      title: "Search & Filter",
      description: "Quickly find tasks using powerful search and filtering capabilities.",
    },
    {
      title: "Local Storage",
      description: "Your data is saved locally and persists between sessions.",
    },
  ];

  return (
    <div className="page">
      <h1>Our Services</h1>
      <p>Discover the powerful features that make BitTask your perfect productivity companion.</p>
      <div className="servicesGrid">
        {services.map((service, index) => (
          <div key={index} className="serviceCard">
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
