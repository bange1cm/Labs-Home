import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";

interface Activity {
  timestamp: string;
  description: string;
}

const ActivityTable: React.FC = () => {
  const [sortDesc, setSortDesc] = useState(true);

  const [activities] = useState<Activity[]>([
    { timestamp: "2025-10-09T10:15:00", description: "Uploaded Assignment 2" },
    { timestamp: "2025-10-08T16:45:00", description: "Downloaded Assignment 2" },
    { timestamp: "2025-10-07T14:30:00", description: "Restarted Assignment 1" },
  ]);

  const sortedActivities = [...activities].sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();
    return sortDesc ? timeB - timeA : timeA - timeB;
  });

  return (
      <Table bordered hover>
      <thead>
        <tr>
          <th style={{ width: "30%", verticalAlign: "middle" }}>
            <div
              className="d-flex align-items-center justify-content-between"
              style={{ width: "100%" }}
            >
              <span>Timestamp</span>
              <Button
                variant="link"
                className="p-0 m-0"
                onClick={() => setSortDesc(!sortDesc)}
                style={{
                  textDecoration: "underline",
                  fontWeight: 500,
                  color: "var(--bs-primary)",
                  fontSize: "0.9rem",
                }}
              >
                {sortDesc ? "↓" : "↑"}
              </Button>
            </div>
          </th>
          <th>Activity</th>
        </tr>
      </thead>
      <tbody>
        {sortedActivities.map((activity, i) => (
          <tr key={i}>
            <td>{new Date(activity.timestamp).toLocaleString()}</td>
            <td>{activity.description}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ActivityTable;
