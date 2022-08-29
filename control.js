// function load_new_element(){
//     document.querySelector(".linker_one");
// }


var tabledata = [
    { id: 1, name: "Oli Bob", progress: 12, gender: "male", rating: 1, col: "red", dob: "19/02/1984", car: true },
    { id: 2, name: "Mary May", progress: 1, gender: "female", rating: 2, col: "blue", dob: "14/05/1982", car: true },
    { id: 3, name: "Christine Lobowski", progress: 42, gender: "female", rating: 0, col: "green", dob: "22/05/1982", car: false },
    { id: 4, name: "Brendon Philips", progress: 100, gender: "male", rating: 1, col: "orange", dob: "01/08/1980" , car: true},
    { id: 5, name: "Margret Marmajuke", progress: 16, gender: "female", rating: 5, col: "yellow", dob: "31/01/1999", car: false },
    { id: 6, name: "Frank Harbours", progress: 70, gender: "male", rating: 4, col: "red", dob: "12/05/1966", car: true },

    { id: 7, name: "Oli Bob", progress: 12, gender: "male", rating: 1, col: "red", dob: "19/02/1984", car: true },
    { id: 8, name: "Mary May", progress: 1, gender: "female", rating: 2, col: "blue", dob: "14/05/1982", car: true },
    { id: 9, name: "Christine Lobowski", progress: 42, gender: "female", rating: 0, col: "green", dob: "22/05/1982", car: true },
    { id: 10, name: "Brendon Philips", progress: 100, gender: "male", rating: 1, col: "orange", dob: "01/08/1980" , car: false},
    { id: 11, name: "Margret Marmajuke", progress: 16, gender: "female", rating: 5, col: "yellow", dob: "31/01/1999", car: false },
    { id: 12, name: "Frank Harbours", progress: 70, gender: "male", rating: 4, col: "red", dob: "12/05/1966", car: true },

    { id: 13, name: "Oli Bob", progress: 12, gender: "male", rating: 1, col: "red", dob: "19/02/1984", car: true },
    { id: 14, name: "Mary May", progress: 1, gender: "female", rating: 2, col: "blue", dob: "14/05/1982", car: false },
    { id: 15, name: "Christine Lobowski", progress: 42, gender: "female", rating: 0, col: "green", dob: "22/05/1982", car: true },
    { id: 16, name: "Brendon Philips", progress: 100, gender: "male", rating: 1, col: "orange", dob: "01/08/1980", car: false },
    { id: 17, name: "Margret Marmajuke", progress: 16, gender: "female", rating: 5, col: "yellow", dob: "31/01/1999", car: true },
    { id: 18, name: "Frank Harbours", progress: 70, gender: "male", rating: 4, col: "red", dob: "12/05/1966", car: true }
];

var rowMenu = [
    {
        label: "<i class='fas fa-trash'></i> Delete Row",
        action: function (e, row) {
            row.delete();
        }
    }
]



var headerMenu = function () {
    var menu = [];
    var columns = this.getColumns();

    for (let column of columns) {

        //create checkbox element using font awesome icons
        let icon = document.createElement("i");
        icon.classList.add("fas");
        icon.classList.add(column.isVisible() ? "fa-check-square" : "fa-square");

        //build label
        let label = document.createElement("span");
        let title = document.createElement("span");

        title.textContent = " " + column.getDefinition().title;

        label.appendChild(icon);
        label.appendChild(title);

        //create menu item
        menu.push({
            label: label,
            action: function (e) {
                //prevent menu closing
                e.stopPropagation();

                //toggle current column visibility
                column.toggle();

                //change menu item icon
                if (column.isVisible()) {
                    icon.classList.remove("fa-square");
                    icon.classList.add("fa-check-square");
                } else {
                    icon.classList.remove("fa-check-square");
                    icon.classList.add("fa-square");
                }
            }
        });
    }

    return menu;
};

