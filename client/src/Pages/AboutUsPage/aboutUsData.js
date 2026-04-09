export const TECH_STACK = [
  {
    category: "Frontend",
    icon: "⬡",
    color: "teal",
    items: [
      { name: "React", desc: "Component-based UI architecture for building a dynamic, responsive single-page application with seamless navigation." },
      { name: "SCSS", desc: "Modular, maintainable styling with variables, mixins, and nested rules — keeping the codebase clean at scale." },
      { name: "Socket.IO (client)", desc: "Real-time bidirectional communication layer enabling live chat and live user presence on the client side." },
      { name: "React-Router", desc: "The basic routing library for react for handling seamless client-side navigation and protected route management within the SPA." },
      { name: "Redux/Redux Toolkit", desc: "Very needed for centralized state management for complex state and sharing it accross the components." },
    ],
  },
  {
    category: "Backend",
    icon: "⬡",
    color: "gold",
    items: [
      { name: "Node.js", desc: "Event-driven, non-blocking runtime - ideal for handling many concurrent users and WebSocket connections simultaneously." },
      { name: "Express", desc: "Minimal and flexible web framework providing a clean, well-structured RESTful API with middleware support." },
      { name: "Socket.IO (server)", desc: "Powers the WebSocket layer for real-time direct messaging and live user presence tracking across sessions." },
      { name: "Groq API", desc: "Drives the AI Chat Support assistant, providing lightning-fast LLM inference for in-site guidance and game tips." },
    ],
  },
  {
    category: "Databases",
    icon: "⬡",
    color: "red",
    items: [
      { name: "MongoDB", desc: "Primary database storing users, game sessions, chat messages, and all application data. Its flexible document model is a natural fit for the evolving, nested data structures of a casino platform." },
      { name: "Redis", desc: "In-memory data store used for server-side caching. By caching frequently read data such as user sessions, statistics and game histories, Redis drastically cuts response times and reduces load on MongoDB." },
    ],
  },
  {
    category: "DevOps & Quality",
    icon: "⬡",
    color: "purple",
    items: [
      { name: "Docker", desc: "Frontend and backend are containerised, ensuring a perfectly identical environment across local development, CI runners, and production." },
      { name: "GitHub Actions (CI/CD)", desc: "Automated pipelines run the full test suite and trigger deployments on every push — keeping the project always in a releasable, verified state." },
      { name: "Jest / Testing Library", desc: "Comprehensive unit and integration tests on both frontend and backend protect against regressions as the project evolves." },
      { name: "Swagger", desc: "Auto-generated, interactive API documentation ensures every endpoint is always described, explorable, and up to date." },
      { name: "Rate Limiting", desc: "Protects the API from abuse, brute-force attempts, and denial-of-service scenarios on sensitive endpoints." },
      { name: "Winston Logger", desc: "Structured, levelled server-side logging for full observability, tracing, and production debugging." },
    ],
  },
  {
    category: "Hosting",
    icon: "⬡",
    color: "teal",
    items: [
      { name: "Netlify", desc: "The React frontend is deployed on Netlify with automatic builds and previews triggered by every GitHub push." },
      { name: "Render", desc: "The Node.js API and WebSocket server are hosted on Render, with zero-downtime rolling deploys on each CI/CD run." },
    ],
  },
];

export const FEATURES = [
  { icon: "🎰", title: "Slot Machine", desc: "Fully simulated slot game with authentic reel logic, payline calculations, and win animations." },
  { icon: "🎡", title: "Roulette", desc: "Classic roulette with all standard bet types." },
  { icon: "👤", title: "User Dashboard", desc: "Personal dashboard with detailed play statistics, game history, and account management." },
  { icon: "🖼️", title: "Profile & Avatar", desc: "Upload a profile picture that other players can see, and customise your public profile settings." },
  { icon: "🌐", title: "Public Profiles", desc: "Browse and visit other players' profiles to see their stats and interact with them." },
  { icon: "💬", title: "Direct Messaging", desc: "Private real-time chat between any two users, powered by WebSockets via Socket.IO." },
  { icon: "🟢", title: "Live Users Panel", desc: "See every online player in real time. Message them, view their profile, or block them instantly." },
  { icon: "🤖", title: "AI Chat Support", desc: "An intelligent assistant that helps users navigate the site and offers casino strategy tips. Its utilizing Groq API " },
  { icon: "📧", title: "Contact", desc: "Send a message directly to the developer from within the site." },
  { icon: "💰", title: "10,000 Free Credits", desc: "Every account starts with 10,000 play credits so he can try the games." },
];
