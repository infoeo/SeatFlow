import { useState, useEffect, useRef, useReducer, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";

const FONT_URL = "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:wght@600;700&display=swap";

// ─── i18n ──────────────────────────────────────────────────────────────────
const T = {
  en: {
    appName:"SeatFlow", createEvent:"Create Event", continueProject:"Continue",
    startPlanning:"Start Planning Free", viewDemo:"View Demo",
    newEvent:"New Event", eventName:"Event Name *", location:"Location",
    date:"Date", guestCount:"Number of Guests * (max 2000)", continueBtn:"Continue →",
    chooseTemplate:"Choose a Template", blankCanvas:"Blank Canvas", back:"← Back",
    guests:"Guests", tables:"Tables", addElement:"Add Element",
    searchGuests:"Search guests…", addGuest:"Add guest…", noGroup:"No group",
    group:"Group", seats:"Seats", autoCreate:"Auto Create", autoArrange:"Auto Arrange",
    export:"Export →", save:"Save", importBtn:"Import",
    assigned:"assigned", unassigned:"unassigned",
    seatSelected:"Seat selected — click a guest to assign",
    allSeated:"All guests seated!", unseatedWarning:"guests unassigned",
    undo:"Undo", redo:"Redo",
    autoCreateTitle:"Auto Create Tables",
    autoCreateDesc:"Creates one table per group sized to fit all guests in that group. Ungrouped guests get tables of 10. Tables are placed in a clean grid — reposition afterwards.",
    autoArrangeTitle:"Auto Arrange Guests",
    autoArrangeDesc:"Seats all guests automatically, keeping group members together at the same table. Existing assignments will be replaced.",
    leaveTitle:"Leave without saving?",
    leaveDesc:"Your progress is auto-saved in the browser, but unsaved changes may be lost if you clear your data.",
    leave:"Leave", stay:"Stay",
    exportTitle:"Export Seating Chart",
    exportDesc:"PDF includes a full summary page with all groups, tables, and seating assignments.",
    unlockExport:"Unlock Export — Watch Ad",
    preparingExport:"Preparing export…",
    readyTitle:"Ready to download!",
    pdfDesc:"Includes floor plan + full summary with every guest's seat.",
    downloading:"Generating…", download:"Download",
    cancel:"Cancel", done:"Done", close:"Close",
    manageGroups:"Manage Groups", newGroup:"New group name…", addGroup:"Add",
    noGuests:"No guests found", noTables:"Add tables above",
    noGroupsYet:"No groups yet.",
    seatCount:"{n} guests · {a} assigned · {u} unassigned",
    pdfCreatedWith:"Created with SeatFlow",
    pdfEventSummary:"Event Summary", pdfEvent:"Event", pdfLocation:"Location",
    pdfDate:"Date", pdfTotalGuests:"Total Guests", pdfSeatsAvail:"Seats Available",
    pdfSeated:"Guests Seated", pdfUnassigned:"Unassigned",
    pdfGroups:"Groups", pdfTables:"Tables & Seating",
    pdfAssignments:"Seating Assignments", pdfSeat:"Seat",
    pdfNoAssigned:"None assigned",
    round:"Round", rectangle:"Rectangle", banquet:"Banquet", cocktail:"Cocktail",
    stage:"Stage", buffet:"Buffet", bar:"Bar", dj:"DJ Booth", dance:"Dance Floor", entrance:"Entrance",
    bgDots:"Dots", bgGrid:"Grid", bgBlank:"Blank",
    background:"Background",
    bulkImport:"Bulk Import", bulkImportPlaceholder:"One guest per line…\nMax Mustermann\nAnna Müller",
    bulkImportBtn:"Import", bulkImportTitle:"Bulk Import Guests",
    bulkImportDesc:"Paste names below — one per line. Each non-empty line becomes a guest.",
    groupWithCount:"Group with guests", groupCountLabel:"Number of guests",
    groupNameLabel:"Group name", createGroupBtn:"Create Group",
    autoCreateMode:"Mode", autoCreateModeGroup:"By Groups", autoCreateModeTable:"By Table Size",
    autoCreateTableCount:"Number of tables", autoCreatePerTable:"Guests per table",
    autoCreateApply:"Create Tables",
    impressum:"Imprint", datenschutz:"Privacy Policy", agb:"Terms of Service",
    cookiePolicy:"Cookie Policy",
    impressumTitle:"Imprint", datenschutzTitle:"Privacy Policy",
    agbTitle:"Terms of Service", cookiePolicyTitle:"Cookie Policy",
    footerRights:"All rights reserved.",
    clearAll:"Clear All", clearTables:"Clear Tables", clearGuests:"Clear Guests",
    clearAllTitle:"Clear everything?", clearTablesTitle:"Clear all tables?", clearGuestsTitle:"Clear all guests?",
    clearAllDesc:"This removes all guests, groups and tables. Cannot be undone.",
    clearTablesDesc:"This removes all tables and seat assignments.",
    clearGuestsDesc:"This removes all guests and seat assignments.",
    undoToast:"Undone", redoToast:"Redone",
    groupByLastName:"Group by last name", groupByLastNameDesc:"Guests with the same last name will be grouped automatically.",
  },
  de: {
    appName:"SeatFlow", createEvent:"Event erstellen", continueProject:"Weiter",
    startPlanning:"Kostenlos planen", viewDemo:"Demo ansehen",
    newEvent:"Neues Event", eventName:"Eventname *", location:"Ort",
    date:"Datum", guestCount:"Anzahl Gäste * (max. 2000)", continueBtn:"Weiter →",
    chooseTemplate:"Vorlage wählen", blankCanvas:"Leere Fläche", back:"← Zurück",
    guests:"Gäste", tables:"Tische", addElement:"Element hinzufügen",
    searchGuests:"Gäste suchen…", addGuest:"Gast hinzufügen…", noGroup:"Keine Gruppe",
    group:"Gruppe", seats:"Plätze", autoCreate:"Auto Erstellen", autoArrange:"Auto Anordnen",
    export:"Exportieren →", save:"Speichern", importBtn:"Importieren",
    assigned:"zugeordnet", unassigned:"nicht zugeordnet",
    seatSelected:"Platz ausgewählt — Gast in der Liste anklicken",
    allSeated:"Alle Gäste platziert!", unseatedWarning:"Gäste nicht zugeordnet",
    undo:"Rückgängig", redo:"Wiederholen",
    autoCreateTitle:"Tische automatisch erstellen",
    autoCreateDesc:"Erstellt pro Gruppe einen Tisch in der passenden Größe. Gäste ohne Gruppe bekommen Tische mit je 10 Plätzen. Tische werden im Raster platziert — danach verschiebbar.",
    autoArrangeTitle:"Gäste automatisch anordnen",
    autoArrangeDesc:"Platziert alle Gäste automatisch und hält Gruppen zusammen. Bestehende Zuordnungen werden ersetzt.",
    leaveTitle:"Seite verlassen?",
    leaveDesc:"Dein Fortschritt wird automatisch gespeichert, aber ungespeicherte Änderungen können verloren gehen.",
    leave:"Verlassen", stay:"Bleiben",
    exportTitle:"Sitzplan exportieren",
    exportDesc:"PDF enthält eine vollständige Zusammenfassung mit allen Gruppen, Tischen und Sitzplätzen.",
    unlockExport:"Export freischalten — Werbung ansehen",
    preparingExport:"Export wird vorbereitet…",
    readyTitle:"Bereit zum Download!",
    pdfDesc:"Enthält den Grundriss + vollständige Übersicht mit jedem Sitzplatz.",
    downloading:"Wird erstellt…", download:"Herunterladen",
    cancel:"Abbrechen", done:"Fertig", close:"Schließen",
    manageGroups:"Gruppen verwalten", newGroup:"Neuer Gruppenname…", addGroup:"Hinzufügen",
    noGuests:"Keine Gäste gefunden", noTables:"Tische oben hinzufügen",
    noGroupsYet:"Noch keine Gruppen.",
    seatCount:"{n} Gäste · {a} zugeordnet · {u} nicht zugeordnet",
    pdfCreatedWith:"Erstellt mit SeatFlow",
    pdfEventSummary:"Event-Zusammenfassung", pdfEvent:"Event", pdfLocation:"Ort",
    pdfDate:"Datum", pdfTotalGuests:"Gäste gesamt", pdfSeatsAvail:"Verfügbare Plätze",
    pdfSeated:"Platzierte Gäste", pdfUnassigned:"Nicht zugeordnet",
    pdfGroups:"Gruppen", pdfTables:"Tische & Sitzplätze",
    pdfAssignments:"Sitzordnung", pdfSeat:"Platz",
    pdfNoAssigned:"Keine Gäste zugeordnet",
    round:"Rund", rectangle:"Rechteck", banquet:"Bankett", cocktail:"Cocktail",
    stage:"Bühne", buffet:"Buffet", bar:"Bar", dj:"DJ-Pult", dance:"Tanzfläche", entrance:"Eingang",
    bgDots:"Punkte", bgGrid:"Raster", bgBlank:"Leer",
    background:"Hintergrund",
    bulkImport:"Massenimport", bulkImportPlaceholder:"Ein Gast pro Zeile…\nMax Mustermann\nAnna Müller",
    bulkImportBtn:"Importieren", bulkImportTitle:"Gäste importieren",
    bulkImportDesc:"Namen einfügen — eine Zeile pro Gast. Jede nicht-leere Zeile wird zu einem Gast.",
    groupWithCount:"Gruppe mit Gästen", groupCountLabel:"Anzahl Gäste",
    groupNameLabel:"Gruppenname", createGroupBtn:"Gruppe erstellen",
    autoCreateMode:"Modus", autoCreateModeGroup:"Nach Gruppen", autoCreateModeTable:"Nach Tischgröße",
    autoCreateTableCount:"Anzahl Tische", autoCreatePerTable:"Personen pro Tisch",
    autoCreateApply:"Tische erstellen",
    impressum:"Impressum", datenschutz:"Datenschutz", agb:"AGB",
    cookiePolicy:"Cookie-Richtlinie",
    impressumTitle:"Impressum", datenschutzTitle:"Datenschutzerklärung",
    agbTitle:"Allgemeine Geschäftsbedingungen", cookiePolicyTitle:"Cookie-Richtlinie",
    footerRights:"Alle Rechte vorbehalten.",
    clearAll:"Alles löschen", clearTables:"Tische löschen", clearGuests:"Gäste löschen",
    clearAllTitle:"Alles löschen?", clearTablesTitle:"Alle Tische löschen?", clearGuestsTitle:"Alle Gäste löschen?",
    clearAllDesc:"Entfernt alle Gäste, Gruppen und Tische. Kann nicht rückgängig gemacht werden.",
    clearTablesDesc:"Entfernt alle Tische und Sitzplatzzuweisungen.",
    clearGuestsDesc:"Entfernt alle Gäste und Sitzplatzzuweisungen.",
    undoToast:"Rückgängig", redoToast:"Wiederholt",
    groupByLastName:"Nach Nachnamen gruppieren", groupByLastNameDesc:"Gäste mit gleichem Nachnamen werden automatisch gruppiert.",
  }
};

const GROUP_COLORS = [
  { name:"Rose",    bg:"#fff1f2", border:"#fda4af", dot:"#f43f5e" },
  { name:"Violet",  bg:"#f5f3ff", border:"#c4b5fd", dot:"#7c3aed" },
  { name:"Sky",     bg:"#f0f9ff", border:"#7dd3fc", dot:"#0284c7" },
  { name:"Emerald", bg:"#ecfdf5", border:"#6ee7b7", dot:"#059669" },
  { name:"Amber",   bg:"#fffbeb", border:"#fcd34d", dot:"#d97706" },
  { name:"Coral",   bg:"#fff7ed", border:"#fdba74", dot:"#ea580c" },
  { name:"Indigo",  bg:"#eef2ff", border:"#a5b4fc", dot:"#4f46e5" },
  { name:"Stone",   bg:"#fafaf9", border:"#d6d3d1", dot:"#57534e" },
  { name:"Pink",    bg:"#fdf2f8", border:"#f0abfc", dot:"#c026d3" },
  { name:"Teal",    bg:"#f0fdfa", border:"#5eead4", dot:"#0d9488" },
];

// These types never have assignable guest seats
const NO_SEAT_TYPES = ["stage","buffet","bar","dj","dance","entrance","cocktail"];
const DECOR_TYPES   = ["stage","buffet","bar","dj","dance","entrance"];
const isDecorType   = t => DECOR_TYPES.includes(t);
const isNoSeatType  = t => NO_SEAT_TYPES.includes(t);

const TEMPLATES = [
  { id:"wedding-50", name:"Wedding · 50", icon:"💍", guests:50, tables:[
    {id:"t1",name:"Head Table",type:"rect",  seats:8, x:280,y:50,  rotation:0,w:null,h:null,groupId:null},
    {id:"t2",name:"Table 1",  type:"round", seats:8, x:80, y:200, rotation:0,w:null,h:null,groupId:null},
    {id:"t3",name:"Table 2",  type:"round", seats:8, x:270,y:200, rotation:0,w:null,h:null,groupId:null},
    {id:"t4",name:"Table 3",  type:"round", seats:8, x:460,y:200, rotation:0,w:null,h:null,groupId:null},
    {id:"t5",name:"Table 4",  type:"round", seats:8, x:650,y:200, rotation:0,w:null,h:null,groupId:null},
    {id:"t6",name:"Table 5",  type:"round", seats:5, x:175,y:380, rotation:0,w:null,h:null,groupId:null},
    {id:"t7",name:"Table 6",  type:"round", seats:5, x:555,y:380, rotation:0,w:null,h:null,groupId:null},
  ]},
  { id:"wedding-150", name:"Wedding · 150", icon:"💒", guests:150, tables:[
    {id:"t0",name:"Head Table", type:"rect",    seats:10,x:330,y:40, rotation:0,w:null,h:null,groupId:null},
    {id:"t1",name:"Table 1",   type:"round",   seats:10,x:60, y:180,rotation:0,w:null,h:null,groupId:null},
    {id:"t2",name:"Table 2",   type:"round",   seats:10,x:240,y:180,rotation:0,w:null,h:null,groupId:null},
    {id:"t3",name:"Table 3",   type:"round",   seats:10,x:420,y:180,rotation:0,w:null,h:null,groupId:null},
    {id:"t4",name:"Table 4",   type:"round",   seats:10,x:600,y:180,rotation:0,w:null,h:null,groupId:null},
    {id:"t5",name:"Table 5",   type:"round",   seats:10,x:60, y:360,rotation:0,w:null,h:null,groupId:null},
    {id:"t6",name:"Table 6",   type:"round",   seats:10,x:240,y:360,rotation:0,w:null,h:null,groupId:null},
    {id:"t7",name:"Table 7",   type:"round",   seats:10,x:420,y:360,rotation:0,w:null,h:null,groupId:null},
    {id:"t8",name:"Table 8",   type:"round",   seats:10,x:600,y:360,rotation:0,w:null,h:null,groupId:null},
    {id:"t9",name:"Table 9",   type:"round",   seats:10,x:150,y:540,rotation:0,w:null,h:null,groupId:null},
    {id:"tA",name:"Table 10",  type:"round",   seats:10,x:330,y:540,rotation:0,w:null,h:null,groupId:null},
    {id:"tB",name:"Table 11",  type:"round",   seats:10,x:510,y:540,rotation:0,w:null,h:null,groupId:null},
    {id:"tE",name:"Sweetheart",type:"cocktail",seats:2, x:370,y:120,rotation:0,w:null,h:null,groupId:null},
    {id:"df",name:"Dance Floor",type:"dance",  seats:0, x:160,y:660,rotation:0,w:null,h:null,groupId:null},
  ]},
  { id:"gala", name:"Gala · 80", icon:"✨", guests:80, tables:[
    {id:"t0",name:"Head Table",type:"rect",  seats:10,x:280,y:40, rotation:0,w:null,h:null,groupId:null},
    {id:"t1",name:"Table 1",  type:"round", seats:10,x:70, y:200,rotation:0,w:null,h:null,groupId:null},
    {id:"t2",name:"Table 2",  type:"round", seats:10,x:250,y:200,rotation:0,w:null,h:null,groupId:null},
    {id:"t3",name:"Table 3",  type:"round", seats:10,x:430,y:200,rotation:0,w:null,h:null,groupId:null},
    {id:"t4",name:"Table 4",  type:"round", seats:10,x:610,y:200,rotation:0,w:null,h:null,groupId:null},
    {id:"t5",name:"Table 5",  type:"round", seats:10,x:160,y:380,rotation:0,w:null,h:null,groupId:null},
    {id:"t6",name:"Table 6",  type:"round", seats:10,x:340,y:380,rotation:0,w:null,h:null,groupId:null},
    {id:"t7",name:"Table 7",  type:"round", seats:10,x:520,y:380,rotation:0,w:null,h:null,groupId:null},
    {id:"dj",name:"DJ Booth", type:"dj",    seats:0, x:640,y:40, rotation:0,w:null,h:null,groupId:null},
    {id:"bf",name:"Buffet",   type:"buffet",seats:0, x:40, y:40, rotation:0,w:null,h:null,groupId:null},
  ]},
  { id:"conference", name:"Conference · 40", icon:"🎤", guests:40, tables:[
    {id:"t0",name:"Stage",type:"stage",seats:0, x:220,y:30, rotation:0,w:null,h:null,groupId:null},
    {id:"t2",name:"Row A",type:"rect", seats:10,x:60, y:180,rotation:0,w:null,h:null,groupId:null},
    {id:"t3",name:"Row B",type:"rect", seats:10,x:60, y:270,rotation:0,w:null,h:null,groupId:null},
    {id:"t4",name:"Row C",type:"rect", seats:10,x:60, y:360,rotation:0,w:null,h:null,groupId:null},
    {id:"t5",name:"Row D",type:"rect", seats:10,x:60, y:450,rotation:0,w:null,h:null,groupId:null},
  ]},
  { id:"birthday", name:"Birthday · 24", icon:"🎂", guests:24, tables:[
    {id:"t0",name:"Main Table",type:"round", seats:10,x:300,y:160,rotation:0,w:null,h:null,groupId:null},
    {id:"t1",name:"Side A",   type:"round", seats:7, x:100,y:290,rotation:0,w:null,h:null,groupId:null},
    {id:"t2",name:"Side B",   type:"round", seats:7, x:500,y:290,rotation:0,w:null,h:null,groupId:null},
    {id:"ck",name:"Cake",     type:"buffet",seats:0, x:310,y:390,rotation:0,w:null,h:null,groupId:null},
  ]},
  { id:"networking", name:"Networking · 60", icon:"🤝", guests:60, tables:[
    {id:"t1",name:"Cocktail 1",type:"cocktail",seats:6,x:80, y:80, rotation:0,w:null,h:null,groupId:null},
    {id:"t2",name:"Cocktail 2",type:"cocktail",seats:6,x:260,y:80, rotation:0,w:null,h:null,groupId:null},
    {id:"t3",name:"Cocktail 3",type:"cocktail",seats:6,x:440,y:80, rotation:0,w:null,h:null,groupId:null},
    {id:"t4",name:"Cocktail 4",type:"cocktail",seats:6,x:620,y:80, rotation:0,w:null,h:null,groupId:null},
    {id:"t5",name:"Cocktail 5",type:"cocktail",seats:6,x:80, y:260,rotation:0,w:null,h:null,groupId:null},
    {id:"t6",name:"Cocktail 6",type:"cocktail",seats:6,x:260,y:260,rotation:0,w:null,h:null,groupId:null},
    {id:"t7",name:"Cocktail 7",type:"cocktail",seats:6,x:440,y:260,rotation:0,w:null,h:null,groupId:null},
    {id:"t8",name:"Cocktail 8",type:"cocktail",seats:6,x:620,y:260,rotation:0,w:null,h:null,groupId:null},
    {id:"bf",name:"Buffet",    type:"buffet",  seats:0,x:240,y:400,rotation:0,w:null,h:null,groupId:null},
    {id:"br",name:"Bar",       type:"bar",     seats:0,x:480,y:400,rotation:0,w:null,h:null,groupId:null},
  ]},
  { id:"banquet", name:"Banquet · 100", icon:"🍽️", guests:100, tables:[
    {id:"t0",name:"Head Table",type:"rect",   seats:10,x:240,y:40, rotation:0,w:null,h:null,groupId:null},
    {id:"t1",name:"Banquet 1", type:"banquet",seats:12,x:40, y:180,rotation:0,w:null,h:null,groupId:null},
    {id:"t2",name:"Banquet 2", type:"banquet",seats:12,x:40, y:290,rotation:0,w:null,h:null,groupId:null},
    {id:"t3",name:"Banquet 3", type:"banquet",seats:12,x:40, y:400,rotation:0,w:null,h:null,groupId:null},
    {id:"t4",name:"Banquet 4", type:"banquet",seats:12,x:360,y:180,rotation:0,w:null,h:null,groupId:null},
    {id:"t5",name:"Banquet 5", type:"banquet",seats:12,x:360,y:290,rotation:0,w:null,h:null,groupId:null},
    {id:"t6",name:"Banquet 6", type:"banquet",seats:12,x:360,y:400,rotation:0,w:null,h:null,groupId:null},
    {id:"sg",name:"Stage",     type:"stage",  seats:0, x:500,y:40, rotation:0,w:null,h:null,groupId:null},
  ]},
  { id:"classroom", name:"Classroom · 30", icon:"🎓", guests:30, tables:[
    {id:"tb",name:"Teacher",type:"rect",seats:1, x:250,y:30, rotation:0,w:null,h:null,groupId:null},
    {id:"t1",name:"Row 1",  type:"rect",seats:6, x:60, y:140,rotation:0,w:null,h:null,groupId:null},
    {id:"t2",name:"Row 2",  type:"rect",seats:6, x:60, y:230,rotation:0,w:null,h:null,groupId:null},
    {id:"t3",name:"Row 3",  type:"rect",seats:6, x:60, y:320,rotation:0,w:null,h:null,groupId:null},
    {id:"t4",name:"Row 4",  type:"rect",seats:6, x:60, y:410,rotation:0,w:null,h:null,groupId:null},
    {id:"t5",name:"Row 5",  type:"rect",seats:5, x:60, y:500,rotation:0,w:null,h:null,groupId:null},
  ]},
];

const genId = () => Math.random().toString(36).slice(2,9);
const generateGuests = n => Array.from({length:Math.min(n,2000)},(_,i)=>({id:genId(),name:`Guest ${i+1}`,groupId:null}));
const save = (k,v) => { try{localStorage.setItem(k,JSON.stringify(v));}catch{} };
const load = k => { try{const v=localStorage.getItem(k);return v?JSON.parse(v):null;}catch{return null;} };

// ─── REDUCER ───────────────────────────────────────────────────────────────
const MAX_HISTORY = 40;
const initState = {
  view:"landing", lang:"de",
  event:{name:"",location:"",date:"",guestCount:50},
  guests:[], groups:[], tables:[], assignments:{},
  bgStyle:"dots", // dots | grid | blank
  past:[], future:[],
};

function snapshot(state) {
  return { guests:state.guests, groups:state.groups, tables:state.tables, assignments:state.assignments };
}

function withHistory(state, next) {
  const past = [...(state.past||[]), snapshot(state)].slice(-MAX_HISTORY);
  return { ...state, ...next, past, future:[] };
}

function reducer(state, action) {
  switch(action.type) {
    case "SET_VIEW": return {...state, view:action.payload};
    case "SET_LANG": return {...state, lang:action.payload};
    case "SET_BG": return {...state, bgStyle:action.payload};
    case "INIT_EVENT": {
      const guests=generateGuests(parseInt(action.payload.guestCount)||50);
      const tables=(action.tables||[]).map(t=>({...t,id:genId(),groupId:null,w:null,h:null,rotation:0}));
      return {...state,view:"app",event:action.payload,guests,groups:[],tables,assignments:{},past:[],future:[]};
    }
    case "LOAD_PROJECT": {
      // Clean up any stale assignments that belong to no-seat-type tables
      const p=action.payload;
      const noSeatIds=new Set((p.tables||[]).filter(t=>NO_SEAT_TYPES.includes(t.type)).map(t=>t.id));
      const cleanA={};
      Object.entries(p.assignments||{}).forEach(([k,v])=>{
        const tid=k.split("-")[0];
        if(!noSeatIds.has(tid)) cleanA[k]=v;
      });
      return {...p,assignments:cleanA,view:"app",past:[],future:[]};
    }
    case "UNDO": {
      if(!state.past||state.past.length===0) return state;
      const prev=state.past[state.past.length-1];
      const past=state.past.slice(0,-1);
      const future=[snapshot(state),...(state.future||[])].slice(0,MAX_HISTORY);
      return {...state,...prev,past,future};
    }
    case "REDO": {
      if(!state.future||state.future.length===0) return state;
      const next=state.future[0];
      const future=state.future.slice(1);
      const past=[...(state.past||[]),snapshot(state)].slice(-MAX_HISTORY);
      return {...state,...next,past,future};
    }
    case "ADD_GUEST": return withHistory(state,{guests:[...state.guests,{id:genId(),name:action.payload,groupId:null}]});
    case "UPDATE_GUEST": return withHistory(state,{guests:state.guests.map(g=>g.id===action.id?{...g,...action.payload}:g)});
    case "DELETE_GUEST": {
      const a={...state.assignments};
      Object.keys(a).forEach(k=>{if(a[k]===action.id)delete a[k];});
      return withHistory(state,{guests:state.guests.filter(g=>g.id!==action.id),assignments:a});
    }
    case "ADD_GROUP": return withHistory(state,{groups:[...state.groups,{id:genId(),name:action.payload,colorIndex:state.groups.length%GROUP_COLORS.length}]});
    case "UPDATE_GROUP": return withHistory(state,{groups:state.groups.map(g=>g.id===action.id?{...g,...action.payload}:g)});
    case "DELETE_GROUP": return withHistory(state,{
      groups:state.groups.filter(g=>g.id!==action.id),
      guests:state.guests.map(g=>g.groupId===action.id?{...g,groupId:null}:g),
      tables:state.tables.map(t=>t.groupId===action.id?{...t,groupId:null}:t),
    });
    case "ADD_TABLE": return withHistory(state,{tables:[...state.tables,action.payload]});
    case "UPDATE_TABLE": return {...state,tables:state.tables.map(t=>t.id===action.id?{...t,...action.payload}:t)};
    case "UPDATE_TABLE_HISTORY": return withHistory(state,{tables:state.tables.map(t=>t.id===action.id?{...t,...action.payload}:t)});
    case "DELETE_TABLE": {
      const a={...state.assignments};
      Object.keys(a).forEach(k=>{if(k.startsWith(action.id+"-"))delete a[k];});
      return withHistory(state,{tables:state.tables.filter(t=>t.id!==action.id),assignments:a});
    }
    case "ASSIGN_SEAT": {
      const a={...state.assignments};
      Object.keys(a).forEach(k=>{if(a[k]===action.guestId)delete a[k];});
      if(action.seatKey) a[action.seatKey]=action.guestId;
      return withHistory(state,{assignments:a});
    }
    case "UNASSIGN_SEAT": {
      const a={...state.assignments};delete a[action.seatKey];
      return withHistory(state,{assignments:a});
    }
    case "AUTO_ARRANGE": {
      // Smart arrange: try to seat each group at the fewest tables possible
      const seatableTables=state.tables.filter(t=>!isNoSeatType(t.type)&&(t.seats||0)>0);
      const a={};
      // Build pool of free seats per table
      const tablePools=seatableTables.map(t=>({
        id:t.id,
        groupId:t.groupId||null,
        free:Array.from({length:t.seats},(_,i)=>`${t.id}-${i}`)
      }));
      let allFreeSeats=tablePools.flatMap(p=>p.free);
      let seatIdx=0;

      // Group guests by groupId
      const byGroup={};
      state.guests.forEach(g=>{
        const k=g.groupId||"__none__";
        if(!byGroup[k])byGroup[k]=[];
        byGroup[k].push(g);
      });

      // First pass: seat groups at tables that match their groupId
      Object.entries(byGroup).forEach(([gid,members])=>{
        if(gid==="__none__")return;
        // Find tables assigned to this group
        const matchTables=tablePools.filter(p=>p.groupId===gid);
        const matchSeats=matchTables.flatMap(p=>p.free);
        let mi=0;
        members.forEach(g=>{
          if(mi<matchSeats.length){
            a[matchSeats[mi++]]=g.id;
          } else {
            // Overflow: use general pool
            while(seatIdx<allFreeSeats.length&&a[allFreeSeats[seatIdx]])seatIdx++;
            if(seatIdx<allFreeSeats.length)a[allFreeSeats[seatIdx++]]=g.id;
          }
        });
      });

      // Second pass: remaining unassigned guests (ungrouped)
      const assignedGuestIds=new Set(Object.values(a));
      const unassigned=state.guests.filter(g=>!assignedGuestIds.has(g.id));
      let si=0;
      unassigned.forEach(g=>{
        while(si<allFreeSeats.length&&a[allFreeSeats[si]])si++;
        if(si<allFreeSeats.length)a[allFreeSeats[si++]]=g.id;
      });

      return withHistory(state,{assignments:a});
    }
    case "AUTO_CREATE_TABLES": {
      const {guests,groups,tables}=state;
      const mode=action.mode||"group";
      const perTable=Math.max(1,parseInt(action.perTable)||10);
      const newTables=[];
      const COLS=4,SPACEX=230,SPACEY=220,STARTX=60,STARTY=60;
      let col=0,row=0;
      let tableNum=tables.length+1;
      const place=()=>{
        const x=STARTX+col*SPACEX,y=STARTY+row*SPACEY;
        col++; if(col>=COLS){col=0;row++;} return{x,y};
      };
      // Use arrow function (not declaration) to avoid illegal function-in-block
      const addTables=(guestList,groupId,baseName)=>{
        const total=guestList.length;
        if(total===0)return;
        const numTables=Math.ceil(total/perTable);
        for(let i=0;i<numTables;i++){
          const thisSeats=Math.min(perTable,total-i*perTable);
          const{x,y}=place();
          const label=numTables>1?`${baseName} ${i+1}`:baseName;
          newTables.push({id:genId(),name:label,type:"round",seats:thisSeats,x,y,groupId,w:null,h:null,rotation:0});
          tableNum++;
        }
      };
      if(mode==="size"){
        const tableCount=Math.max(1,action.tableCount||1);
        for(let i=0;i<tableCount;i++){
          const{x,y}=place();
          newTables.push({id:genId(),name:`Table ${tableNum++}`,type:"round",seats:perTable,x,y,groupId:null,w:null,h:null,rotation:0});
        }
      } else {
        groups.forEach(g=>{
          const members=guests.filter(gs=>gs.groupId===g.id);
          addTables(members,g.id,g.name);
        });
        const ung=guests.filter(g=>!g.groupId);
        if(ung.length>0) addTables(ung,null,`Table ${tableNum}`);
      }
      const totalSeatsCreated=newTables.reduce((s,t)=>s+(t.seats||0),0);
      const guestsToSeat=mode==="size"?0:guests.length;
      if(mode!=="size"&&totalSeatsCreated!==guestsToSeat){
        console.warn(`SeatFlow: ${totalSeatsCreated} seats for ${guestsToSeat} guests`);
      }
      return withHistory(state,{tables:[...tables,...newTables]});
    }
    case "BULK_ADD_GUESTS": {
      // action.names: string[] — batch add, perf-optimised single history entry
      const newGuests=action.names
        .map(n=>n.trim()).filter(Boolean)
        .map(n=>({id:genId(),name:n,groupId:action.groupId||null}));
      if(newGuests.length===0) return state;
      return withHistory(state,{guests:[...state.guests,...newGuests]});
    }
    case "ADD_GROUP_WITH_GUESTS": {
      // Create group + N placeholder guests in one shot
      const gid=genId();
      const colorIndex=state.groups.length%GROUP_COLORS.length;
      const newGroup={id:gid,name:action.name,colorIndex};
      const count=Math.max(0,parseInt(action.count)||0);
      const newGuests=Array.from({length:count},(_,i)=>({
        id:genId(),name:`${action.name} – ${state.lang==="de"?"Gast":"Guest"} ${i+1}`,groupId:gid
      }));
      return withHistory(state,{
        groups:[...state.groups,newGroup],
        guests:[...state.guests,...newGuests],
      });
    }
    case "SWAP_SEATS": {
      // Swap guests between two seats (preserving group assignments)
      const a={...state.assignments};
      const g1=a[action.seatA];
      const g2=a[action.seatB];
      if(g2) a[action.seatA]=g2; else delete a[action.seatA];
      if(g1) a[action.seatB]=g1; else delete a[action.seatB];
      return withHistory(state,{assignments:a});
    }
    case "CLEAR_ALL":
      return withHistory(state,{guests:[],groups:[],tables:[],assignments:{}});
    case "CLEAR_TABLES":
      return withHistory(state,{tables:[],assignments:{}});
    case "CLEAR_GUESTS": {
      return withHistory(state,{guests:[],assignments:{}});
    }
    case "GROUP_BY_LASTNAME": {
      // Auto-group guests by last name
      const lastNames={};
      state.guests.forEach(g=>{
        const parts=g.name.trim().split(/\s+/);
        if(parts.length<2)return;
        const ln=parts[parts.length-1];
        if(!lastNames[ln])lastNames[ln]=[];
        lastNames[ln].push(g.id);
      });
      // Only create groups for last names with >=2 guests
      const newGroups=[...state.groups];
      const guestUpdates={};
      Object.entries(lastNames).filter(([,ids])=>ids.length>=2).forEach(([ln,ids])=>{
        const existing=newGroups.find(g=>g.name===ln);
        let gid=existing?existing.id:genId();
        if(!existing) newGroups.push({id:gid,name:ln,colorIndex:newGroups.length%GROUP_COLORS.length});
        ids.forEach(id=>{ guestUpdates[id]=gid; });
      });
      const updatedGuests=state.guests.map(g=>guestUpdates[g.id]?{...g,groupId:guestUpdates[g.id]}:g);
      return withHistory(state,{guests:updatedGuests,groups:newGroups});
    }
    default: return state;
  }
}

// ─── ROOT ──────────────────────────────────────────────────────────────────
export default function SeatFlow() {
  const [state,dispatch]=useReducer(reducer,initState);
  const t=T[state.lang||"de"];

  useEffect(()=>{
    // Clear old version caches that had floating label bugs
    try{["sf_v2","sf_v3","sf_v4"].forEach(k=>localStorage.removeItem(k));}catch{}
    const lang=load("sf_lang")||"de";
    dispatch({type:"SET_LANG",payload:lang});
  },[]);

  useEffect(()=>{
    if(state.view==="app") save("sf_v5",state);
    save("sf_lang",state.lang||"de");
  },[state]);

  // Keyboard undo/redo
  useEffect(()=>{
    const handler=e=>{
      if((e.ctrlKey||e.metaKey)&&e.key==="z"&&!e.shiftKey){e.preventDefault();dispatch({type:"UNDO"});}
      if((e.ctrlKey||e.metaKey)&&(e.key==="y"||(e.key==="z"&&e.shiftKey))){e.preventDefault();dispatch({type:"REDO"});}
    };
    window.addEventListener("keydown",handler);
    return()=>window.removeEventListener("keydown",handler);
  },[]);

  if(state.view==="landing") return <LandingPage dispatch={dispatch} t={t} lang={state.lang}/>;
  if(state.view==="setup")   return <SetupPage   dispatch={dispatch} t={t} lang={state.lang}/>;
  return <AppPage state={state} dispatch={dispatch} t={t}/>;
}

// ─── LANG TOGGLE ───────────────────────────────────────────────────────────
function LangToggle({ lang, dispatch, style={} }) {
  return (
    <div style={{ display:"flex",gap:2,background:"#f5f5f5",borderRadius:8,padding:2,...style }}>
      {["de","en"].map(l=>(
        <button key={l} onClick={()=>dispatch({type:"SET_LANG",payload:l})}
          style={{ padding:"3px 9px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,
            background:lang===l?"#111":"transparent",color:lang===l?"#fff":"#888",
            fontFamily:"'DM Sans',sans-serif",transition:"all .15s" }}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

// ─── LANDING ───────────────────────────────────────────────────────────────
function LandingPage({ dispatch, t, lang }) {
  const saved=load("sf_v5");
  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif",background:"#fafafa",minHeight:"100vh" }}>
      <Head>
        <title>SeatFlow – Kostenloser Sitzplan-Editor | Free Seating Chart Planner</title>
        <meta name="description" content="SeatFlow ist der kostenlose, browserbasierte Sitzplan-Editor für Hochzeiten, Konferenzen, Geburtstage und Events. Drag & Drop, Auto-Anordnung, PDF-Export. Kein Login nötig."/>
        <meta name="keywords" content="sitzplan erstellen, seating chart creator, hochzeit sitzplan, wedding seating chart, sitzplan tool, seating planner free, tischplan hochzeit, event sitzplan"/>
        <meta property="og:title" content="SeatFlow – Kostenloser Sitzplan-Editor"/>
        <meta property="og:description" content="Plane dein Event in Minuten. Drag & Drop, Gruppen, PDF-Export. Kostenlos, kein Login."/>
        <meta property="og:type" content="website"/>
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5"/>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='%23111'/><text x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' font-family='Georgia,serif' font-weight='700' font-size='28' fill='white'>SF</text></svg>"/>
        <link rel="stylesheet" href={FONT_URL}/>
      </Head>
      <style>{`*{box-sizing:border-box;}.bp{background:#111;color:#fff;border:none;padding:11px 26px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif;}.bp:hover{background:#333;transform:translateY(-1px);}.bo{background:transparent;color:#111;border:1.5px solid #ddd;padding:10px 22px;border-radius:10px;font-size:14px;font-weight:500;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif;}.bo:hover{border-color:#999;background:#f5f5f5;}`}</style>
      <nav style={{ padding:"14px 28px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #eee",background:"#fff",position:"sticky",top:0,zIndex:50 }}>
        <span style={{ fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700 }}>{t.appName}</span>
        <div style={{ display:"flex",gap:10,alignItems:"center" }}>
          <LangToggle lang={lang} dispatch={dispatch}/>
          {saved&&<button className="bo" style={{ fontSize:12,padding:"6px 14px" }} onClick={()=>dispatch({type:"LOAD_PROJECT",payload:saved})}>{t.continueProject}</button>}
          <button className="bp" style={{ fontSize:12,padding:"7px 16px" }} onClick={()=>dispatch({type:"SET_VIEW",payload:"setup"})}>{t.createEvent}</button>
        </div>
      </nav>
      <div style={{ textAlign:"center",padding:"70px 24px 50px",maxWidth:680,margin:"0 auto" }}>
        <div style={{ display:"inline-flex",alignItems:"center",gap:7,background:"#f5f5f5",border:"1px solid #e5e5e5",borderRadius:999,padding:"4px 13px",fontSize:12,color:"#666",marginBottom:20,fontWeight:500 }}>
          <span style={{ width:6,height:6,borderRadius:"50%",background:"#22c55e",display:"inline-block"}}/>
          Free · No sign-up · 2000 guests
        </div>
        <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(32px,7vw,62px)",fontWeight:700,letterSpacing:"-2px",lineHeight:1.08,color:"#111",marginBottom:16 }}>
          {lang==="de"?"Schöne Sitzpläne\nin Minuten":"Beautiful seating\nplans in minutes"}
        </h1>
        <p style={{ fontSize:15,color:"#666",lineHeight:1.7,marginBottom:34,maxWidth:420,margin:"0 auto 34px" }}>
          {lang==="de"?"Drag & Drop, Gruppen-Autoanordnung, Export als PNG oder PDF. Kostenlos, kein Login.":"Drag & drop, auto-arrange by group, export as PNG or PDF. Free, no login."}
        </p>
        <div style={{ display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap" }}>
          <button className="bp" style={{ fontSize:15,padding:"12px 34px" }} onClick={()=>dispatch({type:"SET_VIEW",payload:"setup"})}>{t.startPlanning}</button>
          <button className="bo" onClick={()=>dispatch({type:"INIT_EVENT",payload:{name:lang==="de"?"Demo Hochzeit":"Demo Wedding",location:"Grand Ballroom",date:"2025-09-20",guestCount:30},tables:TEMPLATES[0].tables})}>{t.viewDemo}</button>
        </div>
      </div>
      <div style={{ maxWidth:940,margin:"0 auto",padding:"0 24px 70px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:13 }}>
        {[
          {icon:"🏗️",t:t.autoCreate,d:lang==="de"?"Tische automatisch pro Gruppe erstellen.":"Creates tables per group automatically."},
          {icon:"✨",t:t.autoArrange,d:lang==="de"?"Gruppen werden gemeinsam platziert.":"Groups are placed together intelligently."},
          {icon:"🎨",t:lang==="de"?"Gruppenfarben":"Group Colors",d:lang==="de"?"Tische erben Farbe und Name der Gruppe.":"Tables inherit group color and name."},
          {icon:"📄",t:"PDF + Summary",d:lang==="de"?"Export mit vollständiger Gästeliste.":"Export with full guest list."},
          {icon:"🔄",t:"Undo / Redo",d:lang==="de"?"Strg+Z und Strg+Y jederzeit.":"Ctrl+Z and Ctrl+Y anytime."},
          {icon:"💾",t:lang==="de"?"Offline speichern":"Offline Save",d:lang==="de"?"Kein Account nötig.":"No account needed."},
        ].map(f=>(
          <div key={f.t} style={{ background:"#fff",border:"1px solid #e8e8e8",borderRadius:15,padding:"20px" }}>
            <div style={{ fontSize:22,marginBottom:8 }}>{f.icon}</div>
            <div style={{ fontWeight:600,fontSize:13,color:"#111",marginBottom:4 }}>{f.t}</div>
            <div style={{ fontSize:12,color:"#888",lineHeight:1.5 }}>{f.d}</div>
          </div>
        ))}
      </div>
      <Footer t={t} lang={lang} dispatch={dispatch}/>
    </div>
  );
}

// ─── SETUP ─────────────────────────────────────────────────────────────────
function SetupPage({ dispatch, t, lang }) {
  const [step,setStep]=useState(0);
  const [form,setForm]=useState({name:"",location:"",date:"",guestCount:50});
  const [err,setErr]=useState("");
  function next(){
    if(!form.name.trim()){setErr(lang==="de"?"Bitte Eventname eingeben.":"Please enter an event name.");return;}
    if(+form.guestCount<1||+form.guestCount>2000){setErr(lang==="de"?"Gästezahl: 1–2000.":"Guest count: 1–2000.");return;}
    setErr("");setStep(1);
  }
  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif",background:"#fafafa",minHeight:"100vh",display:"flex",flexDirection:"column" }}>
      <Head>
        <title>{event.name?`${event.name} – SeatFlow`:"SeatFlow – Sitzplan"}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5"/>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='%23111'/><text x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' font-family='Georgia,serif' font-weight='700' font-size='28' fill='white'>SF</text></svg>"/>
        <link rel="stylesheet" href={FONT_URL}/>
      </Head>
      <nav style={{ padding:"14px 26px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #eee",background:"#fff" }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <button onClick={()=>dispatch({type:"SET_VIEW",payload:"landing"})} style={{ background:"none",border:"none",cursor:"pointer",color:"#888",fontSize:13,fontFamily:"'DM Sans',sans-serif" }}>{t.back}</button>
          <span style={{ fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700 }}>{t.appName}</span>
        </div>
        <LangToggle lang={lang} dispatch={dispatch}/>
      </nav>
      <div style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"26px 20px" }}>
        <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}}
          style={{ background:"#fff",border:"1px solid #e8e8e8",borderRadius:20,padding:"clamp(20px,5vw,40px)",maxWidth:520,width:"100%",boxShadow:"0 8px 40px rgba(0,0,0,.06)" }}>
          {step===0&&<>
            <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:23,fontWeight:700,letterSpacing:"-0.8px",marginBottom:5 }}>{t.newEvent}</h2>
            <p style={{ color:"#888",fontSize:13,marginBottom:24 }}>{lang==="de"?"Erzähl uns von deinem Event.":"Tell us about your event."}</p>
            {[
              {label:t.eventName,key:"name",type:"text",ph:lang==="de"?"z.B. Hochzeit Sarah & James":"e.g. Sarah & James Wedding"},
              {label:t.location, key:"location",type:"text",ph:lang==="de"?"z.B. Grand Ballroom":"e.g. The Grand Ballroom"},
              {label:t.date,     key:"date",type:"date"},
              {label:t.guestCount,key:"guestCount",type:"number",ph:"50"},
            ].map(f=>(
              <div key={f.key} style={{ marginBottom:14 }}>
                <label style={{ display:"block",fontSize:12,fontWeight:600,color:"#333",marginBottom:4 }}>{f.label}</label>
                <input type={f.type} value={form[f.key]} placeholder={f.ph||""}
                  min={f.key==="guestCount"?1:undefined} max={f.key==="guestCount"?2000:undefined}
                  onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))}
                  style={{ width:"100%",padding:"9px 12px",border:"1.5px solid #e0e0e0",borderRadius:9,fontSize:13,outline:"none",fontFamily:"'DM Sans',sans-serif",transition:"border-color .2s" }}
                  onFocus={e=>e.target.style.borderColor="#111"} onBlur={e=>e.target.style.borderColor="#e0e0e0"}/>
              </div>
            ))}
            {err&&<p style={{ color:"#ef4444",fontSize:12,marginBottom:10 }}>{err}</p>}
            <button onClick={next} style={{ width:"100%",background:"#111",color:"#fff",border:"none",padding:"11px",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>{t.continueBtn}</button>
          </>}
          {step===1&&<>
            <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:21,fontWeight:700,letterSpacing:"-0.8px",marginBottom:5 }}>{t.chooseTemplate}</h2>
            <p style={{ color:"#888",fontSize:12,marginBottom:16 }}>{lang==="de"?"Oder leer beginnen — Tische manuell hinzufügen.":"Or start blank — add tables manually."}</p>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:7,marginBottom:9 }}>
              {TEMPLATES.map(tmpl=>(
                <motion.button key={tmpl.id} whileHover={{scale:1.03}} whileTap={{scale:.97}}
                  onClick={()=>dispatch({type:"INIT_EVENT",payload:{...form,guestCount:+form.guestCount},tables:tmpl.tables})}
                  style={{ background:"#f8f8f8",border:"1.5px solid #e8e8e8",borderRadius:10,padding:"12px 8px",cursor:"pointer",textAlign:"left",fontFamily:"'DM Sans',sans-serif" }}>
                  <div style={{ fontSize:17,marginBottom:4 }}>{tmpl.icon}</div>
                  <div style={{ fontSize:10,fontWeight:600,color:"#111",lineHeight:1.4 }}>{tmpl.name}</div>
                </motion.button>
              ))}
            </div>
            <button onClick={()=>dispatch({type:"INIT_EVENT",payload:{...form,guestCount:+form.guestCount},tables:[]})}
              style={{ width:"100%",background:"#fff",color:"#111",border:"1.5px solid #ddd",padding:"10px",borderRadius:10,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>{t.blankCanvas}</button>
            <button onClick={()=>setStep(0)} style={{ width:"100%",background:"none",border:"none",color:"#aaa",padding:"7px",cursor:"pointer",fontSize:12,marginTop:2,fontFamily:"'DM Sans',sans-serif" }}>{t.back}</button>
          </>}
        </motion.div>
      </div>
    </div>
  );
}

