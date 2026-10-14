// app.js - Lógica funcional e interactividad de TuClaseInteligente

document.addEventListener("DOMContentLoaded", () => {
  // Inicializar iconos
  if (window.lucide) lucide.createIcons();

  // Año dinámico
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Función auxiliar para notificación Toast
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMsg");
  function showToast(mensaje) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = mensaje;
    toast.classList.remove("hidden");
    toast.classList.add("flex");
    setTimeout(() => {
      toast.classList.add("hidden");
      toast.classList.remove("flex");
    }, 2400);
  }

  // ==========================================
  // 1. MODO OSCURO Y MODO PROYECTOR
  // ==========================================
  const themeToggle = document.getElementById("themeToggle");
  if (localStorage.getItem("theme") === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.classList.add("dark");
  }

  themeToggle?.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  const projectorBtn = document.getElementById("projectorBtn");
  const exitProjectorBtn = document.getElementById("exitProjectorBtn");

  function toggleProjectorMode(forceState) {
    const active = typeof forceState === "boolean" ? forceState : !document.body.classList.contains("projector-mode");
    document.body.classList.toggle("projector-mode", active);
    if (active) {
      document.getElementById("herramientas")?.scrollIntoView({ behavior: "smooth" });
      showToast("Modo Proyector activado (Pulsa Esc para salir)");
    }
  }

  projectorBtn?.addEventListener("click", () => toggleProjectorMode(true));
  exitProjectorBtn?.addEventListener("click", () => toggleProjectorMode(false));

  // Atajos de teclado (Ctrl+K buscador / Esc salir proyector)
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      document.getElementById("searchInput")?.focus();
    }
    if (e.key === "Escape" && document.body.classList.contains("projector-mode")) {
      toggleProjectorMode(false);
    }
  });

  // ==========================================
  // 2. RENDERIZADO DE RECURSOS, FILTROS Y FAVORITOS
  // ==========================================
  const resourceGrid = document.getElementById("resourceGrid");
  const searchInput = document.getElementById("searchInput");
  const formatFilter = document.getElementById("formatFilter");
  const favFilterBtn = document.getElementById("favFilterBtn");
  const favCountSpan = document.getElementById("favCount");
  const catButtons = document.querySelectorAll(".cat-btn");
  const quickChips = document.querySelectorAll(".quick-chip");
  const noResults = document.getElementById("noResults");
  const resetFiltersBtn = document.getElementById("resetFiltersBtn");

  let activeCat = "all";
  let onlyFavs = false;
  let favorites = JSON.parse(localStorage.getItem("tci_favs") || "[]");

  function updateFavCounter() {
    if (favCountSpan) favCountSpan.textContent = favorites.length;
  }
  updateFavCounter();

  function renderResources() {
    if (!resourceGrid || typeof DATABASE_RECURSOS === "undefined") return;
    const query = (searchInput?.value || "").toLowerCase().trim();
    const format = formatFilter?.value || "all";

    resourceGrid.innerHTML = "";
    let count = 0;

    DATABASE_RECURSOS.forEach(item => {
      const matchQuery = item.titulo.toLowerCase().includes(query) ||
                         item.descripcion.toLowerCase().includes(query) ||
                         (item.tags && item.tags.some(t => t.toLowerCase().includes(query)));
      const matchCat = activeCat === "all" || item.rama === activeCat;
      const matchFormat = format === "all" || item.formato === format;
      const isFav = favorites.includes(item.id);
      const matchFav = !onlyFavs || isFav;

      if (matchQuery && matchCat && matchFormat && matchFav) {
        count++;
        const btnInfo = item.tipoAccion === "copia-drive" 
          ? { icon: "copy", label: "Crear Copia Drive" }
          : item.tipoAccion === "jugar"
          ? { icon: "external-link", label: "Abrir Actividad" }
          : { icon: "download", label: "Descargar PDF" };

        const card = document.createElement("article");
        card.className = "glass-card rounded-2xl border border-slate-200 dark:border-slate-700/70 p-6 flex flex-col justify-between hover:shadow-xl transition duration-200";
        card.innerHTML = `
          <div>
            <div class="flex items-center justify-between gap-2 mb-3">
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-semibold px-2.5 py-1 rounded-lg border ${item.badgeColor}">${item.formatoTexto}</span>
                ${item.isNew ? '<span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-brand-600 text-white">Nuevo</span>' : ''}
              </div>
              <button data-fav-id="${item.id}" class="fav-toggle p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="Guardar en favoritos">
                <i data-lucide="bookmark" class="w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}"></i>
              </button>
            </div>
            <span class="text-xs text-slate-400 font-medium">${item.ramaTexto} · ${item.nivel}</span>
            <h3 class="text-lg font-bold mt-1 mb-2">${item.titulo}</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400 mb-6">${item.descripcion}</p>
          </div>
          <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span class="text-xs text-slate-500 font-medium">${item.peso}</span>
            <div class="flex items-center gap-2">
              <button data-copy-link="${item.enlace}" class="copy-link-btn p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition" title="Copiar enlace para compartir">
                <i data-lucide="link" class="w-4 h-4"></i>
              </button>
              <a href="${item.enlace}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition">
                <i data-lucide="${btnInfo.icon}" class="w-3.5 h-3.5"></i> ${btnInfo.label}
              </a>
            </div>
          </div>
        `;
        resourceGrid.appendChild(card);
      }
    });

    noResults?.classList.toggle("hidden", count > 0);
    if (window.lucide) lucide.createIcons();
  }

  // Delegación de clics en las tarjetas (Favoritos y Copiar link)
  resourceGrid?.addEventListener("click", (e) => {
    const favBtn = e.target.closest(".fav-toggle");
    if (favBtn) {
      const id = favBtn.getAttribute("data-fav-id");
      if (favorites.includes(id)) {
        favorites = favorites.filter(f => f !== id);
        showToast("Eliminado de tus guardados");
      } else {
        favorites.push(id);
        showToast("Recurso guardado en favoritos ⭐");
      }
      localStorage.setItem("tci_favs", JSON.stringify(favorites));
      updateFavCounter();
      renderResources();
      return;
    }

    const copyBtn = e.target.closest(".copy-link-btn");
    if (copyBtn) {
      const url = copyBtn.getAttribute("data-copy-link");
      navigator.clipboard.writeText(url);
      showToast("Enlace copiado para Classroom / WhatsApp");
    }
  });

  searchInput?.addEventListener("input", renderResources);
  formatFilter?.addEventListener("change", renderResources);

  favFilterBtn?.addEventListener("click", () => {
    onlyFavs = !onlyFavs;
    favFilterBtn.classList.toggle("ring-2", onlyFavs);
    favFilterBtn.classList.toggle("ring-amber-500", onlyFavs);
    renderResources();
  });

  catButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      catButtons.forEach(b => {
        b.classList.remove("bg-brand-600", "text-white");
        b.classList.add("bg-slate-100", "dark:bg-slate-800");
      });
      btn.classList.add("bg-brand-600", "text-white");
      btn.classList.remove("bg-slate-100", "dark:bg-slate-800");
      activeCat = btn.getAttribute("data-cat");
      renderResources();
    });
  });

  quickChips.forEach(chip => {
    chip.addEventListener("click", () => {
      const fmt = chip.getAttribute("data-quick-filter");
      if (formatFilter) formatFilter.value = fmt;
      renderResources();
      document.getElementById("recursos")?.scrollIntoView({ behavior: "smooth" });
    });
  });

  resetFiltersBtn?.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    if (formatFilter) formatFilter.value = "all";
    onlyFavs = false;
    activeCat = "all";
    catButtons[0]?.click();
  });

  renderResources();

  // ==========================================
  // 3. MICROHERRAMIENTAS DE AULA (PDI)
  // ==========================================
  const studentsInput = document.getElementById("studentsInput");
  if (studentsInput) {
    const savedStudents = localStorage.getItem("tci_students");
    if (savedStudents) studentsInput.value = savedStudents;
    studentsInput.addEventListener("input", () => {
      localStorage.setItem("tci_students", studentsInput.value);
    });
  }

  function getStudentList() {
    return (studentsInput?.value || "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);
  }

  // 3.1 Ruleta Aleatoria
  const spinBtn = document.getElementById("spinBtn");
  const rouletteDisplay = document.getElementById("rouletteDisplay");
  spinBtn?.addEventListener("click", () => {
    const list = getStudentList();
    if (list.length === 0) return showToast("Añade nombres en la lista superior");
    spinBtn.disabled = true;
    let ticks = 0;
    const interval = setInterval(() => {
      rouletteDisplay.textContent = list[Math.floor(Math.random() * list.length)];
      ticks++;
      if (ticks > 16) {
        clearInterval(interval);
        const winner = list[Math.floor(Math.random() * list.length)];
        rouletteDisplay.textContent = `🎉 ${winner}`;
        spinBtn.disabled = false;
        if (window.confetti) confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      }
    }, 65);
  });

  // 3.2 Temporizador de Retos con Web Audio API
  let totalSeconds = 300;
  let remainingSeconds = 300;
  let timerInterval = null;
  const timerDisplay = document.getElementById("timerDisplay");
  const timerStartBtn = document.getElementById("timerStartBtn");
  const timerResetBtn = document.getElementById("timerResetBtn");

  function formatTime(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  function playBeep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {}
  }

  document.querySelectorAll(".timer-preset").forEach(btn => {
    btn.addEventListener("click", () => {
      clearInterval(timerInterval);
      timerInterval = null;
      totalSeconds = parseInt(btn.getAttribute("data-time"), 10);
      remainingSeconds = totalSeconds;
      if (timerDisplay) timerDisplay.textContent = formatTime(remainingSeconds);
    });
  });

  timerStartBtn?.addEventListener("click", () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      return;
    }
    timerInterval = setInterval(() => {
      if (remainingSeconds > 0) {
        remainingSeconds--;
        if (timerDisplay) timerDisplay.textContent = formatTime(remainingSeconds);
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        playBeep();
        showToast("⏰ ¡Tiempo finalizado!");
      }
    }, 1000);
  });

  timerResetBtn?.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
    remainingSeconds = totalSeconds;
    if (timerDisplay) timerDisplay.textContent = formatTime(remainingSeconds);
  });

  // 3.3 Generador de Equipos
  const generateTeamsBtn = document.getElementById("generateTeamsBtn");
  const teamSizeSelect = document.getElementById("teamSizeSelect");
  const teamsOutput = document.getElementById("teamsOutput");
  const teamNames = ["Halcones", "Titanes", "Exploradores", "Fénix", "Rayos", "Cometas", "Guardianes", "Inventores"];

  generateTeamsBtn?.addEventListener("click", () => {
    const list = [...getStudentList()].sort(() => Math.random() - 0.5);
    const size = parseInt(teamSizeSelect?.value || "3", 10);
    if (!teamsOutput || list.length === 0) return;

    teamsOutput.innerHTML = "";
    let groupIndex = 0;
    for (let i = 0; i < list.length; i += size) {
      const chunk = list.slice(i, i + size);
      const tName = teamNames[groupIndex % teamNames.length];
      const div = document.createElement("div");
      div.className = "p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700";
      div.innerHTML = `<strong class="text-emerald-600 dark:text-emerald-400">Equipo ${tName}:</strong> ${chunk.join(", ")}`;
      teamsOutput.appendChild(div);
      groupIndex++;
    }
  });

  // 3.4 Semáforo de Ruido
  const noiseStatusBox = document.getElementById("noiseStatusBox");
  const noiseTitle = document.getElementById("noiseTitle");
  const noiseDesc = document.getElementById("noiseDesc");

  const noiseStates = {
    red: {
      title: "🔴 Silencio Absoluto",
      desc: "Trabajo individual y concentración máxima",
      classes: "bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400"
    },
    amber: {
      title: "🟡 Voz Baja / Susurro",
      desc: "Consultas en pareja sin molestar a otras mesas",
      classes: "bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400"
    },
    green: {
      title: "🟢 Trabajo en Equipo",
      desc: "Debate y colaboración activa permitida",
      classes: "bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400"
    }
  };

  document.querySelectorAll(".noise-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const st = noiseStates[btn.getAttribute("data-level")];
      if (!st || !noiseStatusBox) return;
      noiseStatusBox.className = `h-24 rounded-xl border-2 flex flex-col items-center justify-center p-2 mb-4 transition-all ${st.classes}`;
      noiseTitle.textContent = st.title;
      noiseDesc.textContent = st.desc;
    });
  });

  // 3.5 Lanzador de Dados
  const rollDiceBtn = document.getElementById("rollDiceBtn");
  const diceCountSelect = document.getElementById("diceCountSelect");
  const diceContainer = document.getElementById("diceContainer");
  const diceSum = document.getElementById("diceSum");

  rollDiceBtn?.addEventListener("click", () => {
    const count = parseInt(diceCountSelect?.value || "2", 10);
    let sum = 0;
    diceContainer.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const val = Math.floor(Math.random() * 6) + 1;
      sum += val;
      const span = document.createElement("span");
      span.className = "text-3xl font-extrabold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700";
      span.textContent = `🎲 ${val}`;
      diceContainer.appendChild(span);
    }
    if (diceSum) diceSum.textContent = sum;
  });

  // 3.6 Tarjetas de Preguntas / Debate
  const nextPromptBtn = document.getElementById("nextPromptBtn");
  const promptCategory = document.getElementById("promptCategory");
  const promptDisplay = document.getElementById("promptDisplay");

  nextPromptBtn?.addEventListener("click", () => {
    const cat = promptCategory?.value || "inicio";
    const pool = (typeof PROMPT_QUESTIONS !== "undefined" && PROMPT_QUESTIONS[cat]) ? PROMPT_QUESTIONS[cat] : [];
    if (pool.length > 0 && promptDisplay) {
      const randomQ = pool[Math.floor(Math.random() * pool.length)];
      promptDisplay.textContent = `"${randomQ}"`;
    }
  });

  // 3.7 Pizarra Rápida Persistente
  const quickNotes = document.getElementById("quickNotes");
  const clearNotesBtn = document.getElementById("clearNotesBtn");
  if (quickNotes) {
    quickNotes.value = localStorage.getItem("tci_notes") || "";
    quickNotes.addEventListener("input", () => {
      localStorage.setItem("tci_notes", quickNotes.value);
    });
  }
  clearNotesBtn?.addEventListener("click", () => {
    if (quickNotes) quickNotes.value = "";
    localStorage.removeItem("tci_notes");
    showToast("Pizarra limpia");
  });

  // ==========================================
  // 4. ACADEMIA EXPRÉS (TRUCOS TIKTOK)
  // ==========================================
  const hacksGrid = document.getElementById("hacksGrid");
  if (hacksGrid && typeof DATABASE_HACKS !== "undefined") {
    DATABASE_HACKS.forEach(hack => {
      const div = document.createElement("div");
      div.className = "p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col justify-between";
      div.innerHTML = `
        <div>
          <span class="text-[11px] font-bold uppercase text-amber-600">⚡ Hack Rápido</span>
          <h3 class="font-bold text-base mt-1 mb-2">${hack.titulo}</h3>
          <p class="text-xs text-slate-600 dark:text-slate-400 mb-4">${hack.explicacion}</p>
        </div>
        <div class="flex items-center justify-between gap-2 pt-3 border-t border-slate-200/70 dark:border-slate-700">
          <code class="px-2.5 py-1 rounded-lg bg-slate-200/80 dark:bg-slate-900 text-xs font-mono font-bold text-brand-600 dark:text-brand-400">${hack.comando}</code>
          <button data-cmd="${hack.comando}" class="copy-hack-btn px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition">
            Copiar
          </button>
        </div>
      `;
      hacksGrid.appendChild(div);
    });

    hacksGrid.addEventListener("click", (e) => {
      const btn = e.target.closest(".copy-hack-btn");
      if (btn) {
        const cmd = btn.getAttribute("data-cmd");
        navigator.clipboard.writeText(cmd);
        showToast(`Comando "${cmd}" copiado`);
      }
    });
  }
});
