/* eslint-disable prefer-const */
"use client"

import { useEffect, useState } from "react"

interface LeetCodeStats {
  username: string
  ranking: number
  solved: { all: number; easy: number; medium: number; hard: number }
  total: { all: number; easy: number; medium: number; hard: number }
  calendar: Record<string, number>
  submissionsLastYear: number
  totalActiveDays: number
  streak: number
}

// ─── Constants ──────────────────────────────────────────────────────────────
const R = 42
const CX = 50, CY = 50
const CIRC = 2 * Math.PI * R
const TOTAL_ARC_DEG = 270
const TOTAL_ARC_LEN = (TOTAL_ARC_DEG / 360) * CIRC
const GAP_ARC = 2
const NUM_GAPS = 2
const USABLE_ARC = TOTAL_ARC_LEN - NUM_GAPS * GAP_ARC
const GAP_DEG = (GAP_ARC / CIRC) * 360
const DASHOFFSET = 66
const START_ROT = 225

function segmentArc(count: number, total: number) {
  return total > 0 ? (count / total) * USABLE_ARC : 0
}

function segmentRot(prevArc: number, prevRot: number) {
  return prevRot + (prevArc / CIRC) * 360 + GAP_DEG
}

// ─── Components ─────────────────────────────────────────────────────────────

function HeatmapSVG({ calendar }: { calendar: Record<string, number> }) {
  const calendarKeys = Object.keys(calendar).map(Number);
  const maxTimestamp = calendarKeys.length > 0 ? Math.max(...calendarKeys) * 1000 : Date.now();
  const today = new Date(maxTimestamp);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    count: number;
    date: Date;
  } | null>(null);

  const startDate = new Date(today.getFullYear(), today.getMonth() - 11, 1);

  const monthsData = [];
  let tempDate = new Date(startDate);

  while (tempDate <= today) {
    const month = tempDate.getMonth();
    const year = tempDate.getFullYear();
    const daysInMonth = [];

    const lastDayOfMonth = new Date(year, month + 1, 0);
    for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
      const date = new Date(year, month, d);
      if (date > today) break;

      const ts = Math.floor(Date.UTC(year, month, d) / 1000);
      daysInMonth.push({
        date,
        count: calendar[String(ts)] ?? 0,
        dayOfWeek: date.getDay()
      });
    }

    monthsData.push({
      name: dateToMonthName(month),
      days: daysInMonth,
      monthIndex: month
    });

    tempDate.setMonth(tempDate.getMonth() + 1);
  }

  function dateToMonthName(m: number) {
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m];
  }

  const CELL = 10;
  const GAP = 3;
  const STEP = CELL + GAP;
  const MONTH_SPACING = 8;

  let currentX = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderData: any[] = [];
  const labels: { label: string; x: number }[] = [];

  monthsData.forEach((m) => {
    labels.push({ label: m.name, x: currentX });

    let colIndex = 0;
    m.days.forEach((day) => {
      const firstDayOffset = m.days[0].dayOfWeek;
      const dayIndex = day.date.getDate();
      colIndex = Math.floor((dayIndex + firstDayOffset - 1) / 7);

      renderData.push({
        x: currentX + colIndex * STEP,
        y: day.dayOfWeek * STEP,
        count: day.count,
        date: day.date
      });
    });

    const numCols = colIndex + 1;
    currentX += numCols * STEP + MONTH_SPACING;
  });

  const maxCountInYear = Math.max(...Object.values(calendar), 1);

  function getColor(count: number) {
    if (count === 0) return "rgba(255, 255, 255, 0.08)";
    const ratio = count / maxCountInYear;
    if (ratio >= 0.75) return "#2cbb5d";
    if (ratio >= 0.5) return "#40c463";
    if (ratio >= 0.25) return "#9be9a8";
    return "#216e39";
  }

  return (
    <div className="w-full overflow-x-auto relative mt-4 no-scrollbar">
      <svg viewBox={`0 0 ${currentX} 115`} className="h-28.75" shapeRendering="geometricPrecision">
        {renderData.map((d, i) => (
          <rect
            key={i}
            x={d.x}
            y={d.y}
            width={CELL}
            height={CELL}
            rx={2}
            fill={getColor(d.count)}
            className="transition-opacity duration-200 hover:opacity-70 cursor-pointer"
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setTooltip({
                x: rect.x + rect.width / 2,
                y: rect.y - 10,
                count: d.count,
                date: d.date
              });
            }}
            onMouseLeave={() => setTooltip(null)}
          />
        ))}
        {labels.map((l, i) => (
          <text key={i} x={l.x} y={108} fontSize="10" fill="#888" className="font-medium">
            {l.label}
          </text>
        ))}
      </svg>
      {tooltip && (
        <div
          className="fixed z-50 px-2 py-1 text-xs bg-black text-white rounded shadow-lg pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)"
          }}
        >
          <div>{tooltip.count} submissions</div>
          <div className="text-white/60">
            {tooltip.date.toDateString()}
          </div>
        </div>
      )}
    </div>
  );
}

