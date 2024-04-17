import './index.less';
import { lazy } from "solid-js";
import { render } from "solid-js/web";
import { HashRouter, Route, A } from "@solidjs/router";
import Home from './pages/Home';
import NotFound from './pages/NotFound';

const App = props => (
  <>
    <nav class="main">
      <A href="/">Home</A>
      <A href="/galaxy">Galaxy Sim</A>
      <A href="/boids">Boids</A>
    </nav>
    {props.children}
  </>
);

render(() => (
  <HashRouter root={App}>
    <Route path='/' component={Home} />
    <Route path={['/galaxy', '/galaxy/:num']} component={lazy(() => import('Pages/Galaxy'))} />
    <Route path='/boids' component={lazy(() => import('Pages/Boids'))} />
    <Route path="*path" component={NotFound} />
  </HashRouter>
), document.getElementById('root'));