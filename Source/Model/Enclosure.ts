
class Enclosure extends Entity
{
	constructor(name: string, color: Color, box: Box)
	{
		super
		(
			name,
			[
				new Boundable(box),
				Drawable.fromVisual
				(
					Enclosure.visualBuild(name, box.size, color)
				),
				Locatable.fromPos(box.center),
			]
		);
	}

	static visualBuild(name: string, size: Coords, color: Color): VisualBase
	{
		var colors = Color.Instances();
		var returnValue = new VisualGroup
		([
			VisualRectangle.fromSizeAndColorFill(size, color),
			VisualText.fromTextImmediateAndColors(name, colors.White, colors.Black),
		]);
		return returnValue;
	}
}
