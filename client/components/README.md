# Component Library - Atomic Design Structure

This component library follows the **Atomic Design** methodology by Brad Frost, organizing UI components into three main categories: Atoms, Molecules, and Organisms.

## 🏗️ Structure

```
components/
├── atoms/           # Basic building blocks
├── molecules/       # Groups of atoms functioning together
├── organisms/       # Groups of molecules forming complex components
└── index.ts         # Main export file
```

## ⚛️ Atoms

Basic building blocks that can't be broken down further without losing functionality.

### Button (`Button.tsx`)
- **Variants**: `primary`, `secondary`, `danger`, `ghost`
- **Sizes**: `sm`, `md`, `lg`
- **Features**: Loading states, full width, disabled states
- **Usage**:
```tsx
<Button variant="primary" size="md" loading={false}>
  Click me
</Button>
```

### Input (`Input.tsx`)
- **Features**: Error states, icons, end icons
- **Usage**:
```tsx
<Input
  error={false}
  icon={<Icon name="email" />}
  placeholder="Enter email"
/>
```

### Icon (`Icon.tsx`)
- **Available Icons**: `email`, `lock`, `eye`, `eye-off`, `check`, `exclamation`, `loading`
- **Sizes**: `sm`, `md`, `lg`
- **Usage**:
```tsx
<Icon name="email" size="md" className="text-slate-400" />
```

### Label (`Label.tsx`)
- **Features**: Required indicator
- **Usage**:
```tsx
<Label required={true}>Email Address</Label>
```

### ErrorMessage (`ErrorMessage.tsx`)
- **Usage**:
```tsx
<ErrorMessage>This field is required</ErrorMessage>
```

### Card (`Card.tsx`)
- **Variants**: `default`, `elevated`, `outlined`
- **Padding**: `none`, `sm`, `md`, `lg`
- **Usage**:
```tsx
<Card variant="elevated" padding="lg">
  Content here
</Card>
```

## 🧬 Molecules

Groups of atoms that function together as a unit.

### InputField (`InputField.tsx`)
- **Features**: Combines Label, Input, and ErrorMessage
- **Usage**:
```tsx
<InputField
  label="Email Address"
  type="email"
  iconName="email"
  error="Invalid email"
  required={true}
/>
```

### PasswordField (`PasswordField.tsx`)
- **Features**: Password visibility toggle, strength indicator
- **Usage**:
```tsx
<PasswordField
  label="Password"
  showStrength={true}
  error="Password too weak"
/>
```

### Alert (`Alert.tsx`)
- **Variants**: `success`, `error`, `warning`, `info`
- **Usage**:
```tsx
<Alert variant="error" title="Error">
  Something went wrong
</Alert>
```

### TabNavigation (`TabNavigation.tsx`)
- **Features**: Interactive tab switching
- **Usage**:
```tsx
<TabNavigation
  tabs={[
    { key: 'signin', label: 'Sign In' },
    { key: 'signup', label: 'Sign Up' }
  ]}
  activeTab="signin"
  onTabChange={(key) => console.log(key)}
/>
```

## 🏢 Organisms

Complex components built from molecules and atoms.

### SignInForm (`SignInForm.tsx`)
- **Features**: Complete sign-in functionality with validation
- **Usage**:
```tsx
<SignInForm
  onSubmit={async (data) => console.log(data)}
  loading={false}
  error="Login failed"
  onForgotPassword={() => {}}
/>
```

### SignUpForm (`SignUpForm.tsx`)
- **Features**: Complete sign-up with validation and password strength
- **Usage**:
```tsx
<SignUpForm
  onSubmit={async (data) => console.log(data)}
  loading={false}
  error="Registration failed"
/>
```

### AuthContainer (`AuthContainer.tsx`)
- **Features**: Complete authentication flow with tab switching
- **Usage**:
```tsx
<AuthContainer
  onSignIn={handleSignIn}
  onSignUp={handleSignUp}
  onSignOut={handleSignOut}
  signedInUser={{ email: 'user@example.com' }}
  loading={false}
  error="Authentication error"
/>
```

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (`from-blue-600 to-blue-700`)
- **Secondary**: Slate (`slate-300`, `slate-600`)
- **Success**: Emerald (`emerald-50`, `emerald-600`)
- **Error**: Red (`red-50`, `red-500`)
- **Warning**: Yellow (`yellow-50`, `yellow-600`)

### Typography
- **Headings**: `text-4xl font-bold` with gradient
- **Body**: `text-sm`, `text-slate-600`
- **Labels**: `text-sm font-medium text-slate-700`

### Spacing
- **Cards**: `rounded-2xl`, `shadow-xl`
- **Inputs**: `rounded-xl`, `px-4 py-3`
- **Buttons**: `rounded-xl`, `px-4 py-3`

## 🚀 Usage Examples

### Basic Form
```tsx
import { InputField, PasswordField, Button, Card } from '../components';

function MyForm() {
  return (
    <Card variant="elevated">
      <InputField label="Email" type="email" iconName="email" />
      <PasswordField label="Password" showStrength />
      <Button variant="primary" fullWidth>Submit</Button>
    </Card>
  );
}
```

### Complete Auth Flow
```tsx
import { AuthContainer } from '../components';

function AuthPage() {
  return (
    <AuthContainer
      onSignIn={async (data) => {/* handle sign in */}}
      onSignUp={async (data) => {/* handle sign up */}}
      onSignOut={() => {/* handle sign out */}}
    />
  );
}
```

## 🔄 Benefits

1. **Reusability**: Components can be used across the entire application
2. **Consistency**: Unified design system and behavior
3. **Maintainability**: Changes in atoms automatically propagate
4. **Scalability**: Easy to add new components following the same patterns
5. **Type Safety**: Full TypeScript support with proper interfaces
6. **Accessibility**: Built-in accessibility features
7. **Testing**: Easy to test individual components in isolation

## 📝 Adding New Components

1. **Atoms**: Create in `atoms/` folder for basic UI elements
2. **Molecules**: Create in `molecules/` folder for component groups
3. **Organisms**: Create in `organisms/` folder for complex features
4. **Export**: Add to respective `index.ts` files
5. **Document**: Add usage examples to this README

This structure ensures a scalable, maintainable, and consistent UI component library for the entire application.