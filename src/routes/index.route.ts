import IndexController from '../controllers/index.controller';
import Route from './route';

class IndexRoute extends Route {
  private indexController = new IndexController();

  constructor() {
    super();
    this.setRoutes();
  }

  protected setRoutes() {
    this.router.get('/', this.indexController.rednerHomePage.bind(this.indexController));
  }
}

export default IndexRoute;
