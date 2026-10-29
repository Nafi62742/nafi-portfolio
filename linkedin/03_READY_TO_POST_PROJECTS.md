# 📦 Ready-to-Post Project Templates: Nafi Ahmed Edition

Below are fully drafted, ready-to-copy-and-paste LinkedIn posts tailored specifically to your real-world projects, technologies, and achievements.

---

## 🏃 Post 1: RunMate Club — Production Launch & Deep Architecture

### 🎯 Hook Type: Engineering Challenge & Launch Celebration
**Visual Asset to Attach:** 30–45 sec video screen recording of the app doing live GPS route tracking or a side-by-side screenshot of Google Play & App Store listings.

```markdown
🚀 Excited to share what we've been building: RunMate Club — The Smart Marathon Tracking & Running Community Platform is live on iOS and Android! 🏃💨

Building a consumer marathon app sounds simple until you face production realities:
• How do you prevent aggressive Android battery killers (ColorOS, MIUI) from killing your GPS service after 5 minutes?
• How do you verify race results when runners experience GPS drift or try to cheat with simulated locations?
• How do you sync live race bib positions across thousands of runners without crashing your database?

As a Core Developer at XORGeek in collaboration with Nymph Solution, alongside our Team Lead Masum Reza and teammates Razin Sufian, Kawsar Ahmed, and Mohammad Abir Hassan Sarker, we tackled these challenges head-on:

🔋 1. Battery-Hardened GPS Engine:
Engineered persistent background tracking in Flutter with dead-reckoning recovery, auto-pause/resume, and real-time audio cues per kilometer that survive OS background task termination.

🛡️ 2. Multi-Window Anti-Cheat Pipeline:
Built velocity threshold filters and teleportation detection algorithms to ensure 100% fair regional leaderboards.

⚡ 3. Live Marathon Telemetry & Offline-First Sync:
Implemented Firebase Realtime Database pipelines with offline write queues, ensuring zero lost running metrics even during intermittent network dead-zones.

💳 4. Event Hub & Ticketing:
Integrated SSLCommerz multi-merchant payment routing and automated milestone completion certificates for official races and remote Virtual Runs.

🛠️ Tech Stack:
Flutter | Dart | Firebase (Auth, RTDB, Cloud Functions) | GetX | SSLCommerz | REST APIs

📲 Experience the app:
• Google Play: https://play.google.com/store/apps/details?id=com.xorgeek.runmate&hl=en
• Apple App Store: https://apps.apple.com/us/app/runmate-club/id6781556409
• Web: https://runmate.club/

Proud of the entire engineering team for pushing this from architectural design to international store release!

What is the biggest hurdle your team has faced when maintaining persistent background services on mobile? Would love to hear your insights! 👇

#Flutter #MobileDevelopment #Firebase #CrossPlatform #SoftwareEngineering #TechInnovation #XORGeek #RunMateClub
```

*💬 First Comment (Post immediately after publishing):*
```text
Huge appreciation to our Team Lead Masum Reza and teammates Razin Sufian, Kawsar Ahmed, and Mohammad Abir Hassan Sarker for the relentless debugging and dedication during crunch time! Check out the organizer portal at https://runmate.club/admin/ as well.
```

---

## 🏥 Post 2: Koyama Shokai — Enterprise Hospital Logistics (Angular 21 + AWS Serverless)

### 🎯 Hook Type: Modern Frontend Architecture & Enterprise RBAC
**Visual Asset to Attach:** Screenshot of the dashboard UI or an Excalidraw architectural diagram showing Angular 21 -> API Gateway -> Lambda -> S3.

