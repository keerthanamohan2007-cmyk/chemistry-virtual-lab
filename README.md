# Molecular Orbital Theory – Interactive Virtual Chemistry Lab
React + Vite + Tailwind CSS + SVG animation + jsPDF. Replaces the earlier EDTA hardness project (same structure).

## Features
Student registration · Lab Workbench (H₂, He₂, N₂, O₂; 2D energy diagram, 2D LCAO and 3D-style orbital animation; click-to-fill electrons with Aufbau/Pauli/Hund feedback; live bond order and magnetic property) · Learning Centre with viva · Challenge Mode quiz (12 questions) · PDF lab report.

## Run locally (Node 18+)
```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Update your GitHub repository
```bash
git add .
git commit -m "Replace EDTA lab with Molecular Orbital Theory virtual lab"
git push
```
(First time: `git init`, `git branch -M main`, `git remote add origin https://github.com/<user>/<repo>.git`, then the commands above with `git push -u origin main`.)

## Deploy on Vercel
Import the GitHub repo at vercel.com → New Project. Framework: Vite, build `npm run build`, output `dist` (set in `vercel.json`). No environment variables. Click Deploy to get your public URL; every push to `main` redeploys.

## Science notes
Bond order = (Nb − Na)/2. MO orders: H₂/He₂: σ1s<σ*1s. N₂: …σ2s<σ*2s<π2p<σ2p<π*2p<σ*2p. O₂: …σ2p<π2p<π*2p<σ*2p. Diagrams are schematic.
