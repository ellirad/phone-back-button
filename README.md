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
serve -s dist      # serve built app for testing PWA on mobile
```

## Usage

```tsx
<WelcomePage onOpenSheetA={() => push('A')} />

<Sheet isOpen={hasStep('A')} onClose={pop}>...</Sheet>
<Sheet isOpen={hasStep('B')} onClose={pop}>...</Sheet>
```

**Back stack API**:

```ts
const { stack, push, pop, hasStep } = useBackStack()

push('A')        // Opens Sheet A
push('B')        // Opens Sheet B
pop()            // Closes the top sheet
hasStep('A')     // true if Sheet A is open
```

* URL is automatically updated: `?stack=A,B`
* Browser back button closes sheets in reverse order

## Notes

* `stack` is the source of truth, URL is derived.
* URL is read only once on page load for deep linking.
* Hardware back button and browser back are fully supported via `popstate` listener.

Built with ❤️ using React, and TypeScript for the Snapp! box interview task

