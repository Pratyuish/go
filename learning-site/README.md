# Go Foundations Learning Website

An interactive Go course with eight foundation lessons plus a senior interview track built around a runnable cluster-inventory project.

## Senior interview track

The `cluster-inventory/` module contains five progressive platform-engineering exercises:

1. Validation, wrapped errors, and deterministic output
2. Consumer-owned interfaces and testable boundaries
3. Table-driven tests and behavioral assertions
4. Bounded concurrency, cancellation, and race safety
5. HTTP boundaries, timeouts, graceful shutdown, and observability decisions

Each exercise includes runnable reference code, tests, solution guidance on the website, and senior-level interviewer follow-up questions.

## Run locally

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

No build step or external dependencies are required. Course progress and theme preference are stored in the browser with `localStorage`.

## Files

- `index.html` — accessible page structure and course workspace
- `styles.css` — responsive visual design
- `app.js` — lessons, code sandbox behavior, quizzes, challenges, and progress

> The browser sandbox validates and simulates the bundled lesson examples; it does not execute arbitrary Go code. Use the official Go toolchain for full compilation and testing.
