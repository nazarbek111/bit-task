export default function Overview() {
  return (
    <div className="dashboardSection">
      <h2>Dashboard Overview</h2>
      <p>Welcome back! Here is a summary of your account.</p>
      
      <div className="overviewGrid">
        <div className="overviewCard">
          <h3>Total Tasks</h3>
          <p className="overviewNumber">50</p>
        </div>
        <div className="overviewCard">
          <h3>Completed</h3>
          <p className="overviewNumber">42</p>
        </div>
        <div className="overviewCard">
          <h3>Active</h3>
          <p className="overviewNumber">8</p>
        </div>
        <div className="overviewCard">
          <h3>Completion Rate</h3>
          <p className="overviewNumber">84%</p>
        </div>
      </div>

      <div className="quickActions">
        <h3>Quick Actions</h3>
        <div className="actionButtons">
          <button className="actionBtn">Add New Task</button>
          <button className="actionBtn">View Reports</button>
          <button className="actionBtn">Export Data</button>
        </div>
      </div>
    </div>
  );
}
