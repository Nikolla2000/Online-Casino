import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders, mockUseQuery } from '../../../../utils/testUtils';
import BlockedSection from '../DashboardSections/BlockedSection';
import * as hooks from '../../../../hooks/useGetBlockedUsers';

vi.mock('../../../../hooks/useGetBlockedUsers', () => ({
    useGetBlockedUsers: vi.fn()
}));

describe('BlockedSection Component', () => {
    const mockUser = { _id: 'user123', username: 'tester' };
    const initialState = { auth: { user: mockUser } };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading spinner when data is loading', () => {
        vi.spyOn(hooks, 'useGetBlockedUsers').mockReturnValue(
            mockUseQuery(null, true)
        );

        renderWithProviders(<BlockedSection />, initialState);

        expect(screen.getByText(/Loading blocked users.../i)).toBeInTheDocument();
        expect(document.querySelector('.loader')).toBeDefined();
    });

    it('shows error message when query fails', () => {
        vi.spyOn(hooks, 'useGetBlockedUsers').mockReturnValue(
            mockUseQuery(null, false, true)
        );

        renderWithProviders(<BlockedSection />, initialState);

        expect(screen.getByText(/Failed to load blocked users/i)).toBeInTheDocument();
        expect(screen.getByText(/Please try refreshing/i)).toBeInTheDocument();
    });

    it('shows empty state when there are no blocked users', () => {
        vi.spyOn(hooks, 'useGetBlockedUsers').mockReturnValue(
            mockUseQuery([], false, false)
        );

        renderWithProviders(<BlockedSection />, initialState);

        expect(screen.getByText(/No blocked users/i)).toBeInTheDocument();
        expect(screen.getByText(/You haven't blocked anyone yet/i)).toBeInTheDocument();
    });

    it('renders a list of BlockedUser components when data is available', () => {
        const mockBlockedData = [
            {
                _id: 'block1',
                createdAt: '2023-01-01',
                blockedId: { _id: 'u1', username: 'blocked_user_1', profileImage: '/images/user.png' }
            },
            {
                _id: 'block2',
                createdAt: '2023-02-01',
                blockedId: { _id: 'u2', username: 'blocked_user_2', profileImage: '/images/user.png' }
            }
        ];

        vi.spyOn(hooks, 'useGetBlockedUsers').mockReturnValue(
            mockUseQuery(mockBlockedData, false, false)
        );

        renderWithProviders(<BlockedSection />, initialState);

        expect(screen.getByText('@blocked_user_1')).toBeInTheDocument();
        expect(screen.getByText('@blocked_user_2')).toBeInTheDocument();
        
        const userCards = document.querySelectorAll('.blocked-user-card');
        expect(userCards).toHaveLength(2);
    });

    it('correctly maps the data structure to BlockedUser props', () => {
        const singleUser = [{
            _id: 'block1',
            createdAt: '2024-05-01',
            blockedId: { _id: 'targetId', username: 'targetUser' }
        }];

        vi.spyOn(hooks, 'useGetBlockedUsers').mockReturnValue(
            mockUseQuery(singleUser, false, false)
        );

        renderWithProviders(<BlockedSection />, initialState);

        expect(screen.getByText(/Blocked on/i)).toBeInTheDocument();
    });
});