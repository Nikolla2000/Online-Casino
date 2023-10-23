import React, { useState } from 'react';

const AdminPage = () => {
  const [users ,setUsers] = useState(0)
  return (
    <div className='admin-page-wrapper'>
      <h1>Admin page</h1>
      <article>
        <h3>Users List:</h3>
        {users?.length 
        ? ( <ul>
          {users.map((user, i) => (
            <li key={i + 1}>Name: {user.username}</li>
          ))}
        </ul>
        ) : <p>No users to display</p>}
      </article>
    </div>
  );
};

export default AdminPage;