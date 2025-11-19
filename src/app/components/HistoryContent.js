// components/HistoryContent.js
"use client";
export default function HistoryContent() {
  return (
    <div>
      <h2>📜 History Table</h2>
      {/* Example structure for a history table */}
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Action</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2025-11-18</td>
            <td>Login</td>
            <td>Success</td>
          </tr>
          {/* ... more rows */}
        </tbody>
      </table>
    </div>
  );
}