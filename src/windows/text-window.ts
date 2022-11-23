import * as ex from "excalibur";

export class UnitOpsWindow extends ex.ScreenElement {

  constructor(
    private zLayer: number,
    private windowWidth: number,
    private windowHeight: number,
    private onKillCallback: () => void,
    screenWidth: number,
    screenHeight: number,
    private content: string
  ) {
    super({
      x: screenWidth - windowWidth,
      y: screenHeight - windowHeight,
      color: ex.Color.Gray,
      width: windowWidth,
      height: windowHeight,
      z: zLayer,
    });
  }

  onInitialize() {
    this.addChild(this.textToLabel(10, 10));
  }

  textToLabel(x: number, y: number) {
    var textToDisplay = this.content;
    var label = new ex.Label({
      text: textToDisplay,
      pos: ex.vec(x, y),
      z: this.zLayer,
      font: new ex.Font({
        size: 30,
        color: ex.Color.Red,
        baseAlign: ex.BaseAlign.Top,
        shadow: { blur: 5, offset: ex.vec(5, 5), color: ex.Color.Black },
      }),
    });
    return label;
  }
}
