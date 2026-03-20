import { describe, it, expect, vi } from 'vitest';
import OpenBlockButton from './OpenBlockButton';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('OpenBlockButton Component', () => {
    it('renders "Block" if user is not blocked', () => {
        const mockSetShowBlockConfirm = vi.fn();

        render(
            <OpenBlockButton
                setShowBlockConfirm={mockSetShowBlockConfirm}
                isBlocked={false}
            />
        );

        const btn = screen.getByRole('button');
        expect(btn).toHaveTextContent('Block');
    });

    it('renders "Unblock" if user is blocked', () => {
        const mockSetShowBlockConfirm = vi.fn();

        render(
            <OpenBlockButton
                setShowBlockConfirm={mockSetShowBlockConfirm}
                isBlocked={true}
            />
        );

        const btn = screen.getByRole('button');
        expect(btn).toHaveTextContent('Unblock');
    });

    it('applies "block" css class when user is not blocked', () => {
        const mockSetShowBlockConfirm = vi.fn();

        render (
            <OpenBlockButton
                setShowBlockConfirm={mockSetShowBlockConfirm}
                isBlocked={false}
            />   
        );

        const btn = screen.getByRole('button');
        expect(btn).toHaveClass('block');
        expect(btn).not.toHaveClass('unblock');
    });
    it('applies "unblock" css class when user is not blocked', () => {
        const mockSetShowBlockConfirm = vi.fn();

        render (
            <OpenBlockButton
                setShowBlockConfirm={mockSetShowBlockConfirm}
                isBlocked={true}
            />   
        );

        const btn = screen.getByRole('button');
        expect(btn).toHaveClass('unblock');
        expect(btn).not.toHaveClass('block');
    });

    it('calls setShowBlockConfirm with true when clicked', async () => {
        const mockSetShowBlockConfirm = vi.fn();
        const user = userEvent.setup();

        render(
            <OpenBlockButton 
                setShowBlockConfirm={mockSetShowBlockConfirm} 
                isBlocked={false} 
            />
        );

        const btn = screen.getByRole('button');
        await user.click(btn);

        expect(mockSetShowBlockConfirm).toHaveBeenCalledTimes(1);
        expect(mockSetShowBlockConfirm).toHaveBeenCalledWith(true);
    })
})