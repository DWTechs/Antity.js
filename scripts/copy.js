const fs      = require('node:fs');

const mail    = 'https://github.com/DWTechs/Antity.js';
const CRLF    = '\r\n';
const rel     = './';
const src     = `${rel}build/`;
const dest    = `${rel}dist/`; 
const files   = [
  {
    src:  `${rel}src/antity.d.ts`,
    dest: `${dest}antity.d.ts`
  },
  {
    src:  `${src}antity.cjs.js`,
    dest: `${dest}antity.cjs.js`
  },
  {
    src:  `${src}antity.mjs`,
    dest: `${dest}antity.js`
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