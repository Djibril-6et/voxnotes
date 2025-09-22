# 🎤 VoxNotes Frontend

Modern React application for the voice transcription platform. Provides a complete user interface for audio recording, transcription management, user authentication, and subscription handling.

## 🛠️ Tech Stack

- **Framework:** React 18.3.1
- **Routing:** React Router DOM 6.26.1
- **Internationalization:** i18next with browser language detection
- **Styling:** CSS3 with custom styling
- **PDF Generation:** jsPDF for document export
- **Date Handling:** date-fns for date formatting
- **Testing:** Jest + React Testing Library
- **Code Quality:** ESLint + Prettier with Airbnb config

## 🌟 Features

- **Voice Recording & Transcription:** Real-time audio recording and AI-powered transcription
- **Multi-language Support:** i18next internationalization with automatic language detection
- **User Authentication:** OAuth integration (Google, GitHub, Discord) and email registration
- **Subscription Management:** Stripe-powered payment processing and subscription handling
- **PDF Export:** Generate and download transcription documents
- **Responsive Design:** Mobile-friendly interface
- **Real-time Updates:** Live transcription status and results
- **Error Handling:** Comprehensive error management with user-friendly messages

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- All backend services running:
  - Database Service (port 9090)
  - OAuth Service (port 9020)
  - Payment Service (port 9030)
  - AI Service (port 9040)

## ⚙️ Installation

1. **Clone the repository**
```bash
git clone https://github.com/Djibril-6et/voxnotes.git
cd voxnotes
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory:
```env
# Backend Services URLs (make sure these services are running)
REACT_APP_BDD_API_URL=http://localhost:9090     # Database Service - see: https://github.com/Djibril-6et/voxnotes-db-services
REACT_APP_OAUTH_SERVICE_URL=http://localhost:9020  # OAuth Service - see: https://github.com/Djibril-6et/voxnotes-oauth-services
REACT_APP_IA_SERVICE_URL=http://localhost:9040      # AI Service - see: https://github.com/Djibril-6et/voxnotes-ai-services
REACT_APP_PAYMENT_URL=http://localhost:9030         # Payment Service - see: https://github.com/Djibril-6et/voxnotes-payment-services

# Frontend Application Port
PORT=9010
```

**Required Services:**
Ensure all backend services are running before starting the frontend:
- [Database Service](https://github.com/your-username/database-service) on port 9090
- [OAuth Service](https://github.com/your-username/oauth-service) on port 9020  
- [AI Service](https://github.com/your-username/ai-service) on port 9040
- [Payment Service](https://github.com/your-username/payment-service) on port 9030

4. **Start the development server**
```bash
npm start
```

The application will be available at `http://localhost:9010`

## 🚀 Available Scripts

### Development
```bash
npm start          # Start development server
npm test           # Run test suite
npm run build      # Build for production
```

### Code Quality
```bash
npm run format     # Format code with Prettier
npm run lint       # Lint code with ESLint
```

### Advanced
```bash
npm run eject      # Eject from Create React App (use with caution)
```

## 📁 Project Structure

```
frontend/
├── public/                  # Static files
├── src/
│   ├── assets/             # Images, icons, static resources
│   ├── components/         # Reusable React components
│   ├── pages/              # Page components (routes)
│   ├── services/           # API service functions
│   ├── App.js              # Main App component
│   ├── App.css             # Global styles
│   ├── i18n.js            # Internationalization config
│   ├── index.js           # React entry point
│   └── index.css          # Base styles
├── package.json
└── .env
```

## 🔗 Service Integration

### Database Service (9090)
- User management and authentication
- Transcription history and storage
- Subscription status tracking
- File metadata management

```javascript
// Example API call
const response = await fetch(`${process.env.REACT_APP_BDD_API_URL}/api/users/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

### OAuth Service (9020)
- Social authentication (Google, GitHub, Discord)
- Secure login redirects
- Session management

```javascript
// OAuth login redirect
window.location.href = `${process.env.REACT_APP_OAUTH_SERVICE_URL}/auth/google`;
```

### AI Service (9040)
- Audio file upload
- Real-time transcription processing
- Transcription results retrieval

```javascript
// Audio transcription
const formData = new FormData();
formData.append('file', audioFile);

const response = await fetch(`${process.env.REACT_APP_IA_SERVICE_URL}/transcribe`, {
  method: 'POST',
  body: formData
});
```

### Payment Service (9030)
- Stripe checkout session creation
- Subscription management
- Payment status tracking

```javascript
// Create payment session
const response = await fetch(`${process.env.REACT_APP_PAYMENT_URL}/create-checkout-session/Premium`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ price: 2999, userId })
});
```

## 🌐 Internationalization

The application supports multiple languages using i18next:

