import React, { useState, useMemo } from 'react';

// Player data with full analysis
const playersData = [
  // TOP T1 PLAYERS - NAL
  { name: "Jume", team: "Team Secret", region: "EML", tier: "T1", role: "Star Flex", avg: 1.21, peak: 1.39, floor: 1.08, trend: 0.17, s1: 1.22, s2: 1.39, majorAvg: 1.12, events: 4, note: "S2 MVP - dominated EML with 1.39" },
  { name: "Shaiiko", team: "Team Falcons", region: "EML", tier: "T1", role: "Star Flex", avg: 1.20, peak: 1.31, floor: 1.11, trend: 0.20, s1: 1.11, s2: 1.31, majorAvg: 1.19, events: 4, note: "GOAT candidate - never drops below 1.10" },
  { name: "Paluh", team: "Team Liquid", region: "SAL", tier: "T1", role: "Star Flex", avg: 1.20, peak: 1.33, floor: 0.95, trend: -0.04, s1: 1.27, s2: 1.23, majorAvg: 1.14, events: 4, note: "Brazilian GOAT - EWC 1.33" },
  { name: "Stompn", team: "G2 Esports", region: "EML", tier: "T1", role: "Star Flex", avg: 1.23, peak: 1.28, floor: 1.19, trend: -0.02, s1: 1.21, s2: 1.19, majorAvg: 1.26, events: 4, note: "Most consistent elite - never below 1.19" },
  { name: "CTZN", team: "DarkZero", region: "NAL", tier: "T1", role: "Star Flex", avg: 1.09, peak: 1.35, floor: 0.90, trend: -0.45, s1: 1.35, s2: 0.90, majorAvg: 1.16, events: 4, note: "S1 monster but massive S2 drop - concerning" },
  { name: "p4sh4", team: "Virtus.pro", region: "EML", tier: "T1", role: "Star Flex", avg: 1.15, peak: 1.23, floor: 1.07, trend: -0.16, s1: 1.23, s2: 1.07, majorAvg: 1.16, events: 3, note: "Solid but trending down" },
  
  // ENTRY FRAGGERS
  { name: "Jv92", team: "FURIA", region: "SAL", tier: "T1", role: "Entry", avg: 1.11, peak: 1.32, floor: 0.95, trend: 0.17, s1: 1.15, s2: 1.32, majorAvg: 0.99, events: 4, note: "S2 EXPLOSION +23 entry diff - elite aggression" },
  { name: "Maia", team: "Team Liquid", region: "SAL", tier: "T1", role: "Entry", avg: 1.18, peak: 1.28, floor: 1.08, trend: 0.20, s1: 1.08, s2: 1.28, majorAvg: null, events: 2, note: "BREAKOUT - massive S2 jump, watch closely" },
  { name: "dan", team: "Virtus.pro", region: "EML", tier: "T1", role: "Entry", avg: 1.17, peak: 1.47, floor: 0.95, trend: 0.13, s1: 0.95, s2: 1.08, majorAvg: 1.47, events: 3, note: "EWC MVP 1.47 - shows up BIG on stage" },
  { name: "Solotov", team: "Team Falcons", region: "EML", tier: "T1", role: "Entry", avg: 1.05, peak: 1.35, floor: 0.71, trend: 0.03, s1: 1.06, s2: 1.09, majorAvg: 1.03, events: 4, note: "Munich co-MVP but inconsistent" },
  { name: "Cyber", team: "FaZe Clan", region: "SAL", tier: "T1", role: "Entry", avg: 1.16, peak: 1.37, floor: 0.97, trend: -0.19, s1: 1.24, s2: 1.05, majorAvg: 1.17, events: 4, note: "EWC star 1.37 but S2 dip" },
  { name: "Dodez", team: "Team Liquid", region: "SAL", tier: "T1", role: "Entry", avg: 1.18, peak: 1.26, floor: 1.02, trend: -0.04, s1: 1.24, s2: 1.20, majorAvg: 1.14, events: 4, note: "Consistent elite entry" },
  { name: "Kheyze", team: "FURIA", region: "SAL", tier: "T1", role: "Entry", avg: 1.01, peak: 1.20, floor: 0.84, trend: 0.06, s1: 1.14, s2: 1.20, majorAvg: 0.85, events: 4, note: "+19 entry S2 - aggressive" },
  { name: "Loira", team: "G2 Esports", region: "EML", tier: "T1", role: "Entry", avg: 1.09, peak: 1.22, floor: 0.92, trend: -0.05, s1: 1.14, s2: 1.09, majorAvg: 1.07, events: 4, note: "EWC standout 1.22" },
  { name: "LikEfac", team: "Team Falcons", region: "EML", tier: "T1", role: "Entry", avg: 1.04, peak: 1.16, floor: 0.72, trend: 0.18, s1: 0.98, s2: 1.16, majorAvg: 0.88, events: 4, note: "Captain, trending up" },
  { name: "Bae", team: "Wildcard", region: "NAL", tier: "T1", role: "Entry", avg: 1.12, peak: 1.39, floor: 0.92, trend: 0.01, s1: 1.08, s2: 1.09, majorAvg: 1.16, events: 4, note: "NAL Finals MVP 1.39 - clutch player" },
  { name: "Dfuzr", team: "M80", region: "NAL", tier: "T1", role: "Entry", avg: 1.09, peak: 1.22, floor: 0.94, trend: 0.13, s1: 1.09, s2: 1.22, majorAvg: 1.03, events: 4, note: "Consistent, improving" },
  { name: "Gunnar", team: "M80", region: "NAL", tier: "T1", role: "Entry", avg: 1.09, peak: 1.26, floor: 0.98, trend: 0.14, s1: 0.98, s2: 1.12, majorAvg: 1.18, events: 4, note: "+12 entry NAL Finals" },
  { name: "Spoit", team: "Shopify Rebellion", region: "NAL", tier: "T1", role: "Entry", avg: 0.96, peak: 1.22, floor: 0.70, trend: -0.04, s1: 1.22, s2: 1.18, majorAvg: 0.84, events: 4, note: "EU import - inconsistent at majors" },
  { name: "Ashn", team: "SSG", region: "NAL", tier: "T1", role: "Entry", avg: 0.96, peak: 1.15, floor: 0.65, trend: -0.03, s1: 1.05, s2: 1.02, majorAvg: 0.83, events: 4, note: "NAL Finals 1.15" },
  { name: "Kanzen", team: "Wildcard", region: "NAL", tier: "T1", role: "Entry", avg: 0.97, peak: 1.16, floor: 0.59, trend: -0.14, s1: 1.14, s2: 1.00, majorAvg: 0.88, events: 4, note: "Munich 1.16 but inconsistent" },
  { name: "Nayqo", team: "Gen.G Esports", region: "EML", tier: "T1", role: "Entry", avg: 1.09, peak: 1.22, floor: 1.03, trend: 0.05, s1: 1.03, s2: 1.08, majorAvg: 1.22, events: 3, note: "Captain, EWC 1.22" },
  { name: "Mowwwgli", team: "Team Secret", region: "EML", tier: "T1", role: "Entry", avg: 0.96, peak: 1.05, floor: 0.81, trend: -0.10, s1: 1.05, s2: 0.95, majorAvg: 0.92, events: 4, note: "High entry diff but declining" },
  { name: "Fntzy", team: "NiP", region: "SAL", tier: "T1", role: "Entry", avg: 1.05, peak: 1.11, floor: 0.99, trend: -0.01, s1: 1.06, s2: 1.05, majorAvg: 1.05, events: 4, note: "Consistent mid-tier entry" },
  
  // FLEX PLAYERS
  { name: "Dias", team: "Team Liquid", region: "SAL", tier: "T1", role: "Flex", avg: 1.19, peak: 1.25, floor: 1.12, trend: 0.13, s1: 1.12, s2: 1.25, majorAvg: null, events: 2, note: "S2 BREAKOUT - very consistent" },
  { name: "Gaveni", team: "M80", region: "NAL", tier: "T1", role: "Flex", avg: 1.09, peak: 1.23, floor: 1.01, trend: 0.17, s1: 1.06, s2: 1.23, majorAvg: 1.05, events: 4, note: "BREAKOUT +0.17 - watch closely" },
  { name: "Atom", team: "Oxygen", region: "NAL", tier: "T1", role: "Flex", avg: 1.02, peak: 1.29, floor: 0.75, trend: 0.26, s1: 1.03, s2: 1.29, majorAvg: 0.90, events: 4, note: "BIGGEST IMPROVER +0.26" },
  { name: "HerdsZ", team: "FURIA", region: "SAL", tier: "T1", role: "Flex", avg: 1.08, peak: 1.19, floor: 0.86, trend: 0.17, s1: 1.02, s2: 1.19, majorAvg: 0.96, events: 4, note: "S2 breakout for FURIA" },
  { name: "Yuzus", team: "Team Falcons", region: "EML", tier: "T1", role: "Flex", avg: 1.07, peak: 1.19, floor: 0.90, trend: 0.06, s1: 1.13, s2: 1.19, majorAvg: 0.99, events: 4, note: "Clutch specialist" },
  { name: "Doki", team: "G2 Esports", region: "EML", tier: "T1", role: "Flex", avg: 1.05, peak: 1.23, floor: 0.89, trend: -0.19, s1: 1.13, s2: 0.94, majorAvg: 1.06, events: 4, note: "Munich 1.23 but S2 drop" },
  { name: "Hatez", team: "NiP", region: "SAL", tier: "T1", role: "Flex", avg: 1.07, peak: 1.15, floor: 0.94, trend: 0.11, s1: 1.04, s2: 1.15, majorAvg: 1.04, events: 4, note: "Solid, improving" },
  { name: "Nuers", team: "SSG", region: "NAL", tier: "T1", role: "Flex", avg: 1.10, peak: 1.32, floor: 0.99, trend: 0.07, s1: 1.09, s2: 1.16, majorAvg: 1.02, events: 4, note: "NAL Finals 1.32" },
  { name: "J9O", team: "SSG", region: "NAL", tier: "T1", role: "Flex", avg: 1.07, peak: 1.27, floor: 0.97, trend: -0.14, s1: 1.20, s2: 1.06, majorAvg: 1.02, events: 4, note: "Clutch king, NAL Finals 1.27" },
  { name: "Rexen", team: "Shopify Rebellion", region: "NAL", tier: "T1", role: "Flex", avg: 1.09, peak: 1.23, floor: 0.99, trend: -0.09, s1: 1.18, s2: 1.09, majorAvg: 1.12, events: 4, note: "Consistent" },
  { name: "njr", team: "DarkZero", region: "NAL", tier: "T1", role: "Flex", avg: 1.12, peak: 1.31, floor: 0.97, trend: -0.25, s1: 1.22, s2: 0.97, majorAvg: 1.15, events: 4, note: "EWC 1.31 but big S2 drop" },
  { name: "Noa", team: "Team Secret", region: "EML", tier: "T1", role: "Flex", avg: 1.03, peak: 1.18, floor: 0.96, trend: -0.21, s1: 1.17, s2: 0.96, majorAvg: 1.09, events: 4, note: "Declining form" },
  { name: "Kds", team: "FaZe Clan", region: "SAL", tier: "T1", role: "Flex", avg: 1.07, peak: 1.17, floor: 0.96, trend: -0.13, s1: 1.17, s2: 1.04, majorAvg: 1.03, events: 4, note: "Solid but trending down" },
  { name: "soulz1", team: "FaZe Clan", region: "SAL", tier: "T1", role: "Flex", avg: 1.02, peak: 1.20, floor: 0.77, trend: -0.13, s1: 1.20, s2: 1.07, majorAvg: 0.90, events: 4, note: "Big stage struggles" },
  { name: "Wizard", team: "NiP", region: "SAL", tier: "T1", role: "Flex", avg: 1.06, peak: 1.10, floor: 1.00, trend: 0.06, s1: 1.04, s2: 1.10, majorAvg: 1.05, events: 4, note: "8 clutches S1 - clutch god" },
  { name: "Gryxr", team: "Oxygen", region: "NAL", tier: "T1", role: "Flex", avg: 1.09, peak: 1.18, floor: 1.02, trend: -0.16, s1: 1.18, s2: 1.02, majorAvg: 1.11, events: 4, note: "Consistent performer" },
  { name: "Ambi", team: "Shopify Rebellion", region: "NAL", tier: "T1", role: "Flex", avg: 1.10, peak: 1.32, floor: 0.95, trend: -0.37, s1: 1.32, s2: 0.95, majorAvg: 1.07, events: 4, note: "S1 elite but massive S2 crash" },
  { name: "Kyno", team: "M80", region: "NAL", tier: "T1", role: "Flex", avg: 0.96, peak: 1.10, floor: 0.82, trend: 0.20, s1: 0.90, s2: 1.10, majorAvg: 0.94, events: 4, note: "Huge S2 improvement" },
  { name: "GMZ", team: "Oxygen", region: "NAL", tier: "T1", role: "Anchor", avg: 0.94, peak: 1.16, floor: 0.81, trend: 0.27, s1: 0.89, s2: 1.16, majorAvg: 0.81, events: 4, note: "BIGGEST S2 JUMP in NAL" },
  { name: "Yoggah", team: "Oxygen", region: "NAL", tier: "T1", role: "Flex", avg: 0.97, peak: 1.12, floor: 0.81, trend: 0.07, s1: 1.05, s2: 1.12, majorAvg: 0.85, events: 4, note: "Steady improvement" },
  
  // SUPPORT PLAYERS
  { name: "Adrian", team: "Team Secret", region: "EML", tier: "T1", role: "Support", avg: 1.12, peak: 1.35, floor: 0.94, trend: -0.02, s1: 1.10, s2: 1.08, majorAvg: 1.15, events: 4, note: "EWC 1.35 - elite support" },
  { name: "ShepparD", team: "Virtus.pro", region: "EML", tier: "T1", role: "Support", avg: 1.07, peak: 1.45, floor: 0.76, trend: -0.25, s1: 1.01, s2: 0.76, majorAvg: 1.11, events: 4, note: "EWC 1.45 but VERY inconsistent" },
  { name: "BriD", team: "Team Falcons", region: "EML", tier: "T1", role: "Support", avg: 1.01, peak: 1.10, floor: 0.94, trend: 0.08, s1: 0.94, s2: 1.02, majorAvg: 1.10, events: 4, note: "Plant king - 24 plants S2" },
  { name: "nade", team: "FURIA", region: "SAL", tier: "T1", role: "Support", avg: 1.05, peak: 1.15, floor: 0.98, trend: -0.09, s1: 1.07, s2: 0.98, majorAvg: 1.13, events: 4, note: "High KOST, plant machine" },
  { name: "Kondz", team: "NiP", region: "SAL", tier: "T1", role: "Support", avg: 0.94, peak: 1.05, floor: 0.84, trend: 0.18, s1: 0.84, s2: 1.02, majorAvg: 0.95, events: 4, note: "22 plants S2 - ultimate support" },
  { name: "BlaZ", team: "G2 Esports", region: "EML", tier: "T1", role: "Support", avg: 0.95, peak: 1.13, floor: 0.80, trend: 0.11, s1: 1.02, s2: 1.13, majorAvg: 0.83, events: 4, note: "Improving S2" },
  { name: "Savage", team: "Team Secret", region: "EML", tier: "T1", role: "IGL", avg: 1.05, peak: 1.16, floor: 0.99, trend: 0.03, s1: 0.99, s2: 1.02, majorAvg: 1.09, events: 4, note: "Captain, anchor god - EWC DEF 1.67" },
  { name: "Surf", team: "Shopify Rebellion", region: "NAL", tier: "T1", role: "Support", avg: 1.02, peak: 1.19, floor: 0.67, trend: 0.06, s1: 1.09, s2: 1.15, majorAvg: 0.93, events: 4, note: "High plant rate" },
  { name: "Fultz", team: "SSG", region: "NAL", tier: "T1", role: "Support", avg: 0.90, peak: 0.97, floor: 0.81, trend: 0.01, s1: 0.96, s2: 0.97, majorAvg: 0.88, events: 4, note: "Captain, plant machine" },
  { name: "Hotancold", team: "M80", region: "NAL", tier: "T1", role: "Support", avg: 0.89, peak: 0.99, floor: 0.74, trend: -0.10, s1: 0.96, s2: 0.86, majorAvg: 0.87, events: 4, note: "Captain, high plants" },
  { name: "Spiker", team: "Wildcard", region: "NAL", tier: "T1", role: "Support", avg: 1.01, peak: 1.05, floor: 0.93, trend: 0.05, s1: 1.00, s2: 1.05, majorAvg: 0.99, events: 4, note: "Captain, consistent" },
  { name: "VITAKING", team: "FaZe Clan", region: "SAL", tier: "T1", role: "Support", avg: 0.95, peak: 1.00, floor: 0.91, trend: -0.09, s1: 1.00, s2: 0.91, majorAvg: 0.95, events: 4, note: "Captain, DEF specialist" },
  { name: "pino", team: "NiP", region: "SAL", tier: "T1", role: "Support", avg: 1.02, peak: 1.11, floor: 0.98, trend: -0.06, s1: 1.04, s2: 0.98, majorAvg: 1.05, events: 4, note: "High KOST" },
  
  // IGLs
  { name: "Canadian", team: "Shopify Rebellion", region: "NAL", tier: "T1", role: "IGL", avg: 0.78, peak: 1.01, floor: 0.69, trend: -0.02, s1: 0.71, s2: 0.69, majorAvg: 0.87, events: 4, note: "Legendary IGL - stats don't tell story" },
  { name: "Alem4o", team: "G2 Esports", region: "EML", tier: "T1", role: "IGL", avg: 0.95, peak: 1.04, floor: 0.89, trend: -0.08, s1: 1.04, s2: 0.96, majorAvg: 0.90, events: 4, note: "Captain, Brazilian legend" },
  { name: "Always", team: "Virtus.pro", region: "EML", tier: "T1", role: "IGL", avg: 0.93, peak: 0.98, floor: 0.85, trend: -0.12, s1: 0.97, s2: 0.85, majorAvg: 0.98, events: 3, note: "Captain VP" },
  { name: "FelipoX", team: "FURIA", region: "SAL", tier: "T1", role: "IGL", avg: 1.03, peak: 1.19, floor: 0.85, trend: 0.23, s1: 0.85, s2: 1.08, majorAvg: 1.13, events: 4, note: "Captain, clutch god - Munich 1.19" },
  
  // T2 RISING STARS
  { name: "Sarks", team: "Heroic", region: "EML", tier: "T2", role: "Flex", avg: 1.17, peak: 1.21, floor: 1.13, trend: 0.08, s1: 1.13, s2: 1.21, majorAvg: null, events: 2, note: "T1 READY - consistent elite numbers" },
  { name: "Freq", team: "Shifters", region: "EML", tier: "T2", role: "Flex", avg: 1.06, peak: 1.21, floor: 0.91, trend: -0.16, s1: 1.21, s2: 1.05, majorAvg: 0.91, events: 3, note: "S1 elite flash - has ceiling" },
  { name: "Flastry", team: "LOS", region: "SAL", tier: "T2", role: "Flex", avg: 1.06, peak: 1.14, floor: 0.99, trend: 0.15, s1: 0.99, s2: 1.14, majorAvg: null, events: 2, note: "SAL T2 standout - improving fast" },
  { name: "peres", team: "Black Dragons", region: "SAL", tier: "T2", role: "Entry", avg: 1.05, peak: 1.21, floor: 0.90, trend: -0.31, s1: 1.21, s2: 0.90, majorAvg: null, events: 2, note: "High ceiling but inconsistent" },
  { name: "Bokzera", team: "Black Dragons", region: "SAL", tier: "T2", role: "Entry", avg: 1.03, peak: 1.19, floor: 0.88, trend: -0.31, s1: 1.19, s2: 0.88, majorAvg: null, events: 2, note: "Flashed elite S1" },
  { name: "R4re", team: "Black Dragons", region: "SAL", tier: "T2", role: "IGL", avg: 1.04, peak: 1.11, floor: 0.96, trend: 0.15, s1: 0.96, s2: 1.11, majorAvg: null, events: 2, note: "Captain, improving" },
  { name: "Robby", team: "Shifters", region: "EML", tier: "T2", role: "Anchor", avg: 1.01, peak: 1.07, floor: 0.89, trend: 0.17, s1: 0.89, s2: 1.06, majorAvg: 1.07, events: 3, note: "Strong DEF, improving" },
  { name: "garren", team: "WYLDE", region: "EML", tier: "T2", role: "Anchor", avg: 0.96, peak: 1.15, floor: 0.78, trend: -0.37, s1: 1.15, s2: 0.78, majorAvg: null, events: 2, note: "S1 standout but crashed S2" },
  { name: "Stk", team: "Black Dragons", region: "SAL", tier: "T2", role: "Entry", avg: 1.00, peak: 1.15, floor: 0.85, trend: -0.30, s1: 1.15, s2: 0.85, majorAvg: null, events: 2, note: "High ATK rating S1" },
  { name: "Virtue", team: "Shifters", region: "EML", tier: "T2", role: "Flex", avg: 0.91, peak: 1.00, floor: 0.86, trend: 0.12, s1: 0.88, s2: 1.00, majorAvg: 0.86, events: 3, note: "Improving steadily" },
  { name: "DEADSHT", team: "Gen.G Esports", region: "EML", tier: "T2", role: "Anchor", avg: 0.98, peak: 1.11, floor: 0.85, trend: 0.26, s1: 0.85, s2: 1.11, majorAvg: null, events: 2, note: "Strong S2, DEF specialist" },
  { name: "Lasmooo", team: "Shifters", region: "EML", tier: "T2", role: "Entry", avg: 0.95, peak: 1.02, floor: 0.89, trend: -0.09, s1: 1.02, s2: 0.93, majorAvg: 0.89, events: 3, note: "High entry diff" },
  { name: "handyy", team: "FaZe Clan", region: "SAL", tier: "T1", role: "Entry", avg: 1.05, peak: 1.09, floor: 1.03, trend: -0.01, s1: 1.09, s2: 1.08, majorAvg: 1.03, events: 3, note: "Consistent performer" },
  { name: "Wizaardv", team: "Heroic", region: "EML", tier: "T2", role: "Entry", avg: 1.05, peak: 1.07, floor: 1.03, trend: 0.04, s1: 1.03, s2: 1.07, majorAvg: null, events: 2, note: "High entry diff" },
  { name: "Jeggz", team: "Heroic", region: "EML", tier: "T2", role: "Anchor", avg: 1.03, peak: 1.10, floor: 0.96, trend: -0.14, s1: 1.10, s2: 0.96, majorAvg: null, events: 2, note: "Strong DEF" },
  
  // APAC
  { name: "Arcully", team: "Elevate", region: "APAC", tier: "T1", role: "Flex", avg: 1.35, peak: 1.35, floor: 1.35, trend: 0, s1: null, s2: null, majorAvg: 1.35, events: 1, note: "Munich co-MVP 1.35 - APAC star" },
  { name: "Tuhan", team: "SANDBOX", region: "APAC", tier: "T1", role: "Entry", avg: 1.02, peak: 1.25, floor: 0.80, trend: 0, s1: null, s2: null, majorAvg: 1.02, events: 2, note: "Munich 1.25" },
];

