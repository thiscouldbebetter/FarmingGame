"use strict";
class Enclosure extends Entity {
    constructor(name, color, box) {
        super(name, [
            new Boundable(box),
            Drawable.fromVisual(Enclosure.visualBuild(name, box.size, color)),
            Locatable.fromPos(box.center),
        ]);
    }
    static visualBuild(name, size, color) {
        var colors = Color.Instances();
        var returnValue = new VisualGroup([
            VisualRectangle.fromSizeAndColorFill(size, color),
            VisualText.fromTextImmediateAndColors(name, colors.White, colors.Black),
        ]);
        return returnValue;
    }
}
