const originalConsole = { ...console };

console.info = (...args: any[]) => {
  originalConsole.log('\x1b[34m%s\x1b[0m', ...args); // Blue color for info
};

console.error = (...args: any[]) => {
  originalConsole.log('\x1b[31m%s\x1b[0m', ...args); // Red color for error
};

import LGServiceServer from './LGServiceServer';

const server = new LGServiceServer();
server.startServer(3000);
