![Nocta UI](screen.jpg)

# Nocta UI

A modern, accessible React component library built with **simplicity**, **performance**, and **developer experience** at its core. Every component is crafted to be beautiful, functional, and accessible by default.

## Philosophy

Nocta UI is designed around four core principles that guide every decision:

### **Minimal**
Clean components with no unnecessary complexity. Every element serves a purpose, every interaction feels natural. We believe in doing less, but doing it perfectly.

### **Performant** 
Copy-paste approach with CLI tooling. Components live in your codebase, giving you full control and customization power. No bundle bloat, no version conflicts.

### **Accessible**
WCAG 2.1 AA compliant components with keyboard navigation, screen reader support, and semantic HTML. Accessibility isn't an afterthought—it's built in from the ground up.

### **Developer First**
Full TypeScript support, intuitive APIs, and comprehensive documentation for the best developer experience. Components that just work.

## Architecture

### Copy-Paste Philosophy

Unlike traditional component libraries, Nocta UI follows the **copy-paste approach** pioneered by shadcn/ui. Instead of installing a package, you use our CLI to copy component source code directly into your project:

```bash
# Initialize your project with required dependencies
npx nocta-ui init

# Add components to your project
npx nocta-ui add button card badge

# Components are now in your /components/ui directory
# You own the code and can modify it however you want
```

**Why copy-paste?**
- **Full control** - modify components to fit your exact needs
- **No version conflicts** - components are copied, not installed
- **Easy customization** - change styling, behavior, or structure
- **Minimal to zero dependencies** - only React with a little bit of GSAP
- **Framework agnostic** - works with any React setup

### Design System

**Color Palette**: Neutral-first approach that adapts beautifully to both light and dark themes, with semantic colors used sparingly and purposefully.

**Typography**: Clear hierarchy with consistent spacing and readable line heights, optimized for accessibility and reading comfort.

**Spacing**: Based on a 4px base unit with consistent ratios from micro (2px) to large (64px) spacing.

**Accessibility**: Every component meets WCAG 2.1 AA standards with keyboard navigation, screen reader support, and motor accessibility considerations.

## Quick Start

1. **Initialize your project:**
```bash
npx nocta-ui init
```

2. **Add your first components:**
```bash
npx nocta-ui add button card
```

3. **Start building:**
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

## Key Features

- **TypeScript First** - Full type safety and IntelliSense support
- **Dark Mode Native** - First-class dark mode support, not an afterthought
- **Composable Design** - Build complex interfaces by composing simple components
- **Performance Optimized** - Minimal re-renders and efficient animations
- **Accessible by Default** - WCAG compliant with comprehensive accessibility features
- **Customizable** - Full source code access means unlimited customization
- **Modern Styling** - Built on Tailwind CSS with systematic design tokens

## Customization

Since you own the component source code, customization is limitless:

```tsx
// Modify the component directly in your codebase
const CustomButton = ({ ...props }) => {
  return (
    <Button 
      className="bg-purple-500 hover:bg-purple-600 shadow-lg" 
      {...props} 
    />
  )
}

// Or extend with your own variants
const variants = {
  // Add your brand colors
  brand: "bg-purple-600 text-white hover:bg-purple-700",
  // Modify existing variants  
  primary: "bg-blue-600 text-white hover:bg-blue-700",
}
```

## Documentation

Visit our [documentation site](https://nocta-ui.com) for:

- **Interactive demos** - See components in action
- **Complete API reference** - All props and customization options
- **Design guidelines** - Color system, typography, and spacing
- **Accessibility guide** - How we ensure inclusive design

## Contributing

We welcome contributions! Whether it's bug reports, feature requests, or code contributions, please feel free to open an issue or submit a pull request.

## License

MIT License - see [LICENSE](LICENSE) for details.

---

<div align="center">
  <p>
    <a href="https://nocta-ui.com">Documentation</a> •
    <a href="https://github.com/66HEX/nocta-ui/issues">Report Bug</a> •
    <a href="https://github.com/66HEX/nocta-ui/issues">Request Feature</a>
  </p>  
</div>
