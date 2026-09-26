import { Injectable } from '@angular/core';

import {
  SkillCategory,
  Experience,
  Project,
  Publication,
  Education,
  Leadership,
  RunMateData
} from '@models/portfolio.models';

/**
 * Service that provides mock data for all portfolio sections,
 * including skill categories, projects, experience, publications, and education.
 */
@Injectable({ providedIn: 'root' })
export class PortfolioService {

  /**
   * Retrieves the list of technical skill categories.
   *
   * @returns Array of SkillCategory objects
   */
  public getSkillCategories(): Array<SkillCategory> {
    return [
      {
        key: 'cat_mobile', icon: 'fa-mobile-screen',
        skills: ['Flutter', 'Dart', 'Firebase', 'Android Dev', 'iOS Dev', 'FlutterFlow']
      },
      {
        key: 'cat_frontend', icon: 'fa-layer-group',
        skills: ['Angular', 'RxJS', 'TypeScript', 'SCSS/SASS', 'HTML5']
      },
      {
        key: 'cat_backend', icon: 'fa-server',
        skills: ['Laravel', 'PHP', 'Node.js', 'REST APIs', 'Python']
      },
      {
        key: 'cat_database', icon: 'fa-database',
        skills: ['MySQL', 'PostgreSQL', 'DynamoDB', 'Firebase RTDB', 'NoSQL', 'PL/SQL', 'SQL']
      },
      {
        key: 'cat_cloud', icon: 'fa-cloud',
        skills: ['AWS EC2', 'AWS S3', 'AWS Lambda', 'SQS', 'SNS', 'Route53', 'Docker', 'CI/CD']
      },
      {
        key: 'cat_tools', icon: 'fa-screwdriver-wrench',
        skills: ['Git', 'GitHub', 'Postman', 'Jira', 'VS Code', 'Tableau', 'Power BI']
      }
    ];
  }

  /**
   * Retrieves the professional experience timeline history.
   *
   * @returns Array of Experience objects
   */
  public getExperiences(): Array<Experience> {
    return [
      {
        company:    'XORGeek',
        location:   'Dhaka, Bangladesh',
        role:       'Software Developer',
        type:       'fulltime',
        startDate:  'Aug 2023',
        endDate:    null,
        icon:       'fa-briefcase',
        bullets: [
          'Core engineer behind 6 live production systems (RunMate Club, Koyama Shokai, Pet Auction App, KEIAI Order App, Izumi, Ginsen), architecting responsive Angular SPAs and cross-platform Flutter mobile apps.',
          'Engineered and deployed serverless cloud architectures on AWS (Lambda, API Gateway, S3, CloudFront, DynamoDB, EC2, SQS, SNS, Route53) with secure CI/CD and HttpOnly session authentication.',
          'Structured and optimized relational SQL (MySQL, PostgreSQL) schemas and NoSQL (DynamoDB, Firebase RTDB) models, significantly reducing data retrieval latency and improving API throughput.',
          'Designed high-throughput REST APIs and real-time data ingestion pipelines handling live race GPS telemetry, interactive auction bidding streams, and dynamic order workflows.',
          'Implemented strict 4-tier Role-Based Access Control (RBAC) with custom Angular route guards, action-level permission matrices, and automated PDF export pipelines.'
        ],
        tech: ['Angular', 'TypeScript', 'Flutter', 'Dart', 'AWS (Lambda, S3, DynamoDB)', 'Firebase', 'Laravel', 'MySQL', 'RxJS', 'REST APIs']
      },
      {
        company:    'XORGeek',
        location:   'Dhaka, Bangladesh',
        role:       'Software Development Intern',
        type:       'internship',
        startDate:  'Jun 2023',
        endDate:    'Jul 2023',
        icon:       'fa-graduation-cap',
        bullets: [
          'Developed modular mobile UI components and state-managed screens using Flutter and Dart under senior engineering mentorship.',
          'Assisted in designing normalized MySQL database schemas, indexing strategies, and structuring RESTful API integration points.',
          'Participated in agile sprints, code reviews, and hands-on mobile-to-backend application architecture workflows.'
        ],
        tech: ['Flutter', 'Dart', 'Laravel', 'PHP', 'MySQL', 'REST APIs']
      }
    ];
  }

