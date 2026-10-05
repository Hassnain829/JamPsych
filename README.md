# JamPsych Dashboard / CMS / LMS Prototype

A responsive front-end prototype for JamPsych's proposed company dashboard, content management system (CMS), and learning management system (LMS). It was created to explore the interface and workflows before a planned Laravel implementation.

> **Status:** This repository is a UI prototype, not a Laravel application. It uses sample data and browser-side interactions; it has no backend, database, authentication, or production file storage.

## Preview locally

Open `index.html` in a browser to start with the admin dashboard. Use the profile menu in the top-right corner to switch between the Admin, Uploader, and Student views.

For a local web server, run this from the project directory:

```bash
python -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000). No installation or build step is required. Google Fonts and Font Awesome icons load from external CDNs, so an internet connection is needed for those assets.

## Prototype screens

| View | Pages | What they demonstrate |
| --- | --- | --- |
| Admin | `index.html`, `uploaders.html`, `certificates.html` | Dashboard metrics and charts, uploader management, and certificate/CEU records. |
| Uploader | `uploader-dashboard.html`, `uploader-quizzes.html`, `uploader-quiz-upload.html`, `uploader-submissions.html` | Content overview, add-content flow, quiz management, and student submissions. |
| Student | `student-dashboard.html`, `student-courses.html`, `student-quizzes.html`, `student-certificates.html` | Learning overview, course browsing, quizzes, and certificates/CEUs. |

The prototype includes responsive navigation, tables with search and filters, preview dialogs, charts, and selected CSV export and download interactions.

## How the demo works

- The screens use sample data defined in JavaScript. Changes are for demonstration and are not stored in a database.
- The uploader quiz creation flow uses `localStorage` to pass a demo quiz between pages.
- Some downloads produce placeholder files, and unfinished navigation items display a `Coming Soon` message.
- Switching views previews each role's interface; it does not sign in as a different user.

## Built with

- HTML, CSS, and vanilla JavaScript
- Custom responsive styling and browser-rendered charts
- Google Fonts (Inter) and Font Awesome icons via CDN

The HTML pages are in the project root. Shared styles, scripts, and images are in `assets/`.

## Laravel direction

This prototype can serve as a visual reference for a future Laravel build. That phase would need to implement persistent data, authentication and role permissions, real content and quiz uploads, certificate workflows, and the remaining dashboard/CMS/LMS sections.