```markdown
🏥 How do you build an enterprise logistics SPA for Japanese healthcare facilities with strict multi-tier access control and zero bundle bloat?

Over the past months at XORGeek, I’ve been leading frontend engineering on Koyama Shokai — an enterprise hospital delivery and linen logistics management platform.

The system coordinates daily linen exchanges, patient-item delivery plans, and ad-hoc medical supplies across rooms, wards, and multiple hospital facilities.

Here is how we architected the system using Angular 21 and AWS Serverless:

⚡ 1. Modern Angular 21 Standalone Architecture:
• Migrated fully away from legacy NgModules to Standalone Components.
• Implemented OnPush Change Detection across all components, drastically reducing unnecessary re-renders.
• Leveraged modern RxJS state streams and functional route guards.

🔐 2. 4-Tier Role-Based Access Control (RBAC):
• Engineered a granular permission engine supporting 4 user roles: Admin, Leader, Staff, and Hospital Staff.
• Role-scoped navigation menus, action-level directive guards, and view masking ensure sensitive patient logistics data remains strictly confidential.

☁️ 3. AWS Serverless Integration:
• Frontend deployed via AWS S3 and CloudFront CDN for sub-second global asset delivery.
• Integrated AWS Lambda and API Gateway REST endpoints with secure HttpOnly cookie session handling.
• Automated client-side PDF manifest generation via jsPDF for real-time delivery dispatches.

🛠️ Tech Stack:
Angular 21 | TypeScript | Tailwind CSS | RxJS | AWS Lambda | AWS S3 | CloudFront | REST APIs

Staging Demo: https://koyama-stage.efweb.jp/stage

Building for Japanese enterprise standards taught our team the immense value of pixel perfection, strict type safety, and defensive UI state handling.

Fellow frontend engineers: Have you migrated your production Angular applications to standalone components and OnPush yet? What was your biggest win? 💬

#Angular #TypeScript #AWS #Serverless #FrontendEngineering #RxJS #EnterpriseSoftware #WebDevelopment
```

---

## 🐾 Post 3: Pet App — Real-Time Auction & Live Bidding System

### 🎯 Hook Type: Concurrency & Database Trade-offs (DynamoDB vs Relational)
**Visual Asset to Attach:** Screen recording of live countdown timer and bidding counter updating in real-time, or system architecture diagram.

```markdown
🔥 Handling high-frequency live bidding without database locks or race conditions: Inside our Pet Auction Platform architecture 🐾

Building an auction platform introduces unique distributed data challenges:
When 100+ users place bids in the final 5 seconds of an auction countdown, standard relational database transactions can quickly become a bottleneck.

For this international client project, we engineered a synchronized web and mobile auction ecosystem built for low latency and high availability:

💡 1. Sub-Second Real-Time Bidding Pipeline:
• Connected Angular web clients and Flutter mobile apps to real-time auction event streams.
• Replaced heavy polling with event-driven state updates to keep countdown timers synchronized down to the millisecond across devices.

🗄️ 2. Why We Chose AWS DynamoDB:
• Relational databases often struggle under sudden spiky write contention during auction finishes.
• By modeling auction items and bid histories in AWS DynamoDB with single-digit millisecond read/write latency, we maintained linear scalability under peak traffic.

📱 3. Unified Cross-Platform Experience:
• Web Frontend: Responsive Angular SPA with dynamic media galleries and live bidding console.
• Mobile App: Native-feel Flutter application targeting iOS and Android from a single codebase.

🛠️ Technologies Used:
Angular | Flutter | Dart | Python | AWS DynamoDB | Firebase | REST APIs

Check out the platform: https://www.dogcatbirth-records.com/

When architecting real-time transactional systems (auctions, ticketing, live trading), what is your database of choice and why? Let's discuss in the comments! 👇

#AWS #DynamoDB #Flutter #Angular #SystemDesign #DatabaseArchitecture #RealTimeData #FullStackDevelopment
```

---

## 🔬 Post 4: Gram Stain Atlas — Offline-First Medical Application

### 🎯 Hook Type: Product Problem-Solving & International Store Deployment
**Visual Asset to Attach:** Carousel of app screens showing bacteria microscopic slides and audio pronunciation waveforms.

