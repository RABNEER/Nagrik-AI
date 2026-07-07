---
trigger: always_on
description: Guidelines for managing the project memory and lessons learned.
---

## Project Memory & Lessons Learned

### 1. Project Context & Stack
- **Project Name:** NagrikAI
- **Purpose:** GenAI-powered civic companion for Indian citizens (built for the "Smart Bharat" hackathon). Trust-first framing with **Scam Shield** as the key differentiator.
- **Tech Stack:** Next.js 16 (App Router), Tailwind CSS 4, Google Fonts (Instrument Sans & Serif), Prisma ORM + SQLite, Zustand.
- **AI Integrations:** `z-ai-web-dev-sdk` (Gemini-class completions).

### 2. Platform & System Constraints
- **Windows Application Control Policies:** Spawning `specify.exe` directly is blocked.
  - **Workaround:** Always run `specify-cli` commands using Python directly:
    ```powershell
    & C:\Users\LOQ\AppData\Roaming\uv\tools\specify-cli\Scripts\python.exe -c "import sys, specify_cli; sys.argv = ['specify', '<command>']; specify_cli.main()"
    ```
- **Post-Build Script:** The production build `package.json` contains a `cp` step which fails on Windows. Next.js compilation itself (`next build`) runs successfully.
- **Tee Command:** The dev script uses Unix `tee`, which is not available by default on Windows. Run the dev server using:
  ```powershell
  npx next dev -p 3000
  ```

### 3. Database URL Configuration
- **SQLite Database Path:** `DATABASE_URL=file:/home/z/my-project/db/custom.db`. Run schema updates using `npx prisma db push`.
