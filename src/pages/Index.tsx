import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";

const SLIDES_COUNT = 5;

const COLORS = [
  { id: "pink", label: "Нежно-розовый", hex: "#F2A8B8", votes: 0 },
  { id: "white", label: "Молочно-белый", hex: "#F5F0E8", votes: 0 },
  { id: "lilac", label: "Лиловый", hex: "#C5B8D6", votes: 0 },
  { id: "sage", label: "Шалфей", hex: "#8FAF8A", votes: 0 },
  { id: "peach", label: "Персиковый", hex: "#F5C9A0", votes: 0 },
  { id: "dusty", label: "Пыльная роза", hex: "#C49090", votes: 0 },
];

const BOUQUET_IDEAS = [
  { id: "mono", title: "Монохромный", desc: "Один оттенок — полная гармония", emoji: "🤍", votes: 14 },
  { id: "gradient", title: "Градиент", desc: "Плавный переход от светлого к тёмному", emoji: "🌸", votes: 21 },
  { id: "contrast", title: "Контраст", desc: "Противоположные цвета — смелый выбор", emoji: "🌺", votes: 9 },
  { id: "nature", title: "Природный", desc: "Зелень, белый, пастельный розовый", emoji: "🌿", votes: 17 },
];

export default function Index() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [animating, setAnimating] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<string, number>>(
    Object.fromEntries(BOUQUET_IDEAS.map((b) => [b.id, b.votes]))
  );
  const [votedFor, setVotedFor] = useState<string | null>(null);
  const [colorVotes, setColorVotes] = useState<Record<string, number>>(
    Object.fromEntries(COLORS.map((c) => [c.id, 0]))
  );
  const [votedColor, setVotedColor] = useState<string | null>(null);

  const goTo = useCallback(
    (idx: number) => {
      if (animating || idx === current) return;
      setDirection(idx > current ? "next" : "prev");
      setAnimating(true);
      setTimeout(() => {
        setCurrent(idx);
        setAnimating(false);
      }, 380);
    },
    [animating, current]
  );

  const next = useCallback(() => goTo(Math.min(current + 1, SLIDES_COUNT - 1)), [current, goTo]);
  const prev = useCallback(() => goTo(Math.max(current - 1, 0)), [current, goTo]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const voteForBouquet = (id: string) => {
    if (votedFor) return;
    setVotes((v) => ({ ...v, [id]: v[id] + 1 }));
    setVotedFor(id);
  };

  const voteForColor = (id: string) => {
    if (votedColor) return;
    setColorVotes((v) => ({ ...v, [id]: v[id] + 1 }));
    setVotedColor(id);
    setSelectedColor(id);
  };

  const totalColorVotes = Object.values(colorVotes).reduce((a, b) => a + b, 0);
  const totalBouquetVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  const slideClass = `slide-content ${animating ? (direction === "next" ? "slide-exit-left" : "slide-exit-right") : "slide-enter"}`;

  return (
    <div className="presentation-root">
      <div className="bg-decoration" />

      <div className="presentation-frame">
        <div className={slideClass}>
          {current === 0 && <Slide0 />}
          {current === 1 && <Slide1 />}
          {current === 2 && <Slide2 />}
          {current === 3 && <Slide3 />}
          {current === 4 && (
            <Slide4
              colors={COLORS}
              selectedColor={selectedColor}
              colorVotes={colorVotes}
              votedColor={votedColor}
              totalColorVotes={totalColorVotes}
              onVoteColor={voteForColor}
              bouquets={BOUQUET_IDEAS}
              votes={votes}
              votedFor={votedFor}
              totalBouquetVotes={totalBouquetVotes}
              onVoteBouquet={voteForBouquet}
            />
          )}
        </div>
      </div>

      <nav className="pres-nav">
        <button className="nav-btn" onClick={prev} disabled={current === 0} aria-label="Назад">
          <Icon name="ChevronLeft" size={20} />
        </button>
        <div className="dots">
          {Array.from({ length: SLIDES_COUNT }).map((_, i) => (
            <button
              key={i}
              className={`dot ${i === current ? "dot-active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Слайд ${i + 1}`}
            />
          ))}
        </div>
        <button className="nav-btn" onClick={next} disabled={current === SLIDES_COUNT - 1} aria-label="Вперёд">
          <Icon name="ChevronRight" size={20} />
        </button>
      </nav>

      <div className="slide-counter">{current + 1} / {SLIDES_COUNT}</div>

      <style>{presStyles}</style>
    </div>
  );
}

