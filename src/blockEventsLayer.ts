import * as ex from "excalibur";

export class BlockEventsLayer extends ex.ScreenElement{
  constructor(screenWidth: number, screenHeight: number, zindex: number) {
    super({
      x: 0, y: 0,
      width: screenWidth,
      height: screenHeight,
      color: ex.Color.fromRGB(99, 102, 106, 0.5),
      z: zindex,
    });
    this.on("pointermove", (bla) => {
      bla.cancel();
    });
  }
}