### Configuration
```javascript
// i18n.js
import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
```

### Usage in Components
```javascript
import { useTranslation } from 'react-i18next';

function Component() {
  const { t } = useTranslation();
  return <h1>{t('welcome_message')}</h1>;
}
```

### Language Detection
- Automatic browser language detection
- Fallback to default language
- Persistent language preference

## 🎨 Styling & Design

- **CSS Framework:** Custom CSS with modern design patterns
- **Responsive Design:** Mobile-first approach
- **Component-based Styles:** Modular CSS organization
- **Color Scheme:** Professional theme optimized for accessibility
- **Typography:** Clean, readable font hierarchy

## 🔐 Authentication Flow

### OAuth Flow
1. User clicks social login button
2. Redirect to OAuth service
3. Provider authentication
4. Callback with user data
5. Automatic login and dashboard redirect

### Error Handling
- Email already exists with different provider
- Authentication failures
- Network connection issues
- Invalid credentials

### URL Parameters
```javascript
// Success: /profile?provider=google&username=John&email=john@gmail.com&_id=123
// Error: /connexion?error=email_exists&email=john@gmail.com
```

## 💳 Payment Integration

### Stripe Checkout
- Seamless payment processing
- Subscription plan selection
- Payment confirmation
- Error handling and retry logic

### Payment Flow
1. User selects subscription plan
2. Create Stripe checkout session
3. Redirect to Stripe payment page
4. Payment confirmation
5. Subscription activation

## 🎵 Audio Features

### Recording
- Browser-based audio recording
- Real-time audio visualization
- Multiple audio format support
- File size optimization

### Transcription
- Upload to AI service
- Real-time processing status
- Transcription result display
- Edit and save functionality

### Export
- PDF document generation
- Formatted transcription text
- Download functionality
- Print-friendly layouts

## 📱 Responsive Design

- **Mobile:** Optimized for small screens
- **Tablet:** Touch-friendly interface
- **Desktop:** Full feature experience
- **PWA Ready:** Progressive Web App capabilities

## 🧪 Testing

### Test Suites
- **Unit Tests:** Component functionality
- **Integration Tests:** Service interactions
- **User Interface Tests:** User interaction flows
- **Accessibility Tests:** Screen reader compatibility

### Running Tests
```bash
npm test                    # Run all tests
npm test -- --coverage     # Run with coverage report
npm test -- --watchAll     # Watch mode for development
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_BDD_API_URL` | Database service URL | `http://localhost:9090` |
| `REACT_APP_OAUTH_SERVICE_URL` | OAuth service URL | `http://localhost:9020` |
| `REACT_APP_IA_SERVICE_URL` | AI service URL | `http://localhost:9040` |
| `REACT_APP_PAYMENT_URL` | Payment service URL | `http://localhost:9030` |
| `PORT` | Development server port | `9010` |

## 🚀 Production Build

### Building for Production
```bash
npm run build
```

### Deployment Checklist
- [ ] Update environment variables for production URLs
- [ ] Configure HTTPS for all service endpoints
- [ ] Set up CDN for static assets
- [ ] Configure proper CORS headers
- [ ] Enable gzip compression
- [ ] Set up error monitoring
- [ ] Configure analytics tracking

### Docker Support
```dockerfile
# Build stage
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔍 Troubleshooting

### Common Issues

**CORS Errors**
- Ensure all services have proper CORS configuration
- Check that service URLs are correct in environment variables

**OAuth Redirect Issues**
- Verify callback URLs in OAuth provider settings
- Check that OAuth service is running and accessible

**Payment Processing Errors**
- Confirm Stripe keys are properly configured
- Verify payment service connection

**Transcription Failures**
- Check AI service status and API keys
- Verify audio file format compatibility

## 📊 Performance Optimization

### Bundle Optimization
- Code splitting for route-based loading
- Lazy loading for heavy components
- Tree shaking for unused code elimination

### Caching Strategy
- Browser caching for static assets
- Service worker for offline functionality
- API response caching where appropriate

### Loading Performance
- Skeleton screens for better UX
- Progressive loading for large lists
- Image optimization and lazy loading

## 🛡️ Security Considerations

- **Environment Variables:** Sensitive data in backend only
- **XSS Protection:** Sanitized user inputs
- **HTTPS Enforcement:** Secure communication only
- **Token Management:** Secure storage and handling
- **Content Security Policy:** Prevent code injection

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### Code Style
- Follow Airbnb ESLint configuration
- Use Prettier for consistent formatting
- Write meaningful commit messages
- Add tests for new features

### Pull Request Process
1. Ensure all tests pass
2. Update documentation if needed
3. Request review from maintainers
4. Address feedback promptly

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the troubleshooting section
- Review service-specific READMEs
- Create an issue in the repository
- Contact the development team