# Go Foundations Learning Website

An interactive beginner-friendly Go course with eight guided lessons, editable examples, simulated learning-sandbox output, quizzes, mini challenges, progress tracking, and a quick-reference panel.

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
