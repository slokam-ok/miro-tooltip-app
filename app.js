miro.onReady(() => {
  console.log('App is ready!');
  const appButton = document.getElementById('my-app-button');
  appButton.addEventListener('click', async () => {
    const selectedShapes = await miro.board.selection.get();  // Fetch selected shapes
    console.log('Selected Shapes:', selectedShapes);

    if (selectedShapes.length > 0) {
      createTooltip(selectedShapes);
    } else {
      alert('Please select a shape first.');
    }
  });
});

function createTooltip(selectedShapes) {
  selectedShapes.forEach(async (shape) => {
    // Adjust the logic if it's a specific type of shape (like sticky notes)
    const tooltipText = "Your tooltip text here."; // You can dynamically set this
    const position = 'top';  // Customize tooltip position

    // Create the tooltip (new sticky note as a tooltip)
    try {
      const tooltipWidget = await miro.board.widgets.create({
        type: 'sticky_note',
        text: tooltipText,
        x: shape.x + 20,  // Offset to position it near the selected shape
        y: shape.y - 50,  // Position the tooltip above the shape
        width: 200,
        height: 100,
      });
      console.log('Tooltip created:', tooltipWidget);
    } catch (error) {
      console.error('Error creating tooltip:', error);
    }
  });
}
