const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  ShadingType,
  HeadingLevel,
  ExternalHyperlink
} = require('docx');

async function generateBiodataDocx() {
  const primaryFont = 'Calibri';
  const tableHeaderBg = 'E8EEF5';
  const labelBg = 'F4F6F9';
  const borderColor = 'B0C4DE';
  const accentColor = '1B365D';

  const thinBorder = {
    top: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
    left: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
    right: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
  };

  const noOuterLeftRightBorder = {
    top: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
    left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  };

  function sectionHeading(title) {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 120 },
      children: [
        new TextRun({
          text: title,
          bold: true,
          font: primaryFont,
          size: 24, // 12pt
          color: accentColor,
        }),
      ],
      border: {
        bottom: {
          color: accentColor,
          space: 4,
          style: BorderStyle.SINGLE,
          size: 12,
        },
      },
    });
  }

  function createTwoColTable(rowsData) {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      columnWidths: [3200, 6400],
      rows: rowsData.map(([label, value, isLink, url]) => {
        let valueContent = [];
        if (isLink) {
          valueContent = [
            new ExternalHyperlink({
              children: [
                new TextRun({
                  text: value,
                  font: primaryFont,
                  size: 20,
                  color: '0066CC',
                  underline: {},
                }),
              ],
              link: url || value,
            }),
          ];
        } else {
          valueContent = [
            new TextRun({
              text: value,
              font: primaryFont,
              size: 20,
              color: '1A1A1A',
            }),
          ];
        }

        return new TableRow({
          children: [
            new TableCell({
              width: { size: 33, type: WidthType.PERCENTAGE },
              shading: { fill: labelBg, type: ShadingType.CLEAR },
              borders: thinBorder,
              margins: { top: 100, bottom: 100, left: 140, right: 140 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: label,
                      bold: true,
                      font: primaryFont,
                      size: 20,
                      color: '2C3E50',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 67, type: WidthType.PERCENTAGE },
              borders: thinBorder,
              margins: { top: 100, bottom: 100, left: 140, right: 140 },
              children: [
                new Paragraph({
                  children: valueContent,
                }),
              ],
            }),
          ],
        });
      }),
    });
  }

  function createMultiColTable(headers, rowsData, widths) {
    const headerRow = new TableRow({
      tableHeader: true,
      children: headers.map((h, i) => new TableCell({
        width: { size: widths[i], type: WidthType.PERCENTAGE },
        shading: { fill: tableHeaderBg, type: ShadingType.CLEAR },
        borders: thinBorder,
        margins: { top: 120, bottom: 120, left: 120, right: 120 },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: h,
                bold: true,
                font: primaryFont,
                size: 20,
                color: accentColor,
              }),
            ],
          }),
        ],
      })),
    });

    const dataRows = rowsData.map(row => new TableRow({
      children: row.map((cellText, i) => new TableCell({
        width: { size: widths[i], type: WidthType.PERCENTAGE },
        borders: thinBorder,
        margins: { top: 90, bottom: 90, left: 120, right: 120 },
        children: [
          new Paragraph({
            alignment: i === 0 ? AlignmentType.LEFT : AlignmentType.CENTER,
            children: [
              new TextRun({
                text: cellText,
                font: primaryFont,
                size: 19,
                bold: i === 0 || i === 4,
                color: '1A1A1A',
              }),
            ],
          }),
        ],
      })),
    }));

    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [headerRow, ...dataRows],
    });
  }

  function bulletItem(boldPrefix, text) {
    return new Paragraph({
      bullet: { level: 0 },
      spacing: { before: 60, after: 60 },
      children: [
        new TextRun({
          text: boldPrefix + ': ',
          bold: true,
          font: primaryFont,
          size: 21,
          color: '2C3E50',
        }),
        new TextRun({
          text: text,
          font: primaryFont,
          size: 21,
          color: '222222',
        }),
      ],
    });
  }

  function calloutBox(title, items) {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 100, type: WidthType.PERCENTAGE },
              shading: { fill: 'F0F4F8', type: ShadingType.CLEAR },
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                left: { style: BorderStyle.SINGLE, size: 24, color: accentColor },
                right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
              },
              margins: { top: 100, bottom: 100, left: 160, right: 140 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: title,
                      bold: true,
                      font: primaryFont,
                      size: 20,
                      color: accentColor,
                    }),
                  ],
                }),
                ...items.map(item => new Paragraph({
                  spacing: { before: 40, after: 40 },
                  children: [
                    new TextRun({
                      text: `•  ${item}`,
                      font: primaryFont,
                      size: 19,
                      color: '333333',
                    }),
                  ],
                })),
              ],
            }),
          ],
        }),
      ],
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,    // 0.5 inch
              right: 864,  // 0.6 inch
              bottom: 720, // 0.5 inch
              left: 864,   // 0.6 inch
            },
          },
        },
        children: [
          // BISMILLAH
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 60 },
            children: [
              new TextRun({
                text: '﷽',
                bold: true,
                font: 'Traditional Arabic',
                size: 32,
                color: accentColor,
              }),
            ],
          }),

          // MAIN TITLE
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 40 },
            children: [
              new TextRun({
                text: 'BIODATA FOR MARRIAGE / MATRIMONIAL PROFILE',
                bold: true,
                font: primaryFont,
                size: 28, // 14pt
                color: accentColor,
              }),
            ],
          }),

          // SUBTITLE
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 180 },
            children: [
              new TextRun({
                text: '(পাত্রের জীবনবৃত্তান্ত)',
                bold: true,
                font: primaryFont,
                size: 22, // 11pt
                color: '4A5568',
              }),
            ],
          }),

          // 1. Personal & Physical Overview
          sectionHeading('1. Personal & Physical Overview (ব্যক্তিগত ও শারীরিক বিবরণ)'),
          createTwoColTable([
            ['Full Name (পূর্ণ নাম)', 'Nafi Ahmed (নাফি আহমেদ)'],
            ['Marital Status (বৈবাহিক অবস্থা)', 'Unmarried / Never Married (অবিবাহিত)'],
            ['Date of Birth / Age (জন্ম তারিখ / বয়স)', '[e.g., 1998 / 1999 — ~26–27 Years] (Please specify exact date)'],
            ['Height (উচ্চতা)', '6 ft 0 in (183 cm)'],
            ['Weight (ওজন)', '88 kg'],
            ['Complexion (গায়ের রং)', '[e.g., Fair / Medium-Fair / শ্যামবর্ণ / উজ্জ্বল শ্যামবর্ণ]'],
            ['Blood Group (রক্তের গ্রুপ)', '[e.g., O+ / A+ / B+ / AB+]'],
            ['Religion (ধর্ম)', 'Islam (Sunni)'],
            ['Nationality (জাতীয়তা)', 'Bangladeshi (By Birth)'],
            ['National ID / Passport', 'Available'],
          ]),

          // 2. Religious & Lifestyle Practices
          sectionHeading('2. Religious & Lifestyle Practices (ধর্মীয় ও জীবনধারা)'),
          createTwoColTable([
            ['Salah / Prayer (নামাজ)', 'Performs daily Salah regularly, strives to maintain punctuality in prayers.'],
            ['Islamic Values (ইসলামিক অনুশাসন)', 'Committed to maintaining Halal income, respectful Islamic values, and modesty.'],
            ['Diet & Habits (খাদ্যাভ্যাস ও অভ্যাস)', '100% Halal food, Non-smoker, Teetotaler (No bad habits).'],
            ['Lifestyle & Interests (জীবনধারা ও শখ)', 'Software & Tech Innovation, Reading, Fitness, Traveling, Spending quality time with family.'],
          ]),

          // 3. Educational Qualifications
          sectionHeading('3. Educational Qualifications (শিক্ষাগত যোগ্যতা)'),
          createMultiColTable(
            ['Degree / Exam', 'Institution', 'Board / Univ.', 'Year', 'Result / CGPA'],
            [
              [
                'B.Sc. in Computer Science & Engineering (CSE)',
                'Ahsanullah University of Science and Technology (AUST), Dhaka',
                'AUST',
                '2018 – 2023',
                'CGPA: 3.208 / 4.00',
              ],
              [
                'Higher Secondary Certificate (HSC) — Science',
                'Dhaka City College, Dhaka',
                'Dhaka Board',
                '2018',
                'GPA: 4.88 / 5.00',
              ],
              [
                'Secondary School Certificate (SSC) — Science',
                'Monipur High School and College, Mirpur, Dhaka',
                'Dhaka Board',
                '2016',
                'GPA: 5.00 / 5.00',
              ],
            ],
            [30, 32, 14, 12, 12]
          ),
          new Paragraph({ spacing: { before: 80 } }),
          calloutBox('Academic Highlights:', [
            'Solid foundation from top-tier institutions in Dhaka (Monipur High School, Dhaka City College, and AUST).',
            'Core specialization in Software Engineering, Algorithms, and Cloud Systems.',
          ]),

          // 4. Professional & Career Details
          sectionHeading('4. Professional & Career Details (পেশাগত বিবরণ)'),
          createTwoColTable([
            ['Profession (পেশা)', 'Software Developer & Data Specialist (ফুল-স্ট্যাক সফটওয়্যার ইঞ্জিনিয়ার)'],
            ['Current Company (বর্তমান প্রতিষ্ঠান)', 'XORGeek, Bangladesh (Reputed Software & Technology Firm)'],
            ['Designation (পদবী)', 'Software Developer (August 2023 – Present)'],
            ['Previous Experience', 'Software Development Intern at XORGeek (June 2023 – July 2023)'],
            ['Key Technical Expertise', 'Mobile Apps (Flutter), Web Apps (Angular), Cloud Architecture (AWS), Backend APIs (Node.js/Laravel/Python), Databases (SQL/NoSQL)'],
            ['Research & Publications', 'Published Researcher with peer-reviewed scientific papers in IEEE, JSTR (BOU), and international journals.'],
            ['Professional Portfolio', 'https://nafi-ahmed.vercel.app', true, 'https://nafi-ahmed.vercel.app'],
            ['LinkedIn Profile', 'https://linkedin.com/in/racer007', true, 'https://linkedin.com/in/racer007'],
            ['GitHub Profile', 'https://github.com/Nafi62742', true, 'https://github.com/Nafi62742'],
          ]),

          // 5. Family Background
          sectionHeading('5. Family Background (পারিবারিক বিবরণ)'),
          new Paragraph({
            spacing: { before: 40, after: 100 },
            children: [
              new TextRun({
                text: 'We belong to an educated, respectable, and cultured Muslim family.',
                italics: true,
                font: primaryFont,
                size: 20,
                color: '4A5568',
              }),
            ],
          }),
          createTwoColTable([
            ['Father (পিতা)', '[Father\'s Full Name] — [e.g., Businessman / Govt. Officer / Private Sector Executive / Retired]'],
            ['Mother (মাতা)', '[Mother\'s Full Name] — [e.g., Homemaker (গৃহিণী) / Profession]'],
            ['Brother(s) (ভাই)', '[Name(s) / Count] — [e.g., Younger/Elder Brother — Education / Profession]'],
            ['Sister(s) (বোন)', '[Name(s) / Count] — [e.g., Younger/Elder Sister — Education / Profession / Married to ...]'],
            ['Native / Ancestral Home (স্থায়ী জেলা)', '[e.g., Dhaka / Specific District, Bangladesh]'],
            ['Family Values (পারিবারিক মূল্যবোধ)', 'Religious, modern yet rooted in Islamic traditions, peaceful, and close-knit.'],
          ]),

          // 6. Address & Residence
          sectionHeading('6. Address & Residence (ঠিকানা ও বাসস্থান)'),
          bulletItem('Present Address (বর্তমান ঠিকানা)', 'Dhaka, Bangladesh'),
          bulletItem('Permanent Address (স্থায়ী ঠিকানা)', 'Dhaka, Bangladesh (or ancestral home address)'),
          bulletItem('Accommodation Type (বাসস্থানের ধরন)', '[Own House / Apartment / Rented in Dhaka]'),

          // 7. Partner Preferences / Expectations
          sectionHeading('7. Partner Preferences / Expectations (জীবনসঙ্গিনী সম্পর্কিত প্রত্যাশা)'),
          bulletItem('Religious Commitment (ধর্মীয় মূল্যবোধ)', 'Practicing Muslimah who values Islamic principles, performs regular Salah, and observes modesty/Purdah.'),
          bulletItem('Education (শিক্ষাগত যোগ্যতা)', 'Minimum Graduate / Bachelor\'s degree (or currently studying in Graduation) from a reputed university.'),
          bulletItem('Character & Mindset (চরিত্র ও মননশীলতা)', 'Well-mannered, understanding, supportive, good-natured, and respects family values.'),
          bulletItem('Location & District (এলাকা)', 'Preferably from Dhaka or surrounding districts (flexible for a good match).'),
          bulletItem('Age Preference (বয়সসীমা)', '[e.g., 20 – 25 years]'),
          bulletItem('Height Preference (উচ্চতা)', '[e.g., 5 ft 1 in to 5 ft 6 in]'),

          // 8. Contact Information & Guardian Details
          sectionHeading('8. Contact Information & Guardian Details (যোগাযোগের ঠিকানা)'),
          createMultiColTable(
            ['Contact Person', 'Relation', 'Phone Number', 'Email Address'],
            [
              ['Guardian / Parent (অভিভাবক)', '[Father / Elder Relative]', '[+8801XXXXXXXXX]', '[guardian-email@example.com]'],
              ['Candidate (পাত্র)', 'Nafi Ahmed', '+8801760887297', 'nafiahmed318@gmail.com'],
            ],
            [30, 25, 22, 23]
          ),

          new Paragraph({ spacing: { before: 140 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 60 },
            children: [
              new TextRun({
                text: 'Note: For further queries, verification, or formal discussion, respected guardians/families are warmly requested to contact via phone call.',
                italics: true,
                font: primaryFont,
                size: 19,
                color: '4A5568',
              }),
            ],
          }),
        ],
      },
    ],
  });

  const outDocxPath = path.resolve(__dirname, '../bio/biodata.docx');
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outDocxPath, buffer);
  console.log(`✅ Word document successfully generated at: ${outDocxPath}`);

  // Also create a copy as .doc for backwards compatibility if needed
  const outDocPath = path.resolve(__dirname, '../bio/biodata.doc');
  fs.writeFileSync(outDocPath, buffer);
  console.log(`✅ Word .doc copy generated at: ${outDocPath}`);
}

generateBiodataDocx().catch(err => {
  console.error('Error generating docx:', err);
  process.exit(1);
});
