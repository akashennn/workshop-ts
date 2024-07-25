import express, { Application } from "express";
import { Routes } from "./decorators/controller";

class App {
  public app: Application;
  // public routesProvider: Routes = new Routes();
  port: number;

  constructor(port: number, controllers: any) {
    this.port = port;
    this.app = express();
    this.controllerInit(controllers);
    this.config();
    // this.routesProvider.routes(this.app);
  }

  private config(): void {}

  controllerInit(controller: any[]) {
    controller.forEach((element: any) => {
      const basePath = Reflect.getMetadata("basePath", element);
      const routes = Reflect.getMetadata("routes", element);

      let currentPath: string, currentRouteHandle;

      routes.forEach((route: Routes) => {
        currentPath = basePath + route.path;
        currentRouteHandle = element[route.propertyKey];

        this.app[route.httpMethod](currentPath, currentRouteHandle);

        console.log(
          `route: ${element.name}.${route.propertyKey} -> ${route.httpMethod} ${currentPath}`
        );
      });

      // console.log(basePath);
      // console.log(routes);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App Started on ${this.port}`);
    });
  }
}

export default App;
