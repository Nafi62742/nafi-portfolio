import { Injectable } from '@angular/core';
import { Skill, SkillCategory, Experience, Project, Publication, Education, Leadership } from '../../shared/models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class PortfolioService {

  getSkillCategories(): SkillCategory[] {
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

  getExperiences(): Experience[] {
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
          'Engineered scalable data-driven applications using Angular frontend and AWS cloud infrastructure.',
          'Optimized SQL & NoSQL queries within AWS — improved data retrieval times and API efficiency.',
          'Designed and integrated performance-oriented REST APIs across multiple production systems.',
          'Developed cross-platform mobile apps using Flutter & Firebase (Android focus).',
          'Maintained robust data collection pipelines processing real-time structured & unstructured data.',
        ],
        tech: ['Angular', 'TypeScript', 'AWS', 'DynamoDB', 'Flutter', 'Firebase', 'Laravel', 'MySQL']
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
          'Worked with Flutter (mobile) and Laravel (backend) stacks under senior developer guidance.',
          'Assisted in designing MySQL database schemas and structuring REST API integrations.',
          'Gained hands-on experience with mobile-backend application architecture.',
        ],
        tech: ['Flutter', 'Dart', 'Laravel', 'PHP', 'MySQL']
      }
    ];
  }

  getProjects(): Project[] {
    return [
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
        ]
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
        appstore:        'https://apps.apple.com/jp/app/%E3%82%B0%E3%83%A9%E3%83%A0%E6%9F%93%E8%89%B2%E3%82%A2%E3%83%88%E3%83%A9%E3%82%B9/id1454593922'
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
        type:            'Web Project'
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
        type:            'Web Project'
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
        type:            'Android App',
        github:          'https://github.com/Nafi62742/Voice-record-and-player'
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
        github:          'https://github.com/Nafi62742/Nearest-Location'
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
        type:            'Android App'
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
        type:            'Web Project',
        github:          'https://github.com/Nafi62742/Flour_To_Pastry'
      },
      {
        name:            'Get Fund',
        description:     'A business pitch and crowdfunding platform for entrepreneurs to showcase plans and secure investment.',
        longDescription: 'Get Fund is a crowdfunding and business pitch platform built to connect early-stage entrepreneurs with potential investors. Founders can create detailed campaign pages with business plans, funding goals, milestones, and pitch videos. Investors browse campaigns, filter by industry or funding stage, and pledge amounts toward projects they believe in. The platform tracks funding progress in real time with visual goal indicators and sends notifications when milestones are reached. Built with C# and the ASP.NET MVC framework following clean MVC design patterns. Data is managed through Microsoft SQL Server with a normalized schema covering users, campaigns, pledges, and transactions.',
        highlights:      'Designed interactive pitch presentation pages and dashboard features for funding goal tracking.',
        tech:            ['C#', '.NET MVC', 'Microsoft SQL Server'],
        icon:            'fa-sack-dollar',
        color:           '#6366f1',
        category:        'personal',
        type:            'Web Project',
        github:          'https://github.com/Nafi62742/Getfund'
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
        youtube:         'https://www.youtube.com/watch?v=BuX1QRPwhjU'
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
        github:          'https://github.com/Nafi62742/School-Management-System'
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
        link:            'https://keiai-app.com/app/'
      }
    ];
  }

  getProjectBySlug(slug: string): Project | undefined {
    return this.getProjects().find(p => p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug);
  }

  getPublications(): Publication[] {
    return [
      {
        title:    'Traditional Bengali Food Classification and Calorie Measurement Using Machine Learning',
        venue:    'Journal of Scientific and Technological Research (JSTR), Bangladesh Open University (BOU)',
        year:     '2025',
        authors:  'Swapneel Biswas, Nafi Ahmed & Shykul Islam Siam',
        icon:     'fa-brain',
        color:    '#6366f1',
        abstract: 'Leverages machine learning to classify traditional Bengali dishes and automatically estimate calorie values from visual inputs.',
        link:     'https://doi.org/10.59738/jstr.v6i1.24(103-113).xatj1460'
      },
      {
        title:    'A Deep Learning Approach to Analyze the Relationship Between Gender, Height, Weight, and BMR from Face Images',
        venue:    'IEEE',
        year:     '2025',
        authors:  'Shykul Islam Siam, S. A. H. Chowdhury, Nafi Ahmed & Swapneel Biswas',
        icon:     'fa-microchip',
        color:    '#06b6d4',
        abstract: 'Uses CNNs and deep learning models to predict metabolic attributes (BMR, weight, height, gender) directly from facial features.',
        link:     'https://doi.org/10.30564/re.v7i5.10103'
      }
    ];
  }

  getEducation(): Education[] {
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

  getLeadership(): Leadership[] {
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
}
