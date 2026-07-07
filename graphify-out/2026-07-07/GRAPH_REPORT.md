# Graph Report - NagrikAI  (2026-07-07)

## Corpus Check
- 135 files · ~59,189 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 863 nodes · 1289 edges · 76 communities (61 shown, 15 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `51c1c8f6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_dependencies|dependencies]]
- [[_COMMUNITY_chat-companion.tsx|chat-companion.tsx]]
- [[_COMMUNITY_sidebar.tsx|sidebar.tsx]]
- [[_COMMUNITY_utils.ts|utils.ts]]
- [[_COMMUNITY_cn|cn]]
- [[_COMMUNITY_react|react]]
- [[_COMMUNITY_use-toast.ts|use-toast.ts]]
- [[_COMMUNITY_types.ts|types.ts]]
- [[_COMMUNITY_Tasks FEATURE NAME|Tasks: [FEATURE NAME]]]
- [[_COMMUNITY_speckit.analyze.agent|speckit.analyze.agent.md]]
- [[_COMMUNITY_devDependencies|devDependencies]]
- [[_COMMUNITY_NagrikAI — Your Trusted AI Companion for Every Government Service|NagrikAI — Your Trusted AI Companion for Every Government Service]]
- [[_COMMUNITY_command.tsx|command.tsx]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_components.json|components.json]]
- [[_COMMUNITY_menubar.tsx|menubar.tsx]]
- [[_COMMUNITY_Execution Steps|Execution Steps]]
- [[_COMMUNITY_context-menu.tsx|context-menu.tsx]]
- [[_COMMUNITY_common.ps1|common.ps1]]
- [[_COMMUNITY_carousel.tsx|carousel.tsx]]
- [[_COMMUNITY_Feature Specification FEATURE NAME|Feature Specification: [FEATURE NAME]]]
- [[_COMMUNITY_speckit.plan.agent|speckit.plan.agent.md]]
- [[_COMMUNITY_speckit.specify.agent|speckit.specify.agent.md]]
- [[_COMMUNITY_speckit.tasks.agent|speckit.tasks.agent.md]]
- [[_COMMUNITY_Core Principles|Core Principles]]
- [[_COMMUNITY_Core Principles|Core Principles]]
- [[_COMMUNITY_drawer.tsx|drawer.tsx]]
- [[_COMMUNITY_select.tsx|select.tsx]]
- [[_COMMUNITY_navigation-menu.tsx|navigation-menu.tsx]]
- [[_COMMUNITY_Implementation Plan FEATURE|Implementation Plan: [FEATURE]]]
- [[_COMMUNITY_speckit.checklist.agent|speckit.checklist.agent.md]]
- [[_COMMUNITY_sheet.tsx|sheet.tsx]]
- [[_COMMUNITY_speckit.clarify.agent|speckit.clarify.agent.md]]
- [[_COMMUNITY_speckit.implement.agent|speckit.implement.agent.md]]
- [[_COMMUNITY_toggle-group.tsx|toggle-group.tsx]]
- [[_COMMUNITY_dev.sh|dev.sh]]
- [[_COMMUNITY_Agent Operational Guidelines|Agent Operational Guidelines]]
- [[_COMMUNITY_speckit.constitution.agent|speckit.constitution.agent.md]]
- [[_COMMUNITY_speckit.taskstoissues.agent|speckit.taskstoissues.agent.md]]
- [[_COMMUNITY_CHECKLIST TYPE Checklist FEATURE NAME|[CHECKLIST TYPE] Checklist: [FEATURE NAME]]]
- [[_COMMUNITY_alert.tsx|alert.tsx]]
- [[_COMMUNITY_popover.tsx|popover.tsx]]
- [[_COMMUNITY_Project Memory & Lessons Learned|Project Memory & Lessons Learned]]
- [[_COMMUNITY_eslint.config.mjs|eslint.config.mjs]]
- [[_COMMUNITY_create-new-feature.ps1|create-new-feature.ps1]]
- [[_COMMUNITY_mini-services-start.sh|mini-services-start.sh]]
- [[_COMMUNITY_sonner|sonner]]
- [[_COMMUNITY_build.sh|build.sh]]
- [[_COMMUNITY_mini-services-build.sh|mini-services-build.sh]]
- [[_COMMUNITY_mini-services-install.sh|mini-services-install.sh]]
- [[_COMMUNITY_start.sh|start.sh]]
- [[_COMMUNITY_AGENTS|AGENTS.md]]
- [[_COMMUNITY_graphify|graphify.md]]
- [[_COMMUNITY_graphify|graphify.md]]
- [[_COMMUNITY_next.config.ts|next.config.ts]]
- [[_COMMUNITY_postcss.config.mjs|postcss.config.mjs]]
- [[_COMMUNITY_tailwind.config.ts|tailwind.config.ts]]
- [[_COMMUNITY_worklog|worklog.md]]
- [[_COMMUNITY_toggle-group.tsx|toggle-group.tsx]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 239 edges
2. `react` - 17 edges
3. `useApp` - 17 edges
4. `compilerOptions` - 17 edges
5. `useTranslation()` - 14 edges
6. `Tasks: [FEATURE NAME]` - 13 edges
7. `useToast()` - 11 edges
8. `NagrikAI — Your Trusted AI Companion for Every Government Service` - 10 edges
9. `scripts` - 9 edges
10. `Header()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `CalendarDayButton()` --references--> `react`  [EXTRACTED]
  src/components/ui/calendar.tsx → package.json
- `Carousel()` --references--> `react`  [EXTRACTED]
  src/components/ui/carousel.tsx → package.json
- `useCarousel()` --references--> `react`  [EXTRACTED]
  src/components/ui/carousel.tsx → package.json
- `useFormField()` --references--> `react`  [EXTRACTED]
  src/components/ui/form.tsx → package.json
- `useSidebar()` --references--> `react`  [EXTRACTED]
  src/components/ui/sidebar.tsx → package.json

## Import Cycles
- None detected.

## Communities (76 total, 15 thin omitted)

### Community 0 - "dependencies"
Cohesion: 0.03
Nodes (64): dependencies, class-variance-authority, clsx, cmdk, date-fns, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities (+56 more)

### Community 1 - "chat-companion.tsx"
Cohesion: 0.06
Nodes (49): AnimatedSphere(), ChatCompanion(), Msg, QUICK_REFS, SUGGESTIONS, WELCOME, Footer(), EXAMPLES (+41 more)

### Community 2 - "sidebar.tsx"
Cohesion: 0.07
Nodes (32): Input(), Separator(), Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup() (+24 more)

### Community 3 - "utils.ts"
Cohesion: 0.07
Nodes (32): AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay(), AlertDialogTitle() (+24 more)

### Community 4 - "cn"
Cohesion: 0.09
Nodes (33): Avatar(), AvatarFallback(), AvatarImage(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage() (+25 more)

### Community 5 - "react"
Cohesion: 0.10
Nodes (19): input-otp, react, ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent() (+11 more)

### Community 6 - "use-toast.ts"
Cohesion: 0.09
Nodes (27): instrumentSans, instrumentSerif, jetbrainsMono, metadata, Toast, ToastAction, ToastActionElement, ToastClose (+19 more)

### Community 7 - "types.ts"
Cohesion: 0.09
Nodes (24): LANG_NAMES, POST(), LANG_NAMES, makeTicketId(), POST(), LANG_NAMES, globalForPrisma, callLLM() (+16 more)

### Community 8 - "Tasks: [FEATURE NAME]"
Cohesion: 0.07
Nodes (26): Dependencies & Execution Order, Format: `[ID] [P?] [Story] Description`, Implementation for User Story 1, Implementation for User Story 2, Implementation for User Story 3, Implementation Strategy, Incremental Delivery, MVP First (User Story 1 Only) (+18 more)

### Community 9 - "speckit.analyze.agent.md"
Cohesion: 0.08
Nodes (25): 1. Initialize Analysis Context, 2. Load Artifacts (Progressive Disclosure), 3. Build Semantic Models, 4. Detection Passes (Token-Efficient Analysis), 5. Severity Assignment, 6. Produce Compact Analysis Report, 7. Provide Next Actions, 8. Offer Remediation (+17 more)

### Community 10 - "devDependencies"
Cohesion: 0.09
Nodes (22): devDependencies, bun-types, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, tw-animate-css, @types/react (+14 more)

### Community 11 - "NagrikAI — Your Trusted AI Companion for Every Government Service"
Cohesion: 0.09
Nodes (21): 1. Landing Page, 2. AI Chat Companion, 3. Scam Shield ⭐, 4. Grievance Reporting + Tracker, 5. Service Directory, (a) How the service reference data grounds responses, (b) Intent detection logic, (c) Scam Shield heuristic design (+13 more)

### Community 12 - "command.tsx"
Cohesion: 0.12
Nodes (15): Command(), CommandDialog(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator(), CommandShortcut() (+7 more)

### Community 13 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+12 more)

### Community 14 - "components.json"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 15 - "menubar.tsx"
Cohesion: 0.12
Nodes (11): Menubar(), MenubarCheckboxItem(), MenubarContent(), MenubarItem(), MenubarLabel(), MenubarRadioItem(), MenubarSeparator(), MenubarShortcut() (+3 more)

### Community 16 - "Execution Steps"
Cohesion: 0.12
Nodes (15): 1. Initialize Convergence Context, 2. Load Artifacts (Progressive Disclosure), 3. Build the Intent Inventory, 4. Assess the Codebase and Classify Findings, 5. Assign Severity, 6. Present the In-Session Findings Summary, 7. Append Convergence Tasks (or report converged), 8. Provide Next Actions (Handoff) (+7 more)

### Community 17 - "context-menu.tsx"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubContent() (+1 more)

### Community 18 - "common.ps1"
Cohesion: 0.22
Nodes (10): Find-SpecifyRoot(), Format-SpecKitCommand(), Get-CurrentBranch(), Get-FeaturePathsEnv(), Get-InvokeSeparator(), Get-Python3Command(), Get-RepoRoot(), Resolve-SpecifyInitDir() (+2 more)

### Community 19 - "carousel.tsx"
Cohesion: 0.22
Nodes (10): FormControl(), FormDescription(), FormFieldContext, FormFieldContextValue, FormItemContext, FormItemContextValue, FormLabel(), FormMessage() (+2 more)

### Community 20 - "Feature Specification: [FEATURE NAME]"
Cohesion: 0.15
Nodes (12): Assumptions, Edge Cases, Feature Specification: [FEATURE NAME], Functional Requirements, Key Entities *(include if feature involves data)*, Measurable Outcomes, Requirements *(mandatory)*, Success Criteria *(mandatory)* (+4 more)

### Community 21 - "speckit.plan.agent.md"
Cohesion: 0.18
Nodes (10): Completion Report, Done When, Key rules, Mandatory Post-Execution Hooks, Outline, Phase 0: Outline & Research, Phase 1: Design & Contracts, Phases (+2 more)

### Community 22 - "speckit.specify.agent.md"
Cohesion: 0.18
Nodes (10): Completion Report, Done When, For AI Generation, Mandatory Post-Execution Hooks, Outline, Pre-Execution Checks, Quick Guidelines, Section Requirements (+2 more)

### Community 23 - "speckit.tasks.agent.md"
Cohesion: 0.18
Nodes (10): Checklist Format (REQUIRED), Completion Report, Done When, Mandatory Post-Execution Hooks, Outline, Phase Structure, Pre-Execution Checks, Task Generation Rules (+2 more)

### Community 24 - "Core Principles"
Cohesion: 0.18
Nodes (10): Core Principles, Governance, [PRINCIPLE_1_NAME], [PRINCIPLE_2_NAME], [PRINCIPLE_3_NAME], [PRINCIPLE_4_NAME], [PRINCIPLE_5_NAME], [PROJECT_NAME] Constitution (+2 more)

### Community 25 - "Core Principles"
Cohesion: 0.18
Nodes (10): Core Principles, Governance, [PRINCIPLE_1_NAME], [PRINCIPLE_2_NAME], [PRINCIPLE_3_NAME], [PRINCIPLE_4_NAME], [PRINCIPLE_5_NAME], [PROJECT_NAME] Constitution (+2 more)

### Community 26 - "drawer.tsx"
Cohesion: 0.18
Nodes (6): DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerTitle()

### Community 27 - "select.tsx"
Cohesion: 0.18
Nodes (7): SelectContent(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator(), SelectTrigger()

### Community 28 - "navigation-menu.tsx"
Cohesion: 0.22
Nodes (9): NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuTrigger(), navigationMenuTriggerStyle (+1 more)

### Community 29 - "Implementation Plan: [FEATURE]"
Cohesion: 0.22
Nodes (8): Complexity Tracking, Constitution Check, Documentation (this feature), Implementation Plan: [FEATURE], Project Structure, Source Code (repository root), Summary, Technical Context

### Community 30 - "speckit.checklist.agent.md"
Cohesion: 0.25
Nodes (7): Anti-Examples: What NOT To Do, Checklist Purpose: "Unit Tests for English", Example Checklist Types & Sample Items, Execution Steps, Post-Execution Checks, Pre-Execution Checks, User Input

### Community 31 - "sheet.tsx"
Cohesion: 0.18
Nodes (7): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 32 - "speckit.clarify.agent.md"
Cohesion: 0.29
Nodes (6): Completion Report, Done When, Mandatory Post-Execution Hooks, Outline, Pre-Execution Checks, User Input

### Community 33 - "speckit.implement.agent.md"
Cohesion: 0.29
Nodes (6): Completion Report, Done When, Mandatory Post-Execution Hooks, Outline, Pre-Execution Checks, User Input

### Community 34 - "toggle-group.tsx"
Cohesion: 0.08
Nodes (12): AccordionContent(), AccordionItem(), AccordionTrigger(), Badge(), badgeVariants, Checkbox(), HoverCardContent(), Progress() (+4 more)

### Community 35 - "dev.sh"
Cohesion: 0.57
Nodes (5): log_step_end(), log_step_start(), dev.sh script, start_mini_services(), wait_for_service()

### Community 36 - "Agent Operational Guidelines"
Cohesion: 0.40
Nodes (4): 1. Leverage Specialized Skills, 2. Spec Kit (Specify CLI) Integration, 3. Keep Graphify Current, Agent Operational Guidelines

### Community 37 - "speckit.constitution.agent.md"
Cohesion: 0.40
Nodes (4): Outline, Post-Execution Checks, Pre-Execution Checks, User Input

### Community 38 - "speckit.taskstoissues.agent.md"
Cohesion: 0.40
Nodes (4): Outline, Post-Execution Checks, Pre-Execution Checks, User Input

### Community 39 - "[CHECKLIST TYPE] Checklist: [FEATURE NAME]"
Cohesion: 0.40
Nodes (4): [Category 1], [Category 2], [CHECKLIST TYPE] Checklist: [FEATURE NAME], Notes

### Community 40 - "alert.tsx"
Cohesion: 0.50
Nodes (4): Alert(), AlertDescription(), AlertTitle(), alertVariants

### Community 42 - "Project Memory & Lessons Learned"
Cohesion: 0.40
Nodes (4): 1. Project Context & Stack, 2. Platform & System Constraints, 3. Database URL Configuration, Project Memory & Lessons Learned

### Community 43 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): __dirname, eslintConfig, __filename

### Community 78 - "toggle-group.tsx"
Cohesion: 0.43
Nodes (5): ToggleGroup(), ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants

## Knowledge Gaps
- **353 isolated node(s):** `build.sh script`, `NEXT_TELEMETRY_DISABLED`, `start.sh script`, `$schema`, `style` (+348 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `chat-companion.tsx`, `toggle-group.tsx`, `utils.ts`, `sidebar.tsx`, `react`, `use-toast.ts`, `alert.tsx`, `popover.tsx`, `command.tsx`, `toggle-group.tsx`, `menubar.tsx`, `context-menu.tsx`, `carousel.tsx`, `drawer.tsx`, `select.tsx`, `navigation-menu.tsx`, `sheet.tsx`?**
  _High betweenness centrality (0.261) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `sonner`, `devDependencies`, `react`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `dependencies`, `chat-companion.tsx`, `sidebar.tsx`, `utils.ts`, `toggle-group.tsx`, `carousel.tsx`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **What connects `build.sh script`, `NEXT_TELEMETRY_DISABLED`, `start.sh script` to the rest of the system?**
  _354 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.03125 - nodes in this community are weakly interconnected._
- **Should `chat-companion.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.056140350877192984 - nodes in this community are weakly interconnected._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07207207207207207 - nodes in this community are weakly interconnected._