  /**
   * Retrieves the collection of personal and professional projects.
   *
   * @returns Array of Project objects
   */
  public getProjects(): Array<Project> {
    return [
      {
        name:            'RunMate Club',
        description:     'Your ultimate marathon running companion — real-time GPS tracking, running groups, live race leaderboards, and organizer admin.',
        longDescription: 'RunMate Club is a comprehensive marathon running and race management platform built in Flutter (iOS, Android, and Web admin). Developed at XORGeek in collaboration with Nymph Solution, with Masum Reza (Team Lead) and Nafi Ahmed serving as Core Developers alongside engineering teammates Razin Sufian, Kawsar Ahmed, and Mohammad Abir Hassan Sarker. It provides real-time route tracking with road-snap accuracy, automatic finish line detection, offline-first sync, group management with QR codes, personal stats & global leaderboards, KML-based route planning, and community features. The platform also includes a complete organizer admin portal for race creation, SSLCommerz multi-merchant payments, live race map broadcast, automated RFID completion certificates, and remote Virtual Run challenges.',
        highlights:      'Core Developer for cross-platform Flutter mobile & web app with hardened background GPS tracking, anti-cheat engine, and race organizer backend.',
        tech:            ['Flutter', 'Dart', 'Firebase RTDB', 'Cloud Functions', 'GetX', 'SSLCommerz'],
        icon:            'fa-person-running',
        color:           '#06b6d4',
        category:        'office',
        type:            'Mobile & Web App',
        link:            'https://runmate.club/',
        playstore:       'https://play.google.com/store/apps/details?id=com.xorgeek.runmate&hl=en',
        appstore:        'https://apps.apple.com/us/app/runmate-club/id6781556409',
        screenshots: [
          'assets/images/runmate/slide_1_live_gps.jpg',
          'assets/images/runmate/slide_2_leaderboard.jpg',
          'assets/images/runmate/slide_3_race_events.jpg',
          'assets/images/runmate/slide_4_certificates.jpg',
          'assets/images/runmate/slide_5_social_groups.jpg',
          'assets/images/runmate/slide_6_live_run.jpg'
        ],
        additionalLinks: [
          { label: 'Website',     url: 'https://runmate.club/',       icon: 'fa-globe' },
          { label: 'Admin Panel', url: 'https://runmate.club/admin/', icon: 'fa-lock' }
        ],
        collaboration:   'XORGeek in collaboration with Nymph Solution',
        teamLead:        'Masum Reza',
        coreDevelopers:  ['Masum Reza', 'Nafi Ahmed'],
        coreDeveloper:   'Masum Reza & Nafi Ahmed',
        teamMembers:     ['Razin Sufian', 'Kawsar Ahmed', 'Mohammad Abir Hassan Sarker'],
        shortRole:       'Core Developer'
      },
      {
        name:            'Koyama Shokai',
        description:     'A hospital linen & patient-item delivery request management system built with Angular 21, AWS Serverless architecture, and role-based access control.',
        longDescription: 'Koyama Shokai is an enterprise hospital linen and patient-item delivery request management platform developed for Japanese healthcare facilities. The single-page application manages recurring hospital service plans (such as daily linen-exchange sets) and one-off add-on options, scheduling deliveries directly for patients across rooms and wards. Built on Angular 21 with standalone components, strict TypeScript, and OnPush change detection throughout, the system features a 4-tier role-based access control (RBAC) model supporting Admin, Leader, Staff, and Hospital Staff roles with custom route guards and action-level permissions. The frontend communicates with an AWS Serverless REST API powered by API Gateway and Lambda, featuring session-based authentication via HttpOnly cookies, dynamic job polling, automated PDF generation via jsPDF, and Japanese localization.',
        highlights:      'Engineered standalone Angular 21 frontend with RxJS state management, 4-tier role-based access control (RBAC), and AWS Serverless REST API integration with CI/CD deployment.',
        tech:            ['Angular', 'TypeScript', 'Tailwind CSS', 'RxJS', 'AWS Lambda', 'AWS S3', 'CloudFront', 'REST APIs'],
        icon:            'fa-truck-medical',
        color:           '#0284c7',
        category:        'office',
        type:            'Enterprise Web App',
        link:            'https://koyama-stage.efweb.jp/stage',
        shortRole:       'Hospital Logistics & Delivery Management'
      },
      {
        name:            'KEIAI Order App',
        description:     'A cross-platform ordering management application built for KEIAI, enabling streamlined order placement and tracking.',
        longDescription: 'KEIAI Order App is a Flutter-based cross-platform application developed for KEIAI, a Japanese organization. The app provides a clean and efficient interface for placing, managing, and tracking orders within the organization. It supports both web and mobile platforms from a single Flutter codebase, ensuring a consistent experience across devices. The application integrates with the organization\'s backend systems to handle real-time order status updates, user authentication, and order history management. The web version is deployed and accessible online, while mobile builds target both Android and iOS.',
        highlights:      'Built a cross-platform Flutter application deployed as a web app with order management and real-time tracking features.',
        tech:            ['Flutter', 'Dart'],
        icon:            'fa-boxes-stacked',
        color:           '#14b8a6',
        category:        'office',
        type:            'Web & Mobile App',
        link:            'https://keiai-app.com/app/',
        shortRole:       'Prosthetics & Product Ordering'
      },
      {
        name:            'Pet App',
        description:     'An auction application for pets featuring real-time bidding, user listings, and live bid management.',
        longDescription: 'Pet App is a full-stack auction platform dedicated to pet adoption and trading, built for a Japanese client. The system enables users to list pets for auction with rich media, set reserve prices, and manage live bidding sessions with real-time countdown timers. The web frontend was built in Angular with a responsive layout that adapts gracefully across devices. The companion mobile application, built in Flutter, provides the same bidding and listing experience natively on both Android and iOS. The backend is powered by Python-based REST APIs deployed on AWS, with data persisted in DynamoDB for high-availability, low-latency reads. The platform also features user authentication, auction history tracking, and bid notification logic.',
        highlights:      'Built the web user interface in Angular and the mobile application in Flutter with AWS DynamoDB backend.',
        tech:            ['Angular', 'Flutter', 'Python', 'AWS DynamoDB', 'Dart'],
        icon:            'fa-paw',
        color:           '#6366f1',
        category:        'office',
        type:            'Web & Mobile App',
        link:            'https://www.dogcatbirth-records.com/',
        additionalLinks: [
          { label: 'Web App',     url: 'https://www.dogcatbirth-records.com/app/index.html', icon: 'fa-mobile-screen' },
          { label: 'Admin Panel', url: 'https://www.dogcatbirth-records.com/admin/login',    icon: 'fa-lock' }
        ],
        shortRole:       'Buy, Sell & Track Pets'
      },
      {
        name:            'Gram Stain Atlas',
        description:     'A medical atlas app for Gram staining, showing photos, explanations, and pronunciations for 50+ bacteria.',
        longDescription: 'Gram Stain Atlas is a clinically-oriented mobile reference application developed for a Japanese medical institution. It provides a comprehensive visual and audio guide to Gram staining — a fundamental microbiological technique used to classify bacteria. The app covers more than 50 bacterial species, each with high-resolution microscope slide photos, detailed clinical explanations, and native-language audio pronunciations to support medical students and laboratory professionals. The application was built using Flutter to target both Android and iOS from a single codebase. Data is stored locally via SQLite, allowing fully offline access — essential in clinical environments. The app was published to both the Google Play Store and Apple App Store in Japan.',
        highlights:      'Developed cross-platform mobile apps for iOS and Android with offline-first design and audio support.',
        tech:            ['Flutter', 'Dart', 'SQLite'],
        icon:            'fa-microscope',
        color:           '#06b6d4',
        category:        'office',
        type:            'Mobile App',
        playstore:       'https://play.google.com/store/apps/details?id=jp.or.ohtahp.gramstain&hl=ja&pli=1',
        appstore:        'https://apps.apple.com/jp/app/%E3%82%B0%E3%83%A9%E3%83%A0%E6%9F%93%E8%89%B2%E3%82%A2%E3%83%88%E3%83%A9%E3%82%B9/id1454593922',
        shortRole:       'Bacteria Microscopic Atlas'
      },
      {
        name:            'Nearest Area Finder',
        description:     'A proximity-sorting application designed to calculate and display the closest areas from any given location.',
        longDescription: "Nearest Area Finder is a Flutter application that takes a reference geographic coordinate and returns a sorted list of predefined locations ranked by distance from that point. The core of the app is a coordinate-based sorting algorithm that computes Haversine distances between the user's position and a set of known locations, then ranks them in ascending order of proximity. The UI presents results as a clean card list with distance labels, making it easy to quickly identify the nearest relevant area. This project was built to explore Flutter's geolocation capabilities and evaluate algorithmic approaches for proximity ranking without relying on external mapping APIs.",
        highlights:      'Implemented location coordinates sorting algorithms to fetch and rank nearby locations.',
        tech:            ['Flutter', 'Dart'],
        icon:            'fa-location-crosshairs',
        color:           '#8b5cf6',
        category:        'office',
        type:            'Flutter Project',
        github:          'https://github.com/Nafi62742/Nearest-Location',
        shortRole:       'Location Proximity Finder'
      },
      {
        name:            'Izumi',
        description:     'An operational management platform for car repair tracking, delivery status, and service workflows.',
        longDescription: 'Izumi is an internal operations management platform developed for a Japanese automotive service company. It centralizes the entire lifecycle of vehicle repair jobs — from initial intake and diagnosis to parts ordering, technician assignment, and customer delivery. The platform features real-time workflow dashboards that aggregate operational data across multiple service bays, giving managers instant visibility into bottlenecks and job completion rates. Built on Angular for the frontend with a Python-based backend and AWS DynamoDB as the data store, the system was designed for high reliability and scalability. Key features include status tracking timelines, delivery scheduling, service history logs, and exportable reporting.',
        highlights:      'Designed workflow dashboards, aggregating operational data and improving visibility. Built on Angular and AWS.',
        tech:            ['Angular', 'Python', 'AWS DynamoDB'],
        icon:            'fa-car',
        color:           '#10b981',
        category:        'office',
        type:            'Web Application',
        shortRole:       'Car Repair & Workflow Tracker'
      },
      {
        name:            'Ginsen',
        description:     'Form management project featuring dynamic HTML layouts and an AWS-backed data collection framework.',
        longDescription: 'Ginsen is a flexible enterprise form management system developed for a Japanese organization that required a scalable way to collect, store, and process structured data submissions. The platform enables administrators to define custom form layouts using dynamic HTML templates, which users then fill in and submit. All submissions are ingested through Python-based processing pipelines and stored in AWS DynamoDB, enabling fast retrieval and analysis. The system supports conditional field logic, multi-step forms, and rich text inputs, making it adaptable to a wide variety of internal workflows such as incident reporting, procurement requests, and compliance checklists.',
        highlights:      'Built flexible user-defined data inputs and ingestion pipelines processing dynamic form submissions.',
        tech:            ['HTML5', 'Python', 'AWS DynamoDB'],
        icon:            'fa-file-invoice',
        color:           '#f59e0b',
        category:        'office',
        type:            'Web Application',
        shortRole:       'Dynamic Form Management'
      },
      {
        name:            'Voice Record & Play',
        description:     'An offline native Android mobile application designed to record, store, and play back high-quality voice recordings.',
        longDescription: "Voice Record & Play is a native Android application built in Java that provides a clean, minimal interface for capturing audio recordings and replaying them on demand. The app integrates with Android's MediaRecorder and MediaPlayer APIs to deliver high-quality audio capture with configurable encoding formats. All recordings are saved directly to the device's local filesystem, ensuring the app works entirely offline without relying on any cloud service. Users can manage their recordings through a simple list view, rename entries, delete unwanted recordings, and share clips via standard Android intents. This project served as a practical exploration of Android's media and storage APIs.",
        highlights:      'Implemented local filesystem storage operations and audio recording/playback APIs.',
        tech:            ['Java', 'Android SDK'],
        icon:            'fa-microphone',
        color:           '#3b82f6',
        category:        'office',
        type:            'Mobile App',
        github:          'https://github.com/Nafi62742/Voice-record-and-player',
        shortRole:       'Offline Voice Recorder'
      },
      {
        name:            'Pabo Kothay',
        description:     'A discovery and advertising platform helper for small businesses to showcase services to nearby tourists.',
        longDescription: 'Pabo Kothay (Bengali for "Where Will I Find It?") is an Android application designed to bridge the gap between local small businesses and tourists exploring unfamiliar areas in Bangladesh. Business owners can register their shops, restaurants, or service providers with descriptions, photos, and location data. Tourists browsing the app can filter listings by category and proximity, seeing only businesses near their current location. The app leverages Firebase Realtime Database for live data sync, allowing business owners to update their listings instantly. It features a map-integrated discovery view, category filters, and a simple business dashboard for managing listings.',
        highlights:      'Implemented local business advertising channels and location discovery utilizing Firebase Realtime Database.',
        tech:            ['Java', 'Firebase', 'Android SDK'],
        icon:            'fa-map-location-dot',
        color:           '#ec4899',
        category:        'personal',
        type:            'Mobile App',
        shortRole:       'Local Business Directory'
      },
      {
        name:            'Flour to Pastry',
        description:     'A responsive web storefront and ordering application modeled on a real-life online cake shop.',
        longDescription: 'Flour to Pastry is a full-stack e-commerce web application designed around a real-life artisan cake shop. It provides a beautifully styled, responsive product catalog where customers can browse items by category, view detailed product pages with photos and descriptions, and place orders directly through the website. The backend is built with PHP, handling user sessions, authentication, and order processing logic. Product and order data are stored in a MySQL relational database with a carefully designed schema for catalog, inventory, and customer records. The project demonstrates a complete e-commerce flow from browsing to checkout, with an admin panel for managing products and viewing incoming orders.',
        highlights:      'Developed responsive e-commerce storefront views, database schema, and product catalogs.',
        tech:            ['PHP', 'HTML', 'CSS', 'MySQL'],
        icon:            'fa-cake-candles',
        color:           '#f97316',
        category:        'personal',
        type:            'Web Application',
        github:          'https://github.com/Nafi62742/Flour_To_Pastry',
        shortRole:       'Online Bakery Storefront'
      },
      {
        name:            'Get Fund',
        description:     'A business pitch and crowdfunding platform for entrepreneurs to showcase plans and secure investment.',
        longDescription: 'Get Fund is a crowdfunding and business pitch platform built to connect early-stage entrepreneurs with potential investors. Founders can create detailed campaign pages with business goals, milestones, and pitch videos. Investors browse campaigns, filter by industry or funding stage, and pledge amounts toward projects they believe in. The platform tracks funding progress in real time with visual goal indicators and sends notifications when milestones are reached. Built with C# and the ASP.NET MVC framework following clean MVC design patterns. Data is managed through Microsoft SQL Server with a normalized schema covering users, campaigns, pledges, and transactions.',
        highlights:      'Designed interactive pitch presentation pages and dashboard features for funding goal tracking.',
        tech:            ['C#', '.NET MVC', 'Microsoft SQL Server'],
        icon:            'fa-sack-dollar',
        color:           '#6366f1',
        category:        'personal',
        type:            'Web Application',
        github:          'https://github.com/Nafi62742/Getfund',
        shortRole:       'Crowdfunding Platform'
      },
      {
        name:            'Reckless Seas',
        description:     'A boat game implementing a simulated pseudo-3D visual perspective utilizing 2D visual models.',
        longDescription: 'Reckless Seas is a C++ desktop game that recreates the illusion of 3D depth using carefully layered 2D sprites and parallax scaling techniques. The player controls a motorboat navigating through increasingly treacherous open-ocean conditions — dodging icebergs, debris, and enemy vessels while managing speed and hull integrity. The game engine was written from scratch in C++, implementing a custom game loop, frame-rate-independent physics, sprite-based collision detection, and a parallax scrolling background system that creates a convincing sense of speed and depth. The entity management system handles spawning, lifecycle, and interaction of all on-screen objects. This was a hands-on exploration of low-level game development concepts without using any game engine such as Unity or Unreal.',
        highlights:      'Developed game physics, rendering structures, and entity-handling engines.',
        tech:            ['C++'],
        icon:            'fa-ship',
        color:           '#ef4444',
        category:        'personal',
        type:            'Game Project',
        youtube:         'https://www.youtube.com/watch?v=BuX1QRPwhjU',
        shortRole:       'Pseudo-3D Boat Game'
      },
      {
        name:            'School Management System',
        description:     'An upgraded administrative platform for teachers and students to manage academic schedules and progress.',
        longDescription: 'The School Management System is a desktop application built in Java to modernize day-to-day administrative operations in an academic institution. It provides role-based access for administrators, teachers, and students, each with a tailored interface for their specific responsibilities. Administrators can manage student enrollment, class assignments, and staff records. Teachers can input grades, track attendance, and view their assigned courses. Students can check their own academic records, view timetables, and monitor progress. The entire data layer is backed by Microsoft SQL Server, with a carefully normalized relational schema covering courses, enrollments, grades, attendance records, and staff assignments.',
        highlights:      'Designed data tables and relationship structures for courses, grades, and enrollments.',
        tech:            ['Java', 'Microsoft SQL Server'],
        icon:            'fa-graduation-cap',
        color:           '#8b5cf6',
        category:        'personal',
        type:            'Software Project',
        github:          'https://github.com/Nafi62742/School-Management-System',
        shortRole:       'School Admin & Grading'
      }
    ];
  }

