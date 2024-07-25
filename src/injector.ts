import { Injectable } from "./decorators/injectable";

/**
 * CRUD Service for CRUD operations against BE / DB
 */
@Injectable()
class CrudService {
  getData(entity: string) {
    return `Some Data from -> ${entity}`;
  }
}

/**
 * Service to retrieve/crate/update comments
 */
@Injectable()
class CommentsService {
  constructor(public crudService: CrudService) {}

  getComments() {
    return this.crudService.getData("/comments");
  }
}

/**
 * Service to retrieve/crate/update comments
 */
@Injectable()
class MoviesService {
  constructor(
    private commentsService: CommentsService,
    private crudService: CrudService
  ) {}
  getMovies() {
    return this.crudService.getData("/movies");
  }
  getComments() {
    return this.commentsService.getComments();
  }
}

// before: bad way to do it
// const movies = new MoviesService(
//   new CommentsService(new CrudService()),
//   new CrudService()
// );

const resolve = (target: any) => {
  let token = Reflect.getMetadata("design:paramtypes", target);
  let injections = token?.map((t: any) => resolve(t)) || [];
  return new target(...injections);
};

// after: better way to do it
// const movies = resolve(MoviesService);

// singleton approach
const Injector = new (class {
  instMap: Record<string, any> = {};

  resolve(target: any) {
    let token = Reflect.getMetadata("design:paramtypes", target);

    let injections =
      token?.map((t: any) => {
        return Injector.resolve(t);
      }) || [];

    if (this.instMap.hasOwnProperty(target.name)) {
      return this.instMap[target.name];
    } else {
      this.instMap[target.name] = new target(...injections);
      return this.instMap[target.name];
    }
  }
})();

// after 2: way better way with singleton approach
const movies = Injector.resolve(MoviesService);

console.log(movies.getMovies());
console.log(movies.getComments());