function Slide0() {
  return (
    <div className="slide slide-title">
      <div className="title-badge">Творческий проект · 2026</div>
      <div className="tulip-icon">🌷</div>
      <h1 className="main-title">
        Букет тюльпанов<br />
        <span className="title-accent">из синельной проволоки</span>
      </h1>
      <div className="divider" />
      <div className="author-block">
        <span className="author-label">Выполнила</span>
        <span className="author-name">Романова Дарья</span>
        <span className="author-class">9 «Б» класс</span>
      </div>
    </div>
  );
}

function Slide1() {
  return (
    <div className="slide slide-intro">
      <div className="slide-tag">01 — Введение</div>
      <h2 className="slide-heading">О чём этот проект?</h2>
      <div className="intro-grid">
        {[
          { icon: "🌿", text: "Синельная проволока — мягкий, гибкий материал, из которого можно создавать удивительные цветочные композиции" },
          { icon: "✂️", text: "Тюльпаны из синели выглядят реалистично, не вянут и служат украшением долгие годы" },
          { icon: "🎨", text: "Этот вид рукоделия развивает мелкую моторику, творческое мышление и художественный вкус" },
        ].map((c, i) => (
          <div key={i} className="intro-card" style={{ "--delay": `${0.1 + i * 0.1}s` } as React.CSSProperties}>
            <span className="card-icon">{c.icon}</span>
            <p>{c.text}</p>
          </div>
        ))}
      </div>
      <blockquote className="intro-quote">
        «Цветы, которые никогда не завянут — это искусство в чистом виде»
      </blockquote>
    </div>
  );
}

