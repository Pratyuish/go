const lessons = [
  {
    title:"The Go mindset", duration:"15 MIN", lead:"Go favors clarity, small building blocks, and tooling that keeps teams consistent. Start with the shape of a Go program and the fastest feedback loop.",
    goals:["package main","imports","main()","go run"], concept:"Every executable Go program belongs to package main and starts in a main function. Imports are explicit; unused imports and variables are compile-time errors.",
    note:"Treat compiler feedback as a design assistant. Go’s strictness removes ambiguity before code reaches review.",
    code:`package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, Go!")\n}`,
    output:"Hello, Go!", quiz:["Which function starts an executable Go program?",["start()","main()","run()"],1,"Executable programs begin in main()."],
    challenge:["Personal greeting","Change the program to print your name and why you are learning Go.","Keep package main, import fmt, and edit the string passed to fmt.Println."],
    starter:`package main\n\nimport "fmt"\n\nfunc main() {\n    // Print your personal greeting here\n}`
  },
  {
    title:"Values and types", duration:"20 MIN", lead:"Variables store values, while types define the operations that are valid. Go can infer types without hiding them from the reader.",
    goals:["var","short declaration","constants","zero values"], concept:"Use := for short declarations inside functions, var when the zero value or an explicit type improves intent, and const for values fixed at compile time.",
    note:"A useful rule: prefer := locally, but choose explicit types at boundaries where precision communicates a contract.",
    code:`package main\n\nimport "fmt"\n\nfunc main() {\n    language := "Go"\n    year := 2009\n    stable := true\n\n    fmt.Println(language, year, stable)\n}`,
    output:"Go 2009 true", quiz:["What does := do inside a function?",["Declares and initializes variables","Creates constants","Imports a package"],0,"It declares variables and infers their types."],
    challenge:["Service metadata","Declare a service name, replica count, and health status, then print them on one line.","Try string, int, and bool values with short declarations."],
    starter:`package main\n\nimport "fmt"\n\nfunc main() {\n    service := ""\n    replicas := 0\n    healthy := false\n    fmt.Println(service, replicas, healthy)\n}`
  },
  {
    title:"Decisions and loops", duration:"20 MIN", lead:"Go keeps control flow deliberately small: if, switch, and one flexible for loop cover most branching and repetition.",
    goals:["if / else","switch","for","range"], concept:"Conditions do not use parentheses. The for keyword supports classic loops, while-style loops, infinite loops, and range iteration.",
    note:"Keep the happy path visually clear. Return early from invalid or error states instead of nesting the main logic deeply.",
    code:`package main\n\nimport "fmt"\n\nfunc main() {\n    for i := 1; i <= 3; i++ {\n        if i%2 == 0 {\n            fmt.Println(i, "even")\n        } else {\n            fmt.Println(i, "odd")\n        }\n    }\n}`,
    output:"1 odd\n2 even\n3 odd", quiz:["Which keyword handles every loop form in Go?",["loop","while","for"],2,"Go uses for for all loop styles."],
    challenge:["Health check sweep","Loop from 1 to 5 and print whether each instance number is odd or even.","Use i%2 to inspect the remainder after division by two."],
    starter:`package main\n\nimport "fmt"\n\nfunc main() {\n    for i := 1; i <= 5; i++ {\n        // Print odd or even\n        fmt.Println(i)\n    }\n}`
  },
  {
    title:"Functions", duration:"20 MIN", lead:"Functions make behavior reusable and testable. Go supports multiple return values, which is central to its explicit error-handling style.",
    goals:["parameters","return values","multiple returns","scope"], concept:"Parameter types follow names, and return types follow the parameter list. Returning both a result and an error is a normal Go contract.",
    note:"Let function names and types carry intent. If a function needs many flags, consider whether separate functions would be clearer.",
    code:`package main\n\nimport "fmt"\n\nfunc add(a int, b int) int {\n    return a + b\n}\n\nfunc main() {\n    total := add(7, 5)\n    fmt.Println(total)\n}`,
    output:"12", quiz:["Where is a Go function’s return type written?",["Before func","After the parameter list","Inside return"],1,"The return type follows the parameter list."],
    challenge:["Capacity calculator","Write a function that multiplies nodes by podsPerNode and returns total capacity.","Use two int parameters and one int return value."],
    starter:`package main\n\nimport "fmt"\n\nfunc capacity(nodes int, podsPerNode int) int {\n    // Return total capacity\n    return 0\n}\n\nfunc main() {\n    fmt.Println(capacity(3, 20))\n}`
  },
  {
    title:"Slices and maps", duration:"25 MIN", lead:"Slices are Go’s everyday sequence type. Maps provide key-value lookup. Both are reference-like data structures with important zero-value behavior.",
    goals:["arrays","slices","append","maps","range"], concept:"A slice describes a window over an underlying array. append may reuse or replace that array, so always use its returned slice value.",
    note:"Preallocate capacity when size is predictable, but measure before optimizing. Clear code remains the first priority.",
    code:`package main\n\nimport "fmt"\n\nfunc main() {\n    regions := []string{"eu-west-1", "ap-south-1"}\n    regions = append(regions, "us-east-1")\n\n    for i, region := range regions {\n        fmt.Println(i, region)\n    }\n}`,
    output:"0 eu-west-1\n1 ap-south-1\n2 us-east-1", quiz:["Why assign the result of append back to the slice?",["append always clears it","The backing array may change","Slices cannot grow"],1,"append can allocate a new backing array."],
    challenge:["Cluster inventory","Create a slice of cluster names, append one cluster, and print every name with range.","Use _, name := range clusters if you do not need the index."],
    starter:`package main\n\nimport "fmt"\n\nfunc main() {\n    clusters := []string{"dev", "stage"}\n    // Append prod and print each cluster\n    fmt.Println(clusters)\n}`
  },
  {
    title:"Structs and methods", duration:"25 MIN", lead:"Structs group related fields. Methods attach behavior to a named type while keeping data and operations easy to discover.",
    goals:["struct","composite literal","receiver","pointer receiver"], concept:"A method is a function with a receiver. Use a pointer receiver when the method must mutate the value or copying the value would be undesirable.",
    note:"Model domain concepts with small types. A Cluster struct is clearer than passing name, region, and replicas separately everywhere.",
    code:`package main\n\nimport "fmt"\n\ntype Cluster struct {\n    Name     string\n    Replicas int\n}\n\nfunc (c Cluster) Ready() bool {\n    return c.Replicas > 0\n}\n\nfunc main() {\n    c := Cluster{Name: "prod", Replicas: 3}\n    fmt.Println(c.Name, c.Ready())\n}`,
    output:"prod true", quiz:["When is a pointer receiver especially useful?",["When mutating the receiver","Only for strings","Only in main"],0,"Pointer receivers can modify the original value."],
    challenge:["Deployment model","Create a Deployment struct with Name and Replicas, plus a method that reports whether it is scaled.","A value receiver is enough when the method only reads fields."],
    starter:`package main\n\nimport "fmt"\n\ntype Deployment struct {\n    Name string\n    Replicas int\n}\n\n// Add an IsScaled method\n\nfunc main() {\n    d := Deployment{Name: "api", Replicas: 3}\n    fmt.Println(d)\n}`
  },
  {
    title:"Interfaces", duration:"25 MIN", lead:"Interfaces describe behavior. Types satisfy them implicitly, allowing flexible designs without inheritance declarations or framework-heavy abstractions.",
    goals:["behavior contracts","implicit satisfaction","composition","small interfaces"], concept:"A type implements an interface by having the required methods. No implements keyword is needed, and interfaces are usually best kept small.",
    note:"Accept interfaces and return concrete types when it improves testability—but define interfaces where they are consumed, not automatically for every type.",
    code:`package main\n\nimport "fmt"\n\ntype Checker interface {\n    Check() string\n}\n\ntype API struct{}\n\nfunc (API) Check() string { return "healthy" }\n\nfunc report(c Checker) {\n    fmt.Println(c.Check())\n}\n\nfunc main() {\n    report(API{})\n}`,
    output:"healthy", quiz:["How does a type implement an interface in Go?",["With implements","By declaring inheritance","By defining the required methods"],2,"Interface satisfaction is implicit."],
    challenge:["Notifier contract","Define a Notifier interface with Send() string, implement it on an Email type, and print the result.","The method set—not an explicit declaration—connects the type to the interface."],
    starter:`package main\n\nimport "fmt"\n\ntype Notifier interface {\n    Send() string\n}\n\ntype Email struct{}\n\n// Implement Send on Email\n\nfunc main() {\n    fmt.Println("Add your notifier")\n}`
  },
  {
    title:"Errors", duration:"25 MIN", lead:"Go treats errors as ordinary values. Callers inspect and handle them explicitly, keeping failure paths visible in normal control flow.",
    goals:["error values","errors.New","fmt.Errorf","early return"], concept:"Functions commonly return (value, error). Check err immediately, add useful context when crossing a boundary, and never silently discard a meaningful failure.",
    note:"Good error messages describe the failed operation and relevant context. Avoid logging and returning the same error at every layer.",
    code:`package main\n\nimport (\n    "errors"\n    "fmt"\n)\n\nfunc validate(replicas int) error {\n    if replicas < 1 {\n        return errors.New("replicas must be positive")\n    }\n    return nil\n}\n\nfunc main() {\n    if err := validate(0); err != nil {\n        fmt.Println("error:", err)\n        return\n    }\n    fmt.Println("valid")\n}`,
    output:"error: replicas must be positive", quiz:["What is the idiomatic first action after a function returns err?",["Ignore it","Check whether err != nil","Convert it to bool"],1,"Handle or return non-nil errors immediately."],
    challenge:["Port validator","Return an error when a port is outside 1–65535, otherwise return nil.","Use errors.New or fmt.Errorf, then check the returned error in main."],
    starter:`package main\n\nimport (\n    "errors"\n    "fmt"\n)\n\nfunc validatePort(port int) error {\n    // Validate the port range\n    return errors.New("not implemented")\n}\n\nfunc main() {\n    fmt.Println(validatePort(8080))\n}`
  }
];

