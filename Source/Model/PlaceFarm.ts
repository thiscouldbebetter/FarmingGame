
class PlaceFarm extends Place
{
	constructor
	(
		enclosures: Enclosure[],
		feeds: Feed[],
		animals: Animal[]
	)
	{
		super
		(
			PlaceFarm.name,
			PlaceFarm.defnBuild().name,
			Coords.fromXY(400, 300), // size
			 // entities
			ArrayHelper.flattenArrayOfArrays
			([
				enclosures,
				feeds,
				animals,
				[ new UserInputListener() ]
			])
		);

		var enclosure0Box = enclosures[0].boundable().bounds as Box;
		animals.forEach(x =>
		{
			var constrainable = x.constrainable();
			var constraint =
				constrainable.constraints[0] as Constraint_Switchable;
			var constraintContain = constraint.child as Constraint_ContainInBox;
			constraintContain.boxToContainWithin = enclosure0Box;
		});
	}

	static defnBuild(): PlaceDefn
	{
		var actionInstances = Action.Instances();

		var actionDisplayRecorderStartStop = DisplayRecorder.actionStartStop();
		var actionEntityAtMouseClickPosSelect =
			Selector.actionEntityAtMouseClickPosSelect();
		var actionShowMenu = actionInstances.ShowMenuSettings;

		var actions =
		[
			actionDisplayRecorderStartStop,
			actionEntityAtMouseClickPosSelect,
			actionShowMenu
		];

		var inputNames = Input.Names();

		var actionToInputsMappings =
		[
			new ActionToInputsMapping
			(
				actionDisplayRecorderStartStop.name, [ "~" ], true // inactivate
			),

			ActionToInputsMapping.fromActionNameAndInputName
			(
				actionShowMenu.name, inputNames.Escape
			),

			ActionToInputsMapping.fromActionNameAndInputName
			(
				actionEntityAtMouseClickPosSelect.name, inputNames.MouseClick
			)
		];

		var entityPropertyNamesToProcess: string[] =
		[
			Actor.name,
			Collidable.name,
			Constrainable.name,
			Locatable.name,
			Phased.name,
			Selector.name
		];

		return PlaceDefn.from4
		(
			PlaceFarm.name,
			actions,
			actionToInputsMappings,
			entityPropertyNamesToProcess
		);
	}

	// Convenience methods.

	enclosures(): Enclosure[]
	{
		return this.entities.filter
		(
			(x: Entity) => (x.constructor.name == Enclosure.name)
		) as Enclosure[];
	}
}
