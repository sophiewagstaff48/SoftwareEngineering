import { useState } from "react";

const UserForm = ({ existingUser = {}, updateCallback }) => {
  const [userName, setUserName] = useState(existingUser.userName || "");
  const [email, setEmail] = useState(existingUser.email || "");
  const [password, setPassword] = useState(existingUser.password || "");

  const updating = Object.entries(existingUser).length !== 0;

  const onSubmit = async (e) => {
    e.preventDefault();

    const data = {
      userName,
      email,
      password,
    };
    const url =
      "http://127.0.0.1:5000/" +
      (updating ? `update_user/${existingUser.id}` : "create_user");
    const options = {
      method: updating ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, options);
    if (response.status !== 201 && response.status !== 200) {
      const message = await response.json();
      alert(message.message);
    } else {
      updateCallback();
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="userName">User Name:</label>
        <input
          type="text"
          id="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="text"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button type="submit">{updating ? "Update" : "Create"}</button>
    </form>
  );
};

export default UserForm;

// import { useState, useEffect } from "react";

// function UserForm({ existingUser, updateCallback }) {
//   const [user_name, setUserName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   useEffect(() => {
//     if (existingUser && existingUser.id) {
//       setUserName(existingUser.username || "");
//       setEmail(existingUser.email || "");
//       setPassword(""); // don’t prefill password for security
//     }
//   }, [existingUser]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const userData = {
//       user_name,
//       email,
//       password,
//     };

//     const isEdit = existingUser && existingUser.id;

//     const url = isEdit
//       ? `http://localhost:5000/users/${existingUser.id}`
//       : "http://localhost:5000/users";

//     const method = isEdit ? "PUT" : "POST";

//     const response = await fetch(url, {
//       method,
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(userData),
//     });

//     if (response.ok) {
//       updateCallback(); // refresh list and close modal
//     } else {
//       const errorData = await response.json();
//       alert("Error: " + (errorData.error || "Unknown error"));
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="text"
//         placeholder="Username"
//         value={user_name}
//         onChange={(e) => setUserName(e.target.value)}
//         required
//       />
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         required
//       />
//       <button type="submit">{existingUser?.id ? "Update User" : "Create User"}</button>
//     </form>
//   );
// }

// export default UserForm;