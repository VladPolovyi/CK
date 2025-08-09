# CBITAHOK KPOBI - WoW Guild Website

A beautiful, modern website for your World of Warcraft guild built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎨 **WoW-themed Design**: Beautiful dark theme with gold accents inspired by World of Warcraft
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile devices
- ⚡ **Fast**: Built with Next.js 14 for optimal performance
- 🎯 **Modern**: Uses TypeScript and Tailwind CSS for a modern development experience
- 🔧 **Customizable**: Easy to modify colors, content, and styling

## Getting Started

### Prerequisites

- Node.js 18+ installed on your system
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles and Tailwind CSS
│   ├── layout.tsx       # Root layout component
│   └── page.tsx         # Homepage component
├── components/          # Reusable components (to be added)
└── lib/                # Utility functions (to be added)
```

## Customization

### Colors
The website uses custom WoW-themed colors defined in `tailwind.config.js`:
- `wow-gold`: #FFD700 (Gold accent color)
- `wow-blue`: #0070DE (Blue accent)
- `wow-red`: #C41E3A (Red accent)
- `wow-green`: #00FF00 (Green accent)
- `wow-purple`: #9370DB (Purple accent)

### Content
Edit the content in `src/app/page.tsx` to customize:
- Guild name and description
- Navigation links
- Guild statistics
- Feature descriptions

### Styling
Modify the custom CSS classes in `src/app/globals.css` to adjust:
- Background gradients
- Card hover effects
- Border styles
- Animations

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

This project can be easily deployed to:
- Vercel (recommended for Next.js)
- Netlify
- Any static hosting service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Note**: World of Warcraft is a registered trademark of Blizzard Entertainment. This website is for fan use only.
