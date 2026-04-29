import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { BookText, Mic, MicOff, Pin, PlusCircle, Sparkles, Volume2 } from "lucide-react";
import api from "../services/api";
import QuestionAccordion from "../components/QuestionAccordion";
import { formatDate } from "../utils/formatters";

function parseRichExplanation(text) {
  if (!text) {
    return [];
  }

  const segments = text.split(/```/);
  return segments
    .map((segment, index) => {
      if (index % 2 === 1) {
        const lines = segment.split("\n");
        const firstLine = lines[0]?.trim() || "";
        const language = /^[a-zA-Z0-9#+.-]+$/.test(firstLine) ? firstLine : "";
        const code = language ? lines.slice(1).join("\n").trim() : segment.trim();
        return { type: "code", language: language || "text", content: code };
      }

      const paragraphs = segment
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      return paragraphs.length ? { type: "text", content: paragraphs } : null;
    })
    .filter(Boolean);
}

function SessionDetailPage() {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [activeQuestionId, setActiveQuestionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [explanationLoadingId, setExplanationLoadingId] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);
  const [listeningId, setListeningId] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [voiceError, setVoiceError] = useState("");
  const [score, setScore] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [addingMore, setAddingMore] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/sessions/${sessionId}`);
        setSession(data.session);
        setActiveQuestionId(data.session.questions[0]?._id || null);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load this session.");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  const activeQuestion = useMemo(
    () => session?.questions.find((item) => item._id === activeQuestionId) || session?.questions[0],
    [activeQuestionId, session]
  );

  useEffect(() => {
    setTranscript(activeQuestion?.userAnswer || "");
    setScore(activeQuestion?.lastEvaluation?.score != null ? activeQuestion.lastEvaluation : null);
  }, [activeQuestionId, activeQuestion]);

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const togglePin = async (questionId) => {
    const { data } = await api.patch(`/sessions/${sessionId}/questions/${questionId}/pin`);
    setSession(data.session);
  };

  const requestExplanation = async (questionId) => {
    setExplanationLoadingId(questionId);
    try {
      const { data } = await api.post(`/sessions/${sessionId}/questions/${questionId}/explain`);
      setSession(data.session);
      setActiveQuestionId(questionId);
    } finally {
      setExplanationLoadingId(null);
    }
  };

  const speakQuestion = (question) => {
    if (!("speechSynthesis" in window)) {
      setVoiceError("Your browser does not support speech synthesis.");
      return;
    }

    setVoiceError("");
    const utterance = new SpeechSynthesisUtterance(question.question);
    utterance.onstart = () => setSpeakingId(question._id);
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const startVoiceAnswer = (questionId, options = {}) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError("Your browser does not support speech recognition. Try Chrome or Edge.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setActiveQuestionId(questionId);
    if (options.resetTranscript !== false) {
      setTranscript("");
    }
    setVoiceError("");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setListeningId(questionId);
    };

    recognition.onresult = (event) => {
      const combinedTranscript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ")
        .trim();
      setTranscript(combinedTranscript);
    };

    recognition.onerror = () => {
      setVoiceError("I couldn't capture that clearly. Please try speaking again.");
      setListeningId(null);
    };

    recognition.onend = () => {
      setListeningId(null);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const startVoiceRound = (question) => {
    if (!("speechSynthesis" in window)) {
      setVoiceError("Your browser does not support speech synthesis.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(question.question);
    utterance.onstart = () => {
      setSpeakingId(question._id);
      setVoiceError("");
    };
    utterance.onend = () => {
      setSpeakingId(null);
      startVoiceAnswer(question._id);
    };
    utterance.onerror = () => {
      setSpeakingId(null);
      setVoiceError("The AI voice could not play. Please try again.");
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const stopVoiceAnswer = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const evaluateReadiness = async () => {
    if (!activeQuestion) {
      return;
    }

    setEvaluating(true);
    try {
      const { data } = await api.post(`/sessions/${sessionId}/questions/${activeQuestion._id}/evaluate`, {
        answer: transcript
      });
      setScore(data.evaluation);
      setSession(data.session);
    } finally {
      setEvaluating(false);
    }
  };

  const addMoreQuestions = async () => {
    setAddingMore(true);
    try {
      const { data } = await api.post(`/sessions/${sessionId}/questions/generate-more`, { count: 5 });
      setSession(data.session);
    } finally {
      setAddingMore(false);
    }
  };

  const explanationBlocks = parseRichExplanation(activeQuestion?.explanation);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading session...</p>;
  }

  if (error || !session) {
    return <p className="text-sm text-rose-500">{error || "Session not found."}</p>;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <section className="space-y-6">
        <div className="rounded-[32px] bg-white p-8 shadow-soft">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">{session.role}</h1>
          <p className="mt-2 text-base text-slate-600">{session.focusAreas.join(", ")}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">Experience: {session.experience} Years</span>
            <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">{session.questions.length} Q&amp;A</span>
            <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">Last Updated: {formatDate(session.updatedAt)}</span>
          </div>
          {session.resumeProfile?.summary ? (
            <div className="mt-6 rounded-[24px] border border-brand-100 bg-brand-50 p-5">
              <p className="text-sm font-semibold text-brand-700">Resume-aware session</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">{session.resumeProfile.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {session.resumeProfile.skills?.slice(0, 6).map((skill) => (
                  <span key={skill} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="rounded-[32px] bg-slate-50 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Interview Q &amp; A</h2>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600">
              <Pin className="h-4 w-4 text-brand-500" />
              {session.questions.filter((item) => item.isPinned).length} pinned
            </div>
          </div>

          <div className="space-y-4">
            {session.questions.map((question) => (
              <QuestionAccordion
                key={question._id}
                question={question}
                isActive={activeQuestion?._id === question._id}
                onSelect={() => setActiveQuestionId(question._id)}
                onTogglePin={() => togglePin(question._id)}
                onExplain={() => requestExplanation(question._id)}
                onSpeak={() => speakQuestion(question)}
                onStartAnswer={() => startVoiceAnswer(question._id)}
                isExplaining={explanationLoadingId === question._id}
                speakingId={speakingId}
                listeningId={listeningId}
              />
            ))}
          </div>

          <button onClick={addMoreQuestions} className="secondary-button mt-5" disabled={addingMore}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {addingMore ? "Generating 5 more..." : "Add 5 more questions"}
          </button>
        </div>
      </section>

      <aside className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-soft">
        {activeQuestion ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-950">{activeQuestion.title || activeQuestion.question}</h2>
                <p className="mt-3 text-sm text-slate-500">Deep explanation, answer review, and readiness scoring.</p>
              </div>
              <button
                onClick={() => speakQuestion(activeQuestion)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-500"
                title="Ask question aloud"
              >
                <Volume2 className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-8 space-y-5 text-slate-700">
              <div className="rounded-[24px] border border-slate-100 bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Volume2 className="h-4 w-4" />
                  AI Interviewer
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Click the speaker and the AI asks only the interview question out loud. Then use the mic to answer in your own voice.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button onClick={() => startVoiceRound(activeQuestion)} className="primary-button">
                    <Mic className="mr-2 h-4 w-4" />
                    Start voice round
                  </button>
                  <button onClick={() => speakQuestion(activeQuestion)} className="secondary-button">
                    <Volume2 className="mr-2 h-4 w-4" />
                    Ask question
                  </button>
                  {listeningId === activeQuestion._id ? (
                    <button onClick={stopVoiceAnswer} className="primary-button">
                      <MicOff className="mr-2 h-4 w-4" />
                      Stop recording
                    </button>
                  ) : (
                    <button onClick={() => startVoiceAnswer(activeQuestion._id)} className="primary-button">
                      <Mic className="mr-2 h-4 w-4" />
                      Speak your answer
                    </button>
                  )}
                </div>
                {voiceError ? <p className="mt-3 text-sm text-rose-500">{voiceError}</p> : null}
              </div>

              <div className="rounded-[24px] border border-slate-100 bg-white p-5">
                <p className="text-sm font-semibold text-slate-900">Your spoken answer transcript</p>
                <textarea
                  value={transcript}
                  onChange={(event) => setTranscript(event.target.value)}
                  className="input-field mt-3 min-h-32 resize-y"
                  placeholder="Your spoken answer will appear here. You can also edit it manually before evaluation."
                />
                <div className="mt-4 flex flex-wrap gap-3">
                  <button onClick={evaluateReadiness} className="primary-button" disabled={evaluating || !transcript.trim()}>
                    {evaluating ? "Evaluating..." : "Evaluate spoken answer"}
                  </button>
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-100 bg-white p-5">
                <p className="text-sm font-semibold text-slate-900">Reference answer</p>
                <div className="mt-3 space-y-4">
                  {activeQuestion.answer.split("\n").filter(Boolean).map((paragraph, index) => (
                    <p key={index} className="text-base leading-8 text-slate-700">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-100 bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <BookText className="h-4 w-4" />
                  AI Explanation
                </div>
                <div className="mt-3 space-y-3">
                  {explanationBlocks.length ? (
                    explanationBlocks.map((block, index) =>
                      block.type === "code" ? (
                        <div key={index} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
                          <div className="border-b border-slate-800 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
                            {block.language}
                          </div>
                          <pre className="overflow-x-auto p-4 text-sm leading-6 text-slate-100">
                            <code>{block.content}</code>
                          </pre>
                        </div>
                      ) : (
                        <div key={index} className="space-y-3">
                          {block.content.map((paragraph, paragraphIndex) => (
                            <p key={paragraphIndex} className="text-sm leading-7 text-slate-600">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-sm leading-7 text-slate-600">
                      Use Learn More to generate a structured concept breakdown for this question.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={() => requestExplanation(activeQuestion._id)} className="secondary-button">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Refresh explanation
                </button>
              </div>

              {score ? (
                <div className="rounded-[24px] border border-brand-100 bg-brand-50 p-5">
                  <p className="text-sm font-medium text-brand-700">Readiness score</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950">{score.score}/100</p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{score.feedback}</p>
                </div>
              ) : null}

              <div className="rounded-[24px] border border-slate-100 bg-white p-5">
                <p className="text-sm font-semibold text-slate-900">Attempt history</p>
                <div className="mt-4 space-y-3">
                  {(activeQuestion.attempts || []).length ? (
                    activeQuestion.attempts
                      .slice()
                      .reverse()
                      .map((attempt) => (
                        <div key={attempt._id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-slate-900">{attempt.score}/100</p>
                            <p className="text-xs text-slate-500">{formatDate(attempt.createdAt)}</p>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{attempt.feedback}</p>
                        </div>
                      ))
                  ) : (
                    <p className="text-sm text-slate-500">Your evaluated spoken answers will show up here.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-500">Select a question to review.</p>
        )}
      </aside>
    </div>
  );
}

export default SessionDetailPage;
