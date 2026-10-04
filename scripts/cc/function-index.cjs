const fs=require('fs'),parser=require('@babel/parser');
const input=fs.readFileSync(process.argv[2],'utf8');
const ast=parser.parse(input,{sourceType:'script'});
console.log(JSON.stringify(ast.program.body.filter(n=>n.type==='FunctionDeclaration').map(n=>({name:n.id.name,start:n.start,end:n.end}))));
