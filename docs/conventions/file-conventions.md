# File Conventions

**Last Updated**: 2025-08-23

## Overview

All TypeScript/JavaScript files in the DEVx.network project must follow a strict organizational structure to ensure consistency and maintainability across the codebase. This applies to component files, utility files, service files, and any other code files.

## Comment Style for Section Headers

Use the following comment style for section headers:

```typescript
//
// Section Name
//
```

- Always have a blank line before and after the comment block
- Can be at any indentation level
- Use for major section divisions in your files

## File Structure for Component Files

Component files must be organized in the following four sections, in this exact order:

### 1. Types Section

- All TypeScript type definitions and interfaces
- **Order within section:**
  - Exported types
  - Local/non-exported types

### 2. Constants Section

- Constants and configuration objects only
- **Never include mutable state in this section**
- **Order within section:**
  - Exported constants
  - Local/non-exported constants

### 3. Components Section

- React components and their associated styled components
- **Order within section:**
  - Exported component(s)
  - Non-exported styled components

### 4. Functions/Utils Section

- Helper functions and utilities
- **Order within section:**
  - Exported functions (rare - see note below)
  - Non-exported functions

**Note**: Exported functions should only exist in component files if they're part of that component's API. General utilities belong in `utils/` directory.

## File Structure for Non-Component Files

Utility files, service files, and other non-component files follow a simpler structure:

### 1. Types Section (if needed)

- **Order**: Exported types first, then local types

### 2. Constants Section

- **Order**: Exported constants first, then local constants

### 3. Functions/Classes Section

- **Order**: Exported functions/classes first, then local helpers

## Example: Component File

```typescript
"use client"
import { useState } from "react"
import { styled } from "styled-components"

//
// Types
//

export type ButtonProps = {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
}

export type ButtonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void

type ButtonState = {
  isHovered: boolean
  isPressed: boolean
}

//
// Constants
//

export const BUTTON_VARIANTS = {
  primary: {
    backgroundColor: '#007bff',
    color: '#ffffff'
  },
  secondary: {
    backgroundColor: '#6c757d',
    color: '#ffffff'
  }
} as const

export const BUTTON_SIZES = {
  small: '8px 16px',
  medium: '12px 24px',
  large: '16px 32px'
} as const

const defaultAnimationConfig = {
  duration: 200,
  easing: 'ease-in-out'
}

const defaultState: ButtonState = {
  isHovered: false,
  isPressed: false
}

//
// Components
//

export const Button = ({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
  size = 'medium'
}: ButtonProps) => {
  const [state, setState] = useState<ButtonState>(defaultState)

  return (
    <StyledButton
      onClick={onClick}
      disabled={disabled}
      $variant={variant}
      $size={size}
      onMouseEnter={() => handleMouseEnter(setState)}
      onMouseLeave={() => handleMouseLeave(setState)}
    >
      {label}
    </StyledButton>
  )
}

const StyledButton = styled.button<{ $variant: string; $size: string }>`
  padding: ${props => BUTTON_SIZES[props.$size]};
  background-color: ${props => BUTTON_VARIANTS[props.$variant].backgroundColor};
  color: ${props => BUTTON_VARIANTS[props.$variant].color};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity ${defaultAnimationConfig.duration}ms ${defaultAnimationConfig.easing};

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

//
// Functions
//

export const validateButtonProps = (props: Partial<ButtonProps>): boolean => {
  return !!(props.label && props.onClick)
}

const handleMouseEnter = (setState: React.Dispatch<React.SetStateAction<ButtonState>>) => {
  setState(prev => ({ ...prev, isHovered: true }))
}

const handleMouseLeave = (setState: React.Dispatch<React.SetStateAction<ButtonState>>) => {
  setState(prev => ({ ...prev, isHovered: false }))
}
```

## Example: Utility File

```typescript
//
// Types
//

export type DateFormat = "short" | "long" | "iso"

export interface DateOptions {
	format: DateFormat
	timezone?: string
}

type InternalDateConfig = {
	defaultTimezone: string
	locale: string
}

//
// Constants
//

export const DATE_FORMATS = {
	short: "MM/DD/YYYY",
	long: "MMMM D, YYYY",
	iso: "YYYY-MM-DD"
} as const

const config: InternalDateConfig = {
	defaultTimezone: "UTC",
	locale: "en-US"
}

//
// Functions
//

export const formatDate = (date: Date, options: DateOptions): string => {
	const timezone = options.timezone || config.defaultTimezone
	return applyFormat(date, options.format, timezone)
}

export const parseDate = (dateString: string): Date => {
	const parsed = new Date(dateString)
	if (isNaN(parsed.getTime())) {
		throw new Error(`Invalid date string: ${dateString}`)
	}
	return parsed
}

export const isValidDate = (date: any): boolean => {
	return date instanceof Date && !isNaN(date.getTime())
}

const applyFormat = (date: Date, format: DateFormat, timezone: string): string => {
	// Implementation details...
	return date.toISOString()
}
```

## Example: Service File

```typescript
import { db } from "@/lib/database"

//
// Types
//

export interface User {
	id: string
	email: string
	name: string
}

export interface CreateUserInput {
	email: string
	name: string
}

type QueryResult = {
	rows: any[]
	rowCount: number
}

//
// Constants
//

export const USER_ROLES = {
	ADMIN: "admin",
	USER: "user",
	GUEST: "guest"
} as const

const QUERY_TIMEOUT = 5000

//
// Functions
//

export const createUser = async (input: CreateUserInput): Promise<User> => {
	const id = generateUserId()
	const user = { id, ...input }

	await db.insert("users", user)
	return user
}

export const findUserById = async (id: string): Promise<User | null> => {
	const result = await db.query("SELECT * FROM users WHERE id = ?", [id])
	return result.rows[0] || null
}

export const updateUser = async (id: string, updates: Partial<User>): Promise<User> => {
	const existing = await findUserById(id)
	if (!existing) {
		throw new Error(`User ${id} not found`)
	}

	const updated = { ...existing, ...updates }
	await db.update("users", id, updated)
	return updated
}

const generateUserId = (): string => {
	return crypto.randomUUID()
}
```

## Key Principles

1. **Exports always come first**: Within each section, exported items appear before non-exported items
2. **Constants before functions**: Constants and configuration always appear before function/class declarations
3. **Separation of concerns**: Component files keep component-specific code; general utilities go in `utils/`
4. **Clean section headers**: Use the specified comment style with blank lines for clarity
5. **Consistent ordering**: The same pattern applies to all file types, making navigation predictable

## Benefits

1. **Predictability**: Developers always know where to find specific types of code
2. **Export Visibility**: Important exported APIs are always at the top of each section
3. **Type Safety**: Types are defined before they're used
4. **Readability**: Clear section boundaries with consistent comment style
5. **Maintainability**: Consistent structure across all files in the codebase

## Migration Checklist

When refactoring existing files:

- [ ] Add section header comments with proper spacing
- [ ] Move all type definitions to the top
- [ ] Separate constants from mutable state
- [ ] Order exports before non-exports in each section
- [ ] For components: separate styled components into components section
- [ ] For utilities: ensure general utilities are in `utils/` directory
- [ ] Remove any old-style section comments (like `// ======= SECTION =======`)

## Related Documentation

- [Styling Guidelines](./styling-guidelines.md) - Details on styled-components usage
- [Code Style Guidelines](../../AGENTS.md) - General code style rules
