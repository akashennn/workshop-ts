import { NextFunction, Response, Request } from "express";
import postsService from "./posts-service";
import { Controller, Get, Param } from "./decorators/controller";

@Controller("/posts")
export class PostsController {
  @Get("")
  public static getListOfPosts() {
    return postsService.listPosts();
  }

  // @Get and @Param name should be the same
  @Get("/:postId")
  public static getListById(@Param("postId") postId: number) {
    return postsService.getPost(postId);
  }
}