  /**
   * Looks up a single project by its URL-safe slug.
   *
   * @param slug - The URL-safe slug of the project (e.g. 'pet-app')
   * @returns The matching Project object, or undefined if not found
   */
  public getProjectBySlug(slug: string): Project | undefined {
    return this.getProjects().find(p => p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug);
  }

  /**
   * Retrieves the collection of academic and scientific publications.
   *
   * @returns Array of Publication objects
   */
  public getPublications(): Array<Publication> {
    return [
      {
        title:           'Traditional Bengali Food Classification and Calorie Measurement Using Machine Learning',
        venue:           'Journal of Scientific and Technological Research (JSTR), Bangladesh Open University (BOU) — Vol. 6, No. 1 (2024), pp. 103–113',
        year:            '2024',
        authors:         'Swapneel Biswas, Nafi Ahmed & Shykul Islam Siam',
        icon:            'fa-brain',
        color:           '#6366f1',
        abstract:        'Applies machine learning techniques including image segmentation and object detection to classify traditional Bengali dishes and automatically estimate calorie values from visual food inputs.',
        longDescription: 'This research addresses the challenge of automated nutritional analysis for traditional Bengali cuisine — a domain largely overlooked by existing food recognition datasets. The study applies machine learning techniques including object detection and image segmentation to classify traditional Bengali dishes from image inputs. Once classified, the system estimates caloric content using dietary reference data. The work evaluates multiple classification architectures and compares their performance on a custom Bengali food dataset. The resulting pipeline demonstrates strong potential for integration into mobile dietary tracking applications, supporting health-conscious users in culturally specific food environments. This contributes a reproducible, scalable framework for food classification in under-represented culinary traditions.',
        keywords:        ['Machine Learning', 'Bengali Cuisine Classification', 'Content Measurement', 'Object Detection', 'Image Segmentation', 'Dietary Assessment', 'Traditional Bengali Dishes'],
        link:            'https://doi.org/10.59738/jstr.v6i1.24(103-113).xatj1460'
      },
      {
        title:           'A Deep Learning Approach to Analyze the Relationship Between Gender, Height, Weight, and Basal Metabolic Rate from Face Images',
        venue:           '2024 IEEE International Conference on Power, Electrical, Electronics and Industrial Applications (PEEIACON) — Rajshahi, Bangladesh, 12–13 September 2024',
        year:            '2024',
        authors:         'Shykul Islam Siam, S. A. H. Chowdhury, Nafi Ahmed & Swapneel Biswas',
        icon:            'fa-microchip',
        color:           '#06b6d4',
        abstract:        'Introduces a novel CNN model for facial attribute estimation that predicts gender, height, weight, and Basal Metabolic Rate (BMR) from face images, achieving 98.50% accuracy on the Face-ete dataset.',
        longDescription: 'In response to existing limitations, a novel convolutional neural network (CNN) model tailored for facial attribute estimation is introduced in this study. The methodology encompasses meticulous data preprocessing techniques, including dataset splitting, resizing, cleaning, augmentation, and cropping, to ensure the integrity of the dataset. Through rigorous real-world testing, remarkable accuracy in predicting gender, height, weight, and basal metabolic rate (BMR) from facial photos is demonstrated by our CNN architecture. Notably, unlike conventional approaches where BMR is directly estimated from facial images, three output neurons are employed by our model to simultaneously predict gender, height, and weight, which are subsequently utilized for BMR calculation. A primary contribution is made through the development of a comprehensive methodology that advances the reliability of facial attribute estimation by achieving an outstanding accuracy of 98.50% on our dataset named Face-ete and a commendable accuracy of 88.29% on another dataset. Our model outperforms the second-best model by percentage relative improvement factors of 2.19 and 4.28 in terms of BMR prediction accuracy.',
        keywords:        ['Deep Learning', 'CNN', 'Basal Metabolic Rate', 'BMR', 'Facial Attribute Estimation', 'Gender Prediction', 'Biometrics', 'Computer Vision', 'PEEIACON'],
        link:            'https://ieeexplore.ieee.org/document/10800058'
      },
      {
        title:           'Drought Forecast Using Traditional and Custom Models for Dhaka, Bangladesh',
        venue:           'Research in Ecology — Bilingual Publishing Group, Vol. 7, Iss. 5 (December 2025)',
        year:            '2025',
        authors:         'Aunik Hasan Mridul, Tanumoy Bose, Swapneel Biswas, Nafi Ahmed, S. M. Hasan Kabir, Nebadeta Nath Tonney & Pooja Saha',
        icon:            'fa-cloud-rain',
        color:           '#10b981',
        abstract:        'Presents a hybrid drought forecasting model combining ARMA, Holt-Winters, ARIMA, and Random Forest for Dhaka Division, Bangladesh, using SPI-based daily precipitation data spanning January 1981 to March 2025.',
        longDescription: 'Water scarcity and climate change are two of the biggest worldwide concerns. Drought is a complicated and often underappreciated phenomenon affecting many facets of human existence. Early drought forecasts are therefore essential for water resource management and strategic planning. This work presents a unique hybrid model combining the Autoregressive Moving Average (ARMA), Holt-Winters Exponential Smoothing, Autoregressive Integrated Moving Average (ARIMA), and Random Forest Regressor. A thorough analysis is performed on daily precipitation data from the Dhaka Division, Bangladesh, spanning January 1981 to March 2025. In contrast to other research that examines only standalone machine learning or conventional statistical models, this study combines both approaches and provides a comparative performance analysis of hybrid models for drought prediction using the Standardized Precipitation Index (SPI). The hybrid Holt-Winters with LSTM model outperforms all other hybrid approaches, with significant improvements in Mean Absolute Error (MAE) and Root Mean Squared Error (RMSE) for SPI daily predictions — underscoring the model\'s superior accuracy for forecasting drought in Bangladesh\'s Dhaka Division.',
        keywords:        ['Drought Forecasting', 'ARIMA', 'Holt-Winters', 'Random Forest', 'LSTM', 'SPI', 'Climate Change', 'Bangladesh', 'Hydrology', 'Precipitation'],
        link:            'https://doi.org/10.30564/re.v7i5.10103'
      }
    ];
  }

