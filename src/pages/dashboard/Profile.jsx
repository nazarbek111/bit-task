export default function Profile() {
  const user = {
    name: "Nazarbek Kaliyev",
    email: "nazarbek.kaliyev@narxoz.kz",
    role: "Admin",
    joined: "March 2024",
    tasksCompleted: 134,
    tasksActive: 9,
  };

  return (
    <div className="dashboardSection">
      <h2>Profile</h2>
      <div className="profileCard">
        <div className="profileAvatar">
          <div className="avatarPlaceholder">{user.name.charAt(0)}</div>
        </div>
        <div className="profileInfo">
          <h3>{user.name}</h3>
          <p className="profileRole">{user.role}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Member since:</strong> {user.joined}</p>
        </div>
      </div>
      <div className="profileStats">
        <div className="statCard">
          <h4>{user.tasksCompleted}</h4>
          <p>Tasks Completed</p>
        </div>
        <div className="statCard">
          <h4>{user.tasksActive}</h4>
          <p>Active Tasks</p>
        </div>
      </div>
    </div>
  );
}
