---
trigger: always_on
description: Guidelines for agent behavior, including skill usage, Spec Kit workflows, and keeping Graphify updated.
---

## Agent Operational Guidelines

### 1. Leverage Specialized Skills
- When a task aligns with a specialized skill in the `skills` directory, actively load and apply instructions from its `SKILL.md`.
- Always notify the user when a skill is activated (e.g., *"I am using the **[Skill Name]** skill for this task."*).

### 2. Spec Kit (Specify CLI) Integration
- Use Spec Kit for spec-driven development workflows.
- Because `specify.exe` is blocked by Windows Application Control, always execute `specify` commands using Python directly:
  ```powershell
  & C:\Users\LOQ\AppData\Roaming\uv\tools\specify-cli\Scripts\python.exe -c "import sys, specify_cli; sys.argv = ['specify', '<command>']; specify_cli.main()"
  ```
- Major workflows:
  - `/speckit.constitution` to establish/update project principles
  - `/speckit.specify` to write/refactor requirements
  - `/speckit.plan` to generate technical design and implementation plans
  - `/speckit.tasks` to create TODO checklists
  - `/speckit.implement` to perform code updates

### 3. Keep Graphify Current
- Graphify helps maintain a semantic graph of the codebase.
- After modifying or adding any code files, run `graphify update .` to keep `graphify-out/graph.json` up to date.
- Use `graphify query "<question>"` to search/navigate the architecture before making major modifications.