  /**
   * Looks up a single publication by its URL-safe slug.
   *
   * @param slug - The URL-safe slug of the publication
   * @returns The matching Publication object, or undefined if not found
   */
  public getPublicationBySlug(slug: string): Publication | undefined {
    return this.getPublications().find(p => p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug);
  }

  /**
   * Retrieves the academic background timeline history.
   *
   * @returns Array of Education objects
   */
  public getEducation(): Array<Education> {
    return [
      {
        institution: 'Ahsanullah University of Science and Technology (AUST)',
        location:    'Dhaka, Bangladesh',
        degree:      'B.Sc. in Computer Science and Engineering',
        period:      '2018 – 2023',
        gpa:         'CGPA: 3.208 / 4.00',
        icon:        'fa-university',
        coursework:  ['Data Structures & Algorithms', 'OOP', 'Database Systems', 'Operating Systems', 'Computer Networks', 'Software Engineering', 'API Development']
      },
      {
        institution: 'Dhaka City College',
        location:    'Dhaka, Bangladesh',
        degree:      'Higher Secondary Certificate (HSC) — Science',
        period:      '2017 – 2018',
        gpa:         'GPA: 4.88 / 5.00',
        icon:        'fa-school',
        coursework:  []
      },
      {
        institution: 'Monipur High School and College',
        location:    'Dhaka, Bangladesh',
        degree:      'Secondary School Certificate (SSC) — Science',
        period:      '2010 – 2016',
        gpa:         'GPA: 5.00 / 5.00',
        icon:        'fa-school-flag',
        coursework:  []
      }
    ];
  }

