const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
  ExternalHyperlink
} = require('docx');

async function generateBiodataDocx() {
  const primaryFont = 'Calibri';
  const accentColor = '1E3A8A'; // Deep navy blue
  const textColor = '222222';
  const labelColor = '1E293B';
  const subtextColor = '475569';

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
          size: 10,
        },
      },
    });
  }

  function fieldItem(label, value, options = {}) {
    const runs = [
      new TextRun({
        text: `•  ${label}: `,
        bold: true,
        font: primaryFont,
        size: 21,
        color: labelColor,
      }),
    ];

    if (options.isLink) {
      runs.push(
        new ExternalHyperlink({
          children: [
            new TextRun({
              text: value,
              font: primaryFont,
              size: 21,
              color: '0366D6',
              underline: {},
            }),
          ],
          link: options.url || value,
        })
      );
    } else {
      runs.push(
        new TextRun({
          text: value,
          font: primaryFont,
          size: 21,
          color: textColor,
        })
      );
    }

    return new Paragraph({
      spacing: { before: 40, after: 40 },
      children: runs,
    });
  }

  function subItem(bulletText, text) {
    return new Paragraph({
      indent: { left: 400 },
      spacing: { before: 20, after: 20 },
      children: [
        new TextRun({
          text: `–  ${bulletText}: `,
          bold: true,
          font: primaryFont,
          size: 20,
          color: '334155',
        }),
        new TextRun({
          text: text,
          font: primaryFont,
          size: 20,
          color: textColor,
        }),
      ],
    });
  }

  function eduBlock(degree, institution, details) {
    return [
      new Paragraph({
        spacing: { before: 80, after: 20 },
        children: [
          new TextRun({
            text: `•  ${degree}`,
            bold: true,
            font: primaryFont,
            size: 21,
            color: labelColor,
          }),
        ],
      }),
      new Paragraph({
        indent: { left: 360 },
        spacing: { before: 0, after: 60 },
        children: [
          new TextRun({
            text: `${institution}  |  ${details}`,
            font: primaryFont,
            size: 20,
            color: subtextColor,
          }),
        ],
      }),
    ];
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,    // 0.5 in
              right: 864,  // 0.6 in
              bottom: 720, // 0.5 in
              left: 864,   // 0.6 in
            },
          },
        },
        children: [
          // INVOCATION
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 40 },
            children: [
              new TextRun({
                text: 'In the Name of Allah, the Most Gracious, the Most Merciful',
                italics: true,
                font: primaryFont,
                size: 20,
                color: accentColor,
              }),
            ],
          }),

          // MAIN TITLE
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 30 },
            children: [
              new TextRun({
                text: 'MATRIMONIAL BIODATA',
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
                text: 'Candidate Profile & Detailed Family Background',
                font: primaryFont,
                size: 21,
                color: subtextColor,
              }),
            ],
          }),

          // 1. Personal & Physical Overview
          sectionHeading('1. Personal & Physical Overview'),
          fieldItem('Full Name', 'Nafi Ahmed'),
          fieldItem('Date of Birth & Age', '[e.g., 28 October 1998 — ~26 Years] (Please specify exact date of birth)'),
          fieldItem('Height & Weight', '6 ft 0 in (183 cm)  |  88 kg'),
          fieldItem('Complexion', '[e.g., Fair / Medium-Fair / Wheatish]'),
          fieldItem('Blood Group', '[e.g., O+ / A+ / B+ / AB+]'),
          fieldItem('Marital Status', 'Unmarried (Never Married)'),
          fieldItem('Religion & Practice', 'Islam (Sunni) — Performs regular 5 daily prayers, observes Islamic values and halal living'),
          fieldItem('Diet & Lifestyle', '100% Halal diet, Non-smoker, Teetotaler (Completely free from any bad habits)'),
          fieldItem('Hobbies & Interests', 'Software Engineering, Technology, Reading, Fitness, Traveling, and Family time'),
          fieldItem('Nationality', 'Bangladeshi (By Birth)'),

          // 2. Educational Qualifications
          sectionHeading('2. Educational Qualifications'),
          ...eduBlock(
            'Bachelor of Science in Computer Science & Engineering (B.Sc. in CSE)',
            'Ahsanullah University of Science and Technology (AUST), Dhaka',
            'Passing Year: 2023  |  CGPA: 3.208 / 4.00'
          ),
          ...eduBlock(
            'Higher Secondary Certificate (HSC) — Science Group',
            'Dhaka City College, Dhaka (Dhaka Board)',
            'Passing Year: 2018  |  GPA: 4.88 / 5.00'
          ),
          ...eduBlock(
            'Secondary School Certificate (SSC) — Science Group',
            'Monipur High School and College, Mirpur, Dhaka (Dhaka Board)',
            'Passing Year: 2016  |  GPA: 5.00 / 5.00'
          ),

          // 3. Professional Career & Technical Portfolio
          sectionHeading('3. Professional Career & Technical Portfolio'),
          fieldItem('Current Profession', 'Software Engineer & Full-Stack Developer'),
          fieldItem('Current Company', 'XORGeek, Bangladesh (August 2023 – Present)'),
          fieldItem('Previous Role', 'Software Development Intern at XORGeek (June 2023 – July 2023)'),
          fieldItem('Core Specializations', 'Mobile Apps (Flutter), Web Engineering (Angular/TypeScript), Cloud (AWS), Backend APIs & Databases'),
          fieldItem('Scientific Publications', 'Published Researcher with peer-reviewed research papers in IEEE and international journals'),
          fieldItem('Online Portfolio', 'https://nafi-ahmed.vercel.app', { isLink: true, url: 'https://nafi-ahmed.vercel.app' }),
          fieldItem('LinkedIn Profile', 'https://linkedin.com/in/racer007', { isLink: true, url: 'https://linkedin.com/in/racer007' }),
          fieldItem('GitHub Profile', 'https://github.com/Nafi62742', { isLink: true, url: 'https://github.com/Nafi62742' }),

          // 4. Immediate Family Details
          sectionHeading('4. Immediate Family Details'),
          fieldItem("Father's Name & Details", "[Father's Full Name] — [Profession / Designation / Business Name / Organization]"),
          fieldItem("Mother's Name & Details", "[Mother's Full Name] — [Homemaker / Profession]"),
          fieldItem('Brothers', '[Total: e.g., 1 Brother / Only Son] — [Brother Name, Age, Education (e.g., B.Sc in CSE), Profession/Designation, Location]'),
          fieldItem('Sisters', '[Total: e.g., 1 Sister / None] — [Sister Name, Education, Profession, Marital Status & Husband Details]'),
          fieldItem('Family Status & Values', 'Upper-Middle Class, educated, respectable, and practicing Sunni Muslim family'),

          // 5. Paternal Family Lineage (Father's Side)
          sectionHeading("5. Paternal Family Lineage (Father's Side)"),
          fieldItem('Paternal Grandfather (Dada)', '[Late / Respected Name] — [Profession / Title / Background]'),
          fieldItem('Paternal Grandmother (Dadi)', '[Late / Respected Name] — [Family Background / Lineage]'),
          fieldItem('Paternal Ancestral District', '[Village / Area, Upazila / Police Station, District — e.g., Dhaka / Cumilla / Noakhali / Sylhet]'),
          fieldItem('Paternal Uncles (Chacha)', ''),
          subItem('Uncle 1 (Eldest)', '[Name] — [Education] — [Profession / Designation & Organization] — [Residence: Dhaka / Abroad]'),
          subItem('Uncle 2', '[Name] — [Education] — [Profession / Designation & Organization] — [Residence: Dhaka / Abroad]'),
          subItem('Uncle 3', '[Name] — [Education] — [Profession / Designation & Organization] — [Residence: Dhaka / Abroad]'),
          fieldItem('Paternal Aunts (Fufu)', ''),
          subItem('Aunt 1 (Eldest)', "[Name] — [Husband's Name & Profession / Designation] — [Residence: Dhaka / Abroad]"),
          subItem('Aunt 2', "[Name] — [Husband's Name & Profession / Designation] — [Residence: Dhaka / Abroad]"),
          fieldItem('Notable Paternal Relatives', '[Any Doctors, Engineers, BCS / Govt. Officers, Military Officers, or Business Leaders in paternal family]'),

          // 6. Maternal Family Lineage (Mother's Side)
          sectionHeading("6. Maternal Family Lineage (Mother's Side)"),
          fieldItem('Maternal Grandfather (Nana)', '[Late / Respected Name] — [Profession / Title / Background]'),
          fieldItem('Maternal Grandmother (Nani)', '[Late / Respected Name] — [Family Background / Lineage]'),
          fieldItem('Maternal Ancestral District', '[Village / Area, Upazila / Police Station, District]'),
          fieldItem('Maternal Uncles (Mama)', ''),
          subItem('Uncle 1 (Eldest)', '[Name] — [Education] — [Profession / Designation & Organization] — [Residence: Dhaka / Abroad]'),
          subItem('Uncle 2', '[Name] — [Education] — [Profession / Designation & Organization] — [Residence: Dhaka / Abroad]'),
          subItem('Uncle 3', '[Name] — [Education] — [Profession / Designation & Organization] — [Residence: Dhaka / Abroad]'),
          fieldItem('Maternal Aunts (Khala)', ''),
          subItem('Aunt 1 (Eldest)', "[Name] — [Husband's Name & Profession / Designation] — [Residence: Dhaka / Abroad]"),
          subItem('Aunt 2', "[Name] — [Husband's Name & Profession / Designation] — [Residence: Dhaka / Abroad]"),
          fieldItem('Notable Maternal Relatives', '[Any Doctors, Engineers, BCS / Govt. Officers, University Professors, or Prominent Figures in maternal family]'),

          // 7. Address & Residence Details
          sectionHeading('7. Address & Residence Details'),
          fieldItem('Present Address', 'Dhaka, Bangladesh [e.g., House No., Road No., Area, Dhaka]'),
          fieldItem('Permanent Address', '[Ancestral Village / Area, Upazila / Police Station, District, Bangladesh]'),
          fieldItem('Residential Status', '[Own Family Residence / Apartment in Dhaka | Ancestral property details if applicable]'),

          // 8. Partner Expectations
          sectionHeading('8. Partner Expectations'),
          fieldItem('Religious Commitment', 'Practicing Muslimah who values Islamic principles, performs regular Salah, and observes modesty/Purdah'),
          fieldItem('Education', "Minimum Bachelor's degree / Graduate (or currently pursuing Graduation) from a reputed institution"),
          fieldItem('Personal Qualities', 'Well-mannered, understanding, supportive, good-natured, and family-oriented'),
          fieldItem('Age & Height Preference', 'Age: [e.g., 20 – 25 Years]  |  Height: [e.g., 5 ft 1 in – 5 ft 6 in]'),
          fieldItem('Location Preference', 'Preferably from Dhaka or adjacent districts (open to any suitable and compatible match)'),

          // 9. Contact Details
          sectionHeading('9. Contact Information'),
          fieldItem('Guardian / Parent Contact', '[Father / Mother / Guardian]  —  Phone: [+8801XXXXXXXXX]  |  Email: [guardian-email@example.com]'),
          fieldItem('Candidate Direct Contact', 'Nafi Ahmed (Self)  —  Phone: +8801760887297  |  Email: nafiahmed318@gmail.com'),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 180, after: 40 },
            children: [
              new TextRun({
                text: 'Note: Respected guardians and families are warmly requested to reach out via phone call for any inquiries or formal discussion.',
                italics: true,
                font: primaryFont,
                size: 19,
                color: subtextColor,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  function safeWrite(filePath, data) {
    try {
      fs.writeFileSync(filePath, data);
      console.log(`✅ Saved: ${filePath}`);
    } catch (err) {
      if (err.code === 'EBUSY') {
        const altPath = filePath.replace(/(\.docx?)$/, '-new$1');
        console.warn(`⚠️ Warning: ${filePath} is open in Word/another app. Writing to ${altPath} instead.`);
        fs.writeFileSync(altPath, data);
        console.log(`✅ Saved to alternative path: ${altPath}`);
      } else {
        throw err;
      }
    }
  }

  const outDocxPath = path.resolve(__dirname, '../bio/biodata.docx');
  safeWrite(outDocxPath, buffer);

  const outDocPath = path.resolve(__dirname, '../bio/biodata.doc');
  safeWrite(outDocPath, buffer);
}

generateBiodataDocx().catch(err => {
  console.error('Error generating docx:', err);
  process.exit(1);
});
