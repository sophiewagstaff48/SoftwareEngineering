import React from "react";

const UserList = ({ users, updateUser, updateCallback }) => {
  const onDelete = async (id) => {
    try {
      const options = {
        method: "DELETE",
      };
      const response = await fetch(
        `http://127.0.0.1:5000/delete_user/${id}`,
        options
      );

      if (response.status === 200) {
        updateCallback();
      } else {
        console.error("Failed to delete user:", await response.json());
        // Optionally handle error in frontend (e.g., display message)
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      // Optionally handle error in frontend (e.g., display message)
    }
  };

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.userName}</td>
              <td>{user.email}</td>
              <td>{user.password}</td>
              <td>
                <button onClick={() => updateUser(user)}>Update</button>
                <button onClick={() => onDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;

// import React from "react";

// function UserList({ users, updateUser, updateCallback }) {
//   const handleDelete = async (id) => {
//     const confirmed = window.confirm("Are you sure you want to delete this user?");
//     if (!confirmed) return;

//     const response = await fetch(`http://localhost:5000/delete_user/${id}`, {
//       method: "DELETE",
//     });

//     if (response.ok) {
//       updateCallback();
//     } else {
//       console.error("Failed to delete user.");
//     }
//   };

//   return (
//     <div>
//       <h2>User Accounts</h2>
//       {users.length === 0 ? (
//         <p>No users found.</p>
//       ) : (
//         <ul>
//           {users.map((user) => (
//             <li key={user.id}>
//               <strong>{user.username}</strong> ({user.email})
//               <button onClick={() => updateUser(user)}>Edit</button>
//               <button onClick={() => handleDelete(user.id)}>Delete</button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default UserList;