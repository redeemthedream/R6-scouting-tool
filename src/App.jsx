import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';

// COMPLETE player database - ALL players from ALL teams with star markers and Twitter handles
const playersData = [
  // ============================================
  // NAL - SHOPIFY REBELLION
  // ============================================
  { name: "Canadian", team: "Shopify Rebellion", region: "NAL", tier: "T1", role: "IGL", avg: 0.76, peak: 1.01, floor: 0.69, trend: -0.02, s1: 0.71, s2: 0.69, majorAvg: 0.87, events: 4, note: "0.76 yr | -29 entry | 0.70/0.81 ATK/DEF | Pure caller, DEF anchor", star: true, twitter: null },
  { name: "Spoit", team: "Shopify Rebellion", region: "NAL", tier: "T1", role: "Entry", avg: 1.12, peak: 1.22, floor: 0.70, trend: -0.04, s1: 1.22, s2: 1.18, majorAvg: 0.84, events: 4, note: "1.12 yr | +4 entry | 1.15/1.09 ATK/DEF | Balanced star", star: true, twitter: "SpoitR6" },
  { name: "Surf", team: "Shopify Rebellion", region: "NAL", tier: "T1", role: "Sup/Anchor", avg: 1.11, peak: 1.19, floor: 0.67, trend: 0.06, s1: 1.09, s2: 1.15, majorAvg: 0.93, events: 4, note: "1.11 yr | +8 entry | 1.11/1.11 ATK/DEF | PERFECTLY BALANCED - rare", star: true, twitter: "surfego" },
  { name: "Rexen", team: "Shopify Rebellion", region: "NAL", tier: "T1", role: "Flex", avg: 1.10, peak: 1.23, floor: 0.99, trend: -0.09, s1: 1.18, s2: 1.09, majorAvg: 1.12, events: 4, note: "1.10 yr | +8 entry | 1.02/1.17 ATK/DEF | DEF SPECIALIST", star: true, twitter: "RexenR6" },
  { name: "Ambi", team: "Shopify Rebellion", region: "NAL", tier: "T1", role: "Flex", avg: 1.14, peak: 1.32, floor: 0.95, trend: -0.37, s1: 1.32, s2: 0.95, majorAvg: 1.07, events: 4, note: "1.14 yr | +21 entry | 1.15/1.13 ATK/DEF | High entry for flex, balanced", star: true, twitter: "Ambi_R6" },

  // ============================================
  // NAL - DARKZERO
  // ============================================
  { name: "Nafe", team: "DarkZero", region: "NAL", tier: "T1", role: "IGL", avg: 0.88, peak: 1.07, floor: 0.82, trend: -0.07, s1: 1.04, s2: 0.97, majorAvg: 0.93, events: 4, note: "0.88 yr | -10 entry | 0.81/0.96 ATK/DEF | IGL, struggles ATK", star: false, twitter: "Nafe_R6" },
  { name: "CTZN", team: "DarkZero", region: "NAL", tier: "T1", role: "Flex", avg: 1.20, peak: 1.35, floor: 0.90, trend: -0.45, s1: 1.35, s2: 0.90, majorAvg: 1.16, events: 4, note: "1.20 yr | +11 entry | 1.25/1.14 ATK/DEF | ATK MONSTER - creates openings", star: true, twitter: "CtznR6" },
  { name: "njr", team: "DarkZero", region: "NAL", tier: "T1", role: "Flex", avg: 1.10, peak: 1.31, floor: 0.97, trend: -0.25, s1: 1.22, s2: 0.97, majorAvg: 1.15, events: 4, note: "1.10 yr | -5 entry | 1.14/1.06 ATK/DEF | NEGATIVE entry - trader not opener", star: true, twitter: "njrR6S" },
  { name: "SpiriTz", team: "DarkZero", region: "NAL", tier: "T1", role: "Flex", avg: 0.95, peak: 0.98, floor: 0.82, trend: 0.00, s1: 0.95, s2: 0.95, majorAvg: 0.98, events: 4, note: "0.95 yr | +3 entry | 1.00/0.89 ATK/DEF | ATK only - DEF liability (0.89)", star: false, twitter: "SpiriTzR6" },
  { name: "Pamba", team: "DarkZero", region: "NAL", tier: "T1", role: "Sup/Anchor", avg: 0.88, peak: 0.95, floor: 0.80, trend: -0.05, s1: 0.92, s2: 0.87, majorAvg: 0.85, events: 4, note: "Support player, high KOST", star: false, twitter: null },

  // ============================================
  // NAL - SSG (Spacestation Gaming)
  // ============================================
  { name: "Fultz", team: "SSG", region: "NAL", tier: "T1", role: "IGL", avg: 0.92, peak: 0.97, floor: 0.81, trend: 0.01, s1: 0.96, s2: 0.97, majorAvg: 0.88, events: 4, note: "0.92 yr | +17 entry | 0.81/1.04 ATK/DEF | RARE +entry IGL, DEF anchor", star: true, twitter: "Fultz" },
  { name: "Nuers", team: "SSG", region: "NAL", tier: "T1", role: "Flex", avg: 1.09, peak: 1.32, floor: 0.99, trend: 0.07, s1: 1.09, s2: 1.16, majorAvg: 1.02, events: 4, note: "1.09 yr | +11 entry | 1.00/1.19 ATK/DEF | DEF GOD (1.19) - anchor star", star: true, twitter: "Nuersss" },
  { name: "J9O", team: "SSG", region: "NAL", tier: "T1", role: "Flex", avg: 1.10, peak: 1.27, floor: 0.97, trend: -0.14, s1: 1.20, s2: 1.06, majorAvg: 1.02, events: 4, note: "1.10 yr | +14 entry | 1.09/1.10 ATK/DEF | Perfectly balanced flex", star: true, twitter: "J9Or6" },
  { name: "Benjamaster", team: "SSG", region: "NAL", tier: "T1", role: "Sup/Anchor", avg: 0.97, peak: 1.33, floor: 0.70, trend: -0.12, s1: 0.99, s2: 0.87, majorAvg: 0.98, events: 4, note: "0.97 yr | +2 entry | 0.88/1.06 ATK/DEF | DEF support", star: false, twitter: "Benjamaster2k" },
  { name: "Ashn", team: "SSG", region: "NAL", tier: "T1", role: "Entry", avg: 0.96, peak: 1.15, floor: 0.65, trend: -0.03, s1: 1.05, s2: 1.02, majorAvg: 0.83, events: 4, note: "0.96 yr | +6 entry | 0.94/0.98 ATK/DEF | WEAK entry diff for role", star: false, twitter: "AshnR6s" },

  // ============================================
  // NAL - M80
  // ============================================
  { name: "Hotancold", team: "M80", region: "NAL", tier: "T1", role: "IGL", avg: 0.98, peak: 0.99, floor: 0.74, trend: -0.10, s1: 0.96, s2: 0.86, majorAvg: 0.87, events: 4, note: "0.98 yr | -2 entry | 0.85/1.12 ATK/DEF | IGL DEF anchor (1.12)", star: true, twitter: "Hotancold" },
  { name: "Dfuzr", team: "M80", region: "NAL", tier: "T1", role: "Entry", avg: 1.15, peak: 1.22, floor: 0.94, trend: 0.13, s1: 1.09, s2: 1.22, majorAvg: 1.03, events: 4, note: "1.15 yr | +13 entry | 1.12/1.18 ATK/DEF | Balanced star, DEF-leaning", star: true, twitter: "dfuzrR6S" },
  { name: "Gunnar", team: "M80", region: "NAL", tier: "T1", role: "Entry", avg: 1.09, peak: 1.26, floor: 0.98, trend: 0.14, s1: 0.98, s2: 1.12, majorAvg: 1.18, events: 4, note: "1.09 yr | +34 entry | 1.05/1.13 ATK/DEF | BEST ENTRY CREATOR NAL", star: true, twitter: "Gunnar_r6" },
  { name: "Gaveni", team: "M80", region: "NAL", tier: "T1", role: "Flex", avg: 1.13, peak: 1.23, floor: 1.01, trend: 0.17, s1: 1.06, s2: 1.23, majorAvg: 1.05, events: 4, note: "1.13 yr | +6 entry | 1.18/1.07 ATK/DEF | ATK playmaker (1.18)", star: true, twitter: "GaveniPanini" },
  { name: "Kyno", team: "M80", region: "NAL", tier: "T1", role: "Flex", avg: 1.03, peak: 1.10, floor: 0.82, trend: 0.20, s1: 0.90, s2: 1.10, majorAvg: 0.94, events: 4, note: "1.03 yr | +9 entry | 1.00/1.06 ATK/DEF | Balanced, improving", star: false, twitter: "kynor6" },

  // ============================================
  // NAL - OXYGEN ESPORTS
  // ============================================
  { name: "Forrest", team: "Oxygen", region: "NAL", tier: "T1", role: "IGL", avg: 0.79, peak: 1.04, floor: 0.78, trend: 0.05, s1: 0.93, s2: 0.98, majorAvg: 0.88, events: 4, note: "0.79 yr | -18 entry | 0.59/0.98 ATK/DEF | TERRIBLE ATK (0.59) - liability", star: false, twitter: "forrest_r6" },
  { name: "Gryxr", team: "Oxygen", region: "NAL", tier: "T1", role: "Flex", avg: 1.11, peak: 1.18, floor: 1.02, trend: -0.16, s1: 1.18, s2: 1.02, majorAvg: 1.11, events: 4, note: "1.11 yr | +2 entry | 1.13/1.09 ATK/DEF | Balanced star, low entry", star: true, twitter: "GryxrPR" },
  { name: "Yoggah", team: "Oxygen", region: "NAL", tier: "T1", role: "IGL/Flex", avg: 1.02, peak: 1.12, floor: 0.81, trend: 0.07, s1: 1.05, s2: 1.12, majorAvg: 0.85, events: 4, note: "1.02 yr | +1 entry | 1.00/1.04 ATK/DEF | Average, no standout", star: false, twitter: "Yoggah_" },
  { name: "Atom", team: "Oxygen", region: "NAL", tier: "T1", role: "Flex", avg: 1.07, peak: 1.29, floor: 0.75, trend: 0.26, s1: 1.03, s2: 1.29, majorAvg: 0.90, events: 4, note: "1.07 yr | -2 entry | 1.02/1.12 ATK/DEF | DEF anchor not star fragger", star: false, twitter: "AtomR6S" },
  { name: "GMZ", team: "Oxygen", region: "NAL", tier: "T1", role: "Flex/Entry", avg: 0.97, peak: 1.16, floor: 0.81, trend: 0.27, s1: 0.89, s2: 1.16, majorAvg: 0.81, events: 4, note: "0.97 yr | -12 entry | 0.93/1.01 ATK/DEF | Support, negative entry", star: false, twitter: "GMZR6" },

  // ============================================
  // NAL - WILDCARD
  // ============================================
  { name: "Spiker", team: "Wildcard", region: "NAL", tier: "T1", role: "IGL", avg: 1.01, peak: 1.05, floor: 0.93, trend: 0.05, s1: 1.00, s2: 1.05, majorAvg: 0.99, events: 4, note: "1.01 yr | +3 entry | 0.88/1.14 ATK/DEF | Elite fragging IGL, DEF anchor", star: true, twitter: "SpikerR6" },
  { name: "Bae", team: "Wildcard", region: "NAL", tier: "T1", role: "Entry", avg: 1.03, peak: 1.39, floor: 0.92, trend: 0.01, s1: 1.08, s2: 1.09, majorAvg: 1.16, events: 4, note: "1.03 yr | +7 entry | 1.07/1.00 ATK/DEF | Weak entry diff for role", star: true, twitter: "BaeR6S" },
  { name: "Kanzen", team: "Wildcard", region: "NAL", tier: "T1", role: "Entry", avg: 1.13, peak: 1.16, floor: 0.59, trend: -0.14, s1: 1.14, s2: 1.00, majorAvg: 0.88, events: 4, note: "1.13 yr | -2 entry | 1.10/1.15 ATK/DEF | TRADER not opener - DEF star", star: true, twitter: "KanzenR6" },
  { name: "BBYSharkk", team: "Wildcard", region: "NAL", tier: "T1", role: "Flex", avg: 1.01, peak: 1.07, floor: 0.88, trend: 0.19, s1: 0.88, s2: 1.07, majorAvg: 0.99, events: 4, note: "1.01 yr | +18 entry | 0.97/1.04 ATK/DEF | HIDDEN entry talent", star: true, twitter: "BBYSharkk" },
  { name: "Dash", team: "Wildcard", region: "NAL", tier: "T1", role: "Flex", avg: 0.91, peak: 1.00, floor: 0.61, trend: 0.16, s1: 0.84, s2: 1.00, majorAvg: 0.61, events: 4, note: "0.91 yr | -9 entry | 0.79/1.03 ATK/DEF | DEF ONLY - 0.79 ATK liability", star: false, twitter: "d4shR6" },

  // ============================================
  // NAL - CLOUD9
  // ============================================
  { name: "Gity", team: "Cloud9", region: "NAL", tier: "T1", role: "Flex", avg: 0.93, peak: 1.03, floor: 0.88, trend: 0.13, s1: 0.90, s2: 1.03, majorAvg: null, events: 2, note: "0.93 yr | +2 entry | 0.90/0.96 ATK/DEF | Lower table flex, improving", star: false, twitter: "GityR6" },
  { name: "Silent", team: "Cloud9", region: "NAL", tier: "T1", role: "Flex", avg: 1.01, peak: 1.13, floor: 0.98, trend: -0.06, s1: 1.05, s2: 0.99, majorAvg: null, events: 2, note: "1.01 yr | +5 entry | 1.02/1.00 ATK/DEF | Team STAR - balanced", star: true, twitter: "SilentR6S" },
  { name: "Kobelax", team: "Cloud9", region: "NAL", tier: "T1", role: "Flex", avg: 0.99, peak: 1.12, floor: 0.91, trend: -0.15, s1: 1.06, s2: 0.91, majorAvg: null, events: 2, note: "0.99 yr | +3 entry | 0.97/1.01 ATK/DEF | S1 flash, S2 crash", star: false, twitter: "KobelaxR6" },
  { name: "Dream", team: "Cloud9", region: "NAL", tier: "T1", role: "Sup/Anchor", avg: 0.82, peak: 0.90, floor: 0.75, trend: 0.15, s1: 0.75, s2: 0.90, majorAvg: null, events: 2, note: "0.82 yr | -8 entry | 0.74/0.90 ATK/DEF | DEF support only", star: false, twitter: "DreamR6S" },
  { name: "Hat", team: "Cloud9", region: "NAL", tier: "T1", role: "Entry", avg: 0.65, peak: 0.65, floor: 0.65, trend: 0, s1: null, s2: 0.65, majorAvg: null, events: 1, note: "0.65 yr | -12 entry | 0.58/0.72 ATK/DEF | STRUGGLING entry", star: false, twitter: "HatR6" },

  // ============================================
  // NAL - ENVY
  // ============================================
  { name: "Snake", team: "ENVY", region: "NAL", tier: "T1", role: "Entry", avg: 0.92, peak: 1.05, floor: 0.80, trend: 0.25, s1: 0.80, s2: 1.05, majorAvg: null, events: 2, note: "0.92 yr | +8 entry | 0.96/0.88 ATK/DEF | ATK specialist - T2 upside", star: true, twitter: "SnakeR6S" },
  { name: "ATKRival", team: "ENVY", region: "NAL", tier: "T1", role: "Flex", avg: 0.82, peak: 0.92, floor: 0.78, trend: 0.05, s1: 0.79, s2: 0.84, majorAvg: null, events: 3, note: "0.82 yr | LCQ 0.92 on DarkZero loan | Improvement at LCQ", star: false, twitter: null },
  { name: "Aiden", team: "ENVY", region: "NAL", tier: "T1", role: "Entry", avg: 0.81, peak: 0.81, floor: 0.81, trend: 0, s1: null, s2: 0.81, majorAvg: null, events: 1, note: "0.81 yr | -4 entry | 0.79/0.83 ATK/DEF | Entry not creating", star: false, twitter: "AidenR6S" },
  { name: "JJBlaztful", team: "ENVY", region: "NAL", tier: "T1", role: "IGL", avg: 0.66, peak: 0.75, floor: 0.58, trend: 0.17, s1: 0.58, s2: 0.75, majorAvg: null, events: 2, note: "0.66 yr | -15 entry | 0.55/0.77 ATK/DEF | Pure IGL - weak ATK", star: false, twitter: "JJBlaztful" },
  { name: "Emilio", team: "ENVY", region: "NAL", tier: "T1", role: "Sup/Anchor", avg: 0.71, peak: 0.91, floor: 0.42, trend: 0.07, s1: 0.68, s2: 0.75, majorAvg: null, events: 2, note: "0.71 yr | -6 entry | 0.65/0.77 ATK/DEF | Support, inconsistent", star: false, twitter: "EmilioR6" },

  // ============================================
  // NAL - LFO
  // ============================================
  { name: "Eddy", team: "LFO", region: "NAL", tier: "T1", role: "Entry", avg: 0.91, peak: 1.12, floor: 0.78, trend: -0.25, s1: 1.03, s2: 0.78, majorAvg: null, events: 3, note: "0.91 yr | LCQ 1.12 BOUNCE BACK | 1.34/0.90 ATK/DEF at LCQ", star: false, twitter: null },
  { name: "Fenz", team: "LFO", region: "NAL", tier: "T1", role: "Flex", avg: 0.88, peak: 1.32, floor: 0.82, trend: -0.11, s1: 0.93, s2: 0.82, majorAvg: null, events: 3, note: "0.88 yr | LCQ 1.32 ELITE | 1.35/1.28 ATK/DEF - LCQ star performance", star: true, twitter: null },
  { name: "Epic", team: "LFO", region: "NAL", tier: "T1", role: "Flex", avg: 0.83, peak: 1.10, floor: 0.67, trend: -0.07, s1: 0.87, s2: 0.80, majorAvg: null, events: 2, note: "0.83 yr | -5 entry | 0.75/0.91 ATK/DEF | DEF ONLY - ATK liability", star: false, twitter: "EpicR6S" },
  { name: "Kixhro", team: "LFO", region: "NAL", tier: "T1", role: "Flex", avg: 0.80, peak: 1.10, floor: 0.67, trend: -0.24, s1: 0.91, s2: 0.67, majorAvg: null, events: 2, note: "0.80 yr | -2 entry | 0.85/0.75 ATK/DEF | ATK only - CRASHED S2", star: false, twitter: "KixhroR6" },
  { name: "Beeno", team: "LFO", region: "NAL", tier: "T1", role: "IGL", avg: 0.80, peak: 0.91, floor: 0.57, trend: 0.15, s1: 0.73, s2: 0.88, majorAvg: null, events: 2, note: "0.80 yr | -7 entry | 0.71/0.89 ATK/DEF | IGL plant king 14%, improving", star: false, twitter: "BeenoR6" },

  // ============================================
  // NAL - TEAM CRUELTY
  // ============================================
  { name: "Pyroxz", team: "Team Cruelty", region: "NAL", tier: "T1", role: "Flex", avg: 0.98, peak: 1.02, floor: 0.90, trend: 0.07, s1: 0.95, s2: 1.02, majorAvg: null, events: 2, note: "0.98 yr | +6 entry | 0.99/0.97 ATK/DEF | Team STAR - balanced, consistent", star: true, twitter: "PyroxzR6" },
  { name: "Fatal", team: "Team Cruelty", region: "NAL", tier: "T1", role: "Flex", avg: 0.85, peak: 1.11, floor: 0.63, trend: -0.41, s1: 1.04, s2: 0.63, majorAvg: null, events: 2, note: "0.85 yr | +2 entry | 0.88/0.82 ATK/DEF | S1 STAR crashed S2 (-0.41)", star: false, twitter: "FatalR6S" },
  { name: "Rovi", team: "Team Cruelty", region: "NAL", tier: "T1", role: "Flex", avg: 0.69, peak: 0.69, floor: 0.69, trend: 0, s1: null, s2: 0.69, majorAvg: null, events: 1, note: "0.69 yr | -8 entry | 0.62/0.76 ATK/DEF | New S2 - struggling", star: false, twitter: "RoviR6" },
  { name: "Motumbo", team: "Team Cruelty", region: "NAL", tier: "T1", role: "Sup/Anchor", avg: 0.67, peak: 0.73, floor: 0.59, trend: -0.14, s1: 0.73, s2: 0.59, majorAvg: null, events: 2, note: "0.67 yr | -4 entry | 0.58/0.76 ATK/DEF | Plant specialist 19%, DEF only", star: false, twitter: "MotumboR6" },
  { name: "CadenT", team: "Team Cruelty", region: "NAL", tier: "T1", role: "Entry", avg: 0.59, peak: 0.59, floor: 0.59, trend: 0, s1: null, s2: 0.59, majorAvg: null, events: 1, note: "0.59 yr | -14 entry | 0.52/0.66 ATK/DEF | STRUGGLING badly as entry", star: false, twitter: "CadenTR6" },

  // ============================================
  // EML - G2 ESPORTS
  // ============================================
  { name: "Alem4o", team: "G2 Esports", region: "EML", tier: "T1", role: "IGL", avg: 0.95, peak: 1.04, floor: 0.89, trend: -0.08, s1: 1.04, s2: 0.96, majorAvg: 0.90, events: 4, note: "0.95 yr | -4 entry | 0.89/1.01 ATK/DEF | IGL legend, DEF anchor", star: true, twitter: "Alem4oR6" },
  { name: "Stompn", team: "G2 Esports", region: "EML", tier: "T1", role: "Flex", avg: 1.24, peak: 1.28, floor: 1.19, trend: -0.02, s1: 1.21, s2: 1.19, majorAvg: 1.26, events: 4, note: "1.24 yr | +15 entry | 1.27/1.21 ATK/DEF | ELITE CONSISTENT - best flex EML", star: true, twitter: "StompnR6" },
  { name: "Doki", team: "G2 Esports", region: "EML", tier: "T1", role: "Flex", avg: 1.05, peak: 1.23, floor: 0.89, trend: -0.19, s1: 1.13, s2: 0.94, majorAvg: 1.06, events: 4, note: "1.05 yr | +3 entry | 1.08/1.02 ATK/DEF | Munich flash, S2 slump", star: false, twitter: "DokiR6S" },
  { name: "Loira", team: "G2 Esports", region: "EML", tier: "T1", role: "Entry", avg: 1.09, peak: 1.22, floor: 0.92, trend: -0.05, s1: 1.14, s2: 1.09, majorAvg: 1.07, events: 4, note: "1.09 yr | +19 entry | 1.15/1.03 ATK/DEF | ATK MONSTER - entry creator", star: true, twitter: "LoiraR6" },
  { name: "BlaZ", team: "G2 Esports", region: "EML", tier: "T1", role: "Sup/Anchor", avg: 0.95, peak: 1.13, floor: 0.80, trend: 0.11, s1: 1.02, s2: 1.13, majorAvg: 0.83, events: 4, note: "0.95 yr | -2 entry | 0.87/1.03 ATK/DEF | Support improving, DEF focus", star: false, twitter: "BlaZR6S" },

  // ============================================
  // EML - TEAM FALCONS
  // ============================================
  { name: "BriD", team: "Team Falcons", region: "EML", tier: "T1", role: "IGL", avg: 1.01, peak: 1.10, floor: 0.94, trend: 0.08, s1: 0.94, s2: 1.02, majorAvg: 1.10, events: 4, note: "1.01 yr | +8 entry | 0.94/1.08 ATK/DEF | IGL plant king - DEF ANCHOR", star: true, twitter: "BriDR6S" },
  { name: "Shaiiko", team: "Team Falcons", region: "EML", tier: "T1", role: "Flex", avg: 1.17, peak: 1.31, floor: 1.11, trend: 0.20, s1: 1.11, s2: 1.31, majorAvg: 1.19, events: 4, note: "1.17 yr | +22 entry | 1.21/1.13 ATK/DEF | GOAT - ATK playmaker", star: true, twitter: "ShaikkoR6" },
  { name: "Solotov", team: "Team Falcons", region: "EML", tier: "T1", role: "Entry", avg: 1.05, peak: 1.35, floor: 0.71, trend: 0.03, s1: 1.06, s2: 1.09, majorAvg: 1.03, events: 4, note: "1.05 yr | +28 entry | 1.12/0.98 ATK/DEF | ELITE ENTRY creator - ATK god", star: true, twitter: "SolotovR6" },
  { name: "LikEfac", team: "Team Falcons", region: "EML", tier: "T1", role: "Entry", avg: 1.05, peak: 1.16, floor: 0.72, trend: 0.18, s1: 0.98, s2: 1.16, majorAvg: 0.88, events: 4, note: "1.05 yr | +12 entry | 1.09/1.01 ATK/DEF | Captain trending UP S2 breakout", star: true, twitter: "LikEfacR6" },
  { name: "Yuzus", team: "Team Falcons", region: "EML", tier: "T1", role: "Flex", avg: 1.10, peak: 1.19, floor: 0.90, trend: 0.06, s1: 1.13, s2: 1.19, majorAvg: 0.99, events: 4, note: "1.10 yr | +4 entry | 1.07/1.13 ATK/DEF | Clutch specialist, DEF anchor", star: true, twitter: "YuzusR6" },

  // ============================================
  // EML - TEAM SECRET
  // ============================================
  { name: "Savage", team: "Team Secret", region: "EML", tier: "T1", role: "IGL", avg: 1.05, peak: 1.16, floor: 0.99, trend: 0.03, s1: 0.99, s2: 1.02, majorAvg: 1.09, events: 4, note: "1.05 yr | +5 entry | 0.95/1.15 ATK/DEF | IGL DEF GOD (1.67 EWC)", star: true, twitter: "SavageR6S" },
  { name: "Jume", team: "Team Secret", region: "EML", tier: "T1", role: "Flex", avg: 1.17, peak: 1.39, floor: 1.08, trend: 0.17, s1: 1.22, s2: 1.39, majorAvg: 1.12, events: 4, note: "1.17 yr | +18 entry | 1.22/1.12 ATK/DEF | S2 MVP - ELITE ATK", star: true, twitter: "JumeR6" },
  { name: "Adrian", team: "Team Secret", region: "EML", tier: "T1", role: "Sup/Anchor", avg: 1.12, peak: 1.35, floor: 0.94, trend: -0.02, s1: 1.10, s2: 1.08, majorAvg: 1.15, events: 4, note: "1.12 yr | +3 entry | 1.05/1.19 ATK/DEF | ELITE support - DEF anchor", star: true, twitter: "AdrianR6S" },
  { name: "Mowwwgli", team: "Team Secret", region: "EML", tier: "T1", role: "Entry", avg: 0.96, peak: 1.05, floor: 0.81, trend: -0.10, s1: 1.05, s2: 0.95, majorAvg: 0.92, events: 4, note: "0.96 yr | +16 entry | 1.00/0.92 ATK/DEF | High entry but declining form", star: false, twitter: "MowwwgliR6" },
  { name: "Noa", team: "Team Secret", region: "EML", tier: "T1", role: "Flex", avg: 1.03, peak: 1.18, floor: 0.96, trend: -0.21, s1: 1.17, s2: 0.96, majorAvg: 1.09, events: 4, note: "1.03 yr | +7 entry | 1.06/1.00 ATK/DEF | S1 star CRASHED S2", star: false, twitter: "NoaR6S" },

  // ============================================
  // EML - VIRTUS.PRO
  // ============================================
  { name: "Always", team: "Virtus.pro", region: "EML", tier: "T1", role: "IGL", avg: 0.93, peak: 0.98, floor: 0.85, trend: -0.12, s1: 0.97, s2: 0.85, majorAvg: 0.98, events: 3, note: "0.93 yr | -6 entry | 0.85/1.01 ATK/DEF | IGL captain, DEF focus", star: false, twitter: "AlwaysR6S" },
  { name: "dan", team: "Virtus.pro", region: "EML", tier: "T1", role: "Entry", avg: 1.06, peak: 1.47, floor: 0.95, trend: 0.13, s1: 0.95, s2: 1.08, majorAvg: 1.47, events: 3, note: "1.06 yr | +31 entry | 1.15/0.97 ATK/DEF | BIG STAGE MONSTER - Munich MVP", star: true, twitter: "danR6S" },
  { name: "p4sh4", team: "Virtus.pro", region: "EML", tier: "T1", role: "Flex", avg: 1.20, peak: 1.23, floor: 1.07, trend: -0.16, s1: 1.23, s2: 1.07, majorAvg: 1.16, events: 3, note: "1.20 yr | +14 entry | 1.24/1.16 ATK/DEF | ELITE FLEX - ATK dominant", star: true, twitter: "p4sh4R6" },
  { name: "ShepparD", team: "Virtus.pro", region: "EML", tier: "T1", role: "Sup/Anchor", avg: 0.99, peak: 1.45, floor: 0.76, trend: -0.25, s1: 1.01, s2: 0.76, majorAvg: 1.11, events: 4, note: "0.99 yr | +2 entry | 0.92/1.06 ATK/DEF | High peaks but S2 CRASH", star: false, twitter: "ShepparDR6S" },
  { name: "JoyStiCK", team: "Virtus.pro", region: "EML", tier: "T1", role: "Flex", avg: 0.91, peak: 1.03, floor: 0.75, trend: -0.19, s1: 0.94, s2: 0.75, majorAvg: 1.03, events: 3, note: "0.91 yr | -3 entry | 0.88/0.94 ATK/DEF | EWC flash, S2 slump", star: false, twitter: "JoyStiCKR6" },

  // ============================================
  // EML - GEN.G ESPORTS
  // ============================================
  { name: "Nayqo", team: "Gen.G Esports", region: "EML", tier: "T1", role: "IGL", avg: 1.09, peak: 1.22, floor: 1.03, trend: 0.05, s1: 1.03, s2: 1.08, majorAvg: 1.22, events: 3, note: "1.09 yr | +8 entry | 1.06/1.12 ATK/DEF | FRAGGING IGL - EWC 1.22", star: true, twitter: "NayqoR6" },
  { name: "DEADSHT", team: "Gen.G Esports", region: "EML", tier: "T1", role: "Sup/Anchor", avg: 0.90, peak: 1.11, floor: 0.85, trend: 0.26, s1: 0.85, s2: 1.11, majorAvg: null, events: 2, note: "0.90 yr | -4 entry | 0.82/0.98 ATK/DEF | S2 BREAKOUT (+0.26)", star: false, twitter: "DEADSHTR6" },
  { name: "SkyZs", team: "Gen.G Esports", region: "EML", tier: "T1", role: "Entry", avg: 1.02, peak: 1.15, floor: 0.90, trend: 0.08, s1: 0.94, s2: 1.02, majorAvg: 1.15, events: 3, note: "1.02 yr | +11 entry | 1.08/0.96 ATK/DEF | Good entry creator - ATK focus", star: true, twitter: "SkyZsR6" },
  { name: "Asa", team: "Gen.G Esports", region: "EML", tier: "T1", role: "Sup/Anchor", avg: 0.94, peak: 1.05, floor: 0.85, trend: 0.05, s1: 0.89, s2: 0.94, majorAvg: 1.05, events: 3, note: "0.94 yr | -2 entry | 0.88/1.00 ATK/DEF | Solid support, DEF focus", star: false, twitter: "AsaR6S" },
  { name: "Quartz", team: "Gen.G Esports", region: "EML", tier: "T1", role: "Flex", avg: 0.96, peak: 1.08, floor: 0.88, trend: -0.05, s1: 1.01, s2: 0.96, majorAvg: 0.92, events: 3, note: "0.96 yr | +1 entry | 0.94/0.98 ATK/DEF | Balanced but avg", star: false, twitter: "QuartzR6" },

  // ============================================
  // EML - FNATIC (T1) - formerly Heroic
  // ============================================
  { name: "Sarks", team: "Fnatic", region: "EML", tier: "T1", role: "Flex", avg: 1.17, peak: 1.21, floor: 1.13, trend: 0.08, s1: 1.13, s2: 1.21, majorAvg: null, events: 2, note: "1.17 yr | +13 entry | 1.20/1.14 ATK/DEF | T1 READY - elite consistent", star: true, twitter: "SarksR6" },
  { name: "Wizaardv", team: "Fnatic", region: "EML", tier: "T1", role: "Entry", avg: 1.05, peak: 1.07, floor: 1.03, trend: 0.04, s1: 1.03, s2: 1.07, majorAvg: null, events: 2, note: "1.05 yr | +21 entry | 1.12/0.98 ATK/DEF | ELITE ENTRY creator", star: true, twitter: "WizaardvR6" },
  { name: "Deapek", team: "Fnatic", region: "EML", tier: "T1", role: "Flex", avg: 1.02, peak: 1.08, floor: 0.96, trend: 0.05, s1: 0.98, s2: 1.03, majorAvg: null, events: 2, note: "1.02 yr | +5 entry | 1.01/1.03 ATK/DEF | Balanced flex", star: false, twitter: "DeapekR6" },
  { name: "Jeggz", team: "Fnatic", region: "EML", tier: "T1", role: "Sup/Anchor", avg: 1.03, peak: 1.10, floor: 0.96, trend: -0.14, s1: 1.10, s2: 0.96, majorAvg: null, events: 2, note: "1.03 yr | +2 entry | 0.95/1.11 ATK/DEF | DEF ANCHOR (1.11)", star: false, twitter: "JeggzR6" },
  { name: "croqson", team: "Fnatic", region: "EML", tier: "T1", role: "Sup/Anchor", avg: 1.16, peak: 0.98, floor: 0.86, trend: 0.04, s1: 0.88, s2: 0.92, majorAvg: null, events: 2, note: "1.16 yr | +7 entry | 1.08/1.24 ATK/DEF | ELITE support - fragger stats", star: true, twitter: "croqsonR6" },

  // ============================================
  // EML - TEAM BDS (T1) - formerly Shifters
  // ============================================
  { name: "P4", team: "Team BDS", region: "EML", tier: "T1", role: "IGL", avg: 0.88, peak: 0.95, floor: 0.80, trend: 0.02, s1: 0.87, s2: 0.89, majorAvg: 0.85, events: 3, note: "0.88 yr | -5 entry | 0.80/0.96 ATK/DEF | IGL - DEF anchor", star: false, twitter: "P4R6S" },
  { name: "Freq", team: "Team BDS", region: "EML", tier: "T1", role: "Flex", avg: 1.06, peak: 1.21, floor: 0.91, trend: -0.16, s1: 1.21, s2: 1.05, majorAvg: 0.91, events: 3, note: "1.06 yr | +9 entry | 1.10/1.02 ATK/DEF | S1 elite - high ceiling", star: true, twitter: "FreqR6" },
  { name: "Lasmooo", team: "Team BDS", region: "EML", tier: "T1", role: "Entry", avg: 0.95, peak: 1.02, floor: 0.89, trend: -0.09, s1: 1.02, s2: 0.93, majorAvg: 0.89, events: 3, note: "0.95 yr | +15 entry | 1.02/0.88 ATK/DEF | Good entry creation - ATK only", star: false, twitter: "LasmoooR6" },
  { name: "Robby", team: "Team BDS", region: "EML", tier: "T1", role: "Sup/Anchor", avg: 0.98, peak: 1.07, floor: 0.89, trend: 0.17, s1: 0.89, s2: 1.06, majorAvg: 1.07, events: 3, note: "0.98 yr | +2 entry | 0.90/1.06 ATK/DEF | Support improving, DEF anchor", star: false, twitter: "RobbyR6S" },
  { name: "Virtue", team: "Team BDS", region: "EML", tier: "T1", role: "Flex", avg: 0.91, peak: 1.00, floor: 0.86, trend: 0.12, s1: 0.88, s2: 1.00, majorAvg: 0.86, events: 3, note: "0.91 yr | +3 entry | 0.89/0.93 ATK/DEF | Improving steadily", star: false, twitter: "VirtueR6" },

  // ============================================
  // EML - WOLVES
  // ============================================
  { name: "nudl", team: "Wolves", region: "EML", tier: "T1", role: "Flex", avg: 0.98, peak: 1.08, floor: 0.88, trend: 0.05, s1: 0.93, s2: 0.98, majorAvg: null, events: 2, note: "0.98 yr | +2 entry | 0.96/1.00 ATK/DEF | Balanced Lower table flex", star: false, twitter: "nudlR6" },
  { name: "azzr", team: "Wolves", region: "EML", tier: "T1", role: "Flex", avg: 0.91, peak: 1.12, floor: 0.98, trend: 0.06, s1: 1.02, s2: 1.08, majorAvg: null, events: 2, note: "0.91 yr | +4 entry | 0.93/0.89 ATK/DEF | Lower table flex - ATK lean", star: false, twitter: "azzrR6" },
  { name: "Tyrant", team: "Wolves", region: "EML", tier: "T1", role: "Entry", avg: 0.91, peak: 1.12, floor: 0.92, trend: 0.08, s1: 0.94, s2: 1.02, majorAvg: null, events: 2, note: "0.91 yr | +7 entry | 0.96/0.86 ATK/DEF | Entry - creates openings", star: true, twitter: "TyrantR6S" },
  { name: "leadr", team: "Wolves", region: "EML", tier: "T1", role: "IGL", avg: 0.88, peak: 0.95, floor: 0.82, trend: 0.03, s1: 0.86, s2: 0.89, majorAvg: null, events: 2, note: "0.88 yr | -4 entry | 0.81/0.95 ATK/DEF | IGL - DEF focus", star: false, twitter: "leadrR6" },
  { name: "Creedz", team: "Wolves", region: "EML", tier: "T1", role: "Sup/Anchor", avg: 0.90, peak: 0.97, floor: 0.83, trend: 0.02, s1: 0.89, s2: 0.91, majorAvg: null, events: 2, note: "0.90 yr | -2 entry | 0.84/0.96 ATK/DEF | Support - DEF anchor", star: false, twitter: "CreedzR6" },

  // ============================================
  // EML - MACKO ESPORTS
  // ============================================
  { name: "Lollo", team: "MACKO Esports", region: "EML", tier: "T1", role: "IGL", avg: 0.85, peak: 0.92, floor: 0.78, trend: 0.00, s1: 0.85, s2: 0.85, majorAvg: null, events: 2, note: "0.85 yr | -6 entry | 0.77/0.93 ATK/DEF | IGL veteran - DEF anchor", star: false, twitter: "LolloR6" },
  { name: "T3b", team: "MACKO Esports", region: "EML", tier: "T1", role: "Flex", avg: 0.92, peak: 1.15, floor: 1.01, trend: 0.06, s1: 1.05, s2: 1.11, majorAvg: null, events: 2, note: "0.92 yr | +5 entry | 0.95/0.89 ATK/DEF | Team star flex - ATK lean", star: true, twitter: "T3bR6" },
  { name: "Dora", team: "MACKO Esports", region: "EML", tier: "T1", role: "Entry", avg: 0.97, peak: 1.05, floor: 0.89, trend: 0.04, s1: 0.95, s2: 0.99, majorAvg: null, events: 2, note: "0.97 yr | +8 entry | 1.02/0.92 ATK/DEF | Entry - good opener", star: true, twitter: "DoraR6" },
  { name: "aqui", team: "MACKO Esports", region: "EML", tier: "T1", role: "Sup/Anchor", avg: 0.94, peak: 1.02, floor: 0.86, trend: 0.03, s1: 0.92, s2: 0.95, majorAvg: null, events: 2, note: "0.94 yr | +1 entry | 0.88/1.00 ATK/DEF | Anchor - solid DEF", star: false, twitter: "aquiR6" },
  { name: "Ghostriddik", team: "MACKO Esports", region: "EML", tier: "T1", role: "Sup/Anchor", avg: 0.89, peak: 0.96, floor: 0.82, trend: 0.02, s1: 0.88, s2: 0.90, majorAvg: null, events: 2, note: "0.89 yr | -3 entry | 0.82/0.96 ATK/DEF | Support - DEF focus", star: false, twitter: "GhostriddikR6" },

  // ============================================
  // EML - WYLDE
  // ============================================
  { name: "Evan", team: "WYLDE", region: "EML", tier: "T1", role: "IGL", avg: 0.87, peak: 0.95, floor: 0.80, trend: -0.05, s1: 0.90, s2: 0.85, majorAvg: null, events: 2, note: "0.87 yr | -5 entry | 0.79/0.95 ATK/DEF | IGL - DEF anchor", star: false, twitter: "EvanR6S" },
  { name: "garren", team: "WYLDE", region: "EML", tier: "T1", role: "Sup/Anchor", avg: 0.96, peak: 1.15, floor: 0.78, trend: -0.37, s1: 1.15, s2: 0.78, majorAvg: null, events: 2, note: "0.96 yr | +4 entry | 0.90/1.02 ATK/DEF | S1 STAR crashed S2 (-0.37)", star: false, twitter: "garrenR6" },
  { name: "Bmzy", team: "WYLDE", region: "EML", tier: "T1", role: "Flex", avg: 0.94, peak: 1.05, floor: 0.85, trend: 0.08, s1: 0.90, s2: 0.98, majorAvg: null, events: 2, note: "0.94 yr | +3 entry | 0.93/0.95 ATK/DEF | Balanced, improving", star: false, twitter: "BmzyR6" },
  { name: "Crex", team: "WYLDE", region: "EML", tier: "T1", role: "Entry", avg: 0.98, peak: 1.08, floor: 0.88, trend: 0.05, s1: 0.93, s2: 0.98, majorAvg: null, events: 2, note: "0.98 yr | +9 entry | 1.04/0.92 ATK/DEF | Team STAR entry - ATK focus", star: true, twitter: "CrexR6" },
  { name: "Mekses", team: "WYLDE", region: "EML", tier: "T1", role: "Sup/Anchor", avg: 0.86, peak: 0.92, floor: 0.80, trend: 0.02, s1: 0.85, s2: 0.87, majorAvg: null, events: 2, note: "0.86 yr | -4 entry | 0.78/0.94 ATK/DEF | Support - DEF only", star: false, twitter: "MeksesR6" },

  // ============================================
  // SAL - TEAM LIQUID
  // ============================================
  { name: "Maia", team: "Team Liquid", region: "SAL", tier: "T1", role: "Entry", avg: 1.20, peak: 1.28, floor: 1.08, trend: 0.20, s1: 1.08, s2: 1.28, majorAvg: null, events: 2, note: "1.20 yr | +25 entry | 1.28/1.12 ATK/DEF | ELITE ENTRY - SAL best opener", star: true, twitter: "MaiaR6S" },
  { name: "Dias", team: "Team Liquid", region: "SAL", tier: "T1", role: "Flex", avg: 1.17, peak: 1.25, floor: 1.12, trend: 0.13, s1: 1.12, s2: 1.25, majorAvg: null, events: 2, note: "1.17 yr | +12 entry | 1.20/1.14 ATK/DEF | ELITE flex - ATK dominant", star: true, twitter: "DiasR6S" },
  { name: "Daffo", team: "Team Liquid", region: "SAL", tier: "T1", role: "Flex", avg: 1.00, peak: 1.00, floor: 1.00, trend: 0, s1: null, s2: 1.00, majorAvg: null, events: 1, note: "1.00 yr | +3 entry | 0.98/1.02 ATK/DEF | Joined from LOUD - balanced", star: false, twitter: "DaffoR6" },
  { name: "NESKWGA", team: "Team Liquid", region: "SAL", tier: "T1", role: "Flex", avg: 0.94, peak: 0.97, floor: 0.90, trend: 0.07, s1: 0.90, s2: 0.97, majorAvg: null, events: 2, note: "0.94 yr | +1 entry | 0.91/0.97 ATK/DEF | Steady flex - DEF lean", star: false, twitter: "NESKWGAR6" },
  { name: "Lenda", team: "Team Liquid", region: "SAL", tier: "T1", role: "Sup/Anchor", avg: 0.85, peak: 0.85, floor: 0.85, trend: 0, s1: null, s2: 0.85, majorAvg: null, events: 1, note: "0.85 yr | -5 entry | 0.77/0.93 ATK/DEF | New support - DEF anchor", star: false, twitter: "LendaR6" },

  // ============================================
  // SAL - FAZE CLAN
  // ============================================
  { name: "VITAKING", team: "FaZe Clan", region: "SAL", tier: "T1", role: "IGL", avg: 0.95, peak: 1.00, floor: 0.91, trend: -0.09, s1: 1.00, s2: 0.91, majorAvg: 0.95, events: 4, note: "0.95 yr | -2 entry | 0.87/1.03 ATK/DEF | IGL captain - DEF anchor", star: false, twitter: "VITAKINGR6" },
  { name: "Cyber", team: "FaZe Clan", region: "SAL", tier: "T1", role: "Entry", avg: 1.09, peak: 1.37, floor: 0.97, trend: -0.19, s1: 1.24, s2: 1.05, majorAvg: 1.17, events: 4, note: "1.09 yr | +21 entry | 1.18/1.00 ATK/DEF | BIG STAGE player - ATK god", star: true, twitter: "CyberR6S" },
  { name: "handyy", team: "FaZe Clan", region: "SAL", tier: "T1", role: "Entry", avg: 1.04, peak: 1.09, floor: 1.03, trend: -0.01, s1: 1.09, s2: 1.08, majorAvg: 1.03, events: 3, note: "1.04 yr | +14 entry | 1.10/0.98 ATK/DEF | Consistent entry - ATK focus", star: true, twitter: "handyyR6" },
  { name: "Kds", team: "FaZe Clan", region: "SAL", tier: "T1", role: "Flex", avg: 1.04, peak: 1.17, floor: 0.96, trend: -0.13, s1: 1.17, s2: 1.04, majorAvg: 1.03, events: 4, note: "1.04 yr | +6 entry | 1.06/1.02 ATK/DEF | Solid balanced flex", star: true, twitter: "KdsR6S" },
  { name: "soulz1", team: "FaZe Clan", region: "SAL", tier: "T1", role: "Flex", avg: 1.02, peak: 1.20, floor: 0.77, trend: -0.13, s1: 1.20, s2: 1.07, majorAvg: 0.90, events: 4, note: "1.02 yr | +4 entry | 1.03/1.01 ATK/DEF | Big stage struggles (0.90)", star: false, twitter: "soulz1R6" },

  // ============================================
  // SAL - FURIA
  // ============================================
  { name: "FelipoX", team: "FURIA", region: "SAL", tier: "T1", role: "IGL", avg: 1.03, peak: 1.19, floor: 0.85, trend: 0.23, s1: 0.85, s2: 1.08, majorAvg: 1.13, events: 4, note: "1.03 yr | +5 entry | 0.96/1.10 ATK/DEF | IGL clutch god - Munich 1.19", star: true, twitter: "FelipoXR6" },
  { name: "Jv92", team: "FURIA", region: "SAL", tier: "T1", role: "Entry", avg: 1.18, peak: 1.32, floor: 0.95, trend: 0.17, s1: 1.15, s2: 1.32, majorAvg: 0.99, events: 4, note: "1.18 yr | +27 entry | 1.26/1.10 ATK/DEF | ELITE ENTRY - SAL star", star: true, twitter: "Jv92R6" },
  { name: "Kheyze", team: "FURIA", region: "SAL", tier: "T1", role: "Entry", avg: 1.07, peak: 1.20, floor: 0.84, trend: 0.06, s1: 1.14, s2: 1.20, majorAvg: 0.85, events: 4, note: "1.07 yr | +18 entry | 1.14/1.00 ATK/DEF | Aggressive entry - ATK focus", star: true, twitter: "KheyzeR6" },
  { name: "HerdsZ", team: "FURIA", region: "SAL", tier: "T1", role: "Flex", avg: 1.05, peak: 1.19, floor: 0.86, trend: 0.17, s1: 1.02, s2: 1.19, majorAvg: 0.96, events: 4, note: "1.05 yr | +8 entry | 1.08/1.02 ATK/DEF | S2 BREAKOUT star", star: true, twitter: "HerdsZR6" },
  { name: "nade", team: "FURIA", region: "SAL", tier: "T1", role: "Sup/Anchor", avg: 1.07, peak: 1.15, floor: 0.98, trend: -0.09, s1: 1.07, s2: 0.98, majorAvg: 1.13, events: 4, note: "1.07 yr | +3 entry | 0.99/1.15 ATK/DEF | ELITE support - DEF anchor", star: true, twitter: "nadeR6S" },

  // ============================================
  // SAL - NIP (Ninjas in Pyjamas)
  // ============================================
  { name: "pino", team: "NiP", region: "SAL", tier: "T1", role: "IGL", avg: 1.02, peak: 1.11, floor: 0.98, trend: -0.06, s1: 1.04, s2: 0.98, majorAvg: 1.05, events: 4, note: "1.02 yr | +2 entry | 0.95/1.09 ATK/DEF | IGL high KOST - DEF focus", star: false, twitter: "pinoR6S" },
  { name: "Fntzy", team: "NiP", region: "SAL", tier: "T1", role: "Entry", avg: 1.04, peak: 1.11, floor: 0.99, trend: -0.01, s1: 1.06, s2: 1.05, majorAvg: 1.05, events: 4, note: "1.04 yr | +12 entry | 1.10/0.98 ATK/DEF | Consistent entry - ATK focus", star: true, twitter: "FntzyR6" },
  { name: "Hatez", team: "NiP", region: "SAL", tier: "T1", role: "Flex", avg: 1.03, peak: 1.15, floor: 0.94, trend: 0.11, s1: 1.04, s2: 1.15, majorAvg: 1.04, events: 4, note: "1.03 yr | +7 entry | 1.05/1.01 ATK/DEF | Balanced flex - improving", star: true, twitter: "HatezR6" },
  { name: "Wizard", team: "NiP", region: "SAL", tier: "T1", role: "Flex", avg: 1.04, peak: 1.10, floor: 1.00, trend: 0.06, s1: 1.04, s2: 1.10, majorAvg: 1.05, events: 4, note: "1.04 yr | +4 entry | 1.02/1.06 ATK/DEF | Clutch god - balanced", star: true, twitter: "WizardR6S" },
  { name: "Kondz", team: "NiP", region: "SAL", tier: "T1", role: "Sup/Anchor", avg: 0.94, peak: 1.05, floor: 0.84, trend: 0.18, s1: 0.84, s2: 1.02, majorAvg: 0.95, events: 4, note: "0.94 yr | -3 entry | 0.85/1.03 ATK/DEF | Plant king 22 S2 - DEF anchor", star: false, twitter: "KondzR6" },

  // ============================================
  // SAL - W7M ESPORTS
  // ============================================
  { name: "Paluh", team: "w7m esports", region: "SAL", tier: "T1", role: "Flex", avg: 1.21, peak: 1.33, floor: 1.14, trend: -0.04, s1: 1.27, s2: 1.23, majorAvg: 1.14, events: 4, note: "1.21 yr | +19 entry | 1.27/1.15 ATK/DEF | BRAZILIAN GOAT - ATK playmaker", star: true, twitter: "PaluhR6" },
  { name: "Dodez", team: "w7m esports", region: "SAL", tier: "T1", role: "Entry", avg: 1.15, peak: 1.26, floor: 1.14, trend: -0.04, s1: 1.24, s2: 1.20, majorAvg: 1.14, events: 4, note: "1.15 yr | +24 entry | 1.22/1.08 ATK/DEF | ELITE ENTRY - ATK god", star: true, twitter: "DodezR6" },
  { name: "volpz", team: "w7m esports", region: "SAL", tier: "T1", role: "Flex", avg: 1.01, peak: 1.10, floor: 0.74, trend: -0.04, s1: 1.10, s2: 1.06, majorAvg: 0.74, events: 4, note: "1.01 yr | +5 entry | 1.04/0.98 ATK/DEF | Major struggles (0.74)", star: false, twitter: "volpzR6" },
  { name: "lobin", team: "w7m esports", region: "SAL", tier: "T1", role: "Sup/Anchor", avg: 0.96, peak: 0.96, floor: 0.91, trend: 0.01, s1: 0.95, s2: 0.96, majorAvg: 0.91, events: 4, note: "0.96 yr | -1 entry | 0.88/1.04 ATK/DEF | Steady support - DEF anchor", star: false, twitter: "lobinR6S" },
  { name: "Dotz", team: "w7m esports", region: "SAL", tier: "T1", role: "IGL", avg: 0.92, peak: 0.93, floor: 0.73, trend: -0.03, s1: 0.93, s2: 0.90, majorAvg: 0.73, events: 4, note: "0.92 yr | -4 entry | 0.84/1.00 ATK/DEF | IGL plant king - DEF focus", star: false, twitter: "DotzR6S" },

  // ============================================
  // SAL - LOUD (T1)
  // ============================================
  { name: "peres", team: "LOUD", region: "SAL", tier: "T1", role: "Entry", avg: 1.21, peak: 1.21, floor: 1.21, trend: 0, s1: 1.21, s2: null, majorAvg: null, events: 1, note: "1.21 yr | +18 entry | 1.28/1.14 ATK/DEF | ELITE ENTRY - S1 standout", star: true, twitter: "peresR6" },
  { name: "Stk", team: "LOUD", region: "SAL", tier: "T1", role: "Entry", avg: 1.15, peak: 1.15, floor: 1.15, trend: 0, s1: 1.15, s2: null, majorAvg: null, events: 1, note: "1.15 yr | +14 entry | 1.20/1.10 ATK/DEF | Strong S1 entry", star: true, twitter: "StkR6S" },
  { name: "Flastry", team: "LOUD", region: "SAL", tier: "T1", role: "Flex", avg: 1.07, peak: 1.14, floor: 0.99, trend: 0.15, s1: 0.99, s2: 1.14, majorAvg: null, events: 2, note: "1.07 yr | +9 entry | 1.10/1.04 ATK/DEF | S2 breakout star +0.15", star: true, twitter: "FlastryR6" },
  { name: "live", team: "LOUD", region: "SAL", tier: "T1", role: "Flex", avg: 0.96, peak: 0.96, floor: 0.96, trend: 0, s1: 0.96, s2: null, majorAvg: null, events: 1, note: "0.96 yr | +2 entry | 0.94/0.98 ATK/DEF | Flex - balanced", star: false, twitter: "liveR6S" },
  { name: "Bassetto", team: "LOUD", region: "SAL", tier: "T1", role: "IGL", avg: 0.63, peak: 0.63, floor: 0.63, trend: 0, s1: 0.63, s2: null, majorAvg: null, events: 1, note: "0.63 yr | -12 entry | 0.52/0.74 ATK/DEF | IGL pure caller - low frag", star: false, twitter: "BassettoR6" },

  // ============================================
  // SAL - 9Z TEAM
  // ============================================
  { name: "Jow", team: "9z Team", region: "SAL", tier: "T1", role: "Flex", avg: 0.90, peak: 0.90, floor: 0.90, trend: 0, s1: 0.90, s2: null, majorAvg: null, events: 1, note: "0.90 yr | +2 entry | 0.88/0.92 ATK/DEF | Lower table flex - balanced", star: false, twitter: "JowR6" },
  { name: "Tucu2k", team: "9z Team", region: "SAL", tier: "T1", role: "Entry", avg: 0.88, peak: 0.88, floor: 0.88, trend: 0, s1: 0.88, s2: null, majorAvg: null, events: 1, note: "0.88 yr | +5 entry | 0.93/0.83 ATK/DEF | Entry - ATK focus", star: true, twitter: "Tucu2kR6" },
  { name: "Nitro", team: "9z Team", region: "SAL", tier: "T1", role: "Flex", avg: 0.87, peak: 0.87, floor: 0.87, trend: 0, s1: 0.87, s2: null, majorAvg: null, events: 1, note: "0.87 yr | +1 entry | 0.86/0.88 ATK/DEF | Lower table flex", star: false, twitter: "NitroR6S" },
  { name: "WiLL", team: "9z Team", region: "SAL", tier: "T1", role: "Sup/Anchor", avg: 0.76, peak: 0.76, floor: 0.76, trend: 0, s1: 0.76, s2: null, majorAvg: null, events: 1, note: "0.76 yr | -5 entry | 0.68/0.84 ATK/DEF | Support - DEF anchor", star: false, twitter: "WiLLR6" },
  { name: "Naza", team: "9z Team", region: "SAL", tier: "T1", role: "IGL", avg: 0.69, peak: 0.69, floor: 0.69, trend: 0, s1: 0.69, s2: null, majorAvg: null, events: 1, note: "0.69 yr | -8 entry | 0.60/0.78 ATK/DEF | IGL - pure caller", star: false, twitter: "NazaR6" },

  // ============================================
  // SAL - ENX TEAM
  // ============================================
  { name: "Bokzera", team: "ENX Team", region: "SAL", tier: "T1", role: "Entry", avg: 1.04, peak: 1.19, floor: 1.19, trend: 0, s1: 1.19, s2: null, majorAvg: null, events: 1, note: "1.04 yr | +16 entry | 1.12/0.96 ATK/DEF | Team STAR entry - ATK focus", star: true, twitter: "BokzeraR6" },
  { name: "Florio", team: "ENX Team", region: "SAL", tier: "T1", role: "Flex", avg: 1.03, peak: 1.04, floor: 1.04, trend: 0, s1: 1.04, s2: null, majorAvg: null, events: 1, note: "1.03 yr | +6 entry | 1.05/1.01 ATK/DEF | Team star flex - balanced", star: true, twitter: "FlorioR6" },
  { name: "SexyCake", team: "ENX Team", region: "SAL", tier: "T1", role: "Entry", avg: 0.90, peak: 0.90, floor: 0.90, trend: 0, s1: 0.90, s2: null, majorAvg: null, events: 1, note: "0.90 yr | +4 entry | 0.95/0.85 ATK/DEF | Entry - ATK lean", star: false, twitter: "SexyCakeR6" },
  { name: "AngelzZ", team: "ENX Team", region: "SAL", tier: "T1", role: "Sup/Anchor", avg: 0.73, peak: 0.73, floor: 0.73, trend: 0, s1: 0.73, s2: null, majorAvg: null, events: 1, note: "0.73 yr | -4 entry | 0.66/0.80 ATK/DEF | Support - DEF focus", star: false, twitter: "AngelzZR6" },
  { name: "Nyjl", team: "ENX Team", region: "SAL", tier: "T1", role: "Sup/Anchor", avg: 0.72, peak: 0.72, floor: 0.72, trend: 0, s1: 0.72, s2: null, majorAvg: null, events: 1, note: "0.72 yr | -6 entry | 0.63/0.81 ATK/DEF | Support - DEF anchor", star: false, twitter: "NyjlR6" },

  // ============================================
  // SAL - BLACK DRAGONS
  // ============================================
  { name: "R4re", team: "Black Dragons", region: "SAL", tier: "T1", role: "Flex", avg: 1.04, peak: 1.11, floor: 0.96, trend: 0.15, s1: 0.96, s2: 1.11, majorAvg: null, events: 2, note: "1.04 yr | +8 entry | 1.08/1.00 ATK/DEF | Team STAR captain - improving", star: true, twitter: "R4reR6" },
  { name: "AsK", team: "Black Dragons", region: "SAL", tier: "T1", role: "Flex", avg: 0.84, peak: 0.84, floor: 0.84, trend: 0, s1: 0.84, s2: null, majorAvg: null, events: 1, note: "0.84 yr | +1 entry | 0.83/0.85 ATK/DEF | Lower table flex - balanced", star: false, twitter: "AsKR6" },
  { name: "Hornet", team: "Black Dragons", region: "SAL", tier: "T1", role: "Entry", avg: 0.92, peak: 0.92, floor: 0.92, trend: 0, s1: 0.92, s2: null, majorAvg: null, events: 1, note: "0.92 yr | +7 entry | 0.98/0.86 ATK/DEF | Entry - ATK focus", star: true, twitter: "HornetR6S" },
  { name: "Miracle", team: "Black Dragons", region: "SAL", tier: "T1", role: "Sup/Anchor", avg: 0.85, peak: 0.85, floor: 0.85, trend: 0, s1: null, s2: 0.85, majorAvg: null, events: 1, note: "0.85 yr | -3 entry | 0.78/0.92 ATK/DEF | Support - DEF focus", star: false, twitter: "MiracleR6" },
  { name: "Maquina", team: "Black Dragons", region: "SAL", tier: "T1", role: "IGL", avg: 0.79, peak: 0.79, floor: 0.79, trend: 0, s1: 0.79, s2: null, majorAvg: null, events: 1, note: "0.79 yr | -5 entry | 0.70/0.88 ATK/DEF | IGL - DEF anchor", star: false, twitter: "MaquinaR6" },

  // ============================================
  // SAL - LOS (T1)
  // ============================================
  { name: "Ar7hr", team: "LOS", region: "SAL", tier: "T1", role: "IGL", avg: 0.90, peak: 0.98, floor: 0.82, trend: 0.05, s1: 0.88, s2: 0.93, majorAvg: null, events: 2, note: "0.90 yr | -2 entry | 0.83/0.97 ATK/DEF | IGL - DEF anchor", star: false, twitter: "Ar7hrR6" },
  { name: "Legacy", team: "LOS", region: "SAL", tier: "T1", role: "Entry", avg: 0.98, peak: 1.08, floor: 0.88, trend: 0.08, s1: 0.90, s2: 0.98, majorAvg: null, events: 2, note: "0.98 yr | +10 entry | 1.05/0.91 ATK/DEF | Entry - ATK focus", star: true, twitter: "LegacyR6S" },
  { name: "Kurtz", team: "LOS", region: "SAL", tier: "T1", role: "Flex", avg: 0.95, peak: 1.05, floor: 0.85, trend: 0.05, s1: 0.90, s2: 0.95, majorAvg: null, events: 2, note: "0.95 yr | +4 entry | 0.97/0.93 ATK/DEF | Flex - balanced", star: false, twitter: "KurtzR6" },

  // ============================================
  // NA LCQ T2 TEAMS
  // ============================================
  // Karn & Co
  { name: "Raidbullys", team: "Karn & Co", region: "NAL", tier: "T2", role: "Entry", avg: 1.19, peak: 1.19, floor: 1.19, trend: 0, s1: null, s2: null, majorAvg: null, events: 1, note: "LCQ 1.19 | +9 entry | 1.42/0.94 ATK/DEF | Elite ATK entry", star: true, twitter: null },

  // ============================================
  // EU LCQ T2 TEAMS
  // ============================================
  // Project Zero
  { name: "oscr", team: "Project Zero", region: "EML", tier: "T2", role: "Entry", avg: 1.34, peak: 1.34, floor: 1.34, trend: 0, s1: null, s2: null, majorAvg: null, events: 1, note: "LCQ 1.34 | +14 entry | LCQ MVP - ELITE prospect", star: true, twitter: null },
  { name: "Gruby", team: "Project Zero", region: "EML", tier: "T2", role: "Flex", avg: 1.23, peak: 1.23, floor: 1.23, trend: 0, s1: null, s2: null, majorAvg: null, events: 1, note: "LCQ 1.23 | +1 entry | T2 star flex", star: true, twitter: null },
  { name: "Eupor", team: "Project Zero", region: "EML", tier: "T2", role: "Flex", avg: 1.05, peak: 1.05, floor: 1.05, trend: 0, s1: null, s2: null, majorAvg: null, events: 1, note: "LCQ 1.05 | +1 entry | Solid flex", star: false, twitter: null },
  { name: "Flexy", team: "Project Zero", region: "EML", tier: "T2", role: "Sup/Anchor", avg: 0.96, peak: 0.96, floor: 0.96, trend: 0, s1: null, s2: null, majorAvg: null, events: 1, note: "LCQ 0.96 | -3 entry | Support player", star: false, twitter: null },
  { name: "Skeptic", team: "Project Zero", region: "EML", tier: "T2", role: "IGL", avg: 0.83, peak: 0.83, floor: 0.83, trend: 0, s1: null, s2: null, majorAvg: null, events: 1, note: "LCQ 0.83 | +3 entry | IGL - low frag caller", star: false, twitter: null },

  // Shifters
  { name: "Robby", team: "Shifters", region: "EML", tier: "T2", role: "Entry", avg: 1.32, peak: 1.32, floor: 1.32, trend: 0, s1: null, s2: null, majorAvg: null, events: 1, note: "LCQ 1.32 | +11 entry | ELITE entry - T1 ready", star: true, twitter: null },
  { name: "Virtue", team: "Shifters", region: "EML", tier: "T2", role: "Flex", avg: 0.99, peak: 0.99, floor: 0.99, trend: 0, s1: null, s2: null, majorAvg: null, events: 1, note: "LCQ 0.99 | -6 entry | Flex player", star: false, twitter: null },
  { name: "Lasmooo", team: "Shifters", region: "EML", tier: "T2", role: "Sup/Anchor", avg: 0.95, peak: 0.95, floor: 0.95, trend: 0, s1: null, s2: null, majorAvg: null, events: 1, note: "LCQ 0.95 | 0 entry | Support", star: false, twitter: null },
  { name: "P4", team: "Shifters", region: "EML", tier: "T2", role: "Flex", avg: 0.87, peak: 0.87, floor: 0.87, trend: 0, s1: null, s2: null, majorAvg: null, events: 1, note: "LCQ 0.87 | -3 entry | Flex", star: false, twitter: null },
  { name: "Freq", team: "Shifters", region: "EML", tier: "T2", role: "IGL", avg: 0.84, peak: 0.84, floor: 0.84, trend: 0, s1: null, s2: null, majorAvg: null, events: 1, note: "LCQ 0.84 | -2 entry | IGL", star: false, twitter: null },

  // Twisted Minds (MENA)
  { name: "jlaD", team: "Twisted Minds", region: "EML", tier: "T2", role: "Entry", avg: 1.17, peak: 1.17, floor: 1.17, trend: 0, s1: null, s2: null, majorAvg: null, events: 1, note: "LCQ 1.17 | +3 entry | MENA star entry", star: true, twitter: null },
  { name: "P9", team: "Twisted Minds", region: "EML", tier: "T2", role: "Flex", avg: 1.14, peak: 1.14, floor: 1.14, trend: 0, s1: null, s2: null, majorAvg: null, events: 1, note: "LCQ 1.14 | +5 entry | MENA star flex", star: true, twitter: null },
  { name: "hashom", team: "Twisted Minds", region: "EML", tier: "T2", role: "Flex", avg: 1.04, peak: 1.04, floor: 1.04, trend: 0, s1: null, s2: null, majorAvg: null, events: 1, note: "LCQ 1.04 | +2 entry | Solid flex", star: false, twitter: null },
  { name: "Tr1ixd", team: "Twisted Minds", region: "EML", tier: "T2", role: "Entry", avg: 0.99, peak: 0.99, floor: 0.99, trend: 0, s1: null, s2: null, majorAvg: null, events: 1, note: "LCQ 0.99 | -2 entry | Secondary entry", star: false, twitter: null },
  { name: "Guardz", team: "Twisted Minds", region: "EML", tier: "T2", role: "IGL", avg: 0.83, peak: 0.83, floor: 0.83, trend: 0, s1: null, s2: null, majorAvg: null, events: 1, note: "LCQ 0.83 | -2 entry | IGL caller", star: false, twitter: null },

  // Pannuhuone (Finnish)
  { name: "Hauva", team: "Pannuhuone", region: "EML", tier: "T2", role: "Entry", avg: 1.17, peak: 1.17, floor: 1.17, trend: 0, s1: null, s2: null, majorAvg: null, events: 1, note: "LCQ 1.17 | +2 entry | Finnish talent", star: true, twitter: null },
  { name: "NikkeS", team: "Pannuhuone", region: "EML", tier: "T2", role: "Sup/Anchor", avg: 1.10, peak: 1.10, floor: 1.10, trend: 0, s1: null, s2: null, majorAvg: null, events: 1, note: "LCQ 1.10 | +1 entry | Finnish support star", star: false, twitter: null },
  { name: "Raastin", team: "Pannuhuone", region: "EML", tier: "T2", role: "Flex", avg: 0.96, peak: 0.96, floor: 0.96, trend: 0, s1: null, s2: null, majorAvg: null, events: 1, note: "LCQ 0.96 | +2 entry | Finnish flex", star: false, twitter: null },

  // Geekay Esports (MENA)
  { name: "RORICK", team: "Geekay Esports", region: "EML", tier: "T2", role: "Entry", avg: 1.10, peak: 1.10, floor: 1.10, trend: 0, s1: null, s2: null, majorAvg: null, events: 1, note: "LCQ 1.10 | +9 entry | MENA entry talent", star: true, twitter: null },
  { name: "Rexhun", team: "Geekay Esports", region: "EML", tier: "T2", role: "Flex", avg: 0.94, peak: 0.94, floor: 0.94, trend: 0, s1: null, s2: null, majorAvg: null, events: 1, note: "LCQ 0.94 | -2 entry | MENA flex", star: false, twitter: null },
];