  /**
   * Retrieves the leadership and extracurricular roles history.
   *
   * @returns Array of Leadership objects
   */
  public getLeadership(): Array<Leadership> {
    return [
      {
        role:         'Program Organizer',
        organization: 'AUST CSE Society',
        period:       'Jan 2022 – Jul 2022',
        description:  'Organized academic seminars, programming workshops, and department events.'
      },
      {
        role:         'General Member',
        organization: 'AUST Innovation and Design Club',
        period:       'Jan 2019 – May 2022',
        description:  'Contributed to innovation challenges, design projects, and club activities.'
      }
    ];
  }

  /**
   * Retrieves the comprehensive feature dataset and slide configuration for the RunMate app.
   *
   * @returns Complete RunMateData object
   */
  public getRunMateData(): RunMateData {
    return {
      appName: 'RunMate Club',
      tagline: 'Track. Compete. Connect.',
      description:
        'Smart Marathon Tracking & Running Community Platform. Live GPS tracking with road-snap accuracy, real-time leaderboards, and community running — all in one app.',
      websiteUrl:   'https://runmate.club/',
      playstoreUrl: 'https://play.google.com/store/apps/details?id=com.xorgeek.runmate&hl=en',
      appstoreUrl:  'https://apps.apple.com/us/app/runmate-club/id6781556409',
      webAdminUrl:  'https://runmate.club/admin/',
      collaboration: 'XORGeek in collaboration with Nymph Solution',
      teamLead:     'Masum Reza',
      coreDevelopers: ['Masum Reza', 'Nafi Ahmed'],
      coreDeveloper: 'Masum Reza & Nafi Ahmed',
      teamMembers:  ['Razin Sufian', 'Kawsar Ahmed', 'Mohammad Abir Hassan Sarker'],
      techStack: [
        'Flutter',
        'Dart',
        'Firebase RTDB',
        'Cloud Functions',
        'GetX',
        'SSLCommerz',
        'Crashlytics',
        'Garmin/Wear OS'
      ],
      metrics: [
        { value: '100%', label: 'OEM Battery Resilient', icon: 'fa-battery-full' },
        { value: '< 1s', label: 'Live Race Sync', icon: 'fa-bolt' },
        { value: '3-Layer', label: 'Anti-Cheat Pipeline', icon: 'fa-shield-halved' },
        { value: 'iOS/Android/Web', label: 'Multi-Platform', icon: 'fa-mobile-screen' }
      ],
      slides: [
        {
          id: 'live-gps',
          title: 'Hardened Background GPS & Live Tracking',
          subtitle:
            'Continuous background tracking engineered to survive OEM battery-killers (Oppo, ColorOS) and OS process kills. Auto-resumes seamless run state with zero lost progress.',
          badge: 'Daily Challenge',
          accentColor: '#06b6d4',
          icon: 'fa-location-arrow',
          image: 'assets/images/runmate/slide_1_live_gps.jpg',
          stats: [
            { label: 'Tracking', value: 'Live Pace & Splits' },
            { label: 'Resilience', value: 'Auto-Pause & Resume' },
            { label: 'Audio', value: 'KM Voice Coach' }
          ]
        },
        {
          id: 'anti-cheat',
          title: '3-Layer Anti-Cheat & Region-Scoped Leaderboards',
          subtitle:
            'Real-time GPS teleport filtering, dead-reckoning gap handling, and vehicle velocity detection. Region-scoped leaderboards automatically adapt based on your recent routes.',
          badge: 'Fair Competition',
          accentColor: '#6366f1',
          icon: 'fa-trophy',
          image: 'assets/images/runmate/slide_2_leaderboard.jpg',
          stats: [
            { label: 'Detection', value: 'Vehicle & Speed Filter' },
            { label: 'Scope', value: 'Auto Region-Detect' },
            { label: 'Safety', value: 'Windowed Day Penalty' }
          ]
        },
        {
          id: 'race-events',
          title: 'Organized Races & Virtual Run Challenges',
          subtitle:
            'Register for official marathons with bib allocation, route KML maps, live broadcast, and SSLCommerz multi-merchant payment routing with automated refund handling.',
          badge: 'Marathon Events',
          accentColor: '#ec4899',
          icon: 'fa-flag-checkered',
          image: 'assets/images/runmate/slide_3_race_events.jpg',
          stats: [
            { label: 'Payments', value: 'SSLCommerz Multi-Merchant' },
            { label: 'Virtual Run', value: 'Target Distance Tracker' },
            { label: 'Broadcast', value: 'Real-Time Bib Position' }
          ]
        },
        {
          id: 'certificates',
          title: 'Automated Race & Virtual Run Certificates',
          subtitle:
            'Instant high-resolution certificate generation with official RFID chip times, category artwork, and custom milestones for both physical races and remote virtual challenges.',
          badge: 'Certificates & Social',
          accentColor: '#10b981',
          icon: 'fa-certificate',
          image: 'assets/images/runmate/slide_4_certificates.jpg',
          stats: [
            { label: 'Physical Race', value: 'Chip Time & Rank' },
            { label: 'Virtual Challenge', value: 'Attempts & Milestones' },
            { label: 'Social', value: 'Groups & Route Sharing' }
          ]
        },
        {
          id: 'social-club',
          title: 'Running Groups & Social Community',
          subtitle:
            'Join running clubs, connect with fellow marathoners, comment and cheer on activity feeds, and share custom route maps and stats cards.',
          badge: 'Community',
          accentColor: '#8b5cf6',
          icon: 'fa-users',
          image: 'assets/images/runmate/slide_5_social_groups.jpg',
          stats: [
            { label: 'Groups', value: 'Club Feed & QR Join' },
            { label: 'Social', value: 'Comments & Likes' },
            { label: 'Sharing', value: 'Stats & Route Cards' }
          ]
        },
        {
          id: 'live-route',
          title: 'Real-Time GPS Route Map & Elevation',
          subtitle:
            'High-precision road-snap route visualization with live splits, elevation profile, and background audio milestones that persist across the entire run.',
          badge: 'Route Analytics',
          accentColor: '#f59e0b',
          icon: 'fa-map-location-dot',
          image: 'assets/images/runmate/slide_6_live_run.jpg',
          stats: [
            { label: 'Map', value: 'Road-Snap Accuracy' },
            { label: 'Splits', value: 'Auto KM Milestones' },
            { label: 'Export', value: 'GPX & Social Cards' }
          ]
        }
      ],
      features: [
        // ── For Runners ──────────────────────────────────────────
        {
          icon: 'fa-person-running',
          title: 'Resilient GPS Tracking',
          description:
            'Real-time distance, pace, and time tracking hardened against aggressive OS battery managers and process kills with seamless auto-resume.',
          category: 'runners',
          badge: 'Core Tracker',
          tags: ['Audio Coach', 'Auto-Pause', 'Wear OS / Garmin / Apple Watch']
        },
        {
          icon: 'fa-trophy',
          title: 'Region-Scoped Leaderboards',
          description:
            'Dynamic leaderboards that auto-detect and scope to your regional cluster based on recent routes, narrowing fairly as runner volume grows.',
          category: 'runners',
          badge: 'Competition',
          tags: ['Auto-Region Detection', 'Daily / Weekly / Monthly', 'Pace Rankings']
        },
        {
          icon: 'fa-shield-halved',
          title: 'Anti-Cheat Fair Play',
          description:
            'Multi-stage verification filtering GPS teleportation, dead-reckoning gaps, and vehicular motion with windowed penalties.',
          category: 'runners',
          badge: 'Fair Play',
          tags: ['Teleport Filter', 'Vehicle Detection', 'Windowed Day Penalty']
        },
        {
          icon: 'fa-users',
          title: 'Social & Running Clubs',
          description:
            'Create and join running clubs with QR codes, share route cards, comment on feeds, and connect with local marathon runners.',
          category: 'runners',
          badge: 'Community',
          tags: ['Club Feeds', 'QR Join', 'Route Share Cards', 'EN / BN / JA']
        },

        // ── Official Races & Marathons ─────────────────────────────
        {
          icon: 'fa-flag-checkered',
          title: 'Official Marathon Registration',
          description:
            'Browse and register for physical marathons with automated bib number allocation, race categories, kit pickup info, and cutoff timers.',
          category: 'races',
          badge: 'Physical Races',
          tags: ['Bib Allocation', 'KML Route Maps', 'Cutoff Timers', 'Emergency Contacts']
        },
        {
          icon: 'fa-satellite-dish',
          title: 'Live Race Map & Fleet Broadcast',
          description:
            'Real-time runner position visualization during live marathons with sub-second leaderboard updates for spectators and officials.',
          category: 'races',
          badge: 'Live Tracking',
          tags: ['Sub-Second Sync', 'Live Fleet Map', 'Spectator Broadcast']
        },
        {
          icon: 'fa-person-hiking',
          title: 'Remote Virtual Run Challenges',
          description:
            'Participate in remote distance challenges with multi-attempt support, activity submission, GPS route verification, and deadline tracking.',
          category: 'races',
          badge: 'Virtual Runs',
          tags: ['Multi-Attempt', 'GPS Route Proof', 'Deadline Engine', 'Global Finishers']
        },
        {
          icon: 'fa-award',
          title: 'Automated RFID & E-Certificates',
          description:
            'High-resolution completion certificates generated on-demand with official chip times, ranks, and custom event artwork.',
          category: 'races',
          badge: 'Finisher Awards',
          tags: ['RFID Chip Times', 'PDF / PNG Generation', 'Verification QR', 'Social Sharing']
        },

        // ── For Organizers & Admins ────────────────────────────────
        {
          icon: 'fa-route',
          title: 'Race & Category Studio',
          description:
            'Create complex multi-category events with KML route uploads, elevation profiles, kit collection details, and virtual run mode switches.',
          category: 'organizers',
          badge: 'Event Studio',
          tags: ['KML Upload', 'Cutoff Times', 'Bib Customization', 'Kit Logistics']
        },
        {
          icon: 'fa-credit-card',
          title: 'Multi-Merchant SSLCommerz Gateway',
          description:
            'Direct routing of participant registration fees to each organizer’s own merchant credentials with automated refund workflows.',
          category: 'organizers',
          badge: 'Monetization',
          tags: ['SSLCommerz Gateway', 'Instant Free Confirm', 'Paid Review Queue']
        },
        {
          icon: 'fa-desktop',
          title: 'Live Organizer Ops Hub',
          description:
            'Dedicated console for real-time race fleet monitoring, virtual attempt approvals, manual timing overrides, and disqualification alerts.',
          category: 'organizers',
          badge: 'Operations Hub',
          tags: ['Attempt Approvals', 'Live Incident Alerts', 'Timing Override']
        },
        {
          icon: 'fa-user-gear',
          title: 'Organizer Self-Signup Pipeline',
          description:
            'Public organizer application portal feeding a super-admin review queue with automated onboarding emails and credential generation.',
          category: 'organizers',
          badge: 'Onboarding',
          tags: ['Self-Signup Portal', 'Super-Admin Review', 'Automated Credentialing']
        },

        // ── Architecture & Security ───────────────────────────────
        {
          icon: 'fa-layer-group',
          title: 'Flutter & GetX Architecture',
          description:
            'Clean reactive state management and high-framerate 60fps rendering across iOS, Android, and Web admin from a unified codebase.',
          category: 'tech',
          badge: 'Frontend',
          tags: ['Flutter 3.x', 'GetX Reactive', 'Cross-Platform iOS/Android/Web']
        },
        {
          icon: 'fa-fire',
          title: 'Firebase Realtime Backend',
          description:
            'Firebase Auth, Realtime Database for sub-second race broadcasts, Cloud Functions for certificate rendering, and Cloud Storage.',
          category: 'tech',
          badge: 'Cloud Infrastructure',
          tags: ['Realtime Database', 'Cloud Functions', 'Staging & Prod Split']
        },
        {
          icon: 'fa-arrows-rotate',
          title: 'Offline-First Write Queue',
          description:
            'Local persistence layer queues telemetry and run milestones offline, syncing reliably upon reconnection with zero packet loss.',
          category: 'tech',
          badge: 'Reliability',
          tags: ['Offline Queue', 'Crashlytics Fatal/Transient Split', 'Zero-Loss Telemetry']
        }
      ]
    };
  }
}

