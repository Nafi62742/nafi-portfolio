\documentclass[a4paper,8pt]{article}

\usepackage{parskip}
\usepackage{hologo}
\usepackage{fontspec}

%other packages for formatting
\RequirePackage{color}
\RequirePackage{graphicx}
\usepackage[usenames,dvipsnames]{xcolor}
\usepackage[scale=0.9, top=.4in, bottom=.4in]{geometry}

%tabularx environment
\usepackage{tabularx}

%for lists within experience section
\usepackage{enumitem}

% centered version of 'X' col. type
\newcolumntype{C}{>{\centering\arraybackslash}X}

%to prevent spillover of tabular into next pages
\usepackage{supertabular}
\usepackage{tabularx}
\newlength{\fullcollw}
\setlength{\fullcollw}{0.42\textwidth}

%custom \section
\usepackage{titlesec}
\usepackage{multicol}
\usepackage{multirow}

%CV Sections inspired by:
%http://stefano.italians.nl/archives/26
\titleformat{\section}{\Large\scshape\raggedright}{}{0em}{}[\titlerule]
\titlespacing{\section}{1pt}{2pt}{2pt}

%for publications
\usepackage[style=authoryear,sorting=ynt, maxbibnames=2]{biblatex}

%Setup hyperref package, and colours for links
\usepackage[unicode, draft=false]{hyperref}
\color[HTML]{110223}%{1C033C}
\addbibresource{citations.bib}
\setlength\bibitemsep{1em}

%for social icons
\usepackage{fontawesome5}
% \usepackage{times}

% For underline
\usepackage[normalem]{ulem}

\setmainfont{Arial} % Set it to whatever you like

\begin{document}

% non-numbered pages
\pagestyle{empty}

\begin{tabularx}{\linewidth}{@{} C @{}}
\color[HTML]{1C033C} \Huge{Nafi Ahmed} \\[6pt]
\\
\textcolor[HTML]{371e77}{{{{\faEnvelope} nafiahmed318@gmail.com}} $|$}
\textcolor[HTML]{371e77}{{{\faMobile} +8801760887297}}

\textcolor[HTML]{371e77}{\underline{{\raisebox{-0.05\height}{\faGithub} github.com/Nafi62742}} $|$}
\textcolor[HTML]{371e77}{\underline{{\raisebox{-0.05\height}{\faLinkedin} linkedin.com/in/racer007}} $|$}
\textcolor[HTML]{371e77}{\underline{{\raisebox{-0.05\height}{\faGlobe} nafi-ahmed.vercel.app}}}
\end{tabularx}

\section{Skills}
\color[HTML]{1C033C}\textbf{Languages:} C/C++, Java, Python, JavaScript, TypeScript, SQL, NoSQL\\[3pt]
\color[HTML]{1C033C}\textbf{Technologies \& Tools:} AWS, EC2, DynamoDB, S3, SQS, SNS, Route53 Lambda, Docker, Flutter, Angular, Laravel \\[2pt]

\section{Work Experience}

\begin{tabularx}{\linewidth}{ @{}l r@{} }
\color[HTML]{371e77}\textbf{\textit{Software Developer}} \hfill \color[HTML]{371e77} Aug 2023 - Present \\[4pt]
\textbf{{XORGeek, Bangladesh}} \hfill \\[5pt]
\begin{minipage}[t]{\linewidth}
\begin{itemize}[nosep,after=\strut, leftmargin=2em, itemsep=2pt]
\item Developed and maintained scalable applications using Angular and AWS.
\item Worked on projects including Pet Auction App, Izumi Car Repair Management, and Ginsen Form Management system.
\item Built and contributed to mobile applications using Flutter and Firebase.
\item Designed and integrated REST APIs with a focus on performance and scalability.
\item Technologies: TypeScript, Angular, Flutter, AWS, Firebase, SQL, NoSQL, HTML, CSS.
\end{itemize}
\end{minipage}
\end{tabularx}

\vspace{3pt}

