import React from "react";

const AdminPropertyTable = ({ properties, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">Title</th>
            <th>Type</th>
            <th>Place</th>
            <th>Rooms</th>
            <th>Price (CHF)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((p) => (
            <tr key={p._id} className="border-b">
              <td className="py-2">{p.title}</td>
              <td>{p.type}</td>
              <td>{p.place}</td>
              <td>{p.rooms}</td>
              <td>{p.totalPrice}</td>
              <td>
                <button
                  onClick={() => onEdit(p)}
                  className="text-blue-600 hover:underline mr-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(p._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPropertyTable;
