# Phone Back Button PWA - Interview Task

A production-ready PWA built with React, TypeScript, and react-modal-sheet demonstrating nested bottom sheets and full back button support.

## ✅ Task Checklist

### Final App Flow & Expected Behavior

* [x] First load → /welcome → shows a big “Welcome” screen
* [x] User taps “Open Sheet A” → Bottom Sheet A slides up
* [x] Inside Sheet A, user taps “Open Sheet B” → Bottom Sheet B slides up on top of Sheet A
* [x] Android back button / browser back button behavior:

    * [x] Sheet B open → close Sheet B only, Sheet A stays open
    * [x] Sheet A open (after closing B) → close Sheet A, return to Welcome page
    * [x] Welcome page → triggers native browser/PWA exit dialog if unsaved changes

### Exact Requirements

1. Must be a real PWA

    * [x] Installable (manifest + service worker)
    * [x] Works offline (caches the shell)
2. Full back-button support

    * [x] Correctly handle the very first back button on the welcome page
    * [x] Works on Android Chrome (physical back button) and desktop browser back button
3. Bottom sheets

    * [x] Sheet A = 50% height
    * [x] Sheet B = 80% height

## Project Structure

```
src/
├─ App.tsx                 # Main app, renders sheets and welcome page
├─ main.tsx                # React DOM entry point with BackStackProvider
├─ pages/
│  └─ welcome.tsx          # Welcome page component
├─ bottomSheets/
│  ├─ sheetA.tsx
│  ├─ sheetB.tsx
│  └─ index.ts             # Barrel export
├─ backStack/
│  ├─ BackStackProvider.tsx  # Context provider
│  ├─ useBackStack.ts        # Hook to use context
│  ├─ historyAdapter.ts      # Adapter for browser history events
│  ├─ stackReducer.ts        # Reducer for stack state
│  ├─ stackSerializer.ts     # Serialize stack to URL
│  ├─ backStack.types.ts     # Type definitions
│  └─ index.ts               # Barrel export
├─ index.css                # Tailwind global styles
```

## How to Run

```bash
npm install
npm run dev        # development
npm run build      # production
npm run preview    # preview built app
```

## Tests

The project includes comprehensive unit tests for the back stack functionality using Vitest and React Testing Library.

### Running Tests

```bash
npm test          # run tests once
```

### Test Coverage

The test suite covers:

- **Stack Management**: Push/pop operations and state management
- **History Integration**: Browser history synchronization and back button handling
- **URL Serialization**: Stack state persistence in URL parameters
- **Popstate Events**: Hardware/browser back button behavior
- **Edge Cases**: Empty stack handling and multiple operations

### Test Files

- `src/backStack/useBackStack.test.ts` - Core back stack hook tests
- `src/test/setup.ts` - Test environment configuration

### Key Test Scenarios

```typescript
// History is only created on first sheet opening
it('updates browser history only on first push')

// Manual closing doesn't create history entries
it('does not update browser history when popping a step')

// Back button closes sheets properly
it('closes top-most sheet when popstate fires and sheets are open')

// Multiple back presses work correctly
it('closes all sheets one by one on repeated popstate events')
```

## Usage

```tsx
<WelcomePage onOpenSheetA={() => push('A')} />

<Sheet isOpen={hasStep('A')} onClose={pop}>...</Sheet>
<Sheet isOpen={hasStep('B')} onClose={pop}>...</Sheet>
```
## Notes

* `stack` is the source of truth, URL is derived.
* URL is read only once on page load for deep linking.
* Hardware back button and browser back are fully supported via `popstate` listener.

Built with ❤️ using React, and TypeScript for the Snapp! box interview task

