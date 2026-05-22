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
        name:        'Pet Auction App',
        description: 'Cross-platform pet auction platform with real-time bidding, user listings, and live bid management.',
        highlights:  'Designed optimized database architecture for real-time bids. Built web UI in Angular and mobile app in Flutter.',
        tech:        ['Angular', 'Flutter', 'AWS', 'DynamoDB', 'Firebase'],
        icon:        'fa-paw',
        color:       '#6366f1'
      },
      {
        name:        'KEIAI Order App',
        description: 'Client-facing mobile app for ordering prosthetic products with streamlined catalog and order management.',
        highlights:  'Managed complex order data flows with REST API integration and SQL-backed product catalogs.',
        tech:        ['Flutter', 'Laravel', 'AWS', 'MySQL'],
        icon:        'fa-cart-shopping',
        color:       '#06b6d4'
      },
      {
        name:        'Izumi (Car Repair & Delivery)',
        description: 'Operational management platform for car repair tracking, delivery status, and service workflows.',
        highlights:  'Created workflow dashboards to aggregate operational data and improve visibility.',
        tech:        ['Angular', 'AWS', 'SQL'],
        icon:        'fa-car',
        color:       '#10b981'
      },
      {
        name:        'Ginsen Form Management',
        description: 'Dynamic, scalable form management system with flexible user-defined data inputs and pipelines.',
        highlights:  'Built AWS-backed data ingestion system for dynamic form processing and storage.',
        tech:        ['HTML5', 'Angular', 'AWS', 'JSON'],
        icon:        'fa-file-alt',
        color:       '#f59e0b'
      },
      {
        name:        'Pabo Kothay Android App',
        description: 'Mobile app helping local small businesses advertise their services to nearby tourists.',
        highlights:  'Built local discovery features with Firebase real-time database.',
        tech:        ['Flutter', 'Dart', 'Firebase'],
        icon:        'fa-map-location-dot',
        color:       '#ec4899'
      },
      {
        name:        'Get Fund Web Project',
        description: 'Crowdfunding platform for entrepreneurs to showcase business plans and attract investors.',
        highlights:  'Designed dashboard elements for pitch presentations and funding target tracking.',
        tech:        ['Angular', 'AWS'],
        icon:        'fa-sack-dollar',
        color:       '#8b5cf6'
      },
      {
        name:        'Flour to Pastry',
        description: 'Online store and web application built for a real-life bakery shop with product showcase.',
        highlights:  'Developed responsive storefront pages and basic cart functionality.',
        tech:        ['HTML', 'CSS', 'PHP', 'MySQL'],
        icon:        'fa-cake-candles',
        color:       '#f97316'
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
