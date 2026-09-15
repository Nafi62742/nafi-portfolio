\documentclass[a4paper,8pt]{article}

\usepackage{parskip}
\usepackage{hologo}
\usepackage{fontspec}

%other packages for formatting
\RequirePackage{color}
\RequirePackage{graphicx}
\usepackage[usenames,dvipsnames]{xcolor}
\usepackage[scale=0.92, top=.35in, bottom=.35in]{geometry}

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
\titleformat{\section}{\large\scshape\raggedright}{}{0em}{}[\titlerule]
\titlespacing{\section}{0pt}{2pt}{2pt}

%for publications
\usepackage[style=authoryear,sorting=ynt, maxbibnames=2]{biblatex}

%Setup hyperref package, and colours for links
\usepackage[unicode, draft=false]{hyperref}
\color[HTML]{110223}%{1C033C}
\addbibresource{citations.bib}
\setlength\bibitemsep{0.5em}

%for social icons
\usepackage{fontawesome5}

% For underline
\usepackage[normalem]{ulem}

\setmainfont{Arial} % Set it to whatever you like

\begin{document}

% non-numbered pages
\pagestyle{empty}

\begin{tabularx}{\linewidth}{@{} C @{}}
\color[HTML]{1C033C} \Huge{Nafi Ahmed} \\[3pt]
\color[HTML]{371e77} \textbf{\normalsize{Software Engineer \textbar\ 5+ Years Experience \textbar\ AI-Assisted Engineering (Claude Specialist)}} \\[3pt]
\textcolor[HTML]{371e77}{{{\faEnvelope} nafiahmed318@gmail.com} $|$ {{\faMobile} +8801760887297} $|$ \href{https://github.com/Nafi62742}{\faGithub\ github.com/Nafi62742} $|$ \href{https://linkedin.com/in/nafi327444}{\faLinkedin\ linkedin.com/in/nafi327444} $|$ \href{https://nafi-ahmed.vercel.app}{\faGlobe\ nafi-ahmed.vercel.app}}
\end{tabularx}

\vspace{-4pt}
\section{Skills}
\color[HTML]{1C033C}\textbf{Languages:} TypeScript, JavaScript, Python, Dart, PHP, SQL, NoSQL, Java, C/C++\\[1.5pt]
\color[HTML]{1C033C}\textbf{Frameworks \& Cloud:} Angular, Flutter, Laravel, AWS (EC2, S3, DynamoDB, Lambda, SQS, SNS), Docker, Firebase, REST APIs\\[1.5pt]
\color[HTML]{1C033C}\textbf{AI Tools \& Developer Acceleration:} Claude (Claude Code, Anthropic API, Advanced Prompting), Cursor, GitHub Copilot, ChatGPT, LLM Architectures, Rapid Prototyping \& Automated Testing\\[1.5pt]

\vspace{-4pt}
\section{Work Experience}

\begin{tabularx}{\linewidth}{ @{}l r@{} }
\color[HTML]{371e77}\textbf{\textit{Software Developer}} \hfill \color[HTML]{371e77} Aug 2023 - Present \\[2pt]
\textbf{{XORGeek, Bangladesh}} \hfill \\[3pt]
\begin{minipage}[t]{\linewidth}
\begin{itemize}[nosep,after=\strut, leftmargin=1.5em, itemsep=1.5pt]
\item Architected and developed scalable web and mobile applications using Angular, Flutter, and AWS cloud infrastructure.
\item Championed AI-assisted development, heavily utilizing \textbf{Claude} (Claude Code, Anthropic API, prompt chaining) for architectural planning, rapid feature implementation, automated unit testing, and complex code refactoring.
\item Designed, optimized, and integrated high-throughput REST APIs and scalable SQL/NoSQL databases for production systems.
\item Led engineering on key client products including Pet Auction App, Izumi Car Repair Management, and Ginsen Form Management.
\end{itemize}
\end{minipage}
\end{tabularx}

\vspace{1pt}

\begin{tabularx}{\linewidth}{ @{}l r@{} }
\color[HTML]{371e77}\textbf{\textit{Software Engineer}} \hfill \color[HTML]{371e77} Jan 2021 - Jul 2023 \\[2pt]
\textbf{{Software \& Application Development, Bangladesh}} \hfill \\[3pt]
\begin{minipage}[t]{\linewidth}
\begin{itemize}[nosep,after=\strut, leftmargin=1.5em, itemsep=1.5pt]
\item Developed cross-platform mobile apps with Flutter and engineered backend microservices and APIs with Laravel, PHP, and MySQL.
\item Integrated AI coding assistants (primarily Claude and Copilot) into daily workflows to optimize code quality and reduce debug cycle time by 40\%.
\item Collaborated with multidisciplinary teams to design relational schemas, optimize database queries, and deliver robust software solutions.
\end{itemize}
\end{minipage}
\end{tabularx}

\vspace{-4pt}
% Projects
\section{Featured Projects}
\begin{tabularx}{\linewidth}{ @{}l r@{} }
\begin{minipage}[t]{\linewidth}
\begin{itemize}[nosep,after=\strut, leftmargin=1.5em, itemsep=2.5pt]

\item \textbf{Pet Auction App:} Designed real-time bidding architecture, synchronized live auction data streams using AWS and NoSQL, and developed Angular web and Flutter mobile interfaces utilizing Claude for rapid state-management scaffolding. \\
\textit{Technologies: Angular, Flutter, Dart, AWS, NoSQL, Firebase, Claude}

\item \textbf{KEIAI Order App:} Streamlined order processing and client-server communication by designing REST APIs, managing complex order data flows, and integrating structured backend SQL databases. \\
\textit{Technologies: Flutter, Laravel, AWS, MySQL}

\end{itemize}
\end{minipage}
\end{tabularx}

\vspace{-4pt}
% Thesis & Publications
\section{Thesis \& Publications}
\begin{tabularx}{\linewidth}{ @{}l r@{} }
\begin{minipage}[t]{\linewidth}
\begin{itemize}[nosep, after=\strut, leftmargin=1.5em, itemsep=1.5pt]
\item \textbf{Traditional Bengali Food Classification and Calorie Measurement Using Machine Learning} — \textit{JSTR, BOU}, \textbf{2025}.
\item \textbf{A Deep Learning Approach to Analyze the Relationship Between Gender, Height, Weight, and BMR from Face Images} — \textit{IEEE}, \textbf{2025}.
\end{itemize}
\end{minipage}
\end{tabularx}

\vspace{-4pt}
% Education
\section{Education}
\begin{tabularx}{\linewidth}{ @{}l r@{} }
\color[HTML]{1C033C} \textbf{Ahsanullah University of Science and Technology, Dhaka} & \hfill \color[HTML]{371e77} 2018 - 2023 \\
\color[HTML]{371e77} B.Sc. in Computer Science and Engineering & \hfill \color[HTML]{4B28A4} \textit{\textbf{CGPA: 3.208/4.00}} \\
\multicolumn{2}{@{}X@{}}{Coursework: Data Structures \& Algorithms, OOP, Database Systems, OS, Software Engineering, API Development}
\end{tabularx}

\vspace{-4pt}
% Leadership and Volunteering
\section{Leadership \& Involvement}
\begin{tabularx}{\linewidth}{ @{}l r@{} }
\begin{minipage}[t]{\linewidth}
\begin{itemize}[nosep,after=\strut, leftmargin=1.5em, itemsep=1.5pt]
\item \textbf{Program Organizer, AUST CSE Society (Jan 2022 – Jul 2022):} Organized technical workshops and academic events.
\item \textbf{General Member, AUST Innovation and Design Club (Jan 2019 – May 2022):} Contributed to design challenges and hackathons.
\end{itemize}
\end{minipage}
\end{tabularx}

\end{document}

