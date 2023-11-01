import React, { useEffect, useState } from 'react';
import './AdminPageStyles.scss';
import axios from '../../axiosConfig';

const AdminPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      let isMounted = true;
      const controller = new AbortController();

      try {
        const response = await axios.get('user/allUsers', {
          signal: controller.signal,
        });

        if (isMounted) {
          setUsers(response.data);
        }
      } catch (error) {
        console.error(error);
      }

      return () => {
        isMounted = false;
        controller.abort();
      };
    };

    fetchUsers();
  }, []);

  return (
    <div className='admin-page-wrapper'>
      <h1>Admin page</h1>
      <article>
        <h3>Users List: <strong>{users.length}</strong> registered users</h3>
        {users.length ? (
          <table className='w-full border border-collapse border-gray-300 text-center'>
            <thead>
              <tr>
                <th className='p-2 border'>Name</th>
                <th className='p-2 border'>Username</th>
                <th className='p-2 border'>Email</th>
                <th className='p-2 border'>Country</th>
                <th className='p-2 border'>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={i + 1}>
                  <td className='p-2 border'>{user.firstName} {user.lastName}</td>
                  {Object.entries(user).map(([key, value], j) => {
                    if (
                      key !== '_id' && 
                      key !== 'firstName' && 
                      key !== 'lastName' &&
                      key !== 'password' && 
                      key !== 'registrationDate' &&
                      key !== '__v') {
                      return (
                        <td key={j + 1} className='p-2 border'>{value}</td>
                      );
                    }
                    return null;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users to display</p>
        )}
      </article>
    </div>
  );
};

export default AdminPage;