var dateEditor = (cell, onRendered, success, cancel) => {
    //cell - the cell component for the editable cell
    //onRendered - function to call when the editor has been rendered
    //success - function to call to pass thesuccessfully updated value to Tabulator
    //cancel - function to call to abort the edit and return to a normal cell
    //create and style input
    var cellValue = luxon.DateTime.fromFormat(cell.getValue(), "dd/MM/yyyy").toFormat("yyyy-MM-dd"), input = document.createElement("input");

    input.setAttribute("type", "date");

    input.style.padding = "4px";
    input.style.width = "100%";
    input.style.boxSizing = "border-box";

    input.value = cellValue;

    onRendered(function () {
        input.focus();
        input.style.height = "100%";
    });

    function onChange() {
        if (input.value != cellValue) {
            success(luxon.DateTime.fromFormat(input.value, "yyyy-MM-dd").toFormat("dd/MM/yyyy"));
        } else {
            cancel();
        }
    }

    //submit new value on blur or change
    input.addEventListener("blur", onChange);

    //submit new value on enter
    input.addEventListener("keydown", function (e) {
        if (e.key == 13) {
            onChange();
        }

        if (e.key == 27) {
            cancel();
        }
    });

    return input;
};

//custom max min header filter
var minMaxFilterEditor = function(cell, onRendered, success, cancel, editorParams){

    var end;

    var container = document.createElement("span");

    //create and style inputs
    var start = document.createElement("input");
    start.setAttribute("type", "number");
    start.setAttribute("placeholder", "Min");
    start.setAttribute("min", 0);
    start.setAttribute("max", 100);
    start.style.padding = "4px";
    start.style.width = "50%";
    start.style.boxSizing = "border-box";

    start.value = cell.getValue();

    function buildValues(){
        success({
            start:start.value,
            end:end.value,
        });
    }

    function keypress(e){
        if(e.keyCode == 13){
            buildValues();
        }

        if(e.keyCode == 27){
            cancel();
        }
    }

    end = start.cloneNode();
    end.setAttribute("placeholder", "Max");

    start.addEventListener("change", buildValues);
    start.addEventListener("blur", buildValues);
    start.addEventListener("keydown", keypress);

    end.addEventListener("change", buildValues);
    end.addEventListener("blur", buildValues);
    end.addEventListener("keydown", keypress);


    container.appendChild(start);
    container.appendChild(end);

    return container;
 }

//custom max min filter function
function minMaxFilterFunction(headerValue, rowValue, rowData, filterParams){
    //headerValue - the value of the header filter element
    //rowValue - the value of the column in this row
    //rowData - the data for the row being filtered
    //filterParams - params object passed to the headerFilterFuncParams property

        if(rowValue){
            if(headerValue.start != ""){
                if(headerValue.end != ""){
                    return rowValue >= headerValue.start && rowValue <= headerValue.end;
                }else{
                    return rowValue >= headerValue.start;
                }
            }else{
                if(headerValue.end != ""){
                    return rowValue <= headerValue.end;
                }
            }
        }

    return true; //must return a boolean, true if it passes the filter.
}

// Sorting Variables
//Define variables for input elements
var fieldEl = document.getElementById("sort-field");
var dirEl = document.getElementById("sort-direction");