```markdown
🦠 What do you do when medical professionals need critical diagnostic reference data in hospital basements with zero cellular reception?

You engineer an offline-first architecture. 📱

Proud to have engineered the mobile application for Gram Stain Atlas — a specialized clinical reference tool developed for Japanese medical institutions and published on both Google Play and Apple App Store in Japan.

The challenge:
Microbiologists and medical students examine bacterial specimens under microscopes and need instant comparisons for 50+ bacterial species — including high-resolution microscopy slides, clinical explanations, and accurate native audio pronunciations.

Key Engineering Highlights:
📦 1. 100% Offline SQLite Data Engine:
All clinical datasets, taxonomies, and high-resolution imaging assets are cached and indexed locally, guaranteeing instantaneous search with zero network latency.

🔊 2. Integrated Audio Pronunciation Engine:
Implemented low-latency native audio playback for complex scientific nomenclature across Android and iOS.

🇯🇵 3. Japanese App Store Localization:
Built fully localized Japanese interfaces adhering strictly to iOS and Android medical app publishing standards.

🛠️ Stack: Flutter | Dart | SQLite | iOS | Android

📲 Store links (Japan):
• Google Play: https://play.google.com/store/apps/details?id=jp.or.ohtahp.gramstain&hl=ja
• App Store: https://apps.apple.com/jp/app/%E3%82%B0%E3%83%A9%E3%83%A0%E6%9F%93%E8%89%B2%E3%82%A2%E3%83%88%E3%83%A9%E3%82%B9/id1454593922

Offline-first design is often treated as an afterthought in mobile development, but in healthcare environments, it is mission-critical.

How do you approach offline caching and local data sync in your mobile apps? 💬

#Flutter #MobileApp #HealthTech #OfflineFirst #MedicalApp #CrossPlatform #SQLite #AppStoreLaunch
```

---

## 📑 Post 5: IEEE & JSTR Research Publications — Bridging AI & Production Software

### 🎯 Hook Type: Academic Rigor Meets Production Engineering
**Visual Asset to Attach:** Picture of paper title page or feature extraction pipeline chart from the paper.

```markdown
🎓 Excited to reflect on our published research in Machine Learning and Deep Learning with IEEE and the Journal of Scientific and Technological Research (JSTR)! 📄🤖

As software developers, we often focus purely on application architecture, frameworks, and APIs. But diving deep into empirical machine learning research fundamentally sharpens how you evaluate data distributions, performance tradeoffs, and algorithmic bottlenecks in production software.

Our research investigated two distinct applied computer vision challenges:

1️⃣ Facial Biometrics & Metabolic Estimation (Published by IEEE):
"A Deep Learning Approach to Analyze the Relationship Between Gender, Height, Weight, and Basal Metabolic Rate from Face Images"
• Built deep neural network architectures extracting facial geometric and texture features to estimate physiological parameters and Basal Metabolic Rate (BMR) non-invasively.
• Co-authored with S. Islam Siam, S. A. H. Chowdhury, and Swapneel Biswas.

2️⃣ Food Science Classification (Published in JSTR):
"Traditional Bengali Food Classification and Calorie Measurement Using Machine Learning"
• Trained image classification and calorie estimation models on regional dietary datasets to aid clinical nutrition tracking.

Key takeaways from academia that made me a better production engineer:
🔹 Data cleanliness is 90% of the battle (both in neural nets and in PostgreSQL schemas).
🔹 Latency and inference footprint matter just as much as validation accuracy.
🔹 Never trust assumptions without empirical benchmarking.

Curious: How many fellow software engineers here actively incorporate machine learning or computer vision into their client apps? Let me know below! 👇

#MachineLearning #DeepLearning #IEEE #ComputerVision #AIResearch #SoftwareEngineering #DataScience
```

---

## 💻 Post 6: Interactive Developer Portfolio Launch (Terminal Workstation)

### 🎯 Hook Type: Design Engineering & Personal Brand Showcase
**Visual Asset to Attach:** 15–20 second screen video showing the workstation terminal, audio sound effects, theme switching, or simulation cards.

```markdown
👨‍💻 Portfolios shouldn't just be static PDF resumes. They should be interactive proof of what you love building.

Today, I’m launching my upgraded personal developer portfolio and interactive workstation! 🚀

🌐 Explore the live experience: https://nafi-ahmed.vercel.app/

Why I designed it this way:
Instead of standard templates, I wanted to combine developer tooling aesthetics (command terminals, simulation consoles, system telemetry) with clean, high-performance web engineering.

Tech & Architecture:
⚡ Built on Angular with strict TypeScript
🎨 Custom design system with glassmorphic depth, dark mode palettes, and fluid responsive layouts
📊 Interactive showcases for production applications: RunMate Club, Koyama Shokai, Pet App, and IEEE research papers
🚀 Deployed on Vercel with automated CI/CD and Lighthouse 95+ performance scores

Would love your constructive feedback on the UI, UX, and animations! Give it a test drive and let me know what you think: 👇
https://nafi-ahmed.vercel.app/

#WebDevelopment #Angular #TypeScript #Portfolio #FrontendDeveloper #UIUX #SoftwareEngineer
```
