import React, { useEffect, useState, useContext } from 'react';
import './AdminPageStyles.scss';
import axios from '../../axiosConfig';
import { UserContext } from '../../../context/userContext';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { maxCredits } from '../../redux/features/slots/betsSlice';
import { toast } from 'react-hot-toast';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const {user} = useContext(UserContext)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchUsers = async () => {
      if(user.name && user.email === 'nikollla2000@abv.bg'){
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
    } else {
      navigate('/errorPage')
    }};
    if(user) {
      fetchUsers();
    }
  }, [user]);

  const [userId, setUserId] = useState(null)

  const restoreMaxCredits = (id) => {
    setUserId(id)
    dispatch(maxCredits())
    try {
      const {data} = axios.put('/user/updateCredits', { userId: userId, totalCredits: 10000})
      toast.success('Max Credits Restored Successfully!')
    } catch (error) {
      console.log(error);
    }
  }

  const admin = users.find(user => user.email === 'nikollla2000@abv.bg');
  const otherUsers = users.filter(user => user.email !== 'nikollla2000@abv.bg');

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
