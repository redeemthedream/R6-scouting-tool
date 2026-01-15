import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';

// COMPLETE player database - ALL players from ALL teams with star markers and Twitter handles
const playersData = [
  // ============================================
  // NAL - SHOPIFY REBELLION
  // ============================================
  { name: "Canadian", team: "Shopify Rebellion", region: "NAL", tier: "T1", role: "IGL/Support", avg: 0.78, peak: 1.01, floor: 0.69, trend: -0.02, s1: 0.71, s2: 0.69, majorAvg: 0.87, events: 4, note: "Legendary IGL - stats don't tell story", star: true, twitter: "Canadian_R6" },
  { name: "Spoit", team: "Shopify Rebellion", region: "NAL", tier: "T1", role: "Entry", avg: 0.96, peak: 1.22, floor: 0.70, trend: -0.04, s1: 1.22, s2: 1.18, majorAvg: 0.84, events: 4, note: "EU import - inconsistent at majors", star: false, twitter: "Spoit_R6" },
  { name: "Surf", team: "Shopify Rebellion", region: "NAL", tier: "T1", role: "Support", avg: 1.02, peak: 1.19, floor: 0.67, trend: 0.06, s1: 1.09, s2: 1.15, majorAvg: 0.93, events: 4, note: "High plant rate, consistent", star: false, twitter: "Surf_R6S" },
  { name: "Rexen", team: "Shopify Rebellion", region: "NAL", tier: "T1", role: "Flex", avg: 1.09, peak: 1.23, floor: 0.99, trend: -0.09, s1: 1.18, s2: 1.09, majorAvg: 1.12, events: 4, note: "Consistent performer", star: false, twitter: "Rexen_R6" },
  { name: "Ambi", team: "Shopify Rebellion", region: "NAL", tier: "T1", role: "Flex", avg: 1.10, peak: 1.32, floor: 0.95, trend: -0.37, s1: 1.32, s2: 0.95, majorAvg: 1.07, events: 4, note: "S1 elite but massive S2 crash", star: false, twitter: "AmbiR6S" },

  // ============================================
  // NAL - DARKZERO
  // ============================================
  { name: "Nafe", team: "DarkZero", region: "NAL", tier: "T1", role: "IGL/Support", avg: 0.96, peak: 1.07, floor: 0.82, trend: -0.07, s1: 1.04, s2: 0.97, majorAvg: 0.93, events: 4, note: "IGL, veteran caller, high plants", star: false, twitter: "NafeR6" },
  { name: "CTZN", team: "DarkZero", region: "NAL", tier: "T1", role: "Star Flex", avg: 1.09, peak: 1.35, floor: 0.90, trend: -0.45, s1: 1.35, s2: 0.90, majorAvg: 1.16, events: 4, note: "S1 monster but massive S2 drop - concerning", star: true, twitter: "CABORZAN" },
  { name: "njr", team: "DarkZero", region: "NAL", tier: "T1", role: "Flex", avg: 1.12, peak: 1.31, floor: 0.97, trend: -0.25, s1: 1.22, s2: 0.97, majorAvg: 1.15, events: 4, note: "EWC 1.31 but big S2 drop", star: false, twitter: "njrR6" },
  { name: "SpiriTz", team: "DarkZero", region: "NAL", tier: "T1", role: "Flex", avg: 0.93, peak: 0.98, floor: 0.82, trend: 0.00, s1: 0.95, s2: 0.95, majorAvg: 0.98, events: 4, note: "Steady, no peaks no valleys", star: false, twitter: "SpiriTzR6" },
  { name: "Pamba", team: "DarkZero", region: "NAL", tier: "T1", role: "Support", avg: 0.88, peak: 0.95, floor: 0.80, trend: -0.05, s1: 0.92, s2: 0.87, majorAvg: 0.85, events: 4, note: "Support player, high KOST", star: false, twitter: "PambaR6" },

  // ============================================
  // NAL - SSG (Spacestation Gaming)
  // ============================================
  { name: "Fultz", team: "SSG", region: "NAL", tier: "T1", role: "IGL/Support", avg: 0.90, peak: 0.97, floor: 0.81, trend: 0.01, s1: 0.96, s2: 0.97, majorAvg: 0.88, events: 4, note: "IGL, captain, plant machine", star: true, twitter: "FultzR6" },
  { name: "Nuers", team: "SSG", region: "NAL", tier: "T1", role: "Flex", avg: 1.10, peak: 1.32, floor: 0.99, trend: 0.07, s1: 1.09, s2: 1.16, majorAvg: 1.02, events: 4, note: "NAL Finals 1.32 - star flex", star: true, twitter: "NuersR6" },
  { name: "J9O", team: "SSG", region: "NAL", tier: "T1", role: "Flex", avg: 1.07, peak: 1.27, floor: 0.97, trend: -0.14, s1: 1.20, s2: 1.06, majorAvg: 1.02, events: 4, note: "Clutch king, NAL Finals 1.27", star: false, twitter: "J9OR6" },
  { name: "Benjamaster", team: "SSG", region: "NAL", tier: "T1", role: "Anchor", avg: 1.00, peak: 1.33, floor: 0.70, trend: -0.12, s1: 0.99, s2: 0.87, majorAvg: 0.98, events: 4, note: "NAL Finals 1.33 PEAK - inconsistent", star: false, twitter: "BenjamasterR6" },
  { name: "Ashn", team: "SSG", region: "NAL", tier: "T1", role: "Entry", avg: 0.96, peak: 1.15, floor: 0.65, trend: -0.03, s1: 1.05, s2: 1.02, majorAvg: 0.83, events: 4, note: "NAL Finals 1.15, inconsistent", star: false, twitter: "AshnR6" },

  // ============================================
  // NAL - M80
  // ============================================
  { name: "Hotancold", team: "M80", region: "NAL", tier: "T1", role: "IGL/Support", avg: 0.89, peak: 0.99, floor: 0.74, trend: -0.10, s1: 0.96, s2: 0.86, majorAvg: 0.87, events: 4, note: "IGL, captain, high plants", star: true, twitter: "HotancoldR6" },
  { name: "Dfuzr", team: "M80", region: "NAL", tier: "T1", role: "Star Entry", avg: 1.09, peak: 1.22, floor: 0.94, trend: 0.13, s1: 1.09, s2: 1.22, majorAvg: 1.03, events: 4, note: "Consistent, S2 breakout", star: true, twitter: "DfuzrR6" },
  { name: "Gunnar", team: "M80", region: "NAL", tier: "T1", role: "Entry", avg: 1.09, peak: 1.26, floor: 0.98, trend: 0.14, s1: 0.98, s2: 1.12, majorAvg: 1.18, events: 4, note: "+12 entry NAL Finals", star: false, twitter: "GunnarR6" },
  { name: "Gaveni", team: "M80", region: "NAL", tier: "T1", role: "Star Flex", avg: 1.09, peak: 1.23, floor: 1.01, trend: 0.17, s1: 1.06, s2: 1.23, majorAvg: 1.05, events: 4, note: "BREAKOUT +0.17 - watch closely", star: true, twitter: "GaveniR6" },
  { name: "Kyno", team: "M80", region: "NAL", tier: "T1", role: "Flex", avg: 0.96, peak: 1.10, floor: 0.82, trend: 0.20, s1: 0.90, s2: 1.10, majorAvg: 0.94, events: 4, note: "Huge S2 improvement", star: false, twitter: "KynoR6" },

  // ============================================
  // NAL - OXYGEN ESPORTS
  // ============================================
  { name: "Forrest", team: "Oxygen", region: "NAL", tier: "T1", role: "IGL/Support", avg: 0.91, peak: 1.04, floor: 0.78, trend: 0.05, s1: 0.93, s2: 0.98, majorAvg: 0.88, events: 4, note: "IGL, young captain, improving", star: false, twitter: "ForrestR6S" },
  { name: "Gryxr", team: "Oxygen", region: "NAL", tier: "T1", role: "Star Flex", avg: 1.09, peak: 1.18, floor: 1.02, trend: -0.16, s1: 1.18, s2: 1.02, majorAvg: 1.11, events: 4, note: "Consistent performer", star: true, twitter: "GryxrR6" },
  { name: "Yoggah", team: "Oxygen", region: "NAL", tier: "T1", role: "Flex", avg: 0.97, peak: 1.12, floor: 0.81, trend: 0.07, s1: 1.05, s2: 1.12, majorAvg: 0.85, events: 4, note: "Steady improvement", star: false, twitter: "YoggahR6" },
  { name: "Atom", team: "Oxygen", region: "NAL", tier: "T1", role: "Star Flex", avg: 1.02, peak: 1.29, floor: 0.75, trend: 0.26, s1: 1.03, s2: 1.29, majorAvg: 0.90, events: 4, note: "BIGGEST IMPROVER +0.26", star: true, twitter: "AtomR6S" },
  { name: "GMZ", team: "Oxygen", region: "NAL", tier: "T1", role: "Anchor", avg: 0.94, peak: 1.16, floor: 0.81, trend: 0.27, s1: 0.89, s2: 1.16, majorAvg: 0.81, events: 4, note: "BIGGEST S2 JUMP in NAL - anchor beast", star: false, twitter: "GMZR6" },

  // ============================================
  // NAL - WILDCARD
  // ============================================
  { name: "Spiker", team: "Wildcard", region: "NAL", tier: "T1", role: "IGL/Support", avg: 1.01, peak: 1.05, floor: 0.93, trend: 0.05, s1: 1.00, s2: 1.05, majorAvg: 0.99, events: 4, note: "IGL, captain, consistent", star: true, twitter: "SpikerR6" },
  { name: "Bae", team: "Wildcard", region: "NAL", tier: "T1", role: "Star Entry", avg: 1.12, peak: 1.39, floor: 0.92, trend: 0.01, s1: 1.08, s2: 1.09, majorAvg: 1.16, events: 4, note: "NAL Finals MVP 1.39 - clutch player", star: true, twitter: "BaeR6S" },
  { name: "Kanzen", team: "Wildcard", region: "NAL", tier: "T1", role: "Entry", avg: 0.97, peak: 1.16, floor: 0.59, trend: -0.14, s1: 1.14, s2: 1.00, majorAvg: 0.88, events: 4, note: "Munich 1.16 but inconsistent", star: false, twitter: "KanzenR6" },
  { name: "BBYSharkk", team: "Wildcard", region: "NAL", tier: "T1", role: "Flex", avg: 1.00, peak: 1.07, floor: 0.88, trend: 0.19, s1: 0.88, s2: 1.07, majorAvg: 0.99, events: 4, note: "S2 improvement", star: false, twitter: "BBYSharkk" },
  { name: "Dash", team: "Wildcard", region: "NAL", tier: "T1", role: "Flex", avg: 0.92, peak: 1.00, floor: 0.61, trend: 0.16, s1: 0.84, s2: 1.00, majorAvg: 0.61, events: 4, note: "Big S2 improvement, struggled at Finals", star: false, twitter: "d4shR6" },

  // ============================================
  // NAL - CLOUD9 (T2)
  // ============================================
  { name: "Gity", team: "Cloud9", region: "NAL", tier: "T2", role: "Flex", avg: 0.97, peak: 1.03, floor: 0.88, trend: 0.13, s1: 0.90, s2: 1.03, majorAvg: null, events: 2, note: "Strong S2 improvement", star: false, twitter: "GityR6" },
  { name: "Silent", team: "Cloud9", region: "NAL", tier: "T2", role: "Flex", avg: 1.02, peak: 1.13, floor: 0.98, trend: -0.06, s1: 1.05, s2: 0.99, majorAvg: null, events: 2, note: "Consistent performer", star: true, twitter: "SilentR6S" },
  { name: "Kobelax", team: "Cloud9", region: "NAL", tier: "T2", role: "Flex", avg: 0.99, peak: 1.12, floor: 0.91, trend: -0.15, s1: 1.06, s2: 0.91, majorAvg: null, events: 2, note: "S1 standout, S2 dip", star: false, twitter: "KobelaxR6" },
  { name: "Dream", team: "Cloud9", region: "NAL", tier: "T2", role: "Support", avg: 0.83, peak: 0.90, floor: 0.75, trend: 0.15, s1: 0.75, s2: 0.90, majorAvg: null, events: 2, note: "Improving support", star: false, twitter: "DreamR6S" },
  { name: "Hat", team: "Cloud9", region: "NAL", tier: "T2", role: "Entry", avg: 0.65, peak: 0.65, floor: 0.65, trend: 0, s1: null, s2: 0.65, majorAvg: null, events: 1, note: "New addition S2", star: false, twitter: "HatR6" },

  // ============================================
  // NAL - ENVY (T2)
  // ============================================
  { name: "Snake", team: "ENVY", region: "NAL", tier: "T2", role: "Star Entry", avg: 0.93, peak: 1.05, floor: 0.80, trend: 0.25, s1: 0.80, s2: 1.05, majorAvg: null, events: 2, note: "HUGE S2 breakout +0.25", star: true, twitter: "SnakeR6S" },
  { name: "ATKRival", team: "ENVY", region: "NAL", tier: "T2", role: "Flex", avg: 0.82, peak: 0.84, floor: 0.78, trend: 0.05, s1: 0.79, s2: 0.84, majorAvg: null, events: 2, note: "Steady flex", star: false, twitter: "ATKRivalR6" },
  { name: "Aiden", team: "ENVY", region: "NAL", tier: "T2", role: "Entry", avg: 0.81, peak: 0.81, floor: 0.81, trend: 0, s1: null, s2: 0.81, majorAvg: null, events: 1, note: "New S2 entry", star: false, twitter: "AidenR6S" },
  { name: "JJBlaztful", team: "ENVY", region: "NAL", tier: "T2", role: "IGL/Support", avg: 0.67, peak: 0.75, floor: 0.58, trend: 0.17, s1: 0.58, s2: 0.75, majorAvg: null, events: 2, note: "IGL, improving", star: false, twitter: "JJBlaztful" },
  { name: "Emilio", team: "ENVY", region: "NAL", tier: "T2", role: "Support", avg: 0.72, peak: 0.91, floor: 0.42, trend: 0.07, s1: 0.68, s2: 0.75, majorAvg: null, events: 2, note: "Support player", star: false, twitter: "EmilioR6" },

  // ============================================
  // NAL - LFO (T2)
  // ============================================
  { name: "Eddy", team: "LFO", region: "NAL", tier: "T2", role: "Star Entry", avg: 0.91, peak: 1.04, floor: 0.78, trend: -0.25, s1: 1.03, s2: 0.78, majorAvg: null, events: 2, note: "S1 star but big S2 drop", star: true, twitter: "EddyR6S" },
  { name: "Fenz", team: "LFO", region: "NAL", tier: "T2", role: "Flex", avg: 0.88, peak: 1.04, floor: 0.82, trend: -0.11, s1: 0.93, s2: 0.82, majorAvg: null, events: 2, note: "Declining form", star: false, twitter: "FenzR6" },
  { name: "Epic", team: "LFO", region: "NAL", tier: "T2", role: "Flex", avg: 0.84, peak: 1.10, floor: 0.67, trend: -0.07, s1: 0.87, s2: 0.80, majorAvg: null, events: 2, note: "DEF specialist", star: false, twitter: "EpicR6S" },
  { name: "Kixhro", team: "LFO", region: "NAL", tier: "T2", role: "Flex", avg: 0.79, peak: 1.10, floor: 0.67, trend: -0.24, s1: 0.91, s2: 0.67, majorAvg: null, events: 2, note: "ATK specialist but crashed S2", star: false, twitter: "KixhroR6" },
  { name: "Beeno", team: "LFO", region: "NAL", tier: "T2", role: "IGL/Support", avg: 0.81, peak: 0.91, floor: 0.57, trend: 0.15, s1: 0.73, s2: 0.88, majorAvg: null, events: 2, note: "IGL, plant king 14%", star: false, twitter: "BeenoR6" },

  // ============================================
  // NAL - TEAM CRUELTY (T2)
  // ============================================
  { name: "Pyroxz", team: "Team Cruelty", region: "NAL", tier: "T2", role: "Star Flex", avg: 0.99, peak: 1.02, floor: 0.90, trend: 0.07, s1: 0.95, s2: 1.02, majorAvg: null, events: 2, note: "Team star, consistent", star: true, twitter: "PyroxzR6" },
  { name: "Fatal", team: "Team Cruelty", region: "NAL", tier: "T2", role: "Flex", avg: 0.84, peak: 1.11, floor: 0.63, trend: -0.41, s1: 1.04, s2: 0.63, majorAvg: null, events: 2, note: "HUGE S2 crash from S1 star", star: false, twitter: "FatalR6S" },
  { name: "Rovi", team: "Team Cruelty", region: "NAL", tier: "T2", role: "Flex", avg: 0.69, peak: 0.69, floor: 0.69, trend: 0, s1: null, s2: 0.69, majorAvg: null, events: 1, note: "New S2 addition", star: false, twitter: "RoviR6" },
  { name: "Motumbo", team: "Team Cruelty", region: "NAL", tier: "T2", role: "Support", avg: 0.66, peak: 0.73, floor: 0.59, trend: -0.14, s1: 0.73, s2: 0.59, majorAvg: null, events: 2, note: "Plant specialist 19%", star: false, twitter: "MotumboR6" },
  { name: "CadenT", team: "Team Cruelty", region: "NAL", tier: "T2", role: "Entry", avg: 0.59, peak: 0.59, floor: 0.59, trend: 0, s1: null, s2: 0.59, majorAvg: null, events: 1, note: "New S2 entry", star: false, twitter: "CadenTR6" },

  // ============================================
  // EML - G2 ESPORTS
  // ============================================
  { name: "Alem4o", team: "G2 Esports", region: "EML", tier: "T1", role: "IGL/Support", avg: 0.95, peak: 1.04, floor: 0.89, trend: -0.08, s1: 1.04, s2: 0.96, majorAvg: 0.90, events: 4, note: "IGL, Brazilian legend", star: true, twitter: "Alem4oR6" },
  { name: "Stompn", team: "G2 Esports", region: "EML", tier: "T1", role: "Star Flex", avg: 1.23, peak: 1.28, floor: 1.19, trend: -0.02, s1: 1.21, s2: 1.19, majorAvg: 1.26, events: 4, note: "Most consistent elite - never below 1.19", star: true, twitter: "StompnR6" },
  { name: "Doki", team: "G2 Esports", region: "EML", tier: "T1", role: "Flex", avg: 1.05, peak: 1.23, floor: 0.89, trend: -0.19, s1: 1.13, s2: 0.94, majorAvg: 1.06, events: 4, note: "Munich 1.23 but S2 drop", star: false, twitter: "DokiR6S" },
  { name: "Loira", team: "G2 Esports", region: "EML", tier: "T1", role: "Star Entry", avg: 1.09, peak: 1.22, floor: 0.92, trend: -0.05, s1: 1.14, s2: 1.09, majorAvg: 1.07, events: 4, note: "EWC standout 1.22", star: true, twitter: "LoiraR6" },
  { name: "BlaZ", team: "G2 Esports", region: "EML", tier: "T1", role: "Support", avg: 0.95, peak: 1.13, floor: 0.80, trend: 0.11, s1: 1.02, s2: 1.13, majorAvg: 0.83, events: 4, note: "Improving S2", star: false, twitter: "BlaZR6S" },

  // ============================================
  // EML - TEAM FALCONS
  // ============================================
  { name: "BriD", team: "Team Falcons", region: "EML", tier: "T1", role: "IGL/Support", avg: 1.01, peak: 1.10, floor: 0.94, trend: 0.08, s1: 0.94, s2: 1.02, majorAvg: 1.10, events: 4, note: "IGL, plant king - 24 plants S2", star: true, twitter: "BriDR6S" },
  { name: "Shaiiko", team: "Team Falcons", region: "EML", tier: "T1", role: "Star Flex", avg: 1.20, peak: 1.31, floor: 1.11, trend: 0.20, s1: 1.11, s2: 1.31, majorAvg: 1.19, events: 4, note: "GOAT candidate - never drops below 1.10", star: true, twitter: "ShaikkoR6" },
  { name: "Solotov", team: "Team Falcons", region: "EML", tier: "T1", role: "Star Entry", avg: 1.05, peak: 1.35, floor: 0.71, trend: 0.03, s1: 1.06, s2: 1.09, majorAvg: 1.03, events: 4, note: "Munich co-MVP but inconsistent", star: true, twitter: "SolotovR6" },
  { name: "LikEfac", team: "Team Falcons", region: "EML", tier: "T1", role: "Entry", avg: 1.04, peak: 1.16, floor: 0.72, trend: 0.18, s1: 0.98, s2: 1.16, majorAvg: 0.88, events: 4, note: "Captain, trending up", star: false, twitter: "LikEfacR6" },
  { name: "Yuzus", team: "Team Falcons", region: "EML", tier: "T1", role: "Flex", avg: 1.07, peak: 1.19, floor: 0.90, trend: 0.06, s1: 1.13, s2: 1.19, majorAvg: 0.99, events: 4, note: "Clutch specialist", star: false, twitter: "YuzusR6" },

  // ============================================
  // EML - TEAM SECRET
  // ============================================
  { name: "Savage", team: "Team Secret", region: "EML", tier: "T1", role: "IGL/Anchor", avg: 1.05, peak: 1.16, floor: 0.99, trend: 0.03, s1: 0.99, s2: 1.02, majorAvg: 1.09, events: 4, note: "IGL, anchor god - EWC DEF 1.67", star: true, twitter: "SavageR6S" },
  { name: "Jume", team: "Team Secret", region: "EML", tier: "T1", role: "Star Flex", avg: 1.21, peak: 1.39, floor: 1.08, trend: 0.17, s1: 1.22, s2: 1.39, majorAvg: 1.12, events: 4, note: "S2 MVP - dominated EML with 1.39", star: true, twitter: "JumeR6" },
  { name: "Adrian", team: "Team Secret", region: "EML", tier: "T1", role: "Star Support", avg: 1.12, peak: 1.35, floor: 0.94, trend: -0.02, s1: 1.10, s2: 1.08, majorAvg: 1.15, events: 4, note: "EWC 1.35 - elite support", star: true, twitter: "AdrianR6S" },
  { name: "Mowwwgli", team: "Team Secret", region: "EML", tier: "T1", role: "Entry", avg: 0.96, peak: 1.05, floor: 0.81, trend: -0.10, s1: 1.05, s2: 0.95, majorAvg: 0.92, events: 4, note: "High entry diff but declining", star: false, twitter: "MowwwgliR6" },
  { name: "Noa", team: "Team Secret", region: "EML", tier: "T1", role: "Flex", avg: 1.03, peak: 1.18, floor: 0.96, trend: -0.21, s1: 1.17, s2: 0.96, majorAvg: 1.09, events: 4, note: "Declining form", star: false, twitter: "NoaR6S" },

  // ============================================
  // EML - VIRTUS.PRO
  // ============================================
  { name: "Always", team: "Virtus.pro", region: "EML", tier: "T1", role: "IGL/Support", avg: 0.93, peak: 0.98, floor: 0.85, trend: -0.12, s1: 0.97, s2: 0.85, majorAvg: 0.98, events: 3, note: "IGL, captain VP", star: false, twitter: "AlwaysR6S" },
  { name: "dan", team: "Virtus.pro", region: "EML", tier: "T1", role: "Star Entry", avg: 1.17, peak: 1.47, floor: 0.95, trend: 0.13, s1: 0.95, s2: 1.08, majorAvg: 1.47, events: 3, note: "EWC MVP 1.47 - big stage monster", star: true, twitter: "danR6S" },
  { name: "p4sh4", team: "Virtus.pro", region: "EML", tier: "T1", role: "Star Flex", avg: 1.15, peak: 1.23, floor: 1.07, trend: -0.16, s1: 1.23, s2: 1.07, majorAvg: 1.16, events: 3, note: "Solid but trending down", star: true, twitter: "p4sh4R6" },
  { name: "ShepparD", team: "Virtus.pro", region: "EML", tier: "T1", role: "Star Support", avg: 1.07, peak: 1.45, floor: 0.76, trend: -0.25, s1: 1.01, s2: 0.76, majorAvg: 1.11, events: 4, note: "EWC 1.45 but VERY inconsistent", star: true, twitter: "ShepparDR6S" },
  { name: "JoyStiCK", team: "Virtus.pro", region: "EML", tier: "T1", role: "Flex", avg: 0.91, peak: 1.03, floor: 0.75, trend: -0.19, s1: 0.94, s2: 0.75, majorAvg: 1.03, events: 3, note: "EWC 1.03, S2 slump", star: false, twitter: "JoyStiCKR6" },

  // ============================================
  // EML - GEN.G ESPORTS
  // ============================================
  { name: "Nayqo", team: "Gen.G Esports", region: "EML", tier: "T1", role: "Entry/IGL", avg: 1.09, peak: 1.22, floor: 1.03, trend: 0.05, s1: 1.03, s2: 1.08, majorAvg: 1.22, events: 3, note: "IGL, captain, EWC 1.22 - fragging caller", star: true, twitter: "NayqoR6" },
  { name: "DEADSHT", team: "Gen.G Esports", region: "EML", tier: "T1", role: "Star Anchor", avg: 0.98, peak: 1.11, floor: 0.85, trend: 0.26, s1: 0.85, s2: 1.11, majorAvg: null, events: 2, note: "Strong S2, DEF specialist +0.26", star: true, twitter: "DEADSHTR6" },
  { name: "SkyZs", team: "Gen.G Esports", region: "EML", tier: "T1", role: "Entry", avg: 1.02, peak: 1.15, floor: 0.90, trend: 0.08, s1: 0.94, s2: 1.02, majorAvg: 1.15, events: 3, note: "Improving entry", star: false, twitter: "SkyZsR6" },
  { name: "Asa", team: "Gen.G Esports", region: "EML", tier: "T1", role: "Support", avg: 0.94, peak: 1.05, floor: 0.85, trend: 0.05, s1: 0.89, s2: 0.94, majorAvg: 1.05, events: 3, note: "Support player", star: false, twitter: "AsaR6S" },
  { name: "Quartz", team: "Gen.G Esports", region: "EML", tier: "T1", role: "Flex", avg: 0.96, peak: 1.08, floor: 0.88, trend: -0.05, s1: 1.01, s2: 0.96, majorAvg: 0.92, events: 3, note: "Flexible player", star: false, twitter: "QuartzR6" },

  // ============================================
  // EML - FNATIC (T1) - formerly Heroic
  // ============================================
  { name: "Sarks", team: "Fnatic", region: "EML", tier: "T1", role: "Star Flex", avg: 1.17, peak: 1.21, floor: 1.13, trend: 0.08, s1: 1.13, s2: 1.21, majorAvg: null, events: 2, note: "T1 READY - consistent elite numbers", star: true, twitter: "SarksR6" },
  { name: "Wizaardv", team: "Fnatic", region: "EML", tier: "T1", role: "Star Entry", avg: 1.05, peak: 1.07, floor: 1.03, trend: 0.04, s1: 1.03, s2: 1.07, majorAvg: null, events: 2, note: "High entry diff", star: true, twitter: "WizaardvR6" },
  { name: "Deapek", team: "Fnatic", region: "EML", tier: "T1", role: "Flex", avg: 1.02, peak: 1.08, floor: 0.96, trend: 0.05, s1: 0.98, s2: 1.03, majorAvg: null, events: 2, note: "Consistent flex player", star: false, twitter: "DeapekR6" },
  { name: "Jeggz", team: "Fnatic", region: "EML", tier: "T1", role: "Anchor", avg: 1.03, peak: 1.10, floor: 0.96, trend: -0.14, s1: 1.10, s2: 0.96, majorAvg: null, events: 2, note: "Strong DEF", star: false, twitter: "JeggzR6" },
  { name: "croqson", team: "Fnatic", region: "EML", tier: "T1", role: "Support", avg: 0.92, peak: 0.98, floor: 0.86, trend: 0.04, s1: 0.88, s2: 0.92, majorAvg: null, events: 2, note: "Solid support player", star: false, twitter: "croqsonR6" },

  // ============================================
  // EML - TEAM BDS (T1) - formerly Shifters
  // ============================================
  { name: "P4", team: "Team BDS", region: "EML", tier: "T1", role: "IGL/Support", avg: 0.88, peak: 0.95, floor: 0.80, trend: 0.02, s1: 0.87, s2: 0.89, majorAvg: 0.85, events: 3, note: "IGL", star: false, twitter: "P4R6S" },
  { name: "Freq", team: "Team BDS", region: "EML", tier: "T1", role: "Star Flex", avg: 1.06, peak: 1.21, floor: 0.91, trend: -0.16, s1: 1.21, s2: 1.05, majorAvg: 0.91, events: 3, note: "S1 elite flash - has ceiling", star: true, twitter: "FreqR6" },
  { name: "Lasmooo", team: "Team BDS", region: "EML", tier: "T1", role: "Entry", avg: 0.95, peak: 1.02, floor: 0.89, trend: -0.09, s1: 1.02, s2: 0.93, majorAvg: 0.89, events: 3, note: "High entry diff", star: false, twitter: "LasmoooR6" },
  { name: "Robby", team: "Team BDS", region: "EML", tier: "T1", role: "Star Anchor", avg: 1.01, peak: 1.07, floor: 0.89, trend: 0.17, s1: 0.89, s2: 1.06, majorAvg: 1.07, events: 3, note: "Strong DEF, improving", star: true, twitter: "RobbyR6S" },
  { name: "Virtue", team: "Team BDS", region: "EML", tier: "T1", role: "Flex", avg: 0.91, peak: 1.00, floor: 0.86, trend: 0.12, s1: 0.88, s2: 1.00, majorAvg: 0.86, events: 3, note: "Improving steadily", star: false, twitter: "VirtueR6" },

  // ============================================
  // EML - WOLVES (T2)
  // ============================================
  { name: "nudl", team: "Wolves", region: "EML", tier: "T2", role: "Flex", avg: 0.98, peak: 1.08, floor: 0.88, trend: 0.05, s1: 0.93, s2: 0.98, majorAvg: null, events: 2, note: "Flex player", star: false, twitter: "nudlR6" },
  { name: "azzr", team: "Wolves", region: "EML", tier: "T2", role: "Star Flex", avg: 1.05, peak: 1.12, floor: 0.98, trend: 0.06, s1: 1.02, s2: 1.08, majorAvg: null, events: 2, note: "Strong flex player", star: true, twitter: "azzrR6" },
  { name: "Tyrant", team: "Wolves", region: "EML", tier: "T2", role: "Star Entry", avg: 1.02, peak: 1.12, floor: 0.92, trend: 0.08, s1: 0.94, s2: 1.02, majorAvg: null, events: 2, note: "Rising entry", star: true, twitter: "TyrantR6S" },
  { name: "leadr", team: "Wolves", region: "EML", tier: "T2", role: "IGL/Support", avg: 0.88, peak: 0.95, floor: 0.82, trend: 0.03, s1: 0.86, s2: 0.89, majorAvg: null, events: 2, note: "IGL", star: false, twitter: "leadrR6" },
  { name: "Creedz", team: "Wolves", region: "EML", tier: "T2", role: "Support", avg: 0.90, peak: 0.97, floor: 0.83, trend: 0.02, s1: 0.89, s2: 0.91, majorAvg: null, events: 2, note: "Support player", star: false, twitter: "CreedzR6" },

  // ============================================
  // EML - MACKO ESPORTS (T2)
  // ============================================
  { name: "Lollo", team: "MACKO Esports", region: "EML", tier: "T2", role: "IGL/Support", avg: 0.85, peak: 0.92, floor: 0.78, trend: 0.00, s1: 0.85, s2: 0.85, majorAvg: null, events: 2, note: "IGL, veteran", star: false, twitter: "LolloR6" },
  { name: "T3b", team: "MACKO Esports", region: "EML", tier: "T2", role: "Star Flex", avg: 1.08, peak: 1.15, floor: 1.01, trend: 0.06, s1: 1.05, s2: 1.11, majorAvg: null, events: 2, note: "Elite flex player", star: true, twitter: "T3bR6" },
  { name: "Dora", team: "MACKO Esports", region: "EML", tier: "T2", role: "Entry", avg: 0.97, peak: 1.05, floor: 0.89, trend: 0.04, s1: 0.95, s2: 0.99, majorAvg: null, events: 2, note: "Entry fragger", star: false, twitter: "DoraR6" },
  { name: "aqui", team: "MACKO Esports", region: "EML", tier: "T2", role: "Anchor", avg: 0.94, peak: 1.02, floor: 0.86, trend: 0.03, s1: 0.92, s2: 0.95, majorAvg: null, events: 2, note: "Anchor player", star: false, twitter: "aquiR6" },
  { name: "Ghostriddik", team: "MACKO Esports", region: "EML", tier: "T2", role: "Support", avg: 0.89, peak: 0.96, floor: 0.82, trend: 0.02, s1: 0.88, s2: 0.90, majorAvg: null, events: 2, note: "Support player", star: false, twitter: "GhostriddikR6" },

  // ============================================
  // EML - WYLDE (T2)
  // ============================================
  { name: "Evan", team: "WYLDE", region: "EML", tier: "T2", role: "IGL/Support", avg: 0.87, peak: 0.95, floor: 0.80, trend: -0.05, s1: 0.90, s2: 0.85, majorAvg: null, events: 2, note: "IGL", star: false, twitter: "EvanR6S" },
  { name: "garren", team: "WYLDE", region: "EML", tier: "T2", role: "Anchor", avg: 0.96, peak: 1.15, floor: 0.78, trend: -0.37, s1: 1.15, s2: 0.78, majorAvg: null, events: 2, note: "S1 standout 1.15 but crashed S2", star: false, twitter: "garrenR6" },
  { name: "Bmzy", team: "WYLDE", region: "EML", tier: "T2", role: "Flex", avg: 0.94, peak: 1.05, floor: 0.85, trend: 0.08, s1: 0.90, s2: 0.98, majorAvg: null, events: 2, note: "Improving", star: false, twitter: "BmzyR6" },
  { name: "Crex", team: "WYLDE", region: "EML", tier: "T2", role: "Entry", avg: 0.98, peak: 1.08, floor: 0.88, trend: 0.05, s1: 0.93, s2: 0.98, majorAvg: null, events: 2, note: "Entry player", star: false, twitter: "CrexR6" },
  { name: "Mekses", team: "WYLDE", region: "EML", tier: "T2", role: "Support", avg: 0.86, peak: 0.92, floor: 0.80, trend: 0.02, s1: 0.85, s2: 0.87, majorAvg: null, events: 2, note: "Support", star: false, twitter: "MeksesR6" },

  // ============================================
  // SAL - TEAM LIQUID
  // ============================================
  { name: "Maia", team: "Team Liquid", region: "SAL", tier: "T1", role: "Star Entry", avg: 1.18, peak: 1.28, floor: 1.08, trend: 0.20, s1: 1.08, s2: 1.28, majorAvg: null, events: 2, note: "BREAKOUT - massive S2 jump +0.20", star: true, twitter: "MaiaR6S" },
  { name: "Dias", team: "Team Liquid", region: "SAL", tier: "T1", role: "Star Flex", avg: 1.19, peak: 1.25, floor: 1.12, trend: 0.13, s1: 1.12, s2: 1.25, majorAvg: null, events: 2, note: "S2 BREAKOUT - very consistent", star: true, twitter: "DiasR6S" },
  { name: "Daffo", team: "Team Liquid", region: "SAL", tier: "T1", role: "Flex", avg: 1.00, peak: 1.00, floor: 1.00, trend: 0, s1: null, s2: 1.00, majorAvg: null, events: 1, note: "Joined from LOUD S2", star: false, twitter: "DaffoR6" },
  { name: "NESKWGA", team: "Team Liquid", region: "SAL", tier: "T1", role: "Flex", avg: 0.94, peak: 0.97, floor: 0.90, trend: 0.07, s1: 0.90, s2: 0.97, majorAvg: null, events: 2, note: "Steady flex player", star: false, twitter: "NESKWGAR6" },
  { name: "Lenda", team: "Team Liquid", region: "SAL", tier: "T1", role: "Support", avg: 0.85, peak: 0.85, floor: 0.85, trend: 0, s1: null, s2: 0.85, majorAvg: null, events: 1, note: "New S2 support", star: false, twitter: "LendaR6" },

  // ============================================
  // SAL - FAZE CLAN
  // ============================================
  { name: "VITAKING", team: "FaZe Clan", region: "SAL", tier: "T1", role: "IGL/Support", avg: 0.95, peak: 1.00, floor: 0.91, trend: -0.09, s1: 1.00, s2: 0.91, majorAvg: 0.95, events: 4, note: "IGL, captain, DEF specialist", star: false, twitter: "VITAKINGR6" },
  { name: "Cyber", team: "FaZe Clan", region: "SAL", tier: "T1", role: "Star Entry", avg: 1.16, peak: 1.37, floor: 0.97, trend: -0.19, s1: 1.24, s2: 1.05, majorAvg: 1.17, events: 4, note: "EWC star 1.37 but S2 dip", star: true, twitter: "CyberR6S" },
  { name: "handyy", team: "FaZe Clan", region: "SAL", tier: "T1", role: "Entry", avg: 1.05, peak: 1.09, floor: 1.03, trend: -0.01, s1: 1.09, s2: 1.08, majorAvg: 1.03, events: 3, note: "Consistent performer", star: false, twitter: "handyyR6" },
  { name: "Kds", team: "FaZe Clan", region: "SAL", tier: "T1", role: "Flex", avg: 1.07, peak: 1.17, floor: 0.96, trend: -0.13, s1: 1.17, s2: 1.04, majorAvg: 1.03, events: 4, note: "Solid but trending down", star: false, twitter: "KdsR6S" },
  { name: "soulz1", team: "FaZe Clan", region: "SAL", tier: "T1", role: "Flex", avg: 1.02, peak: 1.20, floor: 0.77, trend: -0.13, s1: 1.20, s2: 1.07, majorAvg: 0.90, events: 4, note: "Big stage struggles", star: false, twitter: "soulz1R6" },

  // ============================================
  // SAL - FURIA
  // ============================================
  { name: "FelipoX", team: "FURIA", region: "SAL", tier: "T1", role: "IGL/Support", avg: 1.03, peak: 1.19, floor: 0.85, trend: 0.23, s1: 0.85, s2: 1.08, majorAvg: 1.13, events: 4, note: "IGL, clutch god - Munich 1.19", star: true, twitter: "FelipoXR6" },
  { name: "Jv92", team: "FURIA", region: "SAL", tier: "T1", role: "Star Entry", avg: 1.11, peak: 1.32, floor: 0.95, trend: 0.17, s1: 1.15, s2: 1.32, majorAvg: 0.99, events: 4, note: "S2 EXPLOSION +23 entry diff", star: true, twitter: "Jv92R6" },
  { name: "Kheyze", team: "FURIA", region: "SAL", tier: "T1", role: "Star Entry", avg: 1.01, peak: 1.20, floor: 0.84, trend: 0.06, s1: 1.14, s2: 1.20, majorAvg: 0.85, events: 4, note: "+19 entry S2 - aggressive", star: true, twitter: "KheyzeR6" },
  { name: "HerdsZ", team: "FURIA", region: "SAL", tier: "T1", role: "Star Flex", avg: 1.08, peak: 1.19, floor: 0.86, trend: 0.17, s1: 1.02, s2: 1.19, majorAvg: 0.96, events: 4, note: "S2 breakout for FURIA", star: true, twitter: "HerdsZR6" },
  { name: "nade", team: "FURIA", region: "SAL", tier: "T1", role: "Support", avg: 1.05, peak: 1.15, floor: 0.98, trend: -0.09, s1: 1.07, s2: 0.98, majorAvg: 1.13, events: 4, note: "High KOST, plant machine", star: false, twitter: "nadeR6S" },

  // ============================================
  // SAL - NIP (Ninjas in Pyjamas)
  // ============================================
  { name: "pino", team: "NiP", region: "SAL", tier: "T1", role: "IGL/Support", avg: 1.02, peak: 1.11, floor: 0.98, trend: -0.06, s1: 1.04, s2: 0.98, majorAvg: 1.05, events: 4, note: "IGL, high KOST", star: false, twitter: "pinoR6S" },
  { name: "Fntzy", team: "NiP", region: "SAL", tier: "T1", role: "Entry", avg: 1.05, peak: 1.11, floor: 0.99, trend: -0.01, s1: 1.06, s2: 1.05, majorAvg: 1.05, events: 4, note: "Consistent mid-tier entry", star: false, twitter: "FntzyR6" },
  { name: "Hatez", team: "NiP", region: "SAL", tier: "T1", role: "Star Flex", avg: 1.07, peak: 1.15, floor: 0.94, trend: 0.11, s1: 1.04, s2: 1.15, majorAvg: 1.04, events: 4, note: "Solid, improving", star: true, twitter: "HatezR6" },
  { name: "Wizard", team: "NiP", region: "SAL", tier: "T1", role: "Flex", avg: 1.06, peak: 1.10, floor: 1.00, trend: 0.06, s1: 1.04, s2: 1.10, majorAvg: 1.05, events: 4, note: "8 clutches S1 - clutch god", star: false, twitter: "WizardR6S" },
  { name: "Kondz", team: "NiP", region: "SAL", tier: "T1", role: "Support", avg: 0.94, peak: 1.05, floor: 0.84, trend: 0.18, s1: 0.84, s2: 1.02, majorAvg: 0.95, events: 4, note: "22 plants S2 - ultimate support", star: false, twitter: "KondzR6" },

  // ============================================
  // SAL - W7M ESPORTS
  // ============================================
  { name: "Paluh", team: "w7m esports", region: "SAL", tier: "T1", role: "Star Flex", avg: 1.25, peak: 1.33, floor: 1.14, trend: -0.04, s1: 1.27, s2: 1.23, majorAvg: 1.14, events: 4, note: "Brazilian GOAT - EWC 1.33, never below 1.14", star: true, twitter: "PaluhR6" },
  { name: "Dodez", team: "w7m esports", region: "SAL", tier: "T1", role: "Star Entry", avg: 1.22, peak: 1.26, floor: 1.14, trend: -0.04, s1: 1.24, s2: 1.20, majorAvg: 1.14, events: 4, note: "Elite entry, consistent performer", star: true, twitter: "DodezR6" },
  { name: "volpz", team: "w7m esports", region: "SAL", tier: "T1", role: "Star Flex", avg: 1.08, peak: 1.10, floor: 0.74, trend: -0.04, s1: 1.10, s2: 1.06, majorAvg: 0.74, events: 4, note: "Regional solid, major struggles", star: true, twitter: "volpzR6" },
  { name: "lobin", team: "w7m esports", region: "SAL", tier: "T1", role: "Support", avg: 0.96, peak: 0.96, floor: 0.91, trend: 0.01, s1: 0.95, s2: 0.96, majorAvg: 0.91, events: 4, note: "Steady support", star: false, twitter: "lobinR6S" },
  { name: "Dotz", team: "w7m esports", region: "SAL", tier: "T1", role: "IGL/Support", avg: 0.92, peak: 0.93, floor: 0.73, trend: -0.03, s1: 0.93, s2: 0.90, majorAvg: 0.73, events: 4, note: "IGL w7m, high plants", star: false, twitter: "DotzR6S" },

  // ============================================
  // SAL - LOUD (T1)
  // ============================================
  { name: "peres", team: "LOUD", region: "SAL", tier: "T1", role: "Star Entry", avg: 1.21, peak: 1.21, floor: 1.21, trend: 0, s1: 1.21, s2: null, majorAvg: null, events: 1, note: "S1 standout 1.21 rating", star: true, twitter: "peresR6" },
  { name: "Stk", team: "LOUD", region: "SAL", tier: "T1", role: "Entry", avg: 1.15, peak: 1.15, floor: 1.15, trend: 0, s1: 1.15, s2: null, majorAvg: null, events: 1, note: "Strong S1 entry", star: false, twitter: "StkR6S" },
  { name: "Flastry", team: "LOUD", region: "SAL", tier: "T1", role: "Star Flex", avg: 1.07, peak: 1.14, floor: 0.99, trend: 0.15, s1: 0.99, s2: 1.14, majorAvg: null, events: 2, note: "Joined S2, huge impact +0.15", star: true, twitter: "FlastryR6" },
  { name: "live", team: "LOUD", region: "SAL", tier: "T1", role: "Flex", avg: 0.96, peak: 0.96, floor: 0.96, trend: 0, s1: 0.96, s2: null, majorAvg: null, events: 1, note: "Flex player", star: false, twitter: "liveR6S" },
  { name: "Bassetto", team: "LOUD", region: "SAL", tier: "T1", role: "IGL/Support", avg: 0.63, peak: 0.63, floor: 0.63, trend: 0, s1: 0.63, s2: null, majorAvg: null, events: 1, note: "IGL, low frag role", star: false, twitter: "BassettoR6" },

  // ============================================
  // SAL - 9Z TEAM (T2)
  // ============================================
  { name: "Jow", team: "9z Team", region: "SAL", tier: "T2", role: "Flex", avg: 0.90, peak: 0.90, floor: 0.90, trend: 0, s1: 0.90, s2: null, majorAvg: null, events: 1, note: "Team flex", star: false, twitter: "JowR6" },
  { name: "Tucu2k", team: "9z Team", region: "SAL", tier: "T2", role: "Entry", avg: 0.88, peak: 0.88, floor: 0.88, trend: 0, s1: 0.88, s2: null, majorAvg: null, events: 1, note: "Entry player", star: false, twitter: "Tucu2kR6" },
  { name: "Nitro", team: "9z Team", region: "SAL", tier: "T2", role: "Flex", avg: 0.87, peak: 0.87, floor: 0.87, trend: 0, s1: 0.87, s2: null, majorAvg: null, events: 1, note: "Flex player", star: false, twitter: "NitroR6S" },
  { name: "WiLL", team: "9z Team", region: "SAL", tier: "T2", role: "Support", avg: 0.76, peak: 0.76, floor: 0.76, trend: 0, s1: 0.76, s2: null, majorAvg: null, events: 1, note: "Support", star: false, twitter: "WiLLR6" },
  { name: "Naza", team: "9z Team", region: "SAL", tier: "T2", role: "IGL/Support", avg: 0.69, peak: 0.69, floor: 0.69, trend: 0, s1: 0.69, s2: null, majorAvg: null, events: 1, note: "IGL", star: false, twitter: "NazaR6" },

  // ============================================
  // SAL - ENX TEAM (T2)
  // ============================================
  { name: "Bokzera", team: "ENX Team", region: "SAL", tier: "T2", role: "Star Entry", avg: 1.19, peak: 1.19, floor: 1.19, trend: 0, s1: 1.19, s2: null, majorAvg: null, events: 1, note: "S1 star entry 1.19", star: true, twitter: "BokzeraR6" },
  { name: "Florio", team: "ENX Team", region: "SAL", tier: "T2", role: "Flex", avg: 1.04, peak: 1.04, floor: 1.04, trend: 0, s1: 1.04, s2: null, majorAvg: null, events: 1, note: "Strong flex", star: false, twitter: "FlorioR6" },
  { name: "SexyCake", team: "ENX Team", region: "SAL", tier: "T2", role: "Entry", avg: 0.90, peak: 0.90, floor: 0.90, trend: 0, s1: 0.90, s2: null, majorAvg: null, events: 1, note: "Entry player", star: false, twitter: "SexyCakeR6" },
  { name: "AngelzZ", team: "ENX Team", region: "SAL", tier: "T2", role: "Support", avg: 0.73, peak: 0.73, floor: 0.73, trend: 0, s1: 0.73, s2: null, majorAvg: null, events: 1, note: "Support", star: false, twitter: "AngelzZR6" },
  { name: "Nyjl", team: "ENX Team", region: "SAL", tier: "T2", role: "Support", avg: 0.72, peak: 0.72, floor: 0.72, trend: 0, s1: 0.72, s2: null, majorAvg: null, events: 1, note: "Support", star: false, twitter: "NyjlR6" },

  // ============================================
  // SAL - BLACK DRAGONS (T2)
  // ============================================
  { name: "R4re", team: "Black Dragons", region: "SAL", tier: "T2", role: "Star Flex", avg: 1.04, peak: 1.11, floor: 0.96, trend: 0.15, s1: 0.96, s2: 1.11, majorAvg: null, events: 2, note: "Captain, improving +0.15", star: true, twitter: "R4reR6" },
  { name: "AsK", team: "Black Dragons", region: "SAL", tier: "T2", role: "Flex", avg: 0.84, peak: 0.84, floor: 0.84, trend: 0, s1: 0.84, s2: null, majorAvg: null, events: 1, note: "Joined S2", star: false, twitter: "AsKR6" },
  { name: "Hornet", team: "Black Dragons", region: "SAL", tier: "T2", role: "Entry", avg: 0.92, peak: 0.92, floor: 0.92, trend: 0, s1: 0.92, s2: null, majorAvg: null, events: 1, note: "Entry player", star: false, twitter: "HornetR6S" },
  { name: "Miracle", team: "Black Dragons", region: "SAL", tier: "T2", role: "Support", avg: 0.85, peak: 0.85, floor: 0.85, trend: 0, s1: null, s2: 0.85, majorAvg: null, events: 1, note: "New S2 support", star: false, twitter: "MiracleR6" },
  { name: "Maquina", team: "Black Dragons", region: "SAL", tier: "T2", role: "IGL/Support", avg: 0.79, peak: 0.79, floor: 0.79, trend: 0, s1: 0.79, s2: null, majorAvg: null, events: 1, note: "IGL", star: false, twitter: "MaquinaR6" },

  // ============================================
  // SAL - LOS (T2)
  // ============================================
  { name: "Ar7hr", team: "LOS", region: "SAL", tier: "T2", role: "IGL/Support", avg: 0.90, peak: 0.98, floor: 0.82, trend: 0.05, s1: 0.88, s2: 0.93, majorAvg: null, events: 2, note: "IGL LOS", star: false, twitter: "Ar7hrR6" },
  { name: "Flastry", team: "LOS", region: "SAL", tier: "T2", role: "Star Flex", avg: 1.06, peak: 1.14, floor: 0.99, trend: 0.15, s1: 0.99, s2: 1.14, majorAvg: null, events: 2, note: "SAL T2 standout - improving fast", star: true, twitter: "FlastryR6" },
  { name: "Legacy", team: "LOS", region: "SAL", tier: "T2", role: "Entry", avg: 0.98, peak: 1.08, floor: 0.88, trend: 0.08, s1: 0.90, s2: 0.98, majorAvg: null, events: 2, note: "Entry player", star: false, twitter: "LegacyR6S" },
  { name: "Kurtz", team: "LOS", region: "SAL", tier: "T2", role: "Flex", avg: 0.95, peak: 1.05, floor: 0.85, trend: 0.05, s1: 0.90, s2: 0.95, majorAvg: null, events: 2, note: "Flex player", star: false, twitter: "KurtzR6" },
  { name: "Hornet", team: "LOS", region: "SAL", tier: "T2", role: "Anchor", avg: 0.88, peak: 0.95, floor: 0.80, trend: 0.02, s1: 0.87, s2: 0.89, majorAvg: null, events: 2, note: "Anchor player", star: false, twitter: "HornetR6S" },

  // ============================================
  // APAC - Notable Players
  // ============================================
  { name: "Arcully", team: "Elevate", region: "APAC", tier: "T1", role: "Star Flex", avg: 1.35, peak: 1.35, floor: 1.35, trend: 0, s1: null, s2: null, majorAvg: 1.35, events: 1, note: "Munich co-MVP 1.35 - APAC star", star: true, twitter: "ArcullyR6" },
  { name: "Tuhan", team: "SANDBOX", region: "APAC", tier: "T1", role: "Entry", avg: 1.02, peak: 1.25, floor: 0.80, trend: 0, s1: null, s2: null, majorAvg: 1.02, events: 2, note: "Munich 1.25", star: false, twitter: "TuhanR6" },
  { name: "SpeakEasy", team: "Elevate", region: "APAC", tier: "T1", role: "IGL/Support", avg: 0.95, peak: 1.05, floor: 0.85, trend: 0, s1: null, s2: null, majorAvg: 0.95, events: 1, note: "IGL Elevate", star: false, twitter: "SpeakEasyR6" },
  { name: "Faallz", team: "Elevate", region: "APAC", tier: "T1", role: "Entry", avg: 1.08, peak: 1.15, floor: 1.00, trend: 0, s1: null, s2: null, majorAvg: 1.08, events: 1, note: "Entry for Elevate", star: false, twitter: "FaallzR6" },
  { name: "Reeps96", team: "Elevate", region: "APAC", tier: "T1", role: "Flex", avg: 1.03, peak: 1.10, floor: 0.95, trend: 0, s1: null, s2: null, majorAvg: 1.03, events: 1, note: "Flex player", star: false, twitter: "Reeps96R6" },
  { name: "DD", team: "SANDBOX", region: "APAC", tier: "T1", role: "Entry", avg: 1.05, peak: 1.18, floor: 0.92, trend: 0, s1: null, s2: null, majorAvg: 1.05, events: 2, note: "Entry SANDBOX", star: false, twitter: "DDR6S" },
  { name: "yass", team: "SANDBOX", region: "APAC", tier: "T1", role: "IGL/Support", avg: 0.88, peak: 0.95, floor: 0.80, trend: 0, s1: null, s2: null, majorAvg: 0.88, events: 2, note: "IGL SANDBOX", star: false, twitter: "yassR6" },
  { name: "Bullet1", team: "DWG KIA", region: "APAC", tier: "T1", role: "Entry", avg: 1.02, peak: 1.12, floor: 0.92, trend: 0, s1: null, s2: null, majorAvg: 1.02, events: 1, note: "Entry DWG", star: false, twitter: "Bullet1R6" },
  { name: "Hoven", team: "DWG KIA", region: "APAC", tier: "T1", role: "Flex", avg: 1.03, peak: 1.10, floor: 0.95, trend: 0, s1: null, s2: null, majorAvg: 1.03, events: 1, note: "Flex DWG", star: false, twitter: "HovenR6" },
  { name: "Ape", team: "DWG KIA", region: "APAC", tier: "T1", role: "Support", avg: 0.92, peak: 1.00, floor: 0.85, trend: 0, s1: null, s2: null, majorAvg: 0.92, events: 1, note: "Support DWG", star: false, twitter: "ApeR6S" },
];

