import { useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import { CheckCircle2, Code2, PlayCircle } from "lucide-react";
import api from "../services/api";

function normalizeExportedCode(code) {
  return code.replace(/export\s+function/g, "function").replace(/export\s+const/g, "const");
}

function CodingLabPage() {
  const [exercises, setExercises] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [code, setCode] = useState("");
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState({ role: "", difficulty: "" });

  useEffect(() => {
    const fetchExercises = async () => {
      const { data } = await api.get("/coding/exercises");
      setExercises(data.exercises);
      setSelectedId(data.exercises[0]?._id || null);
      setCode(data.exercises[0]?.starterCode || "");
    };

    fetchExercises();
  }, []);

  const filteredExercises = useMemo(
    () =>
      exercises.filter((exercise) => {
        const roleMatch = !filters.role || exercise.role === filters.role;
        const difficultyMatch = !filters.difficulty || exercise.difficulty === filters.difficulty;
        return roleMatch && difficultyMatch;
      }),
    [exercises, filters]
  );

  const selectedExercise = filteredExercises.find((item) => item._id === selectedId) || filteredExercises[0] || null;

  useEffect(() => {
    if (selectedExercise) {
      setSelectedId(selectedExercise._id);
      setCode(selectedExercise.starterCode);
      setResults([]);
    }
  }, [selectedExercise]);

  const runTests = () => {
    if (!selectedExercise) {
      return;
    }

    try {
      const executableCode = `
${normalizeExportedCode(code)}
return typeof ${selectedExercise.functionName} !== "undefined" ? ${selectedExercise.functionName} : null;
`;
      const exportedFn = new Function(executableCode)();
      const testResults = selectedExercise.testCases.map((testCase) => {
        if (selectedExercise.functionName === "debounce") {
          const output = typeof exportedFn === "function" ? "function" : typeof exportedFn;
          return {
            passed: output === testCase.expected,
            message: testCase.explanation
          };
        }

        const output = exportedFn(...testCase.args);
        return {
          passed: JSON.stringify(output) === JSON.stringify(testCase.expected),
          message: testCase.explanation,
          output
        };
      });
      setResults(testResults);
    } catch (error) {
      setResults([{ passed: false, message: error.message }]);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
      <section className="space-y-5">
        <div className="rounded-[32px] bg-slate-950 p-8 text-white shadow-soft">
          <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-100">
            Live coding
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">Practice implementation-heavy interview prompts.</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            This lab uses Monaco so you can write real code, run sample checks, and practice explaining your thought process while coding.
          </p>
        </div>

        <div className="glass-panel p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <select
              className="input-field"
              value={filters.role}
              onChange={(event) => setFilters((current) => ({ ...current, role: event.target.value }))}
            >
              <option value="">All roles</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
            </select>
            <select
              className="input-field"
              value={filters.difficulty}
              onChange={(event) => setFilters((current) => ({ ...current, difficulty: event.target.value }))}
            >
              <option value="">All difficulties</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="mt-5 space-y-3">
            {filteredExercises.map((exercise) => (
              <button
                key={exercise._id}
                onClick={() => {
                  setSelectedId(exercise._id);
                  setCode(exercise.starterCode);
                  setResults([]);
                }}
                className={`w-full rounded-[24px] border p-4 text-left transition ${
                  selectedId === exercise._id ? "border-brand-200 bg-brand-50" : "border-slate-100 bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-slate-950">{exercise.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{exercise.role}</p>
                  </div>
                  <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">{exercise.difficulty}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="glass-panel overflow-hidden p-0">
        {selectedExercise ? (
          <>
            <div className="border-b border-slate-100 p-6">
              <div className="flex items-center gap-2 text-sm font-medium text-brand-600">
                <Code2 className="h-4 w-4" />
                {selectedExercise.role}
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">{selectedExercise.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{selectedExercise.prompt}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedExercise.topics.map((topic) => (
                  <span key={topic} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
            <div className="h-[420px]">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-light"
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{ minimap: { enabled: false }, fontSize: 14, roundedSelection: false }}
              />
            </div>
            <div className="border-t border-slate-100 p-6">
              <div className="flex flex-wrap gap-3">
                <button onClick={runTests} className="primary-button">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Run sample checks
                </button>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-[24px] border border-slate-100 bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-900">Hints</p>
                  <div className="mt-3 space-y-2">
                    {selectedExercise.hints.map((hint) => (
                      <p key={hint} className="text-sm leading-6 text-slate-600">
                        {hint}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="rounded-[24px] border border-slate-100 bg-white p-5">
                  <p className="text-sm font-semibold text-slate-900">Results</p>
                  <div className="mt-3 space-y-3">
                    {results.length ? (
                      results.map((result, index) => (
                        <div key={index} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                          <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                            <CheckCircle2 className={`h-4 w-4 ${result.passed ? "text-emerald-500" : "text-rose-500"}`} />
                            {result.passed ? "Passed" : "Needs work"}
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{result.message}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">Run the sample checks to validate your current solution.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="p-6">
            <p className="text-sm text-slate-500">No coding exercises available yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default CodingLabPage;