\begin{tabularx}{\linewidth}{ @{}l r@{} }
\color[HTML]{371e77}\textbf{\textit{Software Development Intern}} \hfill \color[HTML]{371e77} Jun 2023 - Jul 2023 \\[4pt]
\textbf{{XORGeek, Bangladesh}} \hfill \\[5pt]
\begin{minipage}[t]{\linewidth}
\begin{itemize}[nosep,after=\strut, leftmargin=2em, itemsep=2pt]
\item Learned and worked with Flutter and Laravel stack for mobile and backend development.
\item Assisted in building basic features and understanding application architecture and API integration.
\item Technologies: Flutter, Dart, Laravel, PHP, MySQL.
\end{itemize}
\end{minipage}
\end{tabularx}

% Projects
\section{Project Work}
\begin{tabularx}{\linewidth}{ @{}l r@{} }
\begin{minipage}[t]{\linewidth}
\begin{itemize}[nosep,after=\strut, leftmargin=2em, itemsep=4pt]

\item \textbf{Pet Auction App:} Designed the database architecture for real-time bidding, synchronized live auction data streams using AWS and NoSQL, and developed the Angular web and Flutter mobile client interfaces. \\
\textit{Technologies: Angular, Flutter, Dart, AWS, NoSQL, Firebase}

\item \textbf{KEIAI Order App:} Streamlined order processing and client-server communication by designing REST APIs, managing complex order data flows, and integrating structured backend SQL databases. \\
\textit{Technologies: Flutter, Laravel, AWS, MySQL}

\item \textbf{Izumi Web Project:} Created core operational workflow systems and implemented tracking dashboards using Angular to aggregate repair status data and enhance operational visibility. \\
\textit{Technologies: Angular, AWS, SQL}

\item \textbf{Ginsen Web Project:} Engineered a dynamic data ingestion pipeline using AWS backend services and JSON processing to support custom, user-defined form layouts and submissions. \\
\textit{Technologies: HTML5, AWS, JSON}

\end{itemize}
\end{minipage}
\end{tabularx}\\[2pt]

% Thesis & Publications
\section{Thesis \& Publications}
\begin{tabularx}{\linewidth}{ @{}l r@{} }
\begin{minipage}[t]{\linewidth}
\begin{itemize}[nosep, after=\strut, leftmargin=2em, itemsep=2pt]
\item \textbf{Traditional Bengali Food Classification and Calorie Measurement Using Machine Learning} — Published in \textit{Journal of Scientific and Technological Research (JSTR)}, Bangladesh Open University (BOU), \textbf{2025}.
\item \textbf{A Deep Learning Approach to Analyze the Relationship Between Gender, Height, Weight, and Basal Metabolic Rate from Face Images} — S. Islam Siam, S. A. H. Chowdhury, Nafi Ahmed \& Swapneel Biswas. Published by \textit{IEEE}, \textbf{2025}.
\end{itemize}
\end{minipage}
\end{tabularx}

\vspace{2pt} % ← clean gap between sections

% Education
\section{Education}
\begin{tabularx}{\linewidth}{ @{}l r@{} }
\color[HTML]{1C033C} \textbf{Ahsanullah University of Science and Technology, Dhaka} & \hfill \color[HTML]{371e77} 2018 - 2023 \\
\color[HTML]{371e77} B.Sc. in Computer Science and Engineering & \hfill \color[HTML]{4B28A4} \textit{\textbf{CGPA: 3.208/4.00}} \\
\multicolumn{2}{@{}X@{}}{Relevant Coursework: Data Structures and Algorithms, Object Oriented Programming, Database Systems, Operating Systems, Computer Networks, Software Engineering, Design Patterns, API Development, Advanced HTML/CSS}
\\\\[2pt]

\end{tabularx}\\[2pt]

% Leadership and Volunteering
\section{Leadership and Involvement}
\begin{tabularx}{\linewidth}{ @{}l r@{} }
\begin{minipage}[t]{\linewidth}
\begin{itemize}[nosep,after=\strut, leftmargin=2em, itemsep=2pt]
\item \textbf{Program Organizer, AUST CSE Society (Jan 2022 – Jul 2022):} Organized departmental programs, workshops, and technical events for CSE students.
\item \textbf{General Member, AUST Innovation and Design Club (Jan 2019 – May 2022):} Contributed to innovation challenges, design projects, and club activities.
\end{itemize}
\end{minipage}
\end{tabularx}

\end{document}
