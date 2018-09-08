var DataGridColumn = function(p)
{
    var _defaultParams = {
        dataField: "",
        dataFieldToFilter: "",   
        headerText: "",
        sortOrder: 0,
        sortDirection: "ASC",//DESC
        sortable: true,
        itemRenderer: {
            constructor: DataGridCellRenderer,
            props: {
                id: 'cell_',
                label: '',
                hyperlink: false,
                target:null
            }
        },
        itemEditor: null,
        editable: false,
        cellStyleFunction: null,
        cellValueFunction: null
    };
    var props = extend(false, false, [],[],["itemRenderer", "itemEditor"], _defaultParams, p);

    this.dataField = props.dataField;
    this.dataFieldToFilter = props.dataFieldToFilter;   
	this.headerText = props.headerText;
	this.sortOrder = props.sortOrder;
    this.sortDirection = props.sortDirection;//DESC
    this.sortable = props.sortable;
    this.itemRenderer = props.itemRenderer;
    this.itemEditor = props.itemEditor;
    this.editable = props.editable;
    this.cellStyleFunction = props.cellStyleFunction;
    this.cellValueFunction = props.cellValueFunction;
}