var table = new Tabulator("#players", {
    data: tabledata,
    index: "id",

    rowContextMenu: rowMenu,

    addRowPos:"bottom",

    rowFormatter:function(row){
        var data = row.getData(); //get data object for row

        if(data.gender == "male"){
            row.getElement().style.color = "blue"; //apply css change to row element
        }
        else if(data.gender == "female"){
            row.getElement().style.color = "red";
        }
    },

    selectable:true,

    columnDefaults:{
        selectable:true,
    },
    pagination:"local",
    paginationSize:6,
    paginationSizeSelector:[3, 6, 8, 10],
    paginationCounter:"rows",

    layout: "fitColumns",
    movableColumns: true,
    initialSort: [             //set the initial sort order of the data
        { column: "name", dir: "asc" },
    ],

    persistenceMode: "cookie",
    persistence: {
        columns: ["visible", "width"], //persist changes to the width, visible and frozen properties
        group: {
            groupBy: true,
        }
    },

    reactiveData: true, //enable reactive data EDIT /DELETE/ UPDATE / DATA

    // height:"311px",
    responsiveLayout:"hide",
    

    columns:[
        {title:"CheckBox", formatter:"rowSelection", titleFormatter:"rowSelection", align:"center", headerSort:false, width:200},

    {title:"Name", field:"name", width:200, responsive:0, editor: "input" , headerMenu: headerMenu, headerFilter:"input"}, //never hide this column
    { title: "Task Progress", field: "progress", hozAlign: "left",editor: true, formatter: "progress", editor: true, headerMenu: headerMenu , formatterParams:{
        min:0,
        max:100,
        color:["green", "orange", "red", "black","blue"],
        legendColor:"#000000",
        legendAlign:"center",
    }, headerFilter:minMaxFilterEditor, headerFilterFunc:minMaxFilterFunction, headerFilterLiveFilter:false , headerSortTristate:true},

    {title:"Gender", field:"gender",editor: "list", editorParams:{values:{"male":"Male", "female":"Female"}}, headerFilter:true, headerFilterParams:{values:{"male":"Male", "female":"Female", "":""}}, width:150, responsive:2, headerMenu: headerMenu,
    
    // formatter:"link", formatterParams:{
    //     labelField:"gender",
    //     url:"https://www.google.com/",
    //     target:"_blank",
    // },

    cellClick:function(e, cell){
        //e - the click event object
        //cell - cell component
        console.log(cell.getValue())
        // url = "https://www.google.com/";
        // window.open(url,'_blank');


    },}, //hide this column first

    {title:"Rating", field:"rating", hozAlign:"center",formatter: "star", hozAlign: "center", width: 100, editor: true, width:150, headerMenu: headerMenu, headerFilter:"number", headerFilterPlaceholder:"at least...", headerFilterFunc:">=" },

    {title:"Favourite Color", field:"col", width:150,editor: "input", headerMenu: headerMenu, headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}, 
     sorter:function(a,b){
        return String(a).toLowerCase().localeCompare(String(b).toLowerCase());
    }},

    {title:"Date Of Birth", field:"dob", hozAlign:"center", sorter:"date", width:150, editor: dateEditor, headerMenu: headerMenu, headerFilter:"input"},
    
    {title:"Driver", field:"car", hozAlign:"center", width:150,formatter: "tickCross", sorter: "boolean", editor: true, headerMenu: headerMenu,  headerFilter: "tickCross",  headerFilterParams:{"tristate":true},headerFilterEmptyCheck:function(value){return value === null}},
    ],
});


// Trigger Sort Button JS
//Trigger sort when "Trigger Sort" button is clicked
document.getElementById("sort-trigger").addEventListener("click", function(){
    table.setSort(fieldEl.options[fieldEl.selectedIndex].value, dirEl.options[dirEl.selectedIndex].value);
 });

//Add row on "Add Row" button click
document.getElementById("add-row").addEventListener("click", function(){
    table.addRow({});
});

//Delete row on "Delete Row" button click
document.getElementById("del-row").addEventListener("click", function(){
    table.deleteRow();
});

//Clear table on "Empty the table" button click
document.getElementById("clear").addEventListener("click", function(){
    table.clearData()
});

//Reset table contents on "Reset the table" button click
document.getElementById("reset").addEventListener("click", function(){
    table.setData(tabledata);
});





//  function selectedColumns(table){
//     var selectedData = table.getSelectedData();
//     console.log(selectedData);
//  }

// selectedColumns(table);

// Adding Element to the th table
// document.getElementById("add-row").addEventListener("click", function(){
//     table.addRow({});
// });

// document.getElementById("del-row").addEventListener("click", function(){
//     // table.deleteRow();
//     console.log(table.getData());
// });