import express from 'express';
import next from 'next';
import type { ParsedUrlQuery } from 'node:querystring';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3001;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.get('/page-with-error-using-express', async (req, res) => {
    // Intercept statusCode property to change 404 to 410
    let currentStatusCode = res.statusCode;
    Object.defineProperty(res, 'statusCode', {
      get() {
        return currentStatusCode;
      },
      set(value) {
        if (value === 404) {
          console.log('Intercepted 404 in statusCode setter, changing to 410');
          currentStatusCode = 410;
        } else {
          currentStatusCode = value;
        }
      },
      configurable: true,
    });

    // Render the Next.js page
    await app.render(
      req,
      res,
      '/page-with-error-using-express',
      req.query as ParsedUrlQuery,
    );
  });

  // Let Next.js handle all other requests
  server.all('*splat', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
