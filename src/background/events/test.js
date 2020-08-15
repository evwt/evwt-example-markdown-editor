// EVWT Test Suite - Testbed helpers to ensure EVWT is sending the right events
// Not needed for normal apps
import { app } from 'electron';

if (process.env.npm_lifecycle_event === 'test') {
  app.on('evmenu', item => {
    process.env.evwtTestEvMenuApp1 = JSON.stringify(item);
  });

  app.on('evmenu:show-preview', item => {
    process.env.evwtTestEvMenuApp2 = JSON.stringify(item);
  });

  app.on('evcontextmenu', item => {
    process.env.evwtTestEvContextMenuApp1 = JSON.stringify(item);
  });

  app.on('evcontextmenu:my-context-menu:item-1', item => {
    process.env.evwtTestEvContextMenuApp2 = JSON.stringify(item);
  });
}
