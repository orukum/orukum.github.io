import './index.less';
import { lazy } from "solid-js";
import { Dynamic, render } from "solid-js/web";
import { HashRouter, Route, A } from "@solidjs/router";
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { MetaProvider, Title } from '@solidjs/meta';

const pages = [
  {
    title: 'Home',
    paths: ['/'],
    component: Home    
  },
  {
    title: 'Galaxy',
    paths: ['/galaxy', '/galaxy/:num'],
    component: lazy(() => import('Pages/Galaxy'))
  },
  {
    title: 'Boids',
    paths: ['/boids'],    
    component: lazy(() => import('Pages/Boids'))
  },
  {
    hidden: true,
    title: 'Not Found',
    paths: ['*path'],
    component: NotFound
  }
];

function App(props) {
  return <>
    <nav class="main">
      <For each={pages}>
        {({hidden, paths, title}) => (
          <Show when={!hidden}>
            <A href={paths[0]}>{title}</A>
          </Show>
        )}
      </For>
    </nav>
    {props.children}
  </>;
}

function Page({title, component}) {
  return <MetaProvider>
    <Title>{title}</Title>
    <Dynamic component={component} />
  </MetaProvider>;
}

render(() => (
  <HashRouter root={App}>
    <For each={pages}>
      {({paths, component, title}) => <Route path={paths} component={() => <Page title={title} component={component} />}/>}
    </For>
  </HashRouter>
), document.getElementById('root'));