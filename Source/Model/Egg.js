"use strict";
class Egg extends Entity {
    constructor(pos) {
        super(Egg.name, [
            Drawable.fromVisual(Egg.visualBuild()),
            Locatable.fromPos(pos)
        ]);
    }
    static visualBuild() {
        var eggLength = 6;
        var eggWidth = eggLength * .75;
        var colors = Color.Instances();
        var visualEgg = new VisualEllipse(eggLength, eggWidth, // horizontal, vertical semiaxes
        .25, // rotationInTurns
        colors.White, colors.Gray, // colors
        false // shouldUseEntityOrientation
        );
        var returnValue = visualEgg;
        return returnValue;
    }
}
