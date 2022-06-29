import { PersistentStore, Store } from "./main";
import { CONTEXT_MENU_STORE_NAME } from "./store-names";

interface ContextMenu extends Object {
  show: boolean,
}

class ContextMenuStore extends PersistentStore<ContextMenu> {
  protected data(): ContextMenu {
    return {
      show: false,
    };
  }

  getPosition(e: any) {
    let posx = 0;
    let posy = 0;

    if (!e) e = window.event;

    if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = e.pageY;
    } else if (e.clientX || e.clientY) {
      posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    return {
      x: posx,
      y: posy
    }
  }

  psotionMenu(e: any) {
    let clickCoords = this.getPosition(e);
    let clickCoordsX = clickCoords.x;
    let clickCoordsY = clickCoords.y;

    /* let menuWidth = menu.offsetWidth + 4;
    let menuHeight = menu.offsetHeight + 4;

    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    if ( (windowWidth - clickCoordsX) < menuWidth ) {
      menu.style.left = windowWidth - menuWidth + "px";
    } else {
      menu.style.left = clickCoordsX + "px";
    }

    if ( (windowHeight - clickCoordsY) < menuHeight ) {
      menu.style.top = windowHeight - menuHeight + "px";
    } else {
      menu.style.top = clickCoordsY + "px";
    } */
  }

  toggle() {
    this.state.show = !this.state.show;
    return this.state.show
  }

  toggleOn() {
    console.log("toggleOn")
    this.state.show = true
    return this.state.show
  }

  toggleOff() {
    this.state.show = false
    console.log("toggleOff", this.state.show)
    return this.state.show
  }
}

export const contextMenuStore = new ContextMenuStore(CONTEXT_MENU_STORE_NAME);