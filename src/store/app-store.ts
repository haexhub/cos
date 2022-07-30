import { Store } from "./main";
import { APP_STORE } from "./store-names";

interface IAppStore {
  isMenuBarVisible: boolean
  isOverlayVisible: boolean
  isSelectionMenuVisible: boolean
  iconClass: string
}

class AppStore extends Store<IAppStore> {
  protected data(): IAppStore {
    return {
      isMenuBarVisible: false,
      isOverlayVisible: false,
      isSelectionMenuVisible: false,
      iconClass: "rotate-45"
    };
  }

  toggleMenuBar() {
    if (this.state.isMenuBarVisible)
      this.hideMenuBar()
    else
      this.showMenuBar()

    return this.state.isMenuBarVisible
  }

  showMenuBar() {
    this.state.isMenuBarVisible = true
    return this.state.isMenuBarVisible
  }

  hideMenuBar() {
    this.state.isMenuBarVisible = false
    return this.state.isMenuBarVisible
  }


  toogleOverlay() {
    if (this.state.isOverlayVisible)
      this.hideOverlay()
    else
      this.showOverlay()
    return this.state.isOverlayVisible
  }

  showOverlay() {
    this.state.isOverlayVisible = true
    return this.state.isOverlayVisible
  }

  hideOverlay() {
    this.state.isOverlayVisible = false
    return this.state.isOverlayVisible
  }


  toogleSelectionMenu() {
    if (this.state.isSelectionMenuVisible)
      this.hideSelectionMenu()
    else
      this.showSelectionMenu()
    return this.state.isSelectionMenuVisible
  }

  showSelectionMenu() {
    this.state.iconClass = "rotate-180"
    this.state.isSelectionMenuVisible = true
    return this.state.isSelectionMenuVisible
  }

  hideSelectionMenu() {
    this.state.iconClass = "rotate-45"
    this.state.isSelectionMenuVisible = false
    return this.state.isSelectionMenuVisible
  }
}

export const appStore = new AppStore(APP_STORE);