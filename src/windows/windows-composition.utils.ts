import * as ex from "excalibur";

export class WindowsCompoisitonUtils {
  static setWindowToLeftOfRightWindow(
    left: ex.ScreenElement,
    right: ex.ScreenElement,
    space: number
  ) {
    const rightPos = right.pos;
    const leftPos = left.pos;
    left.pos = new ex.Vector(rightPos.x - left.width - space, leftPos.y);
  }
}
