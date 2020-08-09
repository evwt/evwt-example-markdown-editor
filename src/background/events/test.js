// EVWT Test Suite - Testbed helpers to ensure EVWT is sending the right events
// Not needed for normal apps
import { app } from 'electron';

const isTesting = process.env.npm_lifecycle_event === 'test';

if (isTesting) {
  app.on('evmenu', item => {
    process.env.evwtTestEvMenuApp1 = JSON.stringify(item);
  });
  app.on('evmenu:show-preview', item => {
    process.env.evwtTestEvMenuApp2 = JSON.stringify(item);
  });
}
