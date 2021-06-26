
class Feed extends Entity
{
	constructor(pos: Coords)
	{
		super
		(
			Feed.name,
			[
				Drawable.fromVisual(Feed.visualBuild()),
				Locatable.fromPos(pos)
			]
		);
	}

	static visualBuild(): Visual
	{
		var cobLength = 10;
		var cobWidth = cobLength * 0.4;
		var colors = Color.Instances();

		var visualCob = new VisualEllipse
		(
			cobLength, cobWidth, // horizontal, vertical semiaxes
			0, // rotationInTurns
			colors.Yellow, colors.YellowDark, // colors
			false // shouldUseEntityOrientation
		);

		var returnValue = visualCob;

		return returnValue;
	}
}
