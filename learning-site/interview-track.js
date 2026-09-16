const interviewExercises = [
  {
    title: "Validate the inventory", duration: "15 MIN", lead: "Turn untrusted JSON into a dependable domain model with useful errors and deterministic output.",
    skills: ["validation", "error wrapping", "sorting"],
    requirements: ["Reject empty names, unsupported environments, non-positive node counts, and duplicate cluster names.", "Wrap errors with the cluster index and operation context.", "Sort accepted clusters by name before printing."],
    done: ["Table-driven validation tests pass", "errors.Is identifies sentinel failures", "output is stable across runs"],
    command: "cd cluster-inventory && go test ./exercises/01-validation/...",
    solution: "Keep validation in the domain package, return sentinel errors wrapped with %w, and sort a copy so callers do not observe unexpected mutation.",
    code: `func Validate(clusters []Cluster) error {\n    seen := make(map[string]struct{}, len(clusters))\n    for i, c := range clusters {\n        if c.Name == "" {\n            return fmt.Errorf("cluster %d: %w", i, ErrInvalidName)\n        }\n        if _, ok := seen[c.Name]; ok {\n            return fmt.Errorf("cluster %q: %w", c.Name, ErrDuplicateName)\n        }\n        seen[c.Name] = struct{}{}\n    }\n    return nil\n}`,
    followups: ["Why use errors.Is instead of comparing error strings?", "Would you collect every validation error or fail fast? Explain the API trade-off.", "How do you guarantee deterministic output without mutating caller-owned data?"]
  },
  {
    title: "Design testable boundaries", duration: "20 MIN", lead: "Separate loading, selection, and presentation so core logic can be tested without files or Kubernetes.",
    skills: ["interfaces", "composition", "dependency injection"],
    requirements: ["Define a small Source interface at the consumer boundary.", "Build a Service that filters clusters by region.", "Return concrete domain values and keep formatting outside the service."],
    done: ["fake source drives unit tests", "service has no file-system dependency", "interface contains one focused method"],
    command: "cd cluster-inventory && go test ./exercises/02-design/...",
    solution: "Define the interface where Service consumes it. Inject a fake in tests and keep the inventory domain independent of transport and presentation.",
    code: `type Source interface {\n    Load(ctx context.Context) ([]inventory.Cluster, error)\n}\n\ntype Service struct { source Source }\n\nfunc (s Service) ByRegion(ctx context.Context, region string) ([]inventory.Cluster, error) {\n    clusters, err := s.source.Load(ctx)\n    if err != nil { return nil, fmt.Errorf("load inventory: %w", err) }\n    return inventory.FilterRegion(clusters, region), nil\n}`,
    followups: ["Why should the consumer usually own this interface?", "When would an interface make this design worse?", "Where should JSON decoding errors gain domain context?"]
  },
  {
    title: "Make tests interview-grade", duration: "15 MIN", lead: "Use table-driven tests, subtests, fakes, and behavioral assertions that survive refactoring.",
    skills: ["table tests", "subtests", "fakes"],
    requirements: ["Cover valid, invalid, duplicate, and boundary inputs in a test table.", "Use t.Run names that describe behavior.", "Assert errors with errors.Is and outputs with explicit expected values."],
    done: ["go test ./... passes", "failure messages identify the case", "tests avoid implementation details"],
    command: "cd cluster-inventory && go test -race -cover ./exercises/03-testing/...",
    solution: "Each row should express input, expected output, and expected error. Keep cases independent and make failures readable before adding helpers.",
    code: `for _, tc := range tests {\n    t.Run(tc.name, func(t *testing.T) {\n        got, err := Normalize(tc.input)\n        if !errors.Is(err, tc.wantErr) {\n            t.Fatalf("Normalize() error = %v, want %v", err, tc.wantErr)\n        }\n        if !reflect.DeepEqual(got, tc.want) {\n            t.Fatalf("Normalize() = %#v, want %#v", got, tc.want)\n        }\n    })\n}`,
    followups: ["What belongs in a unit test versus an integration test?", "Why run the race detector even when ordinary tests pass?", "When do test helpers reduce clarity?"]
  },
  {
    title: "Collect concurrently", duration: "30 MIN", lead: "Query multiple clusters with a bounded worker pool while respecting cancellation and avoiding goroutine leaks.",
    skills: ["goroutines", "channels", "context", "worker pools"],
    requirements: ["Limit concurrent checks to a configurable worker count.", "Stop scheduling work when context is cancelled.", "Return results in stable input order and preserve per-cluster failures."],
    done: ["maximum concurrency is bounded", "cancellation test completes promptly", "go test -race reports no races"],
    command: "cd cluster-inventory && go test -race ./exercises/04-concurrency/...",
    solution: "Send indexed jobs to a fixed worker set, write indexed results through one channel, close channels from the owning goroutine, and select on ctx.Done at every blocking boundary.",
    code: `for i := 0; i < workers; i++ {\n    wg.Add(1)\n    go func() {\n        defer wg.Done()\n        for job := range jobs {\n            status, err := checker.Check(ctx, job.cluster)\n            results <- result{index: job.index, status: status, err: err}\n        }\n    }()\n}`,
    followups: ["Who owns closing each channel, and why?", "How would you prevent a slow dependency from consuming the full request deadline?", "When is errgroup simpler than a worker pool?"]
  },
  {
    title: "Defend the production design", duration: "30 MIN", lead: "Expose inventory through HTTP and explain reliability, observability, and rollout choices like a senior engineer.",
    skills: ["HTTP APIs", "timeouts", "observability", "graceful shutdown"],
    requirements: ["Add GET /clusters with region filtering and clear status codes.", "Configure server timeouts and graceful shutdown.", "Emit structured logs and define request, error, and latency metrics."],
    done: ["handler tests cover success and dependency failure", "shutdown honors a bounded context", "README records SLO and scaling decisions"],
    command: "cd cluster-inventory && go test -race ./exercises/05-production/...",
    solution: "Keep handlers thin, translate domain failures at the boundary, inject dependencies, set explicit server timeouts, and make cancellation flow from the request to every downstream call.",
    code: `srv := &http.Server{\n    Addr:              addr,\n    Handler:           handler,\n    ReadHeaderTimeout: 5 * time.Second,\n    ReadTimeout:       10 * time.Second,\n    WriteTimeout:      15 * time.Second,\n    IdleTimeout:       60 * time.Second,\n}`,
    followups: ["Which SLI and SLO would you choose for this API?", "How do retries interact with deadlines and retry storms?", "What would change if this queried 1,000 Kubernetes clusters every minute?"]
  }
];

