const fs = require('fs');
const schema = JSON.parse(fs.readFileSync('schema.json', 'utf8'));
const defs = schema.definitions;
if(defs) {
  for (const table in defs) {
    const props = defs[table].properties;
    console.log(table + ': ' + (props ? Object.keys(props).join(', ') : 'no props'));
  }
} else {
  console.log("No definitions found");
}
