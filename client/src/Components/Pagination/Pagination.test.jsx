import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from './Pagination';

describe('Pagination Component', () => {
  const onPageChangeMock = vi.fn();

  it('returns null if totalPages is 1 or less', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={onPageChangeMock} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders all page numbers when totalPages is small (e.g., 3)', () => {
    render(<Pagination currentPage={1} totalPages={3} onPageChange={onPageChangeMock} />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.queryByText('...')).not.toBeInTheDocument();
  });

  it('shows ellipsis correctly when on the first few pages', () => {
    render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChangeMock} />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('...')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.queryByText('5')).not.toBeInTheDocument();
  });

  it('shows ellipsis correctly when in the middle of pages', () => {
    render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChangeMock} />);
    
    const dots = screen.getAllByText('...');
    expect(dots).toHaveLength(2);
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('disables "Previous" on first page and "Next" on last page', () => {
    const { rerender } = render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChangeMock} />
    );
    expect(screen.getByText(/Previous/i)).toBeDisabled();
    expect(screen.getByText(/Next/i)).not.toBeDisabled();

    rerender(<Pagination currentPage={5} totalPages={5} onPageChange={onPageChangeMock} />);
    expect(screen.getByText(/Previous/i)).not.toBeDisabled();
    expect(screen.getByText(/Next/i)).toBeDisabled();
  });

  it('calls onPageChange with correct page number', async () => {
    const user = userEvent.setup();
    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChangeMock} />);

    await user.click(screen.getByText('4'));
    expect(onPageChangeMock).toHaveBeenCalledWith(4);

    await user.click(screen.getByText(/Next/i));
    expect(onPageChangeMock).toHaveBeenCalledWith(3);
  });
});
