# Fillout

A modern, interactive form builder with a dynamic navbar component built using Next.js, TypeScript, and Tailwind CSS. This project demonstrates advanced UI patterns and state management for creating multi-page forms.

## 🎨 Design System

### Tailwind CSS Implementation

This project showcases a comprehensive design system built with Tailwind CSS, featuring:

#### **Custom Design Tokens**
- **Colors**: Custom color palette with semantic naming
- **Typography**: Consistent font sizes and weights
- **Spacing**: Systematic spacing scale
- **Shadows**: Layered shadow system for depth
- **Border Radius**: Consistent corner radius values

#### **Component Architecture**
The design system is organized into reusable UI components:

```
components/ui/
├── button.tsx      # Primary, secondary, and ghost button variants
├── card.tsx        # Container components with consistent styling
├── dialog.tsx      # Modal and overlay components
├── dropdown-menu.tsx # Context menus and dropdowns
├── input.tsx       # Form input components
└── label.tsx       # Form label components
```

#### **Design Patterns**

1. **Consistent Spacing**
   - Uses Tailwind's spacing scale (4px base unit)
   - Systematic padding and margin values
   - Responsive spacing adjustments

2. **Color System**
   - Primary colors for main actions
   - Secondary colors for supporting elements
   - Semantic colors for states (success, error, warning)
   - Neutral colors for backgrounds and text

3. **Typography Scale**
   - Consistent font sizes using Tailwind's text scale
   - Proper font weights for hierarchy
   - Responsive text sizing

4. **Interactive States**
   - Hover, focus, and active states
   - Smooth transitions and animations
   - Consistent feedback patterns

### Key Design Features

#### **Responsive Design**
- Mobile-first approach
- Breakpoint-specific layouts
- Flexible component sizing

#### **Accessibility**
- Proper ARIA labels
- Keyboard navigation support
- Focus management
- Color contrast compliance

#### **Animation & Transitions**
- Smooth hover effects
- Page transition animations
- Loading states
- Micro-interactions

## 🚀 Features

### Form Builder Functionality
- **Dynamic Page Management**: Add, delete, duplicate, and reorder form pages
- **Active Page Tracking**: Visual indication of current page
- **Fixed Pages**: Special pages that cannot be deleted or reordered
- **Context Menu**: Right-click actions for page management
- **Drag & Drop**: Reorder pages by dragging
- **Page Renaming**: Inline editing of page names

### State Management
- **React Context**: Centralized state management
- **Reducer Pattern**: Predictable state updates
- **Optimistic Updates**: Immediate UI feedback
- **Error Handling**: Graceful error states

### UI Components
- **Custom Hooks**: Reusable logic encapsulation
- **Compound Components**: Flexible component composition
- **Controlled Components**: Predictable form behavior
- **Loading States**: Skeleton components and spinners

## 🛠️ Technical Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + useReducer
- **UI Components**: Custom component library
- **Icons**: Lucide React
- **Build Tool**: Turbopack

## 📁 Project Structure

```
fillout/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main page component
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── form-builder-navbar.tsx    # Main navbar component
│   ├── form-page-item.tsx         # Individual page item
│   ├── context-menu.tsx           # Right-click menu
│   └── ...               # Other specialized components
├── contexts/             # React contexts
│   └── form-builder-context.tsx   # Main state management
├── types/                # TypeScript type definitions
│   └── form-builder.ts   # Form-related types
├── lib/                  # Utility functions
│   └── utils.ts          # Helper functions
└── public/               # Static assets
```

## 🎯 Key Components

### FormBuilderNavbar
The main navigation component that displays all form pages with interactive controls.

### FormPageItem
Individual page representation with hover states, context menus, and drag handles.

### ContextMenu
Right-click menu providing page management actions (rename, duplicate, delete, etc.).

### FormBuilderProvider
Context provider managing the global state of the form builder.

## 🔧 Development

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd fillout

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Building for Production
```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 🎨 Customization

### Tailwind Configuration
The project uses a custom Tailwind configuration (`tailwind.config.ts`) with:
- Extended color palette
- Custom spacing values
- Component-specific utilities
- Animation configurations

### Component Theming
Components can be customized by:
- Modifying Tailwind classes
- Updating design tokens
- Extending component variants
- Adding new utility classes

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Note**: This project serves as a reference implementation for building modern, accessible, and maintainable UI components with Tailwind CSS and React. 