const references={
  syntax:[["package main","Executable package"],["func main()","Program entry"],[":=","Declare + infer"],["if err != nil","Handle failure"],["for _, v := range xs","Iterate values"]],
  types:[["string","UTF-8 text"],["int","Machine-sized integer"],["bool","true / false"],["[]T","Slice of T"],["map[K]V","Key-value map"]],
  commands:[["go run .","Compile and run"],["go test ./...","Test all packages"],["go fmt ./...","Format packages"],["go vet ./...","Static checks"],["go mod tidy","Sync dependencies"]]
};

let current=Number(localStorage.getItem("go-current")||0);
let completed=new Set(JSON.parse(localStorage.getItem("go-completed")||"[]"));
let selectedAnswer=null;

const el=id=>document.getElementById(id);
function escapeHtml(value){return value.replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));}
function updateLines(){el("lineNumbers").textContent=el("codeEditor").value.split("\n").map((_,i)=>i+1).join("\n");}
function renderLesson(){
  const l=lessons[current]; selectedAnswer=null;
  el("lessonNumber").textContent=`LESSON ${String(current+1).padStart(2,"0")}`; el("lessonDuration").textContent=l.duration;
  el("lessonTitle").textContent=l.title; el("lessonLead").textContent=l.lead; el("lessonGoals").innerHTML=l.goals.map(g=>`<span>${escapeHtml(g)}</span>`).join("");
  el("lessonConcept").textContent=l.concept; el("mentorNote").textContent=l.note; el("codeEditor").value=l.code; el("codeOutput").textContent="Ready. Run the lesson example."; el("codeOutput").classList.remove("error"); updateLines();
  el("quizLesson").textContent=`Lesson ${String(current+1).padStart(2,"0")}`; el("quizQuestion").textContent=l.quiz[0];
  el("answerList").innerHTML=l.quiz[1].map((a,i)=>`<button class="answer-button" data-answer="${i}" type="button"><i>${String.fromCharCode(65+i)}</i><span>${escapeHtml(a)}</span></button>`).join("");
  el("quizResult").textContent=""; el("quizResult").className=""; el("challengeTitle").textContent=l.challenge[0]; el("challengeText").textContent=l.challenge[1]; el("hintText").textContent=l.challenge[2]; el("hintText").hidden=true; el("showHint").querySelector("span").textContent="+";
  document.querySelectorAll(".lesson-button").forEach((b,i)=>b.classList.toggle("active",i===current));
  const done=completed.has(current); el("completeLesson").classList.toggle("done",done); el("completeLesson").querySelector("span:last-child").textContent=done?"Lesson completed":"Mark lesson complete";
  localStorage.setItem("go-current",String(current)); bindAnswers();
}
function renderNav(){el("lessonList").innerHTML=lessons.map((l,i)=>`<button class="lesson-button ${i===current?"active":""}" data-lesson="${i}" type="button"><span class="lesson-index">${String(i+1).padStart(2,"0")}</span><span class="lesson-name">${escapeHtml(l.title)}</span><span class="lesson-state">${completed.has(i)?"✓":""}</span></button>`).join("");document.querySelectorAll(".lesson-button").forEach(b=>b.addEventListener("click",()=>{current=Number(b.dataset.lesson);renderNav();renderLesson();}));}
function updateProgress(){const count=completed.size,pct=Math.round(count/lessons.length*100);el("progressCount").textContent=`${count} / ${lessons.length}`;el("progressBar").style.width=`${pct}%`;el("headerProgress").style.width=`${pct*.42}px`;el("headerProgressText").textContent=`${pct}%`;el("moduleProgress").textContent=`${count} / ${lessons.length}`;el("progressMessage").textContent=count===lessons.length?"Foundations complete—ready for packages, testing, and APIs.":count?"Keep the momentum: one focused lesson at a time.":"Start with the Go mindset and your first program.";}
function bindAnswers(){document.querySelectorAll(".answer-button").forEach(b=>b.addEventListener("click",()=>{selectedAnswer=Number(b.dataset.answer);document.querySelectorAll(".answer-button").forEach(x=>x.classList.toggle("selected",x===b));el("quizResult").textContent="";}));}
function renderReference(key="syntax"){el("referenceContent").innerHTML=references[key].map(([code,meaning])=>`<div class="ref-row"><code>${escapeHtml(code)}</code><span>${escapeHtml(meaning)}</span></div>`).join("");}

