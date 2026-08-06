# Coding Style

## General
- Prefer the simplest working solution.
- Minimize lines of code.
- Avoid unnecessary abstractions.
- Do not over-engineer.
- Refactor only when there is clear duplication.
- Keep functions under 30 lines when possible.
- Avoid creating helper functions used only once.
- Use early returns.
- Prefer readability over cleverness.

## Angular
- Follow Angular style guide.
- Use standalone components.
- Avoid Renderer2 unless required.
- Avoid unnecessary services.
- Don't wrap simple DOM operations in abstractions.
- Use signals only when they simplify the code.
- Keep component logic in one file unless it becomes large.

## Comments
- Do not add comments explaining obvious code.
- Only comment non-obvious business logic.

## Error Handling
- Don't add defensive checks unless they're realistically needed.
- Avoid excessive try/catch blocks.

## Imports
- Remove unused imports.
- Keep imports sorted.

## Refactoring
- Prefer editing existing code over rewriting files.
- Preserve current architecture.
- Don't introduce patterns (Factory, Strategy, Repository, etc.) unless explicitly requested.

## Output
- Produce production-ready code.
- Minimize code size while maintaining readability.
- Explain changes briefly after editing.




# Project Philosophy

Write code as if this project will be maintained by one experienced developer.

## Priorities

1. Simplicity
2. Readability
3. Maintainability
4. Performance
5. Reusability

## Rules

- Keep code small.
- Avoid unnecessary abstractions.
- Do not create helper methods used only once.
- Edit existing code instead of rewriting files.
- Avoid over-engineering.
- Follow Angular Style Guide.
- Prefer composition over inheritance.
- Use early returns.
- Keep functions focused.
- Remove dead code.
- Remove unused imports.
- No comments unless explaining business logic.
- Do not create services, directives, or utilities unless they are reused.
- Prefer built-in Angular APIs.
- Avoid defensive programming for impossible cases.
- If there are multiple valid solutions, choose the simplest one.
- Don't optimize for hypothetical future requirements.

## Before Writing Code

Ask:
- Can this be done with less code?
- Is there an existing Angular API?
- Is this abstraction actually reused?
- Would another developer understand this in 30 seconds?

If not, simplify it.