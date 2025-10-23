class LoadingManager {
  instance = null;

  setInstance(instance) {
    this.instance = instance;
  }

  show() {
    if (this.instance) {
      this.instance.show();
    }
  }

  hide() {
    if (this.instance) {
      this.instance.hide();
    }
  }
}

export default new LoadingManager();
