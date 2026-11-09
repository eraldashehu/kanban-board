# FlowBoard

Drag-and-drop Kanban board for planning sprint work, with work-in-progress limits, due-date alerts and filters.
Built with **React 18**, **TypeScript** and **Ant Design 5**.

**Live demo:** https://eraldashehu.github.io/kanban-board/

## Features

- **Drag and drop** between and within columns, with a line that shows where the card will land.
- **Move menu** on every card as an accessible alternative, since touch screens don't support HTML5 drag and drop.
- **Work-in-progress limits** with an Ant Design `Alert` when a column is over its limit.
- **Add and edit tasks** in an Ant Design `Modal` + `Form` with validation (required title, max length, initials pattern).
- **Due-date status**: overdue and due-soon cards are highlighted.
- **Search** (deferred for smooth typing) and **priority filter**, plus a sprint progress bar.
- **Auto-saved** to `localStorage`.

## Tech stack

- [React 18](https://react.dev) with function components and hooks
- [TypeScript](https://www.typescriptlang.org) in strict mode
- [Ant Design 5](https://ant.design) components and `@ant-design/icons`
- [Day.js](https://day.js.org) for dates
- [Vite](https://vitejs.dev) for development and builds

## Getting started

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
git clone https://github.com/eraldashehu/kanban-board.git
cd kanban-board
npm install
npm run dev
```

Then open http://localhost:5173.

```bash
npm run typecheck # check types with tsc
npm run build     # type-check, then production build in dist/
npm run preview   # serve the build locally
```

## Architecture

```
src/
├── main.tsx
├── app/
│   ├── App.tsx                       # page layout
│   └── AppProviders.tsx              # ConfigProvider, AntApp, BoardProvider
├── shared/hooks/usePersistentReducer.ts
└── features/board/
    ├── index.ts                      # public API of the feature
    ├── model/
    │   ├── types.ts                  # Task, ColumnId and the BoardAction union
    │   ├── constants.ts              # columns, priorities, demo tasks
    │   ├── boardReducer.ts           # pure reducer: add, update, delete, move
    │   └── selectors.ts              # filter, group by column, progress, due status
    ├── context/BoardContext.tsx      # state and dispatch in two contexts
    ├── hooks/
    │   ├── useBoard.ts               # useBoardTasks, useBoardActions
    │   ├── useTaskFilters.ts         # search + priority, useDeferredValue
    │   ├── useDragAndDrop.ts         # native drag and drop with refs
    │   └── useTaskEditor.ts          # which task the dialog is editing
    └── components/                   # Board, BoardHeader, BoardToolbar, BoardColumn, TaskCard, TaskModal
```

## React techniques used, and why

| Technique | Where | Why |
|---|---|---|
| Context + `useReducer` | `BoardContext.tsx` | Every board change goes through one pure, testable reducer |
| Discriminated union actions | `types.ts` | Each action carries exactly the data it needs; typos fail at compile time |
| Split state / dispatch contexts | `BoardContext.tsx` | Components that only dispatch never re-render on data changes |
| Custom hooks | `useBoardActions`, `useTaskFilters`, `useDragAndDrop`, `useTaskEditor` | The `Board` component just wires hooks together |
| `useRef` for event data | `useDragAndDrop.ts` | Dragged id and drop target are needed in handlers, not for rendering |
| "Latest callback" ref | `useDragAndDrop.ts` | Handlers stay stable even when `onDrop` changes |
| `useCallback` | Drag handlers, editor actions | Stable props so memoized columns and cards can skip renders |
| `React.memo` | `BoardColumn`, `TaskCard`, `BoardToolbar`, `BoardHeader` | Only the column you drag over re-renders |
| Reducer returns the same array when nothing changed | `boardReducer.ts` | Dropping a card back in place causes no render at all |
| `useDeferredValue` | `useTaskFilters.ts` | Search input stays responsive while columns re-filter |
| Ant Design `Form` with `rules` | `TaskModal.tsx` | Declarative validation; `key` remounts the form for each task |

## Deploy

**GitHub Pages (automatic):** this repository includes `.github/workflows/deploy.yml`. In the repository go to **Settings → Pages**, set **Source** to **GitHub Actions**, then push. The app is published at `https://eraldashehu.github.io/kanban-board/`.

**GitLab Pages (automatic):** this repository includes `.gitlab-ci.yml`. Push it to GitLab and the live address appears under **Deploy → Pages**.

## Author

**Eralda Shehu**, Frontend Developer
[LinkedIn](https://www.linkedin.com/in/eralda-shehu/) · [GitHub](https://github.com/eraldashehu)
