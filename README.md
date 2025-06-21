# Nocta UI

A modern, accessible React component library built with TypeScript and Tailwind CSS.

## Features

-  **Modern Design** - Clean, minimalist components with beautiful aesthetics
-  **Dark Mode** - Full dark mode support for all components
-  **Accessible** - Built with accessibility in mind, following WCAG guidelines
-  **Composable** - Flexible component composition patterns
-  **TypeScript** - Full TypeScript support with comprehensive type definitions
-  **Tailwind CSS** - Styled with Tailwind CSS for easy customization
-  **Responsive** - Mobile-first responsive design
-  **Zero Dependencies** - No external dependencies except React
-  **Tree Shakeable** - Import only what you need

## Installation

No installation required! Use our CLI to add components directly to your project:

```bash
# Initialize your project
npx nocta-ui-cli init

# Add components
npx nocta-ui-cli add button
npx nocta-ui-cli add card
npx nocta-ui-cli add alert
```

Or install the CLI globally:

```bash
npm install -g nocta-ui-cli
nocta-ui add button
```

##  Quick Start

1. **Initialize your project:**
```bash
npx nocta-ui-cli init
```

2. **Add your first components:**
```bash
npx nocta-ui-cli add button card
```

3. **Start using components:**
```tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

function App() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to Nocta UI</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="primary">Get Started</Button>
      </CardContent>
    </Card>
  )
}
```

## Requirements

- **React 18+**
- **TypeScript** (recommended)
- **Tailwind CSS v3 or v4**

The CLI automatically detects your framework and configures everything for you!

## Available Components

### Form
- **Button** - Interactive buttons with multiple variants
- **Input** - Text inputs with icons and validation
- **Checkbox** - Custom checkboxes with variants
- **Switch** - Toggle switches with animations
- **Select** - Custom dropdowns with keyboard navigation
- **Textarea** - Multi-line text inputs

### Data Display
- **Avatar** - User avatars with fallback and status
- **Badge** - Status indicators and labels

### Layout
- **Card** - Flexible containers with composable sections

### Feedback
- **Alert** - Important messages and notifications

### Overlay
- **Dialog** - Modal dialogs with animations
- **Tooltip** - Contextual tooltips with smart positioning

```bash
# View all available components
npx nocta-ui-cli list

# Add multiple components at once
npx nocta-ui-cli add button input card dialog
```

## Customization

Components are built with Tailwind CSS and can be easily customized:

```tsx
// Override styles with className
<Button className="bg-purple-500 hover:bg-purple-600">
  Custom Button
</Button>

// Dark mode is supported out of the box
<div className="dark">
  <Button variant="primary">Dark Mode Button</Button>
</div>
```

## Accessibility

All components follow accessibility best practices with keyboard navigation, ARIA labels, and WCAG compliance.

## Documentation

Visit our [documentation site](nocta-ui-beryl.vercel.app) for:

-  Interactive component demos
-  Detailed API documentation  
-  Usage examples

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT License - see [LICENSE](LICENSE) for details.

<div align="center">
  <p>
    <a href="nocta-ui-beryl.vercel.app">Documentation</a> •
    <a href="https://github.com/66HEX/nocta-ui/issues">Report Bug</a> •
    <a href="https://github.com/66HEX/nocta-ui/issues">Request Feature</a>
  </p>
</div>
