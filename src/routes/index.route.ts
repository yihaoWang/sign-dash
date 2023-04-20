import IndexController from "../controllers/index.controller"
import Route from "./route";

class IndexRoute extends Route{
  private signInController = new IndexController();

  constructor() {
    super();
    this.setRoutes();
  }

  protected setRoutes() {
    this.router.get('/', this.signInController.echo);
  }
}

export default IndexRoute;