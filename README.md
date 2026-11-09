# Portfolio — Amine Meliouh

Site vitrine personnel : projets, compétences et parcours.
HTML, CSS et JavaScript purs, sans framework ni étape de build.

## Démos interactives
- **Novyxs (chatbot IA)** : simulation du pipeline questions/réponses → lecture du site → tri → Gemini → réponse, plus le vrai chatbot en bas de page.
- **Traducteur Quenya → Tengwar** : port JavaScript de mon TP Java (`js/tengwar.js`).
- **Tours de Hanoï** : visualisation de la récursion étudiée en assembleur RISC-V.

## Versions
- `index.html` : rév. 2.1, le site principal, présenté comme la fiche technique d'un composant « AM-26 ».
- `v1/index.html` : rév. 1.0, l'ancienne vitrine sombre (tag Git `v1`).

## Lancer en local
Ouvrir `index.html` dans un navigateur, ou bien :

```bash
npx serve .
```

(ou le bouton navigateur d'IntelliJ).

## Structure
```
index.html          site principal (v2)
css/style.css
js/datasheet.js     démos et interactions
js/tengwar.js       traducteur Quenya → Tengwar (partagé)
v1/                 ancienne version
```
