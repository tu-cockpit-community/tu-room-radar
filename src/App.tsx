import React, { useState, useMemo } from "react";
import {
  MapPin,
  Search,
  Zap,
  Wifi,
  Users,
  Clock,
  ExternalLink,
  Info,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Filter,
} from "lucide-react";

interface CampusRoomItem {
  id: string;
  code: string;
  name: string;
  building: "freihaus" | "hauptgebaeude" | "gusshaus" | "getreidemarkt";
  buildingName: string;
  floor: string;
  category: "lecture_hall" | "silent_study" | "group_study" | "pc_pool";
  seats: number;
  hasOutlets: boolean;
  hasWifi: boolean;
  status: "free" | "busy" | "open_study";
  freeUntil?: string;
  busyWith?: string;
  busyUntil?: string;
  mapsUrl: string;
  directions: string;
  schedule: { time: string; event: string; isLecture: boolean }[];
}

const ROOMS_DATA: CampusRoomItem[] = [
  {
    id: "fh_hs1",
    code: "HS 1",
    name: "Hörsaal 1 (Freihaus)",
    building: "freihaus",
    buildingName: "Freihaus, Wiedner Hauptstr. 8-10",
    floor: "Turm Gelb, Erdgeschoß (EG)",
    category: "lecture_hall",
    seats: 380,
    hasOutlets: true,
    hasWifi: true,
    status: "free",
    freeUntil: "14:15 Uhr",
    mapsUrl: "https://maps.tuwien.ac.at/?q=HS+1",
    directions: "Haupteingang Wiedner Hauptstraße, links am Portier vorbei in den gelben Bereich.",
    schedule: [
      { time: "08:00 - 10:00", event: "VO Mathematik 1 (ET)", isLecture: true },
      { time: "10:00 - 14:15", event: "Frei für Selbststudium", isLecture: false },
      { time: "14:15 - 16:00", event: "VO Lineare Algebra", isLecture: true },
      { time: "16:00 - 20:00", event: "Frei für Selbststudium", isLecture: false },
    ],
  },
  {
    id: "fh_hs2",
    code: "HS 2",
    name: "Hörsaal 2 (Freihaus)",
    building: "freihaus",
    buildingName: "Freihaus, Wiedner Hauptstr. 8-10",
    floor: "Turm Gelb, 1. Stock (1. OG)",
    category: "lecture_hall",
    seats: 190,
    hasOutlets: true,
    hasWifi: true,
    status: "busy",
    busyWith: "VU Algorithmen und Datenstrukturen",
    busyUntil: "13:45 Uhr",
    mapsUrl: "https://maps.tuwien.ac.at/?q=HS+2",
    directions: "Stiege 2 im gelben Turm, 1. Stock direkt gegenüber dem Lift.",
    schedule: [
      { time: "09:00 - 11:30", event: "Frei für Selbststudium", isLecture: false },
      { time: "11:30 - 13:45", event: "VU Algorithmen und Datenstrukturen", isLecture: true },
      { time: "13:45 - 17:00", event: "Frei für Selbststudium", isLecture: false },
    ],
  },
  {
    id: "fh_lern_bib",
    code: "Lernraum Bib",
    name: "Bibliothek Lernsaal & Silent Zone",
    building: "freihaus",
    buildingName: "Freihaus, Wiedner Hauptstr. 8-10",
    floor: "Universitätsbibliothek, 1.–4. OG",
    category: "silent_study",
    seats: 420,
    hasOutlets: true,
    hasWifi: true,
    status: "open_study",
    mapsUrl: "https://maps.tuwien.ac.at/?q=Bibliothek",
    directions: "Universitätsbibliothek TU Wien am Platz vor dem Freihaus (Eule am Gebäude).",
    schedule: [
      { time: "08:30 - 21:00", event: "Durchgehend geöffnet für Studierende", isLecture: false },
    ],
  },
  {
    id: "hg_audimax",
    code: "Audimax",
    name: "Auditorium Maximum (Karlsplatz)",
    building: "hauptgebaeude",
    buildingName: "Hauptgebäude, Karlsplatz 13",
    floor: "Stiege 1, Erdgeschoß",
    category: "lecture_hall",
    seats: 600,
    hasOutlets: true,
    hasWifi: true,
    status: "busy",
    busyWith: "VO Analysis 1 für Informatik",
    busyUntil: "14:00 Uhr",
    mapsUrl: "https://maps.tuwien.ac.at/?q=Audimax",
    directions: "Karlsplatz Haupteingang, nach der Säulenhalle links die Rampe hinab.",
    schedule: [
      { time: "10:00 - 12:00", event: "Frei für Selbststudium", isLecture: false },
      { time: "12:00 - 14:00", event: "VO Analysis 1 für Informatik", isLecture: true },
      { time: "14:00 - 16:30", event: "Frei für Selbststudium", isLecture: false },
    ],
  },
  {
    id: "hg_boeckl",
    code: "Boecklsaal",
    name: "Boecklsaal (Historisches Hauptgebäude)",
    building: "hauptgebaeude",
    buildingName: "Hauptgebäude, Karlsplatz 13",
    floor: "Stiege 1, 1. Stock",
    category: "group_study",
    seats: 65,
    hasOutlets: true,
    hasWifi: true,
    status: "open_study",
    mapsUrl: "https://maps.tuwien.ac.at/?q=Boecklsaal",
    directions: "Prunkstiege 1 in den ersten Stock, direkt neben dem Rektorat.",
    schedule: [
      { time: "08:00 - 19:00", event: "Offene Gruppenarbeitszone & Tische", isLecture: false },
    ],
  },
  {
    id: "ei_7",
    code: "EI 7",
    name: "Elektrotechnik Hörsaal 7",
    building: "gusshaus",
    buildingName: "Campus Gußhaus, Gußhausstr. 25-29",
    floor: "Altes EI-Gebäude, Erdgeschoß",
    category: "lecture_hall",
    seats: 250,
    hasOutlets: true,
    hasWifi: true,
    status: "free",
    freeUntil: "15:30 Uhr",
    mapsUrl: "https://maps.tuwien.ac.at/?q=EI+7",
    directions: "Gußhausstraße 27, durch den Innenhof rechts zum Hörsaaltrakt.",
    schedule: [
      { time: "08:00 - 11:00", event: "VO Grundlagen der Elektrotechnik", isLecture: true },
      { time: "11:00 - 15:30", event: "Frei für Selbststudium", isLecture: false },
      { time: "15:30 - 17:00", event: "UE Schaltungstechnik", isLecture: true },
    ],
  },
  {
    id: "ei_stud",
    code: "EI Lernzone",
    name: "Gußhaus Lernraum & Projekttische",
    building: "gusshaus",
    buildingName: "Campus Gußhaus, Gußhausstr. 27",
    floor: "Neues EI-Gebäude, 2. Stock",
    category: "group_study",
    seats: 80,
    hasOutlets: true,
    hasWifi: true,
    status: "open_study",
    mapsUrl: "https://maps.tuwien.ac.at/?q=EI+Gu%C3%9Fhaus",
    directions: "Foyer Neues EI, Lift in den 2. Stock, Lernbereich mit Whiteboards.",
    schedule: [
      { time: "08:00 - 20:00", event: "Gruppenarbeit & Laptoparbeitsplätze", isLecture: false },
    ],
  },
  {
    id: "gm_1",
    code: "GM 1",
    name: "Maschinenbau Hörsaal GM 1 (Radinger)",
    building: "getreidemarkt",
    buildingName: "Campus Getreidemarkt, Getreidemarkt 9",
    floor: "Lehartrakt, Erdgeschoß",
    category: "lecture_hall",
    seats: 310,
    hasOutlets: true,
    hasWifi: true,
    status: "free",
    freeUntil: "16:00 Uhr",
    mapsUrl: "https://maps.tuwien.ac.at/?q=GM+1",
    directions: "Getreidemarkt Eingang Lehartrakt, geradeaus durch die Glastür.",
    schedule: [
      { time: "08:30 - 10:30", event: "VO Mechanik 1", isLecture: true },
      { time: "10:30 - 16:00", event: "Frei für Selbststudium", isLecture: false },
    ],
  },
  {
    id: "gm_pc",
    code: "PC Pool GM",
    name: "Informatik & Chemie PC-Pool",
    building: "getreidemarkt",
    buildingName: "Campus Getreidemarkt, Getreidemarkt 9",
    floor: "Plus-Energie-Hochhaus, 1. UG",
    category: "pc_pool",
    seats: 40,
    hasOutlets: true,
    hasWifi: true,
    status: "open_study",
    mapsUrl: "https://maps.tuwien.ac.at/?q=Getreidemarkt",
    directions: "Hochhaus Foyer, Treppe nach unten in das 1. Untergeschoß.",
    schedule: [
      { time: "07:30 - 21:00", event: "Freie TU-Workstations (Linux & Windows)", isLecture: false },
    ],
  },
];

