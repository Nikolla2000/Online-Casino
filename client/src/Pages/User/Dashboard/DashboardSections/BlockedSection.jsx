import { useSelector } from 'react-redux';
import { useGetBlockedUsers } from '../../../../hooks/useGetBlockedUsers';
import LoadingSpinner from '../../../../Components/Spinner/Spinner';
import BlockedUser from '../BlockedUser';
import './BlockedSectionStyles.scss';


const BlockedSection = () => {
    const { user } = useSelector(state => state.auth);
    const { data: blockedUsersData, isLoading: isLoadingBlocked, error } = useGetBlockedUsers(user._id);
    
    return (
        <div className="content-section blocked-section">
            <div className="section-header">
                <h3>Blocked Users</h3>
            </div>

            {isLoadingBlocked ? (
                <div className="blocked-loading">
                    <LoadingSpinner />
                    <p>Loading blocked users...</p>
                </div>
            ) : error ? (
                <div className="blocked-error">
                    <div className="error-icon">❌</div>
                    <h4>Failed to load blocked users</h4>
                    <p>Please try refreshing the page</p>
                </div>
            ) : !blockedUsersData || blockedUsersData.length === 0 ? (
                <div className="blocked-empty">
                    <div className="empty-icon">👥</div>
                    <h4>No blocked users</h4>
                    <p>You haven't blocked anyone yet</p>
                </div>
            ) : (
                <div className='blocked-users-list'>
                    {blockedUsersData.map((blockedUser) => (
                        <BlockedUser
                            key={blockedUser._id}
                            blockedUser={{
                                ...blockedUser.blockedId, 
                                createdAt: blockedUser.createdAt 
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default BlockedSection;