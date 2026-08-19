# RenovateAI Project README

## Project Overview

RenovateAI is a technology demonstration project showcasing an AI-assisted lead management and consultation booking system for renovation businesses. The platform automates lead qualification, routing, and follow-up processes using a combination of machine learning, workflow automation, and conversational interfaces. This README focuses on the technical architecture, implementation details, and key features of the system.

---

## Technologies Used

### Frontend

- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS 3.4.14 for utility-first design
- **Routing**: React Router v6 for client-side navigation
- **State Management**: React Hooks (`useState`, `useEffect`, `useRef`)
- **API Communication**: Fetch API for interacting with backend services
- **Build Tools**: Vite 8.2.0 for fast development builds

### Backend & Workflow

- **Workflow Engine**: n8n 1.0+ for automating lead qualification and notification processes
- **Database**: Supabase for real-time data storage and lead management
- **AI Integration**: Gemini API for intelligent lead scoring and qualification
- **Notifications**: Slack webhooks for team alerts on high-priority leads
- **Deployment**: Vercel for frontend hosting

### Infrastructure

- **Operating System**: Windows 11 (development environment)
- **Version Control**: Git with GitHub repository
- **Dependency Management**: npm 8.19.2

---

## Key Features

### 1. AI-Powered Lead Qualification

- **Technical Implementation**:
  - Gemini API analyzes lead data (project type, budget, timeline) to assign a qualification score (0-100)
  - n8n workflow triggers Gemini API calls on form submission or chat interaction
  - Lead records stored in Supabase with metadata including qualification score and reasoning
- **Architecture**:
  - Lead data flows from frontend → n8n → Gemini API → Supabase
  - Real-time updates via Supabase triggers for team notifications

### 2. Conversational Chat Widget

- **Technical Implementation**:
  - React component with state management for message history and lead data
  - Auto-growing textarea using CSS `max-height` and JavaScript scrollHeight calculation
  - WebSocket-like behavior via n8n webhook for message processing
- **UX Features**:
  - Typing indicator animation (bouncing dots)
  - FAQ prompt suggestions
  - Guided-intake flow with state transitions (`faq` → `guided-intake` → `review` → `complete`)

### 3. Automated Workflow Engine

- **n8n Workflow Components**:
  - Lead intake validation (email format, required fields)
  - Gemini API integration for qualification scoring
  - Slack notifications for high-priority leads
  - Email reminders for consultation appointments
- **Data Flow**:
  - Frontend submissions → n8n → Supabase → Slack/Email APIs

### 4. Responsive Design System

- **Technical Implementation**:
  - Tailwind CSS utility classes for responsive layouts
  - Media queries for mobile/desktop breakpoints
  - Reduced motion support via CSS `prefers-reduced-motion` media query
- **Performance**:
  - Code splitting via Vite
  - Optimized image loading (placeholder images in components)

---

## Architecture Diagram

[Diagram: System Architecture - Frontend (React) ↔ n8n Workflows ↔ Supabase ↔ Gemini API]

---

## Usage

### Lead Form Workflow

1. Visitor fills out 8-field form or interacts with chat widget
2. Data validated client-side and sent to n8n
3. Gemini API processes data and assigns qualification score
4. High-scoring leads trigger Slack notifications
5. Qualified leads receive automated follow-up emails

### Chat Widget Interaction

1. User opens chat panel (right sidebar)
2. Conversational flow guides user through intake process
3. System transitions between states based on user input
4. Completed leads are submitted to n8n for processing

---

## Technical Deep Dives

### Chat Widget State Management

```typescript
type ChatState = "faq" | "guided-intake" | "review" | "complete";
const [chatState, setChatState] = useState<ChatState>("faq");
```

- State transitions controlled by `nextAction` from Gemini API responses
- UI updates based on current state (e.g., review screen appears when `chatState === "review"`)

### Lead Validation Logic

```typescript
function validateLeadForm(values: LeadFormData): LeadFormErrors {
  const errors: LeadFormErrors = {};
  if (!values.name.trim()) errors.name = "Name is required.";
  // ... similar checks for other fields
  return errors;
}
```

- Server-side validation also performed by n8n workflow
- Error states displayed with Tailwind CSS utility classes

### n8n Workflow Configuration

- **Nodes Used**:
  - HTTP Request (to Gemini API)
  - Function (for lead scoring logic)
  - Email (for confirmation messages)
  - Slack (for team alerts)

---

## Contributing

### Code Style

- Follow React/TypeScript best practices
- Use ESLint with Prettier configuration
- Commit messages should follow conventional commit format

### Pull Request Guidelines

1. Write tests for new features
2. Update documentation in README
3. Review for TypeScript type safety
4. Ensure accessibility standards are met

---

## Placeholders for Graphics

- [Screenshot: Home Page - Hero Section]
- [Screenshot: Chat Widget - Expanded State]
- [Diagram: Lead Qualification Workflow]
- [Screenshot: Services Page - Service Cards]
- [Diagram: n8n Workflow Nodes]

---

## Deployment

### Frontend

- Deployed to Vercel with custom domain
- Custom environment variables managed via Vercel dashboard

### Backend

- n8n instance hosted on private server
- Supabase database with role-based access control

---

## Known Limitations

1. Gemini API integration is in demonstration mode (no real API key used)
2. n8n workflows require manual configuration for production use
3. Chat widget's auto-growing textarea has height limitations (5 lines max)

---

This README provides a technical overview of the RenovateAI project. For implementation details of specific components, refer to the source code in the `src` directory.
