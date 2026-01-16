# R6 Scouting Tool - Development Changelog

## Session Summary (January 2026)

### Features Implemented

#### 1. Profile/Folder System
- Multiple scouts can save their own categorizations
- Profile selector in header (dropdown)
- Profile management modal to create/switch profiles
- Data stored per-profile in Supabase tables
- Requires `profile` column in: `scouting_categories`, `scouting_notes`, `scouting_rosters`

#### 2. Teams View Improvements
- T1 teams displayed above T2 teams with distinct section headers
- T2 section has yellow "TIER 2 / LCQ" header and yellow left border accent
- Fixed number overflow with proper widths
- **AVG/PEAK/TREND toggle** - switches player stats AND team average display
- Greyed out players marked as "NO" (same as UNAVAILABLE)
- When a category button is selected, unselected buttons turn grey

#### 3. LCQ Tag System
- Yellow "LCQ" badge displayed next to T2 player names
- Shows in: Table view, Summary view, Player modal, Roster builder, Compare view
- Tier filter renamed from "T2" to "LCQ"

#### 4. Team Builder Enhancements
- **AVG/PEAK/TREND toggle** - changes player stats and team average
- **Copy roster** button - copies roster to clipboard
- **Clear roster** button
- Shows categorized players (Want/Maybe/Watch) for quick add
- Players already in roster are filtered out

#### 5. Floating Roster Bar
- Appears at bottom when in Teams/Table view with players in roster
- Shows current roster with ratings
- **Role coverage indicators** (IGL/Entry/Sup) - green if filled, red if missing
- Clear roster button
- "Full Roster" button to jump to Team Builder

#### 6. Filter Improvements
- **Reset all filters** button (appears when any filter is active)
- Clears: region, role, tier, category, team, search, and stat filters

#### 7. Mobile Responsiveness
- Responsive filter dropdowns
- Horizontal scroll for table on mobile
- Smaller buttons and badges on mobile
- Hide less important columns on small screens

#### 8. Player Data Updates
- Removed all APAC teams/players (Elevate, SANDBOX, DWG KIA)
- App now focuses on NAL, EML, SAL regions only
- Updated player roles:
  - Yoggah: IGL → IGL/Flex
  - GMZ: Flex → Flex/Entry

#### 9. UI/UX Improvements
- Star icon toggle (show/hide stars)
- Category buttons grey out when one is selected
- NO and UNAVAILABLE both grey out player rows

---

## Database Schema Requirements

### Supabase Tables Need These Columns:

```sql
-- Add profile column to scouting_categories
ALTER TABLE scouting_categories ADD COLUMN profile TEXT DEFAULT 'redeem';
ALTER TABLE scouting_categories DROP CONSTRAINT IF EXISTS scouting_categories_pkey;
ALTER TABLE scouting_categories ADD PRIMARY KEY (player_name, profile);

-- Add profile column to scouting_notes
ALTER TABLE scouting_notes ADD COLUMN profile TEXT DEFAULT 'redeem';
ALTER TABLE scouting_notes DROP CONSTRAINT IF EXISTS scouting_notes_pkey;
ALTER TABLE scouting_notes ADD PRIMARY KEY (player_name, profile);

-- Add profile column to scouting_rosters
ALTER TABLE scouting_rosters ADD COLUMN profile TEXT DEFAULT 'redeem';
ALTER TABLE scouting_rosters DROP CONSTRAINT IF EXISTS scouting_rosters_pkey;
ALTER TABLE scouting_rosters ADD PRIMARY KEY (player_name, profile);
```

---

## Key Files

- `src/App.jsx` - Main application with all player data and UI
- `src/index.css` - Tailwind config and custom CSS (mobile responsiveness)
- `src/supabaseClient.js` - Supabase connection

---

## Tech Stack

- React + Vite
- Tailwind CSS
- Supabase (real-time database)
- Deployed on Vercel

---

## Git Repository

https://github.com/redeemthedream/R6-scouting-tool
