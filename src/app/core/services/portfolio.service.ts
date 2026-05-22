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
        name:        'Pet App',
        description: 'An auction application for pets featuring real-time bidding, user listings, and live bid management.',
        highlights:  'Built the web user interface in Angular and the mobile application in Flutter with AWS DynamoDB backend.',
        tech:        ['Angular', 'Flutter', 'Python', 'AWS DynamoDB', 'Dart'],
        icon:        'fa-paw',
        color:       '#6366f1',
        category:    'office',
        type:        'Web & Mobile App',
        link:        'https://www.dogcatbirth-records.com/'
      },
      {
        name:        'Gram Stain Atlas',
        description: 'A medical atlas app for Gram staining, showing photos, explanations, and pronunciations for 50+ bacteria.',
        highlights:  'Developed cross-platform mobile apps for iOS and Android with offline-first design and audio support.',
        tech:        ['Flutter', 'Dart', 'SQLite'],
        icon:        'fa-microscope',
        color:       '#06b6d4',
        category:    'office',
        type:        'Mobile App',
        playstore:   'https://play.google.com/store/apps/details?id=jp.or.ohtahp.gramstain&hl=ja&pli=1',
        appstore:    'https://apps.apple.com/jp/app/%E3%82%B0%E3%83%A9%E3%83%A0%E6%9F%93%E8%89%B2%E3%82%A2%E3%83%88%E3%83%A9%E3%82%B9/id1454593922'
      },
      {
        name:        'Izumi',
        description: 'An operational management platform for car repair tracking, delivery status, and service workflows.',
        highlights:  'Designed workflow dashboards, aggregating operational data and improving visibility. Built on Angular and AWS.',
        tech:        ['Angular', 'Python', 'AWS DynamoDB'],
        icon:        'fa-car',
        color:       '#10b981',
        category:    'office',
        type:        'Web Project'
      },
      {
        name:        'Ginsen',
        description: 'Form management project featuring dynamic HTML layouts and an AWS-backed data collection framework.',
        highlights:  'Built flexible user-defined data inputs and ingestion pipelines processing dynamic form submissions.',
        tech:        ['HTML5', 'Python', 'AWS DynamoDB'],
        icon:        'fa-file-invoice',
        color:       '#f59e0b',
        category:    'office',
        type:        'Web Project'
      },
      // {
      //   name:        'Account Book',
      //   description: 'A cross-platform financial tracking application to keep records of daily expenses and generate dynamic summaries.',
      //   highlights:  'Developed expense logging utilities and summary views for personal financial tracking.',
      //   tech:        ['Flutter', 'Dart'],
      //   icon:        'fa-book',
      //   color:       '#06b6d4',
      //   category:    'office',
      //   type:        'Flutter App'
      // },
      {
        name:        'Voice Record & Play',
        description: 'An offline native Android mobile application designed to record, store, and play back high-quality voice recordings.',
        highlights:  'Implemented local filesystem storage operations and audio recording/playback APIs.',
        tech:        ['Java', 'Android SDK'],
        icon:        'fa-microphone',
        color:       '#3b82f6',
        category:    'office',
        type:        'Android App'
      },
      {
        name:        'Nearest Area Finder',
        description: 'A proximity-sorting application designed to calculate and display the closest areas from any given location.',
        highlights:  'Implemented location coordinates sorting algorithms to fetch and rank nearby locations.',
        tech:        ['Flutter', 'Dart'],
        icon:        'fa-location-crosshairs',
        color:       '#8b5cf6',
        category:    'office',
        type:        'Flutter Project'
      },
      {
        name:        'Pabo Kothay',
        description: 'A discovery and advertising platform helper for small businesses to showcase services to nearby tourists.',
        highlights:  'Implemented local business advertising channels and location discovery utilizing Firebase Realtime Database.',
        tech:        ['Java', 'Firebase', 'Android SDK'],
        icon:        'fa-map-location-dot',
        color:       '#ec4899',
        category:    'personal',
        type:        'Android App'
      },
      {
        name:        'Flour to Pastry',
        description: 'A responsive web storefront and ordering application modeled on a real-life online cake shop.',
        highlights:  'Developed responsive e-commerce storefront views, database schema, and product catalogs.',
        tech:        ['PHP', 'HTML', 'CSS', 'MySQL'],
        icon:        'fa-cake-candles',
        color:       '#f97316',
        category:    'personal',
        type:        'Web Project'
      },
      {
        name:        'Get Fund',
        description: 'A business pitch and crowdfunding platform for entrepreneurs to showcase plans and secure investment.',
        highlights:  'Designed interactive pitch presentation pages and dashboard features for funding goal tracking.',
        tech:        ['C#', '.NET MVC', 'Microsoft SQL Server'],
        icon:        'fa-sack-dollar',
        color:       '#6366f1',
        category:    'personal',
        type:        'Web Project'
      },
      // {
      //   name:        'Racer App',
      //   description: 'A multipurpose utility application featuring project development shortcuts and feature dashboards.',
      //   highlights:  'Built integration helpers and dashboard components connected to REST APIs.',
      //   tech:        ['Flutter', 'Dart', 'REST API'],
      //   icon:        'fa-gauge-high',
      //   color:       '#14b8a6',
      //   category:    'personal',
      //   type:        'Flutter App'
      // },
      // {
      //   name:        'TechyGo',
      //   description: 'An e-commerce gadget shopping portal designed to showcase and promote curated Amazon products.',
      //   highlights:  'Built responsive product catalog pages and navigation structure utilizing modern rendering tech.',
      //   tech:        ['Node.js', 'Next.js'],
      //   icon:        'fa-laptop',
      //   color:       '#3b82f6',
      //   category:    'personal',
      //   type:        'Web Project'
      // },
      {
        name:        'Reckless Seas',
        description: 'A boat game implementing a simulated pseudo-3D visual perspective utilizing 2D visual models.',
        highlights:  'Developed game physics, rendering structures, and entity-handling engines.',
        tech:        ['C++'],
        icon:        'fa-ship',
        color:       '#ef4444',
        category:    'personal',
        type:        'Game Project',
        youtube:     'https://www.youtube.com/watch?v=BuX1QRPwhjU'
      },
      {
        name:        'School Management System',
        description: 'An upgraded administrative platform for teachers and students to manage academic schedules and progress.',
        highlights:  'Designed data tables and relationship structures for courses, grades, and enrollments.',
        tech:        ['Java', 'Microsoft SQL Server'],
        icon:        'fa-graduation-cap',
        color:       '#8b5cf6',
        category:    'personal',
        type:        'Software Project'
      }
    ];
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
        abstract: 'Leverages machine learning to classify traditional Bengali dishes and automatically estimate calorie values from visual inputs.'
      },
      {
        title:    'A Deep Learning Approach to Analyze the Relationship Between Gender, Height, Weight, and BMR from Face Images',
        venue:    'IEEE',
        year:     '2025',
        authors:  'Shykul Islam Siam, S. A. H. Chowdhury, Nafi Ahmed & Swapneel Biswas',
        icon:     'fa-microchip',
        color:    '#06b6d4',
        abstract: 'Uses CNNs and deep learning models to predict metabolic attributes (BMR, weight, height, gender) directly from facial features.'
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
