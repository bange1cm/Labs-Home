import React, { useState, useEffect } from "react";
import { Table, Button, Spinner } from "react-bootstrap";
import { useActivityLog} from "../hooks/useActivityLog";

const ActivityTable: React.FC = () => {
  const { activities, loadActivities, loading } = useActivityLog();
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    loadActivities(); // Load activities when page loads
  }, []);

  //sort activities by timestamp 
  const sortedActivities = [...activities].sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();
    return sortDesc ? timeB - timeA : timeA - timeB;
  });

  //loading spinner
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-3">
        <Spinner animation="border" />
      </div>
    );
  }

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
        {sortedActivities.length === 0 ? (
          <tr>
            <td colSpan={2} className="text-center text-muted">
              No activities yet.
            </td>
          </tr>
        ) : (
          sortedActivities.map((activity, i) => (
            <tr key={i}>
              <td>{new Date(activity.timestamp).toLocaleString()}</td>
              <td>{activity.description}</td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
};

export default ActivityTable;
