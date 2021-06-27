"use strict";
class Feed extends Entity {
    constructor(pos) {
        super(Feed.name, [
            Drawable.fromVisual(Feed.visualBuild()),
            Locatable.fromPos(pos)
        ]);
    }
    static visualBuild() {
        var cobLength = 10;
        var cobWidth = cobLength * 0.4;
        var colors = Color.Instances();
        var visualCob = new VisualEllipse(cobLength, cobWidth, // horizontal, vertical semiaxes
        0, // rotationInTurns
        colors.Yellow, colors.YellowDark, // colors
        false // shouldUseEntityOrientation
        );
        var visualShuckTop = VisualOffset.fromOffsetAndChild(Coords.fromXY(-cobWidth, -cobWidth / 2), new VisualEllipse(cobLength, cobWidth, // horizontal, vertical semiaxes
        0.95, // rotationInTurns
        colors.Green, colors.GreenDark, // colors
        false // shouldUseEntityOrientation
        ));
        var visualShuckBottom = VisualOffset.fromOffsetAndChild(Coords.fromXY(-cobWidth, cobWidth / 2), new VisualEllipse(cobLength, cobWidth, // horizontal, vertical semiaxes
        0.05, // rotationInTurns
        colors.Green, colors.GreenDark, // colors
        false // shouldUseEntityOrientation
        ));
        var returnValue = new VisualGroup([
            visualShuckTop,
            visualShuckBottom,
            visualCob
        ]);
        return returnValue;
    }
}
