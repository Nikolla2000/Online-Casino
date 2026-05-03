import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AIChatWidget from './AIChatWidget';
import FloatingChatButton from './FloatingChatButton';
import MessageComponent from './MessageComponent';
import ConversationHistory from './ConversationHistory';
import * as chatBotAPI from '../../services/api/chatBotAPI';
import { renderWithProviders } from '../../utils/testUtils';

vi.mock('../../services/api/chatBotAPI');

vi.mock('react-type-animation', () => ({
  TypeAnimation: ({ sequence }) => <span>{sequence[0]}</span>
}));

vi.mock('../Spinner/Spinner', () => ({
  default: () => <div>Loading...</div>
}));

describe('AI Chat Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===========================================
  // FloatingChatButton Tests
  // ===========================================
  describe('FloatingChatButton', () => {
    it('renders the button', () => {
      renderWithProviders(<FloatingChatButton />);
      
      const button = screen.getByRole('button', { name: /ai assistant/i });
      expect(button).toBeInTheDocument();
    });

    it('opens chat when clicked', async () => {
      const user = userEvent.setup();

      const { store } = renderWithProviders(<FloatingChatButton/>);

      const button = screen.getByRole('button', { name: /ai assistant/i });
      await user.click(button);

      expect(store.getState().aiChatbot.showAiChatWidget).toBe(true);
    });
  });

  // ============================================
  // MessageComponent Tests
  // ============================================
  describe('MessageComponent', () => {
    it('renders user message correctly', () => {
      render(
        <MessageComponent 
          message="Hello AI" 
          type="user" 
          timestamp="2024-03-09T10:00:00Z" 
        />
      );

      expect(screen.getByText('Hello AI')).toBeInTheDocument();
    });

    it('renders AI message correctly', () => {
      render(
        <MessageComponent 
          message="Hello user!" 
          type="ai" 
          timestamp="2024-03-09T10:01:00Z" 
        />
      );

      expect(screen.getByText('Hello user!')).toBeInTheDocument();
    });

    it('formats timestamp correctly', () => {
      render(
        <MessageComponent 
          message="Test" 
          type="user" 
          timestamp="2024-03-09T14:30:00Z" 
        />
      );

      const timeElement = screen.getByText(/\d{1,2}:\d{2}/);
      expect(timeElement).toBeInTheDocument();
    });
  });

  // ============================================
  // ConversationHistory Tests
  // ============================================
  describe('ConversationHistory', () => {
    it('shows welcome message when history is empty', () => {
      renderWithProviders(<ConversationHistory />, {
        aiChatbot: { conversationHistory: [] },
        auth: { user: null }
      });

      expect(screen.getByText(/hello fellow traveler/i)).toBeInTheDocument();
    });

    it('shows suggestion chips when history is empty', () => {
      renderWithProviders(<ConversationHistory />, {
        aiChatbot: { conversationHistory: [] },
        auth: { user: null }
      });

      expect(screen.getByText(/what's the best blackjack strategy/i)).toBeInTheDocument();
      expect(screen.getByText(/explain poker rules/i)).toBeInTheDocument();
      expect(screen.getByText(/roulette betting tips/i)).toBeInTheDocument();
    });

    it('displays conversation history when messages exist', () => {
      const mockHistory = [
        {
          _id: '1',
          userMessage: 'How many credits?',
          aiResponse: 'You have 1000 credits',
          timeStamp: '2024-03-09T10:00:00Z'
        }
      ];

      renderWithProviders(<ConversationHistory />, {
        aiChatbot: { conversationHistory: mockHistory },
        auth: { user: { _id: 'user123' } }
      });

      expect(screen.getByText('How many credits?')).toBeInTheDocument();
      expect(screen.getByText('You have 1000 credits')).toBeInTheDocument();
    });
  });

  // ============================================
  // AIChatWidget Tests
  // ============================================
  describe('AIChatWidget', () => {
    it('renders the chat widget', () => {
      renderWithProviders(<AIChatWidget />);

      expect(screen.getByRole('heading', { level: 3, name: /ai casino assistant/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/ask me about games/i)).toBeInTheDocument();
    });

    it('allows user to type message', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AIChatWidget />);

      const input = screen.getByPlaceholderText(/ask me about games/i);
      await user.type(input, 'Hello AI');

      expect(input).toHaveValue('Hello AI');
    });

    it('disables send button when input is empty', () => {
      renderWithProviders(<AIChatWidget />);

      const sendButton = screen.getByRole('button', { name: '' });
      expect(sendButton).toBeDisabled();
    });

    it('enables send button when input has text', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AIChatWidget />);

      const input = screen.getByPlaceholderText(/ask me about games/i);
      await user.type(input, 'Hello');

      const sendButton = screen.getByRole('button', { name: '' });
      expect(sendButton).not.toBeDisabled();
    });

    it('shows quick questions for authenticated users', async () => {
      chatBotAPI.fetchConversationHistory.mockResolvedValue([]);
    
      renderWithProviders(<AIChatWidget />, {
        auth: { 
          user: { _id: 'user123', username: 'testuser' },
          accessToken: 'token'
        },
        aiChatbot: {
          showQuickQuestions: true,
          isLoading: false, 
          conversationHistory: [],
          showAiChatWidget: true,
          isChatbotTyping: false,
          showDeleteConfirm: false
        }
      });

      const question = await screen.findByText(/how many credits do i have/i);
      
      expect(question).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 4, name: /frequently asked questions/i })).toBeInTheDocument();
    });

    it('does not show quick questions menu for guests', () => {
      renderWithProviders(<AIChatWidget />, {
        auth: { user: null, accessToken: null }
      });

      expect(screen.queryByText(/frequently asked questions/i)).not.toBeInTheDocument();
    });

    it('closes chat when close button is clicked', async () => {
      const user = userEvent.setup();
      // const store = configureStore({
      //   reducer: {
      //     aiChatbot: aiChatbotReducer,
      //     auth: authReducer
      //   }
      // });

      // render(
      //   <Provider store={store}>
      //     <AIChatWidget />
      //   </Provider>
      // );

      const { store } = renderWithProviders(<AIChatWidget />)

      const closeButton = screen.getByText('×');
      await user.click(closeButton);

      expect(store.getState().aiChatbot.showAiChatWidget).toBe(false);
    });

    it('shows delete confirmation modal', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AIChatWidget />, {
        aiChatbot: { 
          conversationHistory: [{ userMessage: 'test', aiResponse: 'response' }],
          showDeleteConfirm: false
        }
      });

      const deleteButton = screen.getByTitle(/delete conversation/i);
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument();
      });
    });

    it('shows typing indicator when AI is typing', () => {
      renderWithProviders(<AIChatWidget />, {
        aiChatbot: { isChatbotTyping: true, conversationHistory: [] }
      });

      expect(screen.getByText(/ai is typing/i)).toBeInTheDocument();
    });

    it('clears input after submitting message', async () => {
      const user = userEvent.setup();
      chatBotAPI.promptChatBot.mockResolvedValue({ response: 'AI response' });

      renderWithProviders(<AIChatWidget />, {
        auth: { user: { _id: 'user123' } }
      });

      const input = screen.getByPlaceholderText(/ask me about games/i);
      await user.type(input, 'Test message');
      
      await user.click(screen.getByRole('button', { name: '' }));

      await waitFor(() => {
        expect(input).toHaveValue('');
      });
    });
  });
});