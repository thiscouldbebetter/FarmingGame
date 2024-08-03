
class WorldGame extends World
{
	constructor()
	{
		super
		(
			"FarmingGame",
			DateTime.now(),
			WorldGame.defnBuild(),
			(placeName) => WorldGame.placeBuild(),
			"" // placeInitialName
		);
	}

	static defnBuild(): WorldDefn
	{
		var activityDefns = ActivityDefn.Instances();
		return new WorldDefn
		([
			[
				activityDefns.DoNothing,
				Animal.activityDefnBuildAdult(),
				UserInputListener.activityDefn()
			],
			[
				PlaceFarm.defnBuild()
			]
		]);
	}

	static placeBuild(): Place
	{
		var colors = Color.Instances();

		var returnValue = new PlaceFarm
		(
			[
				new Enclosure
				(
					"Field",
					colors.GreenDark,
					Box.fromMinAndSize
					(
						Coords.fromXY(10, 100), // min
						Coords.fromXY(280, 190) // size
					)
				),
				new Enclosure
				(
					"Hatchery",
					colors.Brown,
					Box.fromMinAndSize
					(
						Coords.fromXY(300, 100), // min
						Coords.fromXY(90, 190) // size
					)
				),
				new Enclosure
				(
					"Shipping",
					colors.Gray,
					Box.fromMinAndSize
					(
						Coords.fromXY(10, 10), // min
						Coords.fromXY(280, 80) // size
					)
				),

				new Enclosure
				(
					"Status",
					colors.GrayDark,
					Box.fromMinAndSize
					(
						Coords.fromXY(300, 10), // min
						Coords.fromXY(90, 80) // size
					)
				)
			],
			[
				new Feed(Coords.fromXY(100, 220))
			],
			[
				new Animal(Coords.fromXY(50, 150))
			],
		);

		return returnValue;
	}

	toControl(): ControlBase
	{
		return new ControlNone();
	}
}