// ─── APP PAGE ──────────────────────────────────────────────────────────────
function AppPage({ state, dispatch, t }) {
  const [tab,setTab]=useState("guests");
  const [sideOpen,setSideOpen]=useState(true);
  const [searchQ,setSearchQ]=useState("");
  const [editGuest,setEditGuest]=useState(null);
  const [editTable,setEditTable]=useState(null);
  const [dragGuest,setDragGuest]=useState(null);
  const [selectedSeat,setSelectedSeat]=useState(null);
  const [expandedTable,setExpandedTable]=useState(null);
  const [highlightedGuest,setHighlightedGuest]=useState(null); // guest id
  const [highlightedTable,setHighlightedTable]=useState(null);
  const [showExport,setShowExport]=useState(false);
  const [showGroups,setShowGroups]=useState(false);
  const [showAutoCreateInfo,setShowAutoCreateInfo]=useState(false);
  const [showAutoArrangeInfo,setShowAutoArrangeInfo]=useState(false);
  const [showLeaveConfirm,setShowLeaveConfirm]=useState(false);
  const [showClearModal,setShowClearModal]=useState(false);
  const [leaveTarget,setLeaveTarget]=useState(null);
  const [isMobile,setIsMobile]=useState(false);
  const [mobileSheet,setMobileSheet]=useState(null);
  const [undoToast,setUndoToast]=useState(null); // "undo"|"redo"|null
  const undoToastTimer=useRef(null);
  const canvasWrapRef=useRef(null);
  const lang=state.lang||"de";

  useEffect(()=>{
    const check=()=>setIsMobile(window.innerWidth<768);
    check(); window.addEventListener("resize",check);
    return()=>window.removeEventListener("resize",check);
  },[]);

  useEffect(()=>{
    const h=e=>{e.preventDefault();e.returnValue="";};
    window.addEventListener("beforeunload",h);
    return()=>window.removeEventListener("beforeunload",h);
  },[]);

  function showToast(type){
    setUndoToast(type);
    if(undoToastTimer.current) clearTimeout(undoToastTimer.current);
    undoToastTimer.current=setTimeout(()=>setUndoToast(null),2000);
  }

  function doUndo(){ dispatch({type:"UNDO"}); showToast("undo"); }
  function doRedo(){ dispatch({type:"REDO"}); showToast("redo"); }

  // Keyboard shortcuts
  useEffect(()=>{
    const h=e=>{
      if((e.ctrlKey||e.metaKey)&&e.key==="z"&&!e.shiftKey){e.preventDefault();doUndo();}
      if((e.ctrlKey||e.metaKey)&&(e.key==="y"||(e.key==="z"&&e.shiftKey))){e.preventDefault();doRedo();}
    };
    window.addEventListener("keydown",h);
    return()=>window.removeEventListener("keydown",h);
  },[state.past,state.future]);

  const{guests,groups,tables,assignments,event,bgStyle,past,future}=state;
  const assignedIds=new Set(Object.values(assignments));
  const assignedCount=assignedIds.size;
  const totalSeats=tables.reduce((s,tb)=>isNoSeatType(tb.type)?s:s+(tb.seats||0),0);
  const unseatedCount=guests.length-assignedCount;
  const filtered=guests.filter(g=>g.name.toLowerCase().includes(searchQ.toLowerCase()));
  const getGC=gid=>{const g=groups.find(g=>g.id===gid);return g?GROUP_COLORS[g.colorIndex%GROUP_COLORS.length]:null;};
  const getGuestAtSeat=sk=>{const gid=assignments[sk];return gid?guests.find(g=>g.id===gid):null;};

  function handleSeatDrop(seatKey){
    if(!dragGuest)return;
    dispatch({type:"ASSIGN_SEAT",seatKey,guestId:dragGuest.id});
    setDragGuest(null);
  }
  function handleSeatClick(seatKey){
    if(dragGuest){handleSeatDrop(seatKey);return;}
    if(selectedSeat){
      if(selectedSeat===seatKey){setSelectedSeat(null);return;}
      // Swap the two seats (group assignments untouched)
      dispatch({type:"SWAP_SEATS",seatA:selectedSeat,seatB:seatKey});
      setSelectedSeat(null);
      return;
    }
    setSelectedSeat(seatKey);
  }
  function handleGuestClickForSeat(guest){
    if(selectedSeat){dispatch({type:"ASSIGN_SEAT",seatKey:selectedSeat,guestId:guest.id});setSelectedSeat(null);}
  }
  function handleTableClick(tableId){
    setExpandedTable(prev=>prev===tableId?null:tableId);
  }
  function addTable(type){
    const tl=T[lang];
    const nm={round:tl.round,rect:tl.rectangle,banquet:tl.banquet,stage:tl.stage,cocktail:tl.cocktail,buffet:tl.buffet,bar:tl.bar,dj:tl.dj,dance:tl.dance,entrance:tl.entrance};
    const sm={round:8,rect:8,banquet:12,stage:0,cocktail:0,buffet:0,bar:0,dj:0,dance:0,entrance:0};
    dispatch({type:"ADD_TABLE",payload:{id:genId(),name:nm[type]||type,type,seats:sm[type]||0,x:100+Math.random()*300,y:80+Math.random()*200,groupId:null,w:null,h:null,rotation:0}});
  }
  function exportProject(){
    const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download=`${event.name||"seatflow"}.seatflow`;a.click();
    URL.revokeObjectURL(url);
  }
  function importProject(e){
    const file=e.target.files[0];if(!file)return;
    const r=new FileReader();
    r.onload=ev=>{try{dispatch({type:"LOAD_PROJECT",payload:JSON.parse(ev.target.result)});}catch{alert("Invalid file.");}};
    r.readAsText(file);e.target.value="";
  }

  const sidebarContent=(
    <div style={{ display:"flex",flexDirection:"column",height:"100%",overflow:"hidden" }}>
      <div style={{ padding:"7px 10px 0",borderBottom:"1px solid #f0f0f0",flexShrink:0 }}>
        <div style={{ display:"flex",gap:3 }}>
          {["guests","tables"].map(tb=>(
            <button key={tb} onClick={()=>setTab(tb)}
              style={{ background:tab===tb?"#111":"none",color:tab===tb?"#fff":"#888",border:"none",padding:"5px 11px",borderRadius:7,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>
              {tb==="guests"?`${t.guests} (${guests.length})`:`${t.tables} (${tables.length})`}
            </button>
          ))}
        </div>
      </div>
      {selectedSeat&&(
        <div style={{ background:"#fffbeb",borderBottom:"1px solid #fcd34d",padding:"6px 10px",fontSize:11,color:"#92400e",fontWeight:600,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <span>📍 {t.seatSelected}</span>
          <button onClick={()=>setSelectedSeat(null)} style={{ background:"none",border:"none",cursor:"pointer",color:"#d97706",fontSize:13,fontWeight:700,padding:0 }}>✕</button>
        </div>
      )}
      {tab==="guests"
        ?<GuestPanel guests={guests} groups={groups} assignments={assignments} searchQ={searchQ} setSearchQ={setSearchQ}
            filtered={filtered} editGuest={editGuest} setEditGuest={setEditGuest}
            dispatch={dispatch} setDragGuest={setDragGuest} dragGuest={dragGuest} getGC={getGC}
            setShowGroups={setShowGroups} selectedSeat={selectedSeat} onGuestClick={handleGuestClickForSeat}
            highlightedGuest={highlightedGuest} setHighlightedGuest={setHighlightedGuest}
            highlightedTable={highlightedTable} setHighlightedTable={setHighlightedTable}
            tables={tables} t={t}/>
        :<TablePanel tables={tables} addTable={addTable} editTable={editTable} setEditTable={setEditTable}
            dispatch={dispatch} assignments={assignments} groups={groups} getGC={getGC}
            highlightedTable={highlightedTable} setHighlightedTable={setHighlightedTable} t={t}/>
      }
    </div>
  );

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif",display:"flex",flexDirection:"column",height:"100svh",overflow:"hidden",background:"#e8e8e8" }}>
      <Head><link rel="stylesheet" href={FONT_URL}/></Head>
      <style>{`
        *{box-sizing:border-box;}
        input,select,textarea{font-family:'DM Sans',sans-serif;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:#ddd;border-radius:999px;}
        .ib{background:none;border:1px solid #e5e5e5;border-radius:7px;padding:4px 8px;cursor:pointer;font-size:11px;color:#555;transition:all .15s;display:inline-flex;align-items:center;gap:3px;font-family:'DM Sans',sans-serif;font-weight:500;white-space:nowrap;}
        .ib:hover{background:#f5f5f5;border-color:#bbb;}
        .ib:disabled{opacity:.4;cursor:default;}
        .gr{display:flex;align-items:center;gap:6px;padding:5px 7px;border-radius:8px;transition:background .12s;margin-bottom:2px;}
        .gr:hover{background:#f5f5f5;}
      `}</style>

      {/* TOP BAR */}
      <div style={{ background:"#fff",borderBottom:"1px solid #eee",padding:"0 8px",height:46,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,zIndex:20,gap:4 }}>
        <div style={{ display:"flex",alignItems:"center",gap:5,minWidth:0,overflow:"hidden" }}>
          <button onClick={()=>{setLeaveTarget("landing");setShowLeaveConfirm(true);}} style={{ background:"none",border:"none",cursor:"pointer",color:"#aaa",fontSize:14,fontFamily:"'DM Sans',sans-serif",flexShrink:0 }}>←</button>
          <span style={{ fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700,color:"#111",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:isMobile?80:200 }}>{event.name||"Untitled"}</span>
          {!isMobile&&<div style={{ background:"#f5f5f5",border:"1px solid #e5e5e5",borderRadius:999,padding:"2px 7px",fontSize:10,color:"#555",fontWeight:500,whiteSpace:"nowrap",flexShrink:0 }}>
            {guests.length} {t.guests} · {assignedCount} {t.assigned}
            {unseatedCount>0&&<span style={{ color:"#d97706" }}> · {unseatedCount} {t.unassigned}</span>}
          </div>}
        </div>
        <div style={{ display:"flex",gap:3,alignItems:"center",flexShrink:0 }}>
          {!isMobile&&<LangToggle lang={lang} dispatch={dispatch}/>}
          <button className="ib" onClick={doUndo} disabled={!past||past.length===0} title={`${t.undo} (Ctrl+Z)`}>↩</button>
          <button className="ib" onClick={doRedo} disabled={!future||future.length===0} title={`${t.redo} (Ctrl+Y)`}>↪</button>
          <button className="ib" onClick={()=>setShowClearModal(true)} title={t.clearAll} style={{ color:"#ef4444",borderColor:"#fca5a5" }}>🗑</button>
          {!isMobile&&<>
            <label className="ib" style={{ cursor:"pointer" }}>📂<input type="file" accept=".seatflow,.json" onChange={importProject} style={{ display:"none" }}/></label>
            <button className="ib" onClick={exportProject}>💾</button>
          </>}
          <button className="ib" onClick={()=>setShowAutoCreateInfo(true)} style={{ background:"#f0fdf4",borderColor:"#86efac",color:"#15803d" }}>🏗️{!isMobile&&` ${t.autoCreate}`}</button>
          <button className="ib" onClick={()=>setShowAutoArrangeInfo(true)} style={{ background:"#f5f3ff",borderColor:"#c4b5fd",color:"#7c3aed" }}>✨{!isMobile&&` ${t.autoArrange}`}</button>
          <button onClick={()=>setShowExport(true)} style={{ background:"#111",color:"#fff",border:"none",padding:"6px 10px",borderRadius:7,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>{isMobile?"↑":t.export}</button>
          {!isMobile&&<button onClick={()=>setSideOpen(p=>!p)} className="ib" style={{ padding:"4px 7px" }}>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><rect y="0" width="16" height="2" rx="1" fill="currentColor"/><rect y="5" width="16" height="2" rx="1" fill="currentColor"/><rect y="10" width="16" height="2" rx="1" fill="currentColor"/></svg>
          </button>}
        </div>
      </div>

      <div style={{ flex:1,display:"flex",overflow:"hidden",position:"relative" }}>
        {!isMobile&&(
          <AnimatePresence>
            {sideOpen&&(
              <motion.div initial={{width:0,opacity:0}} animate={{width:262,opacity:1}} exit={{width:0,opacity:0}} transition={{duration:.18}}
                style={{ background:"#fff",borderRight:"1px solid #eee",flexShrink:0,overflow:"hidden" }}>
                {sidebarContent}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        <FloorCanvas
          tables={tables} guests={guests} groups={groups} assignments={assignments}
          dispatch={dispatch} dragGuest={dragGuest} setDragGuest={setDragGuest}
          handleSeatDrop={handleSeatDrop} handleSeatClick={handleSeatClick}
          selectedSeat={selectedSeat} setSelectedSeat={setSelectedSeat}
          expandedTable={expandedTable} setExpandedTable={setExpandedTable}
          handleTableClick={handleTableClick}
          highlightedGuest={highlightedGuest}
          highlightedTable={highlightedTable}
          getGC={getGC} getGuestAtSeat={getGuestAtSeat}
          canvasWrapRef={canvasWrapRef} isMobile={isMobile}
          unseatedCount={unseatedCount} assignedCount={assignedCount}
          bgStyle={bgStyle||"dots"} dispatch_={dispatch} t={t}
          undoToast={undoToast}
        />

        {/* MOBILE: vertical left-side buttons */}
        {isMobile&&(
          <div style={{ position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",display:"flex",flexDirection:"column",gap:8,zIndex:30 }}>
            {[
              {label:"👥",sheet:"guests"},
              {label:"🪑",sheet:"tables"},
              {label:"💾",action:exportProject},
              {label:"🌐",action:()=>dispatch({type:"SET_LANG",payload:lang==="de"?"en":"de"})},
            ].map(btn=>(
              <button key={btn.label}
                onClick={btn.action||(()=>setMobileSheet(mobileSheet===btn.sheet?null:btn.sheet))}
                style={{ background:"#fff",border:"1px solid #e0e0e0",borderRadius:12,width:44,height:44,fontSize:18,cursor:"pointer",boxShadow:"0 4px 14px rgba(0,0,0,.12)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                {btn.label}
              </button>
            ))}
          </div>
        )}

        <AnimatePresence>
          {isMobile&&mobileSheet&&(
            <>
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                style={{ position:"absolute",inset:0,background:"rgba(0,0,0,.3)",zIndex:39 }} onClick={()=>setMobileSheet(null)}/>
              <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}} transition={{type:"spring",damping:30,stiffness:300}}
                style={{ position:"absolute",bottom:0,left:0,right:0,background:"#fff",borderRadius:"16px 16px 0 0",zIndex:40,height:"66vh",display:"flex",flexDirection:"column",overflow:"hidden" }}>
                <div style={{ padding:"8px 14px",borderBottom:"1px solid #f0f0f0",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                  <span style={{ fontWeight:600,fontSize:13 }}>{mobileSheet==="guests"?t.guests:t.tables}</span>
                  <button onClick={()=>setMobileSheet(null)} style={{ background:"none",border:"none",fontSize:18,cursor:"pointer",color:"#aaa" }}>×</button>
                </div>
                <div style={{ flex:1,overflow:"hidden" }}>
                  {mobileSheet==="guests"
                    ?<GuestPanel guests={guests} groups={groups} assignments={assignments} searchQ={searchQ} setSearchQ={setSearchQ}
                        filtered={filtered} editGuest={editGuest} setEditGuest={setEditGuest}
                        dispatch={dispatch} setDragGuest={()=>{}} dragGuest={null} getGC={getGC}
                        setShowGroups={setShowGroups} selectedSeat={selectedSeat} onGuestClick={handleGuestClickForSeat}
                        highlightedGuest={null} setHighlightedGuest={()=>{}}
                        highlightedTable={null} setHighlightedTable={()=>{}} tables={tables} t={t}/>
                    :<TablePanel tables={tables} addTable={addTable} editTable={editTable} setEditTable={setEditTable}
                        dispatch={dispatch} assignments={assignments} groups={groups} getGC={getGC}
                        highlightedTable={null} setHighlightedTable={()=>{}} t={t}/>
                  }
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showExport&&<ExportModal onClose={()=>setShowExport(false)} state={state} canvasWrapRef={canvasWrapRef} t={t} bgStyle={bgStyle||"dots"}/>}
      </AnimatePresence>
      <AnimatePresence>
        {showGroups&&<GroupModal groups={groups} guests={guests} dispatch={dispatch} onClose={()=>setShowGroups(false)} getGC={getGC} t={t}/>}
      </AnimatePresence>
      <AnimatePresence>
        {showAutoCreateInfo&&<AutoCreateModal t={t} lang={lang} dispatch={dispatch} onClose={()=>setShowAutoCreateInfo(false)}/>}
      </AnimatePresence>
      <AnimatePresence>
        {showAutoArrangeInfo&&<InfoModal icon="✨" title={t.autoArrangeTitle} desc={t.autoArrangeDesc} confirm={t.autoArrange} onClose={()=>setShowAutoArrangeInfo(false)} onConfirm={()=>{dispatch({type:"AUTO_ARRANGE"});setShowAutoArrangeInfo(false);}}/>}
      </AnimatePresence>
      <AnimatePresence>
        {showLeaveConfirm&&<ConfirmModal title={t.leaveTitle} desc={t.leaveDesc} confirm={t.leave} cancel={t.stay} onConfirm={()=>{setShowLeaveConfirm(false);dispatch({type:"SET_VIEW",payload:leaveTarget});}} onClose={()=>setShowLeaveConfirm(false)}/>}
      </AnimatePresence>
      <AnimatePresence>
        {showClearModal&&<ClearModal t={t} onClose={()=>setShowClearModal(false)} dispatch={dispatch}/>}
      </AnimatePresence>
    </div>
  );
}

// ─── GUEST PANEL ───────────────────────────────────────────────────────────
function GuestPanel({ guests,groups,assignments,searchQ,setSearchQ,filtered,editGuest,setEditGuest,dispatch,setDragGuest,dragGuest,getGC,setShowGroups,selectedSeat,onGuestClick,highlightedGuest,setHighlightedGuest,highlightedTable,setHighlightedTable,tables,t }) {
  const [newName,setNewName]=useState("");
  const [showBulkModal,setShowBulkModal]=useState(false);
  const [bulkText,setBulkText]=useState("");
  const [bulkGroupByLastName,setBulkGroupByLastName]=useState(false);
  const [collapsedGroups,setCollapsedGroups]=useState({});
  const assignedIds=new Set(Object.values(assignments));

  function add(){if(!newName.trim())return;dispatch({type:"ADD_GUEST",payload:newName.trim()});setNewName("");}

  function doBulkImport(){
    const names=bulkText.split("\n").map(l=>l.trim()).filter(Boolean);
    if(names.length===0)return;
    dispatch({type:"BULK_ADD_GUESTS",names,groupId:null});
    if(bulkGroupByLastName) dispatch({type:"GROUP_BY_LASTNAME"});
    setBulkText("");setShowBulkModal(false);
  }

  function toggleGroup(gid){
    setCollapsedGroups(p=>({...p,[gid]:!p[gid]}));
  }

  // Build display: grouped sections + ungrouped
  const isSearching=searchQ.trim().length>0;

  // When searching, show flat filtered list
  const ungrouped=filtered.filter(g=>!g.groupId);
  const groupedMap={};
  filtered.filter(g=>g.groupId).forEach(g=>{
    if(!groupedMap[g.groupId])groupedMap[g.groupId]=[];
    groupedMap[g.groupId].push(g);
  });

  function renderGuest(g){
    const seated=assignedIds.has(g.id);
    const gc=getGC(g.groupId);
    const clickable=!!selectedSeat;
    return (
      <div key={g.id} className="gr"
        draggable={!selectedSeat}
        onDragStart={()=>!selectedSeat&&setDragGuest(g)}
        onDragEnd={()=>setDragGuest(null)}
        onClick={()=>clickable&&onGuestClick(g)}
        onMouseEnter={()=>setHighlightedGuest&&setHighlightedGuest(g.id)}
        onMouseLeave={()=>setHighlightedGuest&&setHighlightedGuest(null)}
        style={{ cursor:clickable?"pointer":"grab",background:highlightedGuest===g.id?"#eff6ff":clickable?"#fffbeb":undefined,outline:clickable?"2px dashed #fcd34d":"none",outlineOffset:1,transition:"background .1s" }}>
        <div style={{ width:6,height:6,borderRadius:"50%",background:gc?.dot||"#e0e0e0",flexShrink:0 }}/>
        {editGuest===g.id
          ?<input autoFocus defaultValue={g.name}
              onBlur={e=>{dispatch({type:"UPDATE_GUEST",id:g.id,payload:{name:e.target.value}});setEditGuest(null);}}
              onKeyDown={e=>e.key==="Enter"&&e.target.blur()}
              style={{ flex:1,border:"1px solid #c4b5fd",borderRadius:4,padding:"1px 5px",fontSize:12,outline:"none" }}/>
          :<span style={{ flex:1,fontSize:12,color:"#333",fontWeight:500 }} onDoubleClick={()=>setEditGuest(g.id)}>{g.name}</span>
        }
        {seated&&<span style={{ fontSize:9,color:"#16a34a",fontWeight:700,background:"#f0fdf4",padding:"1px 5px",borderRadius:999,flexShrink:0 }}>✓</span>}
        <select value={g.groupId||""} onChange={e=>{
          const newGid=e.target.value||null;
          dispatch({type:"UPDATE_GUEST",id:g.id,payload:{groupId:newGid}});
        }}
          style={{ border:"none",background:"none",fontSize:10,color:"#bbb",cursor:"pointer",maxWidth:62,flexShrink:0 }}>
          <option value="">{t.noGroup}</option>
          {groups.map(grp=><option key={grp.id} value={grp.id}>{grp.name}</option>)}
        </select>
        <button onClick={e=>{e.stopPropagation();dispatch({type:"DELETE_GUEST",id:g.id});}} style={{ background:"none",border:"none",cursor:"pointer",color:"#ddd",fontSize:13,padding:"0 2px",flexShrink:0 }}>×</button>
      </div>
    );
  }

  return (
    <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden",height:"100%" }}>
      {/* Search */}
      <div style={{ padding:"7px 9px 4px",flexShrink:0 }}>
        <input placeholder={t.searchGuests} value={searchQ} onChange={e=>setSearchQ(e.target.value)}
          style={{ width:"100%",padding:"6px 10px",border:"1.5px solid #e5e5e5",borderRadius:8,fontSize:12,outline:"none",background:"#fafafa" }}/>
      </div>
      {/* Group chips */}
      <div style={{ padding:"2px 9px 4px",display:"flex",gap:4,flexWrap:"wrap",flexShrink:0 }}>
        <button onClick={()=>setShowGroups(true)} style={{ background:"#f5f5f5",border:"1px solid #e5e5e5",borderRadius:6,padding:"2px 8px",fontSize:11,cursor:"pointer",color:"#555",fontWeight:500,fontFamily:"'DM Sans',sans-serif" }}>+ {t.group}</button>
        {groups.map(g=>{const gc2=getGC(g.id);return(
          <div key={g.id} style={{ background:gc2?.bg,border:`1px solid ${gc2?.border}`,borderRadius:6,padding:"2px 8px",fontSize:11,color:"#333",fontWeight:500,display:"flex",alignItems:"center",gap:3,cursor:"pointer" }}
            onClick={()=>toggleGroup(g.id)}>
            <div style={{ width:5,height:5,borderRadius:"50%",background:gc2?.dot }}/>
            {g.name}
            <span style={{ fontSize:9,color:gc2?.dot,marginLeft:2 }}>{collapsedGroups[g.id]?"▶":"▼"}</span>
          </div>
        );})}
      </div>

      {/* Bulk Import Modal */}
      <AnimatePresence>
        {showBulkModal&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:150,backdropFilter:"blur(4px)" }}
            onClick={e=>e.target===e.currentTarget&&setShowBulkModal(false)}>
            <motion.div initial={{scale:.95,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:.95,opacity:0}}
              style={{ background:"#fff",borderRadius:18,padding:"24px",maxWidth:420,width:"92%",boxShadow:"0 24px 60px rgba(0,0,0,.2)" }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,marginBottom:6 }}>{t.bulkImportTitle}</h3>
              <p style={{ fontSize:12,color:"#888",marginBottom:12,lineHeight:1.6 }}>{t.bulkImportDesc}</p>
              <textarea value={bulkText} onChange={e=>setBulkText(e.target.value)}
                placeholder={t.bulkImportPlaceholder}
                style={{ width:"100%",height:140,padding:"8px 10px",border:"1.5px solid #e0e0e0",borderRadius:10,fontSize:12,outline:"none",resize:"vertical",fontFamily:"'DM Sans',sans-serif",lineHeight:1.6 }}/>
              <div style={{ display:"flex",alignItems:"center",gap:8,margin:"10px 0" }}>
                <input type="checkbox" id="bulk-ln" checked={bulkGroupByLastName} onChange={e=>setBulkGroupByLastName(e.target.checked)}
                  style={{ width:15,height:15,cursor:"pointer" }}/>
                <label htmlFor="bulk-ln" style={{ fontSize:12,color:"#555",cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>
                  {t.groupByLastName}
                </label>
              </div>
              <p style={{ fontSize:11,color:"#aaa",marginBottom:14 }}>
                {bulkText.split("\n").filter(l=>l.trim()).length} {t.lang==="de"?"Gäste erkannt":"guests detected"}
              </p>
              <div style={{ display:"flex",gap:8 }}>
                <button onClick={doBulkImport}
                  style={{ flex:1,background:"#111",color:"#fff",border:"none",borderRadius:9,padding:"10px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>
                  ⬆ {t.bulkImportBtn}
                </button>
                <button onClick={()=>{setShowBulkModal(false);setBulkText("");}}
                  style={{ background:"#f5f5f5",border:"1px solid #e0e0e0",borderRadius:9,padding:"10px 16px",fontSize:13,cursor:"pointer",color:"#555" }}>
                  {t.cancel}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guest list */}
      <div style={{ flex:1,overflowY:"auto",padding:"0 5px 3px" }}>
        {filtered.length===0&&<div style={{ textAlign:"center",padding:16,color:"#ccc",fontSize:12 }}>{t.noGuests}</div>}

        {isSearching
          ? filtered.map(g=>renderGuest(g))
          : <>
              {/* Grouped sections */}
              {groups.map(g=>{
                const gc2=getGC(g.id);
                const members=groupedMap[g.id]||[];
                const allGuests=guests.filter(gs=>gs.groupId===g.id);
                if(allGuests.length===0&&members.length===0)return null;
                const collapsed=collapsedGroups[g.id];
                const seatedInGroup=allGuests.filter(gs=>assignedIds.has(gs.id)).length;
                return (
                  <div key={g.id} style={{ marginBottom:4 }}>
                    {/* Group header row */}
                    <div onClick={()=>toggleGroup(g.id)}
                      style={{ display:"flex",alignItems:"center",gap:6,padding:"5px 8px",borderRadius:8,cursor:"pointer",background:gc2?.bg||"#f8f8f8",border:`1px solid ${gc2?.border||"#eee"}`,marginBottom:collapsed?0:2 }}>
                      <div style={{ width:8,height:8,borderRadius:"50%",background:gc2?.dot||"#ccc",flexShrink:0 }}/>
                      <span style={{ flex:1,fontSize:12,fontWeight:700,color:gc2?.dot||"#333" }}>{g.name}</span>
                      <span style={{ fontSize:10,color:gc2?.dot||"#aaa",opacity:.8 }}>{seatedInGroup}/{allGuests.length}</span>
                      <span style={{ fontSize:9,color:gc2?.dot||"#aaa",marginLeft:2 }}>{collapsed?"▶":"▼"}</span>
                    </div>
                    {!collapsed&&members.map(g2=>renderGuest(g2))}
                  </div>
                );
              })}
              {/* Ungrouped */}
              {ungrouped.map(g=>renderGuest(g))}
            </>
        }
      </div>

      {/* Add row */}
      <div style={{ padding:"5px 9px 11px",borderTop:"1px solid #f0f0f0",flexShrink:0 }}>
        <div style={{ display:"flex",gap:4 }}>
          <input placeholder={t.addGuest} value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()}
            style={{ flex:1,padding:"6px 9px",border:"1.5px solid #e0e0e0",borderRadius:8,fontSize:12,outline:"none" }}/>
          <button onClick={add} style={{ background:"#111",color:"#fff",border:"none",borderRadius:8,padding:"6px 11px",cursor:"pointer",fontSize:13,fontWeight:700 }}>+</button>
          <button onClick={()=>setShowBulkModal(true)} title={t.bulkImport}
            style={{ background:"#f0f9ff",color:"#0284c7",border:"1px solid #7dd3fc",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:13,fontWeight:700 }}>
            ⬆
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── TABLE PANEL ───────────────────────────────────────────────────────────
function TablePanel({ tables,addTable,editTable,setEditTable,dispatch,assignments,groups,getGC,highlightedTable,setHighlightedTable,t }) {
  return (
    <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden",height:"100%" }}>
      <div style={{ padding:"7px 9px 5px",flexShrink:0 }}>
        <p style={{ fontSize:10,color:"#bbb",fontWeight:600,marginBottom:5,textTransform:"uppercase",letterSpacing:.8 }}>{t.addElement}</p>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:4 }}>
          {[
            {type:"round",l:`⭕ ${t.round}`},{type:"rect",l:`⬜ ${t.rectangle}`},
            {type:"banquet",l:`📏 ${t.banquet}`},{type:"cocktail",l:`🍸 ${t.cocktail}`},
            {type:"stage",l:`🎭 ${t.stage}`},{type:"buffet",l:`🍽️ ${t.buffet}`},
            {type:"bar",l:`🍹 ${t.bar}`},{type:"dj",l:`🎧 ${t.dj}`},
            {type:"dance",l:`💃 ${t.dance}`},{type:"entrance",l:`🚪 ${t.entrance}`},
          ].map(tb=>(
            <button key={tb.type} onClick={()=>addTable(tb.type)}
              style={{ background:"#f8f8f8",border:"1px solid #e8e8e8",borderRadius:8,padding:"6px 4px",fontSize:10,cursor:"pointer",fontWeight:500,color:"#333",fontFamily:"'DM Sans',sans-serif" }}>
              {tb.l}
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex:1,overflowY:"auto",padding:"0 5px 5px" }}>
        {tables.length===0&&<div style={{ textAlign:"center",padding:16,color:"#ccc",fontSize:12 }}>{t.noTables}</div>}
        {tables.map(tb=>{
          const seatedN=Object.keys(assignments).filter(k=>k.startsWith(tb.id+"-")).length;
          const isDecor=isNoSeatType(tb.type);
          const gc=getGC(tb.groupId);
          const isHL=highlightedTable===tb.id;
          return (
            <div key={tb.id}
              onMouseEnter={()=>setHighlightedTable(tb.id)}
              onMouseLeave={()=>setHighlightedTable(null)}
              style={{ padding:"7px 8px",borderRadius:9,border:`1.5px solid ${isHL?"#7dd3fc":gc?gc.border:"#eee"}`,marginBottom:4,background:isHL?"#f0f9ff":gc?gc.bg:"#fff",transition:"all .15s",cursor:"default" }}>
              <div style={{ display:"flex",alignItems:"center",gap:5 }}>
                <span style={{ fontSize:12 }}>{{round:"⭕",rect:"⬜",banquet:"📏",cocktail:"🍸",stage:"🎭",buffet:"🍽️",bar:"🍹",dj:"🎧",dance:"💃",entrance:"🚪"}[tb.type]||"🪑"}</span>
                {editTable===tb.id
                  ?<input autoFocus defaultValue={tb.name}
                      onBlur={e=>{dispatch({type:"UPDATE_TABLE_HISTORY",id:tb.id,payload:{name:e.target.value}});setEditTable(null);}}
                      onKeyDown={e=>e.key==="Enter"&&e.target.blur()}
                      style={{ flex:1,border:"1px solid #c4b5fd",borderRadius:4,padding:"2px 5px",fontSize:12,outline:"none" }}/>
                  :<span style={{ flex:1,fontSize:12,fontWeight:600,color:"#111",cursor:"pointer" }} onDoubleClick={()=>setEditTable(tb.id)}>{tb.name}</span>
                }
                <button onClick={()=>dispatch({type:"DELETE_TABLE",id:tb.id})} style={{ background:"none",border:"none",cursor:"pointer",color:"#ddd",fontSize:14 }}>×</button>
              </div>
              <div style={{ marginTop:4,display:"flex",alignItems:"center",gap:4 }}>
                <span style={{ fontSize:10,color:"#bbb" }}>{t.group}:</span>
                <select value={tb.groupId||""} onChange={e=>{
                  const gid=e.target.value||null;
                  const grp=groups.find(g=>g.id===gid);
                  dispatch({type:"UPDATE_TABLE_HISTORY",id:tb.id,payload:{groupId:gid,name:grp?grp.name:tb.name}});
                }} style={{ flex:1,border:"1px solid #e5e5e5",borderRadius:5,padding:"2px 4px",fontSize:10,outline:"none",background:"#fff",fontFamily:"'DM Sans',sans-serif" }}>
                  <option value="">{t.noGroup}</option>
                  {groups.map(grp=><option key={grp.id} value={grp.id}>{grp.name}</option>)}
                </select>
              </div>
              {!isDecor&&(
                <div style={{ display:"flex",alignItems:"center",gap:4,marginTop:3 }}>
                  <span style={{ fontSize:10,color:"#bbb" }}>{t.seats}</span>
                  <input type="number" min={0} max={50} value={tb.seats}
                    onChange={e=>dispatch({type:"UPDATE_TABLE",id:tb.id,payload:{seats:Math.max(0,parseInt(e.target.value)||0)}})}
                    style={{ width:36,border:"1px solid #e5e5e5",borderRadius:5,padding:"2px 4px",fontSize:11,textAlign:"center",outline:"none" }}/>
                  <span style={{ fontSize:10,color:seatedN===tb.seats&&tb.seats>0?"#16a34a":"#bbb",marginLeft:"auto" }}>{seatedN}/{tb.seats}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── FLOOR CANVAS ──────────────────────────────────────────────────────────
function FloorCanvas({ tables,guests,groups,assignments,dispatch,dragGuest,setDragGuest,handleSeatDrop,handleSeatClick,selectedSeat,setSelectedSeat,expandedTable,setExpandedTable,handleTableClick,highlightedGuest,highlightedTable,getGC,getGuestAtSeat,canvasWrapRef,isMobile,unseatedCount,assignedCount,bgStyle,dispatch_,t,undoToast }) {
  const [selectedTable,setSelectedTable]=useState(null);
  const [selectedTables,setSelectedTables]=useState(new Set()); // multi-select
  const [marquee,setMarquee]=useState(null); // {x1,y1,x2,y2} for selection rect
  const [marqueeStart,setMarqueeStart]=useState(null);
  const [multiDragStart,setMultiDragStart]=useState(null); // {cx,cy, snaps:{id:{x,y}}}
  const overPopupRef=useRef(false);
  const lastPinchDist=useRef(null);
  const longPressTimer=useRef(null);
  const touchDragTable=useRef(null);   // {id, origX, origY, startCX, startCY}
  const touchMoveMode=useRef(null);    // tableId currently in move mode
  const [activeTouchMove,setActiveTouchMove]=useState(null); // tableId for toolbar move btn
  const [pan,setPan]=useState({x:80,y:60});
  const [zoom,setZoom]=useState(1);
  const [panning,setPanning]=useState(false);
  const [panStart,setPanStart]=useState(null);
  const [draggingTable,setDraggingTable]=useState(null);
  const [dragOff,setDragOff]=useState({x:0,y:0});
  const [resizingTable,setResizingTable]=useState(null);
  const [resizeStart,setResizeStart]=useState(null);
  const [hoveredSeat,setHoveredSeat]=useState(null);
  const containerRef=useRef(null);
  const innerRef=useRef(null);

  useEffect(()=>{if(canvasWrapRef)canvasWrapRef.current=innerRef.current;});

  const c2c=useCallback((cx,cy)=>{
    const r=containerRef.current?.getBoundingClientRect();
    if(!r)return{x:0,y:0};
    return{x:(cx-r.left-pan.x)/zoom,y:(cy-r.top-pan.y)/zoom};
  },[pan,zoom]);

  function onWheel(e){
    if(overPopupRef.current)return;
    e.preventDefault();
    const d=e.deltaY>0?.88:1.12;
    setZoom(z=>Math.min(4,Math.max(0.2,z*d)));
  }

  function onMouseDown(e){
    if(e.button===1||(e.button===0&&e.altKey)){
      setPanning(true);setPanStart({x:e.clientX-pan.x,y:e.clientY-pan.y});e.preventDefault();
      return;
    }
    if(e.target===containerRef.current||e.target===innerRef.current){
      setExpandedTable(null);setSelectedSeat(null);setSelectedTable(null);
      // Start marquee selection
      const r=containerRef.current.getBoundingClientRect();
      const mx=(e.clientX-r.left);const my=(e.clientY-r.top);
      setMarqueeStart({sx:mx,sy:my,ex:mx,ey:my});
      setSelectedTables(new Set());
    }
  }
  function onMouseMove(e){
    if(panning&&panStart){setPan({x:e.clientX-panStart.x,y:e.clientY-panStart.y});return;}
    if(draggingTable){
      const p=c2c(e.clientX,e.clientY);
      // If dragging a table that is in multi-select, move all selected
      if(selectedTables.has(draggingTable)&&selectedTables.size>1&&multiDragStart){
        const dx=(p.x-dragOff.x)-(multiDragStart.snaps[draggingTable]?.x||0);
        const dy=(p.y-dragOff.y)-(multiDragStart.snaps[draggingTable]?.y||0);
        selectedTables.forEach(tid=>{
          const snap=multiDragStart.snaps[tid];
          if(snap) dispatch({type:"UPDATE_TABLE",id:tid,payload:{x:Math.max(0,snap.x+dx+(tid===draggingTable?0:0)),y:Math.max(0,snap.y+dy)}});
        });
      } else {
        dispatch({type:"UPDATE_TABLE",id:draggingTable,payload:{x:Math.max(0,p.x-dragOff.x),y:Math.max(0,p.y-dragOff.y)}});
      }
    }
    if(resizingTable&&resizeStart){
      const p=c2c(e.clientX,e.clientY);
      dispatch({type:"UPDATE_TABLE",id:resizingTable,payload:{w:Math.max(60,resizeStart.w+(p.x-resizeStart.cx)),h:Math.max(40,resizeStart.h+(p.y-resizeStart.cy))}});
    }
    if(marqueeStart){
      const r=containerRef.current.getBoundingClientRect();
      const ex=e.clientX-r.left;const ey=e.clientY-r.top;
      setMarqueeStart(p=>({...p,ex,ey}));
      // Select tables within marquee
      const x1=Math.min(marqueeStart.sx,ex)/zoom-pan.x/zoom;
      const y1=Math.min(marqueeStart.sy,ey)/zoom-pan.y/zoom;
      const x2=Math.max(marqueeStart.sx,ex)/zoom-pan.x/zoom;
      const y2=Math.max(marqueeStart.sy,ey)/zoom-pan.y/zoom;
      const sel=new Set();
      tables.forEach(tb=>{
        const def=tableDefaultSize(tb.type);
        const tw=tb.w||def.w;const th=tb.h||def.h;
        if(tb.x+tw>x1&&tb.x<x2&&tb.y+th>y1&&tb.y<y2) sel.add(tb.id);
      });
      setSelectedTables(sel);
    }
  }
  function onMouseUp(){
    if(draggingTable)dispatch({type:"UPDATE_TABLE_HISTORY",id:draggingTable,payload:{}});
    if(resizingTable)dispatch({type:"UPDATE_TABLE_HISTORY",id:resizingTable,payload:{}});
    setPanning(false);setPanStart(null);setDraggingTable(null);setResizingTable(null);setResizeStart(null);
    setMarqueeStart(null);setMultiDragStart(null);
  }

  function startTableDrag(e,tableId){
    e.stopPropagation();if(dragGuest)return;
    const tb=tables.find(t=>t.id===tableId);if(!tb)return;
    const p=c2c(e.clientX,e.clientY);
    setDraggingTable(tableId);setDragOff({x:p.x-tb.x,y:p.y-tb.y});
    // If this table is in multi-select, record snap positions for all
    if(selectedTables.has(tableId)&&selectedTables.size>1){
      const snaps={};
      tables.forEach(t=>{if(selectedTables.has(t.id))snaps[t.id]={x:t.x,y:t.y};});
      setMultiDragStart({snaps});
    }
  }
  function startResize(e,tableId){
    e.stopPropagation();e.preventDefault();
    const tb=tables.find(t=>t.id===tableId);if(!tb)return;
    const p=c2c(e.clientX,e.clientY);
    const def=tableDefaultSize(tb.type);
    setResizingTable(tableId);setResizeStart({cx:p.x,cy:p.y,w:tb.w||def.w,h:tb.h||def.h});
  }

  function onTouchStart(e){
    if(e.touches.length===1){
      const t=e.touches[0];
      lastPinchDist.current=null;
      // If a drag was already started by the Move button, just continue
      if(touchDragTable.current) return;
      // If move mode is active but no drag started yet, init drag now
      if(touchMoveMode.current){
        const r=containerRef.current?.getBoundingClientRect();
        const tb=tables.find(t2=>t2.id===touchMoveMode.current);
        if(r&&tb){
          touchDragTable.current={
            id:touchMoveMode.current,
            origX:tb.x, origY:tb.y,
            startCX:(t.clientX-r.left-pan.x)/zoom,
            startCY:(t.clientY-r.top-pan.y)/zoom,
          };
        }
        return;
      }
      // Normal canvas pan
      setPanning(true);
      setPanStart({x:t.clientX-pan.x, y:t.clientY-pan.y});
    } else if(e.touches.length===2){
      clearTimeout(longPressTimer.current);
      touchDragTable.current=null;
      setPanning(false);
      const d=Math.hypot(
        e.touches[0].clientX-e.touches[1].clientX,
        e.touches[0].clientY-e.touches[1].clientY
      );
      lastPinchDist.current=d;
    }
  }
  function onTouchMove(e){
    e.preventDefault();
    if(e.touches.length===1){
      const t=e.touches[0];
      if(touchDragTable.current){
        const r=containerRef.current.getBoundingClientRect();
        const cx=(t.clientX-r.left-pan.x)/zoom;
        const cy2=(t.clientY-r.top-pan.y)/zoom;
        const dx=cx-touchDragTable.current.startCX;
        const dy=cy2-touchDragTable.current.startCY;
        dispatch({type:"UPDATE_TABLE",id:touchDragTable.current.id,payload:{
          x:Math.max(0,touchDragTable.current.origX+dx),
          y:Math.max(0,touchDragTable.current.origY+dy),
        }});
        return;
      }
      if(panning&&panStart){
        setPan({x:t.clientX-panStart.x, y:t.clientY-panStart.y});
      }
    } else if(e.touches.length===2){
      const d=Math.hypot(
        e.touches[0].clientX-e.touches[1].clientX,
        e.touches[0].clientY-e.touches[1].clientY
      );
      if(lastPinchDist.current){
        const ratio=d/lastPinchDist.current;
        setZoom(z=>Math.min(4,Math.max(0.2,z*ratio)));
      }
      lastPinchDist.current=d;
    }
  }
  function onTouchEnd(){
    clearTimeout(longPressTimer.current);
    if(touchDragTable.current){
      dispatch({type:"UPDATE_TABLE_HISTORY",id:touchDragTable.current.id,payload:{}});
      touchDragTable.current=null;
      // Clear move mode so next touch pans canvas normally
      touchMoveMode.current=null;
      setActiveTouchMove(null);
    }
    setPanning(false);
    setPanStart(null);
    lastPinchDist.current=null;
  }
  // Called from toolbar "Move" button with the initial touch point
  // Immediately starts dragging the table — no second tap needed
  function startTouchMove(tableId, initialTouch){
    const tb=tables.find(t=>t.id===tableId);
    if(!tb) return;
    touchMoveMode.current=tableId;
    setActiveTouchMove(tableId);
    if(navigator.vibrate) navigator.vibrate(20);
    if(initialTouch){
      const r=containerRef.current?.getBoundingClientRect();
      if(r){
        const cx=(initialTouch.clientX-r.left-pan.x)/zoom;
        const cy2=(initialTouch.clientY-r.top-pan.y)/zoom;
        touchDragTable.current={
          id:tableId,
          origX:tb.x, origY:tb.y,
          startCX:cx, startCY:cy2,
        };
      }
    }
  }

  // Background pattern CSS
  const bgPatterns={
    dots:`radial-gradient(circle,#c0c0c0 1px,transparent 1px)`,
    grid:`linear-gradient(#d0d0d0 1px,transparent 1px),linear-gradient(90deg,#d0d0d0 1px,transparent 1px)`,
    blank:"none",
  };

  return (
    <div ref={containerRef}
      style={{ flex:1,overflow:"hidden",position:"relative",background:"#e8e8e8",cursor:panning?"grabbing":draggingTable?"grabbing":"default",touchAction:"none",userSelect:"none" }}
      onWheel={onWheel} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>

      {/* Background grid/dots */}
      <div style={{ position:"absolute",inset:0,
        backgroundImage:bgPatterns[bgStyle||"dots"],
        backgroundSize:bgStyle==="grid"?`${24*zoom}px ${24*zoom}px`:`${24*zoom}px ${24*zoom}px`,
        backgroundPosition:`${pan.x}px ${pan.y}px`,pointerEvents:"none" }}/>

      {/* BG style picker + status overlay */}
      <div style={{ position:"absolute",top:10,right:10,zIndex:10,display:"flex",flexDirection:"column",gap:5,alignItems:"flex-end" }}>
        {unseatedCount>0&&(
          <div style={{ background:"#fff",border:"1px solid #fcd34d",borderRadius:8,padding:"4px 10px",fontSize:11,color:"#92400e",fontWeight:600,boxShadow:"0 2px 8px rgba(0,0,0,.07)" }}>
            ⚠️ {unseatedCount} {t.unseatedWarning}
          </div>
        )}
        {unseatedCount===0&&assignedCount>0&&(
          <div style={{ background:"#fff",border:"1px solid #bbf7d0",borderRadius:8,padding:"4px 10px",fontSize:11,color:"#16a34a",fontWeight:600,boxShadow:"0 2px 8px rgba(0,0,0,.07)" }}>
            ✅ {t.allSeated}
          </div>
        )}
        {/* BG picker */}
        <div style={{ background:"#fff",border:"1px solid #e5e5e5",borderRadius:9,padding:"4px 6px",display:"flex",gap:3,boxShadow:"0 2px 8px rgba(0,0,0,.07)" }}>
          {["dots","grid","blank"].map(s=>(
            <button key={s} onClick={()=>dispatch_({type:"SET_BG",payload:s})}
              style={{ padding:"3px 7px",borderRadius:6,border:"none",cursor:"pointer",fontSize:10,fontWeight:600,background:(bgStyle||"dots")===s?"#111":"transparent",color:(bgStyle||"dots")===s?"#fff":"#888",fontFamily:"'DM Sans',sans-serif" }}>
              {t[`bg${s.charAt(0).toUpperCase()+s.slice(1)}`]}
            </button>
          ))}
        </div>
      </div>

      {/* Undo/Redo toast */}
      <AnimatePresence>
        {undoToast&&(
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}}
            style={{ position:"absolute",bottom:isMobile?70:52,right:10,background:"#111",color:"#fff",borderRadius:8,padding:"5px 12px",fontSize:12,fontWeight:600,zIndex:20,pointerEvents:"none",boxShadow:"0 4px 12px rgba(0,0,0,.2)" }}>
            {undoToast==="undo"?t.undoToast:t.redoToast} ↩
          </motion.div>
        )}
      </AnimatePresence>

      {/* Marquee selection rectangle */}
      {marqueeStart&&Math.abs(marqueeStart.ex-marqueeStart.sx)>4&&(
        <div style={{ position:"absolute",pointerEvents:"none",zIndex:5,
          left:Math.min(marqueeStart.sx,marqueeStart.ex),
          top:Math.min(marqueeStart.sy,marqueeStart.ey),
          width:Math.abs(marqueeStart.ex-marqueeStart.sx),
          height:Math.abs(marqueeStart.ey-marqueeStart.sy),
          border:"1.5px dashed #3b82f6",background:"rgba(59,130,246,.06)",borderRadius:4 }}/>
      )}

      {/* Zoom controls */}
      <div style={{ position:"absolute",bottom:14,right:14,display:"flex",gap:3,zIndex:10 }}>
        {[{l:"+",a:()=>setZoom(z=>Math.min(4,z+.15))},{l:`${Math.round(zoom*100)}%`,a:()=>{setZoom(1);setPan({x:80,y:60});}},{l:"−",a:()=>setZoom(z=>Math.max(0.2,z-.15))},{l:"⊙",a:()=>{setZoom(1);setPan({x:80,y:60});}}].map(b=>(
          <button key={b.l} onClick={b.a}
            style={{ background:"#fff",border:"1px solid #ddd",borderRadius:7,width:b.l.includes("%")?42:28,height:28,cursor:"pointer",fontSize:b.l.includes("%")?10:14,fontWeight:700,boxShadow:"0 2px 6px rgba(0,0,0,.07)",fontFamily:"'DM Sans',sans-serif" }}>
            {b.l}
          </button>
        ))}
      </div>

      {tables.length===0&&(
        <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",pointerEvents:"none" }}>
          <div style={{ fontSize:36,marginBottom:9 }}>🪑</div>
          <p style={{ fontSize:14,color:"#aaa",fontWeight:500 }}>{t.noTables}</p>
          <p style={{ fontSize:11,color:"#bbb",marginTop:4 }}>Alt+drag {t.back.includes("←")?"":"to pan"} · Scroll to zoom</p>
        </div>
      )}

      <div ref={innerRef} style={{ transform:`translate(${pan.x}px,${pan.y}px) scale(${zoom})`,transformOrigin:"0 0",position:"absolute",willChange:"transform" }}>
        {tables.map(table=>(
          <TableElement key={table.id} table={table} assignments={assignments} guests={guests} groups={groups}
            getGC={getGC} getGuestAtSeat={getGuestAtSeat}
            dragGuest={dragGuest} hoveredSeat={hoveredSeat} setHoveredSeat={setHoveredSeat}
            handleSeatDrop={handleSeatDrop} handleSeatClick={handleSeatClick}
            selectedSeat={selectedSeat} dispatch={dispatch}
            isExpanded={expandedTable===table.id}
            isHighlighted={highlightedTable===table.id||selectedTables.has(table.id)}
            isMultiSelected={selectedTables.has(table.id)}
            highlightedGuest={highlightedGuest}
            selectedTable={selectedTable}
            onSelectTable={tid=>{setSelectedTable(prev=>prev===tid?null:tid);}}
            onTableClick={()=>handleTableClick(table.id)}
            isMobile={isMobile}
            activeTouchMove={activeTouchMove}
            onStartTouchMove={(touch)=>startTouchMove(table.id,touch)}
            onStartDrag={e=>startTableDrag(e,table.id)}
            onStartResize={e=>startResize(e,table.id)}
            onPopupEnter={()=>{overPopupRef.current=true;}}
            onPopupLeave={()=>{overPopupRef.current=false;}}/>
        ))}
      </div>
    </div>
  );
}

function tableDefaultSize(type){
  switch(type){
    case "banquet":  return{w:220,h:55};
    case "rect":     return{w:130,h:72};
    case "round":    return{w:100,h:100};
    case "cocktail": return{w:70, h:70};
    case "stage":    return{w:220,h:50};
    case "buffet":   return{w:180,h:48};
    case "bar":      return{w:150,h:48};
    case "dj":       return{w:90, h:55};
    case "dance":    return{w:190,h:110};
    case "entrance": return{w:90, h:38};
    default:         return{w:120,h:70};
  }
}

// ─── TABLE ELEMENT ─────────────────────────────────────────────────────────
// ─── TABLE ELEMENT ─────────────────────────────────────────────────────────
// selectedTable: the currently "active" table id (shows toolbar)
function TableElement({ table,assignments,guests,groups,getGC,getGuestAtSeat,dragGuest,hoveredSeat,setHoveredSeat,handleSeatDrop,handleSeatClick,selectedSeat,selectedTable,onSelectTable,dispatch,isExpanded,isHighlighted,isMultiSelected,highlightedGuest,isMobile,activeTouchMove,onStartTouchMove,onTableClick,onStartDrag,onStartResize,onPopupEnter,onPopupLeave }) {
  const{id,name,type,seats,x,y,groupId,rotation=0}=table;
  const isNoSeat=isNoSeatType(type);
  const isDecor=isDecorType(type);
  const isRound=type==="round"||type==="cocktail";
  const isBanquet=type==="banquet";
  const def=tableDefaultSize(type);
  const TW=Math.max(def.w*0.5,table.w||def.w);
  const TH=Math.max(def.h*0.5,table.h||def.h);
  const PAD=isRound?Math.max(TW/2+22,60):40;
  const svgW=TW+PAD*2;
  const svgH=TH+PAD*2;
  const ox=PAD,oy=PAD;
  const tgc=getGC(groupId);
  const isSelected=selectedTable===id;

  const decorBg={stage:"#1e1b4b",buffet:"#78350f",bar:"#1c3a1c",dj:"#1a1a2e",dance:"#1a0a2e",entrance:"#0f172a"};
  const decorFg={stage:"#a5b4fc",buffet:"#fde68a",bar:"#86efac",dj:"#c4b5fd",dance:"#f9a8d4",entrance:"#93c5fd"};
  const decorEmoji={stage:"🎭",buffet:"🍽️",bar:"🍹",dj:"🎧",dance:"💃",entrance:"🚪"};

  function getSeatPos(i,total){
    if(isRound){const r=TW/2+18;const a=(i/total)*Math.PI*2-Math.PI/2;return{cx:TW/2+r*Math.cos(a),cy:TH/2+r*Math.sin(a)};}
    if(isBanquet){const h=Math.ceil(total/2);const row=i<h?0:1;const col=i<h?i:i-h;const sp=(TW-28)/Math.max(h-1,1);return{cx:14+col*sp,cy:row===0?-16:TH+16};}
    const h=Math.ceil(total/2);const row=i<h?0:1;const col=i<h?i:i-h;const sp=(TW-24)/Math.max(h-1,1);return{cx:12+col*sp,cy:row===0?-16:TH+16};
  }

  const seatedGuests=!isNoSeat?Array.from({length:seats||0},(_,i)=>{
    const g=getGuestAtSeat(`${id}-${i}`);return g?{...g,seatIdx:i}:null;
  }).filter(Boolean):[];

  // ── Rotation via drag ──────────────────────────────────────────────────
  const [rotating,setRotating]=useState(false);
  const [rotStart,setRotStart]=useState(null);
  function startRotate(e){
    e.stopPropagation();e.preventDefault();
    setRotating(true);
    setRotStart({startAngle:rotation||0,mouseX:e.clientX});
  }
  useEffect(()=>{
    if(!rotating)return;
    function mm(e){
      if(!rotStart)return;
      const cx=e.clientX||e.touches?.[0]?.clientX||0;
      const dx=cx-rotStart.mouseX;
      dispatch({type:"UPDATE_TABLE",id,payload:{rotation:(rotStart.startAngle+dx*0.8)%360}});
    }
    function mu(){
      setRotating(false);
      dispatch({type:"UPDATE_TABLE_HISTORY",id,payload:{}});
    }
    window.addEventListener("mousemove",mm);window.addEventListener("mouseup",mu);
    window.addEventListener("touchmove",mm,{passive:false});window.addEventListener("touchend",mu);
    return()=>{
      window.removeEventListener("mousemove",mm);window.removeEventListener("mouseup",mu);
      window.removeEventListener("touchmove",mm);window.removeEventListener("touchend",mu);
    };
  },[rotating,rotStart]);

  // Resize via touch
  const [resizingTouch,setResizingTouch]=useState(false);
  const [resizeTouchStart,setResizeTouchStart]=useState(null);
  function startResizeTouch(e){
    e.stopPropagation();e.preventDefault();
    const t=e.touches[0];
    const def=tableDefaultSize(type);
    setResizingTouch(true);
    setResizeTouchStart({cx:t.clientX,cy:t.clientY,w:table.w||def.w,h:table.h||def.h});
  }
  useEffect(()=>{
    if(!resizingTouch)return;
    function tm(e){
      if(!resizeTouchStart)return;
      e.preventDefault();
      const t=e.touches[0];
      dispatch({type:"UPDATE_TABLE",id,payload:{
        w:Math.max(60,resizeTouchStart.w+(t.clientX-resizeTouchStart.cx)),
        h:Math.max(40,resizeTouchStart.h+(t.clientY-resizeTouchStart.cy))
      }});
    }
    function te(){setResizingTouch(false);dispatch({type:"UPDATE_TABLE_HISTORY",id,payload:{}});}
    window.addEventListener("touchmove",tm,{passive:false});window.addEventListener("touchend",te);
    return()=>{window.removeEventListener("touchmove",tm);window.removeEventListener("touchend",te);};
  },[resizingTouch,resizeTouchStart]);

  const highlightBorder=isSelected?"#7c3aed":isHighlighted?"#0284c7":tgc?tgc.border:"#e0e0e0";
  const highlightBg=isSelected?(tgc?tgc.bg:"#faf5ff"):isHighlighted?(tgc?tgc.bg:"#f0f9ff"):tgc?tgc.bg:"#fff";
  const hlShadowOpacity=isSelected?.15:isHighlighted?.12:.06;

  // ── TOOLBAR & POPUP POSITIONING ──────────────────────────────
  // All positions are in canvas coordinates (not SVG-local).
  // The visual element occupies:
  //   top:    y
  //   bottom: y + TH  (for rect/banquet)
  //   For round: seat circles extend beyond TH to y + TH/2 + outerSeatR
  //
  // We compute the exact visual extents so toolbar and popup
  // always have a FIXED 8px gap regardless of element size.
  const TOOLBAR_H = isMobile ? 44 : 32;
  const GAP = 8; // fixed gap in canvas px
  const ELEM_CX = TW / 2; // visual centre x

  // Visual top edge (toolbar goes above this)
  const visualTop = y; // shape top edge in canvas coords
  const TOOLBAR_Y = visualTop - TOOLBAR_H - GAP;

  // Visual bottom edge (popup goes below this)
  // For round/cocktail: seat circles at radius (TW/2 + 18), dot radius 12
  // For rect/banquet:   seats at y+TH+16, dot radius 12
  const seatOuterR = isRound ? (TW/2 + 18 + 12) : 28;
  const visualBottom = isRound
    ? (y + TH/2 + seatOuterR)   // centre + outer seat radius
    : (y + TH + seatOuterR);    // bottom + seat drop + dot
  const POPUP_Y = visualBottom + GAP;

  return (
    <>
      {/* ── CONTEXT TOOLBAR (only when selected) ── */}
      {isSelected&&(
        <div
          data-export-hide="1"
          onMouseDown={e=>e.stopPropagation()}
          style={{
            position:"absolute",
            left:x+ELEM_CX,
            top:TOOLBAR_Y,
            transform:"translateX(-50%)",
            display:"flex",
            alignItems:"center",
            gap:isMobile?8:4,
            background:"#1a1a1a",
            borderRadius:12,
            padding:isMobile?"8px 12px":"4px 8px",
            boxShadow:"0 4px 20px rgba(0,0,0,.3)",
            zIndex:80,
            whiteSpace:"nowrap",
          }}>
          {/* Rotate: drag left-right (mouse + touch) */}
          <div
            onMouseDown={startRotate}
            onTouchStart={e=>{
              e.stopPropagation();e.preventDefault();
              const t=e.touches[0];
              setRotating(true);
              setRotStart({startAngle:rotation||0,mouseX:t.clientX});
            }}
            style={{ display:"flex",alignItems:"center",gap:4,padding:isMobile?"6px 12px":"2px 8px",borderRadius:6,cursor:"ew-resize",color:"#ddd",fontSize:isMobile?14:11,fontWeight:500,fontFamily:"'DM Sans',sans-serif",userSelect:"none",WebkitUserSelect:"none",minWidth:isMobile?60:0 }}
            title="Rotate (drag left/right)">
            <span style={{ fontSize:isMobile?18:13 }}>↻</span>
            <span>{Math.round(rotation||0)}°</span>
          </div>
          <div style={{ width:1,height:14,background:"#333" }}/>
          {/* Move button (mobile only) — hold & drag to reposition element */}
          {isMobile&&(
            <>
              <div
                onTouchStart={e=>{
                  e.stopPropagation();
                  e.preventDefault();
                  // Immediately start a drag from this touch point
                  onStartTouchMove&&onStartTouchMove(e.touches[0]);
                }}
                onMouseDown={e=>e.stopPropagation()}
                style={{ display:"flex",alignItems:"center",gap:4,
                  padding:"6px 12px",
                  borderRadius:6,
                  cursor:"grab",
                  color:activeTouchMove===id?"#fbbf24":"#ddd",
                  fontSize:14,fontWeight:600,
                  fontFamily:"'DM Sans',sans-serif",
                  userSelect:"none",WebkitUserSelect:"none",
                  minWidth:64,
                  background:activeTouchMove===id?"rgba(251,191,36,.18)":"transparent",
                  touchAction:"none",
                }}>
                <span style={{ fontSize:18 }}>✥</span>
                <span style={{ fontSize:12 }}>{activeTouchMove===id?"…":"Move"}</span>
              </div>
              <div style={{ width:1,height:14,background:"#333" }}/>
            </>
          )}
          {/* Resize: drag (mouse + touch) */}
          <div
            onMouseDown={onStartResize}
            onTouchStart={startResizeTouch}
            style={{ display:"flex",alignItems:"center",gap:4,padding:isMobile?"6px 12px":"2px 8px",borderRadius:6,cursor:"se-resize",color:"#ddd",fontSize:isMobile?14:11,fontWeight:500,fontFamily:"'DM Sans',sans-serif",userSelect:"none",WebkitUserSelect:"none",minWidth:isMobile?60:0 }}
            title="Resize (drag)">
            <span style={{ fontSize:isMobile?18:13 }}>⤡</span>
            <span>{Math.round(TW)}×{Math.round(TH)}</span>
          </div>
          <div style={{ width:1,height:14,background:"#333" }}/>
          {/* Delete */}
          <div
            onMouseDown={e=>{e.stopPropagation();dispatch({type:"DELETE_TABLE",id});}}
            style={{ display:"flex",alignItems:"center",padding:isMobile?"6px 10px":"2px 6px",borderRadius:6,cursor:"pointer",color:"#f87171",fontSize:isMobile?18:13,fontWeight:700 }}
            title="Delete">
            ×
          </div>
        </div>
      )}

      {/* ── MAIN TABLE ── */}
      <div style={{ position:"absolute",left:x-PAD,top:y-PAD,width:svgW,height:svgH,userSelect:"none",transform:`rotate(${rotation||0}deg)`,transformOrigin:`${PAD+TW/2}px ${PAD+TH/2}px`,pointerEvents:"none" }}>
        <svg width={svgW} height={svgH} data-tableid={id} style={{ overflow:"visible",pointerEvents:"none" }}>
          <defs>
            <filter id={`sh${id}`} x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="#000" floodOpacity={hlShadowOpacity}/>
            </filter>
          </defs>

          {/* Table body */}
          {isDecor?(
            <rect x={ox} y={oy} width={TW} height={TH} rx={12} fill={decorBg[type]||"#333"} stroke={isSelected?"#7c3aed":"none"} strokeWidth={isSelected?2:0}
              onMouseDown={e=>{e.stopPropagation();onStartDrag(e);}} onClick={e=>{e.stopPropagation();onSelectTable(id);}} style={{ cursor:"grab",pointerEvents:"all" }}/>
          ):isRound?(
            <circle cx={ox+TW/2} cy={oy+TH/2} r={TW/2}
              fill={highlightBg} stroke={highlightBorder}
              strokeWidth={isSelected?2.5:isHighlighted?2:tgc?2:1.5}
              filter={`url(#sh${id})`}
              onMouseDown={e=>{e.stopPropagation();onStartDrag(e);}}
              onClick={e=>{e.stopPropagation();onSelectTable(id);onTableClick();}}
              style={{ cursor:"grab",pointerEvents:"all" }}/>
          ):(
            <rect x={ox} y={oy} width={TW} height={TH} rx={isBanquet?6:10}
              fill={highlightBg} stroke={highlightBorder}
              strokeWidth={isSelected?2.5:isHighlighted?2:tgc?2:1.5}
              filter={`url(#sh${id})`}
              onMouseDown={e=>{e.stopPropagation();onStartDrag(e);}}
              onClick={e=>{e.stopPropagation();onSelectTable(id);onTableClick();}}
              style={{ cursor:"grab",pointerEvents:"all" }}/>
          )}

          {/* Decor label */}
          {isDecor&&(
            <g onClick={e=>{e.stopPropagation();onSelectTable(id);}} style={{ cursor:"grab" }}>
              <text x={ox+TW/2} y={oy+TH/2+4} textAnchor="middle"
                fill={decorFg[type]||"#fff"} fontSize={12} fontWeight="600"
                fontFamily="'DM Sans',sans-serif" style={{ pointerEvents:"none" }}>
                {decorEmoji[type]} {name}
              </text>
            </g>
          )}

          {/* Table name + count */}
          {!isDecor&&(
            <g style={{ pointerEvents:"none" }}>
              <text x={ox+TW/2} y={oy+TH/2+(TH>60?2:-3)} textAnchor="middle"
                fill={tgc?tgc.dot:"#999"} fontSize={Math.max(8,Math.min(11,TW/11))}
                fontWeight="600" fontFamily="'DM Sans',sans-serif">{name}</text>
              {!isNoSeat&&(seats||0)>0&&(
                <text x={ox+TW/2} y={oy+TH/2+(TH>60?14:8)} textAnchor="middle"
                  fill={tgc?tgc.dot+"66":"#ccc"} fontSize={7}
                  fontFamily="'DM Sans',sans-serif">{seatedGuests.length}/{seats}</text>
              )}
            </g>
          )}

          {/* Seat circles — only for sittable tables */}
          {!isNoSeat&&Array.from({length:seats||0},(_,i)=>{
            const sk=`${id}-${i}`;
            const g=getGuestAtSeat(sk);
            const gc=g?getGC(g.groupId):null;
            const isHov=hoveredSeat===sk&&(dragGuest||selectedSeat);
            const isSel=selectedSeat===sk;
            const pos=getSeatPos(i,seats);
            const initials=g?g.name.trim().split(/\s+/).map(w=>w[0]||"").join("").slice(0,2).toUpperCase():"";
            const R=Math.max(9,Math.min(12,TW/10));
            const isGuestHL=!!(highlightedGuest&&g&&g.id===highlightedGuest);
            const circleFill=isGuestHL?"#dbeafe":isSel?"#fef08a":isHov?"#bfdbfe":g?(gc?.bg||"#f0fdf4"):"#f3f3f3";
            const circleStroke=isGuestHL?"#2563eb":isSel?"#eab308":isHov?"#3b82f6":g?(gc?.dot||"#16a34a"):"#d0d0d0";
            const circleStrokeW=isGuestHL?3:isSel?2.5:isHov?2.5:g?2:1.5;
            const circleR=isGuestHL?R+2:R;
            return (
              <g key={i}
                style={{ pointerEvents:"all", cursor:dragGuest||selectedSeat?"copy":g?"pointer":"default" }}
                onMouseDown={e=>e.stopPropagation()}
                onMouseEnter={()=>(dragGuest||selectedSeat)&&setHoveredSeat(sk)}
                onMouseLeave={()=>setHoveredSeat(null)}
                onMouseUp={e=>{e.stopPropagation();if(dragGuest)handleSeatDrop(sk);}}
                onDragOver={e=>{e.preventDefault();setHoveredSeat(sk);}}
                onDrop={e=>{e.stopPropagation();handleSeatDrop(sk);}}
                onClick={e=>{e.stopPropagation();handleSeatClick(sk);}}>
                <circle cx={ox+pos.cx} cy={oy+pos.cy} r={circleR}
                  fill={circleFill} stroke={circleStroke}
                  strokeWidth={circleStrokeW}
                  style={{ transition:"all .15s" }}/>
                {initials&&(
                  <text x={ox+pos.cx} y={oy+pos.cy+3} textAnchor="middle" dominantBaseline="middle"
                    fontSize={R>10?7:6} fontWeight="800"
                    fill={gc?.dot||"#16a34a"} fontFamily="'DM Sans',sans-serif"
                    style={{ pointerEvents:"none" }}>{initials}</text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── EXPANDED GUEST LIST ── */}
      {isExpanded&&(
        <div style={{ position:"absolute",left:x+TW/2,top:POPUP_Y,transform:"translateX(-50%)",minWidth:Math.max(TW,160),maxWidth:220,background:"#fff",border:"1px solid #e0e0e0",borderRadius:12,padding:"8px 9px",boxShadow:"0 8px 24px rgba(0,0,0,.11)",zIndex:60,maxHeight:200,overflowY:"auto",touchAction:"pan-y" }}
          onMouseDown={e=>e.stopPropagation()}
          onTouchStart={e=>{e.stopPropagation();onPopupEnter&&onPopupEnter();}}
          onTouchEnd={e=>{e.stopPropagation();}}
          onMouseEnter={()=>onPopupEnter&&onPopupEnter()}
          onMouseLeave={()=>onPopupLeave&&onPopupLeave()}>
          <div style={{ fontSize:9,fontWeight:700,color:"#aaa",marginBottom:5,textTransform:"uppercase",letterSpacing:.8 }}>
            {name}{!isNoSeat&&seats>0?` · ${seatedGuests.length}/${seats}`:""}
          </div>
          {seatedGuests.length===0&&<div style={{ fontSize:11,color:"#bbb",padding:"4px 0" }}>—</div>}
          {seatedGuests.map(g=>{
            const gc=getGC(g.groupId);
            const grpName=groups.find(gr=>gr.id===g.groupId)?.name||"";
            return (
              <div key={g.id} style={{ display:"flex",alignItems:"center",gap:5,padding:"3px 0",borderBottom:"1px solid #f5f5f5" }}>
                <div style={{ width:18,height:18,borderRadius:"50%",background:gc?.bg||"#f5f5f5",border:`1.5px solid ${gc?.dot||"#ddd"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                  <span style={{ fontSize:7,fontWeight:800,color:gc?.dot||"#aaa" }}>
                    {g.name.trim().split(/\s+/).map(w=>w[0]||"").join("").slice(0,2).toUpperCase()}
                  </span>
                </div>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontSize:11,fontWeight:500,color:"#222",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{g.name}</div>
                  {grpName&&<div style={{ fontSize:9,color:gc?.dot||"#aaa" }}>{grpName}</div>}
                </div>
                <button onClick={e=>{e.stopPropagation();dispatch({type:"UNASSIGN_SEAT",seatKey:`${id}-${g.seatIdx}`});}}
                  style={{ background:"none",border:"none",cursor:"pointer",color:"#ddd",fontSize:12,padding:"0 1px",flexShrink:0 }}>×</button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// ─── CLEAR MODAL ───────────────────────────────────────────────────────────
function ClearModal({ t, onClose, dispatch }) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,backdropFilter:"blur(4px)" }}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <motion.div initial={{scale:.95,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:.95,opacity:0}}
        style={{ background:"#fff",borderRadius:20,padding:"clamp(20px,5vw,32px)",maxWidth:380,width:"92%",textAlign:"center",boxShadow:"0 24px 60px rgba(0,0,0,.2)" }}>
        <div style={{ fontSize:36,marginBottom:10 }}>🗑️</div>
        <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700,marginBottom:8 }}>{t.clearAll}</h3>
        <p style={{ color:"#888",fontSize:13,lineHeight:1.6,marginBottom:22 }}>{t.clearAllDesc}</p>
        <div style={{ display:"flex",flexDirection:"column",gap:8,marginBottom:8 }}>
          <button onClick={()=>{dispatch({type:"CLEAR_ALL"});onClose();}}
            style={{ width:"100%",background:"#ef4444",color:"#fff",border:"none",padding:"11px",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>
            🗑️ {t.clearAll}
          </button>
          <button onClick={()=>{dispatch({type:"CLEAR_TABLES"});onClose();}}
            style={{ width:"100%",background:"#fff",color:"#ef4444",border:"1.5px solid #fca5a5",padding:"11px",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>
            🪑 {t.clearTables}
          </button>
          <button onClick={()=>{dispatch({type:"CLEAR_GUESTS"});onClose();}}
            style={{ width:"100%",background:"#fff",color:"#ef4444",border:"1.5px solid #fca5a5",padding:"11px",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>
            👥 {t.clearGuests}
          </button>
        </div>
        <button onClick={onClose}
          style={{ width:"100%",background:"none",border:"none",color:"#bbb",padding:"8px",cursor:"pointer",fontSize:12,fontFamily:"'DM Sans',sans-serif" }}>
          {t.cancel}
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── INFO MODAL ────────────────────────────────────────────────────────────
function InfoModal({ icon,title,desc,confirm,onConfirm,onClose }) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,backdropFilter:"blur(4px)" }}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <motion.div initial={{scale:.95,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:.95,opacity:0}}
        style={{ background:"#fff",borderRadius:18,padding:"clamp(20px,5vw,32px)",maxWidth:390,width:"92%",textAlign:"center",boxShadow:"0 24px 60px rgba(0,0,0,.18)" }}>
        <div style={{ fontSize:36,marginBottom:9 }}>{icon}</div>
        <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700,marginBottom:8 }}>{title}</h3>
        <p style={{ color:"#666",fontSize:13,lineHeight:1.7,marginBottom:20 }}>{desc}</p>
        <button onClick={onConfirm} style={{ width:"100%",background:"#111",color:"#fff",border:"none",padding:"10px",borderRadius:9,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginBottom:6 }}>{confirm}</button>
        <button onClick={onClose} style={{ width:"100%",background:"none",border:"none",color:"#bbb",padding:"6px",cursor:"pointer",fontSize:12,fontFamily:"'DM Sans',sans-serif" }}>Cancel</button>
      </motion.div>
    </motion.div>
  );
}

function ConfirmModal({ title,desc,confirm,cancel,onConfirm,onClose }) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,backdropFilter:"blur(4px)" }}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <motion.div initial={{scale:.95,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:.95,opacity:0}}
        style={{ background:"#fff",borderRadius:16,padding:"26px",maxWidth:340,width:"92%",textAlign:"center",boxShadow:"0 20px 50px rgba(0,0,0,.18)" }}>
        <div style={{ fontSize:30,marginBottom:9 }}>⚠️</div>
        <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,marginBottom:7 }}>{title}</h3>
        <p style={{ color:"#666",fontSize:13,lineHeight:1.6,marginBottom:18 }}>{desc}</p>
        <div style={{ display:"flex",gap:7 }}>
          <button onClick={onClose} style={{ flex:1,background:"#f5f5f5",color:"#333",border:"none",padding:"9px",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>{cancel}</button>
          <button onClick={onConfirm} style={{ flex:1,background:"#ef4444",color:"#fff",border:"none",padding:"9px",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>{confirm}</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── EXPORT MODAL ──────────────────────────────────────────────────────────
function ExportModal({ onClose,state,canvasWrapRef,t,bgStyle }) {
  const [phase,setPhase]=useState("gate");
  const [count,setCount]=useState(15);
  const [fmt,setFmt]=useState("png");
  const [exporting,setExporting]=useState(false);
  const lang=state.lang||"de";

  useEffect(()=>{
    if(phase!=="countdown")return;
    if(count<=0){setPhase("ready");return;}
    const tm=setTimeout(()=>setCount(c=>c-1),1000);
    return()=>clearTimeout(tm);
  },[phase,count]);

  async function doExport(){
    setExporting(true);
    try{
      if(fmt==="seatflow"){
        const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
        const url=URL.createObjectURL(blob);
        const a=document.createElement("a");a.href=url;a.download=`${state.event.name||"seatflow"}.seatflow`;a.click();
        URL.revokeObjectURL(url);onClose();return;
      }

      const html2canvas=(await import("html2canvas")).default;
      const el=canvasWrapRef?.current;
      if(!el){alert("Canvas not ready.");setExporting(false);return;}

      // Hide toolbar elements
      const hidden=el.querySelectorAll("[data-export-hide]");
      hidden.forEach(h=>{h._prevDisplay=h.style.display;h.style.display="none";});

      const orig=el.style.transform;
      el.style.transform="translate(0,0) scale(1)";
      el.style.transformOrigin="0 0";
      await new Promise(r=>requestAnimationFrame(r));
      await new Promise(r=>requestAnimationFrame(r));

      const canvas=await html2canvas(el,{
        backgroundColor:"#ffffff",scale:2,useCORS:true,logging:false,
        width:Math.max(el.scrollWidth,800),height:Math.max(el.scrollHeight,600),
      });
      el.style.transform=orig;
      hidden.forEach(h=>{h.style.display=h._prevDisplay||"";});

      if(fmt==="png"){
        canvas.toBlob(blob=>{
          const url=URL.createObjectURL(blob);
          const a=document.createElement("a");a.href=url;a.download=`${state.event.name||"seating"}.png`;a.click();
          URL.revokeObjectURL(url);
        },"image/png");
        onClose();return;
      }

      if(fmt==="pdf"){
        const{default:jsPDF}=await import("jspdf");
        const imgData=canvas.toDataURL("image/png");
        const pdf=new jsPDF({orientation:"landscape",unit:"pt",format:"a4"});
        const PW=pdf.internal.pageSize.getWidth();
        const PH=pdf.internal.pageSize.getHeight();
        // Generous margins for luxury feel
        const ML=56,MR=56,MT=64,MB=50;
        const CW=PW-ML-MR;
        const locale=lang==="de"?"de-DE":"en-US";
        let cy=MT;
        const C={black:17,dark:40,mid:90,light:140,muted:180,line:210,bg:248};

        // ── HELPERS ──────────────────────────────────────────────────────
        function rgb(c){return[c,c,c];}
        function sep(y,alpha=C.line){
          pdf.setDrawColor(alpha,alpha,alpha);pdf.setLineWidth(0.4);
          pdf.line(ML,y,PW-MR,y);
        }
        function ensure(n){if(cy+n>PH-MB){endPage();newPage();}}

        function drawLogo(x=ML,y=22,size=14){
          pdf.setFont("helvetica","normal");pdf.setFontSize(size);pdf.setTextColor(...rgb(C.black));
          pdf.text("Seat",x,y);
          const sw=pdf.getTextWidth("Seat");
          pdf.setFont("times","bold");pdf.setFontSize(size);pdf.setTextColor(...rgb(C.black));
          pdf.text("Flow",x+sw,y);
        }

        function endPage(){
          // Footer bar
          sep(PH-MB+10,C.line);
          // page number right
          const pn=String(pdf.getNumberOfPages());
          pdf.setFont("helvetica","normal");pdf.setFontSize(8);pdf.setTextColor(...rgb(C.muted));
          pdf.text(pn,PW-MR,PH-MB+24,{align:"right"});
          // "Created with SeatFlow" left
          const pre=t.pdfCreatedWith.replace("SeatFlow","");
          pdf.text(pre,ML,PH-MB+24);
          const pw2=pdf.getTextWidth(pre);
          pdf.setFont("times","bold");pdf.setFontSize(8);pdf.setTextColor(...rgb(120));
          pdf.text("SeatFlow",ML+pw2,PH-MB+24);
        }

        function newPage(){
          pdf.addPage();cy=MT;
          drawLogo();
        }

        // Chapter heading: serif large, thin full-width rule below
        function H1(txt){
          ensure(44);
          pdf.setFont("times","bold");pdf.setFontSize(24);pdf.setTextColor(...rgb(C.black));
          pdf.text(txt,ML,cy);
          cy+=10;sep(cy,C.line);cy+=16;
        }

        // Section heading: serif medium, short rule
        function H2(txt){
          ensure(32);
          pdf.setFont("times","bold");pdf.setFontSize(14);pdf.setTextColor(...rgb(C.dark));
          pdf.text(txt,ML,cy);
          cy+=7;sep(cy,C.line);cy+=12;
        }

        // Key–value row (clean, no background)
        function KV(label,val,bold=false){
          ensure(18);
          pdf.setFont("helvetica","bold");pdf.setFontSize(8);pdf.setTextColor(...rgb(C.light));
          pdf.text(label.toUpperCase(),ML,cy);
          pdf.setFont("helvetica",bold?"bold":"normal");pdf.setFontSize(11);pdf.setTextColor(...rgb(bold?C.black:C.dark));
          pdf.text(val,ML+130,cy);
          cy+=16;
        }

        // Body line
        function body(txt,indent=0,sz=10,col=C.dark){
          ensure(16);
          pdf.setFont("helvetica","normal");pdf.setFontSize(sz);pdf.setTextColor(...rgb(col));
          pdf.text(txt,ML+indent,cy);cy+=14;
        }

        // Vertical spacer
        function gap(n=10){cy+=n;}

        // ── PAGE 1: COVER + FLOOR PLAN ────────────────────────────────────
        drawLogo();
        // Event title centered, large serif
        pdf.setFont("times","bold");pdf.setFontSize(28);pdf.setTextColor(...rgb(C.black));
        pdf.text(state.event.name||"Seating Chart",PW/2,MT,{align:"center"});
        cy=MT+20;

        // Sub-line: location · date
        if(state.event.location||state.event.date){
          pdf.setFont("helvetica","normal");pdf.setFontSize(10);pdf.setTextColor(...rgb(C.mid));
          const sub=[
            state.event.location,
            state.event.date?new Date(state.event.date).toLocaleDateString(locale,{year:"numeric",month:"long",day:"numeric"}):""
          ].filter(Boolean).join("   ·   ");
          pdf.text(sub,PW/2,cy,{align:"center"});
          cy+=12;
        }
        sep(cy,C.line);
        cy+=14;

        // Floor plan image — centred, fills available space
        const imgH=PH-cy-MB-10;
        const ratio=Math.min(CW/canvas.width,imgH/canvas.height);
        const iw=canvas.width*ratio,ih=canvas.height*ratio;
        const ix=ML+(CW-iw)/2;
        pdf.addImage(imgData,"PNG",ix,cy,iw,ih);
        endPage();

        // ── PAGE 2: SUMMARY ───────────────────────────────────────────────
        newPage();
        H1(t.pdfEventSummary);

        if(state.event.name)       KV(t.pdfEvent,    state.event.name);
        if(state.event.location)   KV(t.pdfLocation, state.event.location);
        if(state.event.date)       KV(t.pdfDate,     new Date(state.event.date).toLocaleDateString(locale,{weekday:"long",year:"numeric",month:"long",day:"numeric"}));
        gap(6);

        const totalSeats=state.tables.reduce((s,tb)=>isNoSeatType(tb.type)?s:s+(tb.seats||0),0);
        const totalAssigned=Object.keys(state.assignments).length;
        const totalUnassigned=state.guests.length-totalAssigned;
        KV(t.pdfTotalGuests, String(state.guests.length));
        KV(t.pdfSeatsAvail,  String(totalSeats));
        KV(t.pdfSeated,      String(totalAssigned),true);

        // Unassigned — coloured if >0
        ensure(18);
        pdf.setFont("helvetica","bold");pdf.setFontSize(8);pdf.setTextColor(...rgb(C.light));
        pdf.text(t.pdfUnassigned.toUpperCase(),ML,cy);
        pdf.setFont("helvetica","bold");pdf.setFontSize(11);
        pdf.setTextColor(totalUnassigned>0?185:22,totalUnassigned>0?28:101,totalUnassigned>0?28:52);
        pdf.text(String(totalUnassigned),ML+130,cy);
        cy+=16;
        endPage();

        // ── PAGE 3: GROUPS ────────────────────────────────────────────────
        if(state.groups.length>0){
          newPage();
          H1(t.pdfGroups);

          // Column headers
          pdf.setFont("helvetica","bold");pdf.setFontSize(8);pdf.setTextColor(...rgb(C.light));
          pdf.text((lang==="de"?"GRUPPE":"GROUP").padEnd(40),ML,cy);
          pdf.text(lang==="de"?"GÄSTE":"GUESTS",ML+240,cy);
          pdf.text(lang==="de"?"PLATZIERT":"SEATED",ML+320,cy);
          cy+=10;sep(cy,C.line);cy+=12;

          state.groups.forEach(g=>{
            ensure(18);
            const cnt=state.guests.filter(gs=>gs.groupId===g.id).length;
            const seated=Object.entries(state.assignments).filter(([,v])=>state.guests.find(gs=>gs.id===v&&gs.groupId===g.id)).length;
            pdf.setFont("times","bold");pdf.setFontSize(11);pdf.setTextColor(...rgb(C.dark));
            pdf.text(g.name,ML,cy);
            pdf.setFont("helvetica","normal");pdf.setFontSize(10);pdf.setTextColor(...rgb(C.mid));
            pdf.text(String(cnt),ML+240,cy);
            pdf.text(String(seated),ML+320,cy);
            cy+=16;
          });
          const ung=state.guests.filter(g=>!g.groupId).length;
          if(ung>0){
            ensure(16);
            pdf.setFont("helvetica","italic");pdf.setFontSize(10);pdf.setTextColor(...rgb(C.muted));
            pdf.text(lang==="de"?"Ohne Gruppe":"No Group",ML,cy);
            pdf.text(String(ung),ML+240,cy);
            cy+=16;
          }
          endPage();
        }

        // ── PAGE 4: TABLES ────────────────────────────────────────────────
        newPage();
        H1(t.pdfTables);

        // Column headers
        pdf.setFont("helvetica","bold");pdf.setFontSize(8);pdf.setTextColor(...rgb(C.light));
        pdf.text(lang==="de"?"TISCH":"TABLE",ML,cy);
        pdf.text(lang==="de"?"GRUPPE":"GROUP",ML+220,cy);
        pdf.text(lang==="de"?"PLÄTZE":"SEATS",ML+360,cy);
        pdf.text(lang==="de"?"BESETZT":"SEATED",ML+420,cy);
        cy+=10;sep(cy,C.line);cy+=12;

        state.tables.filter(tb=>!isNoSeatType(tb.type)).forEach(tb=>{
          ensure(18);
          const seatedN=Object.keys(state.assignments).filter(k=>k.startsWith(tb.id+"-")).length;
          const grpName=state.groups.find(g=>g.id===tb.groupId)?.name||"—";
          const full=tb.seats>0&&seatedN===tb.seats;
          pdf.setFont("times","bold");pdf.setFontSize(11);pdf.setTextColor(...rgb(C.dark));
          pdf.text(tb.name,ML,cy);
          pdf.setFont("helvetica","normal");pdf.setFontSize(10);pdf.setTextColor(...rgb(C.mid));
          pdf.text(grpName,ML+220,cy);
          pdf.text(String(tb.seats||0),ML+360,cy);
          pdf.setTextColor(...(full?[22,101,52]:rgb(C.mid)));
          pdf.text(String(seatedN),ML+420,cy);
          cy+=16;
        });
        endPage();

        // ── PAGE 5+: SEATING ASSIGNMENTS ─────────────────────────────────
        newPage();
        H1(t.pdfAssignments);

        const assignableTables=state.tables.filter(tb=>!isNoSeatType(tb.type));
        assignableTables.forEach(tb=>{
          const here=Array.from({length:tb.seats||0},(_,i)=>{
            const gid=state.assignments[`${tb.id}-${i}`];
            return gid?{guest:state.guests.find(g=>g.id===gid),seat:i+1}:null;
          }).filter(Boolean);
          if(here.length===0)return;

          ensure(40);
          H2(tb.name);

          here.forEach(({guest:g,seat})=>{
            ensure(16);
            pdf.setFont("helvetica","bold");pdf.setFontSize(9);pdf.setTextColor(...rgb(C.light));
            pdf.text(`${t.pdfSeat} ${seat}`,ML+6,cy);
            pdf.setFont("helvetica","normal");pdf.setFontSize(10);pdf.setTextColor(...rgb(C.dark));
            pdf.text(g.name,ML+60,cy);
            const grp=state.groups.find(gr=>gr.id===g.groupId)?.name||"";
            if(grp){
              const nw=pdf.getTextWidth(g.name);
              pdf.setFont("helvetica","italic");pdf.setFontSize(9);pdf.setTextColor(...rgb(C.muted));
              pdf.text(`· ${grp}`,ML+60+nw+4,cy);
            }
            cy+=14;
          });
          gap(4);
        });

        endPage();
        pdf.save(`${state.event.name||"seating-chart"}.pdf`);
        onClose();
      }
    }catch(err){
      console.error("Export error:",err);
      alert("Export failed: "+err.message);
    }
    setExporting(false);
  }

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,backdropFilter:"blur(6px)" }}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <motion.div initial={{scale:.94,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:.94,opacity:0}}
        style={{ background:"#fff",borderRadius:20,padding:"clamp(18px,5vw,34px)",maxWidth:390,width:"92%",textAlign:"center",boxShadow:"0 32px 80px rgba(0,0,0,.2)" }}>

        {phase==="gate"&&<>
          <div style={{ fontSize:36,marginBottom:9 }}>🖨️</div>
          <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700,marginBottom:6 }}>{t.exportTitle}</h3>
          <p style={{ color:"#888",fontSize:12,marginBottom:16,lineHeight:1.6 }}>{t.exportDesc}</p>
          <div style={{ display:"flex",gap:5,justifyContent:"center",marginBottom:16,flexWrap:"wrap" }}>
            {[{v:"png",l:"🖼️ PNG"},{v:"pdf",l:"📄 PDF"},{v:"seatflow",l:"💾 .seatflow"}].map(f=>(
              <button key={f.v} onClick={()=>setFmt(f.v)}
                style={{ padding:"7px 13px",border:`2px solid ${fmt===f.v?"#111":"#e5e5e5"}`,borderRadius:9,background:fmt===f.v?"#111":"#fff",color:fmt===f.v?"#fff":"#333",cursor:"pointer",fontWeight:600,fontSize:12,fontFamily:"'DM Sans',sans-serif" }}>
                {f.l}
              </button>
            ))}
          </div>
          <div style={{ background:"#f8f8f8",border:"2px dashed #e0e0e0",borderRadius:11,padding:"20px 12px",marginBottom:14 }}>
            <p style={{ color:"#bbb",fontSize:10,fontWeight:600 }}>— AD PLACEHOLDER —</p>
            <p style={{ color:"#ccc",fontSize:9,marginTop:2 }}>Google AdSense / Rewarded Video</p>
          </div>
          {fmt==="seatflow"
            ?<button onClick={doExport} style={{ width:"100%",background:"#111",color:"#fff",border:"none",padding:"10px",borderRadius:9,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>Download .seatflow</button>
            :<button onClick={()=>{setPhase("countdown");setCount(15);}} style={{ width:"100%",background:"#111",color:"#fff",border:"none",padding:"10px",borderRadius:9,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>{t.unlockExport}</button>
          }
          <button onClick={onClose} style={{ width:"100%",background:"none",border:"none",color:"#bbb",padding:"6px",cursor:"pointer",fontSize:11,marginTop:2,fontFamily:"'DM Sans',sans-serif" }}>{t.cancel}</button>
        </>}

        {phase==="countdown"&&<>
          <div style={{ fontSize:36,marginBottom:9 }}>⏳</div>
          <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700,marginBottom:6 }}>{t.preparingExport}</h3>
          <div style={{ background:"#f5f5f5",border:"1px solid #eee",borderRadius:11,padding:"26px 12px",marginBottom:14,position:"relative" }}>
            <div style={{ fontSize:10,color:"#ccc" }}>Advertisement</div>
            <div style={{ position:"absolute",top:8,right:8,background:"#111",color:"#fff",borderRadius:999,width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12 }}>{count}</div>
          </div>
          <div style={{ height:3,background:"#f0f0f0",borderRadius:999,overflow:"hidden",marginBottom:5 }}>
            <motion.div animate={{width:`${((15-count)/15)*100}%`}} transition={{duration:.4}} style={{ height:"100%",background:"#111",borderRadius:999 }}/>
          </div>
          <p style={{ color:"#bbb",fontSize:11 }}>{count}s…</p>
        </>}

        {phase==="ready"&&<>
          <div style={{ fontSize:36,marginBottom:9 }}>🎉</div>
          <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700,marginBottom:6 }}>{t.readyTitle}</h3>
          {fmt==="pdf"&&<p style={{ color:"#888",fontSize:12,marginBottom:14 }}>{t.pdfDesc}</p>}
          <button onClick={doExport} disabled={exporting}
            style={{ width:"100%",background:"#111",color:"#fff",border:"none",padding:"10px",borderRadius:9,fontSize:13,fontWeight:600,cursor:exporting?"wait":"pointer",fontFamily:"'DM Sans',sans-serif",opacity:exporting?.7:1,marginBottom:5 }}>
            {exporting?t.downloading:`${t.download} ${fmt.toUpperCase()} ↓`}
          </button>
          <button onClick={onClose} style={{ width:"100%",background:"none",border:"none",color:"#bbb",padding:"6px",cursor:"pointer",fontSize:11,fontFamily:"'DM Sans',sans-serif" }}>{t.close}</button>
        </>}
      </motion.div>
    </motion.div>
  );
}

// ─── GROUP MODAL ───────────────────────────────────────────────────────────
function GroupModal({ groups,guests,dispatch,onClose,getGC,t }) {
  const [newName,setNewName]=useState("");
  const [newCount,setNewCount]=useState("");
  const [mode,setMode]=useState("simple"); // simple | withCount

  function add(){
    if(!newName.trim())return;
    if(mode==="withCount"&&newCount){
      dispatch({type:"ADD_GROUP_WITH_GUESTS",name:newName.trim(),count:parseInt(newCount)||0});
    } else {
      dispatch({type:"ADD_GROUP",payload:newName.trim()});
    }
    setNewName("");setNewCount("");
  }

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100 }}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <motion.div initial={{scale:.95}} animate={{scale:1}} exit={{scale:.95}}
        style={{ background:"#fff",borderRadius:18,padding:"clamp(16px,5vw,24px)",maxWidth:380,width:"92%",maxHeight:"82vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,.15)" }}>
        <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,marginBottom:14 }}>{t.manageGroups}</h3>

        {/* Mode toggle */}
        <div style={{ display:"flex",gap:4,marginBottom:12,background:"#f5f5f5",borderRadius:9,padding:3 }}>
          {[["simple",t.addGroup],["withCount",t.groupWithCount]].map(([m,label])=>(
            <button key={m} onClick={()=>setMode(m)}
              style={{ flex:1,padding:"5px 8px",borderRadius:6,border:"none",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
                background:mode===m?"#111":"transparent",color:mode===m?"#fff":"#888",transition:"all .15s" }}>
              {label}
            </button>
          ))}
        </div>

        {/* New group form */}
        <div style={{ marginBottom:14 }}>
          <input placeholder={t.groupNameLabel} value={newName} onChange={e=>setNewName(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&add()}
            style={{ width:"100%",padding:"7px 10px",border:"1.5px solid #e0e0e0",borderRadius:8,fontSize:12,outline:"none",fontFamily:"'DM Sans',sans-serif",marginBottom:mode==="withCount"?6:0 }}/>
          {mode==="withCount"&&(
            <input type="number" placeholder={`${t.groupCountLabel} (z.B. 25)`} value={newCount}
              onChange={e=>setNewCount(e.target.value)} min={0} max={500}
              onKeyDown={e=>e.key==="Enter"&&add()}
              style={{ width:"100%",padding:"7px 10px",border:"1.5px solid #e0e0e0",borderRadius:8,fontSize:12,outline:"none",fontFamily:"'DM Sans',sans-serif" }}/>
          )}
          {mode==="withCount"&&newName&&newCount&&(
            <p style={{ fontSize:10,color:"#888",marginTop:4 }}>
              → {parseInt(newCount)||0}× „{newName} – Gast N" {t.noGroupsYet==="Noch keine Gruppen."?"werden erstellt":"will be created"}
            </p>
          )}
          <button onClick={add} style={{ width:"100%",marginTop:8,background:"#111",color:"#fff",border:"none",borderRadius:8,padding:"8px",cursor:"pointer",fontWeight:600,fontFamily:"'DM Sans',sans-serif",fontSize:13 }}>
            {t.createGroupBtn}
          </button>
        </div>

        {/* Existing groups */}
        {groups.length===0&&<div style={{ textAlign:"center",padding:14,color:"#bbb",fontSize:12 }}>{t.noGroupsYet}</div>}
        {groups.map(g=>{
          const gc=getGC(g.id);
          const cnt=guests.filter(gs=>gs.groupId===g.id).length;
          return (
            <div key={g.id} style={{ display:"flex",alignItems:"center",gap:7,padding:"6px 0",borderBottom:"1px solid #f0f0f0" }}>
              <div style={{ width:8,height:8,borderRadius:"50%",background:gc?.dot,flexShrink:0 }}/>
              <input defaultValue={g.name} onBlur={e=>dispatch({type:"UPDATE_GROUP",id:g.id,payload:{name:e.target.value}})}
                style={{ flex:1,border:"none",fontSize:12,fontWeight:600,color:"#111",outline:"none",fontFamily:"'DM Sans',sans-serif" }}/>
              <span style={{ fontSize:10,color:"#aaa",flexShrink:0 }}>{cnt}</span>
              <select value={g.colorIndex} onChange={e=>dispatch({type:"UPDATE_GROUP",id:g.id,payload:{colorIndex:+e.target.value}})}
                style={{ border:"1px solid #e5e5e5",borderRadius:5,padding:"2px 4px",fontSize:10,outline:"none",fontFamily:"'DM Sans',sans-serif" }}>
                {GROUP_COLORS.map((c2,i)=><option key={i} value={i}>{c2.name}</option>)}
              </select>
              <button onClick={()=>dispatch({type:"DELETE_GROUP",id:g.id})} style={{ background:"none",border:"none",cursor:"pointer",color:"#ddd",fontSize:14 }}>×</button>
            </div>
          );
        })}
        <button onClick={onClose} style={{ width:"100%",background:"#111",color:"#fff",border:"none",padding:"9px",borderRadius:9,fontSize:13,fontWeight:600,cursor:"pointer",marginTop:12,fontFamily:"'DM Sans',sans-serif" }}>{t.done}</button>
      </motion.div>
    </motion.div>
  );
}

// ─── AUTO CREATE MODAL ─────────────────────────────────────────────────────
function AutoCreateModal({ t, lang, dispatch, onClose }) {
  const [mode,setMode]=useState("group");
  const [tableCount,setTableCount]=useState(8);
  const [perTable,setPerTable]=useState(10);

  function apply(){
    const pt=Math.max(1,parseInt(perTable)||10);
    if(mode==="size"){
      dispatch({type:"AUTO_CREATE_TABLES",mode:"size",tableCount:Math.max(1,parseInt(tableCount)||1),perTable:pt});
    } else {
      dispatch({type:"AUTO_CREATE_TABLES",mode:"group",perTable:pt});
    }
    onClose();
  }

  const groupEstimate=mode==="group"
    ? `~${Math.ceil(Math.max(1,parseInt(perTable)||10)*0+0)} ${lang==="de"?"Tische werden automatisch berechnet":"tables calculated automatically"}`
    : `→ ${(parseInt(tableCount)||0)*(parseInt(perTable)||0)} ${lang==="de"?"Plätze gesamt":"seats total"}`;

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,backdropFilter:"blur(4px)" }}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <motion.div initial={{scale:.95,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:.95,opacity:0}}
        style={{ background:"#fff",borderRadius:18,padding:"clamp(20px,5vw,32px)",maxWidth:420,width:"92%",boxShadow:"0 24px 60px rgba(0,0,0,.18)" }}>
        <div style={{ fontSize:36,marginBottom:9,textAlign:"center" }}>🏗️</div>
        <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700,marginBottom:12,textAlign:"center" }}>{t.autoCreateTitle}</h3>

        {/* Mode toggle */}
        <div style={{ display:"flex",gap:4,marginBottom:16,background:"#f5f5f5",borderRadius:9,padding:3 }}>
          {[["group",t.autoCreateModeGroup],["size",t.autoCreateModeTable]].map(([m,label])=>(
            <button key={m} onClick={()=>setMode(m)}
              style={{ flex:1,padding:"6px",borderRadius:6,border:"none",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
                background:mode===m?"#111":"transparent",color:mode===m?"#fff":"#888",transition:"all .15s" }}>
              {label}
            </button>
          ))}
        </div>

        {/* perTable - ALWAYS shown */}
        <div style={{ background:"#f8f8f8",borderRadius:12,padding:"14px",marginBottom:14 }}>
          <label style={{ display:"block",fontSize:12,fontWeight:700,color:"#333",marginBottom:6 }}>
            {t.autoCreatePerTable} *
          </label>
          <input type="number" min={1} max={50} value={perTable} onChange={e=>setPerTable(e.target.value)}
            style={{ width:"100%",padding:"9px 12px",border:"1.5px solid #e0e0e0",borderRadius:9,fontSize:14,outline:"none",fontFamily:"'DM Sans',sans-serif",fontWeight:600,textAlign:"center" }}/>
          <p style={{ fontSize:11,color:"#888",marginTop:6,lineHeight:1.5 }}>
            {lang==="de"
              ?`Gruppen mit mehr als ${parseInt(perTable)||10} Personen werden automatisch auf mehrere Tische aufgeteilt.`
              :`Groups larger than ${parseInt(perTable)||10} guests are automatically split across multiple tables.`}
          </p>
        </div>

        {/* tableCount - only for size mode */}
        {mode==="size"&&(
          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block",fontSize:12,fontWeight:600,color:"#333",marginBottom:6 }}>{t.autoCreateTableCount}</label>
            <input type="number" min={1} max={200} value={tableCount} onChange={e=>setTableCount(e.target.value)}
              style={{ width:"100%",padding:"8px 12px",border:"1.5px solid #e0e0e0",borderRadius:9,fontSize:13,outline:"none",fontFamily:"'DM Sans',sans-serif" }}/>
            <p style={{ fontSize:11,color:"#aaa",marginTop:5 }}>
              → {(parseInt(tableCount)||0)*(parseInt(perTable)||0)} {lang==="de"?"Plätze gesamt":"seats total"}
            </p>
          </div>
        )}

        {mode==="group"&&(
          <p style={{ color:"#888",fontSize:12,lineHeight:1.6,marginBottom:14 }}>
            {lang==="de"
              ?"Für jede Gruppe werden passend viele Tische erstellt. Ungrouped Gäste bekommen eigene Tische."
              :"Tables are created per group, split as needed. Ungrouped guests get their own tables."}
          </p>
        )}

        <button onClick={apply} style={{ width:"100%",background:"#111",color:"#fff",border:"none",padding:"12px",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginBottom:6 }}>{t.autoCreateApply}</button>
        <button onClick={onClose} style={{ width:"100%",background:"none",border:"none",color:"#bbb",padding:"7px",cursor:"pointer",fontSize:12,fontFamily:"'DM Sans',sans-serif" }}>{t.cancel}</button>
      </motion.div>
    </motion.div>
  );
}

// ─── LEGAL MODAL ───────────────────────────────────────────────────────────
//
// ╔═══════════════════════════════════════════════════════════════════════╗
// ║  HIER RECHTSTEXTE ANPASSEN / EDIT LEGAL TEXT HERE                       ║
// ║  Ersetze die Platzhalter (Adresse, E-Mail, etc.) durch deine echten     ║
// ║  Angaben. Jeder Text existiert in DE und EN — beide Sprachen anpassen.  ║
// ║  HTML-Tags wie <p>, <strong>, <br/> bleiben einfach erhalten.           ║
// ╚═══════════════════════════════════════════════════════════════════════╝
//
const LEGAL_CONTENT = {

  // ── IMPRESSUM / IMPRINT ──────────────────────────────────────
  // Hier: Firmenname, Adresse, E-Mail-Kontakt anpassen.
  impressum: {
    de: `<h2>Impressum</h2>
<p><strong>Angaben gemäß § 5 TMG</strong></p>
<p>SeatFlow<br/>
Musterstraße 1<br/>
12345 Musterstadt<br/>
Deutschland</p>
<p><strong>Kontakt</strong><br/>
E-Mail: kontakt@seatflow.app</p>
<p><strong>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</strong><br/>
SeatFlow, Musterstraße 1, 12345 Musterstadt</p>
<p style="color:#aaa;font-size:12px;margin-top:16px">Bitte ersetze diese Angaben durch deine tatsächlichen Kontaktdaten.</p>`,
    en: `<h2>Imprint</h2>
<p><strong>Information according to § 5 TMG</strong></p>
<p>SeatFlow<br/>
Sample Street 1<br/>
12345 Sample City<br/>
Germany</p>
<p><strong>Contact</strong><br/>
Email: contact@seatflow.app</p>
<p style="color:#aaa;font-size:12px;margin-top:16px">Please replace this with your actual contact details.</p>`,
  },

  // ── DATENSCHUTZERKLÄRUNG / PRIVACY POLICY ────────────────────
  // Hier: Datenschutz-Kontakt-E-Mail anpassen, ggf. mit Anwalt abstimmen.
  datenschutz: {
    de: `<h2>Datenschutzerklärung</h2>
<p><strong>1. Allgemeine Hinweise</strong><br/>
Diese Datenschutzerklärung klärt über Art, Umfang und Zweck der Verarbeitung personenbezogener Daten bei der Nutzung von SeatFlow auf.</p>
<p><strong>2. Datenspeicherung</strong><br/>
SeatFlow speichert alle Daten ausschließlich lokal in Ihrem Browser (localStorage). Es werden keine Daten an externe Server übertragen.</p>
<p><strong>3. Cookies</strong><br/>
SeatFlow verwendet keine Tracking-Cookies. Es werden lediglich funktionale Browserdaten (localStorage) zur Projektspeicherung genutzt.</p>
<p><strong>4. Ihre Rechte</strong><br/>
Sie können gespeicherte Daten jederzeit durch Löschen des Browser-Caches entfernen.</p>
<p><strong>5. Kontakt</strong><br/>
Bei Fragen: kontakt@seatflow.app</p>
<p style="color:#aaa;font-size:12px;margin-top:16px">Bitte durch einen Anwalt auf deine konkrete Situation anpassen.</p>`,
    en: `<h2>Privacy Policy</h2>
<p><strong>1. General</strong><br/>
SeatFlow stores all data locally in your browser (localStorage). No data is transmitted to external servers.</p>
<p><strong>2. Data Storage</strong><br/>
All seating plan data stays on your device. Clearing browser storage removes all data.</p>
<p><strong>3. Cookies</strong><br/>
SeatFlow does not use tracking cookies. Only functional browser storage is used.</p>
<p><strong>4. Your Rights</strong><br/>
You can remove all stored data by clearing your browser cache.</p>
<p><strong>5. Contact</strong><br/>
Questions: contact@seatflow.app</p>
<p style="color:#aaa;font-size:12px;margin-top:16px">Please adapt this with the help of a lawyer for your situation.</p>`,
  },

  // ── AGB / TERMS OF SERVICE ────────────────────────────────────
  // Hier: Nutzungsbedingungen anpassen, ggf. mit Anwalt abstimmen.
  agb: {
    de: `<h2>Allgemeine Geschäftsbedingungen</h2>
<p><strong>§ 1 Geltungsbereich</strong><br/>
Diese AGB gelten für die kostenlose Nutzung von SeatFlow.</p>
<p><strong>§ 2 Leistungsbeschreibung</strong><br/>
SeatFlow ist ein kostenloser, browserbasierter Sitzplaner. Die Nutzung erfolgt ohne Registrierung.</p>
<p><strong>§ 3 Haftungsausschluss</strong><br/>
SeatFlow wird ohne Gewähr bereitgestellt. Für Datenverluste durch Browser-Cache-Löschung wird keine Haftung übernommen.</p>
<p style="color:#aaa;font-size:12px;margin-top:16px">Bitte durch einen Anwalt prüfen lassen.</p>`,
    en: `<h2>Terms of Service</h2>
<p><strong>1. Scope</strong><br/>
These terms apply to the free use of SeatFlow.</p>
<p><strong>2. Service Description</strong><br/>
SeatFlow is a free, browser-based seating planner. No registration required.</p>
<p><strong>3. Disclaimer</strong><br/>
SeatFlow is provided as-is. No liability for data loss due to browser cache clearing.</p>
<p style="color:#aaa;font-size:12px;margin-top:16px">Please have this reviewed by a lawyer.</p>`,
  },

  // ── COOKIE-RICHTLINIE / COOKIE POLICY ─────────────────────────
  // Hier: nur anpassen falls du später Tracking/Ads-Cookies hinzufügst.
  cookiePolicy: {
    de: `<h2>Cookie-Richtlinie</h2>
<p>SeatFlow verwendet keine Tracking- oder Analyse-Cookies.</p>
<p>Es wird ausschließlich der <strong>localStorage</strong> des Browsers verwendet, um dein Projekt lokal zu speichern. Dieser wird nicht für Werbung oder Tracking genutzt.</p>
<p>Du kannst die gespeicherten Daten jederzeit in den Browsereinstellungen löschen.</p>`,
    en: `<h2>Cookie Policy</h2>
<p>SeatFlow does not use tracking or analytics cookies.</p>
<p>Only the browser's <strong>localStorage</strong> is used to save your project locally. It is not used for advertising or tracking.</p>
<p>You can delete stored data anytime in your browser settings.</p>`,
  },
};
// ─── END LEGAL CONTENT — zum Bearbeiten einfach Text zwischen den `` ändern ───

function LegalModal({ type, lang, t, onClose }) {
  const content=LEGAL_CONTENT[type]?.[lang]||LEGAL_CONTENT[type]?.de||"";
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,backdropFilter:"blur(4px)" }}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <motion.div initial={{scale:.96,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:.96,opacity:0}}
        style={{ background:"#fff",borderRadius:18,padding:"clamp(20px,5vw,36px)",maxWidth:600,width:"94%",maxHeight:"80vh",display:"flex",flexDirection:"column",boxShadow:"0 24px 60px rgba(0,0,0,.2)" }}>
        <div style={{ flex:1,overflowY:"auto",fontSize:14,lineHeight:1.8,color:"#444",fontFamily:"'DM Sans',sans-serif" }}
          dangerouslySetInnerHTML={{__html:content}}/>
        <button onClick={onClose} style={{ marginTop:20,width:"100%",background:"#111",color:"#fff",border:"none",padding:"11px",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",flexShrink:0 }}>{t.close}</button>
      </motion.div>
    </motion.div>
  );
}

// ─── FOOTER ────────────────────────────────────────────────────────────────
function Footer({ t, lang, dispatch }) {
  const [legal,setLegal]=useState(null);
  return (
    <>
      <div style={{ background:"#111",padding:"32px 24px",textAlign:"center",fontFamily:"'DM Sans',sans-serif" }}>
        <div style={{ fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:"#fff",marginBottom:6 }}>SeatFlow</div>
        <p style={{ fontSize:12,color:"#666",marginBottom:20 }}>© {new Date().getFullYear()} SeatFlow. {t.footerRights}</p>
        <div style={{ display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap" }}>
          {/* Remove any of these blocks to disable that legal page */}
          <button onClick={()=>setLegal("impressum")} style={{ background:"none",border:"none",cursor:"pointer",color:"#666",fontSize:12,fontFamily:"'DM Sans',sans-serif",transition:"color .15s" }} onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="#666"}>{t.impressum}</button>
          <button onClick={()=>setLegal("datenschutz")} style={{ background:"none",border:"none",cursor:"pointer",color:"#666",fontSize:12,fontFamily:"'DM Sans',sans-serif",transition:"color .15s" }} onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="#666"}>{t.datenschutz}</button>
          <button onClick={()=>setLegal("agb")} style={{ background:"none",border:"none",cursor:"pointer",color:"#666",fontSize:12,fontFamily:"'DM Sans',sans-serif",transition:"color .15s" }} onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="#666"}>{t.agb}</button>
          <button onClick={()=>setLegal("cookiePolicy")} style={{ background:"none",border:"none",cursor:"pointer",color:"#666",fontSize:12,fontFamily:"'DM Sans',sans-serif",transition:"color .15s" }} onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="#666"}>{t.cookiePolicy}</button>
          <div style={{ width:1,height:14,background:"#333",margin:"0 2px" }}/>
          <LangToggle lang={lang} dispatch={dispatch} style={{ background:"#222" }}/>
        </div>
      </div>
      <AnimatePresence>
        {legal&&<LegalModal type={legal} lang={lang} t={t} onClose={()=>setLegal(null)}/>}
      </AnimatePresence>
    </>
  );
}
