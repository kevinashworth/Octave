/*

The document body classList is the one source of info.
If there is no document, do nothing.

sidebar-show is for mobile
sidebar-{}-show is for all others

Use SidebarController as a singleton across multiple components:
  Sidebar, SidebarNav, SidebarMinimizer, SidebarToggler

The CoreUI React Sidebar has these options that we are dealing with:
  minimized: boolean
    -- is it wide with text or narrow with just icons
    -- always change `sidebar-minimized` along with `brand-minimized`
    -- we use isMinimized herein
  open: boolean
    -- is it visible wide or narrow, or is not visible
    -- we use isOpen herein
  display: string
    -- bootstrap breakpoint, `lg` as default
    -- CoreUI allows Sidebar and SidebarToggler to be different; we force them to be the what Sidebar has and ignore SidebarToggler's setting

The sidebar has other options that we are not using, including:
  fixed: boolean -- do not use -- scrolls with the page or not
  offCanvas: boolean -- do not use -- covers page content or not

TODO: displayBreakpoint

*/

import { sidebarCssClasses } from './classes.js';

class SidebarController {
  constructor() {
    this.display = 'lg';
    this.isMinimized = false;
    this.isOpen = true;
  }

  add = (className) => {
    if (document.body) {
      document.body.classList.add(className);
    }
  }
  remove = (className) => {
    if (document.body) {
      document.body.classList.remove(className);
    }
  }
  contains = (className) => {
    if (document.body) {
      return document.body.classList.contains(className);
    }
  }

  close = () => {
    if (document.body) {
      this.remove('sidebar-show');
      this.remove(`sidebar-${this.display}-show`);
      this.isOpen = false;
    }
  }
  open = () => {
    if (document.body) {
      this.add('sidebar-show');
      this.add(`sidebar-${this.display}-show`);
      this.isOpen = true;
    }
  }
  toggleOpen = () => {
    if (document.body) {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }
  }
  narrow = () => {
    if (document.body) {
      this.add('sidebar-minimized');
      this.add('brand-minimized');
      this.isMinimized = true;
      this.sidebarPSToggle();
    }
  }
  wide = () => {
    if (document.body) {
      this.remove('sidebar-minimized');
      this.remove('brand-minimized');
      this.isMinimized = false;
      this.sidebarPSToggle();
    }
  }
  toggleMinimized = () => {
    if (document.body) {
      if (this.isMinimized) {
        this.wide();
      } else {
        this.narrow();
      }
    }
  }

  setDisplayBreakpoint = (display) => {
    const cssTemplate = `sidebar-${display}-show`;
    let [cssClass] = sidebarCssClasses[0];
    if (display && sidebarCssClasses.indexOf(cssTemplate) > -1) {
      cssClass = cssTemplate;
    }
    this.add(cssClass);
    this.display = display;
    // now, to ensure that both classes are used in tandem and that sidebarPSToggle is called
    if (this.isOpen) {
      this.open();
    } else {
      this.close();
    }
  }

  hideMobile = () => {
    if (document.body) {
      if (this.isOnMobile()) {
        this.remove('sidebar-show');
        // this.remove(`sidebar-${this.display}-show`);
        this.isOpen = false;
      }
    }
  }

  isOnMobile = () => {
    let onMobile = false;
    try {
     const minimizerElement = document.querySelector('.sidebar-minimizer');
     if (minimizerElement) {
       onMobile = getComputedStyle(minimizerElement).getPropertyValue('display') === 'none';
     } else {
       const sidebarElement = document.querySelector('.sidebar .sidebar-nav');
       sidebarElement && (onMobile = getComputedStyle(sidebarElement).getPropertyValue('overflow-y') === 'auto');
     }
    } catch (ignore) {
      // eslint-disable-next-line
      console.warn('CoreUI isOnMobile failed to getComputedStyle', ignore)
    }
    return onMobile
  }

  sidebarPSToggle = (toggle) => {
    if (document.body) {
      if (this.isOnMobile()) {
        toggle = true
      } else {
        toggle = !this.isMinimized;
      }
      const ps = { y: { rail: {}, thumb: {} } };
      const isRtl = getComputedStyle(document.documentElement).direction === 'rtl'
      const sidebar = document.querySelector('.sidebar-nav');
      ps.y.rail.on = document.querySelector('.sidebar-nav .ps__rail-y');
      ps.y.rail.off = document.querySelector('.sidebar-nav .ps__rail-y-off');
      ps.y.thumb.on = document.querySelector('.sidebar-nav .ps__thumb-y');
      ps.y.thumb.off = document.querySelector('.sidebar-nav .ps__thumb-y-off');
      if (sidebar) {
        if (toggle) {
          sidebar.classList.add('ps');
          sidebar.classList.add('ps-container');
          sidebar.classList.add('ps--active-y');
          if (ps.y.rail.off) {
            ps.y.rail.off.classList.add('ps__rail-y');
            ps.y.rail.off.removeAttribute('style');
            ps.y.rail.off.style.left = isRtl ? '0px' : 'unset';
            ps.y.rail.off.style.right = isRtl ? 'unset' : '0px';
            ps.y.rail.off.classList.remove('ps__rail-y-off');
          }
          if (ps.y.thumb.off) {
            ps.y.thumb.off.removeAttribute('style');
            ps.y.thumb.off.classList.add('ps__thumb-y');
            ps.y.thumb.off.classList.remove('ps__thumb-y-off');
          }
        } else {
          if (ps.y.rail.on) {
            ps.y.rail.on.classList.add('ps__rail-y-off');
            ps.y.rail.on.removeAttribute('style');
            ps.y.rail.on.classList.remove('ps__rail-y');
          }
          if (ps.y.thumb.on) {
            ps.y.thumb.on.classList.add('ps__thumb-y-off');
            ps.y.thumb.on.removeAttribute('style');
            ps.y.thumb.on.classList.remove('ps__thumb-y');
          }
          sidebar.classList.remove('ps');
          sidebar.classList.remove('ps-container');
          sidebar.classList.remove('ps--active-y');
        }
      }
    }
  }
}

// export it as a singleton
export default new SidebarController();
