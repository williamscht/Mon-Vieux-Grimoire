 
const http = require('http');


const server = http.createServer((req, res) => {
 
  res.end('Bienvenue sur le serveur Node du projet Mon Vieux Grimoire');
});


server.listen(process.env.PORT || 4000, () => {
  console.log('Serveur Node en ligne sur le port 4000');
});