const categories = {
  WANT: { color: 'bg-green-500', label: '✅ WANT', textColor: 'text-white' },
  MAYBE: { color: 'bg-yellow-400', label: '🤔 MAYBE', textColor: 'text-black' },
  NO: { color: 'bg-red-500', label: '❌ NO', textColor: 'text-white' },
  WATCH: { color: 'bg-blue-500', label: '👀 WATCH', textColor: 'text-white' },
};

export default function ScoutingTool() {
  const [playerCategories, setPlayerCategories] = useState({});
  const [filter, setFilter] = useState({ region: 'ALL', role: 'ALL', tier: 'ALL', category: 'ALL' });
  const [sortBy, setSortBy] = useState('avg');
  const [searchTerm, setSearchTerm] = useState('');
  const [showExport, setShowExport] = useState(false);
  const [view, setView] = useState('table'); // 'table' or 'summary'
  
  const setCategory = (playerName, category) => {
    setPlayerCategories(prev => {
      if (prev[playerName] === category) {
        const { [playerName]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [playerName]: category };
    });
  };
  
  const filteredPlayers = useMemo(() => {
    return playersData
      .filter(p => {
        if (filter.region !== 'ALL' && p.region !== filter.region) return false;
        if (filter.role !== 'ALL' && !p.role.includes(filter.role)) return false;
        if (filter.tier !== 'ALL' && p.tier !== filter.tier) return false;
        if (filter.category !== 'ALL') {
          if (filter.category === 'UNCATEGORIZED') {
            if (playerCategories[p.name]) return false;
          } else {
            if (playerCategories[p.name] !== filter.category) return false;
          }
        }
        if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
            !p.team.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'avg') return b.avg - a.avg;
        if (sortBy === 'peak') return b.peak - a.peak;
        if (sortBy === 'trend') return b.trend - a.trend;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [filter, sortBy, searchTerm, playerCategories]);
  
  const stats = useMemo(() => {
    const want = Object.values(playerCategories).filter(c => c === 'WANT').length;
    const maybe = Object.values(playerCategories).filter(c => c === 'MAYBE').length;
    const no = Object.values(playerCategories).filter(c => c === 'NO').length;
    const watch = Object.values(playerCategories).filter(c => c === 'WATCH').length;
    return { want, maybe, no, watch, total: playersData.length };
  }, [playerCategories]);
  
  const exportPicks = () => {
    const picks = { WANT: [], MAYBE: [], WATCH: [], NO: [] };
    Object.entries(playerCategories).forEach(([name, cat]) => {
      const player = playersData.find(p => p.name === name);
      if (player) picks[cat].push(player);
    });
    return picks;
  };
  
  const getRatingColor = (rating) => {
    if (rating >= 1.20) return 'bg-green-100 text-green-800 font-bold';
    if (rating >= 1.10) return 'bg-yellow-100 text-yellow-800';
    if (rating >= 1.00) return 'bg-gray-100';
    return 'bg-red-100 text-red-700';
  };
  
  const getTrendColor = (trend) => {
    if (trend >= 0.15) return 'text-green-600 font-bold';
    if (trend >= 0.05) return 'text-green-500';
    if (trend <= -0.15) return 'text-red-600 font-bold';
    if (trend <= -0.05) return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
          🎮 R6 SIEGE ELITE SCOUTING TOOL
        </h1>
        <p className="text-gray-400 text-sm">Click players to categorize • Filter by role/region • Export your picks</p>
      </div>
      
      {/* Stats Bar */}
      <div className="flex justify-center gap-4 mb-4 flex-wrap">
        <div className="bg-green-600 px-4 py-2 rounded-lg">✅ Want: {stats.want}</div>
        <div className="bg-yellow-500 text-black px-4 py-2 rounded-lg">🤔 Maybe: {stats.maybe}</div>
        <div className="bg-blue-600 px-4 py-2 rounded-lg">👀 Watch: {stats.watch}</div>
        <div className="bg-red-600 px-4 py-2 rounded-lg">❌ No: {stats.no}</div>
        <div className="bg-gray-700 px-4 py-2 rounded-lg">Total: {stats.total}</div>
      </div>
      
      {/* View Toggle */}
      <div className="flex justify-center gap-2 mb-4">
        <button onClick={() => setView('table')} 
          className={`px-4 py-2 rounded ${view === 'table' ? 'bg-blue-600' : 'bg-gray-700'}`}>
          📊 Full Table
        </button>
        <button onClick={() => setView('summary')} 
          className={`px-4 py-2 rounded ${view === 'summary' ? 'bg-blue-600' : 'bg-gray-700'}`}>
          📋 My Picks Summary
        </button>
        <button onClick={() => setShowExport(!showExport)} 
          className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700">
          📤 Export
        </button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        <input 
          type="text" 
          placeholder="🔍 Search player or team..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="bg-gray-800 border border-gray-600 rounded px-3 py-2 w-48"
        />
        <select value={filter.region} onChange={e => setFilter({...filter, region: e.target.value})}
          className="bg-gray-800 border border-gray-600 rounded px-3 py-2">
          <option value="ALL">All Regions</option>
          <option value="NAL">🇺🇸 NAL</option>
          <option value="EML">🇪🇺 EML</option>
          <option value="SAL">🇧🇷 SAL</option>
          <option value="APAC">🌏 APAC</option>
        </select>
        <select value={filter.role} onChange={e => setFilter({...filter, role: e.target.value})}
          className="bg-gray-800 border border-gray-600 rounded px-3 py-2">
          <option value="ALL">All Roles</option>
          <option value="Entry">🎯 Entry</option>
          <option value="Star">⭐ Star Flex</option>
          <option value="Flex">🔄 Flex</option>
          <option value="Support">🛡️ Support</option>
          <option value="IGL">🧠 IGL</option>
          <option value="Anchor">🏰 Anchor</option>
        </select>
        <select value={filter.tier} onChange={e => setFilter({...filter, tier: e.target.value})}
          className="bg-gray-800 border border-gray-600 rounded px-3 py-2">
          <option value="ALL">All Tiers</option>
          <option value="T1">T1 Only</option>
          <option value="T2">T2 Rising</option>
        </select>
        <select value={filter.category} onChange={e => setFilter({...filter, category: e.target.value})}
          className="bg-gray-800 border border-gray-600 rounded px-3 py-2">
          <option value="ALL">All Categories</option>
          <option value="WANT">✅ Want</option>
          <option value="MAYBE">🤔 Maybe</option>
          <option value="WATCH">👀 Watch</option>
          <option value="NO">❌ No</option>
          <option value="UNCATEGORIZED">⬜ Uncategorized</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="bg-gray-800 border border-gray-600 rounded px-3 py-2">
          <option value="avg">Sort: Avg Rating</option>
          <option value="peak">Sort: Peak Rating</option>
          <option value="trend">Sort: Trend</option>
          <option value="name">Sort: Name</option>
        </select>
      </div>
      
      {/* Export Panel */}
      {showExport && (
        <div className="bg-gray-800 rounded-lg p-4 mb-4 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold mb-2">📤 Export Your Picks</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {Object.entries(exportPicks()).map(([cat, players]) => (
              <div key={cat} className="bg-gray-700 p-2 rounded">
                <div className="font-bold mb-1">{categories[cat]?.label || cat} ({players.length})</div>
                {players.map(p => (
                  <div key={p.name} className="text-gray-300">{p.name} ({p.team}) - {p.avg.toFixed(2)}</div>
                ))}
                {players.length === 0 && <div className="text-gray-500">None selected</div>}
              </div>
            ))}
          </div>
          <button 
            onClick={() => {
              const text = Object.entries(exportPicks())
                .map(([cat, players]) => `${cat}:\n${players.map(p => `  ${p.name} (${p.team}) - Avg: ${p.avg.toFixed(2)}, Peak: ${p.peak.toFixed(2)}`).join('\n') || '  None'}`)
                .join('\n\n');
              navigator.clipboard.writeText(text);
              alert('Copied to clipboard!');
            }}
            className="mt-2 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            📋 Copy to Clipboard
          </button>
        </div>
      )}
      
      {/* Summary View */}
      {view === 'summary' && (
        <div className="max-w-6xl mx-auto">
          {Object.entries(categories).map(([key, cat]) => {
            const players = playersData.filter(p => playerCategories[p.name] === key);
            if (players.length === 0) return null;
            return (
              <div key={key} className="mb-6">
                <h3 className={`text-xl font-bold mb-2 ${cat.color} ${cat.textColor} inline-block px-3 py-1 rounded`}>
                  {cat.label} ({players.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {players.sort((a,b) => b.avg - a.avg).map(p => (
                    <div key={p.name} className="bg-gray-800 p-3 rounded flex justify-between items-center">
                      <div>
                        <div className="font-bold">{p.name}</div>
                        <div className="text-sm text-gray-400">{p.team} • {p.role}</div>
                      </div>
                      <div className="text-right">
                        <div className={getRatingColor(p.avg) + ' px-2 py-1 rounded text-sm'}>{p.avg.toFixed(2)}</div>
                        <div className={`text-xs ${getTrendColor(p.trend)}`}>
                          {p.trend >= 0 ? '+' : ''}{p.trend.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {Object.keys(playerCategories).length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No players categorized yet. Switch to Full Table view and click on players to categorize them!
            </div>
          )}
        </div>
      )}
      
      {/* Table View */}
      {view === 'table' && (
        <div className="overflow-x-auto">
          <table className="w-full max-w-7xl mx-auto text-sm">
            <thead className="bg-gray-800 sticky top-0">
              <tr>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Player</th>
                <th className="p-2 text-left">Team</th>
                <th className="p-2">Region</th>
                <th className="p-2">Tier</th>
                <th className="p-2">Role</th>
                <th className="p-2">Avg</th>
                <th className="p-2">Peak</th>
                <th className="p-2">Trend</th>
                <th className="p-2 text-left">Scouting Note</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.map((p, i) => (
                <tr key={p.name} className={`border-b border-gray-700 hover:bg-gray-800 ${i % 2 === 0 ? 'bg-gray-850' : ''}`}>
                  <td className="p-2">
                    <div className="flex gap-1">
                      {Object.entries(categories).map(([key, cat]) => (
                        <button
                          key={key}
                          onClick={() => setCategory(p.name, key)}
                          className={`w-8 h-8 rounded text-xs ${playerCategories[p.name] === key ? cat.color + ' ' + cat.textColor : 'bg-gray-700 hover:bg-gray-600'}`}
                          title={cat.label}
                        >
                          {key === 'WANT' ? '✅' : key === 'MAYBE' ? '🤔' : key === 'NO' ? '❌' : '👀'}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="p-2 font-bold">{p.name}</td>
                  <td className="p-2 text-gray-300">{p.team}</td>
                  <td className="p-2 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      p.region === 'NAL' ? 'bg-blue-900' : 
                      p.region === 'EML' ? 'bg-purple-900' : 
                      p.region === 'SAL' ? 'bg-green-900' : 'bg-orange-900'
                    }`}>{p.region}</span>
                  </td>
                  <td className="p-2 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${p.tier === 'T1' ? 'bg-yellow-700' : 'bg-gray-600'}`}>
                      {p.tier}
                    </span>
                  </td>
                  <td className="p-2 text-center text-xs">{p.role}</td>
                  <td className={`p-2 text-center ${getRatingColor(p.avg)} rounded`}>{p.avg.toFixed(2)}</td>
                  <td className={`p-2 text-center ${getRatingColor(p.peak)} rounded`}>{p.peak.toFixed(2)}</td>
                  <td className={`p-2 text-center ${getTrendColor(p.trend)}`}>
                    {p.trend >= 0 ? '+' : ''}{p.trend.toFixed(2)}
                  </td>
                  <td className="p-2 text-xs text-gray-400 max-w-xs truncate" title={p.note}>{p.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPlayers.length === 0 && (
            <div className="text-center text-gray-500 py-8">No players match your filters</div>
          )}
        </div>
      )}
      
      {/* Footer */}
      <div className="text-center text-gray-500 text-xs mt-8">
        Data: siege.gg | Rosters: Liquipedia Jan 2026 | {playersData.length} players analyzed
      </div>
    </div>
  );
}
