"use strict";
class PlaceFarm extends Place {
    constructor(enclosures, feeds, animals, eggs) {
        super(PlaceFarm.name, PlaceFarm.defnBuild().name, Coords.fromXY(400, 300), // size
        // entities
        ArrayHelper.flattenArrayOfArrays([
            enclosures,
            feeds,
            animals,
            eggs,
            [new UserInputListener()]
        ]));
        var enclosure0Box = enclosures[0].boundable().bounds;
        animals.forEach(x => {
            var constrainable = x.constrainable();
            var constraint = constrainable.constraints[0];
            constraint.boxToContainWithin = enclosure0Box;
        });
    }
    static defnBuild() {
        var actionInstances = Action.Instances();
        var actionDisplayRecorderStartStop = DisplayRecorder.actionStartStop();
        var actionEntityAtMouseClickPosSelect = Selector.actionEntityAtMouseClickPosSelect();
        var actionShowMenu = actionInstances.ShowMenuSettings;
        var actions = [
            actionDisplayRecorderStartStop,
            actionEntityAtMouseClickPosSelect,
            actionShowMenu
        ];
        var inputNames = Input.Names();
        var actionToInputsMappings = [
            new ActionToInputsMapping(actionDisplayRecorderStartStop.name, ["~"], true // inactivate
            ),
            ActionToInputsMapping.fromActionNameAndInputName(actionShowMenu.name, inputNames.Escape),
            ActionToInputsMapping.fromActionNameAndInputName(actionEntityAtMouseClickPosSelect.name, inputNames.MouseClick)
        ];
        var entityPropertyNamesToProcess = [
            Actor.name,
            Collidable.name,
            Constrainable.name,
            Locatable.name
        ];
        return PlaceDefn.from4(PlaceFarm.name, actions, actionToInputsMappings, entityPropertyNamesToProcess);
    }
    // Convenience methods.
    enclosures() {
        return this.entities.filter((x) => (x.constructor.name == Enclosure.name));
    }
}
