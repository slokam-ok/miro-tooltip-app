miro.onReady(() => {
    // Set up app button functionality (toolbar button click event).
    const appButton = document.getElementById('my-app-button');
    
    appButton.addEventListener('click', async () => {
        try {
            // Get selected shapes from the board
            const selectedShapes = await miro.board.selection.get();
            console.log('Selected Shapes:', selectedShapes);

            // If no shape is selected, alert the user to select one
            if (selectedShapes.length === 0) {
                alert('No shape selected. Please select a shape first.');
                return;
            }

            // Prompt the user for tooltip text (Rich HTML possible)
            const tooltipText = prompt('Enter your HTML formatted tooltip text for the selected shape(s):');
            if (!tooltipText || tooltipText === '') {
                alert('No tooltip entered. Please enter valid tooltip text.');
                return;
            }

            // Ask the user for the tooltip position (customizable)
            const position = prompt('Enter tooltip position (top, bottom, left, or right):');
            if (!['top', 'bottom', 'left', 'right'].includes(position.toLowerCase())) {
                alert('Invalid position! Defaulting to "top".');
                position = 'top';
            }

            // Create the tooltip for each selected shape
            selectedShapes.forEach(async (shape) => {
                await createTooltip(shape, tooltipText, position);
            });

        } catch (error) {
            console.error('Error getting selected shapes:', error);
        }
    });
});

/**
 * Create the tooltip near the selected shape with position.
 * This function allows rich HTML content in the tooltip and persists across board refreshes.
 * @param {Object} shape - The selected shape on the board.
 * @param {string} tooltipText - The tooltip content (can include HTML).
 * @param {string} position - Where to position the tooltip (top, bottom, left, right).
 */
async function createTooltip(shape, tooltipText, position) {
    try {
        // Default offset value for positioning
        const offset = 20;
        let xPos = shape.x;
        let yPos = shape.y;

        // Calculate position based on user input
        if (position === 'top') {
            yPos -= shape.height + offset;
        } else if (position === 'bottom') {
            yPos += shape.height + offset;
        } else if (position === 'left') {
            xPos -= shape.width + offset;
        } else if (position === 'right') {
            xPos += shape.width + offset;
        }

        // Create the sticky note widget with rich HTML content (tooltip)
        const tooltipWidget = await miro.board.widgets.create({
            type: 'sticky_note',
            text: tooltipText, // Tooltip with rich HTML text
            x: xPos,
            y: yPos,
            width: 200, // Tooltip width
            height: 100, // Tooltip height
        });

        // Storing metadata with persistent tooltip
        await miro.board.widgets.update({
            id: tooltipWidget.id,
            metadata: {
                tooltip: tooltipText, // Store tooltip data as metadata
                position: position, // Store position for future enhancements
            }
        });

        console.log('Tooltip created:', tooltipWidget);
    } catch (error) {
        console.error('Error creating tooltip:', error);
    }
}
