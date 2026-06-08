# Feedback Log

> User corrections and preference signals. Write here immediately when the user corrects routing, tool choice, assumptions, or output shape.

## Entries

### 2026-06-08 - Deploy root `.agent`
- **Context**: User clarified this open-source repo is based on a real `.agent` implementation and should also deploy the system.
- **Correction**: Treat root `.agent/` as a tracked dogfood deployment, not a local ignored folder.
- **Applied to**: `.gitignore`, `.agent/index.md`, `.agent/memory/facts.md`.
