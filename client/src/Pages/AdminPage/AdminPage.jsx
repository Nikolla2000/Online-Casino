import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [users ,setUsers] = useState(0)

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axios.get('/users', {
          signal: controller.signal
        });
        console.log(response.data);
        isMounted && setUsers(response.data)
      } catch (error) {
        console.error(error);
      }
    }

    getUsers();

    return () => {
      isMounted = false;
      controller.abort();
    }
  }, [])
  
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