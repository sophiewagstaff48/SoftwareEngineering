import { useState, useEffect } from "react";
//import ContactList from "./ContactList";
import "./App.css";
//import ContactForm from "./ContactForm";
import ImageSearch from "./ImageSearch";
import Login from "./Login";
import Register from "./Register";


function App() {
  //const [contacts, setContacts] = useState([]);
  //const [users, setUsers] = useState([]);
  //const [isModalOpen, setIsModalOpen] = useState(false);
  //const [currentContact, setCurrentContact] = useState({});
  //const [currentUser, setCurrentUser] = useState({});
  const [activeTab, setActiveTab] = useState('register');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = async () => {
    await fetch("http://localhost:5000/logout", {
      method: "POST", 
      credentials: "include"
    });
    setIsLoggedIn(false);
    setActiveTab("login");
  };

  return (
    <>
      {isLoggedIn && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <div>
              <button onClick={() => setActiveTab("images")}>Image Search</button>

            </div>
            <button onClick={handleLogout}>Logout</button>
          </div>

          {activeTab === "images" && <ImageSearch />}

        </>
      )}
      {activeTab === "register" && (
        <Register setActiveTab={setActiveTab} />
      )}

      {activeTab === "login" && (
        <Login setActiveTab={setActiveTab} setIsLoggedIn={setIsLoggedIn}/>
      )}

    </>
  );
}

export default App;
  // return (
  //   <div className="app-container">
  //     <nav className="navbar">
  //       <h1 className="app-title">Media Search App</h1>
  //       <div className="nav-buttons">
  //         {!isLoggedIn ? (
  //           <>
  //             <button
  //               className={`nav-button ${activeTab === "login" ? "active" : ""}`}
  //               onClick={() => setActiveTab("login")}
  //             >
  //               Login
  //             </button>
  //             <button
  //               className={`nav-button ${activeTab === "register" ? "active" : ""}`}
  //               onClick={() => setActiveTab("register")}
  //             >
  //               Register
  //             </button>
  //           </>
  //         ) : (
  //           <>
  //             <button className="nav-button" onClick={handleLogout}>
  //               Logout
  //             </button>
  //           </>
  //         )}
  //       </div>
  //     </nav>

  //     <div className="content">
  //       {!isLoggedIn && activeTab === "login" && (
  //         <Login setActiveTab={setActiveTab} setIsLoggedIn={setIsLoggedIn} />
  //       )}
  //       {!isLoggedIn && activeTab === "register" && (
  //         <Register setActiveTab={setActiveTab} />
  //       )}
  //       {isLoggedIn && (
  //         <div className="logged-in-message">
  //           <h2>Welcome! You are now logged in.</h2>
  //           {/* Replace with your actual authenticated content */}
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );

  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  // const fetchContacts = async () => {
  //   //const response = await fetch("http://127.0.0.1:5000/contacts");
  //   const response = await fetch("http://localhost:5000/contacts");
  //   const data = await response.json();
  //   setContacts(data.contacts);
  //   console.log(data.contacts);
  // };

  // const fetchUsers = async () => {
  //   const response = await fetch("http://localhost:5000/users");
  //   const data = await response.json();
  //   setUsers(data.users);
  // };


  // const closeModal = () => {
  //   setIsModalOpen(false);
  //   //setCurrentContact({});
  //   setCurrentUser({});
  // }

  // const openCreateModal = () => {
  //   setIsModalOpen(true);
  // }

  // const openEditModal = (user) => {
  //   setCurrentUser(user);
  //   setIsModalOpen(true);
  // }

  // const onUpdate = () => {
  //   closeModal();
  //   fetchUsers();
  // }

  // return (
  //   <>
  //      <div className="tab-buttons">
  //       <button 
  //         className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
  //         onClick={() => setActiveTab('users')}
  //       >
  //         Users
  //       </button>
  //       <button 
  //         className={`tab-button ${activeTab === 'images' ? 'active' : ''}`}
  //         onClick={() => setActiveTab('images')}
  //       >
  //         Image Search
  //       </button>
  //     </div>

  //     {activeTab === 'users' && (
  //       <div className="users-tab">
  //         <UserList users={users} updateUser={openEditModal} updateCallback={onUpdate}/>
  //         <button onClick={openCreateModal}>Create New User</button>
  //         {isModalOpen && (
  //           <div className="modal">
  //             <div className="modal-content">
  //               <span className="close" onClick={closeModal}>&times;</span>
  //               <UserForm existingUser={currentUser} updateCallback={onUpdate}/>
  //             </div>
  //           </div>
  //         )}
  //       </div>
  //     )}

  //     {activeTab === 'images' && (
  //       <div className="images-tab">
  //         <ImageSearch />
  //       </div>
  //     )}
      
  //   </>
  // );

  // return (
  //   <>
  //      <div className="tab-buttons">
  //       <button 
  //         className={`tab-button ${activeTab === 'contacts' ? 'active' : ''}`}
  //         onClick={() => setActiveTab('contacts')}
  //       >
  //         Contacts
  //       </button>
  //       <button 
  //         className={`tab-button ${activeTab === 'images' ? 'active' : ''}`}
  //         onClick={() => setActiveTab('images')}
  //       >
  //         Image Search
  //       </button>
  //     </div>

  //     {activeTab === 'contacts' && (
  //       <div className="contacts-tab">
  //         <ContactList contacts={contacts} updateContact={openEditModal} updateCallback={onUpdate}/>
  //         <button onClick={openCreateModal}>Create New Contact</button>
  //         {isModalOpen && (
  //           <div className="modal">
  //             <div className="modal-content">
  //               <span className="close" onClick={closeModal}>&times;</span>
  //               <ContactForm existingContact={currentContact} updateCallback={onUpdate}/>
  //             </div>
  //           </div>
  //         )}
  //       </div>
  //     )}

  //     {activeTab === 'images' && (
  //       <div className="images-tab">
  //         <ImageSearch />
  //       </div>
  //     )}
      
  //   </>
  // );
