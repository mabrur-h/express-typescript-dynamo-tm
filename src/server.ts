import App from './app';
import AuthRoute from './routes/auth.routes';
import TasksRoute from './routes/task.routes';

const app = new App([new AuthRoute(), new TasksRoute()]);

app.listen();
