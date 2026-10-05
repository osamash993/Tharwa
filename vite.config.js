import { defineConfig } from 'vite';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

// Public files bypass Vite's asset hashing. Version the iframe document from its
// own contents so a dashboard-only update also invalidates the parent bundle.
const dashboardHash=createHash('sha256');
for(const name of ['index.html','app.js','integration.css']){
  dashboardHash.update(name+'\0').update(readFileSync(new URL('./public/command-center/'+name,import.meta.url)));
}
export default defineConfig({
  base:'./',
  define:{__COMMAND_CENTER_VERSION__:JSON.stringify(dashboardHash.digest('hex').slice(0,16))},
  build:{chunkSizeWarningLimit:1000}
});
