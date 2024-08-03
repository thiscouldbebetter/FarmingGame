"use strict";
class Animal extends Entity {
    constructor(pos) {
        super(Animal.name, [
            Actor.default(),
            Animal.constrainableBuild(),
            Drawable.fromVisual(Animal.visualBuildEgg()),
            Locatable.fromPos(pos),
            Movable.fromAccelerationAndSpeedMax(.1, 0),
            Animal.phasedBuild("Adult"),
            Starvable.fromSatietyMax(1000),
            new Selectable(Animal.select, Animal.deselect)
        ]);
    }
    static activityDefnBuildAdult() {
        var returnValue = new ActivityDefn(Animal.name, Animal.activityDefnBuildAdult_Perform);
        return returnValue;
    }
    static activityDefnBuildAdult_Perform(uwpe) {
        var entityActor = uwpe.entity;
        var actor = entityActor.actor();
        var activity = actor.activity;
        var targetEntity = activity.targetEntity();
        if (targetEntity == null) {
            var randomizer = uwpe.universe.randomizer;
            var place = uwpe.place;
            var enclosure = entityActor.enclosure(place);
            var enclosureBounds = enclosure.boundable().bounds;
            var targetPos = enclosureBounds.pointRandom(randomizer);
            targetEntity = new Entity("Target", [Locatable.fromPos(targetPos)]);
            activity.targetEntitySet(targetEntity);
        }
        var movable = entityActor.movable();
        var actorLocatable = entityActor.locatable();
        var targetLocatable = targetEntity.locatable();
        var acceleration = movable.accelerationPerTick(uwpe);
        var speedMax = movable.speedMax(uwpe);
        var distanceToTarget = actorLocatable.approachOtherWithAccelerationAndSpeedMaxAndReturnDistance(targetLocatable, acceleration, speedMax);
        if (distanceToTarget < speedMax) {
            activity.targetEntitySet(null);
        }
        var phased = entityActor.phased();
        var phaseCurrentName = phased.phaseCurrent().name;
        if (phaseCurrentName == "Adult") {
            if (phased.ticksOnPhaseCurrent % 1000 == 0) {
                var starvable = entityActor.starvable();
                var satietyNeededToLayEgg = 100;
                if (starvable.satiety > satietyNeededToLayEgg) {
                    var entityToSpawn = entityActor.clone();
                    entityToSpawn.phased().reset();
                    uwpe.place.entityToSpawnAdd(entityToSpawn);
                }
            }
        }
    }
    static constrainableBuild() {
        var returnValue = new Constrainable([
            new Constraint_Switchable(true, // isActive
            new Constraint_ContainInBox(null)),
            new Constraint_Switchable(true, // isActive
            new Constraint_AttachToEntityWithId(null))
        ]);
        return returnValue;
    }
    static deselect(uwpe) {
        var place = uwpe.place;
        var entityToDeselect = uwpe.entity2;
        var constrainable = entityToDeselect.constrainable();
        var constraints = constrainable.constraints;
        var constraintAttach = constraints[1];
        constraintAttach.isActive = false;
        var constraintContainSwitchable = constraints[0];
        constraintContainSwitchable.isActive = true;
        var constraintContain = constraintContainSwitchable.child;
        var place = uwpe.place;
        var enclosureDroppedWithin = entityToDeselect.enclosure(place);
        if (enclosureDroppedWithin != null) {
            constraintContain.boxToContainWithin =
                enclosureDroppedWithin.boundable().bounds;
        }
        entityToDeselect.actor().activity.targetEntityClear();
    }
    static phasedBuild(phaseStartName) {
        return Phased.fromPhaseStartNameAndPhases(phaseStartName, [
            new Phase("Egg", 1000, // durationInTicks
            // transition
            (uwpe) => {
                var entity = uwpe.entity;
                var drawable = entity.drawable();
                drawable.visual = Animal.visualBuildJuvenile();
                var actor = entity.actor();
                actor.activity.clear();
            }),
            new Phase("Juvenile", 1000, // durationInTicks
            // transition
            (uwpe) => {
                var entity = uwpe.entity;
                var drawable = entity.drawable();
                drawable.visual = Animal.visualBuildJuvenile();
                var actor = entity.actor();
                actor.activity.defnName =
                    Animal.activityDefnBuildAdult().name;
                var movable = entity.movable();
                movable.speedMax = () => .5;
            }),
            new Phase("Adult", 10000, // durationInTicks
            // transition
            (uwpe) => {
                var entity = uwpe.entity;
                var drawable = entity.drawable();
                drawable.visual = Animal.visualBuildAdult();
                var movable = entity.movable();
                movable.speedMax = () => 1;
            }),
            new Phase("Senior", 2000, // durationInTicks
            // update
            (uwpe) => {
                var entity = uwpe.entity;
                var drawable = entity.drawable();
                drawable.visual = Animal.visualBuildSenior();
                var movable = entity.movable();
                movable.speedMax = () => .5;
            }),
            new Phase("Corpse", 1000, // durationInTicks
            // update
            (uwpe) => {
                var entity = uwpe.entity;
                var drawable = entity.drawable();
                drawable.visual = Animal.visualBuildCorpse();
                var movable = entity.movable();
                movable.speedMax = () => 0;
            })
        ]);
    }
    static select(uwpe) {
        var entityToSelect = uwpe.entity2;
        var constrainable = entityToSelect.constrainable();
        var constraints = constrainable.constraints;
        var constraintContain = constraints[0];
        constraintContain.isActive = false;
        var constraintAttachSwitchable = constraints[1];
        var constraintAttach = constraintAttachSwitchable.child;
        var entitySelector = uwpe.entity;
        var selector = entitySelector.selector();
        constraintAttach.targetEntityId = selector.entityForCursor.id;
        constraintAttachSwitchable.isActive = true;
    }
    // Visuals.
    static visualBuildAdult() {
        var dimension = 20;
        var bodyRadius = dimension / 2;
        var eyeRadius = bodyRadius / 2;
        var pupilRadius = eyeRadius / 2;
        var colors = Color.Instances();
        var visualBody = VisualCircle.fromRadiusAndColors(bodyRadius, colors.Brown, colors.Black);
        var visualEye = new VisualGroup([
            VisualCircle.fromRadiusAndColorFill(eyeRadius, colors.White),
            VisualCircle.fromRadiusAndColorFill(pupilRadius, colors.Black)
        ]);
        var visualEyeLeft = VisualOffset.fromOffsetAndChild(Coords.fromXY(-eyeRadius, 0), visualEye);
        var visualEyeRight = VisualOffset.fromOffsetAndChild(Coords.fromXY(eyeRadius, 0), visualEye);
        var visualBeak = VisualOffset.fromOffsetAndChild(Coords.fromXY(0, eyeRadius), VisualPolygon.fromVerticesAndColorFill([
            Coords.fromXY(-eyeRadius, 0),
            Coords.fromXY(eyeRadius, 0),
            Coords.fromXY(0, eyeRadius),
        ], colors.Yellow).shouldUseEntityOrientationSet(false));
        var visualComb = VisualOffset.fromOffsetAndChild(Coords.fromXY(pupilRadius, -bodyRadius), new VisualEllipse(eyeRadius / 2, eyeRadius, // horizontal, vertical semiaxes
        .125, // rotationInTurns
        colors.Red, null, // colors
        false // shouldUseEntityOrientation
        ));
        var returnValue = new VisualGroup([
            visualBody,
            visualEyeLeft,
            visualEyeRight,
            visualBeak,
            visualComb
        ]);
        return returnValue;
    }
    static visualBuildCorpse() {
        var dimension = 20;
        var bodyRadius = dimension / 2;
        var eyeRadius = bodyRadius / 2;
        var pupilRadius = eyeRadius / 2;
        var colors = Color.Instances();
        var visualBody = VisualCircle.fromRadiusAndColorFill(bodyRadius, colors.Gray);
        var eyeBagWidth = 3;
        var visualEye = new VisualGroup([
            VisualOffset.fromOffsetAndChild(Coords.fromXY(0, eyeBagWidth), new VisualCircle(eyeRadius, null, colors.Black, eyeBagWidth // borderThickness
            )),
            VisualCircle.fromRadiusAndColorFill(eyeRadius, colors.Gray),
            VisualCircle.fromRadiusAndColorFill(pupilRadius, colors.Black)
        ]);
        var visualEyeLeft = VisualOffset.fromOffsetAndChild(Coords.fromXY(-eyeRadius, 0), visualEye);
        var visualEyeRight = VisualOffset.fromOffsetAndChild(Coords.fromXY(eyeRadius, 0), visualEye);
        var visualBeak = VisualOffset.fromOffsetAndChild(Coords.fromXY(0, eyeRadius), VisualPolygon.fromVerticesAndColorFill([
            Coords.fromXY(-eyeRadius, 0),
            Coords.fromXY(eyeRadius, 0),
            Coords.fromXY(0, eyeRadius),
        ], colors.Yellow));
        var visualComb = VisualOffset.fromOffsetAndChild(Coords.fromXY(pupilRadius, -bodyRadius), new VisualEllipse(eyeRadius / 2, eyeRadius, // horizontal, vertical semiaxes
        .125, // rotationInTurns
        colors.Pink, null, // colors
        false // shouldUseEntityOrientation
        ));
        var returnValue = new VisualGroup([
            visualBody,
            visualEyeLeft,
            visualEyeRight,
            visualBeak,
            visualComb
        ]);
        return returnValue;
    }
    static visualBuildEgg() {
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
    static visualBuildJuvenile() {
        var dimension = 10;
        var bodyRadius = dimension / 2;
        var eyeRadius = bodyRadius / 2;
        var pupilRadius = eyeRadius / 2;
        var colors = Color.Instances();
        var visualBody = VisualCircle.fromRadiusAndColorFill(bodyRadius, colors.Yellow);
        var visualEye = new VisualGroup([
            VisualCircle.fromRadiusAndColorFill(eyeRadius, colors.White),
            VisualCircle.fromRadiusAndColorFill(pupilRadius, colors.Black)
        ]);
        var visualEyeLeft = VisualOffset.fromOffsetAndChild(Coords.fromXY(-eyeRadius, 0), visualEye);
        var visualEyeRight = VisualOffset.fromOffsetAndChild(Coords.fromXY(eyeRadius, 0), visualEye);
        var visualBeak = VisualOffset.fromOffsetAndChild(Coords.fromXY(0, eyeRadius), VisualPolygon.fromVerticesAndColorFill([
            Coords.fromXY(-eyeRadius, 0),
            Coords.fromXY(eyeRadius, 0),
            Coords.fromXY(0, eyeRadius),
        ], colors.Orange));
        var returnValue = new VisualGroup([
            visualBody,
            visualEyeLeft,
            visualEyeRight,
            visualBeak
        ]);
        return returnValue;
    }
    static visualBuildSenior() {
        var dimension = 20;
        var bodyRadius = dimension / 2;
        var eyeRadius = bodyRadius / 2;
        var pupilRadius = eyeRadius / 2;
        var colors = Color.Instances();
        var visualBody = VisualCircle.fromRadiusAndColorFill(bodyRadius, colors.Gray);
        var eyeBagWidth = 3;
        var visualEye = new VisualGroup([
            VisualOffset.fromOffsetAndChild(Coords.fromXY(0, eyeBagWidth), new VisualCircle(eyeRadius, null, colors.Black, eyeBagWidth // borderThickness
            )),
            VisualCircle.fromRadiusAndColorFill(eyeRadius, colors.White),
            VisualCircle.fromRadiusAndColorFill(pupilRadius, colors.Black)
        ]);
        var visualEyeLeft = VisualOffset.fromOffsetAndChild(Coords.fromXY(-eyeRadius, 0), visualEye);
        var visualEyeRight = VisualOffset.fromOffsetAndChild(Coords.fromXY(eyeRadius, 0), visualEye);
        var visualBeak = VisualOffset.fromOffsetAndChild(Coords.fromXY(0, eyeRadius), VisualPolygon.fromVerticesAndColorFill([
            Coords.fromXY(-eyeRadius, 0),
            Coords.fromXY(eyeRadius, 0),
            Coords.fromXY(0, eyeRadius),
        ], colors.Yellow));
        var visualComb = VisualOffset.fromOffsetAndChild(Coords.fromXY(pupilRadius, -bodyRadius), new VisualEllipse(eyeRadius / 2, eyeRadius, // horizontal, vertical semiaxes
        .125, // rotationInTurns
        colors.Pink, null, // colors
        false // shouldUseEntityOrientation
        ));
        var returnValue = new VisualGroup([
            visualBody,
            visualEyeLeft,
            visualEyeRight,
            visualBeak,
            visualComb
        ]);
        return returnValue;
    }
    // Instance methods.
    enclosure(place) {
        var pos = this.locatable().loc.pos;
        var enclosures = place.enclosures();
        var enclosureContaining = enclosures.filter((x) => x.boundable().bounds.containsPoint(pos))[0];
        return enclosureContaining;
    }
}
