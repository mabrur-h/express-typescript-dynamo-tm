require('dotenv').config()

import {Routes} from "./interfaces/routes.interface";
import express, {Application} from 'express'
import config from 'config'
import log from "./utils/logger";
import errorHandler from "./middleware/error-handler.middleware";
import getUserMiddleware from "./middleware/get-user.middleware";

class App {
  public app: Application
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.port = config.get('port')

    this.initializeMiddlewares();
    this.initializeGetUserMiddleware()
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      log.info(`=================================`);
      log.info(`SERVER IS LISTENING ON PORT ${this.port}`);
      log.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(express.json({limit: "50mb"}));
    this.app.use(express.urlencoded({limit: "50mb", extended: true}));
  }

  private initializeGetUserMiddleware() {
    this.app.use(getUserMiddleware)
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/api', route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorHandler);
  }
}

export default App