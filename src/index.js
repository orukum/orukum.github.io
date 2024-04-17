import './index.less';
import { lazy } from "solid-js";
import { render } from "solid-js/web";
import { Router, Route, A } from "@solidjs/router";

const App = props => (
  <>
    <nav class="main">
      <A href="/">Home</A>
      <A href="/galaxy">Galaxy Sim</A>
    </nav>
    {props.children}
  </>
);

render(() => (
  <Router root={App}>
    <Route path="/" component={lazy(() => import('Pages/Home'))} />
    <Route path="/galaxy" component={lazy(() => import('Pages/Galaxy'))} />
  </Router>
), document.getElementById('root'));