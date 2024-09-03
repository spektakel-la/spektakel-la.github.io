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

    const dropEmptyColumns = (tableElement) => {
        const rows = tableElement.getElementsByTagName("tr");

        if (rows.length === 0) {
            return; // Keine Zeilen in der Tabelle
        }
        let cellsToRemove = [];

        const columns = rows[0].getElementsByTagName("th").length; // Anzahl der Spalten anhand der Headerzeilen
        for (let col = 0; col < columns; col++) {
            let empty = true;
            for (var i = 1; i < rows.length; i++) {
                var cell = rows[i].getElementsByTagName("td")[col];
                if (cell && cell.innerText.trim() !== "") {
                    empty = false;
                    break;
                }
            }

            if (empty) {
                for (var i = 0; i < rows.length; i++) {
                    const row = rows[i];
                    var cell = row.getElementsByTagName("th")[col] || row.getElementsByTagName("td")[col];
                    if (cell) {
                        cellsToRemove.push(cell);
                    }
                }
            }
        }

        // Entferne die gesammelten Zellen außerhalb der Schleife
        cellsToRemove.forEach(cell => cell.parentNode.removeChild(cell));
    };

    const dropEmptyRows = (tableElement) => {
        const rows = tableElement.getElementsByTagName("tr");

        if (rows.length === 0) {
            return; // Keine Zeilen in der Tabelle
        }
        let rowsToRemove = [];

        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            let empty = true;
            for (var j = 0; j < row.cells.length; j++) {
                const innerText = row.cells[j].innerText;
                const isCellTimeInfo = /\d{2}:\d{2}/.test(innerText);
                const isCellEmpty = innerText.trim() === "";
                if (!isCellTimeInfo && !isCellEmpty) {
                    empty = false;
                    break;
                }
            }

            if (empty) {
                rowsToRemove.push(row);
            }
        }

        // Entferne die gesammelten Zeilen außerhalb der Schleife
        rowsToRemove.forEach(row => row.parentNode.removeChild(row));
    };

    const highlightTimeInfoCell = (tableElement, className) => {
        const rows = tableElement.getElementsByTagName("tr");
        if (rows.length < 1) {
            return; // Keine Zeilen in der Tabelle
        }

        // Altes highlight entfernen
        const oldHighlightedInfoCell = tableElement.querySelector(className);
        if(oldHighlightedInfoCell){
            oldHighlightedInfoCell?.classList.remove(className);
        }

        for (var i = 1; i < rows.length; i++) {
            var row = rows[i];
            const timeInfoCell = row.cells[0];
            const datetimeString = timeInfoCell.dataset?.datetime;
            if (datetimeString) {
                const rowTime = dateFns.parseISO(datetimeString);
                const rowTimePlus30 = dateFns.addMinutes(rowTime, 30);
                const now = new Date();
                const isNowInRow = (dateFns.isEqual(now, rowTime) || dateFns.isAfter(now, rowTime)) &&
                                    dateFns.isBefore(now, rowTimePlus30);

                // Neues highlight setzen
                if (isNowInRow) {
                    timeInfoCell.classList.add(className);
                }
            }
        }
    };

    const scrollToLocationId = (tableElement, locationId) => {
        const column = tableElement.querySelector(`th[data-location-id="${locationId}"]`);
        if (column) {
            const container = tableElement.parentElement;
            const stickyColumnWidth = tableElement.querySelector("thead th:first-child").offsetWidth;
            const columnLeft = column.offsetLeft;
            const columnRight = columnLeft + column.offsetWidth;

            // Prüfen, ob die Spalte sichtbar ist
            if (columnRight > container.scrollLeft + container.clientWidth) {
                // Scrollen, sodass die Spalte am rechten Rand sichtbar wird
                container.scrollTo({ left: columnRight - container.clientWidth, behavior: 'smooth' });
            } else if (columnLeft < container.scrollLeft + stickyColumnWidth) {
                // Scrollen, sodass die Spalte am linken Rand sichtbar wird, aber sticky Spalte beachten
                container.scrollTo({ left: columnLeft - stickyColumnWidth, behavior: 'smooth' });
            }
        }
    };

    /*
     * Namespace setup
     */
    const spektakel = window.spektakel || {};
    spektakel.program = (function() {
        return {
            dropEmptyColumns,
            dropEmptyRows,
            mergeTableCells,
            highlightTimeInfoCell,
            scrollToLocationId
        }
    })();
    window.spektakel = spektakel;
})();