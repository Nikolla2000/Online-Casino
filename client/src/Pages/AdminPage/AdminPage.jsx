import React, { useEffect, useState, useContext } from 'react';
import './AdminPageStyles.scss';
import api from '../../axiosConfig';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { maxCredits } from '../../redux/features/slots/slotMachineSlice';
import { toast } from 'react-hot-toast';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const { user, accessToken } = useSelector(state => state.auth);
  const adminUser = import.meta.env.VITE_ADMIN_USER_EMAIL;
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchUsers = async () => {
      if(user && user.email === adminUser){
      let isMounted = true;
      const controller = new AbortController();

      try {
        const res = await api.get('/v2/users/', {
          signal: controller.signal,
        });

        if (isMounted) {
          setUsers(res.data);
        }
      } catch (error) {
        console.error(error);
      }
      return () => {
        isMounted = false;
        controller.abort();
      };
    }};
    if(user) {
      fetchUsers();
    }
  }, [user]);

  const [userId, setUserId] = useState(null)

  const restoreMaxCredits = async (id) => {
    setUserId(id)
    dispatch(maxCredits())
    try {
      await api.put(`/v1/user/${userId}/updateCredits`, { totalCredits: 10000})
      toast.success('Max Credits Restored Successfully!')
    } catch (error) {
      console.log(error);
    }
  }

  const admin = users.find(user => user.email === adminUser);
  const otherUsers = users.filter(user => user.email !== adminUser);

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
              {admin && (
                <tr>
                  <td className='p-2 border'>{admin.firstName} {admin.lastName}</td>
                  <td className='p-2 border'>{admin.username}</td>
                  <td className='p-2 border'>{admin.email}</td>
                  <td className='p-2 border'>{admin.country}</td>
                  <td className='p-2 border'>{admin.phoneNumber}</td>
                  <td className='p-2 border font-bold'>
                    <button onClick={() => restoreMaxCredits(admin._id)}>Add 10000 Credits</button>
                  </td>
                </tr>
              )}
              {otherUsers.map((user, i) => (
                <tr key={i + 1}>
                  <td className='p-2 border'>{user.firstName} {user.lastName}</td>
                  <td className='p-2 border'>{user.username}</td>
                  <td className='p-2 border'>{user.email}</td>
                  <td className='p-2 border'>{user.country}</td>
                  <td className='p-2 border'>{user.phoneNumber}</td>
                  <td className='p-2 border font-bold'>
                    <button onClick={() => restoreMaxCredits(user._id)}>Add 10000 Credits</button>
                  </td>           
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