const categories = {
  WANT: { color: 'bg-green-500', label: 'WANT', textColor: 'text-white', key: '1' },
  MAYBE: { color: 'bg-yellow-400', label: 'MAYBE', textColor: 'text-black', key: '2' },
  WATCH: { color: 'bg-blue-500', label: 'WATCH', textColor: 'text-white', key: '3' },
  NO: { color: 'bg-red-500', label: 'NO', textColor: 'text-white', key: '4' },
};

const ROLE_REQUIREMENTS = ['Entry', 'Flex', 'Support', 'IGL', 'Anchor'];

// Sparkline component
const Sparkline = ({ s1, s2, majorAvg }) => {
  const points = [s1, s2, majorAvg].filter(v => v !== null && v !== undefined);
  if (points.length < 2) return <span className="text-gray-500 text-xs">-</span>;

  const min = Math.min(...points) - 0.1;
  const max = Math.max(...points) + 0.1;
  const height = 20;
  const width = 50;

  const getY = (val) => height - ((val - min) / (max - min)) * height;
  const getX = (idx) => (idx / (points.length - 1)) * width;

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p)}`).join(' ');
  const trendUp = points[points.length - 1] > points[0];

  return (
    <svg width={width} height={height} className="inline-block">
      <path d={pathD} fill="none" stroke={trendUp ? '#22c55e' : '#ef4444'} strokeWidth="2" />
      {points.map((p, i) => (
        <circle key={i} cx={getX(i)} cy={getY(p)} r="2" fill={trendUp ? '#22c55e' : '#ef4444'} />
      ))}
    </svg>
  );
};

export default function ScoutingTool() {
  // Shared state - synced with Supabase
  const [playerCategories, setPlayerCategories] = useState({});
  const [customNotes, setCustomNotes] = useState({});
  const [roster, setRoster] = useState([]);
  const [syncStatus, setSyncStatus] = useState('connecting');

  const [filter, setFilter] = useState({ region: 'ALL', role: 'ALL', tier: 'ALL', category: 'ALL', team: 'ALL', starOnly: false });
  const [statFilters, setStatFilters] = useState({ minAvg: '', maxAvg: '', minTrend: '', maxTrend: '' });
  const [sortBy, setSortBy] = useState('avg');
  const [searchTerm, setSearchTerm] = useState('');
  const [showExport, setShowExport] = useState(false);
  const [view, setView] = useState('table');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Load initial data from Supabase and subscribe to real-time changes
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load categories
        const { data: catData } = await supabase
          .from('scouting_categories')
          .select('player_name, category');
        if (catData) {
          const cats = {};
          catData.forEach(row => { cats[row.player_name] = row.category; });
          setPlayerCategories(cats);
        }

        // Load notes
        const { data: notesData } = await supabase
          .from('scouting_notes')
          .select('player_name, note');
        if (notesData) {
          const notes = {};
          notesData.forEach(row => { notes[row.player_name] = row.note; });
          setCustomNotes(notes);
        }

        // Load roster
        const { data: rosterData } = await supabase
          .from('scouting_rosters')
          .select('player_name, position')
          .order('position');
        if (rosterData) {
          const rosterPlayers = rosterData.map(row =>
            playersData.find(p => p.name === row.player_name)
          ).filter(Boolean);
          setRoster(rosterPlayers);
        }

        setSyncStatus('connected');
      } catch (err) {
        console.error('Failed to load from Supabase:', err);
        setSyncStatus('error');
      }
    };

    loadData();

    // Real-time subscriptions
    const categoriesChannel = supabase
      .channel('categories-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scouting_categories' }, (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          setPlayerCategories(prev => ({ ...prev, [payload.new.player_name]: payload.new.category }));
        } else if (payload.eventType === 'DELETE') {
          setPlayerCategories(prev => {
            const { [payload.old.player_name]: _, ...rest } = prev;
            return rest;
          });
        }
      })
      .subscribe();

    const notesChannel = supabase
      .channel('notes-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scouting_notes' }, (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          setCustomNotes(prev => ({ ...prev, [payload.new.player_name]: payload.new.note }));
        } else if (payload.eventType === 'DELETE') {
          setCustomNotes(prev => {
            const { [payload.old.player_name]: _, ...rest } = prev;
            return rest;
          });
        }
      })
      .subscribe();

    const rosterChannel = supabase
      .channel('roster-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scouting_rosters' }, async () => {
        // Reload full roster on any change
        const { data: rosterData } = await supabase
          .from('scouting_rosters')
          .select('player_name, position')
          .order('position');
        if (rosterData) {
          const rosterPlayers = rosterData.map(row =>
            playersData.find(p => p.name === row.player_name)
          ).filter(Boolean);
          setRoster(rosterPlayers);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(categoriesChannel);
      supabase.removeChannel(notesChannel);
      supabase.removeChannel(rosterChannel);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (selectedPlayer) {
        if (e.key === '1') setCategory(selectedPlayer.name, 'WANT');
        if (e.key === '2') setCategory(selectedPlayer.name, 'MAYBE');
        if (e.key === '3') setCategory(selectedPlayer.name, 'WATCH');
        if (e.key === '4') setCategory(selectedPlayer.name, 'NO');
        if (e.key === 'Escape') setSelectedPlayer(null);
        if (e.key === 'r' || e.key === 'R') toggleRoster(selectedPlayer);
      }

      // Bulk actions with shift+number
      if (e.shiftKey && selectedPlayers.size > 0) {
        if (e.key === '!') bulkSetCategory('WANT');
        if (e.key === '@') bulkSetCategory('MAYBE');
        if (e.key === '#') bulkSetCategory('WATCH');
        if (e.key === '$') bulkSetCategory('NO');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPlayer, selectedPlayers]);

  const setCategory = async (playerName, category) => {
    const currentCategory = playerCategories[playerName];
    if (currentCategory === category) {
      // Remove category
      setPlayerCategories(prev => {
        const { [playerName]: _, ...rest } = prev;
        return rest;
      });
      await supabase.from('scouting_categories').delete().eq('player_name', playerName);
    } else {
      // Set category
      setPlayerCategories(prev => ({ ...prev, [playerName]: category }));
      await supabase.from('scouting_categories').upsert({ player_name: playerName, category }, { onConflict: 'player_name' });
    }
  };

  const bulkSetCategory = async (category) => {
    const updates = [];
    selectedPlayers.forEach(name => {
      updates.push({ player_name: name, category });
    });
    setPlayerCategories(prev => {
      const updated = { ...prev };
      selectedPlayers.forEach(name => {
        updated[name] = category;
      });
      return updated;
    });
    setSelectedPlayers(new Set());
    // Save all to Supabase
    if (updates.length > 0) {
      await supabase.from('scouting_categories').upsert(updates, { onConflict: 'player_name' });
    }
  };

  const toggleSelect = (playerName) => {
    setSelectedPlayers(prev => {
      const next = new Set(prev);
      if (next.has(playerName)) next.delete(playerName);
      else next.add(playerName);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedPlayers(new Set(filteredPlayers.map(p => p.name)));
  };

  const clearSelection = () => {
    setSelectedPlayers(new Set());
  };

  const toggleCompare = (player) => {
    setCompareList(prev => {
      if (prev.find(p => p.name === player.name)) {
        return prev.filter(p => p.name !== player.name);
      }
      if (prev.length >= 4) return prev;
      return [...prev, player];
    });
  };

  const toggleRoster = async (player) => {
    const isInRoster = roster.find(p => p.name === player.name);
    if (isInRoster) {
      // Remove from roster
      setRoster(prev => prev.filter(p => p.name !== player.name));
      await supabase.from('scouting_rosters').delete().eq('player_name', player.name);
    } else if (roster.length < 5) {
      // Add to roster
      const newRoster = [...roster, player];
      setRoster(newRoster);
      await supabase.from('scouting_rosters').insert({ player_name: player.name, position: newRoster.length - 1 });
    }
  };

  const updateCustomNote = async (playerName, note) => {
    setCustomNotes(prev => ({ ...prev, [playerName]: note }));
    if (note.trim()) {
      await supabase.from('scouting_notes').upsert({ player_name: playerName, note }, { onConflict: 'player_name' });
    } else {
      await supabase.from('scouting_notes').delete().eq('player_name', playerName);
    }
  };

  const filteredPlayers = useMemo(() => {
    return playersData
      .filter(p => {
        if (filter.region !== 'ALL' && p.region !== filter.region) return false;
        if (filter.role !== 'ALL') {
          if (filter.role === 'Support/Anchor') {
            if (!p.role.includes('Support') && !p.role.includes('Anchor')) return false;
          } else {
            if (!p.role.includes(filter.role)) return false;
          }
        }
        if (filter.tier !== 'ALL' && p.tier !== filter.tier) return false;
        if (filter.team !== 'ALL' && p.team !== filter.team) return false;
        if (filter.starOnly && !p.star) return false;
        if (filter.category !== 'ALL') {
          if (filter.category === 'UNCATEGORIZED') {
            if (playerCategories[p.name]) return false;
          } else {
            if (playerCategories[p.name] !== filter.category) return false;
          }
        }
        // Stat range filters
        if (statFilters.minAvg && p.avg < parseFloat(statFilters.minAvg)) return false;
        if (statFilters.maxAvg && p.avg > parseFloat(statFilters.maxAvg)) return false;
        if (statFilters.minTrend && p.trend < parseFloat(statFilters.minTrend)) return false;
        if (statFilters.maxTrend && p.trend > parseFloat(statFilters.maxTrend)) return false;

        if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !p.team.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'avg') return b.avg - a.avg;
        if (sortBy === 'peak') return b.peak - a.peak;
        if (sortBy === 'trend') return b.trend - a.trend;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'team') return a.team.localeCompare(b.team);
        return 0;
      });
  }, [filter, statFilters, sortBy, searchTerm, playerCategories]);

  const stats = useMemo(() => {
    const want = Object.values(playerCategories).filter(c => c === 'WANT').length;
    const maybe = Object.values(playerCategories).filter(c => c === 'MAYBE').length;
    const no = Object.values(playerCategories).filter(c => c === 'NO').length;
    const watch = Object.values(playerCategories).filter(c => c === 'WATCH').length;
    const stars = playersData.filter(p => p.star).length;
    return { want, maybe, no, watch, total: playersData.length, stars };
  }, [playerCategories]);

  const rosterAnalysis = useMemo(() => {
    if (roster.length === 0) return null;

    const avgRating = roster.reduce((sum, p) => sum + p.avg, 0) / roster.length;
    const avgTrend = roster.reduce((sum, p) => sum + p.trend, 0) / roster.length;

    const roles = roster.map(p => p.role);
    const hasIGL = roles.some(r => r.includes('IGL'));
    const hasEntry = roles.some(r => r.includes('Entry'));
    const hasSupport = roles.some(r => r.includes('Support') || r.includes('Anchor'));
    const hasFlex = roles.some(r => r.includes('Flex'));

    const missing = [];
    if (!hasIGL) missing.push('IGL');
    if (!hasEntry) missing.push('Entry');
    if (!hasSupport) missing.push('Support/Anchor');

    return { avgRating, avgTrend, hasIGL, hasEntry, hasSupport, hasFlex, missing };
  }, [roster]);

  // Group players by region and team for Teams view
  const teamsByRegion = useMemo(() => {
    const regions = ['NAL', 'EML', 'SAL', 'APAC'];
    const grouped = {};

    regions.forEach(region => {
      const regionPlayers = playersData.filter(p => p.region === region);
      const teams = {};
      regionPlayers.forEach(p => {
        if (!teams[p.team]) teams[p.team] = [];
        teams[p.team].push(p);
      });
      // Sort teams by avg rating
      const sortedTeams = Object.entries(teams)
        .map(([teamName, players]) => ({
          name: teamName,
          players: players.sort((a, b) => b.avg - a.avg),
          avgRating: players.reduce((sum, p) => sum + p.avg, 0) / players.length
        }))
        .sort((a, b) => b.avgRating - a.avgRating);
      grouped[region] = sortedTeams;
    });

    return grouped;
  }, []);

  // Get unique teams for filter dropdown
  const allTeams = useMemo(() => {
    const teams = [...new Set(playersData.map(p => p.team))].sort();
    return teams;
  }, []);

  const exportPicks = () => {
    const picks = { WANT: [], MAYBE: [], WATCH: [], NO: [] };
    Object.entries(playerCategories).forEach(([name, cat]) => {
      const player = playersData.find(p => p.name === name);
      if (player) picks[cat].push(player);
    });
    return picks;
  };

  const exportSession = () => {
    const data = {
      categories: playerCategories,
      notes: customNotes,
      roster: roster.map(p => p.name),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `r6-scouting-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importSession = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target?.result);

        // Update local state
        if (data.categories) setPlayerCategories(data.categories);
        if (data.notes) setCustomNotes(data.notes);
        if (data.roster) {
          const rosterPlayers = data.roster.map(name => playersData.find(p => p.name === name)).filter(Boolean);
          setRoster(rosterPlayers);
        }

        // Sync to Supabase
        if (data.categories) {
          const catEntries = Object.entries(data.categories).map(([player_name, category]) => ({ player_name, category }));
          if (catEntries.length > 0) {
            await supabase.from('scouting_categories').upsert(catEntries, { onConflict: 'player_name' });
          }
        }
        if (data.notes) {
          const noteEntries = Object.entries(data.notes).filter(([_, note]) => note.trim()).map(([player_name, note]) => ({ player_name, note }));
          if (noteEntries.length > 0) {
            await supabase.from('scouting_notes').upsert(noteEntries, { onConflict: 'player_name' });
          }
        }
        if (data.roster) {
          // Clear existing roster and insert new
          await supabase.from('scouting_rosters').delete().neq('id', 0);
          const rosterEntries = data.roster.map((name, idx) => ({ player_name: name, position: idx }));
          if (rosterEntries.length > 0) {
            await supabase.from('scouting_rosters').insert(rosterEntries);
          }
        }

        alert('Session imported and synced!');
      } catch (err) {
        alert('Failed to import session. Invalid file format.');
      }
    };
    reader.readAsText(file);
  };

  const getRatingColor = (rating) => {
    if (rating >= 1.20) return 'bg-green-100 text-green-800 font-bold';
    if (rating >= 1.10) return 'bg-yellow-100 text-yellow-800';
    if (rating >= 1.00) return 'bg-gray-100 text-gray-800';
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
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
            R6 SIEGE ELITE SCOUTING TOOL
          </h1>
          <span className={`text-xs px-2 py-1 rounded-full ${
            syncStatus === 'connected' ? 'bg-green-600' :
            syncStatus === 'connecting' ? 'bg-yellow-600' :
            'bg-red-600'
          }`}>
            {syncStatus === 'connected' ? 'LIVE SYNC' : syncStatus === 'connecting' ? 'CONNECTING...' : 'OFFLINE'}
          </span>
        </div>
        <p className="text-gray-400 text-sm">{playersData.length} Players | {stats.stars} Stars | Full Rosters</p>
        <p className="text-gray-500 text-xs mt-1">Keyboard: 1-4 = Categorize | R = Add to Roster | Esc = Close</p>
      </div>

      {/* Stats Bar */}
      <div className="flex justify-center gap-4 mb-4 flex-wrap">
        <div className="bg-green-600 px-4 py-2 rounded-lg">Want: {stats.want}</div>
        <div className="bg-yellow-500 text-black px-4 py-2 rounded-lg">Maybe: {stats.maybe}</div>
        <div className="bg-blue-600 px-4 py-2 rounded-lg">Watch: {stats.watch}</div>
        <div className="bg-red-600 px-4 py-2 rounded-lg">No: {stats.no}</div>
        <div className="bg-purple-600 px-4 py-2 rounded-lg">Stars: {stats.stars}</div>
      </div>

      {/* View Toggles */}
      <div className="flex justify-center gap-2 mb-4 flex-wrap">
        <button onClick={() => setView('table')} className={`px-4 py-2 rounded ${view === 'table' ? 'bg-blue-600' : 'bg-gray-700'}`}>Table</button>
        <button onClick={() => setView('teams')} className={`px-4 py-2 rounded ${view === 'teams' ? 'bg-blue-600' : 'bg-gray-700'}`}>Teams</button>
        <button onClick={() => setView('summary')} className={`px-4 py-2 rounded ${view === 'summary' ? 'bg-blue-600' : 'bg-gray-700'}`}>My Picks</button>
        <button onClick={() => setView('roster')} className={`px-4 py-2 rounded ${view === 'roster' ? 'bg-blue-600' : 'bg-gray-700'}`}>Team Builder ({roster.length}/5)</button>
        <button onClick={() => setView('compare')} className={`px-4 py-2 rounded ${view === 'compare' ? 'bg-blue-600' : 'bg-gray-700'}`}>Compare ({compareList.length})</button>
        <button onClick={() => setFilter({...filter, starOnly: !filter.starOnly})} className={`px-4 py-2 rounded ${filter.starOnly ? 'bg-purple-600' : 'bg-gray-700'}`}>Stars Only</button>
        <button onClick={() => setShowExport(!showExport)} className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700">Export</button>
        <button onClick={() => setShowFilters(!showFilters)} className={`px-4 py-2 rounded ${showFilters ? 'bg-orange-600' : 'bg-gray-700'}`}>Advanced</button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-gray-800 border border-gray-600 rounded px-3 py-2 w-48" />
        <select value={filter.region} onChange={e => setFilter({...filter, region: e.target.value})} className="bg-gray-800 border border-gray-600 rounded px-3 py-2">
          <option value="ALL">All Regions</option>
          <option value="NAL">NAL</option>
          <option value="EML">EML</option>
          <option value="SAL">SAL</option>
          <option value="APAC">APAC</option>
        </select>
        <select value={filter.role} onChange={e => setFilter({...filter, role: e.target.value})} className="bg-gray-800 border border-gray-600 rounded px-3 py-2">
          <option value="ALL">All Roles</option>
          <option value="Entry">Entry</option>
          <option value="Star">Star</option>
          <option value="Flex">Flex</option>
          <option value="Support/Anchor">Support/Anchor</option>
          <option value="IGL">IGL</option>
        </select>
        <select value={filter.tier} onChange={e => setFilter({...filter, tier: e.target.value})} className="bg-gray-800 border border-gray-600 rounded px-3 py-2">
          <option value="ALL">All Tiers</option>
          <option value="T1">T1 Only</option>
          <option value="T2">T2 Rising</option>
        </select>
        <select value={filter.team} onChange={e => setFilter({...filter, team: e.target.value})} className="bg-gray-800 border border-gray-600 rounded px-3 py-2">
          <option value="ALL">All Teams</option>
          {allTeams.map(team => <option key={team} value={team}>{team}</option>)}
        </select>
        <select value={filter.category} onChange={e => setFilter({...filter, category: e.target.value})} className="bg-gray-800 border border-gray-600 rounded px-3 py-2">
          <option value="ALL">All Status</option>
          <option value="WANT">Want</option>
          <option value="MAYBE">Maybe</option>
          <option value="WATCH">Watch</option>
          <option value="NO">No</option>
          <option value="UNCATEGORIZED">Uncategorized</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-gray-800 border border-gray-600 rounded px-3 py-2">
          <option value="avg">Sort: Avg</option>
          <option value="peak">Sort: Peak</option>
          <option value="trend">Sort: Trend</option>
          <option value="team">Sort: Team</option>
        </select>
      </div>

      {/* Advanced Stat Filters */}
      {showFilters && (
        <div className="flex flex-wrap justify-center gap-2 mb-4 bg-gray-800 p-4 rounded-lg max-w-2xl mx-auto">
          <div className="text-sm text-gray-400 w-full text-center mb-2">Stat Range Filters</div>
          <input type="number" step="0.01" placeholder="Min Avg" value={statFilters.minAvg} onChange={e => setStatFilters({...statFilters, minAvg: e.target.value})} className="bg-gray-700 border border-gray-600 rounded px-2 py-1 w-24 text-sm" />
          <input type="number" step="0.01" placeholder="Max Avg" value={statFilters.maxAvg} onChange={e => setStatFilters({...statFilters, maxAvg: e.target.value})} className="bg-gray-700 border border-gray-600 rounded px-2 py-1 w-24 text-sm" />
          <input type="number" step="0.01" placeholder="Min Trend" value={statFilters.minTrend} onChange={e => setStatFilters({...statFilters, minTrend: e.target.value})} className="bg-gray-700 border border-gray-600 rounded px-2 py-1 w-24 text-sm" />
          <input type="number" step="0.01" placeholder="Max Trend" value={statFilters.maxTrend} onChange={e => setStatFilters({...statFilters, maxTrend: e.target.value})} className="bg-gray-700 border border-gray-600 rounded px-2 py-1 w-24 text-sm" />
          <button onClick={() => setStatFilters({ minAvg: '', maxAvg: '', minTrend: '', maxTrend: '' })} className="bg-red-600 px-3 py-1 rounded text-sm">Clear</button>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedPlayers.size > 0 && (
        <div className="flex justify-center gap-2 mb-4 bg-gray-800 p-3 rounded-lg">
          <span className="text-gray-400">{selectedPlayers.size} selected:</span>
          <button onClick={() => bulkSetCategory('WANT')} className="bg-green-600 px-3 py-1 rounded text-sm">Want All</button>
          <button onClick={() => bulkSetCategory('MAYBE')} className="bg-yellow-500 text-black px-3 py-1 rounded text-sm">Maybe All</button>
          <button onClick={() => bulkSetCategory('WATCH')} className="bg-blue-600 px-3 py-1 rounded text-sm">Watch All</button>
          <button onClick={() => bulkSetCategory('NO')} className="bg-red-600 px-3 py-1 rounded text-sm">No All</button>
          <button onClick={clearSelection} className="bg-gray-600 px-3 py-1 rounded text-sm">Clear</button>
        </div>
      )}

      {/* Export Panel */}
      {showExport && (
        <div className="bg-gray-800 rounded-lg p-4 mb-4 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold mb-2">Export / Import</h3>
          <div className="flex gap-2 mb-4">
            <button onClick={exportSession} className="bg-green-600 px-4 py-2 rounded">Download JSON</button>
            <label className="bg-blue-600 px-4 py-2 rounded cursor-pointer">
              Import JSON
              <input type="file" accept=".json" onChange={importSession} className="hidden" />
            </label>
            <button onClick={() => {
              const text = Object.entries(exportPicks()).map(([cat, players]) =>
                `${cat}:\n${players.map(p => `  ${p.star ? '⭐ ' : ''}${p.name} (${p.team}) - ${p.avg.toFixed(2)}`).join('\n') || '  None'}`
              ).join('\n\n');
              navigator.clipboard.writeText(text);
              alert('Copied!');
            }} className="bg-purple-600 px-4 py-2 rounded">Copy Text</button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {Object.entries(exportPicks()).map(([cat, players]) => (
              <div key={cat} className="bg-gray-700 p-2 rounded">
                <div className="font-bold mb-1">{categories[cat]?.label} ({players.length})</div>
                {players.map(p => <div key={p.name} className="text-gray-300">{p.star ? '⭐ ' : ''}{p.name} ({p.team}) - {p.avg.toFixed(2)}</div>)}
                {players.length === 0 && <div className="text-gray-500">None</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Builder View */}
      {view === 'roster' && (
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-xl font-bold mb-4">Team Builder</h3>

            {roster.length === 0 ? (
              <div className="text-center text-gray-500 py-8">Click "+" on players to add them to your roster (max 5)</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
                  {roster.map((p, i) => (
                    <div key={p.name} className="bg-gray-700 p-3 rounded text-center relative">
                      <button onClick={() => toggleRoster(p)} className="absolute top-1 right-1 text-red-400 hover:text-red-300 text-sm">x</button>
                      <div className="font-bold">{p.star ? '⭐ ' : ''}{p.name}</div>
                      <div className="text-xs text-gray-400">{p.role}</div>
                      <div className={`text-sm ${getRatingColor(p.avg)} px-2 py-1 rounded mt-1 inline-block`}>{p.avg.toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                {rosterAnalysis && (
                  <div className="bg-gray-700 rounded p-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Avg Rating:</span>
                        <span className={`ml-2 ${getRatingColor(rosterAnalysis.avgRating)} px-2 py-1 rounded`}>{rosterAnalysis.avgRating.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Avg Trend:</span>
                        <span className={`ml-2 ${getTrendColor(rosterAnalysis.avgTrend)}`}>{rosterAnalysis.avgTrend >= 0 ? '+' : ''}{rosterAnalysis.avgTrend.toFixed(2)}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-400">Roles:</span>
                        <span className={`ml-2 ${rosterAnalysis.hasIGL ? 'text-green-400' : 'text-red-400'}`}>{rosterAnalysis.hasIGL ? 'IGL' : 'No IGL'}</span>
                        <span className={`ml-2 ${rosterAnalysis.hasEntry ? 'text-green-400' : 'text-red-400'}`}>{rosterAnalysis.hasEntry ? 'Entry' : 'No Entry'}</span>
                        <span className={`ml-2 ${rosterAnalysis.hasSupport ? 'text-green-400' : 'text-red-400'}`}>{rosterAnalysis.hasSupport ? 'Support/Anchor' : 'No Support/Anchor'}</span>
                      </div>
                    </div>
                    {rosterAnalysis.missing.length > 0 && (
                      <div className="mt-2 text-yellow-400 text-sm">Missing: {rosterAnalysis.missing.join(', ')}</div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Compare View */}
      {view === 'compare' && (
        <div className="max-w-6xl mx-auto mb-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-xl font-bold mb-4">Compare Players (max 4)</h3>

            {compareList.length === 0 ? (
              <div className="text-center text-gray-500 py-8">Click "Compare" on players to add them here</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="p-2 text-left">Stat</th>
                      {compareList.map(p => (
                        <th key={p.name} className="p-2 text-center">
                          {p.name}
                          <button onClick={() => toggleCompare(p)} className="ml-2 text-red-400 text-xs">x</button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-700">
                      <td className="p-2 text-gray-400">Team</td>
                      {compareList.map(p => <td key={p.name} className="p-2 text-center">{p.team}</td>)}
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="p-2 text-gray-400">Role</td>
                      {compareList.map(p => <td key={p.name} className="p-2 text-center">{p.role}</td>)}
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="p-2 text-gray-400">Avg</td>
                      {compareList.map(p => <td key={p.name} className={`p-2 text-center ${getRatingColor(p.avg)}`}>{p.avg.toFixed(2)}</td>)}
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="p-2 text-gray-400">Peak</td>
                      {compareList.map(p => <td key={p.name} className={`p-2 text-center ${getRatingColor(p.peak)}`}>{p.peak.toFixed(2)}</td>)}
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="p-2 text-gray-400">Floor</td>
                      {compareList.map(p => <td key={p.name} className={`p-2 text-center ${getRatingColor(p.floor)}`}>{p.floor.toFixed(2)}</td>)}
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="p-2 text-gray-400">Trend</td>
                      {compareList.map(p => <td key={p.name} className={`p-2 text-center ${getTrendColor(p.trend)}`}>{p.trend >= 0 ? '+' : ''}{p.trend.toFixed(2)}</td>)}
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="p-2 text-gray-400">S1</td>
                      {compareList.map(p => <td key={p.name} className="p-2 text-center">{p.s1?.toFixed(2) || '-'}</td>)}
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="p-2 text-gray-400">S2</td>
                      {compareList.map(p => <td key={p.name} className="p-2 text-center">{p.s2?.toFixed(2) || '-'}</td>)}
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="p-2 text-gray-400">Major Avg</td>
                      {compareList.map(p => <td key={p.name} className="p-2 text-center">{p.majorAvg?.toFixed(2) || '-'}</td>)}
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="p-2 text-gray-400">Trend</td>
                      {compareList.map(p => <td key={p.name} className="p-2 text-center"><Sparkline s1={p.s1} s2={p.s2} majorAvg={p.majorAvg} /></td>)}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Teams View */}
      {view === 'teams' && (
        <div className="max-w-7xl mx-auto">
          {['NAL', 'EML', 'SAL', 'APAC'].map(region => {
            if (filter.region !== 'ALL' && filter.region !== region) return null;
            const regionTeams = teamsByRegion[region];
            if (!regionTeams || regionTeams.length === 0) return null;

            return (
              <div key={region} className="mb-8">
                <h2 className={`text-2xl font-bold mb-4 ${
                  region === 'NAL' ? 'text-blue-400' :
                  region === 'EML' ? 'text-purple-400' :
                  region === 'SAL' ? 'text-green-400' :
                  'text-orange-400'
                }`}>{region}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {regionTeams.map(team => (
                    <div key={team.name} className="bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-bold">{team.name}</h3>
                        <span className={`px-2 py-1 rounded text-sm ${getRatingColor(team.avgRating)}`}>
                          Avg: {team.avgRating.toFixed(2)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {team.players.map(p => (
                          <div
                            key={p.name}
                            className="flex justify-between items-center p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600"
                            onClick={() => setSelectedPlayer(p)}
                          >
                            <div>
                              <span className="font-medium">{p.star ? '⭐ ' : ''}{p.name}</span>
                              <span className="text-xs text-gray-400 ml-2">{p.role}</span>
                              {playerCategories[p.name] && (
                                <span className={`ml-2 px-1 py-0.5 rounded text-xs ${categories[playerCategories[p.name]].color} ${categories[playerCategories[p.name]].textColor}`}>
                                  {playerCategories[p.name][0]}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm ${getRatingColor(p.avg)} px-2 py-1 rounded`}>{p.avg.toFixed(2)}</span>
                              <span className={`text-xs ${getTrendColor(p.trend)}`}>{p.trend >= 0 ? '+' : ''}{p.trend.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
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
                <h3 className={`text-xl font-bold mb-2 ${cat.color} ${cat.textColor} inline-block px-3 py-1 rounded`}>{cat.label} ({players.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {players.sort((a,b) => b.avg - a.avg).map(p => (
                    <div key={p.name} className="bg-gray-800 p-3 rounded flex justify-between items-center cursor-pointer hover:bg-gray-750" onClick={() => setSelectedPlayer(p)}>
                      <div>
                        <div className="font-bold">{p.star ? '⭐ ' : ''}{p.name}</div>
                        <div className="text-sm text-gray-400">{p.team} - {p.role}</div>
                      </div>
                      <div className="text-right">
                        <div className={getRatingColor(p.avg) + ' px-2 py-1 rounded text-sm'}>{p.avg.toFixed(2)}</div>
                        <div className={`text-xs ${getTrendColor(p.trend)}`}>{p.trend >= 0 ? '+' : ''}{p.trend.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {Object.keys(playerCategories).length === 0 && <div className="text-center text-gray-500 py-8">No players categorized yet</div>}
        </div>
      )}

      {/* Table View */}
      {view === 'table' && (
        <div className="overflow-x-auto">
          <div className="flex justify-between items-center mb-2 max-w-7xl mx-auto">
            <button onClick={selectAll} className="text-sm text-gray-400 hover:text-white">Select All ({filteredPlayers.length})</button>
            <span className="text-gray-500 text-sm">Showing {filteredPlayers.length} of {playersData.length}</span>
          </div>
          <table className="w-full max-w-7xl mx-auto text-sm">
            <thead className="bg-gray-800 sticky top-0">
              <tr>
                <th className="p-2 w-8"><input type="checkbox" onChange={(e) => e.target.checked ? selectAll() : clearSelection()} checked={selectedPlayers.size === filteredPlayers.length && filteredPlayers.length > 0} /></th>
                <th className="p-2 text-left">Actions</th>
                <th className="p-2 text-left">Player</th>
                <th className="p-2 text-left">Team</th>
                <th className="p-2">Region</th>
                <th className="p-2">Role</th>
                <th className="p-2">Avg</th>
                <th className="p-2">Peak</th>
                <th className="p-2">Trend</th>
                <th className="p-2">Chart</th>
                <th className="p-2 text-left">Note</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.map((p, i) => (
                <tr key={p.name} className={`border-b border-gray-700 hover:bg-gray-800 cursor-pointer ${selectedPlayers.has(p.name) ? 'bg-gray-750' : i % 2 === 0 ? 'bg-gray-850' : ''}`} onClick={() => setSelectedPlayer(p)}>
                  <td className="p-2" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={selectedPlayers.has(p.name)} onChange={() => toggleSelect(p.name)} />
                  </td>
                  <td className="p-2" onClick={e => e.stopPropagation()}>
                    <div className="flex gap-1">
                      {Object.entries(categories).map(([key, cat]) => (
                        <button key={key} onClick={() => setCategory(p.name, key)} className={`w-7 h-7 rounded text-xs ${playerCategories[p.name] === key ? cat.color + ' ' + cat.textColor : 'bg-gray-700 hover:bg-gray-600'}`} title={`${cat.label} (${cat.key})`}>
                          {key[0]}
                        </button>
                      ))}
                      <button onClick={() => toggleCompare(p)} className={`w-7 h-7 rounded text-xs ${compareList.find(x => x.name === p.name) ? 'bg-cyan-600' : 'bg-gray-700 hover:bg-gray-600'}`} title="Compare">C</button>
                      <button onClick={() => toggleRoster(p)} className={`w-7 h-7 rounded text-xs ${roster.find(x => x.name === p.name) ? 'bg-orange-600' : 'bg-gray-700 hover:bg-gray-600'}`} title="Add to Roster">+</button>
                    </div>
                  </td>
                  <td className="p-2 font-bold">{p.star ? '⭐ ' : ''}{p.name}</td>
                  <td className="p-2 text-gray-300">{p.team}</td>
                  <td className="p-2 text-center"><span className={`px-2 py-1 rounded text-xs ${p.region === 'NAL' ? 'bg-blue-900' : p.region === 'EML' ? 'bg-purple-900' : p.region === 'SAL' ? 'bg-green-900' : 'bg-orange-900'}`}>{p.region}</span></td>
                  <td className="p-2 text-center text-xs">{p.role}</td>
                  <td className={`p-2 text-center ${getRatingColor(p.avg)} rounded`}>{p.avg.toFixed(2)}</td>
                  <td className={`p-2 text-center ${getRatingColor(p.peak)} rounded`}>{p.peak.toFixed(2)}</td>
                  <td className={`p-2 text-center ${getTrendColor(p.trend)}`}>{p.trend >= 0 ? '+' : ''}{p.trend.toFixed(2)}</td>
                  <td className="p-2 text-center"><Sparkline s1={p.s1} s2={p.s2} majorAvg={p.majorAvg} /></td>
                  <td className="p-2 text-xs text-gray-400 max-w-xs truncate" title={p.note}>{p.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPlayers.length === 0 && <div className="text-center text-gray-500 py-8">No players match filters</div>}
        </div>
      )}

      {/* Player Detail Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50" onClick={() => setSelectedPlayer(null)}>
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold">{selectedPlayer.star ? '⭐ ' : ''}{selectedPlayer.name}</h2>
                <p className="text-gray-400">{selectedPlayer.team} - {selectedPlayer.region} - {selectedPlayer.tier}</p>
                <p className="text-gray-500">{selectedPlayer.role}</p>
                {selectedPlayer.twitter && (
                  <a href={`https://twitter.com/${selectedPlayer.twitter}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm">
                    @{selectedPlayer.twitter}
                  </a>
                )}
              </div>
              <button onClick={() => setSelectedPlayer(null)} className="text-gray-400 hover:text-white text-2xl">x</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-700 p-3 rounded text-center">
                <div className="text-gray-400 text-sm">Average</div>
                <div className={`text-xl font-bold ${getRatingColor(selectedPlayer.avg)} px-2 py-1 rounded`}>{selectedPlayer.avg.toFixed(2)}</div>
              </div>
              <div className="bg-gray-700 p-3 rounded text-center">
                <div className="text-gray-400 text-sm">Peak</div>
                <div className={`text-xl font-bold ${getRatingColor(selectedPlayer.peak)} px-2 py-1 rounded`}>{selectedPlayer.peak.toFixed(2)}</div>
              </div>
              <div className="bg-gray-700 p-3 rounded text-center">
                <div className="text-gray-400 text-sm">Floor</div>
                <div className={`text-xl font-bold ${getRatingColor(selectedPlayer.floor)} px-2 py-1 rounded`}>{selectedPlayer.floor.toFixed(2)}</div>
              </div>
              <div className="bg-gray-700 p-3 rounded text-center">
                <div className="text-gray-400 text-sm">Trend</div>
                <div className={`text-xl font-bold ${getTrendColor(selectedPlayer.trend)}`}>{selectedPlayer.trend >= 0 ? '+' : ''}{selectedPlayer.trend.toFixed(2)}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-700 p-3 rounded text-center">
                <div className="text-gray-400 text-sm">S1</div>
                <div className="text-lg">{selectedPlayer.s1?.toFixed(2) || '-'}</div>
              </div>
              <div className="bg-gray-700 p-3 rounded text-center">
                <div className="text-gray-400 text-sm">S2</div>
                <div className="text-lg">{selectedPlayer.s2?.toFixed(2) || '-'}</div>
              </div>
              <div className="bg-gray-700 p-3 rounded text-center">
                <div className="text-gray-400 text-sm">Major Avg</div>
                <div className="text-lg">{selectedPlayer.majorAvg?.toFixed(2) || '-'}</div>
              </div>
            </div>

            <div className="bg-gray-700 p-3 rounded mb-4">
              <div className="text-gray-400 text-sm mb-1">Performance Trend</div>
              <div className="flex justify-center">
                <Sparkline s1={selectedPlayer.s1} s2={selectedPlayer.s2} majorAvg={selectedPlayer.majorAvg} />
              </div>
            </div>

            <div className="bg-gray-700 p-3 rounded mb-4">
              <div className="text-gray-400 text-sm mb-1">Note</div>
              <p>{selectedPlayer.note}</p>
            </div>

            <div className="bg-gray-700 p-3 rounded mb-4">
              <div className="text-gray-400 text-sm mb-1">Your Notes</div>
              <textarea
                value={customNotes[selectedPlayer.name] || ''}
                onChange={(e) => updateCustomNote(selectedPlayer.name, e.target.value)}
                placeholder="Add your own notes..."
                className="w-full bg-gray-600 rounded p-2 text-white"
                rows={3}
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {Object.entries(categories).map(([key, cat]) => (
                <button key={key} onClick={() => setCategory(selectedPlayer.name, key)} className={`px-4 py-2 rounded ${playerCategories[selectedPlayer.name] === key ? cat.color + ' ' + cat.textColor : 'bg-gray-700 hover:bg-gray-600'}`}>
                  {cat.label} ({cat.key})
                </button>
              ))}
              <button onClick={() => toggleCompare(selectedPlayer)} className={`px-4 py-2 rounded ${compareList.find(x => x.name === selectedPlayer.name) ? 'bg-cyan-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
                {compareList.find(x => x.name === selectedPlayer.name) ? 'Remove from Compare' : 'Add to Compare'}
              </button>
              <button onClick={() => toggleRoster(selectedPlayer)} className={`px-4 py-2 rounded ${roster.find(x => x.name === selectedPlayer.name) ? 'bg-orange-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
                {roster.find(x => x.name === selectedPlayer.name) ? 'Remove from Roster' : 'Add to Roster (R)'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-gray-500 text-xs mt-8">
        Data: siege.gg | Rosters: Liquipedia Jan 2026 | * = Star player | Auto-saves to browser
      </div>
    </div>
  );
}
