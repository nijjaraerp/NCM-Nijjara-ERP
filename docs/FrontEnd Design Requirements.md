2.2 Module Identity Colors
Each module is identified by a specific "Deep" color tone. | Module | Variable | Value (Deepest Level) | | :--- | :--- | :--- | | System | --color-sys | #0d47a1 (Deep Navy Blue) | | HRM | --color-hrm | #1b5e20 (Deep Forest Green) | | Projects | --color-prj | #bf8d0a (Deep Gold/Bronze) | | Finance | --color-fin | #b71c1c (Deep Crimson Red) |

2.3 Lighting & Effects
Variable Value / Logic usage
--glass-shadow 15px 15px 30px rgba(0,0,0,0.6), -5px -5px 15px rgba(255,255,255,0.03) Creates the 3D "floating" block effect.
--border-light rgba(255, 255, 255, 0.08) Subtle border for glass edges.
--transition all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) Standard smooth animation timing.

Export to Sheets

3.0 LAYOUT & STRUCTURE
3.1 Background Strategy
The body must always utilize a deep radial gradient to create a "spotlight" effect on the dark navy background.

CSS

background-image:
radial-gradient(circle at 10% 20%, rgba(13, 71, 161, 0.15) 0%, transparent 40%),
radial-gradient(circle at 90% 80%, rgba(183, 28, 28, 0.1) 0%, transparent 40%);
3.2 Quick Navigation Bar (Hover-Reveal)
Position: Fixed to the Right edge (Right-to-Left layout).

State (Default): Hidden (TranslateX 90%), only a thin strip visible.

State (Hover): Slides out fully (transform: translateX(0)).

Styling: Glassmorphism sidebar with vertical icons.

4.0 COMPONENT LIBRARY
4.1 Login Card (The "Glance" Effect)
Structure: A centered glass card (.login-glass).

Animation: A "glancing" light beam that rotates across the card surface endlessly.

Fields: Input fields must have a transparent background with a light border that glows upon focus.

4.2 Dashboard Modules (The Hub)
Grid: 4-Column layout.

Card Style:

Border-bottom colored by --color-{module}.

Hover Effect: The hovered card scales up (scale(1.05)), moves forward (translateZ), and blurs all other cards (filter: blur(4px)).

Sub-Menu: On hover, the module icon fades up, revealing a grid of sub-module links (opacity: 1, transform: translateY(0)).

4.3 Smart Grid (Data View)
The primary data table for all modules.

Container: border-radius: 15px, overflow: hidden.

Header: Sticky top, transparent background (rgba(255,255,255,0.02)).

Rows:

Hovering a row scales it slightly (scale(1.005)).

Quick Actions: Edit/View/Delete icons appear only on row hover.

Bulk Action Bar: A floating pill-shaped bar that slides up from the bottom when checkboxes are selected.

4.4 Forms (Dual Mode Modal)
A unified modal structure for both Data Entry and View Details.

Backdrop: Deep blur (backdrop-filter: blur(10px)).

Tabs: Top navigation (e.g., Personal, Job, Financial).

Mode - Entry: Inputs are bordered boxes with placeholder text.

Mode - View: Inputs become transparent, bold text, removing borders to look like a document.

5.0 INTERACTION & ANIMATION RULES
5.1 The "Brand Reveal" (Login Sequence)
Phase 1: Login form fades out (opacity: 0).

Phase 2: The text "NIJJARA" scales down to center screen, letters spacing out (letter-spacing: 10px).

Phase 3: The text "explodes" (scales up to 10x opacity 0) revealing the Dashboard behind it.

5.2 Hover Physics
Buttons: transform: translateY(-2px) on hover.

Inputs: border-color: var(--text-muted) and box-shadow glow on focus.

Nav Items: Icons scale up (scale(1.2)) and turn white.

6.0 IMPLEMENTATION CHECKLIST
When applying this design to code:

[ ] Ensure dir="rtl" is set on the <html> tag.

[ ] Import Cairo font from Google Fonts.

[ ] Paste the Root Variables (Section 2.0) into the global CSS.

[ ] Apply the Glossy Glass classes to all containers (Login, Dashboard, Modal).

[ ] Verify Module Colors are applied correctly to their respective cards and buttons.
