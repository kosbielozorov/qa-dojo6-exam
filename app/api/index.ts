import { ArticleController } from './controllers/Articles/article.controller';
import { CommentController } from './controllers/Comments/comment.controller';
import RequestHolder from './controllers/requestHolder';
import { SearchController } from './controllers/Search/search.controller';
import { TagsController } from './controllers/Tags/tags.controller';
import { UserController } from './controllers/Users/user.controller';

export default class AppApi extends RequestHolder {
  public userController = new UserController(this.request);
  public articleController = new ArticleController(this.request);
  public searchController = new SearchController(this.request);
  public tagsController = new TagsController(this.request);
  public commentController = new CommentController(this.request);
}
