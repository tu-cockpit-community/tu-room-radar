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
  // --- FREIHAUS ---
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
    mapsUrl: "https://maps.tuwien.ac.at/?q=HS+2",
    directions: "Stiege 2 im gelben Turm, 1. Stock direkt gegenüber dem Lift.",
    schedule: [
      { time: "09:00 - 11:30", event: "Frei für Selbststudium", isLecture: false },
      { time: "11:30 - 13:45", event: "VU Algorithmen und Datenstrukturen", isLecture: true },
      { time: "13:45 - 17:00", event: "Frei für Selbststudium", isLecture: false },
    ],
  },
  {
    id: "fh_hs3",
    code: "HS 3",
    name: "Hörsaal 3 (Freihaus)",
    building: "freihaus",
    buildingName: "Freihaus, Wiedner Hauptstr. 8-10",
    floor: "Turm Gelb, 2. Stock (2. OG)",
    category: "lecture_hall",
    seats: 140,
    hasOutlets: true,
    hasWifi: true,
    status: "free",
    mapsUrl: "https://maps.tuwien.ac.at/?q=HS+3",
    directions: "Stiege 2 im gelben Turm, 2. Stock.",
    schedule: [
      { time: "08:15 - 10:00", event: "VO Theoretische Informatik", isLecture: true },
      { time: "10:00 - 15:00", event: "Frei für Selbststudium", isLecture: false },
    ],
  },
  {
    id: "fh_hs4",
    code: "HS 4",
    name: "Hörsaal 4 (Freihaus)",
    building: "freihaus",
    buildingName: "Freihaus, Wiedner Hauptstr. 8-10",
    floor: "Turm Grün, Erdgeschoß (EG)",
    category: "lecture_hall",
    seats: 220,
    hasOutlets: true,
    hasWifi: true,
    status: "free",
    mapsUrl: "https://maps.tuwien.ac.at/?q=HS+4",
    directions: "Eingang Freihaus Innenhof, grüner Turm Erdgeschoß.",
    schedule: [
      { time: "10:00 - 12:00", event: "VO Technische Physik 1", isLecture: true },
      { time: "12:00 - 17:00", event: "Frei für Selbststudium", isLecture: false },
    ],
  },
  {
    id: "fh_hs5",
    code: "HS 5",
    name: "Hörsaal 5 (Freihaus)",
    building: "freihaus",
    buildingName: "Freihaus, Wiedner Hauptstr. 8-10",
    floor: "Turm Grün, 1. Stock (1. OG)",
    category: "lecture_hall",
    seats: 180,
    hasOutlets: true,
    hasWifi: true,
    status: "free",
    mapsUrl: "https://maps.tuwien.ac.at/?q=HS+5",
    directions: "Stiege 5 im grünen Turm, 1. Stock.",
    schedule: [
      { time: "09:00 - 13:00", event: "Frei für Selbststudium", isLecture: false },
      { time: "13:00 - 15:00", event: "VU Datenbanksysteme", isLecture: true },
    ],
  },
  {
    id: "fh_hs6",
    code: "HS 6",
    name: "Hörsaal 6 (Freihaus)",
    building: "freihaus",
    buildingName: "Freihaus, Wiedner Hauptstr. 8-10",
    floor: "Turm Grün, 2. Stock (2. OG)",
    category: "lecture_hall",
    seats: 120,
    hasOutlets: true,
    hasWifi: true,
    status: "free",
    mapsUrl: "https://maps.tuwien.ac.at/?q=HS+6",
    directions: "Stiege 5 im grünen Turm, 2. Stock.",
    schedule: [
      { time: "08:00 - 18:00", event: "Frei für Selbststudium", isLecture: false },
    ],
  },
  {
    id: "fh_hs7",
    code: "HS 7",
    name: "Hörsaal 7 (Freihaus)",
    building: "freihaus",
    buildingName: "Freihaus, Wiedner Hauptstr. 8-10",
    floor: "Turm Rot, 1. Stock (1. OG)",
    category: "lecture_hall",
    seats: 150,
    hasOutlets: true,
    hasWifi: true,
    status: "free",
    mapsUrl: "https://maps.tuwien.ac.at/?q=HS+7",
    directions: "Stiege 7 im roten Turm, 1. Stock.",
    schedule: [
      { time: "08:30 - 11:00", event: "Frei für Selbststudium", isLecture: false },
      { time: "11:00 - 13:00", event: "VO Wahrscheinlichkeitstheorie", isLecture: true },
      { time: "13:00 - 18:00", event: "Frei für Selbststudium", isLecture: false },
    ],
  },
  {
    id: "fh_hs8",
    code: "HS 8",
    name: "Hörsaal 8 (Freihaus)",
    building: "freihaus",
    buildingName: "Freihaus, Wiedner Hauptstr. 8-10",
    floor: "Turm Rot, 2. Stock (2. OG)",
    category: "lecture_hall",
    seats: 140,
    hasOutlets: true,
    hasWifi: true,
    status: "free",
    mapsUrl: "https://maps.tuwien.ac.at/?q=HS+8",
    directions: "Stiege 7 im roten Turm, 2. Stock.",
    schedule: [
      { time: "09:00 - 17:00", event: "Frei für Selbststudium", isLecture: false },
    ],
  },
  {
    id: "fh_lern_bib",
    code: "TU Bibliothek",
    name: "TU Wien Hauptbibliothek (Resselgasse)",
    building: "freihaus",
    buildingName: "Universitätsbibliothek, Resselgasse 4",
    floor: "Ebenen 1–5 (Silent Cubicles & Gruppenräume)",
    category: "silent_study",
    seats: 480,
    hasOutlets: true,
    hasWifi: true,
    status: "open_study",
    mapsUrl: "https://maps.tuwien.ac.at/?q=Bibliothek",
    directions: "Hauptbibliothek vor dem Freihaus (Große Eule am Eingang).",
    schedule: [
      { time: "08:30 - 21:00", event: "Offene Lernbereiche & Silent Study", isLecture: false },
    ],
  },
  {
    id: "treitl_info_hs",
    code: "Info HS",
    name: "Informatikhörsaal (Treitlstraße)",
    building: "freihaus",
    buildingName: "Informatikgebäude, Treitlstr. 3",
    floor: "Erdgeschoß (EG)",
    category: "lecture_hall",
    seats: 320,
    hasOutlets: true,
    hasWifi: true,
    status: "free",
    mapsUrl: "https://maps.tuwien.ac.at/?q=Informatikh%C3%B6rsaal",
    directions: "Treitlstraße 3, Haupteingang Erdgeschoß direkt gegenüber dem Portier.",
    schedule: [
      { time: "08:15 - 10:00", event: "VU Einführung in die Programmierung 1", isLecture: true },
      { time: "10:00 - 13:00", event: "Frei für Selbststudium", isLecture: false },
      { time: "13:00 - 15:00", event: "VU Algorithmen und Datenstrukturen", isLecture: true },
      { time: "15:00 - 19:00", event: "Frei für Selbststudium", isLecture: false },
    ],
  },

  // --- KARLSPLATZ (HAUPTGEBÄUDE) ---
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
    id: "hg_kuppelsaal",
    code: "Kuppelsaal",
    name: "Kuppelsaal (Karlsplatz Hauptgebäude)",
    building: "hauptgebaeude",
    buildingName: "Hauptgebäude, Karlsplatz 13",
    floor: "Stiege 1, 4. Stock (Dachgeschoß)",
    category: "lecture_hall",
    seats: 220,
    hasOutlets: true,
    hasWifi: true,
    status: "free",
    mapsUrl: "https://maps.tuwien.ac.at/?q=Kuppelsaal",
    directions: "Prunkstiege 1 bis in den 4. Stock unter die historische Kuppel.",
    schedule: [
      { time: "08:00 - 12:00", event: "Frei für Selbststudium", isLecture: false },
      { time: "12:00 - 15:00", event: "Architektur Diplomprüfungen & Vorlesung", isLecture: true },
      { time: "15:00 - 20:00", event: "Frei für Selbststudium", isLecture: false },
    ],
  },
  {
    id: "hg_hs11",
    code: "HS 11",
    name: "Hörsaal 11 (Karlsplatz)",
    building: "hauptgebaeude",
    buildingName: "Hauptgebäude, Karlsplatz 13",
    floor: "Stiege 3, 2. Stock",
    category: "lecture_hall",
    seats: 120,
    hasOutlets: true,
    hasWifi: true,
    status: "free",
    mapsUrl: "https://maps.tuwien.ac.at/?q=HS+11",
    directions: "Stiege 3 im Haupttrakt, 2. Stock.",
    schedule: [
      { time: "09:00 - 12:00", event: "Frei für Selbststudium", isLecture: false },
      { time: "12:00 - 14:00", event: "VO Baugeschichte", isLecture: true },
      { time: "14:00 - 19:00", event: "Frei für Selbststudium", isLecture: false },
    ],
  },
  {
    id: "hg_hs14",
    code: "HS 14",
    name: "Hörsaal 14 (Günther Feuerstein)",
    building: "hauptgebaeude",
    buildingName: "Hauptgebäude, Karlsplatz 13",
    floor: "Stiege 6, 3. Stock",
    category: "lecture_hall",
    seats: 150,
    hasOutlets: true,
    hasWifi: true,
    status: "free",
    mapsUrl: "https://maps.tuwien.ac.at/?q=HS+14",
    directions: "Stiege 6 im Hoftrakt, 3. Stock.",
    schedule: [
      { time: "08:30 - 14:00", event: "Frei für Selbststudium", isLecture: false },
      { time: "14:00 - 16:00", event: "VO Tragwerkslehre", isLecture: true },
    ],
  },
  {
    id: "hg_hs17",
    code: "HS 17",
    name: "Hörsaal 17 (Karlsplatz)",
    building: "hauptgebaeude",
    buildingName: "Hauptgebäude, Karlsplatz 13",
    floor: "Stiege 7, 2. Stock",
    category: "lecture_hall",
    seats: 95,
    hasOutlets: true,
    hasWifi: true,
    status: "free",
    mapsUrl: "https://maps.tuwien.ac.at/?q=HS+17",
    directions: "Stiege 7 im Hoftrakt, 2. Stock.",
    schedule: [
      { time: "08:00 - 18:00", event: "Frei für Selbststudium", isLecture: false },
    ],
  },
  {
    id: "hg_hs18",
    code: "HS 18",
    name: "Hörsaal 18 (Karlsplatz)",
    building: "hauptgebaeude",
    buildingName: "Hauptgebäude, Karlsplatz 13",
    floor: "Stiege 7, 3. Stock",
    category: "lecture_hall",
    seats: 90,
    hasOutlets: true,
    hasWifi: true,
    status: "free",
    mapsUrl: "https://maps.tuwien.ac.at/?q=HS+18",
    directions: "Stiege 7 im Hoftrakt, 3. Stock.",
    schedule: [
      { time: "09:00 - 11:00", event: "VO Stadtplanung", isLecture: true },
      { time: "11:00 - 18:00", event: "Frei für Selbststudium", isLecture: false },
    ],
  },

  // --- GUßHAUS ---
  {
    id: "ei_1",
    code: "EI 1",
    name: "Hörsaal EI 1 (Altes EI)",
    building: "gusshaus",
    buildingName: "Campus Gußhaus, Gußhausstr. 25-29",
    floor: "Altes EI-Gebäude, Erdgeschoß",
    category: "lecture_hall",
    seats: 120,
    hasOutlets: true,
    hasWifi: true,
    status: "free",
    mapsUrl: "https://maps.tuwien.ac.at/?q=EI+1",
    directions: "Gußhausstraße 25, Erdgeschoß rechts.",
    schedule: [
      { time: "08:00 - 14:00", event: "Frei für Selbststudium", isLecture: false },
    ],
  },
  {
    id: "ei_2",
    code: "EI 2",
    name: "Hörsaal EI 2 (Altes EI)",
    building: "gusshaus",
    buildingName: "Campus Gußhaus, Gußhausstr. 25-29",
    floor: "Altes EI-Gebäude, 1. Stock",
    category: "lecture_hall",
    seats: 110,
    hasOutlets: true,
    hasWifi: true,
    status: "free",
    mapsUrl: "https://maps.tuwien.ac.at/?q=EI+2",
    directions: "Gußhausstraße 25, 1. Stock.",
    schedule: [
      { time: "10:00 - 12:00", event: "VO Signaltheorie", isLecture: true },
      { time: "12:00 - 18:00", event: "Frei für Selbststudium", isLecture: false },
    ],
  },
  {
    id: "ei_3",
    code: "EI 3",
    name: "Hörsaal EI 3 (Sahulka)",
    building: "gusshaus",
    buildingName: "Campus Gußhaus, Gußhausstr. 25-29",
    floor: "Altes EI-Gebäude, 1. Stock",
    category: "lecture_hall",
    seats: 150,
    hasOutlets: true,
    hasWifi: true,
    status: "free",
    mapsUrl: "https://maps.tuwien.ac.at/?q=EI+3",
    directions: "Gußhausstraße 25, 1. Stock Trakt B.",
    schedule: [
      { time: "08:30 - 13:00", event: "Frei für Selbststudium", isLecture: false },
      { time: "13:00 - 15:00", event: "VO Mikroelektronik", isLecture: true },
    ],
  },
  {
    id: "ei_7",
    code: "EI 7",
    name: "Elektrotechnik Hörsaal EI 7",
    building: "gusshaus",
    buildingName: "Campus Gußhaus, Gußhausstr. 25-29",
    floor: "Altes EI-Gebäude, Erdgeschoß",
    category: "lecture_hall",
    seats: 250,
    hasOutlets: true,
    hasWifi: true,
    status: "free",
    mapsUrl: "https://maps.tuwien.ac.at/?q=EI+7",
    directions: "Gußhausstraße 27, durch den Innenhof rechts zum Hörsaaltrakt.",
    schedule: [
      { time: "08:00 - 11:00", event: "VO Grundlagen der Elektrotechnik", isLecture: true },
      { time: "11:00 - 15:30", event: "Frei für Selbststudium", isLecture: false },
      { time: "15:30 - 17:00", event: "UE Schaltungstechnik", isLecture: true },
    ],
  },
  {
    id: "ei_9",
    code: "EI 9",
    name: "Hörsaal EI 9 (Hochenegg)",
    building: "gusshaus",
    buildingName: "Campus Gußhaus, Gußhausstr. 25-29",
    floor: "Altes EI-Gebäude, Erdgeschoß",
    category: "lecture_hall",
    seats: 180,
    hasOutlets: true,
    hasWifi: true,
    status: "free",
    mapsUrl: "https://maps.tuwien.ac.at/?q=EI+9",
    directions: "Gußhausstraße 27, Erdgeschoß Trakt C.",
    schedule: [
      { time: "09:00 - 11:00", event: "VO Schaltungstechnik", isLecture: true },
      { time: "11:00 - 15:00", event: "Frei für Selbststudium", isLecture: false },
      { time: "15:00 - 17:00", event: "VU Datenbanksysteme", isLecture: true },
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

  // --- GETREIDEMARKT ---
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
    mapsUrl: "https://maps.tuwien.ac.at/?q=GM+1",
    directions: "Getreidemarkt Eingang Lehartrakt, geradeaus durch die Glastür.",
    schedule: [
      { time: "08:30 - 10:30", event: "VO Mechanik 1", isLecture: true },
      { time: "10:30 - 16:00", event: "Frei für Selbststudium", isLecture: false },
    ],
  },
  {
    id: "gm_2",
    code: "GM 2",
    name: "Hörsaal GM 2 (Ernst Melan)",
    building: "getreidemarkt",
    buildingName: "Campus Getreidemarkt, Getreidemarkt 9",
    floor: "Lehartrakt, 2. Stock",
    category: "lecture_hall",
    seats: 180,
    hasOutlets: true,
    hasWifi: true,
    status: "free",
    mapsUrl: "https://maps.tuwien.ac.at/?q=GM+2",
    directions: "Lehartrakt Stiege 2 in den 2. Stock.",
    schedule: [
      { time: "09:00 - 14:00", event: "Frei für Selbststudium", isLecture: false },
      { time: "14:00 - 16:00", event: "VO Strömungslehre", isLecture: true },
    ],
  },
  {
    id: "gm_3",
    code: "GM 3",
    name: "Hörsaal GM 3 (Vortragssaal)",
    building: "getreidemarkt",
    buildingName: "Campus Getreidemarkt, Getreidemarkt 9",
    floor: "Maschinenbautrakt, Erdgeschoß",
    category: "lecture_hall",
    seats: 140,
    hasOutlets: true,
    hasWifi: true,
    status: "free",
    mapsUrl: "https://maps.tuwien.ac.at/?q=GM+3",
    directions: "Maschinenbau Foyer Erdgeschoß.",
    schedule: [
      { time: "08:00 - 18:00", event: "Frei für Selbststudium", isLecture: false },
    ],
  },
  {
    id: "gm_4",
    code: "GM 4",
    name: "Hörsaal GM 4 (Reutlinger)",
    building: "getreidemarkt",
    buildingName: "Campus Getreidemarkt, Getreidemarkt 9",
    floor: "Chemietrakt, 1. Stock",
    category: "lecture_hall",
    seats: 120,
    hasOutlets: true,
    hasWifi: true,
    status: "free",
    mapsUrl: "https://maps.tuwien.ac.at/?q=GM+4",
    directions: "Chemietrakt Stiege 1, 1. Stock.",
    schedule: [
      { time: "11:00 - 13:00", event: "VO Allgemeine Chemie", isLecture: true },
      { time: "13:00 - 17:00", event: "Frei für Selbststudium", isLecture: false },
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

function parseMinutes(timeStr: string): number {
  const [h, m] = timeStr.trim().split(":").map(Number);
  return h * 60 + m;
}

function calculateCurrentRoomStatus(room: CampusRoomItem): {
  status: "free" | "busy" | "open_study";
  freeUntil?: string;
  busyWith?: string;
  busyUntil?: string;
} {
  const now = new Date();
  const day = now.getDay();
  const curMins = now.getHours() * 60 + now.getMinutes();

  if (room.category === "silent_study" || room.category === "group_study" || room.category === "pc_pool") {
    if (day === 0) {
      return { status: "busy", busyWith: "Am Sonntag geschlossen", busyUntil: "Mo 08:30 Uhr" };
    }
    if (day === 6) {
      if (curMins >= 10 * 60 && curMins < 17 * 60) {
        return { status: "open_study", freeUntil: "17:00 Uhr" };
      }
      return { status: "busy", busyWith: "Samstag ab 17:00 geschlossen", busyUntil: "Mo 08:30 Uhr" };
    }
    if (curMins >= 8 * 60 + 30 && curMins < 21 * 60) {
      return { status: "open_study", freeUntil: "21:00 Uhr" };
    }
    return { status: "busy", busyWith: "Außerhalb der Öffnungszeiten", busyUntil: "08:30 Uhr" };
  }

  // Lecture hall
  if (day === 0 || day === 6) {
    return { status: "busy", busyWith: "Wochenende (Hörsaal geschlossen)", busyUntil: "Montag 08:00 Uhr" };
  }

  // Check schedule slots
  for (let i = 0; i < room.schedule.length; i++) {
    const slot = room.schedule[i];
    const [startStr, endStr] = slot.time.split("-").map((s) => s.trim());
    const startM = parseMinutes(startStr);
    const endM = parseMinutes(endStr);

    if (curMins >= startM && curMins < endM) {
      if (slot.isLecture) {
        return {
          status: "busy",
          busyWith: slot.event,
          busyUntil: `${endStr} Uhr`,
        };
      } else {
        return {
          status: "free",
          freeUntil: `${endStr} Uhr`,
        };
      }
    }
  }

  if (curMins >= 20 * 60 || curMins < 8 * 60) {
    return {
      status: "busy",
      busyWith: "Nachtruhe (Gebäude geschlossen)",
      busyUntil: "08:00 Uhr",
    };
  }

  return {
    status: "free",
    freeUntil: "20:00 Uhr",
  };
}

export const App: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [onlyFree, setOnlyFree] = useState(false);
  const [activeModalRoom, setActiveModalRoom] = useState<CampusRoomItem | null>(null);

  const liveRooms = useMemo(() => {
    return ROOMS_DATA.map((r) => {
      const dynamicStatus = calculateCurrentRoomStatus(r);
      return {
        ...r,
        status: dynamicStatus.status,
        freeUntil: dynamicStatus.freeUntil,
        busyWith: dynamicStatus.busyWith,
        busyUntil: dynamicStatus.busyUntil,
      };
    });
  }, []);

  const filteredRooms = useMemo(() => {
    return liveRooms.filter((r) => {
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
  }, [liveRooms, search, selectedBuilding, selectedCategory, onlyFree]);

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
            { id: "all", name: "Alle Standorte", desc: "Campus-Gesamtübersicht" },
            { id: "freihaus", name: "Freihaus & Treitlstr.", desc: "FH HS 1–8 & Info HS" },
            { id: "hauptgebaeude", name: "Hauptgebäude (HG)", desc: "Karlsplatz 13 & Kuppelsaal" },
            { id: "gusshaus", name: "Campus Gußhaus", desc: "EI 1–9 & Lernzone" },
            { id: "getreidemarkt", name: "Getreidemarkt", desc: "Lehartrakt & Hochhaus (GM)" },
          ].map((loc) => {
            const roomCount = loc.id === "all" ? ROOMS_DATA.length : ROOMS_DATA.filter((r) => r.building === loc.id).length;
            return (
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
                  {roomCount}
                </span>
              </div>
              {loc.desc && <div className="text-[10px] text-[var(--tu-text-muted)] truncate mt-0.5">{loc.desc}</div>}
            </button>
          );})}
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
