const { APP_BASE_HREF } = require("@angular/common");
const { CommonEngine, isMainModule } = require("@angular/ssr/node");
const express = require("express");
const { dirname, join, resolve } = require("path");
const { fileURLToPath } = require("url");
const bootstrap = require("./main.server");

const serverDistFolder = dirname(fileURLToPath(__filename));
const browserDistFolder = resolve(serverDistFolder, "../browser");
const indexHtml = join(serverDistFolder, "index.server.html");

const app = express();
const commonEngine = new CommonEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.get(
  "**",
  express.static(browserDistFolder, {
    maxAge: "1y",
    index: "index.html",
  })
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.get("**", (req: any, res: any, next: any) => {
  const { protocol, originalUrl, baseUrl, headers } = req;

  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    })
    .then((html: any) => res.send(html))
    .catch((err: any) => next(err));
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(__filename)) {
  const port = process.env["PORT"] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

module.exports = app;
