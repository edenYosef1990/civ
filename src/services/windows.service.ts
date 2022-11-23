export class WindowsService {
  constructor(
    private openWindowCallback: () => void,
    private closeWindowCallback: () => void
  ) {}

  openWindow() {
    this.openWindowCallback();
  }

  closeWindow() {
    this.closeWindowCallback();
  }
}
