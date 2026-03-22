const http = require("http");

console.log("Uruchamianie lokalnego symulatora Cron...");
console.log("Skrypt uderzać będzie w port 8888 (Netlify Dev) co równą minutę.");

const triggerCron = () => {
  const req = http.request({
    hostname: "localhost",
    port: 8888,
    path: "/.netlify/functions/cron-notifications",
    method: "POST",
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(`[Cron Simulator] Odpytano cron o godzinie: ${new Date().toLocaleTimeString()} - Odpowiedź: ${res.statusCode}`);
    });
  });

  req.on('error', (e) => {
    console.error(`[Cron Simulator] Porażka - nie mogliśmy uderzyć w Cron: ${e.message} (czy na pewno uruchomiłeś npm run dev na porcie 8888?)`);
  });

  req.end();
};

// Pierwsze uderzenie zaraz po starcie
triggerCron();

// Interwał 60 sekundowy (co minutę tak samo jak w chmurze Netlify)
setInterval(triggerCron, 60000);