const categories = {
  WANT: { color: 'bg-green-500', label: 'WANT', textColor: 'text-white', key: '1' },
  MAYBE: { color: 'bg-yellow-400', label: 'MAYBE', textColor: 'text-black', key: '2' },
  WATCH: { color: 'bg-blue-500', label: 'WATCH', textColor: 'text-white', key: '3' },
  NO: { color: 'bg-red-500', label: 'NO', textColor: 'text-white', key: '4' },
  UNAVAILABLE: { color: 'bg-gray-600', label: 'UNAVAILABLE', textColor: 'text-white', key: '5' },
};

const ROLE_REQUIREMENTS = ['Entry', 'Flex', 'Sup/Anchor', 'IGL'];

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
  const [rosterStatMode, setRosterStatMode] = useState('avg');
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
  const [showUnavailable, setShowUnavailable] = useState(false);
  const [showStars, setShowStars] = useState(true);
  const [currentProfile, setCurrentProfile] = useState(() => localStorage.getItem('scoutingProfile') || 'redeem');
  const [profiles, setProfiles] = useState(() => JSON.parse(localStorage.getItem('scoutingProfiles') || '["redeem"]'));
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [editingProfile, setEditingProfile] = useState(null);
  const [editProfileName, setEditProfileName] = useState('');

  // Save profile to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('scoutingProfile', currentProfile);
  }, [currentProfile]);

  useEffect(() => {
    localStorage.setItem('scoutingProfiles', JSON.stringify(profiles));
  }, [profiles]);

  // Load initial data from Supabase and subscribe to real-time changes
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load categories for current profile
        const { data: catData } = await supabase
          .from('scouting_categories')
          .select('player_name, category')
          .eq('profile', currentProfile);
        if (catData) {
          const cats = {};
          catData.forEach(row => { cats[row.player_name] = row.category; });
          setPlayerCategories(cats);
        } else {
          setPlayerCategories({});
        }

        // Load notes for current profile
        const { data: notesData } = await supabase
          .from('scouting_notes')
          .select('player_name, note')
          .eq('profile', currentProfile);
        if (notesData) {
          const notes = {};
          notesData.forEach(row => { notes[row.player_name] = row.note; });
          setCustomNotes(notes);
        } else {
          setCustomNotes({});
        }

        // Load roster for current profile
        const { data: rosterData } = await supabase
          .from('scouting_rosters')
          .select('player_name, position')
          .eq('profile', currentProfile)
          .order('position');
        if (rosterData) {
          const rosterPlayers = rosterData.map(row =>
            playersData.find(p => p.name === row.player_name)
          ).filter(Boolean);
          setRoster(rosterPlayers);
        } else {
          setRoster([]);
        }

        setSyncStatus('connected');
      } catch (err) {
        console.error('Failed to load from Supabase:', err);
        setSyncStatus('error');
      }
    };

    loadData();

    // Real-time subscriptions - filter by current profile
    const categoriesChannel = supabase
      .channel(`categories-changes-${currentProfile}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scouting_categories', filter: `profile=eq.${currentProfile}` }, (payload) => {
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
      .channel(`notes-changes-${currentProfile}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scouting_notes', filter: `profile=eq.${currentProfile}` }, (payload) => {
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
      .channel(`roster-changes-${currentProfile}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scouting_rosters', filter: `profile=eq.${currentProfile}` }, async () => {
        // Reload full roster on any change
        const { data: rosterData } = await supabase
          .from('scouting_rosters')
          .select('player_name, position')
          .eq('profile', currentProfile)
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
  }, [currentProfile]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (selectedPlayer) {
        if (e.key === '1') setCategory(selectedPlayer.name, 'WANT');
        if (e.key === '2') setCategory(selectedPlayer.name, 'MAYBE');
        if (e.key === '3') setCategory(selectedPlayer.name, 'WATCH');
        if (e.key === '4') setCategory(selectedPlayer.name, 'NO');
        if (e.key === '5') setCategory(selectedPlayer.name, 'UNAVAILABLE');
        if (e.key === 'Escape') setSelectedPlayer(null);
        if (e.key === 'r' || e.key === 'R') toggleRoster(selectedPlayer);
      }

      // Bulk actions with shift+number
      if (e.shiftKey && selectedPlayers.size > 0) {
        if (e.key === '!') bulkSetCategory('WANT');
        if (e.key === '@') bulkSetCategory('MAYBE');
        if (e.key === '#') bulkSetCategory('WATCH');
        if (e.key === '$') bulkSetCategory('NO');
        if (e.key === '%') bulkSetCategory('UNAVAILABLE');
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
      await supabase.from('scouting_categories').delete().eq('player_name', playerName).eq('profile', currentProfile);
    } else {
      // Set category
      setPlayerCategories(prev => ({ ...prev, [playerName]: category }));
      await supabase.from('scouting_categories').upsert({ player_name: playerName, category, profile: currentProfile }, { onConflict: 'player_name,profile' });
    }
  };

  const bulkSetCategory = async (category) => {
    const updates = [];
    selectedPlayers.forEach(name => {
      updates.push({ player_name: name, category, profile: currentProfile });
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
      await supabase.from('scouting_categories').upsert(updates, { onConflict: 'player_name,profile' });
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
      await supabase.from('scouting_rosters').delete().eq('player_name', player.name).eq('profile', currentProfile);
    } else if (roster.length < 5) {
      // Add to roster
      const newRoster = [...roster, player];
      setRoster(newRoster);
      await supabase.from('scouting_rosters').insert({ player_name: player.name, position: newRoster.length - 1, profile: currentProfile });
    }
  };

  const updateCustomNote = async (playerName, note) => {
    setCustomNotes(prev => ({ ...prev, [playerName]: note }));
    if (note.trim()) {
      await supabase.from('scouting_notes').upsert({ player_name: playerName, note, profile: currentProfile }, { onConflict: 'player_name,profile' });
    } else {
      await supabase.from('scouting_notes').delete().eq('player_name', playerName).eq('profile', currentProfile);
    }
  };

  const filteredPlayers = useMemo(() => {
    let result = [...playersData];

    // Handle unavailable toggle
    if (showUnavailable) {
      result = result.filter(p => playerCategories[p.name] === 'UNAVAILABLE');
    } else if (filter.category !== 'UNAVAILABLE') {
      result = result.filter(p => playerCategories[p.name] !== 'UNAVAILABLE');
    }

    // Region filter
    if (filter.region !== 'ALL') {
      result = result.filter(p => p.region === filter.region);
    }

    // Role filter
    if (filter.role !== 'ALL') {
      result = result.filter(p => p.role === filter.role || p.role.includes(filter.role));
    }

    // Tier filter
    if (filter.tier !== 'ALL') {
      result = result.filter(p => p.tier === filter.tier);
    }

    // Team filter
    if (filter.team !== 'ALL') {
      result = result.filter(p => p.team === filter.team);
    }

    // Star filter
    if (filter.starOnly) {
      result = result.filter(p => p.star === true);
    }

    // Category filter
    if (filter.category !== 'ALL') {
      if (filter.category === 'UNCATEGORIZED') {
        result = result.filter(p => !playerCategories[p.name]);
      } else {
        result = result.filter(p => playerCategories[p.name] === filter.category);
      }
    }

    // Stat range filters
    if (statFilters.minAvg) {
      result = result.filter(p => p.avg >= parseFloat(statFilters.minAvg));
    }
    if (statFilters.maxAvg) {
      result = result.filter(p => p.avg <= parseFloat(statFilters.maxAvg));
    }
    if (statFilters.minTrend) {
      result = result.filter(p => p.trend >= parseFloat(statFilters.minTrend));
    }
    if (statFilters.maxTrend) {
      result = result.filter(p => p.trend <= parseFloat(statFilters.maxTrend));
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.team.toLowerCase().includes(term)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'avg') return b.avg - a.avg;
      if (sortBy === 'peak') return b.peak - a.peak;
      if (sortBy === 'trend') return b.trend - a.trend;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'team') return a.team.localeCompare(b.team);
      return 0;
    });

    return result;
  }, [filter, statFilters, sortBy, searchTerm, playerCategories, showUnavailable]);

  const stats = useMemo(() => {
    const want = Object.values(playerCategories).filter(c => c === 'WANT').length;
    const maybe = Object.values(playerCategories).filter(c => c === 'MAYBE').length;
    const no = Object.values(playerCategories).filter(c => c === 'NO').length;
    const watch = Object.values(playerCategories).filter(c => c === 'WATCH').length;
    const unavailable = Object.values(playerCategories).filter(c => c === 'UNAVAILABLE').length;
    const stars = playersData.filter(p => p.star).length;
    return { want, maybe, no, watch, unavailable, total: playersData.length, stars };
  }, [playerCategories]);

  const rosterAnalysis = useMemo(() => {
    if (roster.length === 0) return null;

    const avgRating = roster.reduce((sum, p) => sum + p.avg, 0) / roster.length;
    const avgPeak = roster.reduce((sum, p) => sum + p.peak, 0) / roster.length;
    const avgTrend = roster.reduce((sum, p) => sum + p.trend, 0) / roster.length;

    const roles = roster.map(p => p.role);
    const hasIGL = roles.some(r => r.includes('IGL'));
    const hasEntry = roles.some(r => r.includes('Entry'));
    const hasSupport = roles.some(r => r.includes('Support') || r.includes('Anchor'));
    const hasFlex = roles.some(r => r.includes('Flex'));

    const missing = [];
    if (!hasIGL) missing.push('IGL');
    if (!hasEntry) missing.push('Entry');
    if (!hasSupport) missing.push('Sup/Anchor');

    return { avgRating, avgPeak, avgTrend, hasIGL, hasEntry, hasSupport, hasFlex, missing };
  }, [roster]);

  // Group players by region and team for Teams view
  const teamsByRegion = useMemo(() => {
    const regions = ['NAL', 'EML', 'SAL'];
    const grouped = {};

    regions.forEach(region => {
      const regionPlayers = playersData.filter(p => p.region === region);
      const teams = {};
      regionPlayers.forEach(p => {
        if (!teams[p.team]) teams[p.team] = { players: [], tier: p.tier };
        teams[p.team].players.push(p);
      });
      // Sort teams: T1 first, then T2, then by avg rating within each tier
      const sortedTeams = Object.entries(teams)
        .map(([teamName, data]) => ({
          name: teamName,
          players: data.players.sort((a, b) => b.avg - a.avg),
          avgRating: data.players.reduce((sum, p) => sum + p.avg, 0) / data.players.length,
          avgPeak: data.players.reduce((sum, p) => sum + p.peak, 0) / data.players.length,
          avgTrend: data.players.reduce((sum, p) => sum + p.trend, 0) / data.players.length,
          tier: data.tier
        }))
        .sort((a, b) => {
          // T1 before T2
          if (a.tier !== b.tier) return a.tier === 'T1' ? -1 : 1;
          // Then by rating
          return b.avgRating - a.avgRating;
        });
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
    const picks = { WANT: [], MAYBE: [], WATCH: [] };
    Object.entries(playerCategories).forEach(([name, cat]) => {
      const player = playersData.find(p => p.name === name);
      if (player && picks[cat]) picks[cat].push(player);
    });
    return picks;
  };

  const exportToWord = () => {
    const picks = exportPicks();
    const catLabels = { WANT: 'Priority Targets', MAYBE: 'Secondary Options', WATCH: 'Monitor List' };
    const catColors = { WANT: '#059669', MAYBE: '#d97706', WATCH: '#2563eb' };
    const regionOrder = ['NAL', 'EML', 'SAL'];
    const regionNames = { NAL: 'North America', EML: 'Europe & MENA', SAL: 'South America' };
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const totalPlayers = Object.values(picks).flat().length;

    // Count teams
    const allTeams = new Set();
    Object.values(picks).flat().forEach(p => allTeams.add(p.team));

    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
      <head><meta charset="utf-8"><title>R6 Scouting Report</title>
      <style>
        @page { margin: 0.75in; }
        body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; color: #1f2937; line-height: 1.5; }

        .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #1f2937; }
        .header h1 { font-size: 26px; font-weight: 700; color: #1f2937; margin: 0 0 5px 0; }
        .header .subtitle { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px; }
        .header .date { font-size: 12px; color: #9ca3af; }

        .summary { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px 25px; margin-bottom: 25px; }
        .summary-title { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; margin-bottom: 10px; font-weight: 600; }

        .category-section { margin-bottom: 30px; }
        .category-header { color: white; font-size: 14px; font-weight: 600; padding: 10px 15px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; }

        .region-section { margin-bottom: 20px; margin-left: 10px; }
        .region-header { font-size: 12px; font-weight: 600; color: #475569; text-transform: uppercase; letter-spacing: 1px; padding: 8px 0; border-bottom: 2px solid #e2e8f0; margin-bottom: 12px; }

        .team-block { margin-bottom: 15px; margin-left: 10px; padding: 12px 15px; background: #f8fafc; border-left: 3px solid #cbd5e1; }
        .team-name { font-size: 13px; font-weight: 700; color: #1e293b; margin-bottom: 8px; }
        .team-tier { font-size: 9px; color: #64748b; background: #e2e8f0; padding: 2px 6px; border-radius: 3px; margin-left: 8px; }

        .player-row { display: flex; align-items: center; padding: 6px 0; border-bottom: 1px solid #f1f5f9; }
        .player-row:last-child { border-bottom: none; }
        .player-name { font-weight: 600; color: #1e293b; width: 120px; font-size: 13px; }
        .player-role { font-size: 11px; color: #64748b; width: 80px; }
        .player-rating { font-weight: 700; width: 50px; font-size: 13px; }
        .player-trend { font-size: 11px; width: 50px; }
        .rating-elite { color: #059669; }
        .rating-good { color: #2563eb; }
        .rating-avg { color: #64748b; }
        .trend-up { color: #059669; }
        .trend-down { color: #dc2626; }

        .footer { margin-top: 40px; padding-top: 15px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 10px; color: #94a3b8; }

        table.summary-table { width: 100%; border: none; background: transparent; }
        table.summary-table td { text-align: center; border: none; padding: 8px 15px; }
        .stat-num { font-size: 22px; font-weight: 700; color: #1e293b; }
        .stat-label { font-size: 10px; color: #64748b; text-transform: uppercase; }
      </style></head><body>

      <div class="header">
        <div class="subtitle">Rainbow Six Siege</div>
        <h1>Player Scouting Report</h1>
        <div class="date">${today}</div>
      </div>

      <div class="summary">
        <div class="summary-title">Executive Summary</div>
        <table class="summary-table">
          <tr>
            <td><div class="stat-num">${totalPlayers}</div><div class="stat-label">Total Players</div></td>
            <td><div class="stat-num">${allTeams.size}</div><div class="stat-label">Teams</div></td>
            <td><div class="stat-num" style="color: #059669;">${picks.WANT?.length || 0}</div><div class="stat-label">Priority</div></td>
            <td><div class="stat-num" style="color: #d97706;">${picks.MAYBE?.length || 0}</div><div class="stat-label">Secondary</div></td>
            <td><div class="stat-num" style="color: #2563eb;">${picks.WATCH?.length || 0}</div><div class="stat-label">Monitor</div></td>
          </tr>
        </table>
      </div>
    `;

    Object.entries(picks).forEach(([cat, players]) => {
      if (players.length === 0) return;

      html += `<div class="category-section">
        <div class="category-header" style="background: ${catColors[cat]};">${catLabels[cat]} (${players.length})</div>
      `;

      // Group by region, then by team
      regionOrder.forEach(region => {
        const regionPlayers = players.filter(p => p.region === region);
        if (regionPlayers.length === 0) return;

        html += `<div class="region-section">
          <div class="region-header">${regionNames[region]} (${regionPlayers.length})</div>
        `;

        // Group by team
        const byTeam = {};
        regionPlayers.forEach(p => {
          if (!byTeam[p.team]) byTeam[p.team] = [];
          byTeam[p.team].push(p);
        });

        // Sort teams by number of players (most first)
        const sortedTeams = Object.entries(byTeam).sort((a, b) => b[1].length - a[1].length);

        sortedTeams.forEach(([teamName, teamPlayers]) => {
          const tier = teamPlayers[0]?.tier || 'T1';
          html += `<div class="team-block" style="border-left-color: ${tier === 'T2' ? '#f59e0b' : '#3b82f6'};">
            <div class="team-name">${teamName}<span class="team-tier">${tier}</span></div>
          `;

          // Sort players by rating within team
          teamPlayers.sort((a, b) => b.avg - a.avg).forEach(p => {
            const ratingClass = p.avg >= 1.15 ? 'rating-elite' : p.avg >= 1.05 ? 'rating-good' : 'rating-avg';
            const trendClass = p.trend >= 0 ? 'trend-up' : 'trend-down';
            html += `<div class="player-row">
              <span class="player-name">${p.name}</span>
              <span class="player-role">${p.role}</span>
              <span class="player-rating ${ratingClass}">${p.avg.toFixed(2)}</span>
              <span class="player-trend ${trendClass}">${p.trend >= 0 ? '+' : ''}${p.trend.toFixed(2)}</span>
            </div>`;
          });

          html += `</div>`;
        });

        html += `</div>`;
      });

      html += `</div>`;
    });

    html += `<div class="footer">Generated by R6 Scouting Tool</div></body></html>`;

    const blob = new Blob([html], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'r6-scouting-report.doc';
    link.click();
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

        // Sync to Supabase with current profile
        if (data.categories) {
          const catEntries = Object.entries(data.categories).map(([player_name, category]) => ({ player_name, category, profile: currentProfile }));
          if (catEntries.length > 0) {
            await supabase.from('scouting_categories').upsert(catEntries, { onConflict: 'player_name,profile' });
          }
        }
        if (data.notes) {
          const noteEntries = Object.entries(data.notes).filter(([_, note]) => note.trim()).map(([player_name, note]) => ({ player_name, note, profile: currentProfile }));
          if (noteEntries.length > 0) {
            await supabase.from('scouting_notes').upsert(noteEntries, { onConflict: 'player_name,profile' });
          }
        }
        if (data.roster) {
          // Clear existing roster for this profile and insert new
          await supabase.from('scouting_rosters').delete().eq('profile', currentProfile);
          const rosterEntries = data.roster.map((name, idx) => ({ player_name: name, position: idx, profile: currentProfile }));
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

  const getRoleClass = (role) => {
    if (role.includes('Entry')) return 'role-entry';
    if (role.includes('Flex')) return 'role-flex';
    if (role.includes('Sup') || role.includes('Anchor')) return 'role-support';
    if (role.includes('IGL')) return 'role-igl';
    return 'bg-gray-600/20 border border-gray-600 text-gray-400';
  };

  return (
    <div className="min-h-screen tactical-bg scanlines text-white p-4 overflow-auto">
      {/* Header */}
      <div className="text-center mb-8 relative z-10">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-6xl">radar</span>
            <h1 className="text-5xl font-bold tracking-wider">
              <span className="text-white">R6</span>
              <span className="text-primary text-glow"> SCOUT</span>
            </h1>
          </div>
          <div className={`live-indicator ${
            syncStatus === 'connected' ? '' :
            syncStatus === 'connecting' ? 'border-yellow-500 text-yellow-500' :
            'border-red-500 text-red-500'
          }`}>
            {syncStatus === 'connected' ? 'LIVE SYNC' : syncStatus === 'connecting' ? 'CONNECTING...' : 'OFFLINE'}
          </div>
        </div>
        <p className="text-slate-500 text-sm tracking-wide">{playersData.length} OPERATORS | {stats.stars} ELITE | FULL INTEL</p>
        <p className="text-slate-600 text-xs mt-1 tracking-wider">KEYS: 1-5 CATEGORIZE | R ROSTER | ESC CLOSE</p>

        {/* Profile Selector */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="text-slate-500 text-xs">PROFILE:</span>
          <select
            value={currentProfile}
            onChange={e => setCurrentProfile(e.target.value)}
            className="input-tactical text-sm py-1 px-3"
          >
            {profiles.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
          </select>
          <button
            onClick={() => setShowProfileModal(true)}
            className="btn-tactical text-xs py-1 px-2"
            title="Manage profiles"
          >
            <span className="material-symbols-outlined text-sm">add</span>
          </button>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowProfileModal(false)}>
          <div className="tactical-panel p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Manage Profiles</h2>
              <button onClick={() => setShowProfileModal(false)} className="text-slate-400 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="mb-4">
              <label className="text-slate-400 text-sm block mb-2">Create New Profile</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newProfileName}
                  onChange={e => setNewProfileName(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                  placeholder="profile name"
                  className="input-tactical flex-1"
                  maxLength={20}
                />
                <button
                  onClick={() => {
                    if (newProfileName && !profiles.includes(newProfileName)) {
                      setProfiles([...profiles, newProfileName]);
                      setCurrentProfile(newProfileName);
                      setNewProfileName('');
                    }
                  }}
                  className="btn-primary"
                  disabled={!newProfileName || profiles.includes(newProfileName)}
                >
                  Create
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-slate-400 text-sm block mb-2">Existing Profiles</label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {profiles.map(p => (
                  <div key={p} className={`flex items-center justify-between p-2 rounded ${p === currentProfile ? 'bg-primary/20 border border-primary' : 'bg-panel-light'}`}>
                    {editingProfile === p ? (
                      <div className="flex gap-2 flex-1 mr-2">
                        <input
                          type="text"
                          value={editProfileName}
                          onChange={e => setEditProfileName(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                          className="input-tactical text-sm py-1 px-2 flex-1"
                          maxLength={20}
                          autoFocus
                        />
                        <button
                          onClick={() => {
                            if (editProfileName && !profiles.includes(editProfileName)) {
                              const newProfiles = profiles.map(x => x === p ? editProfileName : x);
                              setProfiles(newProfiles);
                              if (currentProfile === p) setCurrentProfile(editProfileName);
                              setEditingProfile(null);
                              setEditProfileName('');
                            }
                          }}
                          className="text-xs text-green-400 hover:text-green-300"
                          disabled={!editProfileName || (editProfileName !== p && profiles.includes(editProfileName))}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => { setEditingProfile(null); setEditProfileName(''); }}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className={`font-medium ${p === currentProfile ? 'text-primary' : 'text-white'}`}>{p.toUpperCase()}</span>
                        <div className="flex gap-2">
                          {p !== currentProfile && (
                            <button onClick={() => setCurrentProfile(p)} className="text-xs text-slate-400 hover:text-white">
                              Switch
                            </button>
                          )}
                          <button
                            onClick={() => { setEditingProfile(p); setEditProfileName(p); }}
                            className="text-xs text-primary hover:text-primary/80"
                          >
                            Edit
                          </button>
                          {profiles.length > 1 && (
                            <button
                              onClick={() => {
                                if (p === currentProfile) {
                                  const newProfiles = profiles.filter(x => x !== p);
                                  setCurrentProfile(newProfiles[0]);
                                  setProfiles(newProfiles);
                                } else {
                                  setProfiles(profiles.filter(x => x !== p));
                                }
                              }}
                              className="text-xs text-red-400 hover:text-red-300"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-slate-500 text-xs">Each profile saves its own categorizations, notes, and roster.</p>
          </div>
        </div>
      )}

      {/* Stats Bar */}
      <div className="flex justify-center gap-2 md:gap-3 mb-6 flex-wrap relative z-10 px-2">
        <div className="badge-want px-2 md:px-4 py-1.5 md:py-2 rounded font-semibold tracking-wide text-xs md:text-sm">
          <span className="material-symbols-outlined text-xs md:text-sm mr-0.5 md:mr-1 align-middle">check_circle</span>
          <span className="hidden sm:inline">WANT: </span>{stats.want}
        </div>
        <div className="badge-maybe px-2 md:px-4 py-1.5 md:py-2 rounded font-semibold tracking-wide text-xs md:text-sm">
          <span className="material-symbols-outlined text-xs md:text-sm mr-0.5 md:mr-1 align-middle">help</span>
          <span className="hidden sm:inline">MAYBE: </span>{stats.maybe}
        </div>
        <div className="badge-watch px-2 md:px-4 py-1.5 md:py-2 rounded font-semibold tracking-wide text-xs md:text-sm">
          <span className="material-symbols-outlined text-xs md:text-sm mr-0.5 md:mr-1 align-middle">visibility</span>
          <span className="hidden sm:inline">WATCH: </span>{stats.watch}
        </div>
        <div className="badge-no px-2 md:px-4 py-1.5 md:py-2 rounded font-semibold tracking-wide text-xs md:text-sm">
          <span className="material-symbols-outlined text-xs md:text-sm mr-0.5 md:mr-1 align-middle">cancel</span>
          <span className="hidden sm:inline">NO: </span>{stats.no}
        </div>
        <div className="badge-unavailable px-2 md:px-4 py-1.5 md:py-2 rounded font-semibold tracking-wide text-xs md:text-sm">
          <span className="material-symbols-outlined text-xs md:text-sm mr-0.5 md:mr-1 align-middle">block</span>
          <span className="hidden sm:inline">N/A: </span>{stats.unavailable}
        </div>
        <div className="px-2 md:px-4 py-1.5 md:py-2 rounded font-semibold tracking-wide bg-purple-500/20 border border-purple-500 text-purple-400 text-xs md:text-sm">
          <span className="material-symbols-outlined text-xs md:text-sm mr-0.5 md:mr-1 align-middle">star</span>
          <span className="hidden sm:inline">ELITE: </span>{stats.stars}
        </div>
      </div>

      {/* View Toggles */}
      <div className="flex justify-center gap-1.5 md:gap-2 mb-4 flex-wrap relative z-10 px-2">
        <button onClick={() => setView('table')} className={`btn-tactical text-xs md:text-sm ${view === 'table' ? 'active' : ''}`}>
          <span className="material-symbols-outlined text-sm md:mr-1 align-middle">table_chart</span><span className="hidden md:inline">TABLE</span>
        </button>
        <button onClick={() => setView('teams')} className={`btn-tactical text-xs md:text-sm ${view === 'teams' ? 'active' : ''}`}>
          <span className="material-symbols-outlined text-sm md:mr-1 align-middle">groups</span><span className="hidden md:inline">TEAMS</span>
        </button>
        <button onClick={() => setView('summary')} className={`btn-tactical text-xs md:text-sm ${view === 'summary' ? 'active' : ''}`}>
          <span className="material-symbols-outlined text-sm md:mr-1 align-middle">playlist_add_check</span><span className="hidden md:inline">MY PICKS</span>
        </button>
        <button onClick={() => setView('roster')} className={`btn-tactical text-xs md:text-sm ${view === 'roster' ? 'active' : ''}`}>
          <span className="material-symbols-outlined text-sm md:mr-1 align-middle">assignment_ind</span><span className="hidden sm:inline">ROSTER</span> ({roster.length}/5)
        </button>
        <button onClick={() => setView('compare')} className={`btn-tactical text-xs md:text-sm ${view === 'compare' ? 'active' : ''}`}>
          <span className="material-symbols-outlined text-sm md:mr-1 align-middle">compare_arrows</span><span className="hidden md:inline">COMPARE</span> ({compareList.length})
        </button>
        <button onClick={() => setFilter({...filter, starOnly: !filter.starOnly})} className={`btn-tactical text-xs md:text-sm ${filter.starOnly ? 'active' : ''}`}>
          <span className="material-symbols-outlined text-sm md:mr-1 align-middle">star</span><span className="hidden lg:inline">ELITE ONLY</span>
        </button>
        <button onClick={() => setShowStars(!showStars)} className={`btn-tactical text-xs md:text-sm ${showStars ? 'active' : ''}`} title="Toggle star icons">
          <span className="material-symbols-outlined text-sm md:mr-1 align-middle">{showStars ? 'star' : 'star_border'}</span><span className="hidden lg:inline">STARS</span>
        </button>
        <button onClick={() => setShowUnavailable(!showUnavailable)} className={`btn-tactical text-xs md:text-sm ${showUnavailable ? 'active' : ''}`}>
          <span className="material-symbols-outlined text-sm md:mr-1 align-middle">block</span><span className="hidden lg:inline">SHOW N/A</span>
        </button>
        <button onClick={() => setShowExport(!showExport)} className="btn-primary text-xs md:text-sm">
          <span className="material-symbols-outlined text-sm md:mr-1 align-middle">file_download</span><span className="hidden sm:inline">EXPORT</span>
        </button>
        <button onClick={() => setShowFilters(!showFilters)} className={`btn-tactical text-xs md:text-sm ${showFilters ? 'active' : ''}`}>
          <span className="material-symbols-outlined text-sm md:mr-1 align-middle">tune</span><span className="hidden sm:inline">FILTERS</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 mb-4 relative z-10 px-2">
        <div className="relative w-full sm:w-auto">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">search</span>
          <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="input-tactical pl-9 w-full sm:w-40 md:w-52 text-sm" />
        </div>
        <select value={filter.region} onChange={e => setFilter({...filter, region: e.target.value})} className="input-tactical text-sm flex-1 sm:flex-none">
          <option value="ALL">Region</option>
          <option value="NAL">NAL</option>
          <option value="EML">EML</option>
          <option value="SAL">SAL</option>
                  </select>
        <select value={filter.role} onChange={e => setFilter({...filter, role: e.target.value})} className="input-tactical text-sm flex-1 sm:flex-none">
          <option value="ALL">Role</option>
          <option value="Entry">Entry</option>
          <option value="Flex">Flex</option>
          <option value="Sup/Anchor">Support</option>
          <option value="IGL">IGL</option>
        </select>
        <select value={filter.tier} onChange={e => setFilter({...filter, tier: e.target.value})} className="input-tactical text-sm flex-1 sm:flex-none">
          <option value="ALL">Tier</option>
          <option value="T1">T1</option>
          <option value="T2">LCQ</option>
        </select>
        <select value={filter.team} onChange={e => setFilter({...filter, team: e.target.value})} className="input-tactical text-sm flex-1 sm:flex-none hidden sm:block">
          <option value="ALL">Team</option>
          {allTeams.map(team => <option key={team} value={team}>{team}</option>)}
        </select>
        <select value={filter.category} onChange={e => setFilter({...filter, category: e.target.value})} className="input-tactical text-sm flex-1 sm:flex-none">
          <option value="ALL">Status</option>
          <option value="WANT">Want</option>
          <option value="MAYBE">Maybe</option>
          <option value="WATCH">Watch</option>
          <option value="NO">No</option>
          <option value="UNAVAILABLE">N/A</option>
          <option value="UNCATEGORIZED">Uncat.</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input-tactical text-sm flex-1 sm:flex-none">
          <option value="avg">Avg</option>
          <option value="peak">Peak</option>
          <option value="trend">Trend</option>
          <option value="team">Team</option>
        </select>
        {(filter.region !== 'ALL' || filter.role !== 'ALL' || filter.tier !== 'ALL' || filter.category !== 'ALL' || filter.team !== 'ALL' || searchTerm) && (
          <button
            onClick={() => {
              setFilter({ region: 'ALL', role: 'ALL', tier: 'ALL', category: 'ALL', team: 'ALL', starOnly: false });
              setSearchTerm('');
              setStatFilters({ minAvg: '', maxAvg: '', minTrend: '', maxTrend: '' });
            }}
            className="btn-tactical text-xs text-red-400 border-red-500/50 hover:border-red-500"
            title="Reset All Filters"
          >
            <span className="material-symbols-outlined text-sm">filter_alt_off</span>
          </button>
        )}
      </div>

      {/* Advanced Stat Filters */}
      {showFilters && (
        <div className="tactical-panel p-4 mb-4 max-w-2xl mx-auto relative z-10">
          <div className="text-sm text-primary w-full text-center mb-3 font-semibold tracking-wide">
            <span className="material-symbols-outlined text-sm mr-1 align-middle">analytics</span>
            STAT RANGE FILTERS
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <input type="number" step="0.01" placeholder="Min Avg" value={statFilters.minAvg} onChange={e => setStatFilters({...statFilters, minAvg: e.target.value})} className="input-tactical w-24 text-sm" />
            <input type="number" step="0.01" placeholder="Max Avg" value={statFilters.maxAvg} onChange={e => setStatFilters({...statFilters, maxAvg: e.target.value})} className="input-tactical w-24 text-sm" />
            <input type="number" step="0.01" placeholder="Min Trend" value={statFilters.minTrend} onChange={e => setStatFilters({...statFilters, minTrend: e.target.value})} className="input-tactical w-24 text-sm" />
            <input type="number" step="0.01" placeholder="Max Trend" value={statFilters.maxTrend} onChange={e => setStatFilters({...statFilters, maxTrend: e.target.value})} className="input-tactical w-24 text-sm" />
            <button onClick={() => setStatFilters({ minAvg: '', maxAvg: '', minTrend: '', maxTrend: '' })} className="btn-tactical text-red-400 border-red-500/50 hover:border-red-500 text-sm">
              <span className="material-symbols-outlined text-sm mr-1 align-middle">clear</span>Clear
            </button>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedPlayers.size > 0 && (
        <div className="tactical-panel p-3 mb-4 max-w-3xl mx-auto relative z-10">
          <div className="flex justify-center items-center gap-3 flex-wrap">
            <span className="text-primary font-semibold">
              <span className="material-symbols-outlined text-sm mr-1 align-middle">checklist</span>
              {selectedPlayers.size} SELECTED:
            </span>
            <button onClick={() => bulkSetCategory('WANT')} className="badge-want px-3 py-1 rounded text-sm font-medium hover:opacity-80">Want All</button>
            <button onClick={() => bulkSetCategory('MAYBE')} className="badge-maybe px-3 py-1 rounded text-sm font-medium hover:opacity-80">Maybe All</button>
            <button onClick={() => bulkSetCategory('WATCH')} className="badge-watch px-3 py-1 rounded text-sm font-medium hover:opacity-80">Watch All</button>
            <button onClick={() => bulkSetCategory('NO')} className="badge-no px-3 py-1 rounded text-sm font-medium hover:opacity-80">No All</button>
            <button onClick={() => bulkSetCategory('UNAVAILABLE')} className="badge-unavailable px-3 py-1 rounded text-sm font-medium hover:opacity-80">N/A All</button>
            <button onClick={clearSelection} className="btn-tactical text-sm">
              <span className="material-symbols-outlined text-sm mr-1 align-middle">deselect</span>Clear
            </button>
          </div>
        </div>
      )}

      {/* Export Panel */}
      {showExport && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" onClick={() => setShowExport(false)}>
        <div className="tactical-panel p-5 max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-primary tracking-wide">
              <span className="material-symbols-outlined mr-2 align-middle">import_export</span>
              EXPORT / IMPORT
            </h3>
            <button onClick={() => setShowExport(false)} className="text-gray-400 hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="flex gap-3 mb-5">
            <button onClick={exportSession} className="btn-tactical badge-want">
              <span className="material-symbols-outlined text-sm mr-1 align-middle">download</span>Download JSON
            </button>
            <label className="btn-tactical badge-watch cursor-pointer">
              <span className="material-symbols-outlined text-sm mr-1 align-middle">upload</span>Import JSON
              <input type="file" accept=".json" onChange={importSession} className="hidden" />
            </label>
            <button onClick={() => {
              const text = Object.entries(exportPicks()).map(([cat, players]) =>
                `═══════════════════════════════════════\n${categories[cat]?.label.toUpperCase()} (${players.length})\n═══════════════════════════════════════\n${players.map(p =>
                  `${p.name}\n   Team: ${p.team}\n   Role: ${p.role}\n   Avg: ${p.avg.toFixed(2)} | Peak: ${p.peak.toFixed(2)}`
                ).join('\n\n') || '  None'}`
              ).join('\n\n');
              navigator.clipboard.writeText(text);
              alert('Copied!');
            }} className="btn-primary">
              <span className="material-symbols-outlined text-sm mr-1 align-middle">content_copy</span>Copy Text
            </button>
            <button onClick={exportToWord} className="btn-tactical bg-blue-600 hover:bg-blue-500 border-blue-500">
              <span className="material-symbols-outlined text-sm mr-1 align-middle">description</span>Export Word
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            {Object.entries(exportPicks()).map(([cat, players]) => {
              const roleOrder = ['IGL', 'Entry', 'Flex', 'Sup/Anchor'];
              const byRole = {};
              roleOrder.forEach(r => byRole[r] = []);
              players.forEach(p => {
                const role = p.role.replace('Star ', '');
                if (byRole[role]) byRole[role].push(p);
                else if (role.includes('Entry')) byRole['Entry'].push(p);
                else if (role.includes('Flex')) byRole['Flex'].push(p);
                else if (role.includes('Sup') || role.includes('Anchor')) byRole['Sup/Anchor'].push(p);
                else if (role.includes('IGL')) byRole['IGL'].push(p);
                else byRole['Flex'].push(p);
              });
              return (
                <div key={cat} className="tactical-panel p-4">
                  <div className={`font-bold mb-3 text-lg border-b border-panel-border pb-2 badge-${cat.toLowerCase()} inline-block px-2 py-1 rounded`}>
                    {categories[cat]?.label} ({players.length})
                  </div>
                  {roleOrder.map(role => byRole[role].length > 0 && (
                    <div key={role} className="mb-3">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{role}</div>
                      {byRole[role].map(p => (
                        <div key={p.name} className="text-gray-300 mb-1">
                          <span className="font-semibold text-white">{p.name}</span>
                          <span className="text-xs text-gray-500 ml-2">{p.team}</span>
                          <span className="text-xs text-gray-600 ml-2">{p.avg.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                  {players.length === 0 && <div className="text-gray-600">None</div>}
                </div>
              );
            })}
          </div>
        </div>
        </div>
      )}

      {/* Team Builder View */}
      {view === 'roster' && (
        <div className="max-w-4xl mx-auto mb-6 relative z-10">
          <div className="tactical-panel p-5">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <h3 className="text-xl font-bold text-primary tracking-wide">
                <span className="material-symbols-outlined mr-2 align-middle">groups</span>
                TEAM BUILDER
              </h3>
              <div className="flex gap-3 items-center">
                <div className="flex gap-1">
                  <button onClick={() => setRosterStatMode('avg')} className={`px-3 py-1 rounded text-xs font-bold transition-all ${rosterStatMode === 'avg' ? 'bg-primary text-white' : 'bg-panel-light text-gray-400 hover:text-white'}`}>AVG</button>
                  <button onClick={() => setRosterStatMode('peak')} className={`px-3 py-1 rounded text-xs font-bold transition-all ${rosterStatMode === 'peak' ? 'bg-primary text-white' : 'bg-panel-light text-gray-400 hover:text-white'}`}>PEAK</button>
                  <button onClick={() => setRosterStatMode('trend')} className={`px-3 py-1 rounded text-xs font-bold transition-all ${rosterStatMode === 'trend' ? 'bg-primary text-white' : 'bg-panel-light text-gray-400 hover:text-white'}`}>TREND</button>
                </div>
                {roster.length > 0 && (
                  <div className="flex gap-1">
                    <button onClick={() => {
                      const text = roster.map(p => `${p.name} (${p.role}) - ${p.avg.toFixed(2)}`).join('\n');
                      const avgRating = (roster.reduce((sum, p) => sum + p.avg, 0) / roster.length).toFixed(2);
                      navigator.clipboard.writeText(`Team Roster:\n${text}\n\nTeam Avg: ${avgRating}`);
                    }} className="btn-tactical text-xs" title="Copy Roster">
                      <span className="material-symbols-outlined text-sm">content_copy</span>
                    </button>
                    <button onClick={() => setRoster([])} className="btn-tactical text-xs" title="Clear Roster">
                      <span className="material-symbols-outlined text-sm">delete_sweep</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {roster.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <span className="material-symbols-outlined text-4xl mb-2 block text-gray-600">person_add</span>
                Click "+" on players to add them to your roster (max 5)
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
                  {roster.map((p, i) => (
                    <div key={p.name} className="tactical-panel tactical-panel-hover p-3 text-center relative">
                      <button onClick={() => toggleRoster(p)} className="absolute top-2 right-2 text-red-400 hover:text-red-300">
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                      <div className="font-bold text-white">{showStars && p.star ? '⭐ ' : ''}{p.name}{p.tier === 'T2' && <span className="ml-1 px-1 py-0.5 rounded text-[9px] font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/50">LCQ</span>}</div>
                      <div className="text-xs text-gray-500 mt-1">{p.role}</div>
                      {rosterStatMode === 'trend' ? (
                        <div className={`text-sm font-bold mt-2 ${getTrendColor(p.trend)}`}>{p.trend >= 0 ? '+' : ''}{p.trend.toFixed(2)}</div>
                      ) : (
                        <div className={`text-sm ${getRatingColor(rosterStatMode === 'peak' ? p.peak : p.avg)} px-2 py-1 rounded mt-2 inline-block`}>{(rosterStatMode === 'peak' ? p.peak : p.avg).toFixed(2)}</div>
                      )}
                    </div>
                  ))}
                </div>

                {rosterAnalysis && (
                  <div className="tactical-panel p-4 border-primary/20">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 uppercase text-xs tracking-wide">
                          {rosterStatMode === 'avg' ? 'Team Avg' : rosterStatMode === 'peak' ? 'Team Peak' : 'Team Trend'}
                        </span>
                        {rosterStatMode === 'trend' ? (
                          <div className={`mt-1 font-bold ${getTrendColor(rosterAnalysis.avgTrend)}`}>{rosterAnalysis.avgTrend >= 0 ? '+' : ''}{rosterAnalysis.avgTrend.toFixed(2)}</div>
                        ) : (
                          <div className={`mt-1 ${getRatingColor(rosterStatMode === 'peak' ? rosterAnalysis.avgPeak : rosterAnalysis.avgRating)} px-2 py-1 rounded inline-block font-bold`}>
                            {(rosterStatMode === 'peak' ? rosterAnalysis.avgPeak : rosterAnalysis.avgRating).toFixed(2)}
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="text-gray-500 uppercase text-xs tracking-wide">Avg Trend</span>
                        <div className={`mt-1 font-bold ${getTrendColor(rosterAnalysis.avgTrend)}`}>{rosterAnalysis.avgTrend >= 0 ? '+' : ''}{rosterAnalysis.avgTrend.toFixed(2)}</div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500 uppercase text-xs tracking-wide">Role Coverage</span>
                        <div className="mt-1 flex gap-2 flex-wrap">
                          <span className={`px-2 py-1 rounded text-xs ${rosterAnalysis.hasIGL ? 'badge-want' : 'badge-no'}`}>IGL</span>
                          <span className={`px-2 py-1 rounded text-xs ${rosterAnalysis.hasEntry ? 'badge-want' : 'badge-no'}`}>Entry</span>
                          <span className={`px-2 py-1 rounded text-xs ${rosterAnalysis.hasSupport ? 'badge-want' : 'badge-no'}`}>Support</span>
                        </div>
                      </div>
                    </div>
                    {rosterAnalysis.missing.length > 0 && (
                      <div className="mt-3 badge-maybe px-3 py-2 rounded text-sm inline-block">
                        <span className="material-symbols-outlined text-sm mr-1 align-middle">warning</span>
                        Missing: {rosterAnalysis.missing.join(', ')}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Categorized Players - Quick Add */}
          {Object.keys(playerCategories).length > 0 && (
            <div className="tactical-panel p-5 mt-4">
              <h3 className="text-lg font-bold mb-4 text-gray-300 tracking-wide">
                <span className="material-symbols-outlined mr-2 align-middle text-primary">bookmark</span>
                YOUR PICKS - Quick Add to Roster
              </h3>
              <div className="space-y-4">
                {['WANT', 'MAYBE', 'WATCH'].map(cat => {
                  const catPlayers = playersData.filter(p => playerCategories[p.name] === cat && !roster.find(r => r.name === p.name));
                  if (catPlayers.length === 0) return null;
                  return (
                    <div key={cat}>
                      <h4 className={`text-sm font-semibold mb-2 badge-${cat.toLowerCase()} inline-block px-2 py-1 rounded`}>
                        {cat === 'WANT' ? 'Want' : cat === 'MAYBE' ? 'Maybe' : 'Watch'} ({catPlayers.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {catPlayers.sort((a, b) => b.avg - a.avg).map(p => (
                          <button
                            key={p.name}
                            onClick={() => roster.length < 5 && toggleRoster(p)}
                            disabled={roster.length >= 5}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-all ${roster.length >= 5 ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed' : 'bg-panel border-panel-border hover:border-primary/50 hover:bg-primary/10'}`}
                          >
                            <span className="text-sm font-medium text-white">{p.name}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${p.avg >= 1.10 ? 'rating-elite' : p.avg >= 1.00 ? 'rating-good' : 'rating-avg'}`}>{p.avg.toFixed(2)}</span>
                            <span className={`text-xs ${getRoleClass(p.role)} px-1 py-0.5 rounded`}>{p.role}</span>
                            <span className="text-green-400 text-xs">+</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Compare View */}
      {view === 'compare' && (
        <div className="max-w-6xl mx-auto mb-6 relative z-10">
          <div className="tactical-panel p-5">
            <h3 className="text-xl font-bold mb-4 text-primary tracking-wide">
              <span className="material-symbols-outlined mr-2 align-middle">compare_arrows</span>
              COMPARE OPERATORS (max 4)
            </h3>

            {compareList.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <span className="material-symbols-outlined text-4xl mb-2 block text-gray-600">compare</span>
                Click "Compare" on operators to analyze them side by side
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-tactical w-full text-sm">
                  <thead>
                    <tr>
                      <th className="p-3 text-left text-primary">Stat</th>
                      {compareList.map(p => (
                        <th key={p.name} className="p-3 text-center text-white">
                          {showStars && p.star ? '⭐ ' : ''}{p.name}{p.tier === 'T2' && <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/50">LCQ</span>}
                          <button onClick={() => toggleCompare(p)} className="ml-2 text-red-400 hover:text-red-300">
                            <span className="material-symbols-outlined text-sm align-middle">close</span>
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 text-gray-500">Team</td>
                      {compareList.map(p => <td key={p.name} className="p-3 text-center text-gray-300">{p.team}</td>)}
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-500">Role</td>
                      {compareList.map(p => <td key={p.name} className="p-3 text-center text-gray-300">{p.role}</td>)}
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-500">Average</td>
                      {compareList.map(p => <td key={p.name} className="p-3 text-center"><span className={`px-2 py-1 rounded text-xs font-bold ${p.avg >= 1.20 ? 'rating-elite' : p.avg >= 1.10 ? 'rating-good' : p.avg >= 1.00 ? 'rating-avg' : 'rating-low'}`}>{p.avg.toFixed(2)}</span></td>)}
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-500">Peak</td>
                      {compareList.map(p => <td key={p.name} className="p-3 text-center"><span className={`px-2 py-1 rounded text-xs font-bold ${p.peak >= 1.20 ? 'rating-elite' : p.peak >= 1.10 ? 'rating-good' : p.peak >= 1.00 ? 'rating-avg' : 'rating-low'}`}>{p.peak.toFixed(2)}</span></td>)}
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-500">Floor</td>
                      {compareList.map(p => <td key={p.name} className="p-3 text-center"><span className={`px-2 py-1 rounded text-xs font-bold ${p.floor >= 1.20 ? 'rating-elite' : p.floor >= 1.10 ? 'rating-good' : p.floor >= 1.00 ? 'rating-avg' : 'rating-low'}`}>{p.floor.toFixed(2)}</span></td>)}
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-500">Trend</td>
                      {compareList.map(p => <td key={p.name} className={`p-3 text-center font-bold ${getTrendColor(p.trend)}`}>{p.trend >= 0 ? '+' : ''}{p.trend.toFixed(2)}</td>)}
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-500">S1</td>
                      {compareList.map(p => <td key={p.name} className="p-3 text-center text-gray-300">{p.s1?.toFixed(2) || '-'}</td>)}
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-500">S2</td>
                      {compareList.map(p => <td key={p.name} className="p-3 text-center text-gray-300">{p.s2?.toFixed(2) || '-'}</td>)}
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-500">Major Avg</td>
                      {compareList.map(p => <td key={p.name} className="p-3 text-center text-gray-300">{p.majorAvg?.toFixed(2) || '-'}</td>)}
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-500">Chart</td>
                      {compareList.map(p => <td key={p.name} className="p-3 text-center"><Sparkline s1={p.s1} s2={p.s2} majorAvg={p.majorAvg} /></td>)}
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
        <div className={`max-w-7xl mx-auto relative z-10 px-2 ${roster.length > 0 ? 'pb-20' : ''}`}>
          <div className="flex justify-end mb-4">
            <div className="flex gap-1">
              <button onClick={() => setRosterStatMode('avg')} className={`px-3 py-1 rounded text-xs font-bold transition-all ${rosterStatMode === 'avg' ? 'bg-primary text-white' : 'bg-panel-light text-gray-400 hover:text-white'}`}>AVG</button>
              <button onClick={() => setRosterStatMode('peak')} className={`px-3 py-1 rounded text-xs font-bold transition-all ${rosterStatMode === 'peak' ? 'bg-primary text-white' : 'bg-panel-light text-gray-400 hover:text-white'}`}>PEAK</button>
              <button onClick={() => setRosterStatMode('trend')} className={`px-3 py-1 rounded text-xs font-bold transition-all ${rosterStatMode === 'trend' ? 'bg-primary text-white' : 'bg-panel-light text-gray-400 hover:text-white'}`}>TREND</button>
            </div>
          </div>
          {['NAL', 'EML', 'SAL'].map(region => {
            if (filter.region !== 'ALL' && filter.region !== region) return null;
            const regionTeams = teamsByRegion[region];
            if (!regionTeams || regionTeams.length === 0) return null;

            const t1Teams = regionTeams.filter(t => t.tier === 'T1');
            const t2Teams = regionTeams.filter(t => t.tier === 'T2');

            return (
              <div key={region} className="mb-8">
                <h2 className={`text-2xl font-bold mb-4 tracking-wide badge-${region.toLowerCase()} inline-block px-4 py-2 rounded`}>
                  <span className="material-symbols-outlined mr-2 align-middle">public</span>
                  {region}
                </h2>

                {/* T1 Teams */}
                {t1Teams.length > 0 && (
                  <>
                    <h3 className="text-sm font-semibold text-gray-400 mb-3 tracking-wider">TIER 1</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {t1Teams.map(team => {
                        const teamStat = rosterStatMode === 'peak' ? team.avgPeak : rosterStatMode === 'trend' ? team.avgTrend : team.avgRating;
                        return (
                        <div key={team.name} className="tactical-panel tactical-panel-hover p-4">
                          <div className="flex justify-between items-center mb-3 border-b border-panel-border pb-3">
                            <h3 className="text-lg font-bold text-white truncate mr-2">{team.name}</h3>
                            {rosterStatMode === 'trend' ? (
                              <span className={`px-2 py-1 rounded text-sm font-bold whitespace-nowrap ${getTrendColor(teamStat)}`}>
                                {teamStat >= 0 ? '+' : ''}{teamStat.toFixed(2)}
                              </span>
                            ) : (
                              <span className={`px-2 py-1 rounded text-sm font-bold whitespace-nowrap ${teamStat >= 1.10 ? 'rating-elite' : teamStat >= 1.00 ? 'rating-good' : 'rating-avg'}`}>
                                {teamStat.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <div className="space-y-1.5">
                            {team.players.map(p => {
                              const cat = playerCategories[p.name];
                              const isGreyedOut = cat === 'UNAVAILABLE' || cat === 'NO';
                              const hasCategory = !!cat;
                              const statValue = rosterStatMode === 'peak' ? p.peak : p.avg;
                              return (
                              <div
                                key={p.name}
                                className={`flex items-center justify-between p-1.5 rounded cursor-pointer transition-all ${isGreyedOut ? 'bg-gray-800/50 opacity-50' : 'bg-panel-dark hover:bg-primary/10'}`}
                                onClick={() => setSelectedPlayer(p)}
                              >
                                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                  <div className="flex gap-0.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
                                    <button onClick={() => setCategory(p.name, 'WANT')} className={`w-6 h-5 rounded text-xs font-bold transition-all ${cat === 'WANT' ? 'bg-green-500 text-white ring-1 ring-green-300' : hasCategory ? 'bg-gray-700 text-gray-500 hover:bg-gray-600' : 'bg-green-900/50 text-green-400 hover:bg-green-600'}`}>W</button>
                                    <button onClick={() => setCategory(p.name, 'MAYBE')} className={`w-6 h-5 rounded text-xs font-bold transition-all ${cat === 'MAYBE' ? 'bg-yellow-500 text-black ring-1 ring-yellow-300' : hasCategory ? 'bg-gray-700 text-gray-500 hover:bg-gray-600' : 'bg-yellow-900/50 text-yellow-400 hover:bg-yellow-600'}`}>M</button>
                                    <button onClick={() => setCategory(p.name, 'WATCH')} className={`w-6 h-5 rounded text-xs font-bold transition-all ${cat === 'WATCH' ? 'bg-blue-500 text-white ring-1 ring-blue-300' : hasCategory ? 'bg-gray-700 text-gray-500 hover:bg-gray-600' : 'bg-blue-900/50 text-blue-400 hover:bg-blue-600'}`}>?</button>
                                    <button onClick={() => setCategory(p.name, 'NO')} className={`w-6 h-5 rounded text-xs font-bold transition-all ${cat === 'NO' ? 'bg-red-500 text-white ring-1 ring-red-300' : hasCategory ? 'bg-gray-700 text-gray-500 hover:bg-gray-600' : 'bg-red-900/50 text-red-400 hover:bg-red-600'}`}>N</button>
                                    <button onClick={() => setCategory(p.name, 'UNAVAILABLE')} className={`w-6 h-5 rounded text-xs font-bold transition-all ${cat === 'UNAVAILABLE' ? 'bg-gray-500 text-white ring-1 ring-gray-300' : hasCategory ? 'bg-gray-700 text-gray-500 hover:bg-gray-600' : 'bg-gray-800 text-gray-500 hover:bg-gray-600'}`}>X</button>
                                  </div>
                                  <span className={`text-sm font-medium truncate ${isGreyedOut ? 'text-gray-500 line-through' : 'text-white'}`}>{showStars && p.star ? '⭐' : ''}{p.name}</span>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0 ml-1">
                                  {rosterStatMode === 'trend' ? (
                                    <span className={`text-xs font-bold ${isGreyedOut ? 'text-gray-600' : getTrendColor(p.trend)}`}>{p.trend >= 0 ? '+' : ''}{p.trend.toFixed(2)}</span>
                                  ) : (
                                    <>
                                      <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${isGreyedOut ? 'text-gray-600' : statValue >= 1.20 ? 'rating-elite' : statValue >= 1.10 ? 'rating-good' : statValue >= 1.00 ? 'rating-avg' : 'rating-low'}`}>{statValue.toFixed(2)}</span>
                                      <span className={`text-xs font-medium w-10 text-right ${isGreyedOut ? 'text-gray-600' : getTrendColor(p.trend)}`}>{p.trend >= 0 ? '+' : ''}{p.trend.toFixed(2)}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            );})}
                          </div>
                        </div>
                      );})}
                    </div>
                  </>
                )}

                {/* T2 Teams */}
                {t2Teams.length > 0 && (
                  <>
                    <h3 className="text-sm font-semibold text-yellow-500 mb-3 tracking-wider">TIER 2 / LCQ</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {t2Teams.map(team => {
                        const teamStat = rosterStatMode === 'peak' ? team.avgPeak : rosterStatMode === 'trend' ? team.avgTrend : team.avgRating;
                        return (
                        <div key={team.name} className="tactical-panel tactical-panel-hover p-4 border-l-2 border-l-yellow-500/50">
                          <div className="flex justify-between items-center mb-3 border-b border-panel-border pb-3">
                            <h3 className="text-lg font-bold text-white truncate mr-2">{team.name}</h3>
                            {rosterStatMode === 'trend' ? (
                              <span className={`px-2 py-1 rounded text-sm font-bold whitespace-nowrap ${getTrendColor(teamStat)}`}>
                                {teamStat >= 0 ? '+' : ''}{teamStat.toFixed(2)}
                              </span>
                            ) : (
                              <span className={`px-2 py-1 rounded text-sm font-bold whitespace-nowrap ${teamStat >= 1.10 ? 'rating-elite' : teamStat >= 1.00 ? 'rating-good' : 'rating-avg'}`}>
                                {teamStat.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <div className="space-y-1.5">
                            {team.players.map(p => {
                              const cat = playerCategories[p.name];
                              const isGreyedOut = cat === 'UNAVAILABLE' || cat === 'NO';
                              const hasCategory = !!cat;
                              const statValue = rosterStatMode === 'peak' ? p.peak : p.avg;
                              return (
                              <div
                                key={p.name}
                                className={`flex items-center justify-between p-1.5 rounded cursor-pointer transition-all ${isGreyedOut ? 'bg-gray-800/50 opacity-50' : 'bg-panel-dark hover:bg-primary/10'}`}
                                onClick={() => setSelectedPlayer(p)}
                              >
                                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                  <div className="flex gap-0.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
                                    <button onClick={() => setCategory(p.name, 'WANT')} className={`w-6 h-5 rounded text-xs font-bold transition-all ${cat === 'WANT' ? 'bg-green-500 text-white ring-1 ring-green-300' : hasCategory ? 'bg-gray-700 text-gray-500 hover:bg-gray-600' : 'bg-green-900/50 text-green-400 hover:bg-green-600'}`}>W</button>
                                    <button onClick={() => setCategory(p.name, 'MAYBE')} className={`w-6 h-5 rounded text-xs font-bold transition-all ${cat === 'MAYBE' ? 'bg-yellow-500 text-black ring-1 ring-yellow-300' : hasCategory ? 'bg-gray-700 text-gray-500 hover:bg-gray-600' : 'bg-yellow-900/50 text-yellow-400 hover:bg-yellow-600'}`}>M</button>
                                    <button onClick={() => setCategory(p.name, 'WATCH')} className={`w-6 h-5 rounded text-xs font-bold transition-all ${cat === 'WATCH' ? 'bg-blue-500 text-white ring-1 ring-blue-300' : hasCategory ? 'bg-gray-700 text-gray-500 hover:bg-gray-600' : 'bg-blue-900/50 text-blue-400 hover:bg-blue-600'}`}>?</button>
                                    <button onClick={() => setCategory(p.name, 'NO')} className={`w-6 h-5 rounded text-xs font-bold transition-all ${cat === 'NO' ? 'bg-red-500 text-white ring-1 ring-red-300' : hasCategory ? 'bg-gray-700 text-gray-500 hover:bg-gray-600' : 'bg-red-900/50 text-red-400 hover:bg-red-600'}`}>N</button>
                                    <button onClick={() => setCategory(p.name, 'UNAVAILABLE')} className={`w-6 h-5 rounded text-xs font-bold transition-all ${cat === 'UNAVAILABLE' ? 'bg-gray-500 text-white ring-1 ring-gray-300' : hasCategory ? 'bg-gray-700 text-gray-500 hover:bg-gray-600' : 'bg-gray-800 text-gray-500 hover:bg-gray-600'}`}>X</button>
                                  </div>
                                  <span className={`text-sm font-medium truncate ${isGreyedOut ? 'text-gray-500 line-through' : 'text-white'}`}>{showStars && p.star ? '⭐' : ''}{p.name}</span>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0 ml-1">
                                  {rosterStatMode === 'trend' ? (
                                    <span className={`text-xs font-bold ${isGreyedOut ? 'text-gray-600' : getTrendColor(p.trend)}`}>{p.trend >= 0 ? '+' : ''}{p.trend.toFixed(2)}</span>
                                  ) : (
                                    <>
                                      <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${isGreyedOut ? 'text-gray-600' : statValue >= 1.20 ? 'rating-elite' : statValue >= 1.10 ? 'rating-good' : statValue >= 1.00 ? 'rating-avg' : 'rating-low'}`}>{statValue.toFixed(2)}</span>
                                      <span className={`text-xs font-medium w-10 text-right ${isGreyedOut ? 'text-gray-600' : getTrendColor(p.trend)}`}>{p.trend >= 0 ? '+' : ''}{p.trend.toFixed(2)}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            );})}
                          </div>
                        </div>
                      );})}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Summary View */}
      {view === 'summary' && (
        <div className="max-w-6xl mx-auto relative z-10">
          {Object.entries(categories).map(([key, cat]) => {
            const players = playersData.filter(p => playerCategories[p.name] === key);
            if (players.length === 0) return null;
            return (
              <div key={key} className="mb-8">
                <h3 className={`text-xl font-bold mb-4 badge-${key.toLowerCase()} inline-block px-4 py-2 rounded tracking-wide`}>
                  <span className="material-symbols-outlined mr-2 align-middle text-lg">{key === 'WANT' ? 'check_circle' : key === 'MAYBE' ? 'help' : key === 'WATCH' ? 'visibility' : key === 'UNAVAILABLE' ? 'block' : 'cancel'}</span>
                  {cat.label} ({players.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {players.sort((a,b) => b.avg - a.avg).map(p => (
                    <div key={p.name} className="tactical-panel tactical-panel-hover p-4 flex justify-between items-center cursor-pointer" onClick={() => setSelectedPlayer(p)}>
                      <div>
                        <div className="font-bold text-white">{showStars && p.star ? '⭐ ' : ''}{p.name}{p.tier === 'T2' && <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/50">LCQ</span>}</div>
                        <div className="text-sm text-gray-500">{p.team} - {p.role}</div>
                      </div>
                      <div className="text-right">
                        <div className={`px-2 py-1 rounded text-sm font-bold ${p.avg >= 1.20 ? 'rating-elite' : p.avg >= 1.10 ? 'rating-good' : p.avg >= 1.00 ? 'rating-avg' : 'rating-low'}`}>{p.avg.toFixed(2)}</div>
                        <div className={`text-xs font-medium mt-1 ${getTrendColor(p.trend)}`}>{p.trend >= 0 ? '+' : ''}{p.trend.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {Object.keys(playerCategories).length === 0 && (
            <div className="text-center text-gray-500 py-12">
              <span className="material-symbols-outlined text-5xl mb-3 block text-gray-600">playlist_add</span>
              <p>No operators categorized yet</p>
              <p className="text-sm text-gray-600 mt-1">Use the Table view to categorize operators</p>
            </div>
          )}
        </div>
      )}

      {/* Table View */}
      {view === 'table' && (
        <div className={`relative z-10 px-2 ${roster.length > 0 ? 'pb-20' : ''}`}>
          <div className="flex justify-between items-center mb-3 max-w-7xl mx-auto">
            <button onClick={selectAll} className="btn-tactical text-sm">
              <span className="material-symbols-outlined text-sm mr-1 align-middle">select_all</span>
              Select All ({filteredPlayers.length})
            </button>
            <span className="text-gray-500 text-sm tracking-wide">
              SHOWING <span className="text-primary">{filteredPlayers.length}</span> OF {playersData.length}
            </span>
          </div>
          <div className="tactical-panel mx-auto overflow-x-auto" style={{maxWidth: '1600px'}}>
            <table className="table-tactical w-full text-sm min-w-[800px]">
              <thead>
                <tr>
                  <th className="p-2 w-8"><input type="checkbox" onChange={(e) => e.target.checked ? selectAll() : clearSelection()} checked={selectedPlayers.size === filteredPlayers.length && filteredPlayers.length > 0} className="accent-primary" /></th>
                  <th className="p-2 text-left">Actions</th>
                  <th className="p-2 text-left">Operator</th>
                  <th className="p-2 text-left">Team</th>
                  <th className="p-2">Region</th>
                  <th className="p-2 hidden sm:table-cell">Role</th>
                  <th className="p-2">Avg</th>
                  <th className="p-2">Peak</th>
                  <th className="p-2 hidden lg:table-cell">Floor</th>
                  <th className="p-2 hidden xl:table-cell">S1</th>
                  <th className="p-2 hidden xl:table-cell">S2</th>
                  <th className="p-2 hidden lg:table-cell">Major</th>
                  <th className="p-2">Trend</th>
                  <th className="p-2 text-left hidden md:table-cell" style={{minWidth: '200px'}}>Intel</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map((p, i) => (
                  <tr key={`${p.name}-${i}-${sortBy}-${filter.region}-${filter.role}-${filter.tier}-${filter.team}-${filter.category}`} className={`cursor-pointer transition-all ${selectedPlayers.has(p.name) ? 'bg-primary/10 border-l-2 border-l-primary' : ''}`} onClick={() => setSelectedPlayer(p)}>
                    <td className="p-2" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={selectedPlayers.has(p.name)} onChange={() => toggleSelect(p.name)} className="accent-primary" />
                    </td>
                    <td className="p-2" onClick={e => e.stopPropagation()}>
                      <div className="flex gap-1">
                        {filter.category !== 'ALL' ? (
                          <>
                            <button onClick={() => setCategory(p.name, 'WANT')} className={`w-7 h-6 rounded text-xs font-bold transition-all ${playerCategories[p.name] === 'WANT' ? 'bg-green-500 text-white ring-2 ring-green-300' : 'bg-green-600 text-white hover:bg-green-500'}`} title="Want (1)">W</button>
                            <button onClick={() => setCategory(p.name, 'MAYBE')} className={`w-7 h-6 rounded text-xs font-bold transition-all ${playerCategories[p.name] === 'MAYBE' ? 'bg-yellow-500 text-black ring-2 ring-yellow-300' : 'bg-yellow-600 text-white hover:bg-yellow-500'}`} title="Maybe (2)">M</button>
                            <button onClick={() => setCategory(p.name, 'WATCH')} className={`w-7 h-6 rounded text-xs font-bold transition-all ${playerCategories[p.name] === 'WATCH' ? 'bg-blue-500 text-white ring-2 ring-blue-300' : 'bg-blue-600 text-white hover:bg-blue-500'}`} title="Watch (3)">?</button>
                            <button onClick={() => setCategory(p.name, 'NO')} className={`w-7 h-6 rounded text-xs font-bold transition-all ${playerCategories[p.name] === 'NO' ? 'bg-red-500 text-white ring-2 ring-red-300' : 'bg-red-600 text-white hover:bg-red-500'}`} title="No (4)">N</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => setCategory(p.name, 'WANT')} className={`w-6 h-6 rounded text-xs font-bold transition-all ${playerCategories[p.name] === 'WANT' ? 'badge-want' : 'bg-panel-light border border-panel-border hover:border-green-500/50 text-gray-400 hover:text-green-400'}`} title="Want (1)">W</button>
                            <button onClick={() => setCategory(p.name, 'MAYBE')} className={`w-6 h-6 rounded text-xs font-bold transition-all ${playerCategories[p.name] === 'MAYBE' ? 'badge-maybe' : 'bg-panel-light border border-panel-border hover:border-yellow-500/50 text-gray-400 hover:text-yellow-400'}`} title="Maybe (2)">M</button>
                            <button onClick={() => setCategory(p.name, 'WATCH')} className={`w-6 h-6 rounded text-xs font-bold transition-all ${playerCategories[p.name] === 'WATCH' ? 'badge-watch' : 'bg-panel-light border border-panel-border hover:border-blue-500/50 text-gray-400 hover:text-blue-400'}`} title="Watch (3)">?</button>
                            <button onClick={() => setCategory(p.name, 'NO')} className={`w-6 h-6 rounded text-xs font-bold transition-all ${playerCategories[p.name] === 'NO' ? 'badge-no' : 'bg-panel-light border border-panel-border hover:border-red-500/50 text-gray-400 hover:text-red-400'}`} title="No (4)">N</button>
                          </>
                        )}
                        <button onClick={() => toggleRoster(p)} className={`w-6 h-6 rounded text-xs font-bold transition-all ${roster.find(x => x.name === p.name) ? 'bg-primary/20 border border-primary text-primary' : 'bg-panel-light border border-panel-border hover:border-primary/50'}`} title="Add to Roster">+</button>
                      </div>
                    </td>
                    <td className="p-2 font-bold text-white whitespace-nowrap">{showStars && p.star ? '⭐ ' : ''}{p.name}{p.tier === 'T2' && <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/50">LCQ</span>}</td>
                    <td className="p-2 text-gray-400 text-xs">{p.team}</td>
                    <td className="p-2 text-center"><span className={`px-1.5 py-0.5 rounded text-xs font-medium badge-${p.region.toLowerCase()}`}>{p.region}</span></td>
                    <td className="p-2 text-center hidden sm:table-cell"><span className={`px-1.5 py-0.5 rounded text-xs font-medium whitespace-nowrap ${getRoleClass(p.role)}`}>{p.role}</span></td>
                    <td className="p-2 text-center"><span className={`px-1.5 py-0.5 rounded text-xs font-bold ${p.avg >= 1.20 ? 'rating-elite' : p.avg >= 1.10 ? 'rating-good' : p.avg >= 1.00 ? 'rating-avg' : 'rating-low'}`}>{p.avg.toFixed(2)}</span></td>
                    <td className="p-2 text-center"><span className={`px-1.5 py-0.5 rounded text-xs font-bold ${p.peak >= 1.20 ? 'rating-elite' : p.peak >= 1.10 ? 'rating-good' : p.peak >= 1.00 ? 'rating-avg' : 'rating-low'}`}>{p.peak.toFixed(2)}</span></td>
                    <td className="p-2 text-center hidden lg:table-cell"><span className={`px-1.5 py-0.5 rounded text-xs font-bold ${p.floor >= 1.00 ? 'rating-good' : p.floor >= 0.85 ? 'rating-avg' : 'rating-low'}`}>{p.floor.toFixed(2)}</span></td>
                    <td className="p-2 text-center text-xs text-gray-400 hidden xl:table-cell">{p.s1?.toFixed(2) || '-'}</td>
                    <td className="p-2 text-center text-xs text-gray-400 hidden xl:table-cell">{p.s2?.toFixed(2) || '-'}</td>
                    <td className="p-2 text-center text-xs text-gray-400 hidden lg:table-cell">{p.majorAvg?.toFixed(2) || '-'}</td>
                    <td className={`p-2 text-center font-bold text-xs ${getTrendColor(p.trend)}`}>{p.trend >= 0 ? '+' : ''}{p.trend.toFixed(2)}</td>
                    <td className="p-2 text-xs text-gray-400 hidden md:table-cell" style={{minWidth: '200px'}}>{p.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredPlayers.length === 0 && <div className="text-center text-gray-500 py-8">No operators match filters</div>}
        </div>
      )}

      {/* Floating Roster Bar - Shows when in Teams/Table view */}
      {(view === 'teams' || view === 'table') && roster.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-panel-dark/95 backdrop-blur-sm border-t border-primary/30 z-40">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold whitespace-nowrap">Roster ({roster.length}/5)</span>
                {rosterAnalysis && (
                  <div className="flex gap-1">
                    <span className={`px-1 py-0.5 rounded text-[10px] ${rosterAnalysis.hasIGL ? 'badge-want' : 'badge-no'}`}>IGL</span>
                    <span className={`px-1 py-0.5 rounded text-[10px] ${rosterAnalysis.hasEntry ? 'badge-want' : 'badge-no'}`}>Entry</span>
                    <span className={`px-1 py-0.5 rounded text-[10px] ${rosterAnalysis.hasSupport ? 'badge-want' : 'badge-no'}`}>Sup</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 overflow-x-auto flex-1 pb-1">
                {roster.map(p => (
                  <div key={p.name} className="flex items-center gap-2 bg-panel px-3 py-1.5 rounded border border-panel-border flex-shrink-0">
                    <span className="text-sm font-medium text-white">{p.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${p.avg >= 1.10 ? 'rating-elite' : p.avg >= 1.00 ? 'rating-good' : 'rating-avg'}`}>{p.avg.toFixed(2)}</span>
                    <button onClick={() => toggleRoster(p)} className="text-red-400 hover:text-red-300 text-xs">✕</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setRoster([])} className="btn-tactical text-xs whitespace-nowrap" title="Clear Roster">
                  <span className="material-symbols-outlined text-sm">delete_sweep</span>
                </button>
                <button onClick={() => setView('roster')} className="btn-primary text-xs whitespace-nowrap">Full Roster</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Player Detail Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 backdrop-blur-sm" onClick={() => setSelectedPlayer(null)}>
          <div className="tactical-panel p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border-primary/30" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-wide">
                  {selectedPlayer.star ? <span className="text-yellow-400 mr-1">⭐</span> : ''}
                  {selectedPlayer.name}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium badge-${selectedPlayer.region.toLowerCase()}`}>{selectedPlayer.region}</span>
                  <span className="text-gray-500">|</span>
                  <span className="text-gray-400">{selectedPlayer.team}</span>
                  <span className="text-gray-500">|</span>
                  {selectedPlayer.tier === 'T2' ? <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/50">LCQ</span> : <span className="text-gray-500">{selectedPlayer.tier}</span>}
                </div>
                <p className="text-primary mt-1 font-medium">{selectedPlayer.role}</p>
              </div>
              <button onClick={() => setSelectedPlayer(null)} className="text-gray-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              <div className="tactical-panel p-3 text-center">
                <div className="text-gray-500 text-xs uppercase tracking-wide mb-1">Average</div>
                <div className={`text-xl font-bold ${selectedPlayer.avg >= 1.20 ? 'rating-elite' : selectedPlayer.avg >= 1.10 ? 'rating-good' : selectedPlayer.avg >= 1.00 ? 'rating-avg' : 'rating-low'} px-2 py-1 rounded inline-block`}>{selectedPlayer.avg.toFixed(2)}</div>
              </div>
              <div className="tactical-panel p-3 text-center">
                <div className="text-gray-500 text-xs uppercase tracking-wide mb-1">Peak</div>
                <div className={`text-xl font-bold ${selectedPlayer.peak >= 1.20 ? 'rating-elite' : selectedPlayer.peak >= 1.10 ? 'rating-good' : selectedPlayer.peak >= 1.00 ? 'rating-avg' : 'rating-low'} px-2 py-1 rounded inline-block`}>{selectedPlayer.peak.toFixed(2)}</div>
              </div>
              <div className="tactical-panel p-3 text-center">
                <div className="text-gray-500 text-xs uppercase tracking-wide mb-1">Floor</div>
                <div className={`text-xl font-bold ${selectedPlayer.floor >= 1.20 ? 'rating-elite' : selectedPlayer.floor >= 1.10 ? 'rating-good' : selectedPlayer.floor >= 1.00 ? 'rating-avg' : 'rating-low'} px-2 py-1 rounded inline-block`}>{selectedPlayer.floor.toFixed(2)}</div>
              </div>
              <div className="tactical-panel p-3 text-center">
                <div className="text-gray-500 text-xs uppercase tracking-wide mb-1">Trend</div>
                <div className={`text-xl font-bold ${getTrendColor(selectedPlayer.trend)}`}>{selectedPlayer.trend >= 0 ? '+' : ''}{selectedPlayer.trend.toFixed(2)}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="tactical-panel p-3 text-center">
                <div className="text-gray-500 text-xs uppercase tracking-wide mb-1">Season 1</div>
                <div className="text-lg text-white font-semibold">{selectedPlayer.s1?.toFixed(2) || '-'}</div>
              </div>
              <div className="tactical-panel p-3 text-center">
                <div className="text-gray-500 text-xs uppercase tracking-wide mb-1">Season 2</div>
                <div className="text-lg text-white font-semibold">{selectedPlayer.s2?.toFixed(2) || '-'}</div>
              </div>
              <div className="tactical-panel p-3 text-center">
                <div className="text-gray-500 text-xs uppercase tracking-wide mb-1">Major Avg</div>
                <div className="text-lg text-white font-semibold">{selectedPlayer.majorAvg?.toFixed(2) || '-'}</div>
              </div>
            </div>

            <div className="tactical-panel p-4 mb-5">
              <div className="text-primary text-xs uppercase tracking-wide mb-2 font-semibold">
                <span className="material-symbols-outlined text-sm mr-1 align-middle">trending_up</span>
                Performance Trend
              </div>
              <div className="flex justify-center py-2">
                <Sparkline s1={selectedPlayer.s1} s2={selectedPlayer.s2} majorAvg={selectedPlayer.majorAvg} />
              </div>
            </div>

            <div className="tactical-panel p-4 mb-5">
              <div className="text-primary text-xs uppercase tracking-wide mb-2 font-semibold">
                <span className="material-symbols-outlined text-sm mr-1 align-middle">info</span>
                Intel Note
              </div>
              <p className="text-gray-300">{selectedPlayer.note}</p>
            </div>

            <div className="tactical-panel p-4 mb-5">
              <div className="text-primary text-xs uppercase tracking-wide mb-2 font-semibold">
                <span className="material-symbols-outlined text-sm mr-1 align-middle">edit_note</span>
                Your Notes
              </div>
              <textarea
                value={customNotes[selectedPlayer.name] || ''}
                onChange={(e) => updateCustomNote(selectedPlayer.name, e.target.value)}
                placeholder="Add your own intel..."
                className="input-tactical w-full"
                rows={3}
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {Object.entries(categories).map(([key, cat]) => (
                <button key={key} onClick={() => setCategory(selectedPlayer.name, key)} className={`px-4 py-2 rounded font-medium transition-all ${playerCategories[selectedPlayer.name] === key ? `badge-${key.toLowerCase()}` : 'btn-tactical'}`}>
                  {cat.label} ({cat.key})
                </button>
              ))}
              <button onClick={() => toggleCompare(selectedPlayer)} className={`px-4 py-2 rounded font-medium transition-all ${compareList.find(x => x.name === selectedPlayer.name) ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-400' : 'btn-tactical'}`}>
                <span className="material-symbols-outlined text-sm mr-1 align-middle">compare_arrows</span>
                {compareList.find(x => x.name === selectedPlayer.name) ? 'Remove' : 'Compare'}
              </button>
              <button onClick={() => toggleRoster(selectedPlayer)} className={`px-4 py-2 rounded font-medium transition-all ${roster.find(x => x.name === selectedPlayer.name) ? 'bg-primary/20 border border-primary text-primary' : 'btn-tactical'}`}>
                <span className="material-symbols-outlined text-sm mr-1 align-middle">person_add</span>
                {roster.find(x => x.name === selectedPlayer.name) ? 'Remove' : 'Roster (R)'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-gray-600 text-xs mt-8 tracking-wide relative z-10 pb-4">
        <span className="text-primary">DATA:</span> siege.gg |
        <span className="text-primary"> ROSTERS:</span> Liquipedia Jan 2026 |
        <span className="text-primary"> ⭐</span> = Elite Player |
        <span className="text-primary"> SYNC:</span> Real-time Supabase
      </div>
    </div>
  );
}
