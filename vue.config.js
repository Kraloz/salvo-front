const path = require("path")

module.exports = {
  // sets frontend build to static folder in backend
  outputDir: path.resolve(__dirname, "../backend/src/main/resources/static/web"),
  // assetsDir: "../../static/SPA"
  
  // proxy all webpack dev-server requests starting with /api
  // to our Spring Boot backend (localhost:8080) using http-proxy-middleware
  // see https://cli.vuejs.org/config/#devserver-proxy
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:8080', // maps requests to port 8080
        ws: true,
        changeOrigin: true
      }
    },
    publicPath: process.env.NODE_ENV === 'production'
    ? '/web/'
    : '/'
  }
}