import { app, protocol } from 'electron';
import { EvMenu } from 'evwt';
import { EvStore } from 'evwt/background';
import './background/events/app';
import './background/events/ipc';

// EVWT Test Suite helper
import './background/events/test';

const isNotProduction = process.env.NODE_ENV !== 'production';

EvStore.activate();
EvMenu.activate();

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
]);

if (isNotProduction) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
