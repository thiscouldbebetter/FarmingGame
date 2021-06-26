
class Animal extends Entity
{
	constructor(pos: Coords)
	{
		super
		(
			Animal.name,
			[
				Actor.fromActivityDefnName(Animal.activityDefnBuild().name),
				Constrainable.fromConstraint(Animal.constraintBuild()),
				Drawable.fromVisual(Animal.visualBuild()),
				Locatable.fromPos(pos),
				Movable.fromAccelerationAndSpeedMax(.1, 3)
			]
		);
	}

	static activityDefnBuild(): ActivityDefn
	{
		var returnValue = new ActivityDefn
		(
			Animal.name,
			(uwpe: UniverseWorldPlaceEntities) =>
			{
				var entityActor = uwpe.entity;

				var actor = entityActor.actor();
				var activity = actor.activity;
				var targetEntity = activity.target() as Entity;
				if (targetEntity == null)
				{
					var place = uwpe.place as PlaceFarm;
					var randomizer = uwpe.universe.randomizer;

					var enclosures = place.enclosures();
					var enclosure = enclosures[0];
					var enclosureBounds = enclosure.boundable().bounds;

					var targetPos = enclosureBounds.posRandom(randomizer);

					targetEntity = new Entity
					(
						"Target", [ Locatable.fromPos(targetPos) ]
					);
					activity.targetSet(targetEntity);
				}

				var movable = entityActor.movable();
				var actorLocatable = entityActor.locatable();
				var targetLocatable = targetEntity.locatable();
				var distanceToTarget =
					actorLocatable.approachOtherWithAccelerationAndSpeedMax
					(
						targetLocatable,
						movable.accelerationPerTick,
						movable.speedMax
					);

				if (distanceToTarget < movable.speedMax)
				{
					activity.targetSet(null);
				}
			}
		);

		return returnValue;
	}

	static constraintBuild(): Constraint
	{
		return new Constraint_ContainInBox(null);
	}

	static visualBuild(): Visual
	{
		var dimension = 20;
		var bodyRadius = dimension / 2;
		var eyeRadius = bodyRadius / 2;
		var pupilRadius = eyeRadius / 2;
		var colors = Color.Instances();

		var visualBody = VisualCircle.fromRadiusAndColorFill
		(
			bodyRadius, colors.Brown
		);

		var visualEye = new VisualGroup
		([
			VisualCircle.fromRadiusAndColorFill
			(
				eyeRadius, colors.White
			),
			VisualCircle.fromRadiusAndColorFill
			(
				pupilRadius, colors.Black
			)
		]);

		var visualEyeLeft = VisualOffset.fromOffsetAndChild
		(
			Coords.fromXY(-eyeRadius, 0), visualEye
		);

		var visualEyeRight = VisualOffset.fromOffsetAndChild
		(
			Coords.fromXY(eyeRadius, 0), visualEye
		);

		var visualBeak = VisualOffset.fromOffsetAndChild
		(
			Coords.fromXY(0, eyeRadius),
			VisualPolygon.fromVerticesAndColorFill
			(
				[
					Coords.fromXY(-eyeRadius, 0),
					Coords.fromXY(eyeRadius, 0),
					Coords.fromXY(0, eyeRadius),
				],
				colors.Yellow
			)
		);

		var visualComb = VisualOffset.fromOffsetAndChild
		(
			Coords.fromXY(0, -bodyRadius),
			new VisualEllipse
			(
				eyeRadius / 2, eyeRadius, // horizontal, vertical semiaxes
				.125, // rotationInTurns
				colors.Red, null, // colors
				false // shouldUseEntityOrientation
			)
		);

		var returnValue = new VisualGroup
		([
			visualBody,
			visualEyeLeft,
			visualEyeRight,
			visualBeak,
			visualComb
		]);

		return returnValue;
	}
}
