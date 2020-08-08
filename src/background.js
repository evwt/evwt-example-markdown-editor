import { app, protocol } from 'electron';
import { EvMenu } from 'evwt';
import './background/events/app';
import './background/events/ipc';

const isDevelopment = process.env.NODE_ENV !== 'production';

EvMenu.activate();

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
]);

if (isDevelopment) {
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
