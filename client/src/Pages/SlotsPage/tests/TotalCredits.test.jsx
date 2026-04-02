import { describe, it, expect, vi, beforeEach } from 'vitest';
import TotalCredits from "../Gadgets/TotalCredits";
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/testUtils';

vi.mock('../../../services/api/userAPI.js');

describe('Total credits tests', () => {
    it('should display total credits if there is an authenticated user', () => {
        renderWithProviders(<TotalCredits/>, {
            slotMachine: {
                totalCredits: 1500,
            },
            auth: { user: { _id: 'someid123' }, accessToken: 'valid-token' }
        });

        expect(screen.getByText(/1500/i)).toBeInTheDocument();
    });

    it('should have winning class if isWinning is true', () => {
        const { container } = renderWithProviders(<TotalCredits/>, {
            slotMachine: {
                isWinning: true
            },
            auth: { user: { _id: 'someid123' }, accessToken: 'valid-token' }
        });

        const element = container.querySelector('.credits-value')
        expect(element).toHaveClass('winning');
    });
})