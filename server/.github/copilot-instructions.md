<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Business Tracker Stripe Server Instructions

This is a Node.js/TypeScript backend server for handling Stripe payments and subscriptions for the Business Tracker PWA.

## Key Context:

### Frontend Integration
- The frontend is located at `../subscription.html` and uses Stripe publishable key `pk_live_51NsMhxA1DFzFV9pRzlkLOHee4j7cyeDGQZJfolnsTVH0givjHlcWyP9PYYXrQM7WFnYV8tdkAgrkoyfLnaCMJysB003TUxSuBN`
- Price ID being used: `price_1RmsJyA1DFzFV9pRZIX920UB` (€12.99/month)
- Frontend expects specific API response format for payment intents

### Stripe Configuration
- Uses Stripe API version `2025-06-30.basil`
- Supports subscriptions with 3-day free trial
- Handles webhooks for subscription lifecycle events
- Payment processing is for live mode (production)

### Security & Best Practices
- Use environment variables for all sensitive data
- Implement proper CORS policies
- Add rate limiting to prevent abuse
- Validate all incoming requests
- Use proper error handling and logging

### API Endpoints Structure
- `/api/payments/*` - Payment related endpoints
- `/api/webhooks/*` - Stripe webhook handlers
- `/health` - Health check endpoint

### Code Style
- Use TypeScript with strict mode
- Implement proper error handling with try/catch
- Use async/await for asynchronous operations
- Add comprehensive logging for debugging
- Comment complex business logic

When generating code for this project, prioritize security, proper error handling, and integration with the existing frontend subscription system.
