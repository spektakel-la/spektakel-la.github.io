(function () {
    const cellsAreEqual = (cellA, cellB) => {
        const artistA = cellA?.querySelector('span[itemprop="name"]')?.innerText;
        const artistB = cellB?.querySelector('span[itemprop="name"]')?.innerText;
        return (artistA && artistB) && (artistA === artistB);
    }

    const mergeTableCells = (tableElement) => {
        var rows = tableElement.getElementsByTagName("tr");

        if (rows.length === 0) {
            return; // Keine Zeilen in der Tabelle
        }
        let cellsToRemove = [];

        const columns = rows[0].getElementsByTagName("th").length; // Anzahl der Spalten anhand der Headerzeilen

        for (let col = 0; col < columns; col++) {
            let lastCell;
            let rowspanCount = 1;

            for (var i = 1; i < rows.length; i++) {
                var cell = rows[i].getElementsByTagName("td")[col];
                if (cell) {
                    if (cellsAreEqual(cell, lastCell)) {
                        rowspanCount++;
                        lastCell.rowSpan = rowspanCount;
                        cellsToRemove.push(cell); // Sammle die Zellen, die entfernt werden sollen
                    } else {
                        lastCell = cell;
                        rowspanCount = 1;
                    }
                }
            }
        }

        // Entferne die gesammelten Zellen außerhalb der Schleife
        cellsToRemove.forEach(cell => cell.parentNode.removeChild(cell));
    };


    /*
     * Namespace setup
     */
    const spektakel = window.spektakel || {};
    spektakel.program = (function() {
        return {
            mergeTableCells
        }
    })();
    window.spektakel = spektakel;
})();