let activeExercise = Number(localStorage.getItem("go-current-exercise") || 0);
let completedInterviewExercises = new Set(JSON.parse(localStorage.getItem("go-completed-exercises") || "[]"));
const byId = id => document.getElementById(id);
const safe = value => value.replace(/[&<>]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));

function renderExerciseNav() {
  byId("exerciseList").innerHTML = interviewExercises.map((exercise, index) => `
    <button class="exercise-button ${index === activeExercise ? "active" : ""}" data-exercise="${index}" type="button">
      <span class="exercise-index">${String(index + 1).padStart(2, "0")}</span>
      <span><b>${safe(exercise.title)}</b><small>${safe(exercise.duration)}</small></span>
      <i>${completedInterviewExercises.has(index) ? "✓" : ""}</i>
    </button>`).join("");
  document.querySelectorAll(".exercise-button").forEach(button => button.addEventListener("click", () => {
    activeExercise = Number(button.dataset.exercise); localStorage.setItem("go-current-exercise", activeExercise); renderExerciseNav(); renderExercise();
  }));
  byId("exerciseProgress").textContent = `${completedInterviewExercises.size} / ${interviewExercises.length}`;
}

function renderExercise() {
  const exercise = interviewExercises[activeExercise];
  byId("exerciseLevel").textContent = `EXERCISE ${String(activeExercise + 1).padStart(2, "0")}`;
  byId("exerciseDuration").textContent = exercise.duration; byId("exerciseTitle").textContent = exercise.title; byId("exerciseLead").textContent = exercise.lead;
  byId("exerciseSkills").innerHTML = exercise.skills.map(skill => `<span>${safe(skill)}</span>`).join("");
  byId("exerciseRequirements").innerHTML = exercise.requirements.map(item => `<li>${safe(item)}</li>`).join("");
  byId("exerciseDone").innerHTML = exercise.done.map(item => `<li>${safe(item)}</li>`).join("");
  byId("exerciseCommand").textContent = exercise.command; byId("solutionSummary").textContent = exercise.solution; byId("solutionCode").textContent = exercise.code;
  byId("exerciseFollowups").innerHTML = exercise.followups.map(item => `<li>${safe(item)}</li>`).join("");
  byId("solutionContent").hidden = true; byId("toggleSolution").setAttribute("aria-expanded", "false"); byId("toggleSolution").querySelector("span").textContent = "+";
  const done = completedInterviewExercises.has(activeExercise); byId("completeExercise").classList.toggle("done", done); byId("completeExercise").querySelector("span:last-child").textContent = done ? "Exercise completed" : "Mark exercise complete";
}

byId("toggleSolution").addEventListener("click", () => { const panel = byId("solutionContent"); panel.hidden = !panel.hidden; byId("toggleSolution").setAttribute("aria-expanded", String(!panel.hidden)); byId("toggleSolution").querySelector("span").textContent = panel.hidden ? "+" : "−"; });
byId("copyExerciseCommand").addEventListener("click", async () => { await navigator.clipboard.writeText(interviewExercises[activeExercise].command); byId("copyExerciseCommand").textContent = "Copied"; setTimeout(() => byId("copyExerciseCommand").textContent = "Copy", 1200); });
byId("completeExercise").addEventListener("click", () => { completedInterviewExercises.has(activeExercise) ? completedInterviewExercises.delete(activeExercise) : completedInterviewExercises.add(activeExercise); localStorage.setItem("go-completed-exercises", JSON.stringify([...completedInterviewExercises])); renderExerciseNav(); renderExercise(); });
renderExerciseNav(); renderExercise();