function RingSegment({ bgArc, fgArc, rot, fgColor }: { bgArc: number; fgArc: number; rot: number; fgColor: string }) {
  return (
    <g style={{ transform: `rotate(${rot}deg)`, transformOrigin: `${CX}px ${CY}px` }}>
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="#333" strokeWidth={3} strokeLinecap="round" strokeDasharray={`${bgArc} ${CIRC - bgArc}`} strokeDashoffset={DASHOFFSET} />
      <circle cx={CX} cy={CY} r={R} fill="none" stroke={fgColor} strokeWidth={3} strokeLinecap="round" strokeDasharray={`${fgArc} ${CIRC - fgArc}`} strokeDashoffset={DASHOFFSET} />
    </g>
  )
}

function DonutChart({ solved, total }: { solved: LeetCodeStats["solved"]; total: LeetCodeStats["total"] }) {
  const easyArc = segmentArc(total.easy, total.all)
  const medArc = segmentArc(total.medium, total.all)
  const hardArc = segmentArc(total.hard, total.all)
  const easyRot = START_ROT
  const medRot = segmentRot(easyArc, easyRot)
  const hardRot = segmentRot(medArc, medRot)

  return (
    <div className="relative flex h-36 w-36 items-center justify-center shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <RingSegment bgArc={easyArc} fgArc={segmentArc(solved.easy, total.easy) * (easyArc / USABLE_ARC)} rot={easyRot} fgColor="#00b8a3" />
        <RingSegment bgArc={medArc} fgArc={segmentArc(solved.medium, total.medium) * (medArc / USABLE_ARC)} rot={medRot} fgColor="#ffc01e" />
        <RingSegment bgArc={hardArc} fgArc={segmentArc(solved.hard, total.hard) * (hardArc / USABLE_ARC)} rot={hardRot} fgColor="#ef4743" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{solved.all}</span>
          <span className="text-sm text-white/30">/{total.all}</span>
        </div>
        <div className="text-[12px] text-[#00b8a3] flex items-center gap-1">
          <span className="text-[10px]">✓</span> Solved
        </div>
      </div>
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] text-white/40">
        <span className="font-bold text-white/80">1</span> Attempting
      </div>
    </div>
  )
}

function DiffPill({ label, solved, total, color }: { label: string; solved: number; total: number; color: string }) {
  return (
    <div className="flex w-28 flex-col items-start rounded-lg bg-white/5 p-2 px-4">
      <div className="text-[12px] font-medium" style={{ color }}>{label}</div>
      <div className="text-sm font-bold">{solved}<span className="font-normal text-white/20 ml-1">/{total}</span></div>
    </div>
  )
}

