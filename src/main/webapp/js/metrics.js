<<<<<<< HEAD
/* global jQuery, echarts, metrics, metricsTree */
(function ($) {
    var maxLOC = Math.max(...metrics.map(d => d.metrics.LOC));
    var childRows = {};
    var columnsVisible = {};

    function hashCode(data) {
        var hash = 0, i, chr;
        if (data.length === 0) return hash;
        for (i = 0; i < data.length; i++) {
            chr = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
=======
/* global jQuery, echarts, metrics, metricsTree, math */
(function ($) {
    var maxLOC = Math.max(...metrics.map(d => d.metrics.LOC));
    var childTables = {};
    var columnsVisible = {};
    var visibleColumns = [];

    $.fn.dataTable.ext.search.push(
        function (settings, rawData, dataIndex) {
            var data = {
                ATFD: rawData[3],
                CLASS_FAN_OUT: rawData[4],
                LOC: rawData[5],
                NCSS: rawData[6],
                NOAM: rawData[7],
                NOPA: rawData[8],
                TCC: rawData[9],
                WMC: rawData[10],
                WOC: rawData[11],
                ISSUES: rawData[12]
            };

            var filter = $('#table-filter').val() || 'true';
            return math.evaluate(filter, data);
        }
    );

    $.fn.dataTable.Api.registerPlural('columns().names()', 'column().name()', function (setter) {
        return this.iterator('column', function (settings, column) {
            var col = settings.aoColumns[column];

            if (setter !== undefined) {
                col.sName = setter;
                return this;
            } else {
                return col.sName;
            }
        }, 1);
    });
>>>>>>> a18675184... metrics analysis

    $(document).ready(function () {
        var table = $('#lines-of-code').DataTable({
            data: metrics,
            columns: [
                {
                    className: '',
                    orderable: false,
                    data: null,
                    defaultContent: "<div class='details-control'/>"
                },
                {
                    data: 'packageName',
                    name: 'packageName',
                    defaultContent: ''
                },
                {
                    data: 'className',
                    name: 'className',
                    defaultContent: ''
                },
                {
                    data: 'metrics.ATFD',
                    name: 'metrics.ATFD',
                    defaultContent: ''
                },
                {
                    data: 'metrics.CLASS_FAN_OUT',
                    name: 'metrics.CLASS_FAN_OUT',
                    defaultContent: ''
                },
                {
                    data: 'metrics.LOC',
                    name: 'metrics.LOC',
                    defaultContent: ''
                },
                {
                    data: 'metrics.NCSS',
                    name: 'metrics.NCSS',
                    defaultContent: ''
                },
                {
                    data: 'metrics.NOAM',
                    name: 'metrics.NOAM',
                    defaultContent: ''
                },
                {
                    data: 'metrics.NOPA',
                    name: 'metrics.NOPA',
                    defaultContent: ''
                },
                {
                    data: 'metrics.TCC',
                    name: 'metrics.TCC',
                    defaultContent: '',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                },
                {
                    data: 'metrics.WMC',
                    name: 'metrics.WMC',
                    defaultContent: ''
                },
                {
                    data: 'metrics.WOC',
                    name: 'metrics.WOC',
                    defaultContent: '',
                    render: $.fn.dataTable.render.number(',', '.', 2)
<<<<<<< HEAD
=======
                },
                {
                    data: 'metrics.ISSUES',
                    name: 'metrics.ISSUES',
                    defaultContent: ''
>>>>>>> a18675184... metrics analysis
                }
            ],
            columnDefs: [
                {
                    targets: 0,
                    width: '10px'
                },
                {
                    targets: 5,
                    createdCell: function (td, cellData, _rowData, _row, _col) {
                        var lightness = (1 - cellData / maxLOC) * 60 + 35;
                        $(td).css('background', 'hsl(0, 100%, ' + lightness + '%)');
                    }
                }
            ]
        });

<<<<<<< HEAD
=======
        $('#table-filter').keyup(function () {
            table.draw();
        });

>>>>>>> a18675184... metrics analysis
        // Add event listener for opening and closing details
        $('#lines-of-code tbody').on('click', 'div.details-control', function () {
            var tr = $(this).closest('tr');
            var row = table.row(tr);

            if (row.child.isShown()) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');

<<<<<<< HEAD
                delete childRows[row.index()];
=======
                delete childTables[row.index()];
>>>>>>> a18675184... metrics analysis
            } else {
                // Open this row
                var child = '<table id="lines-of-code_' + row.index() + '" class="ml-5">' +
                    '<thead>' +
                    '<th>Method</th>' +
                    '<th>Lines of Code</th>' +
                    '<th>Non-comment</th>' +
                    '</thead>' +
                    '</table>';

                row.child(child).show();
                tr.addClass('shown');

<<<<<<< HEAD
                childRows[row.index()] = $('#lines-of-code_' + row.index()).DataTable({
=======
                childTables[row.index()] = $('#lines-of-code_' + row.index()).DataTable({
>>>>>>> a18675184... metrics analysis
                    info: false,
                    paging: false,
                    searching: false,
                    data: row.data().children,
                    columns: [
                        {
                            data: 'methodName',
                            name: 'methodName'
                        },
                        {
                            data: 'metrics.LOC',
                            name: 'metrics.LOC',
                            visible: columnsVisible['metrics.LOC:name'] !== false
                        },
                        {
                            data: 'metrics.NCSS',
                            name: 'metrics.NCSS',
                            visible: columnsVisible['metrics.NCSS:name'] !== false
                        }
                    ]
                });
            }
        });

        // toggle column visibility
<<<<<<< HEAD
        $('input.column-toggle').on('click', function (e) {
            var columnName = $(this).attr('data-column-id') + ':name';

            columnsVisible[columnName] = e.target.checked;

            table.column(columnName).visible(e.target.checked);

            Object.values(childRows)
                .forEach(childRow => childRow.column(columnName).visible(e.target.checked));
=======
        function changeVisibility() {
            if (this.name() === '' || this.name() === 'packageName' || this.name() === 'className') {
                return;
            }

            if (this.visible() && visibleColumns.indexOf(this.name()) <= -1) {
                this.visible(false);
            } else if (!this.visible() && visibleColumns.indexOf(this.name()) > -1) {
                this.visible(true);
            }
        }

        $('#column-picker').on('changed.bs.select', function (e, _clickedIndex, _isSelected, _previousValue) {
            visibleColumns = $(e.target).val();

            // change visibilities in main table
            table.columns().every(changeVisibility);

            // change visibilities in child tables
            Object.values(childTables)
                .forEach(childTable => childTable.columns().every(changeVisibility));
>>>>>>> a18675184... metrics analysis
        });

        /* ------------------------------------------------------------------------------
                                            tree chart
         ------------------------------------------------------------------------------ */

        var formatUtil = echarts.format;

<<<<<<< HEAD
        echarts
=======
        var treeChart = echarts
>>>>>>> a18675184... metrics analysis
            .init(document.getElementById('treechart'))
            .setOption({
                title: {
                    text: 'Lines of Code',
                    left: 'center'
                },

                tooltip: {
                    formatter: function (info) {
                        var treePathInfo = info.treePathInfo;
                        var treePath = [];

                        for (var i = 1; i < treePathInfo.length; i++) {
                            treePath.push(treePathInfo[i].name);
                        }

                        return '<b>' + formatUtil.encodeHTML(treePath.join('.')) + '</b><br/>' +
                            formatUtil.addCommas(info.value) + ' Lines';
                    }
                },

                series: [
                    {
                        name: 'Lines of Code',
                        type: 'treemap',
                        label: {
                            show: true,
                            formatter: '{b}'
                        },
                        itemStyle: {
                            normal: {
                                borderColor: '#aaa',
                                gapWidth: 4
                            }
                        },
                        levels: [
                            {
                                // top level empty
                            },
                            {
                                itemStyle: {
                                    normal: {
                                        borderColor: '#888',
                                        borderWidth: 5,
                                        gapWidth: 5
                                    }
                                }
                            }
                        ],
<<<<<<< HEAD
                        data: metricsTree
                    }
                ]
            });
=======
                        data: [metricsTree]
                    }
                ]
            });

        $(window).on('resize', function () {
            if (treeChart) {
                treeChart.resize();
            }
        });
>>>>>>> a18675184... metrics analysis
    });
})(jQuery);
