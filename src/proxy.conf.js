/**
 * Created by Joola on 30.01.2020.
 */
const PROXY_CONFIG = {
  "/": {
    "target": "http://localhost:3000",
    "secure": false,
    "bypass": function (req, res, proxyOptions) {
      if (req.headers.accept.indexOf("html") !== -1) {
        console.log("Skipping proxy for browser request.");
        return "/index.html";
      }
      req.headers["X-Custom-Header"] = "yes";
    }
  }
};

module.exports = PROXY_CONFIG;