export function LeetCodeCard({ username = "Ashutosh_Sharan" }: { username?: string }) {
  const [stats, setStats] = useState<LeetCodeStats | null>(null)

  useEffect(() => {
    fetch(`/api/leetcode?username=${username}`)
      .then((r) => r.json())
      .then((data) => !data.error && setStats(data))
  }, [username])

  const data = stats || {
    solved: { all: 17, easy: 15, medium: 2, hard: 0 },
    total: { all: 3915, easy: 940, medium: 2048, hard: 927 },
    submissionsLastYear: 48,
    totalActiveDays: 5,
    streak: 2,
    calendar: {}
  }

  return (
    <div className="w-full p-4 text-white bg-[#0a0a0a] rounded-2xl">

      {/* ─── MOBILE LAYOUT (hidden on lg+) ──────────────────────────────── */}
      <div className="lg:hidden space-y-3">

        {/* Donut + Pills side by side */}
        <div className="flex items-center gap-28  bg-[#1a1a1a60] border-2 border-white/5 rounded-2xl p-4">
          <DonutChart solved={data.solved} total={data.total} />
          <div className="flex flex-col gap-2 flex-1">
            <DiffPill label="Easy" solved={data.solved.easy} total={data.total.easy} color="#00b8a3" />
            <DiffPill label="Med." solved={data.solved.medium} total={data.total.medium} color="#ffc01e" />
            <DiffPill label="Hard" solved={data.solved.hard} total={data.total.hard} color="#ef4743" />
          </div>
        </div>

        {/* Badges row */}
        <div className="flex gap-3 bg-[#1a1a1a60] border-2 border-white/5 rounded-2xl p-4 relative overflow-hidden">
          <div className="flex-1">
            <span className="text-[11px] text-white/40 block mb-1">Badges</span>
            <span className="text-3xl font-bold">0</span>
          </div>
          <div className="flex-1">
            <span className="text-[11px] text-white/40 block">Locked Badge</span>
            <span className="text-sm font-semibold">Apr LeetCoding Challenge</span>
          </div>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-10">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />
            </svg>
          </div>
        </div>

        {/* Heatmap */}
        <div className="bg-[#1a1a1a60] border-2 border-white/5 rounded-2xl p-4">
          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold">{data.submissionsLastYear}</span>
              <span className="text-xs text-white/40">submissions this year</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-white/40 mb-1">
            <span>Active days: <span className="text-white font-medium">{data.totalActiveDays}</span></span>
            <span>Max streak: <span className="text-white font-medium">{data.streak}</span></span>
          </div>

          <HeatmapSVG calendar={data.calendar} />

          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-white/40">
            <span>Less</span>
            <div className="flex gap-1 mx-1">
              {["rgba(255,255,255,0.08)", "#216e39", "#30a14e", "#40c463", "#9be9a8"].map((c) => (
                <div key={c} className="w-3 h-3 rounded-[2px]" style={{ background: c }} />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>

      {/* ─── DESKTOP LAYOUT (hidden below lg) — ORIGINAL, UNTOUCHED ────── */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-7 flex items-center justify-between gap-6 bg-[#1a1a1a60] border-2 border-white/5 rounded-2xl p-6">
            <DonutChart solved={data.solved} total={data.total} />
            <div className="flex flex-col gap-2">
              <DiffPill label="Easy" solved={data.solved.easy} total={data.total.easy} color="#00b8a3" />
              <DiffPill label="Med." solved={data.solved.medium} total={data.total.medium} color="#ffc01e" />
              <DiffPill label="Hard" solved={data.solved.hard} total={data.total.hard} color="#ef4743" />
            </div>
          </div>

          <div className="col-span-5 flex flex-col justify-between bg-[#1a1a1a60] border-2 border-white/5 rounded-2xl p-6 relative overflow-hidden">
            <div>
              <span className="text-[11px] text-white/40 block mb-1">Badges</span>
              <span className="text-3xl font-bold">0</span>
            </div>
            <div className="mt-4">
              <span className="text-[11px] text-white/40 block">Locked Badge</span>
              <span className="text-sm font-semibold">Apr LeetCoding Challenge</span>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-[#1a1a1a60] border-2 border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold">{data.submissionsLastYear}</span>
              <span className="text-sm text-white/40">submissions in the past year</span>
              <span className="text-white/20 text-xs ml-1 cursor-help">ⓘ</span>
            </div>
            <div className="flex items-center gap-4 text-[12px]">
              <div className="text-white/40">Total active days: <span className="text-white font-medium">{data.totalActiveDays}</span></div>
              <div className="text-white/40">Max streak: <span className="text-white font-medium">{data.streak}</span></div>
              <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1 rounded text-white/60 transition-colors">
                Current <span className="text-[8px]">▼</span>
              </button>
            </div>
          </div>

          <HeatmapSVG calendar={data.calendar} />

          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-white/40">
            <span>Less</span>
            <div className="flex gap-1 mx-1">
              {["rgba(255,255,255,0.08)", "#216e39", "#30a14e", "#40c463", "#9be9a8"].map((c) => (
                <div key={c} className="w-3 h-3 rounded-[2px]" style={{ background: c }} />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>

    </div>
  )
}