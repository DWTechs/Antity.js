// const path = require('path');
const fs      = require('fs');

const mail    = 'https://github.com/DWTechs/Passken.js';
const CRLF    = '\r\n';
const rel     = './';
const src     = `${rel}build/`;
const dest    = `${rel}dist/`; 
const files   = [
  {
    src:  `${rel}src/passken.d.ts`,
    dest: `${dest}passken.d.ts`
  },
  {
    src:  `${src}passken.cjs.js`,
    dest: `${dest}passken.cjs.js`
  },
  {
    src:  `${src}passken.mjs`,
    dest: `${dest}passken.mjs`
  },
];

fs.mkdir(dest, { recursive: false },(err) => {
  if (err) throw err;
  fs.readFile(`${rel}LICENSE`, (err, license) => {
    if (err) throw err;
    for (const file of files) {
      fs.readFile(file.src, (err, fileContent) => {
        if (err) throw err;
        fs.writeFile(file.dest, `/*${CRLF}${license}${CRLF}${mail}${CRLF}*/${CRLF}${CRLF}${fileContent}`, (err) => {
          if (err) throw err;
        });
      });
    }
  });
});