export const App: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [onlyFree, setOnlyFree] = useState(false);
  const [activeModalRoom, setActiveModalRoom] = useState<CampusRoomItem | null>(null);

  const filteredRooms = useMemo(() => {
    return ROOMS_DATA.filter((r) => {
      if (selectedBuilding !== "all" && r.building !== selectedBuilding) return false;
      if (selectedCategory !== "all" && r.category !== selectedCategory) return false;
      if (onlyFree && r.status === "busy") return false;

      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchCode = r.code.toLowerCase().includes(q);
        const matchName = r.name.toLowerCase().includes(q);
        const matchBuilding = r.buildingName.toLowerCase().includes(q);
        const matchFloor = r.floor.toLowerCase().includes(q);
        if (!matchCode && !matchName && !matchBuilding && !matchFloor) return false;
      }

      return true;
    });
  }, [search, selectedBuilding, selectedCategory, onlyFree]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[var(--tu-bg-canvas)] text-[var(--tu-text-primary)] font-sans overflow-hidden">
      {/* Top Header */}
      <header className="h-14 border-b border-[var(--tu-border)] bg-[var(--tu-bg-surface)] px-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--tu-accent)] flex items-center justify-center text-white shadow-md">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight">TU Room & Study Radar</h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Live WS 2026
              </span>
            </div>
            <p className="text-[11px] text-[var(--tu-text-muted)]">
              Freie Hörsäle, Lernzonen & Campus-Orientierung
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative w-64 sm:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[var(--tu-text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Raum suchen (z.B. EI 7, HS 1, Audimax)..."
              className="w-full bg-[var(--tu-bg-card)] border border-[var(--tu-border)] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[var(--tu-text-primary)] placeholder-[var(--tu-text-muted)] focus:outline-none focus:border-[var(--tu-accent)]"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-[var(--tu-text-secondary)] hover:text-[var(--tu-text-primary)] cursor-pointer select-none bg-[var(--tu-bg-card)] px-3 py-1.5 rounded-lg border border-[var(--tu-border)]">
            <input
              type="checkbox"
              checked={onlyFree}
              onChange={(e) => setOnlyFree(e.target.checked)}
              className="rounded accent-[var(--tu-accent)]"
            />
            <span className="font-medium">Nur freie Räume</span>
          </label>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Campus Locations */}
        <aside className="w-64 border-r border-[var(--tu-border)] bg-[var(--tu-bg-surface)] p-4 flex flex-col gap-1 shrink-0 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--tu-text-muted)] mb-2 px-2">
            Campus Standorte
          </div>

          {[
            { id: "all", name: "Alle Standorte", count: ROOMS_DATA.length },
            { id: "freihaus", name: "Freihaus (FH)", desc: "Wiedner Hauptstraße 8-10", count: 3 },
            { id: "hauptgebaeude", name: "Hauptgebäude (HG)", desc: "Karlsplatz 13", count: 2 },
            { id: "gusshaus", name: "Campus Gußhaus", desc: "Gußhausstraße 25-29", count: 2 },
            { id: "getreidemarkt", name: "Getreidemarkt", desc: "Lehartrakt & Hochhaus", count: 2 },
          ].map((loc) => (
            <button
              key={loc.id}
              onClick={() => setSelectedBuilding(loc.id)}
              className={`flex flex-col text-left px-3 py-2.5 rounded-lg transition-all cursor-pointer border ${
                selectedBuilding === loc.id
                  ? "bg-[var(--tu-accent)]/15 border-[var(--tu-accent)] text-[var(--tu-text-primary)] shadow-xs"
                  : "bg-transparent border-transparent hover:bg-[var(--tu-bg-card)] text-[var(--tu-text-secondary)]"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>{loc.name}</span>
                <span className="text-[10px] opacity-70 bg-[var(--tu-bg-elevated)] px-1.5 py-0.2 rounded font-mono">
                  {loc.count}
                </span>
              </div>
              {loc.desc && <div className="text-[10px] text-[var(--tu-text-muted)] truncate mt-0.5">{loc.desc}</div>}
            </button>
          ))}
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 flex flex-col p-5 overflow-hidden">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--tu-border)] overflow-x-auto">
            <span className="text-xs text-[var(--tu-text-muted)] flex items-center gap-1 shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {[
              { id: "all", label: "Alle Raumtypen" },
              { id: "lecture_hall", label: "🎓 Hörsäle" },
              { id: "silent_study", label: "🤫 Ruhige Lernzonen" },
              { id: "group_study", label: "👥 Gruppenräume" },
              { id: "pc_pool", label: "💻 PC-Pools" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer shrink-0 border ${
                  selectedCategory === tab.id
                    ? "bg-[var(--tu-accent)] text-white border-[var(--tu-accent)] shadow-xs"
                    : "bg-[var(--tu-bg-card)] text-[var(--tu-text-secondary)] border-[var(--tu-border)] hover:text-[var(--tu-text-primary)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Rooms Grid */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-1">
            {filteredRooms.map((room) => {
              const isFree = room.status === "free" || room.status === "open_study";
              return (
                <div
                  key={room.id}
                  className="bg-[var(--tu-bg-surface)] border border-[var(--tu-border)] rounded-xl p-4 flex flex-col justify-between hover:border-[var(--tu-accent)]/50 transition-all shadow-sm group"
                >
                  <div>
                    {/* Top Header Badge */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[var(--tu-bg-elevated)] border border-[var(--tu-border)] text-[var(--tu-accent-contrast)]">
                        {room.code}
                      </span>

                      {room.status === "free" && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Frei bis {room.freeUntil}
                        </span>
                      )}

                      {room.status === "open_study" && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Dauerhafte Lernzone
                        </span>
                      )}

                      {room.status === "busy" && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                          <AlertCircle className="w-3 h-3" /> Belegt bis {room.busyUntil}
                        </span>
                      )}
                    </div>

                    {/* Room Title & Location */}
                    <h2 className="text-sm font-bold tracking-tight text-[var(--tu-text-primary)] group-hover:text-[var(--tu-accent)] transition-colors">
                      {room.name}
                    </h2>
                    <p className="text-[11px] text-[var(--tu-text-muted)] mt-0.5">{room.buildingName}</p>
                    <p className="text-[11px] text-[var(--tu-text-secondary)] font-medium mt-1">📍 {room.floor}</p>

                    {room.status === "busy" && room.busyWith && (
                      <div className="mt-2 text-[11px] bg-[var(--tu-bg-card)] border border-amber-500/20 rounded p-1.5 text-amber-300 truncate">
                        <strong>Vorlesung:</strong> {room.busyWith}
                      </div>
                    )}
                  </div>

                  {/* Footer: Amenities & Actions */}
                  <div className="mt-4 pt-3 border-t border-[var(--tu-border)] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] text-[var(--tu-text-muted)]">
                      <span className="flex items-center gap-0.5" title="Sitzplätze">
                        <Users className="w-3 h-3" /> {room.seats}
                      </span>
                      {room.hasOutlets && (
                        <span className="flex items-center gap-0.5 text-amber-400" title="Steckdosen vorhanden">
                          <Zap className="w-3 h-3" />
                        </span>
                      )}
                      {room.hasWifi && (
                        <span className="flex items-center gap-0.5 text-sky-400" title="eduroam High-Speed WiFi">
                          <Wifi className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setActiveModalRoom(room)}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-[var(--tu-bg-elevated)] border border-[var(--tu-border)] hover:bg-[var(--tu-accent)] hover:text-white transition-all cursor-pointer"
                      >
                        Zeitplan
                      </button>
                      <a
                        href={room.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 rounded-md text-[var(--tu-text-muted)] hover:text-[var(--tu-accent)] transition-colors cursor-pointer"
                        title="Auf TU Maps anzeigen"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Hourly Schedule & Direction Modal */}
      {activeModalRoom && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setActiveModalRoom(null)}
        >
          <div
            className="bg-[var(--tu-bg-surface)] border border-[var(--tu-border)] rounded-2xl w-full max-w-lg p-6 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-[var(--tu-accent)]">
                  {activeModalRoom.code}
                </span>
                <h3 className="text-base font-bold text-[var(--tu-text-primary)]">
                  {activeModalRoom.name}
                </h3>
                <p className="text-xs text-[var(--tu-text-muted)]">{activeModalRoom.buildingName}</p>
              </div>
              <button
                onClick={() => setActiveModalRoom(null)}
                className="text-[var(--tu-text-muted)] hover:text-[var(--tu-text-primary)] text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Directions Box */}
            <div className="mb-4 bg-[var(--tu-bg-card)] border border-[var(--tu-border)] rounded-lg p-3 text-xs">
              <strong className="text-[var(--tu-text-primary)] flex items-center gap-1 mb-1">
                <Info className="w-3.5 h-3.5 text-[var(--tu-accent)]" /> Wegbeschreibung & Etage:
              </strong>
              <p className="text-[var(--tu-text-secondary)]">{activeModalRoom.floor}</p>
              <p className="text-[var(--tu-text-secondary)] mt-0.5">{activeModalRoom.directions}</p>
            </div>

            {/* Schedule Timeline */}
            <div className="mb-4">
              <div className="text-xs font-bold text-[var(--tu-text-primary)] mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Tagesbelegung (Heute):
              </div>
              <div className="space-y-1.5">
                {activeModalRoom.schedule.map((slot, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between text-xs px-3 py-2 rounded-lg border ${
                      slot.isLecture
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
                        : "bg-emerald-500/10 border-emerald-500/20 text-emerald-300 font-medium"
                    }`}
                  >
                    <span className="font-mono text-[11px]">{slot.time}</span>
                    <span>{slot.event}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--tu-border)]">
              <a
                href={activeModalRoom.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-[var(--tu-accent)] text-white font-semibold cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5" /> Auf TU Maps ansehen
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