el("completeLesson").addEventListener("click",()=>{completed.has(current)?completed.delete(current):completed.add(current);localStorage.setItem("go-completed",JSON.stringify([...completed]));renderNav();renderLesson();updateProgress();});
el("codeEditor").addEventListener("input",updateLines);el("codeEditor").addEventListener("keydown",e=>{if(e.key==="Tab"){e.preventDefault();const s=e.target.selectionStart,t=e.target.selectionEnd;e.target.value=e.target.value.slice(0,s)+"    "+e.target.value.slice(t);e.target.selectionStart=e.target.selectionEnd=s+4;updateLines();}});
el("runCode").addEventListener("click",()=>{const code=el("codeEditor").value,out=el("codeOutput");out.classList.remove("error");if(!/package\s+main/.test(code)){out.textContent="compile error: expected 'package main'";out.classList.add("error");return;}if(!/func\s+main\s*\(\s*\)/.test(code)){out.textContent="compile error: function main is undeclared";out.classList.add("error");return;}if(/not implemented|TODO/.test(code)){out.textContent="Exercise loaded. Replace the placeholder, then run again.";out.classList.add("error");return;}out.textContent=`$ go run main.go\n${lessons[current].output}\n\n✓ Example completed in the learning sandbox.`;});
el("resetCode").addEventListener("click",()=>{el("codeEditor").value=lessons[current].code;el("codeOutput").textContent="Example reset.";el("codeOutput").classList.remove("error");updateLines();});el("clearOutput").addEventListener("click",()=>{el("codeOutput").textContent="";});
el("checkAnswer").addEventListener("click",()=>{const result=el("quizResult"),correct=lessons[current].quiz[2];document.querySelectorAll(".answer-button").forEach((b,i)=>{b.classList.remove("correct","wrong");if(i===correct)b.classList.add("correct");if(i===selectedAnswer&&i!==correct)b.classList.add("wrong");});if(selectedAnswer===null){result.textContent="Choose an answer first.";result.className="fail";}else if(selectedAnswer===correct){result.textContent="Correct — "+lessons[current].quiz[3];result.className="success";}else{result.textContent="Review the highlighted answer.";result.className="fail";}});
el("showHint").addEventListener("click",()=>{const h=el("hintText");h.hidden=!h.hidden;el("showHint").querySelector("span").textContent=h.hidden?"+":"−";});el("loadChallenge").addEventListener("click",()=>{el("codeEditor").value=lessons[current].starter;el("codeOutput").textContent="Challenge starter loaded. Replace the placeholder code.";el("codeOutput").classList.remove("error");updateLines();el("course").scrollIntoView({behavior:"smooth"});});
document.querySelectorAll(".ref-tab").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".ref-tab").forEach(x=>{x.classList.toggle("active",x===b);x.setAttribute("aria-selected",String(x===b));});renderReference(b.dataset.ref);}));
el("resumeButton").addEventListener("click",()=>el("course").scrollIntoView({behavior:"smooth"}));el("themeToggle").addEventListener("click",()=>{document.documentElement.classList.toggle("light");localStorage.setItem("go-theme",document.documentElement.classList.contains("light")?"light":"dark");});if(localStorage.getItem("go-theme")==="light")document.documentElement.classList.add("light");
renderNav();renderLesson();renderReference();updateProgress();
