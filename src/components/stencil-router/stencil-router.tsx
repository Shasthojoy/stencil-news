import { Component, Prop, Method, State, Element } from '@stencil/core';

/**
  * @name Router
  * @module ionic
  * @description
 */
@Component({
  tag: 'stencil-router'
})
export class Router {
  @Element() el: HTMLElement;

  base: string;

  @Prop() root: string = '/';

  @State() routeMatch: any = {};

  @Method()
  match() {
    return this.routeMatch
  }

  @Method()
  navigateTo(url, data={}) {
    console.log('navigateTo', url, data);
    window.history.pushState(null, null, url || '/');
    this.routeMatch = {
      url: url
    }

    console.log('\n<stencil-router> dispatching event', this.routeMatch)
    this.el.dispatchEvent(new (window as any).CustomEvent('stencilRouterNavigation', { detail: this.routeMatch }))
  }

  componentWillLoad() {
    console.log('<stencil-router> loaded');
    window.addEventListener('popstate', this.handlePopState.bind(this));
    // window.addEventListener('hashchange', this.handleHashChange.bind(this));
    window.onhashchange = this.handleHashChange.bind(this);

    const initialPath = window.location.pathname;
    //const withoutBase = '';
    const withoutBase = initialPath.replace(this.root, '')

    this.routeMatch = {
      url: "/" + withoutBase
    }
  }

  componentDidLoad() {
    this.el.dispatchEvent(new (window as any).CustomEvent('stencilRouterLoaded'))
  }

  handlePopState() {
    console.log('handled pop state called', window.location.pathname);
    window.history.pushState(null, null, window.location.pathname || '/');
    this.routeMatch = {
      url: window.location.pathname
    }
    this.el.dispatchEvent(new (window as any).CustomEvent('stencilRouterNavigation', { detail: this.routeMatch}));
  }

  handleHashChange(e) {
    console.log('Hash change', e)
  }

  render() {
    return (
      <slot></slot>
    );
  }
}