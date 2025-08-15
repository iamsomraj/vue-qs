# GitHub Copilot Instructions for vue-qs

## Project Overview

vue-qs is a Vue.js library for synchronizing URL query parameters with reactive state. It provides composables, adapters, and serializers for managing query parameters in Vue applications.

## Code Quality Standards

### ESLint Rules

- Use strict ESLint configuration with comprehensive rules (80+ rules active)
- Always fix lint errors before committing
- Follow explicit return type requirements for all functions
- Maintain consistent code formatting and style

### Import Organization

- **Always use @ alias imports** (`@/` maps to `src/`)
- Never use relative imports like `../` or `./`
- Organize imports in this order:
  1. Built-in Node.js modules
  2. External packages (vue, vue-router, etc.)
  3. Internal modules (@/types, @/utils, etc.)
  4. Parent directory imports
  5. Sibling imports
  6. Index imports
- Group related imports together
- Sort imports alphabetically within each group

### File Naming Convention

- **All files must use kebab-case naming**
- Examples: `adapter-context.ts`, `use-query-ref.ts`, `router-subscribe.test.ts`
- Never use camelCase for file names
- Test files should follow the same kebab-case pattern

## API Naming Standards

### Modern API Names (Use These)

- `createVueQsPlugin` - for Vue plugin creation
- `provideQueryAdapter` - for dependency injection
- `useQueryAdapter` - for retrieving injected adapter
- `createHistoryAdapter` - for browser history integration
- `createVueRouterAdapter` - for Vue Router integration
- `queryRef` - for single parameter reactive refs
- `queryReactive` - for reactive object state
- `enableTwoWaySync` - for bidirectional synchronization
- `defaultValue` - for parameter default values
- `historyStrategy` - for history management strategy
- `isEqual` - for value comparison function
- `shouldOmitDefault` - for controlling default value omission

### Serializer Names (Use These)

- `stringCodec` - for string serialization
- `numberCodec` - for number serialization
- `booleanCodec` - for boolean serialization
- `dateISOCodec` - for ISO date serialization
- `createJsonCodec` - for JSON serialization
- `createArrayCodec` - for array serialization
- `createEnumCodec` - for enum serialization

### Deprecated Names (Never Use These)

- ❌ `createVueQueryPlugin` - use `createVueQsPlugin`
- ❌ `arrayOf` - use `createArrayCodec`
- ❌ `enumOf` - use `createEnumCodec`
- ❌ `json` - use `createJsonCodec`
- ❌ `string`, `number`, `boolean` - use `*Codec` versions
- ❌ `dateISO` - use `dateISOCodec`
- ❌ `history` - use `historyStrategy`
- ❌ `equals` - use `isEqual`

## Documentation Standards

### Code Examples

- Always use the modern API names in examples
- Include TypeScript types in code samples
- Show both basic and advanced usage patterns
- Include error handling where appropriate

### API Documentation

- Keep documentation consistent across all languages (English/Chinese)
- Update both README and docs/ folder when making changes
- Regenerate TypeDoc documentation after API changes
- Verify all examples work with current API

## TypeScript Standards

### Type Safety

- Use strict TypeScript configuration
- Always specify explicit return types for exported functions
- Use proper generic type constraints
- Avoid `any` types - use proper type definitions

### Interface Design

- Create clear, well-documented interfaces
- Use consistent naming patterns for options interfaces
- Include JSDoc comments for all public APIs
- Export types alongside implementation

## Testing Requirements

### Test Coverage

- Maintain comprehensive test coverage
- Write tests for both success and error cases
- Test all public APIs and composables
- Include integration tests for adapters

### Test Organization

- Use kebab-case for test file names
- Group related tests in describe blocks
- Use clear, descriptive test names
- Test both reactive and non-reactive scenarios

## Vue.js Best Practices

### Composables

- Follow Vue 3 Composition API patterns
- Return consistent object shapes from composables
- Handle cleanup properly (watchers, subscriptions)
- Provide clear TypeScript types for returns

### Reactivity

- Use appropriate Vue reactivity APIs (ref, reactive, computed)
- Handle deep reactivity correctly for nested objects
- Implement proper cleanup to prevent memory leaks
- Test reactivity behavior thoroughly

## Build and Development

### Package Scripts

- Always run linting before builds
- Ensure tests pass before releasing
- Use proper TypeScript compilation checks
- Generate documentation as part of build process

### Dependencies

- Keep dependencies minimal and up-to-date
- Use peer dependencies for Vue and Vue Router
- Avoid unnecessary external dependencies
- Document any required peer dependencies

## Git and Branching

### Commit Standards

- Write clear, descriptive commit messages
- Make atomic commits for each logical change
- Run tests and linting before committing
- Update documentation in the same commit as code changes

### Code Review

- Verify all new code follows naming conventions
- Check that tests are included and passing
- Ensure documentation is updated
- Confirm TypeScript types are properly defined

## Common Patterns

### Error Handling

```typescript
try {
  // Implementation
} catch (error) {
  warn('Descriptive error message:', error);
  return fallback; // Always provide fallback
}
```

### Composable Structure

```typescript
export function useExample(options: ExampleOptions): ExampleReturn {
  // Setup
  const adapter = useQueryAdapter();

  // Implementation with proper cleanup
  onUnmounted(() => {
    // Cleanup
  });

  return {
    // Consistent return object
  };
}
```

### Import Example

```typescript
// External packages
import { ref, computed, watch } from 'vue';
import type { Router } from 'vue-router';

// Internal modules
import type { QueryAdapter, ParamSchema } from '@/types';
import { useQueryAdapter } from '@/adapter-context';
import { stringCodec } from '@/serializers';
```

## Remember

- **Quality over speed** - Always maintain code quality standards
- **Consistency is key** - Follow established patterns throughout
- **Documentation matters** - Keep docs updated with code changes
- **Test everything** - Ensure reliability through comprehensive testing
- **Modern APIs only** - Never introduce deprecated patterns
