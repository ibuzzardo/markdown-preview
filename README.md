# Markdown Preview

> Built with [Dark Factory v4](https://github.com/ibuzzardo/dark-factory-v4) — autonomous AI software development pipeline

**[Live Demo](https://markdown-preview-ibuzzardos-projects.vercel.app)**


A live Markdown preview web application built with Next.js 15 App Router. Users can type Markdown in the left panel and see a styled HTML preview update in real-time on the right panel.

## Features

- ⚡ **Real-time preview** - Updates as you type with 200ms debouncing
- 🎨 **Dark theme** - Beautiful dark UI with Tailwind CSS
- 📱 **Mobile responsive** - Panels stack vertically on small screens
- 🔒 **Secure** - HTML output is sanitized to prevent XSS attacks
- 📋 **Copy to clipboard** - One-click HTML copying
- 🚀 **Modern stack** - Next.js 15, React 19, TypeScript

## Supported Markdown Features

- Headers (H1-H6)
- **Bold** and *italic* text
- ~~Strikethrough~~
- `Inline code` and code blocks with syntax highlighting
- [Links](https://example.com) and images
- Tables (GitHub Flavored Markdown)
- > Blockquotes
- Ordered and unordered lists
- Task lists with checkboxes
- Horizontal rules

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd markdown-preview
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables (optional):
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

## API Endpoints

### Health Check
- **GET** `/api/health` - Returns `{ status: "ok" }`

## Project Structure

```
src/
├── app/
│   ├── layout.tsx         # Root layout with dark theme
│   ├── page.tsx           # Main page with MarkdownEditor
│   ├── globals.css        # Global styles and prose overrides
│   └── api/
│       └── health/
│           └── route.ts   # Health check endpoint
├── components/
│   ├── MarkdownEditor.tsx # Main editor component
│   └── SampleMarkdown.ts  # Default markdown content
├── lib/
│   └── markdown.ts        # Markdown processing utilities
└── types.ts               # TypeScript type definitions
```

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with @tailwindcss/typography
- **Markdown Processing**: 
  - unified
  - remark-parse
  - remark-gfm (GitHub Flavored Markdown)
  - remark-rehype
  - rehype-stringify
  - rehype-sanitize

## Mobile Responsiveness

The application is fully responsive and tested at these breakpoints:
- **Mobile**: 320px and up (stacked layout)
- **Tablet**: 768px and up (side-by-side layout)
- **Desktop**: 1280px and up (optimized spacing)

## Security

- All HTML output is sanitized using `rehype-sanitize`
- No dangerous HTML elements or attributes are allowed
- XSS protection through content sanitization

## Browser Support

- Modern browsers with ES2017+ support
- Clipboard API for copy functionality (with fallback)
- JavaScript required for functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Environment Variables

Currently, no environment variables are required for basic functionality. See `.env.example` for future configuration options.

## Performance

- Debounced input processing (200ms)
- Efficient re-rendering with React hooks
- Optimized bundle size with tree shaking
- Fast development with Next.js Hot Module Replacement

## Troubleshooting

### Build Issues
- Ensure Node.js version is 18.0.0 or higher
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check TypeScript errors: `npm run type-check`

### Runtime Issues
- Check browser console for JavaScript errors
- Ensure JavaScript is enabled
- Try hard refresh (Ctrl+F5 or Cmd+Shift+R)

### Clipboard Issues
- Clipboard API requires HTTPS in production
- Fallback method available for older browsers
- Check browser permissions for clipboard access