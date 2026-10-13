import { useEffect, useMemo, useState } from "react";
import "./App.css";
function App() {
  // ============================================================
  // API URLS
  // ============================================================
  // Use Vercel's VITE_API_BASE_URL in production; use localhost for local development.
  const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8081").replace(/\/+$/, "");
  const AUTH_API = `${API_BASE_URL}/api/auth`;
  const TASK_API = `${API_BASE_URL}/api/tasks`;
  const SUBJECT_API = `${API_BASE_URL}/api/subjects`;
  const EXAM_API = `${API_BASE_URL}/api/exams`;
  const SESSION_API = `${API_BASE_URL}/api/study-sessions`;
  const GAME_API = `${API_BASE_URL}/api/game`;
  const SYLLABUS_API = `${API_BASE_URL}/api/syllabus`;
  // ============================================================
  // OPENING SCREEN
  // ============================================================
  const [showOpening, setShowOpening] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOpening(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);
  // ============================================================
  // AUTH STATES
  // ============================================================
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [authError, setAuthError] = useState("");
  // ============================================================
  // NAVIGATION
  // ============================================================
  const [activePage, setActivePage] = useState("dashboard");
  // ============================================================
  // TASK STATES
  // ============================================================
  const [tasks, setTasks] = useState([]);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [taskFilter, setTaskFilter] = useState("All");
  // ============================================================
  // SUBJECT STATES
  // ============================================================
  const [subjects, setSubjects] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [subjectDescription, setSubjectDescription] = useState("");
  // ============================================================
  // SYLLABUS STATES
  // ============================================================
  const [syllabus, setSyllabus] = useState([]);
  const [syllabusSubject, setSyllabusSubject] = useState("");
  const [syllabusUnit, setSyllabusUnit] = useState("");
  const [syllabusTopic, setSyllabusTopic] = useState("");
  const [syllabusContent, setSyllabusContent] = useState("");
  // ============================================================
  // EXAM STATES
  // ============================================================
  const [exams, setExams] = useState([]);
  const [examName, setExamName] = useState("");
  const [examSubject, setExamSubject] = useState("");
  const [examDate, setExamDate] = useState("");
  const [examDescription, setExamDescription] = useState("");
  // ============================================================
  // STUDY SESSION STATES
  // ============================================================
  const [studySessions, setStudySessions] = useState([]);
  const [sessionTaskId, setSessionTaskId] = useState("");
  const [sessionDuration, setSessionDuration] = useState("");
  const [activeStudySession, setActiveStudySession] = useState(null);
  const [sessionRemainingSeconds, setSessionRemainingSeconds] = useState(0);
  // ============================================================
  // EDIT MODAL
  // ============================================================
  const [editType, setEditType] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editUnit, setEditUnit] = useState("");
  const [editTopic, setEditTopic] = useState("");
  const [editContent, setEditContent] = useState("");
  // ============================================================
  // GAME STATES
  // ============================================================
  const [gameUnlocked, setGameUnlocked] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [gameRemainingSeconds, setGameRemainingSeconds] = useState(0);
  const [gameCompletedTasks, setGameCompletedTasks] = useState(0);
  const [gameLoading, setGameLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const gameSymbols = [
    "📚",
    "💻",
    "🧠",
    "✏️",
    "📖",
    "🎯",
    "🚀",
    "⭐",
  ];
  // ============================================================
  // SAFE JSON FUNCTION
  // ============================================================
  const safeJson = async (response) => {
    const text = await response.text();
    if (!text) {
      return null;
    }
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  };
  const getApiErrorMessage = (data, status) => {
    if (typeof data === "string" && data.trim()) {
      return data;
    }
    if (data && typeof data === "object") {
      const message = data.detail || data.message || data.error;
      if (message) {
        return String(message);
      }
      return JSON.stringify(data);
    }
    return `Request failed with status ${status}. Check the backend terminal for details.`;
  };
  // ============================================================
  // UNIQUE SUBJECT OPTIONS
  // ============================================================
  const subjectOptions = useMemo(() => {
    const uniqueSubjects = [];
    const existingNames = new Set();
    subjects.forEach((item) => {
      if (!item || !item.name) {
        return;
      }
      const name = item.name.trim();
      if (!name) {
        return;
      }
      const key = name.toLowerCase();
      if (!existingNames.has(key)) {
        existingNames.add(key);
        uniqueSubjects.push(name);
      }
    });
    return uniqueSubjects;
  }, [subjects]);
  // ============================================================
  // TOPICS FROM SELECTED SUBJECT'S SYLLABUS
  // ============================================================
  const taskTopicOptions = useMemo(() => {
    if (!subject.trim()) {
      return [];
    }
    const selectedSubject = subject.trim().toLowerCase();
    const seen = new Set();
    return syllabus.filter((item) => {
      if (!item?.subject || !item?.topic) {
        return false;
      }
      if (item.subject.trim().toLowerCase() !== selectedSubject) {
        return false;
      }
      const key = item.topic.trim().toLowerCase();
      if (!key || seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }, [syllabus, subject]);
  const pendingSessionTasks = useMemo(
    () => tasks.filter((task) => task?.status === "Pending"),
    [tasks]
  );
  const selectedSessionTask = useMemo(
    () => tasks.find((task) => String(task?.id) === String(sessionTaskId)) || null,
    [tasks, sessionTaskId]
  );
  // ============================================================
  // LOAD SUBJECTS
  // ============================================================
  const loadSubjects = async () => {
    try {
      const response = await fetch(SUBJECT_API, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        console.error("Failed to load subjects:", response.status);
        return;
      }
      const data = await safeJson(response);
      if (Array.isArray(data)) {
        setSubjects(data);
      } else {
        console.error("Subjects response is not an array.");
      }
    } catch (error) {
      console.error("Error loading subjects:", error);
    }
  };
  // ============================================================
  // LOAD SYLLABUS
  // ============================================================
  const loadSyllabus = async () => {
    try {
      const response = await fetch(SYLLABUS_API, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        console.error("Failed to load syllabus:", response.status);
        return;
      }
      const data = await safeJson(response);
      if (Array.isArray(data)) {
        setSyllabus(data);
      } else {
        console.error("Syllabus response is not an array.");
      }
    } catch (error) {
      console.error("Error loading syllabus:", error);
    }
  };
  // ============================================================
  // LOAD TASKS
  // ============================================================
  const loadTasks = async () => {
    try {
      const response = await fetch(TASK_API, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        console.error("Failed to load tasks:", response.status);
        return;
      }
      const data = await safeJson(response);
      if (Array.isArray(data)) {
        setTasks(data);
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };
  // ============================================================
  // LOAD EXAMS
  // ============================================================
  const loadExams = async () => {
    try {
      const response = await fetch(EXAM_API, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        console.error("Failed to load exams:", response.status);
        return;
      }
      const data = await safeJson(response);
      if (Array.isArray(data)) {
        setExams(data);
      }
    } catch (error) {
      console.error("Error loading exams:", error);
    }
  };
  // ============================================================
  // STUDY TIMER CALCULATION
  // ============================================================
  const calculateStudyRemainingSeconds = (studySession) => {
    const plannedMinutes = Number(
      studySession?.plannedDurationMinutes || 0
    );
    const startedTime = new Date(
      studySession?.startedAt || ""
    ).getTime();
    if (plannedMinutes < 1 || Number.isNaN(startedTime)) {
      return 0;
    }
    const targetEndTime = startedTime + plannedMinutes * 60 * 1000;
    return Math.max(0, Math.ceil((targetEndTime - Date.now()) / 1000));
  };
  // ============================================================
  // LOAD STUDY SESSIONS
  // ============================================================
  const loadStudySessions = async () => {
    try {
      const response = await fetch(SESSION_API, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        console.error("Failed to load study sessions:", response.status);
        return;
      }
      const data = await safeJson(response);
      if (Array.isArray(data)) {
        setStudySessions(data);
        const activeSession = data.find(
          (item) => item && item.active === true
        );
        setActiveStudySession(activeSession || null);
        setSessionRemainingSeconds(
          activeSession
            ? calculateStudyRemainingSeconds(activeSession)
            : 0
        );
      }
    } catch (error) {
      console.error("Error loading study sessions:", error);
    }
  };
  // ============================================================
  // LIVE COUNTDOWN TIMER
  // ============================================================
  useEffect(() => {
    if (!activeStudySession) {
      setSessionRemainingSeconds(0);
      return undefined;
    }
    const updateRemaining = () => {
      setSessionRemainingSeconds(
        calculateStudyRemainingSeconds(activeStudySession)
      );
    };
    updateRemaining();
    const timer = setInterval(updateRemaining, 1000);
    return () => clearInterval(timer);
  }, [activeStudySession]);
  // ============================================================
  // LOAD ALL DATA
  // ============================================================
  const loadAllData = async () => {
    await Promise.allSettled([
      loadTasks(),
      loadSubjects(),
      loadSyllabus(),
      loadExams(),
      loadStudySessions(),
    ]);
  };
  // ============================================================
  // CHECK LOGIN
  // ============================================================
  useEffect(() => {
    checkLogin();
  }, []);
  const checkLogin = async () => {
    try {
      const response = await fetch(`${AUTH_API}/me`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const currentUser = await safeJson(response);
        if (currentUser) {
          setUser(currentUser);
          localStorage.setItem(
            "studyPlannerUser",
            JSON.stringify(currentUser)
          );
          await loadAllData();
          await loadGameStatus();
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking login:", error);
      const savedUser = localStorage.getItem("studyPlannerUser");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem("studyPlannerUser");
        }
      }
    } finally {
      setAuthLoading(false);
    }
  };
  // ============================================================
  // LOAD DATA WHEN CHANGING PAGES
  // ============================================================
  useEffect(() => {
    if (!user) {
      return;
    }
    if (
      activePage === "subjects" ||
      activePage === "syllabus" ||
      activePage === "tasks" ||
      activePage === "exams" ||
      activePage === "sessions"
    ) {
      loadSubjects();
    }
    if (activePage === "syllabus" || activePage === "tasks") {
      loadSyllabus();
    }
    if (activePage === "tasks" || activePage === "sessions") {
      loadTasks();
    }
    if (activePage === "sessions") {
      loadStudySessions();
    }
    if (activePage === "exams") {
      loadExams();
    }
  }, [activePage, user]);
    // ============================================================
  // REGISTER
  // ============================================================

  const handleRegister = async (e) => {
    e.preventDefault();

    setAuthMessage("");
    setAuthError("");

    if (
      !registerName.trim() ||
      !registerEmail.trim() ||
      !registerPassword.trim()
    ) {
      setAuthError("Please fill all fields.");
      return;
    }

    try {
      const response = await fetch(`${AUTH_API}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      const data = await safeJson(response);

      if (!response.ok) {
        setAuthError(
          typeof data === "string"
            ? data
            : "Registration failed."
        );
        return;
      }

      setAuthMessage(
        "Registration successful. Please login."
      );

      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");

      setAuthMode("login");
    } catch (error) {
      console.error("Registration error:", error);
      setAuthError("Unable to connect to server.");
    }
  };

  // ============================================================
  // LOGIN
  // ============================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setAuthMessage("");
    setAuthError("");

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setAuthError("Please enter email and password.");
      return;
    }

    try {
      const response = await fetch(`${AUTH_API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await safeJson(response);

      if (!response.ok) {
        setAuthError(
          typeof data === "string"
            ? data
            : "Invalid email or password."
        );
        return;
      }

      let loggedInUser = data;

      if (
        !loggedInUser ||
        typeof loggedInUser !== "object"
      ) {
        const meResponse = await fetch(`${AUTH_API}/me`, {
          method: "GET",
          credentials: "include",
        });

        if (meResponse.ok) {
          loggedInUser = await safeJson(meResponse);
        }
      }

      setUser(loggedInUser);

      localStorage.setItem(
        "studyPlannerUser",
        JSON.stringify(loggedInUser)
      );

      setLoginEmail("");
      setLoginPassword("");
      setActivePage("dashboard");

      await loadTasks();
      await loadSubjects();
      await loadSyllabus();
      await loadExams();
      await loadStudySessions();
      await loadGameStatus();
    } catch (error) {
      console.error("Login error:", error);
      setAuthError("Unable to connect to server.");
    }
  };

  // ============================================================
  // FORGOT PASSWORD
  // ============================================================

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    setAuthMessage("");
    setAuthError("");

    if (!forgotEmail.trim()) {
      setAuthError("Please enter your email.");
      return;
    }

    try {
      const response = await fetch(
        `${AUTH_API}/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: forgotEmail,
          }),
        }
      );

      const data = await safeJson(response);

      if (!response.ok) {
        setAuthError(
          typeof data === "string"
            ? data
            : "Unable to process request."
        );
        return;
      }

      setAuthMessage(
        typeof data === "string"
          ? data
          : "Reset token generated. Check backend terminal."
      );

      setAuthMode("reset");
    } catch (error) {
      console.error("Forgot password error:", error);
      setAuthError("Unable to connect to server.");
    }
  };

  // ============================================================
  // RESET PASSWORD
  // ============================================================

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setAuthMessage("");
    setAuthError("");

    if (
      !resetToken.trim() ||
      !resetPassword.trim()
    ) {
      setAuthError("Please enter token and new password.");
      return;
    }

    try {
      const response = await fetch(
        `${AUTH_API}/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            token: resetToken,
            newPassword: resetPassword,
          }),
        }
      );

      const data = await safeJson(response);

      if (!response.ok) {
        setAuthError(
          typeof data === "string"
            ? data
            : "Password reset failed."
        );
        return;
      }

      setAuthMessage(
        typeof data === "string"
          ? data
          : "Password reset successfully."
      );

      setResetToken("");
      setResetPassword("");
      setAuthMode("login");
    } catch (error) {
      console.error("Reset password error:", error);
      setAuthError("Unable to connect to server.");
    }
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = async () => {
    try {
      await fetch(`${AUTH_API}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    setUser(null);
    setTasks([]);
    setSubjects([]);
    setSyllabus([]);
    setExams([]);
    setStudySessions([]);

    localStorage.removeItem("studyPlannerUser");

    setActivePage("dashboard");
    setAuthMode("login");
  };

  // ============================================================
  // ADD SUBJECT
  // ============================================================

  const addSubject = async () => {
    if (!subjectName.trim()) {
      alert("Please enter a subject name.");
      return;
    }

    const newSubject = {
      name: subjectName.trim(),
      description: subjectDescription.trim(),
    };

    try {
      const response = await fetch(SUBJECT_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newSubject),
      });

      const savedSubject = await safeJson(response);

      if (!response.ok) {
        alert(
          typeof savedSubject === "string"
            ? savedSubject
            : "Unable to add subject."
        );
        return;
      }

      setSubjects((previous) => [
        ...previous,
        savedSubject,
      ]);

      setSubjectName("");
      setSubjectDescription("");

      await loadSubjects();
    } catch (error) {
      console.error("Error adding subject:", error);
      alert("Unable to add subject.");
    }
  };

  // ============================================================
  // DELETE SUBJECT
  // ============================================================

  const deleteSubject = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this subject?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${SUBJECT_API}/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const data = await safeJson(response);

        alert(
          typeof data === "string"
            ? data
            : "Unable to delete subject."
        );
        return;
      }

      setSubjects((previous) =>
        previous.filter(
          (item) => item.id !== id
        )
      );

      await loadSubjects();
    } catch (error) {
      console.error("Error deleting subject:", error);
      alert("Unable to delete subject.");
    }
  };

  // ============================================================
  // OPEN SUBJECT EDIT
  // ============================================================

  const openSubjectEdit = (item) => {
    setEditType("subject");
    setEditingItem(item);
    setEditName(item.name || "");
    setEditDescription(item.description || "");
  };

  // ============================================================
  // SAVE SUBJECT EDIT
  // ============================================================

  const saveSubjectEdit = async () => {
    if (!editingItem) {
      return;
    }

    if (!editName.trim()) {
      alert("Subject name cannot be empty.");
      return;
    }

    try {
      const response = await fetch(
        `${SUBJECT_API}/${editingItem.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: editName.trim(),
            description: editDescription.trim(),
          }),
        }
      );

      const updatedSubject = await safeJson(response);

      if (!response.ok) {
        alert(
          typeof updatedSubject === "string"
            ? updatedSubject
            : "Unable to update subject."
        );
        return;
      }

      setSubjects((previous) =>
        previous.map((item) =>
          item.id === editingItem.id
            ? updatedSubject
            : item
        )
      );

      closeEditModal();
      await loadSubjects();
    } catch (error) {
      console.error("Error updating subject:", error);
      alert("Unable to update subject.");
    }
  };

  // ============================================================
  // ADD SYLLABUS
  // ============================================================

  const addSyllabus = async () => {
    if (
      !syllabusSubject ||
      !syllabusUnit.trim() ||
      !syllabusTopic.trim() ||
      !syllabusContent.trim()
    ) {
      alert("Please fill all syllabus fields.");
      return;
    }

    const newSyllabus = {
      subject: syllabusSubject,
      unit: syllabusUnit.trim(),
      topic: syllabusTopic.trim(),
      content: syllabusContent.trim(),
    };

    try {
      const response = await fetch(SYLLABUS_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newSyllabus),
      });

      const savedSyllabus = await safeJson(response);

      if (!response.ok) {
        alert(
          typeof savedSyllabus === "string"
            ? savedSyllabus
            : "Unable to add syllabus."
        );
        return;
      }

      setSyllabus((previous) => [
        ...previous,
        savedSyllabus,
      ]);

      setSyllabusSubject("");
      setSyllabusUnit("");
      setSyllabusTopic("");
      setSyllabusContent("");

      await loadSyllabus();
    } catch (error) {
      console.error("Error adding syllabus:", error);
      alert("Unable to add syllabus.");
    }
  };

  // ============================================================
  // DELETE SYLLABUS
  // ============================================================

  const deleteSyllabus = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this syllabus?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${SYLLABUS_API}/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const data = await safeJson(response);

        alert(
          typeof data === "string"
            ? data
            : "Unable to delete syllabus."
        );
        return;
      }

      setSyllabus((previous) =>
        previous.filter(
          (item) => item.id !== id
        )
      );

      await loadSyllabus();
    } catch (error) {
      console.error("Error deleting syllabus:", error);
      alert("Unable to delete syllabus.");
    }
  };

  // ============================================================
  // OPEN SYLLABUS EDIT
  // ============================================================

  const openSyllabusEdit = (item) => {
    setEditType("syllabus");
    setEditingItem(item);

    setEditName(item.subject || "");
    setEditUnit(item.unit || "");
    setEditTopic(item.topic || "");
    setEditContent(item.content || "");
    setEditDescription("");
  };

  // ============================================================
  // SAVE SYLLABUS EDIT
  // ============================================================

  const saveSyllabusEdit = async () => {
    if (!editingItem) {
      return;
    }

    if (
      !editName.trim() ||
      !editUnit.trim() ||
      !editTopic.trim() ||
      !editContent.trim()
    ) {
      alert("Please fill all syllabus fields.");
      return;
    }

    try {
      const response = await fetch(
        `${SYLLABUS_API}/${editingItem.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            subject: editName.trim(),
            unit: editUnit.trim(),
            topic: editTopic.trim(),
            content: editContent.trim(),
          }),
        }
      );

      const updatedSyllabus = await safeJson(response);

      if (!response.ok) {
        alert(
          typeof updatedSyllabus === "string"
            ? updatedSyllabus
            : "Unable to update syllabus."
        );
        return;
      }

      setSyllabus((previous) =>
        previous.map((item) =>
          item.id === editingItem.id
            ? updatedSyllabus
            : item
        )
      );

      closeEditModal();
      await loadSyllabus();
    } catch (error) {
      console.error("Error updating syllabus:", error);
      alert("Unable to update syllabus.");
    }
  };
    // ============================================================
  // ADD STUDY TASK
  // ============================================================

  const addTask = async () => {
    if (!subject.trim() || !topic.trim() || !date) {
      alert("Please select a subject, syllabus topic, and date.");
      return;
    }

    const validTopic = taskTopicOptions.some(
      (item) =>
        item.topic.trim().toLowerCase() ===
        topic.trim().toLowerCase()
    );

    if (!validTopic) {
      alert("Please select a topic from the selected subject's syllabus.");
      return;
    }

    try {
      const response = await fetch(TASK_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          subject: subject.trim(),
          topic: topic.trim(),
          date,
          priority,
          status: "Pending",
        }),
      });

      const data = await safeJson(response);

      if (!response.ok) {
        alert(getApiErrorMessage(data, response.status));
        return;
      }

      await loadTasks();
      setSubject("");
      setTopic("");
      setDate("");
      setPriority("Medium");
      await loadGameStatus();
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Unable to add task.");
    }
  };

  // Open Study Sessions with the chosen existing task.
  const studyTaskNow = (task) => {
    setSessionTaskId(String(task.id));
    setSessionDuration("");
    setActivePage("sessions");
  };

  // ============================================================
  // DELETE TASK
  // ============================================================

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const response = await fetch(`${TASK_API}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await safeJson(response);

      if (!response.ok) {
        alert(getApiErrorMessage(data, response.status));
        return;
      }

      await loadTasks();
      await loadGameStatus();
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Unable to delete task.");
    }
  };

  // ============================================================
  // EXAM CRUD
  // ============================================================

  const addExam = async () => {
    if (!examName.trim() || !examSubject || !examDate) {
      alert("Please enter an exam name, subject, and date.");
      return;
    }

    try {
      const response = await fetch(EXAM_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          examName: examName.trim(),
          subject: examSubject,
          examDate,
          description: examDescription.trim(),
        }),
      });

      const data = await safeJson(response);

      if (!response.ok) {
        alert(getApiErrorMessage(data, response.status));
        return;
      }

      setExamName("");
      setExamSubject("");
      setExamDate("");
      setExamDescription("");
      await loadExams();
    } catch (error) {
      console.error("Error adding exam:", error);
      alert("Unable to add exam.");
    }
  };

  const deleteExam = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) {
      return;
    }

    try {
      const response = await fetch(`${EXAM_API}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await safeJson(response);

      if (!response.ok) {
        alert(getApiErrorMessage(data, response.status));
        return;
      }

      await loadExams();
    } catch (error) {
      console.error("Error deleting exam:", error);
      alert("Unable to delete exam.");
    }
  };

  const openExamEdit = (item) => {
    setEditType("exam");
    setEditingItem(item);
    setEditName(item.examName || "");
    setEditDescription(item.description || "");
  };

  const saveExamEdit = async () => {
    if (!editingItem || !editName.trim()) {
      alert("Exam name cannot be empty.");
      return;
    }

    try {
      const response = await fetch(
        `${EXAM_API}/${editingItem.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            examName: editName.trim(),
            subject: editingItem.subject,
            examDate: editingItem.examDate,
            description: editDescription.trim(),
          }),
        }
      );

      const data = await safeJson(response);

      if (!response.ok) {
        alert(getApiErrorMessage(data, response.status));
        return;
      }

      await loadExams();
      closeEditModal();
    } catch (error) {
      console.error("Error updating exam:", error);
      alert("Unable to update exam.");
    }
  };

  // ============================================================
  // EDIT MODAL HELPERS
  // ============================================================

  const closeEditModal = () => {
    setEditType("");
    setEditingItem(null);
    setEditName("");
    setEditDescription("");
    setEditUnit("");
    setEditTopic("");
    setEditContent("");
  };

  const saveEdit = async () => {
    if (editType === "subject") {
      await saveSubjectEdit();
    } else if (editType === "exam") {
      await saveExamEdit();
    } else if (editType === "syllabus") {
      await saveSyllabusEdit();
    }
  };

  // ============================================================
  // START TIMER FOR EXISTING TASK
  // ============================================================

  const startStudySession = async () => {
    if (activeStudySession) {
      alert("A study timer is already running.");
      return;
    }

    if (!selectedSessionTask) {
      alert("Please select an existing study task.");
      return;
    }

    const duration = Number(sessionDuration);

    if (!Number.isInteger(duration) || duration < 20) {
      alert("The minimum timer duration is 20 minutes.");
      return;
    }

    try {
      const response = await fetch(`${SESSION_API}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          taskId: Number(selectedSessionTask.id),
          plannedDurationMinutes: duration,
        }),
      });

      const data = await safeJson(response);

      if (!response.ok) {
        console.error("Timer start failed:", response.status, data);
        alert(getApiErrorMessage(data, response.status));
        return;
      }

      await loadStudySessions();
      setSessionTaskId("");
      setSessionDuration("");
    } catch (error) {
      console.error("Error starting timer:", error);
      alert("Unable to start study timer.");
    }
  };

  // ============================================================
  // COMPLETE TASK ONLY AFTER TIMER FINISHES
  // ============================================================

  const completeStudySession = async () => {
    if (!activeStudySession?.id) {
      alert("No active study session was found.");
      return;
    }

    if (sessionRemainingSeconds > 0) {
      alert("Wait until the timer reaches 00:00.");
      return;
    }

    try {
      const response = await fetch(
        `${SESSION_API}/${activeStudySession.id}/complete`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await safeJson(response);

      if (!response.ok) {
        console.error("Completion failed:", response.status, data);
        alert(getApiErrorMessage(data, response.status));
        return;
      }

      setActiveStudySession(null);
      setSessionRemainingSeconds(0);

      await Promise.all([
        loadTasks(),
        loadStudySessions(),
        loadGameStatus(),
      ]);

      alert("Study task marked as Completed.");
    } catch (error) {
      console.error("Error completing study task:", error);
      alert("Unable to complete the study task.");
    }
  };

  // ============================================================
  // DELETE FINISHED STUDY SESSION
  // ============================================================

  const deleteStudySession = async (id) => {
    if (activeStudySession?.id === id) {
      alert("You cannot delete an active session.");
      return;
    }

    if (!window.confirm("Delete this study session?")) {
      return;
    }

    try {
      const response = await fetch(`${SESSION_API}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await safeJson(response);

      if (!response.ok) {
        alert(getApiErrorMessage(data, response.status));
        return;
      }

      await loadStudySessions();
    } catch (error) {
      console.error("Error deleting session:", error);
      alert("Unable to delete study session.");
    }
  };

  // ============================================================
  // STUDY BREAK GAME
  // ============================================================

  const loadGameStatus = async () => {
    try {
      const response = await fetch(`${GAME_API}/status`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        return;
      }

      const data = await safeJson(response);

      setGameUnlocked(Boolean(data?.unlocked));
      setGameActive(Boolean(data?.active));
      setGameRemainingSeconds(Number(data?.remainingSeconds || 0));
      setGameCompletedTasks(Number(data?.completedTasks || 0));
    } catch (error) {
      console.error("Error loading game status:", error);
    }
  };

  const createGameCards = () => {
    const gameCards = [];

    gameSymbols.forEach((symbol, index) => {
      gameCards.push({
        id: `${index}-a`,
        value: symbol,
        pair: index,
      });

      gameCards.push({
        id: `${index}-b`,
        value: symbol,
        pair: index,
      });
    });

    for (let i = gameCards.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));

      [gameCards[i], gameCards[randomIndex]] = [
        gameCards[randomIndex],
        gameCards[i],
      ];
    }

    setCards(gameCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setScore(0);
    setGameFinished(false);
  };

  const startGame = async () => {
    setGameLoading(true);

    try {
      const response = await fetch(`${GAME_API}/start`, {
        method: "POST",
        credentials: "include",
      });

      const data = await safeJson(response);

      if (!response.ok) {
        alert(getApiErrorMessage(data, response.status));
        return;
      }

      setGameActive(true);
      setGameRemainingSeconds(Number(data?.remainingSeconds || 600));
      createGameCards();
    } catch (error) {
      console.error("Error starting game:", error);
      alert("Unable to start game.");
    } finally {
      setGameLoading(false);
    }
  };

  useEffect(() => {
    if (!gameActive) {
      return undefined;
    }

    const timer = setInterval(() => {
      setGameRemainingSeconds((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          setGameActive(false);
          setGameFinished(false);
          return 0;
        }
        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive]);

  const handleCardClick = (index) => {
    if (
      !gameActive ||
      flippedCards.length >= 2 ||
      flippedCards.includes(index) ||
      matchedCards.includes(index)
    ) {
      return;
    }

    const nextFlipped = [...flippedCards, index];
    setFlippedCards(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((previous) => previous + 1);

      const first = cards[nextFlipped[0]];
      const second = cards[nextFlipped[1]];

      if (first?.pair === second?.pair) {
        const newMatches = [
          ...matchedCards,
          nextFlipped[0],
          nextFlipped[1],
        ];

        setMatchedCards(newMatches);
        setScore((previous) => previous + 10);

        setTimeout(() => setFlippedCards([]), 400);

        if (newMatches.length === cards.length) {
          setGameFinished(true);
        }
      } else {
        setTimeout(() => setFlippedCards([]), 800);
      }
    }
  };

  useEffect(() => {
    if (user && activePage === "break") {
      loadGameStatus();
    }
  }, [activePage, user]);

  // ============================================================
  // DASHBOARD CALCULATIONS
  // ============================================================

  const totalSubjects = subjectOptions.length;
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const todayString = new Date().toLocaleDateString("en-CA");

  const todaysTasks = tasks.filter(
    (task) => task.date === todayString
  );

  const upcomingTasks = tasks
    .filter(
      (task) =>
        task.date >= todayString &&
        task.status === "Pending"
    )
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
    .slice(0, 5);

  const upcomingExams = exams
    .filter((exam) => exam.examDate >= todayString)
    .sort((a, b) =>
      String(a.examDate).localeCompare(String(b.examDate))
    )
    .slice(0, 5);

  const filteredTasks =
    taskFilter === "All"
      ? tasks
      : tasks.filter((task) => task.status === taskFilter);

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    const dateObject = new Date(`${value}T00:00:00`);

    if (Number.isNaN(dateObject.getTime())) {
      return value;
    }

    return dateObject.toLocaleDateString();
  };

  const formatGameTime = (seconds) => {
    const safeSeconds = Math.max(0, Number(seconds) || 0);
    const minutes = Math.floor(safeSeconds / 60);
    const remainder = safeSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainder
    ).padStart(2, "0")}`;
  };

  const formatCountdown = (seconds) =>
    formatGameTime(seconds);

  // ============================================================
  // OPENING SCREEN
  // ============================================================

  if (showOpening) {
    return (
      <div className="opening-screen">
        <div className="opening-content">
          <div className="opening-logo">📚</div>
          <h1 className="opening-title">
            Student Study Planner
          </h1>
          <p className="opening-subtitle">
            Plan your studies. Track your progress.
          </p>
          <div className="opening-loader">
            <div className="opening-loader-bar" />
          </div>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="opening-screen">
        <div className="opening-content">
          <div className="opening-logo">📚</div>
          <h1 className="opening-title">
            Checking your session...
          </h1>
        </div>
      </div>
    );
  }

  // ============================================================
  // AUTH PAGES
  // ============================================================

  if (!user) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">📚</div>
          <h1>Student Study Planner</h1>
          <p className="auth-subtitle">
            Manage your studies efficiently
          </p>

          {authError && (
            <div className="error-message">{authError}</div>
          )}

          {authMessage && (
            <div className="success-message">{authMessage}</div>
          )}

          {authMode === "login" && (
            <form className="auth-form" onSubmit={handleLogin}>
              <h2>Welcome Back</h2>

              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />

              <button type="submit">Login</button>

              <button
                type="button"
                className="link-button"
                onClick={() => {
                  setAuthMode("forgot");
                  setAuthError("");
                  setAuthMessage("");
                }}
              >
                Forgot Password?
              </button>

              <button
                type="button"
                className="secondary-auth-button"
                onClick={() => {
                  setAuthMode("register");
                  setAuthError("");
                  setAuthMessage("");
                }}
              >
                Create Account
              </button>
            </form>
          )}

          {authMode === "register" && (
            <form className="auth-form" onSubmit={handleRegister}>
              <h2>Create Account</h2>

              <input
                type="text"
                placeholder="Full Name"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
              />

              <button type="submit">Register</button>

              <button
                type="button"
                className="secondary-auth-button"
                onClick={() => {
                  setAuthMode("login");
                  setAuthError("");
                  setAuthMessage("");
                }}
              >
                Back to Login
              </button>
            </form>
          )}

          {authMode === "forgot" && (
            <form
              className="auth-form"
              onSubmit={handleForgotPassword}
            >
              <h2>Forgot Password</h2>

              <input
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />

              <button type="submit">
                Generate Reset Token
              </button>

              <button
                type="button"
                className="secondary-auth-button"
                onClick={() => {
                  setAuthMode("login");
                  setAuthError("");
                  setAuthMessage("");
                }}
              >
                Back to Login
              </button>
            </form>
          )}

          {authMode === "reset" && (
            <form
              className="auth-form"
              onSubmit={handleResetPassword}
            >
              <h2>Reset Password</h2>

              <input
                type="text"
                placeholder="Reset Token"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="New Password"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                required
              />

              <button type="submit">Reset Password</button>

              <button
                type="button"
                className="secondary-auth-button"
                onClick={() => {
                  setAuthMode("login");
                  setAuthError("");
                  setAuthMessage("");
                }}
              >
                Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN APPLICATION LAYOUT
  // ============================================================

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">📚</div>
          <div>
            <h2>Study Planner</h2>
            <span>Student Portal</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {[
            ["dashboard", "🏠 Dashboard"],
            ["subjects", "📖 Subjects"],
            ["syllabus", "📚 Syllabus"],
            ["tasks", "📝 Study Tasks"],
            ["exams", "📅 Exams"],
            ["sessions", "⏱️ Study Sessions"],
            ["break", "🎮 Study Break"],
          ].map(([page, label]) => (
            <button
              key={page}
              className={
                activePage === page
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() => setActivePage(page)}
            >
              {label}
            </button>
          ))}

          <button
            className="nav-item"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <div>
            <strong>Student Study Planner</strong>
          </div>
          <div>
            Welcome, {user.name || "Student"}
          </div>
        </div>

        {/* ====================================================
            DASHBOARD
        ==================================================== */}

        {activePage === "dashboard" && (
          <>
            <div className="page-header">
              <div>
                <h1>
                  Welcome, {user.name || "Student"} 👋
                </h1>
                <p>
                  Plan your studies and stay on track.
                </p>
              </div>
            </div>

            <div className="quick-actions">
              <button
                onClick={() => setActivePage("subjects")}
              >
                📖 Manage Subjects
              </button>

              <button
                onClick={() => setActivePage("syllabus")}
              >
                📚 Manage Syllabus
              </button>

              <button
                onClick={() => setActivePage("tasks")}
              >
                📝 Add Study Task
              </button>

              <button
                onClick={() => setActivePage("sessions")}
              >
                ⏱️ Study Sessions
              </button>

              <button
                onClick={() => setActivePage("exams")}
              >
                📅 Manage Exams
              </button>
            </div>

            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-icon">📖</div>
                <h3>Subjects</h3>
                <p>{totalSubjects}</p>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <h3>Total Tasks</h3>
                <p>{totalTasks}</p>
              </div>

              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <h3>Completed</h3>
                <p>{completedTasks}</p>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <h3>Pending</h3>
                <p>{pendingTasks}</p>
              </div>

              <div className="stat-card progress-card">
                <div className="stat-icon">📊</div>
                <h3>Progress</h3>
                <p>{progress}%</p>
              </div>
            </div>

            <div className="dashboard-section">
              <div className="section-header">
                <h2>📌 Today's Tasks</h2>
                <button
                  onClick={() => setActivePage("tasks")}
                >
                  View All
                </button>
              </div>

              {todaysTasks.length === 0 ? (
                <p className="empty-message">
                  No tasks scheduled for today.
                </p>
              ) : (
                <div className="task-list">
                  {todaysTasks.map((task) => (
                    <div
                      className="task-card"
                      key={task.id}
                    >
                      <div className="task-info">
                        <h3>{task.subject}</h3>

                        <p>
                          <strong>Topic:</strong>{" "}
                          {task.topic}
                        </p>

                        <p>
                          <strong>Status:</strong>{" "}
                          {task.status}
                        </p>
                      </div>

                      {task.status === "Pending" && (
                        <div className="task-buttons">
                          <button
                            onClick={() => studyTaskNow(task)}
                          >
                            ⏱️ Study Now
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="dashboard-section">
              <h2>📊 Study Progress</h2>

              <div className="progress-container">
                <div className="progress-label">
                  <span>Completed Tasks</span>
                  <strong>{progress}%</strong>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-section">
                <h2>📝 Upcoming Tasks</h2>

                {upcomingTasks.length === 0 ? (
                  <p className="empty-message">
                    No upcoming tasks.
                  </p>
                ) : (
                  <div className="mini-list">
                    {upcomingTasks.map((task) => (
                      <div
                        className="mini-card"
                        key={task.id}
                      >
                        <strong>{task.subject}</strong>
                        <span>{task.topic}</span>
                        <small>{formatDate(task.date)}</small>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="dashboard-section">
                <h2>📅 Upcoming Exams</h2>

                {upcomingExams.length === 0 ? (
                  <p className="empty-message">
                    No upcoming exams.
                  </p>
                ) : (
                  <div className="mini-list">
                    {upcomingExams.map((exam) => (
                      <div
                        className="mini-card"
                        key={exam.id}
                      >
                        <strong>{exam.examName}</strong>
                        <span>{exam.subject}</span>
                        <small>{formatDate(exam.examDate)}</small>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* NEXT: append the SUBJECTS PAGE section from Part 4 here */}
        {/* ====================================================
            SUBJECTS PAGE
        ==================================================== */}

        {activePage ===
          "subjects" && (
          <>
            <div className="page-header">
              <div>
                <h1>📖 Subjects</h1>
                <p>Organize your academic subjects.</p>
              </div>
            </div>

            <div className="dashboard-section">
              <h2>➕ Add Subject</h2>

              <div className="task-form">
                <input
                  type="text"
                  placeholder="Subject Name"
                  value={subjectName}
                  onChange={(e) =>
                    setSubjectName(e.target.value)
                  }
                />

                <input
                  type="text"
                  placeholder="Description"
                  value={subjectDescription}
                  onChange={(e) =>
                    setSubjectDescription(e.target.value)
                  }
                />

                <button
                  className="add-task"
                  onClick={addSubject}
                >
                  + Add Subject
                </button>
              </div>
            </div>

            <div className="dashboard-section">
              <div className="section-header">
                <h2>My Subjects</h2>

                <button onClick={loadSubjects}>
                  🔄 Refresh
                </button>
              </div>

              {subjects.length === 0 ? (
                <p className="empty-message">
                  No subjects available.
                </p>
              ) : (
                <div className="task-list">
                  {subjects.map((item) => (
                    <div
                      className="task-card"
                      key={item.id}
                    >
                      <div className="task-info">
                        <h3>{item.name}</h3>
                        <p>
                          {item.description ||
                            "No description"}
                        </p>
                      </div>

                      <div className="task-buttons">
                        <button
                          onClick={() =>
                            openSubjectEdit(item)
                          }
                        >
                          ✏️ Edit
                        </button>

                        <button
                          onClick={() =>
                            deleteSubject(item.id)
                          }
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ====================================================
            SYLLABUS PAGE
        ==================================================== */}

        {activePage ===
          "syllabus" && (
          <>
            <div className="page-header">
              <div>
                <h1>📚 Syllabus</h1>
                <p>
                  Add syllabus topics before creating study tasks.
                </p>
              </div>
            </div>

            <div className="dashboard-section">
              <h2>➕ Add Syllabus</h2>

              <div className="task-form">
                <select
                  value={syllabusSubject}
                  onChange={(e) =>
                    setSyllabusSubject(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select Subject
                  </option>

                  {subjectOptions.map((name) => (
                    <option
                      key={name}
                      value={name}
                    >
                      {name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Unit (e.g. Unit 3)"
                  value={syllabusUnit}
                  onChange={(e) =>
                    setSyllabusUnit(
                      e.target.value
                    )
                  }
                />

                <input
                  type="text"
                  placeholder="Topic"
                  value={syllabusTopic}
                  onChange={(e) =>
                    setSyllabusTopic(
                      e.target.value
                    )
                  }
                />

                <textarea
                  placeholder="Enter detailed syllabus/study content"
                  value={syllabusContent}
                  onChange={(e) =>
                    setSyllabusContent(
                      e.target.value
                    )
                  }
                  rows="6"
                />

                <button
                  className="add-task"
                  onClick={addSyllabus}
                >
                  + Add Syllabus
                </button>
              </div>

              {subjectOptions.length === 0 && (
                <p className="empty-message">
                  Create a subject before adding syllabus.
                </p>
              )}
            </div>

            <div className="dashboard-section">
              <div className="section-header">
                <h2>My Syllabus</h2>

                <button
                  onClick={async () => {
                    await loadSubjects();
                    await loadSyllabus();
                  }}
                >
                  🔄 Refresh
                </button>
              </div>

              {syllabus.length === 0 ? (
                <p className="empty-message">
                  No syllabus available.
                </p>
              ) : (
                <div className="task-list">
                  {syllabus.map((item) => (
                    <div
                      className="task-card"
                      key={item.id}
                    >
                      <div className="task-info">
                        <h3>{item.subject}</h3>

                        <p>
                          <strong>Unit:</strong>{" "}
                          {item.unit}
                        </p>

                        <p>
                          <strong>Topic:</strong>{" "}
                          {item.topic}
                        </p>

                        <p
                          style={{
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          <strong>Content:</strong>{" "}
                          {item.content}
                        </p>
                      </div>

                      <div className="task-buttons">
                        <button
                          onClick={() =>
                            openSyllabusEdit(item)
                          }
                        >
                          ✏️ Edit
                        </button>

                        <button
                          onClick={() =>
                            deleteSyllabus(item.id)
                          }
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ====================================================
            STUDY TASKS PAGE
        ==================================================== */}

        {activePage ===
          "tasks" && (
          <>
            <div className="page-header">
              <div>
                <h1>📝 Study Tasks</h1>
                <p>
                  Create tasks from your syllabus, then study with the timer.
                </p>
              </div>
            </div>

            <div className="dashboard-section">
              <h2>➕ Add Study Task</h2>

              <div className="task-form">
                <select
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    setTopic("");
                  }}
                >
                  <option value="">
                    Select Subject
                  </option>

                  {subjectOptions.map((name) => (
                    <option
                      key={name}
                      value={name}
                    >
                      {name}
                    </option>
                  ))}
                </select>

                <select
                  value={topic}
                  disabled={!subject}
                  onChange={(e) =>
                    setTopic(e.target.value)
                  }
                >
                  <option value="">
                    {subject
                      ? "Select Topic from Syllabus"
                      : "Select Subject First"}
                  </option>

                  {taskTopicOptions.map((item) => (
                    <option
                      key={item.id}
                      value={item.topic}
                    >
                      {item.topic}
                      {item.unit
                        ? ` — ${item.unit}`
                        : ""}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  value={date}
                  onChange={(e) =>
                    setDate(e.target.value)
                  }
                />

                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value)
                  }
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                <button
                  className="add-task"
                  onClick={addTask}
                >
                  + Add Task
                </button>
              </div>

              {subjectOptions.length === 0 && (
                <p className="empty-message">
                  Create a subject first.
                </p>
              )}

              {subject && taskTopicOptions.length === 0 && (
                <p className="empty-message">
                  No syllabus topics found for this subject.
                  Add the syllabus first.
                </p>
              )}
            </div>

            <div className="dashboard-section">
              <div className="section-header">
                <h2>My Study Tasks</h2>

                <select
                  value={taskFilter}
                  onChange={(e) =>
                    setTaskFilter(e.target.value)
                  }
                >
                  <option value="All">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {filteredTasks.length === 0 ? (
                <p className="empty-message">
                  No study tasks available.
                </p>
              ) : (
                <div className="task-list">
                  {filteredTasks.map((task) => (
                    <div
                      className="task-card"
                      key={task.id}
                    >
                      <div className="task-info">
                        <h3>{task.subject}</h3>

                        <p>
                          <strong>Topic:</strong>{" "}
                          {task.topic}
                        </p>

                        <p>
                          <strong>Date:</strong>{" "}
                          {formatDate(task.date)}
                        </p>

                        <p>
                          <strong>Priority:</strong>{" "}
                          {task.priority}
                        </p>

                        <p>
                          <strong>Status:</strong>{" "}

                          <span
                            className={
                              task.status === "Completed"
                                ? "completed-status"
                                : "pending-status"
                            }
                          >
                            {task.status}
                          </span>
                        </p>
                      </div>

                      <div className="task-buttons">
                        {task.status === "Pending" && (
                          <button
                            onClick={() =>
                              studyTaskNow(task)
                            }
                          >
                            ⏱️ Study Now
                          </button>
                        )}

                        <button
                          onClick={() =>
                            deleteTask(task.id)
                          }
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ====================================================
            EXAMS PAGE
        ==================================================== */}
                {activePage === "exams" && (
          <>
            <div className="page-header">
              <div>
                <h1>📅 Exams</h1>
                <p>Keep track of your upcoming examinations.</p>
              </div>
            </div>

            <div className="dashboard-section">
              <h2>➕ Add Exam</h2>

              <div className="task-form">
                <input
                  type="text"
                  placeholder="Exam Name"
                  value={examName}
                  onChange={(e) =>
                    setExamName(e.target.value)
                  }
                />

                <select
                  value={examSubject}
                  onChange={(e) =>
                    setExamSubject(e.target.value)
                  }
                >
                  <option value="">Select Subject</option>
                  {subjectOptions.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  value={examDate}
                  onChange={(e) =>
                    setExamDate(e.target.value)
                  }
                />

                <input
                  type="text"
                  placeholder="Description"
                  value={examDescription}
                  onChange={(e) =>
                    setExamDescription(e.target.value)
                  }
                />

                <button
                  className="add-task"
                  onClick={addExam}
                >
                  + Add Exam
                </button>
              </div>
            </div>

            <div className="dashboard-section">
              <div className="section-header">
                <h2>My Exams</h2>

                <button
                  onClick={async () => {
                    await loadSubjects();
                    await loadExams();
                  }}
                >
                  🔄 Refresh
                </button>
              </div>

              {exams.length === 0 ? (
                <p className="empty-message">
                  No exams available.
                </p>
              ) : (
                <div className="task-list">
                  {exams.map((exam) => (
                    <div
                      className="task-card"
                      key={exam.id}
                    >
                      <div className="task-info">
                        <h3>{exam.examName}</h3>

                        <p>
                          <strong>Subject:</strong>{" "}
                          {exam.subject}
                        </p>

                        <p>
                          <strong>Exam Date:</strong>{" "}
                          {formatDate(exam.examDate)}
                        </p>

                        <p>
                          <strong>Description:</strong>{" "}
                          {exam.description || "No description"}
                        </p>
                      </div>

                      <div className="task-buttons">
                        <button
                          onClick={() =>
                            openExamEdit(exam)
                          }
                        >
                          ✏️ Edit
                        </button>

                        <button
                          onClick={() =>
                            deleteExam(exam.id)
                          }
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ====================================================
            STUDY SESSIONS
        ==================================================== */}

        {activePage === "sessions" && (
          <>
            <div className="page-header">
              <div>
                <h1>⏱️ Study Sessions</h1>
                <p>
                  Select an existing task and focus until the timer ends.
                </p>
              </div>
            </div>

            {!activeStudySession ? (
              <div className="dashboard-section">
                <h2>▶️ Start Study Timer</h2>

                {pendingSessionTasks.length === 0 ? (
                  <p className="empty-message">
                    No pending study tasks found. Create a task first.
                  </p>
                ) : (
                  <div className="task-form">
                    <select
                      value={sessionTaskId}
                      onChange={(e) =>
                        setSessionTaskId(e.target.value)
                      }
                    >
                      <option value="">
                        Select Existing Study Task
                      </option>

                      {pendingSessionTasks.map((task) => (
                        <option
                          key={task.id}
                          value={String(task.id)}
                        >
                          {task.subject} — {task.topic}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min="20"
                      step="1"
                      placeholder="Timer in minutes (minimum 20)"
                      value={sessionDuration}
                      onChange={(e) =>
                        setSessionDuration(e.target.value)
                      }
                    />

                    <button
                      className="add-task"
                      onClick={startStudySession}
                      disabled={
                        !sessionTaskId ||
                        !Number.isInteger(Number(sessionDuration)) ||
                        Number(sessionDuration) < 20
                      }
                    >
                      ▶ Start Timer
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="dashboard-section">
                <h2>📖 Study Session in Progress</h2>

                <div
                  style={{
                    marginTop: "15px",
                    textAlign: "center",
                    padding: "24px",
                  }}
                >
                  <h3>{activeStudySession.subject}</h3>

                  <p>
                    <strong>Topic:</strong>{" "}
                    {activeStudySession.topic}
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {formatDate(activeStudySession.studyDate)}
                  </p>

                  <p>
                    <strong>Planned Timer:</strong>{" "}
                    {activeStudySession.plannedDurationMinutes} minutes
                  </p>

                  <div
                    className="game-timer"
                    style={{
                      margin: "25px auto",
                      maxWidth: "320px",
                      fontSize: "3rem",
                    }}
                  >
                    ⏱️ {formatCountdown(sessionRemainingSeconds)}
                  </div>

                  {sessionRemainingSeconds > 0 ? (
                    <>
                      <p className="pending-status">
                        🔒 Complete Task is locked.
                      </p>

                      <p className="empty-message">
                        Wait until the selected timer reaches 00:00.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="completed-status">
                        ✅ Timer completed. You can now complete this task.
                      </p>

                      <button
                        className="game-start-button"
                        onClick={completeStudySession}
                      >
                        ✓ Complete Task
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="dashboard-section">
              <div className="section-header">
                <h2>Study History</h2>

                <button
                  onClick={async () => {
                    await loadTasks();
                    await loadStudySessions();
                  }}
                >
                  🔄 Refresh
                </button>
              </div>

              {studySessions.length === 0 ? (
                <p className="empty-message">
                  No study sessions available.
                </p>
              ) : (
                <div className="task-list">
                  {studySessions.map((session) => (
                    <div
                      className="task-card"
                      key={session.id}
                    >
                      <div className="task-info">
                        <h3>{session.subject}</h3>

                        <p>
                          <strong>Topic:</strong>{" "}
                          {session.topic}
                        </p>

                        <p>
                          <strong>Date:</strong>{" "}
                          {formatDate(session.studyDate)}
                        </p>

                        <p>
                          <strong>Planned Timer:</strong>{" "}
                          {session.plannedDurationMinutes || 0} minutes
                        </p>

                        <p>
                          <strong>Actual Duration:</strong>{" "}
                          {session.active
                            ? "In progress"
                            : `${session.durationMinutes || 0} minutes`}
                        </p>

                        <p>
                          <strong>Status:</strong>{" "}

                          <span
                            className={
                              session.active
                                ? "pending-status"
                                : "completed-status"
                            }
                          >
                            {session.active ? "Active" : "Finished"}
                          </span>
                        </p>
                      </div>

                      {!session.active && (
                        <div className="task-buttons">
                          <button
                            onClick={() =>
                              deleteStudySession(session.id)
                            }
                          >
                            🗑 Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ====================================================
            STUDY BREAK
        ==================================================== */}

        {activePage === "break" && (
          <>
            <div className="page-header">
              <div>
                <h1>🎮 Study Break</h1>
                <p>
                  Complete 3 study tasks to unlock your break.
                </p>
              </div>
            </div>

            {!gameUnlocked && (
              <div className="game-locked-card">
                <div className="game-big-icon">🔒</div>

                <h2>Game Locked</h2>

                <p>
                  Complete 3 study tasks to unlock your 10-minute
                  study break.
                </p>

                <div className="game-task-progress">
                  <div className="game-progress-text">
                    {Math.min(gameCompletedTasks, 3)} / 3 tasks completed
                  </div>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.min(
                          (gameCompletedTasks / 3) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <button
                  className="game-tasks-button"
                  onClick={() =>
                    setActivePage("tasks")
                  }
                >
                  View Study Tasks
                </button>
              </div>
            )}

            {gameUnlocked && (
              <div className="game-unlocked-card">
                <div className="game-big-icon">🎉</div>

                <h2>Game Unlocked!</h2>

                <p>
                  You have completed {gameCompletedTasks} study tasks.
                </p>

                <p>You earned a 10-minute study break.</p>

                {!gameActive && (
                  <button
                    className="game-start-button"
                    onClick={startGame}
                    disabled={gameLoading}
                  >
                    {gameLoading
                      ? "Starting..."
                      : "Start Game"}
                  </button>
                )}

                {gameActive && (
                  <>
                    <div className="game-header">
                      <div>
                        <h2>🧠 Memory Match</h2>
                        <p>
                          Match all the pairs before time runs out.
                        </p>
                      </div>

                      <div className="game-timer">
                        ⏱️ {formatGameTime(gameRemainingSeconds)}
                      </div>
                    </div>

                    <div className="game-stats">
                      <div>
                        <strong>{score}</strong>
                        <span>Score</span>
                      </div>

                      <div>
                        <strong>{moves}</strong>
                        <span>Moves</span>
                      </div>

                      <div>
                        <strong>
                          {matchedCards.length / 2}
                        </strong>
                        <span>Matches</span>
                      </div>
                    </div>

                    <div className="memory-game">
                      {cards.map((card, index) => {
                        const isFlipped =
                          flippedCards.includes(index);

                        const isMatched =
                          matchedCards.includes(index);

                        return (
                          <button
                            key={card.id}
                            className={`memory-card ${
                              isFlipped || isMatched
                                ? "flipped"
                                : ""
                            }`}
                            onClick={() =>
                              handleCardClick(index)
                            }
                          >
                            {isFlipped || isMatched
                              ? card.value
                              : "?"}
                          </button>
                        );
                      })}
                    </div>

                    {gameFinished && (
                      <div className="game-complete">
                        <h2>🎉 Congratulations!</h2>

                        <p>You matched all the cards.</p>

                        <p>Score: {score}</p>

                        <button
                          className="game-start-button"
                          onClick={createGameCards}
                        >
                          Play Again
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* ======================================================
          EDIT MODAL
      ====================================================== */}

      {editType && editingItem && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>
              Edit{" "}
              {editType === "subject"
                ? "Subject"
                : editType === "exam"
                ? "Exam"
                : "Syllabus"}
            </h2>

            <div className="modal-form">
              {editType === "subject" && (
                <>
                  <label>Subject Name</label>

                  <input
                    type="text"
                    value={editName}
                    onChange={(e) =>
                      setEditName(e.target.value)
                    }
                  />

                  <label>Description</label>

                  <textarea
                    value={editDescription}
                    onChange={(e) =>
                      setEditDescription(e.target.value)
                    }
                  />
                </>
              )}

              {editType === "exam" && (
                <>
                  <label>Exam Name</label>

                  <input
                    type="text"
                    value={editName}
                    onChange={(e) =>
                      setEditName(e.target.value)
                    }
                  />

                  <label>Description</label>

                  <textarea
                    value={editDescription}
                    onChange={(e) =>
                      setEditDescription(e.target.value)
                    }
                  />
                </>
              )}

              {editType === "syllabus" && (
                <>
                  <label>Subject</label>

                  <select
                    value={editName}
                    onChange={(e) =>
                      setEditName(e.target.value)
                    }
                  >
                    <option value="">
                      Select Subject
                    </option>

                    {subjectOptions.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>

                  <label>Unit</label>

                  <input
                    type="text"
                    value={editUnit}
                    onChange={(e) =>
                      setEditUnit(e.target.value)
                    }
                  />

                  <label>Topic</label>

                  <input
                    type="text"
                    value={editTopic}
                    onChange={(e) =>
                      setEditTopic(e.target.value)
                    }
                  />

                  <label>Content</label>

                  <textarea
                    value={editContent}
                    onChange={(e) =>
                      setEditContent(e.target.value)
                    }
                  />
                </>
              )}
            </div>

            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={closeEditModal}
              >
                Cancel
              </button>

              <button
                className="primary-button"
                onClick={saveEdit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;