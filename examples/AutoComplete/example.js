var myAutoComplete = new AutoCompleteEx({
    id: 'autocomplete',
    
    colspan: '9',
    label: 'Ministrite',
    blockProcessAttr: false,
    required: false,
    multipleSelection: true,
    valueField: "value",
    labelField: "ministri",
    allowNewItem: false, //allow the user to add items that are not included in the specified dataProvider
    dataProvider: [{
        "value": "1",
        "ministri": "Ministria e Puneve te Jashtme"
    }, {
        "value": "2",
        "ministri": "Ministria e Drejtesise"
    }, {
        "value": "3",
        "ministri": "Ministria e Brendshme"
    }],
    value: [{ "value": "1", "ministri": "Ministria e Puneve te Jashtme" }],
    remote:{
        getData_Action: "http://139.162.158.49/rca/index.php",
        recordsPerPage: 5
    }
});
myAutoComplete.on('creationComplete', function () {
    loader.hide();
});
$('#root').append(myAutoComplete.render());
/*
closeIconSide:"left",
itemRenderer:{
                constructor: CheckBox,
                props: {
                    id: 'checkbox',
                    colspan: '6',
                    label: 'Vertete',
                    fieldName: 'checkbox',
                    blockProcessAttr: false,
                    required: true,
                    value: '{id}',
                    checked: '{checkboxValue}',
                    unCheckedLabel:"Jo",
                    checkedLabel:"Po"
                }
            },
           

*/

