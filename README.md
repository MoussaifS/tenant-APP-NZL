# Guest Portal - Tenant-Facing Mobile App

A mobile-first web application designed for Airbnb Superhosts to provide guests with quick, convenient access to essential information and services.

## Features

### Core Functionality
- **Check-out Date Display**: Guests can easily view their check-out date
- **In-house Services**: Explore available amenities like WiFi, Features, and Unit Lock
- **Partner Services**: Discover external service providers for additional support
- **Search Functionality**: Find specific services or information quickly
- **Multi-language Support**: Available in English and Arabic with RTL support

### Mobile-First Design
- Responsive design optimized for mobile devices
- Touch-friendly interface with proper tap targets
- Gold/beige color scheme matching the brand
- Bottom navigation for easy access to key features

### Guest Experience
- Personalized welcome with guest name
- Real-time status bar showing time and connectivity
- Chat support integration
- Current reservation details with property location
- Quick access to amenities and services

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Internationalization**: Built-in i18n support
- **Mobile Optimization**: Responsive design with mobile-first approach

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your mobile browser

## Usage

### For Superhosts
1. Generate a QR code pointing to your property's guest portal URL
2. Place the QR code in your property for easy guest access
3. Customize guest information, check-in/check-out dates, and available services

### For Guests
1. Scan the QR code with your mobile device
2. View your check-out date and reservation details
3. Explore available amenities and services
4. Access partner providers for additional support
5. Use the search function to find specific information

## Customization

The app is designed to be easily customizable:

- **Guest Information**: Update guest name and profile in the translations
- **Dates**: Modify check-in/check-out dates in the component
- **Services**: Add or modify amenities and partner services
- **Branding**: Update colors and styling in the CSS variables
- **Languages**: Add new languages by extending the translations object

## Mobile Optimization

- Viewport meta tag configured for mobile devices
- Touch-friendly button sizes (minimum 44px)
- Optimized images and assets
- Fast loading with compression enabled
- RTL support for Arabic language

## Browser Support

- iOS Safari 12+
- Chrome Mobile 80+
- Firefox Mobile 80+
- Samsung Internet 12+

## Deployment

The app is ready for deployment on platforms like:
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Any static hosting service

## License

This project is designed for Airbnb Superhosts to enhance guest experiences.