function Slide2() {
  return (
    <div className="slide slide-goals">
      <div className="slide-tag">02 — Цели и задачи</div>
      <h2 className="slide-heading">Что я хочу достичь?</h2>
      <div className="goals-layout">
        <div className="goal-main">
          <div className="goal-label">Цель проекта</div>
          <p className="goal-text">
            Создать авторский букет тюльпанов из синельной проволоки, изучив техники работы с материалом и разработав собственный дизайн
          </p>
        </div>
        <div className="tasks-list">
          <div className="task-label">Задачи</div>
          {[
            "Изучить историю и свойства синельной проволоки",
            "Освоить базовые техники скручивания и формирования лепестков",
            "Разработать несколько вариантов дизайна букета",
            "Создать готовый букет и оформить его",
            "Представить результат на школьной выставке",
          ].map((task, i) => (
            <div key={i} className="task-item" style={{ "--delay": `${0.1 + i * 0.1}s` } as React.CSSProperties}>
              <span className="task-num">0{i + 1}</span>
              <span>{task}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Slide3() {
  return (
    <div className="slide slide-history">
      <div className="slide-tag">03 — История</div>
      <h2 className="slide-heading">Синельная проволока сквозь века</h2>
      <div className="timeline">
        {[
          { year: "XIX век", text: "Синель появилась во Франции как текстильный материал для декора одежды и интерьера", icon: "🇫🇷" },
          { year: "1900-е", text: "Проволока в синельном покрытии стала популярным материалом для детского творчества", icon: "🎪" },
          { year: "1950-е", text: "Пик популярности — «pipe cleaners» активно использовались в США для поделок", icon: "✨" },
          { year: "Сегодня", text: "Возрождение интереса к ручному труду — синельная проволока в тренде у мастеров по всему миру", icon: "🌍" },
        ].map((item, i) => (
          <div key={i} className="timeline-item" style={{ "--delay": `${0.1 + i * 0.12}s` } as React.CSSProperties}>
            <div className="timeline-dot"><span>{item.icon}</span></div>
            <div className="timeline-content">
              <span className="timeline-year">{item.year}</span>
              <p className="timeline-text">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface Slide4Props {
  colors: typeof COLORS;
  selectedColor: string | null;
  colorVotes: Record<string, number>;
  votedColor: string | null;
  totalColorVotes: number;
  onVoteColor: (id: string) => void;
  bouquets: typeof BOUQUET_IDEAS;
  votes: Record<string, number>;
  votedFor: string | null;
  totalBouquetVotes: number;
  onVoteBouquet: (id: string) => void;
}

function Slide4({ colors, selectedColor, colorVotes, votedColor, totalColorVotes, onVoteColor, bouquets, votes, votedFor, totalBouquetVotes, onVoteBouquet }: Slide4Props) {
  return (
    <div className="slide slide-ideas">
      <div className="slide-tag">04 — Идеи букетов</div>
      <h2 className="slide-heading">Выбери свой любимый</h2>
      <div className="ideas-layout">
        <div className="color-section">
          <div className="section-label">🎨 Выбери цвет букета</div>
          <div className="colors-grid">
            {colors.map((c) => {
              const pct = totalColorVotes > 0 ? Math.round((colorVotes[c.id] / totalColorVotes) * 100) : 0;
              return (
                <button
                  key={c.id}
                  className={`color-btn ${selectedColor === c.id ? "color-btn-active" : ""} ${votedColor && votedColor !== c.id ? "color-btn-dim" : ""}`}
                  onClick={() => onVoteColor(c.id)}
                >
                  <span className="color-swatch" style={{ background: c.hex }} />
                  <span className="color-label">{c.label}</span>
                  {votedColor && <span className="color-pct">{pct}%</span>}
                </button>
              );
            })}
          </div>
          {!votedColor && <p className="vote-hint">Нажми, чтобы проголосовать</p>}
          {votedColor && <p className="vote-hint voted">✓ Ты выбрал: {colors.find((c) => c.id === votedColor)?.label}</p>}
        </div>

        <div className="bouquet-section">
          <div className="section-label">🌷 Идея букета — проголосуй!</div>
          <div className="bouquets-list">
            {bouquets.map((b) => {
              const pct = totalBouquetVotes > 0 ? Math.round((votes[b.id] / totalBouquetVotes) * 100) : 0;
              return (
                <button
                  key={b.id}
                  className={`bouquet-btn ${votedFor === b.id ? "bouquet-voted" : ""} ${votedFor && votedFor !== b.id ? "bouquet-dim" : ""}`}
                  onClick={() => onVoteBouquet(b.id)}
                >
                  <span className="bouquet-emoji">{b.emoji}</span>
                  <div className="bouquet-info">
                    <span className="bouquet-title">{b.title}</span>
                    <span className="bouquet-desc">{b.desc}</span>
                  </div>
                  {votedFor && (
                    <div className="vote-bar-wrap">
                      <div className="vote-bar" style={{ width: `${pct}%` }} />
                      <span className="vote-pct-label">{pct}%</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const presStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Golos+Text:wght@300;400;500&display=swap');

  .presentation-root {
    min-height: 100vh;
    background: #FAF8F5;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Golos Text', sans-serif;
    position: relative;
    overflow: hidden;
    padding: 2rem 1rem 5rem;
  }
  .bg-decoration {
    position: fixed; inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 10% 20%, rgba(194,168,168,0.14) 0%, transparent 60%),
      radial-gradient(ellipse 50% 60% at 85% 80%, rgba(143,175,138,0.1) 0%, transparent 60%),
      radial-gradient(ellipse 40% 40% at 50% 50%, rgba(242,168,184,0.07) 0%, transparent 70%);
    pointer-events: none;
  }
  .presentation-frame {
    width: 100%; max-width: 860px;
    min-height: 480px; position: relative;
  }
  .slide-content { width: 100%; }
  .slide-enter { animation: slideIn 0.38s cubic-bezier(0.25,0.46,0.45,0.94) both; }
  .slide-exit-left { animation: slideOutLeft 0.38s cubic-bezier(0.25,0.46,0.45,0.94) both; }
  .slide-exit-right { animation: slideOutRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94) both; }
  @keyframes slideIn { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideOutLeft { from { opacity:1; transform:translateY(0); } to { opacity:0; transform:translateY(-16px); } }
  @keyframes slideOutRight { from { opacity:1; transform:translateY(0); } to { opacity:0; transform:translateY(16px); } }

  .slide { padding: 2rem 0; animation: fadeUp 0.5s ease both; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

  .pres-nav {
    position: fixed; bottom: 1.6rem; left: 50%; transform: translateX(-50%);
    display: flex; align-items: center; gap: 1rem;
    background: rgba(255,255,255,0.88); backdrop-filter: blur(14px);
    border: 1px solid rgba(0,0,0,0.07); border-radius: 100px;
    padding: 0.5rem 1.2rem;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08); z-index: 100;
  }
  .nav-btn {
    width: 36px; height: 36px; border-radius: 50%;
    border: 1px solid rgba(0,0,0,0.1); background: transparent;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #5a4a4a; transition: all 0.2s;
  }
  .nav-btn:hover:not(:disabled) { background: #f2e8e8; transform: scale(1.05); }
  .nav-btn:disabled { opacity: 0.3; cursor: default; }
  .dots { display: flex; gap: 6px; align-items: center; }
  .dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: rgba(0,0,0,0.15); border: none; cursor: pointer;
    transition: all 0.25s; padding: 0;
  }
  .dot-active { width: 22px; border-radius: 4px; background: #C49090; }
  .slide-counter {
    position: fixed; bottom: 1.9rem; right: 2rem;
    font-size: 0.75rem; color: rgba(0,0,0,0.3);
    font-family: 'Golos Text', sans-serif; letter-spacing: 0.05em;
  }

  /* SLIDE 0 */
  .slide-title {
    text-align: center; padding: 3rem 2rem 2rem;
    display: flex; flex-direction: column; align-items: center; gap: 1.2rem;
  }
  .title-badge {
    font-size: 0.78rem; letter-spacing: 0.15em; text-transform: uppercase;
    color: #8FAF8A; font-weight: 500;
    border: 1px solid rgba(143,175,138,0.4); padding: 0.3rem 1rem; border-radius: 100px;
  }
  .tulip-icon { font-size: 3.5rem; animation: floatIcon 3s ease-in-out infinite; }
  @keyframes floatIcon { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
  .main-title {
    font-family: 'Cormorant', serif; font-size: clamp(2rem, 5vw, 3.4rem);
    font-weight: 300; line-height: 1.2; color: #2D2020; margin: 0;
  }
  .title-accent { color: #C49090; font-style: italic; }
  .divider {
    width: 60px; height: 1px;
    background: linear-gradient(to right, transparent, #C49090, transparent);
  }
  .author-block { display: flex; flex-direction: column; align-items: center; gap: 0.2rem; }
  .author-label { font-size: 0.75rem; color: rgba(0,0,0,0.4); text-transform: uppercase; letter-spacing: 0.1em; }
  .author-name { font-family: 'Cormorant', serif; font-size: 1.5rem; font-weight: 400; color: #2D2020; }
  .author-class { font-size: 0.85rem; color: #8FAF8A; font-weight: 500; }

  /* Common */
  .slide-tag { font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(0,0,0,0.35); margin-bottom: 0.5rem; }
  .slide-heading { font-family: 'Cormorant', serif; font-size: clamp(1.6rem, 4vw, 2.5rem); font-weight: 300; color: #2D2020; margin: 0 0 1.8rem; line-height: 1.15; }

  /* SLIDE 1 */
  .slide-intro { max-width: 760px; }
  .intro-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.8rem; }
  .intro-card {
    background: white; border-radius: 16px; padding: 1.4rem 1.2rem;
    border: 1px solid rgba(0,0,0,0.06);
    animation: fadeUp 0.5s ease calc(var(--delay)) both;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .intro-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.07); }
  .card-icon { font-size: 1.8rem; display: block; margin-bottom: 0.6rem; }
  .intro-card p { font-size: 0.9rem; color: #4a3a3a; line-height: 1.6; margin: 0; }
  .intro-quote {
    font-family: 'Cormorant', serif; font-size: 1.15rem; font-style: italic;
    color: #C49090; border-left: 2px solid #C49090; padding-left: 1.2rem; margin: 0;
  }

  /* SLIDE 2 */
  .slide-goals { max-width: 760px; }
  .goals-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
  @media (max-width: 600px) { .goals-layout { grid-template-columns: 1fr; } }
  .goal-main { background: linear-gradient(135deg, #F2A8B8 0%, #C49090 100%); border-radius: 20px; padding: 1.8rem; color: white; }
  .goal-label, .task-label { font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.7; margin-bottom: 0.8rem; }
  .goal-text { font-family: 'Cormorant', serif; font-size: 1.15rem; line-height: 1.6; margin: 0; font-weight: 400; }
  .tasks-list { display: flex; flex-direction: column; gap: 0.7rem; }
  .task-label { color: rgba(0,0,0,0.4); opacity: 1; }
  .task-item {
    display: flex; align-items: flex-start; gap: 0.8rem;
    font-size: 0.88rem; color: #3a2a2a; line-height: 1.5;
    animation: fadeUp 0.4s ease calc(var(--delay)) both;
  }
  .task-num { font-family: 'Cormorant', serif; font-size: 1rem; color: #C49090; font-weight: 600; min-width: 20px; padding-top: 1px; }

  /* SLIDE 3 */
  .slide-history { max-width: 760px; }
  .timeline { display: flex; flex-direction: column; gap: 1.2rem; }
  .timeline-item { display: flex; gap: 1.2rem; align-items: flex-start; animation: fadeUp 0.4s ease calc(var(--delay)) both; }
  .timeline-dot {
    width: 44px; height: 44px; border-radius: 50%;
    background: white; border: 1px solid rgba(0,0,0,0.08);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem; flex-shrink: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  .timeline-content { padding-top: 6px; }
  .timeline-year { font-family: 'Cormorant', serif; font-size: 1.1rem; font-weight: 600; color: #C49090; display: block; margin-bottom: 0.2rem; }
  .timeline-text { font-size: 0.88rem; color: #4a3a3a; line-height: 1.6; margin: 0; }

  /* SLIDE 4 */
  .slide-ideas { max-width: 860px; }
  .ideas-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
  @media (max-width: 680px) { .ideas-layout { grid-template-columns: 1fr; } }
  .section-label { font-size: 0.78rem; font-weight: 500; color: rgba(0,0,0,0.45); letter-spacing: 0.05em; margin-bottom: 0.9rem; text-transform: uppercase; }
  .colors-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem; margin-bottom: 0.7rem; }
  .color-btn {
    display: flex; flex-direction: column; align-items: center; gap: 0.35rem;
    padding: 0.7rem 0.4rem; border-radius: 12px;
    border: 2px solid transparent; background: white;
    cursor: pointer; transition: all 0.2s; font-family: 'Golos Text', sans-serif;
  }
  .color-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  .color-btn-active { border-color: #C49090; box-shadow: 0 0 0 3px rgba(196,144,144,0.2); }
  .color-btn-dim { opacity: 0.4; }
  .color-swatch { width: 32px; height: 32px; border-radius: 50%; border: 2px solid rgba(0,0,0,0.08); display: block; }
  .color-label { font-size: 0.7rem; color: #4a3a3a; text-align: center; line-height: 1.3; }
  .color-pct { font-size: 0.75rem; font-weight: 600; color: #C49090; }
  .vote-hint { font-size: 0.78rem; color: rgba(0,0,0,0.35); text-align: center; margin: 0; padding-top: 0.3rem; }
  .vote-hint.voted { color: #8FAF8A; font-weight: 500; }
  .bouquets-list { display: flex; flex-direction: column; gap: 0.6rem; }
  .bouquet-btn {
    display: flex; align-items: center; gap: 0.8rem;
    padding: 0.8rem 1rem; border-radius: 12px;
    border: 1.5px solid rgba(0,0,0,0.07); background: white;
    cursor: pointer; text-align: left; transition: all 0.2s;
    font-family: 'Golos Text', sans-serif; position: relative; overflow: hidden;
  }
  .bouquet-btn:hover { border-color: #C49090; transform: translateX(4px); }
  .bouquet-voted { border-color: #C49090; background: rgba(196,144,144,0.06); }
  .bouquet-dim { opacity: 0.4; }
  .bouquet-emoji { font-size: 1.5rem; flex-shrink: 0; }
  .bouquet-info { display: flex; flex-direction: column; gap: 0.1rem; flex: 1; }
  .bouquet-title { font-size: 0.9rem; font-weight: 500; color: #2D2020; }
  .bouquet-desc { font-size: 0.78rem; color: rgba(0,0,0,0.45); }
  .vote-bar-wrap { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: rgba(0,0,0,0.06); }
  .vote-bar { height: 100%; background: linear-gradient(to right, #F2A8B8, #C49090); transition: width 0.5s ease; }
  .vote-pct-label { position: absolute; right: 0.8rem; top: -1.4rem; font-size: 0.72rem; font-weight: 600; color: #C49090; }
`;
