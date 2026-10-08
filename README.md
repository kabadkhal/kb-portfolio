# KB Portfolio

Personal portfolio of **Kartik Badkhal**, a full-stack software developer and DevOps engineer. It is an interactive, single-page site built with Next.js and Three.js, with a terminal-style boot sequence, a glass 3D tech orb and a live "break it" Kubernetes-style demo.

**Live site:** https://YOUR-SITE.vercel.app
**Repository:** https://github.com/YOUR-USERNAME/kb-portfolio

<!-- Add a screenshot or GIF here: ![Preview](./public/preview.png) -->

## Features

- **Boot sequence:** a terminal window runs a short startup log before the hero slides in.
- **Hero and About:** large animated name, and a paragraph whose words light up as you scroll.
- **3D tech orb:** a Three.js sphere of frosted-glass tool badges (Docker, Kubernetes, Terraform, React, Next.js, Node, AWS and more). It follows the mouse, moves and fades between sections, and changes the page glow color.
- **Project explorer:** a pinned, scroll-driven section with five projects, tech tags and links.
- **"Break it" demo:** a mini cluster with pods, a load balancer, a live log and stats. Kill pods and watch them restart.
- **Glass navigation:** a blurred pill nav with text-scramble hover, a dropdown, and items that slide in after load.
- **Transparent expanding cursor:** a dot that grows into a see-through ring over links and buttons.
- **Pipeline-style scrollbar:** a CI/CD-like progress rail with stages you can click or drag.
- **Terminal and status bar:** press the backtick key (`` ` ``) to open an interactive terminal.
- **Contact section:** curved light section with a terminal "Run" button, confetti, copy-email and a resume download.
- **Accessible by default:** keyboard focus styles and reduced-motion support.

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Next.js (App Router), React |
| 3D and canvas | Three.js, HTML canvas |
| Styling | Plain CSS in `app/globals.css`, with small scoped styles inside some components |
| Hosting | Vercel (auto-deploys from GitHub) |

## Getting started

You need Node.js 18 or newer.

```bash
# clone
git clone https://github.com/YOUR-USERNAME/kb-portfolio.git
cd kb-portfolio

# install dependencies
npm install

# start the dev server
npm run dev
```

Open http://localhost:3000.

To check the production build:

```bash
npm run build
npm start
```

## Project structure

```
kb-portfolio/
├── app/
│   ├── components/
│   │   ├── Boot.js        # terminal boot sequence
│   │   ├── Nav.js         # glass navigation bar
│   │   ├── Cursor.js      # expanding transparent cursor
│   │   ├── TechOrb.js     # 3D glass tech orb
│   │   ├── Contact.js     # contact section
│   │   └── ...            # projects, chaos demo, scrollbar, terminal, status bar
│   ├── globals.css        # global styles
│   ├── layout.js
│   └── page.js            # page sections
├── public/
│   └── Kartik-Resume.pdf  # resume download
└── package.json
```

Component names may differ slightly from this list. Check `app/components/` for the exact files.

## Customize

- **Tools on the orb:** edit the `T` list at the top of `app/components/TechOrb.js`.
- **Navigation links:** edit the `LINKS` and `CTA` lists at the top of `app/components/Nav.js`.
- **Contact details:** change the email and social links in `app/components/Contact.js`.
- **Resume:** replace `public/Kartik-Resume.pdf` and keep the same file name.
- **Colors:** change the variables at the top of `app/globals.css`, such as `--g` for the green accent.

## Deployment

The site is deployed on Vercel and connected to this GitHub repository.

1. Push to the `main` branch: `git add . && git commit -m "message" && git push`.
2. Vercel builds and deploys automatically. Check progress in the **Deployments** tab.

## Roadmap

- [ ] Case-study pages for each project
- [ ] Live GitHub activity section
- [ ] Dockerfile and GitHub Actions pipeline for this site
- [ ] Light and dark theme toggle
- [ ] SEO metadata and social preview image

## Contact

- Email: your-email@example.com
- LinkedIn: https://linkedin.com/in/YOUR-USERNAME
- GitHub: https://github.com/YOUR-USERNAME

## License

All rights reserved. The code is shared for viewing and learning. Please do not copy the design or content as your own portfolio without permission.