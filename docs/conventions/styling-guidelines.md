# Styling Guidelines

**Last Updated**: 2025-08-23

## Overview

DEVx.network styles React components with styled-components. This document outlines the conventions.

## Current Status

Use styled-components for component styles. Do not add Tailwind.

## Styled Components Guidelines

### Basic Usage

All styling should be done using styled-components. Components should use the `styled` API from styled-components v6. Import it as a named export. The default import fails when Astro prerenders the page.

```typescript
import { styled } from "styled-components"

const Container = styled.div`
	display: flex;
	padding: 16px;
	background-color: #ffffff;
`
```

### Client Components

For components using styled-components, always include the `"use client"` directive at the top of the file:

```typescript
"use client"
import { styled } from "styled-components"
```

### Naming Conventions

- Use PascalCase for styled component names
- Use descriptive names that indicate the component's purpose
- Prefix with `Styled` when the name might conflict with an imported component

```typescript
// Good
const NavigationContainer = styled.nav`...`
const HeaderTitle = styled.h1`...`
const StyledButton = styled.button`...`

// Avoid
const Nav = styled.nav`...` // Too generic
const Div1 = styled.div`...` // Not descriptive
```

### Component Props and Theming

Use TypeScript for styled component props:

```typescript
const Button = styled.button<{ $primary?: boolean; $size?: "small" | "medium" | "large" }>`
	background: ${(props) => (props.$primary ? "#007bff" : "#6c757d")};
	padding: ${(props) => {
		switch (props.$size) {
			case "small":
				return "4px 8px"
			case "large":
				return "12px 24px"
			default:
				return "8px 16px"
		}
	}};
`
```

Note: Use the `$` prefix for transient props to prevent them from being passed to the DOM.

### Organization Within Files

Styled components should typically be placed at the end of the file, after the main component logic:

```typescript
// 1. Types
export type ComponentProps = {...}

// 2. Constants
const SPACING = {...}

// 3. Main Component
export const Component = () => {...}

// 4. Styled Components (at the end)
const Container = styled.div`...`
const Title = styled.h1`...`
```

### Responsive Design

Use media queries within styled components for responsive design:

```typescript
const Container = styled.div`
	padding: 16px;

	@media (min-width: 768px) {
		padding: 24px;
	}

	@media (min-width: 1024px) {
		padding: 32px;
		max-width: 1200px;
		margin: 0 auto;
	}
`
```

### Animation and Transitions

Define animations using styled-components:

```typescript
import styled, { keyframes } from "styled-components"

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const FadeInDiv = styled.div`
	animation: ${fadeIn} 0.3s ease-in-out;
`
```

## Migration from Tailwind

When refactoring Tailwind classes to styled-components:

1. **Identify all Tailwind classes** in the component
2. **Create styled components** with equivalent CSS properties
3. **Remove className props** with Tailwind classes
4. **Test responsiveness** to ensure media queries work correctly

### Common Tailwind to CSS Mappings

| Tailwind Class    | CSS Property                                 |
| ----------------- | -------------------------------------------- |
| `flex`            | `display: flex`                              |
| `items-center`    | `align-items: center`                        |
| `justify-between` | `justify-content: space-between`             |
| `p-4`             | `padding: 16px`                              |
| `mx-auto`         | `margin-left: auto; margin-right: auto`      |
| `text-lg`         | `font-size: 1.125rem`                        |
| `bg-blue-500`     | `background-color: #3b82f6`                  |
| `rounded-lg`      | `border-radius: 0.5rem`                      |
| `shadow-md`       | `box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1)` |

## Best Practices

1. **Avoid inline styles** - Use styled-components for all styling
2. **Keep styles close to usage** - Define styled components in the same file where they're used
3. **Use semantic HTML** - Style semantic elements when possible (`nav`, `header`, `main`, etc.)
4. **Maintain consistency** - Follow the same patterns across all components
5. **Performance** - Avoid creating styled components inside render functions

## Related Documentation

- [Component Organization](./component-organization.md) - File structure guidelines
- [Code Style Guidelines](../../AGENTS.md) - General code style rules
