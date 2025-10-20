# TODO

## Missing Mandatory features

- [ ] Integrate codemirror
- [ ] File renaming
- [ ] File deletion
- [ ] ! Synchronization on tabs/open editors when moving/renaming files
- [x] Support multiple vaults
- [ ] Fulltext search
- [ ] Feedback with toasts/notifications
- [ ] Export to PDF/HTML/MD

## Bugs

- [ ] File is created but there is an error after (this does not open the file as the current file because of that)

## Features to implement

- [x] Drag and drop to move files in the tree
  - [x] implementation mv of the file
  - [ ] implem of cp
  - [ ] implem of rename
  - [ ] handle edge cases (ex: moving a folder into itself)
  - [ ] update all the open tabs if a file is moved/renamed
- [ ] Tests
  - [ ] E2E tests for the side-bar/drag and drop
    - [ ] mock the server calls
    - [ ] mock the file system -> use a temp folder?
    - [ ] -> needs multiple vault support
- [x] Auto save
- [x] Sync active file between tabs and sidebar
  - [x] Show active file in sidebar
- [ ] Faire l'editeur markdown realtime (comme obsidian)
  - [ ] Bold, Italic, Strikethrough
  - [ ] Headings
  - [ ] Links
    - [ ] Internal links (to other notes)
    - [ ] External links (to web pages)
  - [ ] Lists (ordered, unordered, task)
  - [ ] Code blocks
  - [ ] Lists (ordered, unordered, task)
    - [ ] Checkboxes
    - [ ] Nested lists
  - [ ] Blockquotes
  - [ ] Inline code
  - [ ] Images
  - [ ] Horizontal rules
  - [ ] Tables
  - [ ] Footnotes
- [ ] Tooltips
  - [ ] Show full file name on hover in sidebar
  - [ ] Show full tab name on hover in tabs
- [ ] Keyboard shortcuts
  - [ ] Open file (in sidebar)
  - [ ] Create new file
  - [ ] Create new folder
  - [ ] Rename file/folder
  - [ ] Delete file/folder
  - [ ] Save file
  - [ ] Close tab
  - [ ] Switch between tabs
  - [x] Open command palette (Ctrl+K)
- [ ] Command palette
  - [x] Open file
  - [ ] Create new file (zed editor style)
  - [ ] Create new folder
  - [ ] Rename file/folder
- [ ] Tabs
  - [ ] Drag and drop to reorder tabs
  - [ ] Animated tab opening/closing
  - [ ] Close tab on middle click
  - [ ] Tab context menu (close other tabs, close to the right, etc)
  - [ ] Tab overflow handling (scrolling, dropdown, etc)
- Right click (context) menu
- Custom Sidebar width
- "Preview click" like vscode
  - click on open the file in preview mode (not permanent tab)
  - open a file in permanent tab on double click or edit
- Commencer à gérer le mode hors-ligne
  - Indiquer que l'on est hors ligne
  - Empêcher certaines actions (ex: création de fichier)
  - Permettre d'autres actions (ex: édition de fichier déjà ouvert)
