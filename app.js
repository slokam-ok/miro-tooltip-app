miro.onReady(async () => {
    const tooltipForm = document.getElementById('tooltipForm');
    const tooltipText = document.getElementById('tooltipText');
    const positionSelect = document.getElementById('positionSelect');
    const saveTooltipBtn = document.getElementById('saveTooltipBtn');

    // Add event listener for saving tooltips
    saveTooltipBtn.addEventListener('click', async () => {
        const widgets = await miro.board.selection.get();
        if (widgets.length !== 1) {
            alert('Please select a single shape to set its tooltip.');
            return;
        }

        const selectedWidget = widgets[0];
        const tooltipContent = tooltipText.value.trim();
        const tooltipPosition = positionSelect.value;

        if (!tooltipContent) {
            alert('Tooltip content cannot be empty!');
            return;
        }

        // Save tooltip to widget metadata
        await miro.board.widgets.update({
            id: selectedWidget.id,
            metadata: {
                'tooltip-app': {
                    text: tooltipContent,
                    position: tooltipPosition,
                },
            },
        });

        alert('Tooltip saved successfully!');
    });

    // Listen for hover events on shapes
    miro.board.ui.on('widget:mouseover', async (event) => {
        const { data } = event;
        const widgetId = data.id;
        const widget = (await miro.board.widgets.get({ id: widgetId }))[0];

        const tooltipData = widget.metadata?.['tooltip-app'];
        if (tooltipData) {
            const { text, position } = tooltipData;

            miro.board.ui.openTooltip({
                widgetId: widgetId,
                content: text,
                placement: position || 'top',
            });
        }
    });

    miro.board.ui.on('widget:mouseout', () => {
        miro.board.ui.closeTooltip();
    });
});
