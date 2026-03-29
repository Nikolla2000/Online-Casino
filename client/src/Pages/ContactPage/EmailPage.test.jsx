import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmailPage from './EmailPage';
import api from '../../axiosConfig';

vi.mock('../../axiosConfig', () => ({
  default: {
    post: vi.fn()
  }
}));

describe('EmailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields and contact information', () => {
    render(<EmailPage />);
    
    expect(screen.getByText(/Get In/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
    expect(screen.getByText('nikolla.uzunov@gmail.com')).toBeInTheDocument();
  });

  it('shows validation errors when submitting an empty form', async () => {
    const user = userEvent.setup();
    render(<EmailPage />);

    const submitBtn = screen.getByRole('button', { name: /send message/i });
    await user.click(submitBtn);

    expect(await screen.findByText(/First name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Last name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Message is required/i)).toBeInTheDocument();
  });

  it('shows error for invalid email format', async () => {
    const user = userEvent.setup();
    render(<EmailPage />);
    const submitBtn = screen.getByRole('button', { name: /send message/i });
    await user.click(submitBtn);

    const emailInput = screen.getByLabelText(/Email Address/i);
    await user.type(emailInput, 'invalid-email');

    const errorMessage = await screen.findByText(/Invalid email address/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('successfully submits the form and shows success message', async () => {
    const user = userEvent.setup();
    api.post.mockResolvedValue({ data: { success: true } });

    render(<EmailPage />);

    await user.type(screen.getByLabelText(/First Name/i), 'John');
    await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await user.type(screen.getByLabelText(/Email Address/i), 'john@example.com');
    await user.type(screen.getByPlaceholderText(/Tell us how we can help/i), 'Hello, this is a test message');

    const submitBtn = screen.getByRole('button', { name: /send message/i });
    await user.click(submitBtn);

    expect(api.post).toHaveBeenCalledWith('/v1/email/sendEmail', expect.objectContaining({
      firstName: 'John',
      email: 'john@example.com',
      message: 'Hello, this is a test message'
    }));

    expect(await screen.findByText(/Message sent successfully/i)).toBeInTheDocument();
    
    expect(screen.getByLabelText(/First Name/i)).toHaveValue('');
  });

  it('handles API submission error', async () => {
    const user = userEvent.setup();
    //simulate err
    api.post.mockRejectedValue(new Error('Network Error'));

    render(<EmailPage />);

    await user.type(screen.getByLabelText(/First Name/i), 'John');
    await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await user.type(screen.getByLabelText(/Email Address/i), 'john@example.com');
    await user.type(screen.getByLabelText(/Message/i), 'Test message');

    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(api.post).toHaveBeenCalled();
    expect(await screen.findByText(/Failed to send message./i)).toBeInTheDocument();
  });
});
