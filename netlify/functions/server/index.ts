import { APP_BASE_HREF } from "@angular/common";
import { join } from "path";
import { Handler } from "@netlify/functions";
import { CommonEngine } from "@angular/ssr/node";
import bootstrap from "../../../src/main.server";

const browserDistFolder = join(__dirname, "../../browser");
const indexHtml = join(__dirname, "index.server.html");
const commonEngine = new CommonEngine();

const handler: Handler = async (event, context) => {
  const { path, headers } = event;
  const url = `https://${headers["host"]}${path}`;

  try {
    const html = await commonEngine.render({
      bootstrap,
      documentFilePath: indexHtml,
      url,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    });
    return {
      statusCode: 200,
      body: html,
      headers: {
        "Content-Type": "text/html",
      },
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  }
};

export { handler };
