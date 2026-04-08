export default function Activity() {
  const activities = [
    { id: 1, action: "Completed task", details: "Create React project", time: "2 hours ago" },
    { id: 2, action: "Added new task", details: "Implement routing", time: "5 hours ago" },
    { id: 3, action: "Updated profile", details: "Changed display name", time: "1 day ago" },
    { id: 4, action: "Completed task", details: "Setup project structure", time: "2 days ago" },
    { id: 5, action: "Joined BitTask", details: "Account created", time: "1 week ago" },
  ];

  return (
    <div className="dashboardSection">
      <h2>Activity</h2>
      <p>Recent activity and updates from your account.</p>
      <ul className="activityList">
        {activities.map((activity) => (
          <li key={activity.id} className="activityItem">
            <div className="activityIcon">
              {activity.action.includes("Completed") && "✓"}
              {activity.action.includes("Added") && "+"}
              {activity.action.includes("Updated") && "↻"}
              {activity.action.includes("Joined") && "👤"}
            </div>
            <div className="activityDetails">
              <h4>{activity.action}</h4>
              <p>{activity.details}</p>
              <span className="activityTime">{activity.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
