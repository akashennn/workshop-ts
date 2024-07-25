import { Request, Response } from "express";
import "reflect-metadata";

type httpMethod = "get" | "post" | "put" | "delete";

export interface Routes {
  propertyKey: string;
  httpMethod: httpMethod;
  path: string;
}

export interface ParamType {
  paramName: string;
  index: number;
}

export const Controller = (path: string) => {
  return (target: any) => {
    Reflect.defineMetadata("basePath", path, target);
  };
};

export const Get = (path: string = "") => {
  const httpMethod: httpMethod = "get";
  return (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    const routes: Routes = {
      propertyKey,
      httpMethod,
      //   path: path || Reflect.getMetadata("basePath", target),
      path,
    };

    if (!Reflect.hasMetadata("routes", target)) {
      Reflect.defineMetadata("routes", [], target);
    }

    const routesList = Reflect.getMetadata("routes", target);
    routesList.push(routes);

    const routeParams = Reflect.getMetadata("routeParams", target);

    let routeParamsToInject: ParamType[] = [];
    if (routeParams) {
      routeParamsToInject = routeParams[propertyKey];
    }

    const originalMethod = descriptor.value;

    // can be used to add additional logic before calling the original method, for example logging, authentication, etc.
    descriptor.value = function (...args: [Request, Response]) {
      let [request, response] = args;
      let argsToInject: any[] = [];

      // ideally we should do all kinds of validations here
      routeParamsToInject.forEach((param: ParamType) => {
        argsToInject[param.index] = request.params[param.paramName];
      });

      const result = originalMethod.apply(this, argsToInject);
      response.send(result);
    };

    // console.log(routesList);
  };
};

export const Param = (paramName: string) => {
  return (target: any, methodName: string, index: number) => {
    const param: ParamType = { paramName, index };

    if (!Reflect.hasMetadata("routeParams", target)) {
      Reflect.defineMetadata("routeParams", {}, target);
    }

    const routeParams = Reflect.getMetadata("routeParams", target);
    if (!routeParams.hasOwnProperty(methodName)) {
      routeParams[methodName] = [];
    }
    routeParams[methodName].push(param);
  };
};
