/**
 * Resume Compilation Script
 * Converts LaTeX resume source files to downloadable PDFs in src/assets/docs/
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const RESUMES = [
  {
    src: path.join(__dirname, '..', 'latex', 'Nafi_Ahmed_Latex.tex'),
    dest: path.join(__dirname, '..', 'src', 'assets', 'docs', 'Nafi_Ahmed_Resume.pdf'),
    name: 'Nafi_Ahmed_Resume.pdf (Standard)'
  },
  {
    src: path.join(__dirname, '..', 'latex', 'Nafi_Ahmed_Latex_5y.tex'),
    dest: path.join(__dirname, '..', 'src', 'assets', 'docs', 'Nafi_Ahmed_Resume_5y.pdf'),
    name: 'Nafi_Ahmed_Resume_5y.pdf (5y Experience)'
  }
];

const CLOUD_SERVERS = [
  'https://latexonline.cc',
  'https://latex.aslushnikov.com'
];

function isCommandAvailable(cmd) {
  try {
    execSync(`${cmd} --version`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function compileOnlineWithRetry(texPath, destPath, retries = 3) {
  const fileName = path.basename(texPath);
  const dirName = path.dirname(texPath);
  const tempTar = path.join(dirName, `temp_${Date.now()}_${Math.random().toString(36).slice(2)}.tar`);

  try {
    execSync(`tar.exe -cf "${tempTar}" -C "${dirName}" "${fileName}"`);
    const tarBuffer = fs.readFileSync(tempTar);
    if (fs.existsSync(tempTar)) fs.unlinkSync(tempTar);

    for (let attempt = 1; attempt <= retries; attempt++) {
      for (const server of CLOUD_SERVERS) {
        try {
          const form = new FormData();
          form.append('file', new Blob([tarBuffer], { type: 'application/x-tar' }), 'resume.tar');

          const res = await fetch(`${server}/data?target=${encodeURIComponent(fileName)}&command=xelatex`, {
            method: 'POST',
            body: form
          });

          if (res.ok && res.headers.get('content-type')?.includes('pdf')) {
            const buffer = Buffer.from(await res.arrayBuffer());
            fs.mkdirSync(path.dirname(destPath), { recursive: true });
            fs.writeFileSync(destPath, buffer);
            return { success: true, size: buffer.length };
          }
        } catch (err) {
          // Continue to next server or retry
        }
      }

      if (attempt < retries) {
        console.log(`   ⏳ Retrying compilation (attempt ${attempt + 1}/${retries})...`);
        await sleep(2000 * attempt);
      }
    }

    return { success: false, error: 'Cloud servers were busy or returned Bad Gateway after retries' };
  } catch (err) {
    if (fs.existsSync(tempTar)) fs.unlinkSync(tempTar);
    return { success: false, error: err.message };
  }
}

function compileLocal(texPath, destPath) {
  const dirName = path.dirname(texPath);
  const baseName = path.basename(texPath, '.tex');
  try {
    execSync(`xelatex -interaction=nonstopmode -output-directory="${dirName}" "${texPath}"`, { stdio: 'ignore' });
    const generatedPdf = path.join(dirName, `${baseName}.pdf`);
    if (fs.existsSync(generatedPdf)) {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(generatedPdf, destPath);
      // Clean up auxiliary files
      ['.aux', '.log', '.out', '.toc'].forEach(ext => {
        const auxFile = path.join(dirName, `${baseName}${ext}`);
        if (fs.existsSync(auxFile)) fs.unlinkSync(auxFile);
      });
      const stats = fs.statSync(destPath);
      return { success: true, size: stats.size };
    }
    return { success: false, error: 'Output PDF not created by xelatex' };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function run() {
  console.log('🚀 Starting LaTeX Resume Compilation...\n');
  const hasLocalXeTeX = isCommandAvailable('xelatex');
  console.log(`ℹ️ Compiler Mode: ${hasLocalXeTeX ? 'Local XeLaTeX' : 'Online XeLaTeX Cloud Service'}`);

  for (const resume of RESUMES) {
    if (!fs.existsSync(resume.src)) {
      console.error(`❌ Source file missing: ${resume.src}`);
      continue;
    }

    console.log(`📄 Compiling ${resume.name}...`);
    let result;

    if (hasLocalXeTeX) {
      result = compileLocal(resume.src, resume.dest);
    }

    if (!result || !result.success) {
      if (hasLocalXeTeX) {
        console.log('⚠️ Local compilation failed, attempting Cloud fallback...');
      }
      result = await compileOnlineWithRetry(resume.src, resume.dest);
    }

    if (result.success) {
      const kb = (result.size / 1024).toFixed(1);
      console.log(`✅ Success: ${path.relative(process.cwd(), resume.dest)} (${kb} KB)\n`);
    } else {
      console.error(`❌ Failed to compile ${resume.name}`);
      console.error(`   Error: ${result.error}\n`);
    }
  }

  console.log('🎉 Compilation complete! Resume PDFs are updated and downloadable.');
}

run().catch(err => {
  console.error('Fatal compilation error:', err);
  process.exit(1);
});
