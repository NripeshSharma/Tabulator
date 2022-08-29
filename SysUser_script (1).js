////////////////////////////////////////////////////////////////////////////

// FileName SysUser_script.js: SysUser Javascript file

// Author : Yash | JRC
// Description : Schule ERP 0.57


////////////////////////////////////////////////////////////////////////////

var SysUserScript = (function () {

	// console.log("Hi I am function")
	loadTabContent()
	// Stores the field of the parent form
	var formField;

	// Is true if the form is launched from another form, as child form
	var isChildForm = false;

	// Instance stores a reference to the Singleton
	var instance;

	//Url
	var URL = "/SysUserDataHandler";

	//table relation attributes
	var REL = "SysUserDetails";
	var FORM_ID = "edit_sys_user_form";

	//Data Store : declare local data store objects.
	var LOCAL_DATA = {};
	//Data table instance
	var DATA_TABLE;

	//Add/Edit Form Dimension
	var ADDFORM_HEIGHT = 'auto';	// $(window).height();
	var ADDFORM_WIDTH = 'auto';	// $(window).width();
	//--------------Table row index:-----------------

	var value = 0;

	var INDEX = {
		// -1
		SYS_USER_ID: value++,		// 0
		NAME: value++,		// 1
		MOBILE_NUMBER: value++,		// 2
		MOBILE_NUMBER_2: value++,		// 3
		EMAIL: value++,		// 4
		ADDRESS: value++,		// 5
		CITY_ID: value++,		// 6
		STATE_ID: value++,		// 7
		COUNTRY_ID: value++,		// 8
		LATITUDE: value++,		// 9
		LONGITUDE: value++,		// 10
		LAST_LOGIN_DATE: value++,		// 11
		USAGE_COUNT: value++,		// 12
		PROPERTIES: value++,		// 13
		ACTIVE_LOOKUP_ID: value++,		// 14
		PASSWORD: value++,		// 15
		SALT: value++,		// 16
		NOTIFICATION_TOKEN: value++		// 17
	};

	//-------------Table Header Label----------------------

	var LABEL = {

		SYS_USER_ID: "Sys User",
		NAME: "Name",
		MOBILE_NUMBER: "Mobile Number",
		MOBILE_NUMBER_2: "Mobile Number 2",
		EMAIL: "Email",
		ADDRESS: "Address",
		CITY_ID: "City",
		STATE_ID: "State",
		COUNTRY_ID: "Country",
		LATITUDE: "Latitude",
		LONGITUDE: "Longitude",
		LAST_LOGIN_DATE_DATE: "Last Login Date Date",
		LAST_LOGIN_DATE_TIME: "Last Login Date Time",
		USAGE_COUNT: "Usage Count",
		PROPERTIES: "Properties",
		ACTIVE_LOOKUP_ID: "Active",
		PASSWORD: "Password",
		SALT: "Salt",
		NOTIFICATION_TOKEN: "Notification Token"
	};

	/* SUMMARY_UNCOMMENT
	
	//index can change based on the pojo so that's why we migh need it
	value = 0;
	const SUMMARY_INDEX = {
		
		FEE_TEMPLATE_ID : value++
		.... this keeps on goiing as per summary pojo
	}
	
	//if the labels needs changed like two merged into one then better use summary pojo
	const SUMMARY_LABEL = {
		FEE_TEMPLATE_ID : "ID",
		.... this keeps on goiing as per summary pojo
	}
	
	SUMMARY_UNCOMMENT */

	//-----------------------------Default values------------------------------------
	//// TODO: Assign group_lookup_id of Lookup forign keys
	var DEFAULT = {

		SYS_USER_ID: 0,
		NAME: "",
		MOBILE_NUMBER: "",
		MOBILE_NUMBER_2: "",
		EMAIL: "",
		ADDRESS: "",
		CITY_ID: 0,
		STATE_ID: 0,
		COUNTRY_ID: 0,
		LATITUDE: 0.0,
		LONGITUDE: 0.0,
		LAST_LOGIN_DATE_DATE: "",
		LAST_LOGIN_DATE_TIME: "12:00 PM",
		USAGE_COUNT: 0,
		PROPERTIES: 0,
		// ACTIVE_LOOKUP_ID: LOOKUP_GROUP_VALUES.ACTIVE_LOOKUP_ID,
		PASSWORD: "",
		SALT: "",
		NOTIFICATION_TOKEN: ""
	};

	//-----------------------------Form Elements------------------------------------
	var FORM_FIELD = {

		SYS_USER_ID: `#${FORM_ID} input[name=sys_user_id]`,
		NAME: `#${FORM_ID} input[name=name]`,
		MOBILE_NUMBER: `#${FORM_ID} input[name=mobile_number]`,
		MOBILE_NUMBER_2: `#${FORM_ID} input[name=mobile_number_2]`,
		EMAIL: `#${FORM_ID} input[name=email]`,
		ADDRESS: `#${FORM_ID} textarea[name=address]`,
		CITY_ID: `#${FORM_ID} select[name=city_id]`,
		STATE_ID: `#${FORM_ID} select[name=state_id]`,
		COUNTRY_ID: `#${FORM_ID} select[name=country_id]`,
		LATITUDE: `#${FORM_ID} input[name=latitude]`,
		LONGITUDE: `#${FORM_ID} input[name=longitude]`,
		LAST_LOGIN_DATE_DATE: `#${FORM_ID} input[name=last_login_date_date]`,
		LAST_LOGIN_DATE_TIME: `#${FORM_ID} input[name=last_login_date_time]`,
		USAGE_COUNT: `#${FORM_ID} input[name=usage_count]`,
		PROPERTIES: `#${FORM_ID} input[name=properties]`,
		SET_PROPERTIES_FEATURES: `#${FORM_ID} #set_properties_features`,
		ACTIVE_LOOKUP_ID: `#${FORM_ID} select[name=active_lookup_id]`,
		PASSWORD: `#${FORM_ID} input[name=password]`,
		SALT: `#${FORM_ID} input[name=salt]`,
		NOTIFICATION_TOKEN: `#${FORM_ID} textarea[name=notification_token]`
	};
	/*------------------------- Load Dependents---------------------------------------*/
	function loadDependents(option) {
		console.log("I am loadDependents")
		//updateCityData({callback : function(){
		if (undefined !== option)
			option.callback();
		//}});
	}

	//get SysUser data
	function getStorageData() {
		//get data from global storage
		if (typeof (Storage) !== "undefined") {
			// Code for localStorage/sessionStorage.
			if (sessionStorage.getItem(REL + '_data')) {
				var jsonString = sessionStorage.getItem(REL + '_data');
				//return jQuery.parseJSON(jsonString);
				return JSON.parse(jsonString);
			} else {
				return null;
			}
		} else {
			// Sorry! No Web Storage support..
			if (LOCAL_DATA.json) {
				return LOCAL_DATA.json;
			}
			return null;
		}
	}
	//set SysUser data
	function setStorageData(json) {
		//set data from global storage
		if (typeof (Storage) !== "undefined") {
			// Code for localStorage/sessionStorage.
			if (sessionStorage.getItem(REL + '_data')) {
				sessionStorage.removeItem(REL + '_data');
				sessionStorage.setItem(REL + '_data', JSON.stringify(json));
			}
			else {
				sessionStorage.setItem(REL + '_data', JSON.stringify(json));
			}
		}
		else {
			// Sorry! No Web Storage support..
			LOCAL_DATA.json = json;
		}
	}
	//		---------------HANDLERS SECTION --------------------


	//	bind event handlers when form is opened
	function bindFormEventHandlers() {
		//$( FORM_FIELD.FIELDNAME ).change(onFieldNameChange);

		$(FORM_FIELD.SET_PROPERTIES_FEATURES).click(function () {

			var lookup_group_id = 0; // LOOKUP_VALUES.SOME_LOOKUP_VALUE
			dialogFeatures($(FORM_FIELD.PROPERTIES), "Set Properties Feature", lookup_group_id);
		});




	}
	/*async*/ function loadTabContent() {

		console.log("Hi I am loadTabContent");

		/*		
				var city = CityScript.getInstance();
				city.getData();
		
				var state = StateScript.getInstance();
				state.getData();
		
				var country = CountryScript.getInstance();
				country.getData();
				
				var lookup = LookupScript.getInstance();
				lookup.getData();
		
				LookupScript.getInstance().getData(); // for Bit field definition
		*/
		createTabulator();

		//create table will fetch the data
		//createTable( 0, getFilterObject() );

		// loadDependents();

		// bindFormEventHandlers();
	}

	// CALL this function on HTML init or on a button click

	function createTabulator() {

		console.log("This is create Tabulator");

		// var allData = "{\"values\":[[1,\"Joydeep RC\",\"Developer\",\"<a href='#' class='_sendsms'>919035230847</a>\",\"<a href='#' class='_sendemail'>joydeep@gmail.com</a>\",\"17-Jun-2022 06:05 PM\",23,10],[2,\"Developer\",\"Developer\",\"<a href='#' class='_sendsms'>919066841400</a>\",\"<a href='#' class='_sendemail'>developer@gmail.com</a>\",\"28-Oct-2020 07:55 PM\",23,10],[3,\"VMS Admin\",\"Admin\",\"<a href='#' class='_sendsms'>917002252743</a>\",\"<a href='#' class='_sendemail'>admin@vms.com</a>\",\"\",23,11]],\"status_code\":0}";

		/*			
		{
		  "values": [
			[
			  1,
			  "Joydeep RC",
			  "Developer",
			  "<a href='#' class='_sendsms'>919035230847</a>",
			  "<a href='#' class='_sendemail'>joydeep@gmail.com</a>",
			  "17-Jun-2022 06:05 PM",
			  23,
			  10
			],
			[
			  2,
			  "Developer",
			  "Developer",
			  "<a href='#' class='_sendsms'>919066841400</a>",
			  "<a href='#' class='_sendemail'>developer@gmail.com</a>",
			  "28-Oct-2020 07:55 PM",
			  23,
			  10
			],
			[
			  3,
			  "VMS Admin",
			  "Admin",
			  "<a href='#' class='_sendsms'>917002252743</a>",
			  "<a href='#' class='_sendemail'>admin@vms.com</a>",
			  "",
			  23,
			  11
			]
		  ],
		  "status_code": 0
		}		
				
		*/
		//{"values":[[1,"Joydeep RC","Developer","<a href='#' class='_sendsms'>919035230847</a>","<a href='#' class='_sendemail'>joydeep@gmail.com</a>","17-Jun-2022 06:05 PM",23,10],[2,"Developer","Developer","<a href='#' class='_sendsms'>919066841400</a>","<a href='#' class='_sendemail'>developer@gmail.com</a>","28-Oct-2020 07:55 PM",23,10],[3,"VMS Admin","Admin","<a href='#' class='_sendsms'>917002252743</a>","<a href='#' class='_sendemail'>admin@vms.com</a>","",23,11]],"status_code":0}

		var allData = { "values": [[1, "Joydeep RC", "Developer", "<a href='#' class='_sendsms' >919035230847</a>", "<a href='#' class='_sendemail'>joydeep@gmail.com</a>", "17-Jun-2022 06:05 PM", 23, 10], [2, "Developer", "Developer", "<a href='#' class='_sendsms'>919066841400</a>", "<a href='#' class='_sendemail'>developer@gmail.com</a>", "28-Oct-2020 07:55 PM", 23, 10], [3, "VMS Admin", "Admin", "<a href='#' class='_sendsms'>917002252743</a>", "<a href='#' class='_sendemail'>admin@vms.com</a>", "", 23, 11]], "status_code": 0 };

		// for (let i = 0; i < allData.values[0].length; i++) {
		// 	console.log(allData.values[0][i]);
		// }


		// let a = "<a href='#' class='_sendsms' >919035230847</a>"
		function addStr(str, index, stringToAdd) {
			return str.substring(0, index) + stringToAdd + str.substring(index, str.length);
		}

		// let b = addStr(a, 28," data-toggle='modal' data-target='#exampleModal'" )
		// console.log(b);

		// " data-toggle='modal' data-target='#exampleModal' "


		allData.values[0][3] = addStr(allData.values[0][3], 28, " data-toggle='modal' data-target='#exampleModal'")
		allData.values[1][3] = addStr(allData.values[1][3], 28, " data-toggle='modal' data-target='#exampleModal'")
		allData.values[2][3] = addStr(allData.values[2][3], 28, " data-toggle='modal' data-target='#exampleModal'")

		allData.values[0][4] = addStr(allData.values[0][4], 30, " data-toggle='modal' data-target='#exampleModal'")
		allData.values[1][4] = addStr(allData.values[1][4], 30, " data-toggle='modal' data-target='#exampleModal'")
		allData.values[2][4] = addStr(allData.values[2][4], 30, " data-toggle='modal' data-target='#exampleModal'")


		var tabledata_test = [
			{ id: allData.values[0][0], name: allData.values[0][1], Designation: allData.values[0][2], phone_number: allData.values[0][3], email: allData.values[0][4], date: allData.values[0][5] },

			{ id: allData.values[1][0], name: allData.values[1][1], Designation: allData.values[1][2], phone_number: allData.values[1][3], email: allData.values[1][4], date: allData.values[1][5] },

			{ id: allData.values[2][0], name: allData.values[2][1], Designation: allData.values[2][2], phone_number: allData.values[2][3], email: allData.values[2][4], date: allData.values[2][5] },

		]

		// console.log(tabledata_test);



		// var tabledata = [
		// 	{ id: 1, name: "Oli Bob", progress: 12, gender: "male", rating: 1, col: "red", dob: "19/02/1984", car: true },
		// 	{ id: 2, name: "Mary May", progress: 1, gender: "female", rating: 2, col: "blue", dob: "14/05/1982", car: true },
		// 	{ id: 3, name: "Christine Lobowski", progress: 42, gender: "female", rating: 0, col: "green", dob: "22/05/1982", car: false },
		// 	{ id: 4, name: "Brendon Philips", progress: 100, gender: "male", rating: 1, col: "orange", dob: "01/08/1980", car: true },
		// 	{ id: 5, name: "Margret Marmajuke", progress: 16, gender: "female", rating: 5, col: "yellow", dob: "31/01/1999", car: false },
		// 	{ id: 6, name: "Frank Harbours", progress: 70, gender: "male", rating: 4, col: "red", dob: "12/05/1966", car: true },

		// 	{ id: 7, name: "Oli Bob", progress: 12, gender: "male", rating: 1, col: "red", dob: "19/02/1984", car: true },
		// 	{ id: 8, name: "Mary May", progress: 1, gender: "female", rating: 2, col: "blue", dob: "14/05/1982", car: true },
		// 	{ id: 9, name: "Christine Lobowski", progress: 42, gender: "female", rating: 0, col: "green", dob: "22/05/1982", car: true },
		// 	{ id: 10, name: "Brendon Philips", progress: 100, gender: "male", rating: 1, col: "orange", dob: "01/08/1980", car: false },
		// 	{ id: 11, name: "Margret Marmajuke", progress: 16, gender: "female", rating: 5, col: "yellow", dob: "31/01/1999", car: false },
		// 	{ id: 12, name: "Frank Harbours", progress: 70, gender: "male", rating: 4, col: "red", dob: "12/05/1966", car: true },

		// 	{ id: 13, name: "Oli Bob", progress: 12, gender: "male", rating: 1, col: "red", dob: "19/02/1984", car: true },
		// 	{ id: 14, name: "Mary May", progress: 1, gender: "female", rating: 2, col: "blue", dob: "14/05/1982", car: false },
		// 	{ id: 15, name: "Christine Lobowski", progress: 42, gender: "female", rating: 0, col: "green", dob: "22/05/1982", car: true },
		// 	{ id: 16, name: "Brendon Philips", progress: 100, gender: "male", rating: 1, col: "orange", dob: "01/08/1980", car: false },
		// 	{ id: 17, name: "Margret Marmajuke", progress: 16, gender: "female", rating: 5, col: "yellow", dob: "31/01/1999", car: true },
		// 	{ id: 18, name: "Frank Harbours", progress: 70, gender: "male", rating: 4, col: "red", dob: "12/05/1966", car: true }
		// ];
		/// start ur code here : create a tabulator and provide the above var allData as an input


		// var rowMenu = [
		// 	{
		// 		label: "<i class='fas fa-trash'></i> Delete Row",
		// 		action: function (e, row) {
		// 			row.delete();
		// 		}
		// 	}
		// ]

		var rowMenu = [
			{
				label: "<i class='fas fa-trash'></i>  Delete Row",
				action: function (e, row) {
					row.delete();
				}
			},
			{
				label: "<i class='fa-regular fa-comment'></i> Send Message", //sub menu
				menu: [
					{
						label: " Via Sms",
						action: function (e, column) {
							//do
						}
					},
					{
						label: "Via Email",
						action: function (e, column) {
							//do something else
						}
					},
					{
						label: "Operations", //sub menu nested in sub menu
						menu: [
							{
								label: "Do Another Thing",
								action: function (e, column) {
									//do another thing
								}
							},
						]
					}
				]
			},
			{
				label: "<i class='fa-solid fa-ban'></i>  Invalid Stop Assignment",
				action: function (e, row) {
					row.delete();
				}
			},
			{
				label: "<i class='fa-solid fa-magnifying-glass'></i>  Search",
				action: function (e, row) {
					row.delete();
				}
			},
			{
				label: "<i class='fa-solid fa-print'></i>  Print a Report",
				action: function (e, row) {
					row.delete();
				}
			},
			{
				label: "<i class='fas fa-trash'></i>  Delete Alert Point(s)",
				action: function (e, row) {
					row.delete();
				}
			},
			{
				label: "<i class='fa-solid fa-computer-mouse'></i>  Assign Alert Point(s)",
				action: function (e, row) {
					row.delete();
				}
			},
			{
				label: "<i class='fa-solid fa-arrows-repeat'></i>  Reset Password",
				action: function (e, row) {
					row.delete();
				}
			},
			{
				label: "  Create VCF File",
				action: function (e, row) {
					row.delete();
				}
			},
			{
				label: "<i class='fa-solid fa-qrcode'></i>  Create QR Code",
				action: function (e, row) {
					row.delete();
				}
			},
			{
				label: "  Register Complaint",
				action: function (e, row) {
					row.delete();
				}
			},
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


		//custom max min header filter
		var minMaxFilterEditor = function (cell, onRendered, success, cancel, editorParams) {

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

			function buildValues() {
				success({
					start: start.value,
					end: end.value,
				});
			}

			function keypress(e) {
				if (e.keyCode == 13) {
					buildValues();
				}

				if (e.keyCode == 27) {
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
		function minMaxFilterFunction(headerValue, rowValue, rowData, filterParams) {
			//headerValue - the value of the header filter element
			//rowValue - the value of the column in this row
			//rowData - the data for the row being filtered
			//filterParams - params object passed to the headerFilterFuncParams property

			if (rowValue) {
				if (headerValue.start != "") {
					if (headerValue.end != "") {
						return rowValue >= headerValue.start && rowValue <= headerValue.end;
					} else {
						return rowValue >= headerValue.start;
					}
				} else {
					if (headerValue.end != "") {
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
			data: tabledata_test,
			index: "id",
			layout: "fitColumns",

			rowContextMenu: rowMenu,

			addRowPos: "bottom",

			// rowFormatter: function (row) {
			// 	var data = row.getData(); //get data object for row

			// 	if (data.gender == "male") {
			// 		row.getElement().style.color = "blue"; //apply css change to row element
			// 	}
			// 	else if (data.gender == "female") {
			// 		row.getElement().style.color = "red";
			// 	}
			// },

			selectable: true,

			columnDefaults: {
				selectable: true,
			},
			pagination: "local",
			paginationSize: 3,
			paginationSizeSelector: [3, 6, 8, 10, true],
			paginationCounter: "rows",

			layout: "fitColumns",
			movableColumns: true,
			initialSort: [             //set the initial sort order of the data
				{ column: "id", dir: "asc" },
			],

			persistenceMode: "cookie",
			persistence: {
				columns: ["visible", "width"], //persist changes to the width, visible and frozen properties
				group: {
					groupBy: true,
				},
				sort: true,
				pagination: true
			},

			// persistence:{
			// 	sort:true,
			// 	filter:true,
			// 	columns:true,
			//   },

			reactiveData: true, //enable reactive data EDIT /DELETE/ UPDATE / DATA

			// height:"311px",
			responsiveLayout: "hide",

			// data: tabledata,
			// index: "id",

			// rowContextMenu: rowMenu,

			// addRowPos: "bottom",

			// rowFormatter: function (row) {
			// 	var data = row.getData(); //get data object for row

			// 	if (data.gender == "male") {
			// 		row.getElement().style.color = "blue"; //apply css change to row element
			// 	}
			// 	else if (data.gender == "female") {
			// 		row.getElement().style.color = "red";
			// 	}
			// },

			// columnDefaults: {
			// 	selectable: true,
			// },
			// pagination: "local",
			// paginationSize: 6,
			// paginationSizeSelector: [3, 6, 8, 10],
			// paginationCounter: "rows",

			// layout: "fitColumns",
			// movableColumns: true,
			// initialSort: [             //set the initial sort order of the data
			// 	{ column: "name", dir: "asc" },
			// ],

			// persistenceMode: "cookie",
			// persistence: {
			// 	columns: ["visible", "width"], //persist changes to the width, visible and frozen properties
			// 	group: {
			// 		groupBy: true,
			// 	}
			// },

			// reactiveData: true, //enable reactive data EDIT /DELETE/ UPDATE / DATA

			// // height:"311px",
			// responsiveLayout: "hide",


			// columns: [
			// 	{ title: "CheckBox", formatter: "rowSelection", titleFormatter: "rowSelection", align: "center", headerSort: false, width: 200 },

			// 	{ title: "Name", field: "name", width: 200, responsive: 0, editor: "input", headerMenu: headerMenu, headerFilter: "input" }, //never hide this column
			// 	{
			// 		title: "Task Progress", field: "progress", hozAlign: "left", editor: true, formatter: "progress", editor: true, headerMenu: headerMenu, formatterParams: {
			// 			min: 0,
			// 			max: 100,
			// 			color: ["green", "orange", "red", "black", "blue"],
			// 			legendColor: "#000000",
			// 			legendAlign: "center",
			// 		}, headerFilter: minMaxFilterEditor, headerFilterFunc: minMaxFilterFunction, headerFilterLiveFilter: false, headerSortTristate: true
			// 	},

			// 	{
			// 		title: "Gender", field: "gender", editor: "list", editorParams: { values: { "male": "Male", "female": "Female" } }, headerFilter: true, headerFilterParams: { values: { "male": "Male", "female": "Female", "": "" } }, width: 150, responsive: 2, headerMenu: headerMenu,

			// 		// formatter:"link", formatterParams:{
			// 		//     labelField:"gender",
			// 		//     url:"https://www.google.com/",
			// 		//     target:"_blank",
			// 		// },

			// cellClick: function (e, cell) {
			// 	//e - the click event object
			// 	//cell - cell component
			// 	console.log(cell.getValue())
			// 	// url = "https://www.google.com/";
			// 	// window.open(url,'_blank');


			// },
			// 	}, //hide this column first

			// 	{ title: "Rating", field: "rating", hozAlign: "center", formatter: "star", hozAlign: "center", width: 100, editor: true, width: 150, headerMenu: headerMenu, headerFilter: "number", headerFilterPlaceholder: "at least...", headerFilterFunc: ">=" },

			// 	{
			// 		title: "Favourite Color", field: "col", width: 150, editor: "input", headerMenu: headerMenu, headerFilter: "list", headerFilterParams: { valuesLookup: true, clearable: true },
			// 		sorter: function (a, b) {
			// 			return String(a).toLowerCase().localeCompare(String(b).toLowerCase());
			// 		}
			// 	},

			// 	{ title: "Date Of Birth", field: "dob", hozAlign: "center", sorter: "date", width: 150, editor: dateEditor, headerMenu: headerMenu, headerFilter: "input" },

			// 	{ title: "Driver", field: "car", hozAlign: "center", width: 150, formatter: "tickCross", sorter: "boolean", editor: true, headerMenu: headerMenu, headerFilter: "tickCross", headerFilterParams: { "tristate": true }, headerFilterEmptyCheck: function (value) { return value === null } },
			// ],

			columns: [
				{ title: "CheckBox", formatter: "rowSelection", titleFormatter: "rowSelection", align: "center", headerSort: false, width: 20, visible: true },

				{ title: "Id", field: "id", width: 10, visible: true, headerMenu: headerMenu },

				{ title: "Name", field: "name", width: 200, responsive: 0, editor: "input", headerMenu: headerMenu }, //never hide this column
				{ title: "Designation", field: "Designation", width: 200, responsive: 0, editor: "input", headerMenu: headerMenu },
				{
					title: "Phone_number", field: "phone_number", width: 200, responsive: 0,/* editor: "input",*/ headerMenu: headerMenu, formatter: "html"

					// cellClick: function (e, cell) {
					// let a = document.querySelector('#myModal');
					// alert(a);
					// a.shadowRoot();
					// $('#myModal').modal();
					// let a = document.getElementsByClassName('modal');
					// let a = document.querySelector('#myModal');
					// console.log(a);
					// console.log(typeof(a));
					// a.modal('focus');
					// myModal.addEventListener('shown.bs.modal', function () {
					// 	myInput.focus()
					//   })
					// myModal.addEventListener('show.bs.modal', function (event) {
					// 	if (!data) {
					// 	  return event.preventDefault() // stops modal from being shown
					// 	}
					//   })

					// alert("The cell has a value of:" + cell.getValue()); //display the cells value
					// $(document).ready(function(){
					// 	$("#myBtn").click(function(){
					// 	  $("#myModal").modal();
					// 	});
					//   });

					// 	var myModal = new bootstrap.Modal(document.getElementById('myModal'), {
					// 		keyboard: false
					// 	})
					// 	//   myModal.focus();
					// 	myModal.modal('show');
					// },

					// formatter: function (cell, formatterParams, onRendered) {
					// 	//cell - the cell component
					// 	//formatterParams - parameters set for the column
					// 	//onRendered - function to call when the formatter has been rendered

					// }
				},


				/*formatter:"link", formatterParams :{
					labelField: "phone_number",
					// target:"",
				}*/
				{ title: "Email", field: "email", width: 110, responsive: 0 /*, editor: "input" */, headerMenu: headerMenu, formatter: "html", },
				// { title: "Date", field: "date", hozAlign: "center", sorter: "date", width: 100, editor: "input", headerMenu: headerMenu },
				{ title: "Date", field: "date", width: 130, sorter: "date", hozAlign: "center" }
			],
		});


		//Define variables for input elements
		var fieldEl = document.getElementById("filter-field");
		var valueEl = document.getElementById("filter-value");

		let i;

		// for (i in valueEl) {
		// 	console.log(i);
		// }

		//Custom filter example
		function customFilter(data) {
			return data.car && data.rating < 3;
		}



		//Trigger setFilter function with correct parameters
		function updateFilter() {
			var filterVal = fieldEl.options[fieldEl.selectedIndex].value;

			var filter = filterVal == "function" ? customFilter : filterVal;

			if (filterVal == "function") {
				valueEl.disabled = true;
			} else {
				valueEl.disabled = false;
			}

			console.log(filterVal);
			if (filterVal) {
				table.setFilter(filter, "like", valueEl.value);
				console.log(valueEl.value);
			}
		}

		//Update filters on value change
		document.getElementById("filter-field").addEventListener("change", updateFilter);
		document.getElementById("filter-value").addEventListener("keyup", updateFilter);

		//Clear filters on "Clear Filters" button click
		document.getElementById("filter-clear").addEventListener("click", function () {
			fieldEl.value = "";
			valueEl.value = "";

			table.clearFilter();
		});

		// table.on("tableBuilt", () => {
		// 	table.setPage(2);
		//   });

		//   table.on("row-mouseenter", function(e, row){
		// 	var rowElement = row.getElement();
		// 	console.log(rowElement);
		//   });
		const selected_rows = []

		// table.on("cellClick", function (e, cell) {
		// 	//e - the click event object
		// 	//cell - cell component
		// 	// var cellValue = cell.getValue();
		// 	var cellValue = cell.getData();
		// 	console.log(cellValue);
		// });

		table.on("rowClick", function (e, row) {
			//e - the click event object
			//row - row component
			var rowData = row.getData();
			// console.log(rowData);

			if (!selected_rows.includes(rowData.phone_number.match(/(\d+)/)[0])) {
				selected_rows.push(rowData.phone_number.match(/(\d+)/)[0]);
			}


			// var str = rowData.phone_number;
			// var phone_number = str.match(/(\d+)/);
			// console.log(phone_number[0]);
			
			// let str = selected_rows[0].phone_number;
			// let phone_number = str.match(/(\d+)/);
			// console.log(phone_number[0]);

			// for (let i = 0; i < selected_rows.length; i++) {
			// 	let element = selected_rows[i].phone_number;
			// 	console.log(selected_rows)
			// 	if (element.length() != 12) {
			// 		element = element.match(/(\d+)/);
			// 		selected_rows[i] = element[0]	
			// 	}
			// }
			console.log(selected_rows);
			console.log($('#input').attr("placeholder", selected_rows.toString()));

			// let a = document.querySelector('#input');
			// console.log(a);
			// a.innerHTML = '${}'
		});


		// console.log(selected_rows)


		table.on("rowDblClick", function (e, row) {
			//e - the click event object
			//row - row component
			// var data = row.getData();
			// var rowElement = row.getElement();
			// var rowData = row.getData();
			// var cells = row.getCells();
			// console.log(rowData);
			// console.log(rowElement);
			// console.log(cells);

			$("#edit_sys_user_form").on('show.bs.modal', function () {
				var data = row.getData();
				// console.log(data);
				// console.log(data.Designation);
				// console.log(data.date);
				// console.log(data.email);
				// console.log(data.id);
				// console.log(data.name);
				// console.log(typeof(data.phone_number));
				// console.log(data.phone_number);

				let a = data.phone_number;
				a = a.substring(77, 89);
				console.log(a);

				$("#Sys_User_Id").attr("placeholder", data.id);
				$("#name").attr("placeholder", data.name);
				$("#mobile_number").attr("placeholder", data.phone_number);

				//Mobile Number
				// function subStr(str, index, stringToAdd) {
				// 	return str.substring(0, index) + stringToAdd + str.substring(index, str.length);
				// }

				// $("#mobile_number").attr("placeholder", subStr(str, index))

				// data.phone_number


				// console.log(a);
			})
			$("#edit_sys_user_form").modal("show")


			// $("#edit_sys_user_form").on('hide.bs.modal', function () {
			// 	alert('The modal will be closed now!');
			// })

		});

		// $(document).ready(function(){
		// 	$("#button1").click(function(){
		// 	  $("#newModal").modal("show");
		// 	});
		// 	$("#newModal").on('show.bs.modal', function () {
		// 	  alert('The modal will be displayed now!');
		// 	});
		// });


		// 	columns: [
		// 		{ title: "CheckBox", formatter: "rowSelection", titleFormatter: "rowSelection", align: "center", headerSort: false, width: 200 },

		// 		{ title: "Name", field: "name", width: 200, responsive: 0, editor: "input", headerMenu: headerMenu }, //never hide this column
		// 		{ title: "Designation", field: "Designation", width: 200, responsive: 0, editor: "input", headerMenu: headerMenu },
		// 		{ title: "Phone_number", field: "phone_number", width: 200, responsive: 0, editor: "input", headerMenu: headerMenu },
		// 		{ title: "Email", field: "email", width: 200, responsive: 0, editor: "input", headerMenu: headerMenu },
		// 		{ title: "Date", field: "date", hozAlign: "center", sorter: "date", width: 150, editor: dateEditor, headerMenu: headerMenu },
		// 	],
		// });


		// Trigger Sort Button JS
		// Trigger sort when "Trigger Sort" button is clicked
		document.getElementById("sort-trigger").addEventListener("click", function () {
			table.setSort(fieldEl.options[fieldEl.selectedIndex].value, dirEl.options[dirEl.selectedIndex].value);
		});

		// //Add row on "Add Row" button click
		// document.getElementById("add-row").addEventListener("click", function () {
		// 	table.addRow({});
		// });

		// //Delete row on "Delete Row" button click
		// document.getElementById("del-row").addEventListener("click", function () {
		// 	table.deleteRow();
		// });

		// //Clear table on "Empty the table" button click
		// document.getElementById("clear").addEventListener("click", function () {
		// 	table.clearData()
		// });

		//add row to bottom of table on button click
		document.getElementById("reactivity-add").addEventListener("click", function () {
			tabledata_test.push({ id: 4, name: "IM A NEW ROW", Designation: "Developer", phone_number: "<a href='#' class='_sendsms' data-toggle='modal' data-target='#exampleModal' >919035230847</a> ", email: "<a href='#' class='_sendemail' data-toggle='modal' data-target='#exampleModal'>gagan@gmail.com</a>", date: "20/04/2000" });

		});

		// id: allData.values[0][0], name: allData.values[0][1], Designation: allData.values[0][2], phone_number: allData.values[0][3], email: allData.values[0][4], date: allData.values[0][5]

		// remove bottom row from table on button click
		document.getElementById("reactivity-delete").addEventListener("click", function () {
			tabledata_test.pop();
		});

		// update name on first row in table on button click
		document.getElementById("reactivity-update").addEventListener("click", function () {
			tabledata_test[0].name = "IVE BEEN UPDATED";
			console.log(tabledata_test[0].name);
		});

	}

	/*------------ create and Customize data table----------------*/
	// we will have a filter object as default param which will get set when we start adding filters for a table
	function createTable(_row_index, filterObject = { cityId: 0, stateId: 0, countryId: 0, activeLookupId: 0 }) {
		var container_id = REL; //dont change

		//Remove data table if already exists
		if (undefined !== DATA_TABLE && isDataTable(DATA_TABLE))
			DATA_TABLE.fnDestroy();

		//Remove tab contents if already exist
		$(`#${container_id}`).empty();
		var table_id = REL + '_table';

		var btnPanel = $(`<div class="btn-panel py-2"></div>`).appendTo(`#${container_id}`);
		var table_obj = $('<table id="' + table_id + '" class="table table-bordered table-sm table-striped table-hover text-center" width="100%"></table>').appendTo(`#${container_id}`);
		//set display row start
		if (!(_row_index))
			_row_index = 0;

		var _num_row_per_page = 15; //number of records per page
		if (_row_index >= _num_row_per_page) {
			_row_index -= (_row_index % _num_row_per_page);
		} else {
			_row_index = 0;
		}


		/* SUMMARY_COMMENT */

		var city = CityScript.getInstance();
		var state = StateScript.getInstance();
		var country = CountryScript.getInstance();
		var lookup = LookupScript.getInstance();

		//render column
		var aoColumnDefs_render = [

			{
				"render": function (o, type) {
					return myFunction(o);
				},
				"targets": [INDEX.SYS_USER_ID]
			},
			{
				"render": function (o, type) {
					return myFunction(o);
				},
				"targets": [INDEX.NAME]
			},
			{
				"render": function (o, type) {
					return getSmsLink(o);
				},
				"targets": [INDEX.MOBILE_NUMBER]
			},
			{
				"render": function (o, type) {
					return getSmsLink(o);
				},
				"targets": [INDEX.MOBILE_NUMBER_2]
			},
			{
				"render": function (o, type) {
					return getEmailLink(o);
				},
				"targets": [INDEX.EMAIL]
			},
			{
				"render": function (o, type) {
					return myFunction(o);
				},
				"targets": [INDEX.ADDRESS]
			},
			{
				"render": function (o, type) {
					var cityName = getValueById(o, city);
					return (cityName.includes("Unknown") ? "-" : cityName);
				},
				"targets": [INDEX.CITY_ID]
			},
			{
				"render": function (o, type) {
					var stateName = getValueById(o, state);
					return (stateName.includes("Unknown") ? "-" : stateName);
				},
				"targets": [INDEX.STATE_ID]
			},
			{
				"render": function (o, type) {
					var countryName = getValueById(o, country);
					return (countryName.includes("Unknown") ? "-" : countryName);
				},
				"targets": [INDEX.COUNTRY_ID]
			},
			{
				"render": function (o, type, rowData) {
					return getLocationLink(o, rowData[INDEX.LONGITUDE]);
				},
				"targets": [INDEX.LATITUDE]
			},
			{
				"render": function (o, type) {
					return myFunction(o);
				},
				"targets": [INDEX.LONGITUDE]
			},
			{
				"render": function (o, type) {
					return timeToDisplayDateTime(o, DISPLAY_TIME_FORMAT);
				},
				"targets": [INDEX.LAST_LOGIN_DATE]
			},
			{
				"render": function (o, type) {
					return myFunction(o);
				},
				"targets": [INDEX.USAGE_COUNT]
			},
			{
				"render": function (o, type) {
					return myFunction(o);
				},
				"targets": [INDEX.PROPERTIES]
			},
			{
				"render": function (o, type) {
					var lookupName = getValueById(o, lookup);
					return (lookupName.includes("Unknown") ? "-" : lookupName);
				},
				"targets": [INDEX.ACTIVE_LOOKUP_ID]
			},
			{
				"render": function (o, type) {
					return myFunction(o);
				},
				"targets": [INDEX.PASSWORD]
			},
			{
				"render": function (o, type) {
					return myFunction(o);
				},
				"targets": [INDEX.SALT]
			},
			{
				"render": function (o, type) {
					return myFunction(o);
				},
				"targets": [INDEX.NOTIFICATION_TOKEN]
			}
		];
		/* SUMMARY_COMMENT */

		//Define Column Headings
		var aoColumns_headings = [

			//{	"title": '<input type="checkbox" name="select_all_rows" data-toggle="tooltip" data-placement="top" title="Select All/None">', "className": "dt-center", "sortable": false, "width": "5%"  }

			{ "title": LABEL.SYS_USER_ID, "className": "dt-center", "type": "num", "searchable": true, "visible": true }
			, { "title": LABEL.NAME, "className": "dt-center", "type": "string", "searchable": true, "visible": true }
			, { "title": LABEL.MOBILE_NUMBER, "className": "dt-center", "type": "string", "searchable": true, "visible": true }
			, { "title": LABEL.MOBILE_NUMBER_2, "className": "dt-center", "type": "string", "searchable": true, "visible": true }
			, { "title": LABEL.EMAIL, "className": "dt-center", "type": "string", "searchable": true, "visible": true }
			, { "title": LABEL.ADDRESS, "className": "dt-center", "type": "string", "searchable": false, "visible": false }
			, { "title": LABEL.CITY_ID, "className": "dt-center", "type": "string", "searchable": true, "visible": true }
			, { "title": LABEL.STATE_ID, "className": "dt-center", "type": "string", "searchable": true, "visible": true }
			, { "title": LABEL.COUNTRY_ID, "className": "dt-center", "type": "string", "searchable": true, "visible": true }
			, { "title": LABEL.LATITUDE, "className": "dt-center", "type": "string", "searchable": false, "visible": true }
			, { "title": LABEL.LONGITUDE, "className": "dt-center", "type": "string", "searchable": false, "visible": false }
			, { "title": LABEL.LAST_LOGIN_DATE, "className": "dt-center", "type": "string", "searchable": true, "visible": true }
			, { "title": LABEL.USAGE_COUNT, "className": "dt-center", "type": "string", "searchable": true, "visible": true }
			, { "title": LABEL.PROPERTIES, "className": "dt-center", "type": "string", "searchable": true, "visible": true }
			, { "title": LABEL.ACTIVE_LOOKUP_ID, "className": "dt-center", "type": "string", "searchable": true, "visible": true }
			, { "title": LABEL.PASSWORD, "className": "dt-center", "type": "string", "searchable": true, "visible": true }
			, { "title": LABEL.SALT, "className": "dt-center", "type": "string", "searchable": false, "visible": false }
			, { "title": LABEL.NOTIFICATION_TOKEN, "className": "dt-center", "type": "string", "searchable": false, "visible": false }
		];
		let baseUrl = `${ROOT_URL}${URL}/select?mode=${WEB_MODE}`

		/* SUMMARY_UNCOMMENT
		
		let baseUrl = `${ROOT_URL}${URL}/SummaryList?mode=${WEB_MODE}`
		
		SUMMARY_UNCOMMENT */

		// as more filter comes we add more if blocks this is custom for fee
		/*

		if (filterObject.cityId > 0) {
			baseUrl += `&city_id=${filterObject.cityId}`
		}

		if (filterObject.stateId > 0) {
			baseUrl += `&state_id=${filterObject.stateId}`
		}

		if (filterObject.countryId > 0) {
			baseUrl += `&country_id=${filterObject.countryId}`
		}

		if (filterObject.activeLookupId > 0) {
			baseUrl += `&active_lookup_id=${filterObject.activeLookupId}`
		}
*/
		var oTable = $("#" + table_id).dataTable({
			//"data": tableData,
			"ajax": {
				"url": baseUrl,
				"dataSrc": 'values'
			},
			"scrollX": true,
			"scrollY": "50vh",
			"scrollCollapse": true,
			"responsive": false,
			"processing": true,
			"columns": aoColumns_headings,
			"deferRender": true,
			"pagingType": "full_numbers",
			"pageLength": _num_row_per_page,
			"displayStart": _row_index,
			"lengthMenu": [[10, 15, 20, 25, 50, 100, -1], [10, 15, 20, 25, 50, 100, "All"]],
			/* SUMMARY_COMMENT */
			"columnDefs": aoColumnDefs_render,
			/* SUMMARY_UNCOMMENT */
			"order": [[0, 'asc']],
			"select": true,
			//"buttons": ['copyHtml5', 'csvHtml5','excelHtml5', 'pdfHtml5', 'print', 'colvis'], 
			//"dom": 'frtip',// Bfrtip
			//"scroller": USER_DATATABLE_SETTING.SCROLL // include in the App settings file

			"initComplete": function (settings, json) {
				//these needs to be here after init
				addTableEvents(table_id);
				populateFilters(table_id, filterObject);
			}
		});

		DATA_TABLE = oTable;
		//we call this for filters
		addFilterControl(table_id);
		bindFilterHandlers(table_id);
		//show add/edit/deletebuttons/and other events
		addButtonPanel(table_id);
	}

	// Function for table events onClick, ondblClick
	function addTableEvents(table_id) {

		//no need to call this as data table will take care of it
		// addTableRowClickEnent( table_id );

		//dbl click event
		var userRole = getUserRoleFromCookie();
		if (userRole) {
			if (checkRolePermission(userRole, SOFTWARE_FEATURE_CONST.EDIT_SYS_USER) == true) { //edit enabled : permissions
				addTableRowDblClickEvent(table_id, function (index, data) {

					//Use this to fetch the specific id
					fetchData({
						sys_user_id: data[INDEX.SYS_USER_ID],
						callback: function (status, response) {
							popUpEditForm(response.data.values[0], index);
						}
					})
				});
			}
		}

		//select all/none //this will get refactored after wards keep it as is for now
		addTableSelectAllRowChkBoxEvent(table_id);
	}
	//add button panel
	function addButtonPanel(table_id) {
		var this_tool_id = `#${REL} .btn-panel`;
		$(this_tool_id).empty();

		const newPanel = `
			<button type="button" class="btn btn-sm btn-outline-success add_button">Add</button>
			<button type="button" class="btn btn-sm btn-outline-warning edit_button">Edit</button>
			<button type="button" class="btn btn-sm btn-outline-danger  remove_button">Delete</button>
			<button type="button" class="btn btn-sm btn-outline-primary refresh_button">Refresh</button>

			<div class="btn-group">
				<div class="dropdown">
					<button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" id="${REL}_dropdown" data-toggle="dropdown"aria-haspopup="true" aria-expanded="false">
						Action
					</button>
					<div class="dropdown-menu" >

					</div>
				</div>
			</div>`

		// append the buttons to the panel
		$(this_tool_id).append(newPanel);

		$(`#${REL}_dropdown`).hide(); // hiding as we don't need now:enable as per use

		//attach click events
		attachToolButtonEvents(table_id, this_tool_id);

	}

	//attach click events to the tool buttons
	function attachToolButtonEvents(table_id, button_panel_id) {
		var userRole = getUserRoleFromCookie();
		if (userRole) {

			//Add button
			var add_button_id = `${button_panel_id} button.add_button`;
			if (checkRolePermission(userRole, SOFTWARE_FEATURE_CONST.ADD_SYS_USER) == true) {
				$(add_button_id).on('click', function () {
					popUpAddForm();
				});
			}
			else {
				$(add_button_id).hide(); //4p1=JQuery button({disabled: true});
			}

			//Edit button
			var edit_button_id = `${button_panel_id} button.edit_button`;
			if (checkRolePermission(userRole, SOFTWARE_FEATURE_CONST.EDIT_SYS_USER) == true) {
				$(edit_button_id).on('click', function () {
					if (checkIfSingleRowSelected(table_id) == true) {
						/*var index_arr = getSelectedRowDataIndex(table_id);
						if( index_arr.length == 1){
							var data = JSON.parse($('#'+table_id).data('table_data'));
							var value_array = data.values;

							popUpEditForm(value_array[index_arr[0]], index_arr[0]);
						}*/
						var index_arr = getSelectedRowIndex(table_id);
						const data = getSelectedRowData(table_id);

						//Use this to fetch the specific id
						fetchData({
							sys_user_id: data[0][INDEX.SYS_USER_ID],
							callback: function (status, response) {
								popUpEditForm(response.data.values[0], index_arr[0]);
							}
						});
					}
				});
			}
			else {
				$(edit_button_id).hide(); //4p1=JQuery button({ disabled: true });
			}

			//Delete/remove_button
			var remove_button_id = `${button_panel_id} button.remove_button`;
			if (checkRolePermission(userRole, SOFTWARE_FEATURE_CONST.DELETE_SYS_USER) == true) {
				$(remove_button_id).on('click', function () {

					/*if(checkIfRowSelected(table_id)== true){

						var index_arr = getSelectedRowDataIndex(table_id);
						var num_row = index_arr.length;

						if( num_row >= 1){
							var data = JSON.parse($('#'+table_id).data('table_data'));
							var value_array = data.values;
							var del_data_arr = [];

							$.each(index_arr, function(inx,val){
								del_data_arr.push(value_array[val]);
							});

							var table_name = "Sys User";

							let deleteData = getSelectedRowData(table_id);
							dialogMessageDeleteRow(table_name, deleteData.length, function () {
								deleteRows(deleteData);
							});
						}
					}*/
					//use this block instead for delete
					let deleteData = getSelectedRowData(table_id);
					var table_name = "Sys User";

					if (deleteData.length > 0) {

						dialogMessageDeleteRow(table_name, deleteData.length, function () {
							deleteRows(deleteData);
						});
					}
					else {
						const title = "Please Confirm"
						const msg = `<div class="text-center">
							<p>You are about to Delete all the Data of ${table_name} for</p>
							<h4>${DEFAULT_ORGANIZATION.name}</h4>
							<p>Are you sure you want to delete all the records from <strong>${table_name}</strong>?</p>
						</div>`
						dialogConfirm(msg, title, function () {
							deleteRows([]); //pass empty array signifying delete all for an organization
						})
					}
				});
			}
			else {//disable
				$(remove_button_id).hide();
			}
		}
		//refresh
		var refresh_button_id = `${button_panel_id} button.refresh_button`;
		$(refresh_button_id).on('click', function (e) {
			$(e.currentTarget).button('disable');
			// showTabContent(REL);

			createTable(0, getFilterObject());
			window.setTimeout(function () {
				$(e.currentTarget).button('enable');
			}, 2000);
		});

		//actions : TODO check which actions to be enabled for which user
		//var action_button_id = "#"+button_panel_id+' button.select_action'; //button id
		//var action_menu_id = "#"+button_panel_id+' div.select_action_list'; //menu id
		var action_list = $(`#${REL} .btn-panel .dropdown-menu`);
		populateActionMenu(action_list);

		addActionMenuEvent({
			actionList: action_list,
			callback: function (id) {
				execMenuAction(id);
			}
		});
	}

	//function to display popUp form: 'titleString' is title of popUp window, 'mode' is Add or Edit.
	function displayForm(titleString, mode, row_index, create_table) {

		$(`input,select,textarea`).removeClass("is-invalid");
		$(`#${FORM_ID}_title`).text(titleString);
		$(`#${FORM_ID}`).modal('show')
		$(`#${FORM_ID} .save-btn`).off('click').on('click', function (e) {
			$(this).prop('disabled', true);

			var bValid = true;

			$("#" + FORM_ID + "").replaceSymbolUtils();
			$("#" + FORM_ID + "").trimInputFields();

			//$("form .name","#"+FORM_ID+"").capsFirstLetter();

			bValid = validateForm();

			if (true == bValid) {
				saveFormData(mode, row_index, create_table);

				window.setTimeout(() => {
					$(this).prop('disabled', false);
				}, 1000);

			} else {
				$(this).prop('disabled', false);
			}
		})
	}

	function validateForm() {
		var bValid = true;
		var country_code = getOrgCountryCode(); //"+91"; // PUT in the Country code or fetch from DB or server 
		var noOfDigits = getOrgNoOfDigits();
		var fv = FormValidation;

		console.log('Enable the validation for this form');
		/* Enable as per requirement*/
		// bValid = bValid && fv.checkEmpty($(FORM_FIELD.SYS_USER_ID), G_ERROR.MSG.empty_error+LABEL.SYS_USER_ID);
		// bValid = bValid && fv.checkEmpty($(FORM_FIELD.NAME), G_ERROR.MSG.empty_error+LABEL.NAME);
		// bValid = bValid && fv.checkEmpty($(FORM_FIELD.MOBILE_NUMBER), G_ERROR.MSG.empty_error+LABEL.MOBILE_NUMBER);
		// bValid = bValid && fv.validateMobileNo( $(FORM_FIELD.MOBILE_NUMBER), country_code, noOfDigits, LABEL.MOBILE_NUMBER+G_ERROR.MSG.invalid_mobile_no);
		// bValid = bValid && fv.checkEmpty($(FORM_FIELD.MOBILE_NUMBER_2), G_ERROR.MSG.empty_error+LABEL.MOBILE_NUMBER_2);
		// bValid = bValid && fv.validateMobileNo( $(FORM_FIELD.MOBILE_NUMBER_2), country_code, noOfDigits, LABEL.MOBILE_NUMBER_2+G_ERROR.MSG.invalid_mobile_no);
		// bValid = bValid && fv.checkEmpty($(FORM_FIELD.EMAIL), G_ERROR.MSG.empty_error+LABEL.EMAIL);
		// bValid = bValid && fv.checkEmail($(FORM_FIELD.EMAIL), LABEL.EMAIL+G_ERROR.MSG.invalid_emailid_error);
		// bValid = bValid && fv.checkEmpty($(FORM_FIELD.ADDRESS), G_ERROR.MSG.empty_error+LABEL.ADDRESS);
		// bValid = bValid && fv.checkEmptySelect($(FORM_FIELD.CITY_ID), G_ERROR.MSG.empty_error_selectbox+LABEL.CITY_ID);
		// bValid = bValid && fv.checkEmptySelect($(FORM_FIELD.STATE_ID), G_ERROR.MSG.empty_error_selectbox+LABEL.STATE_ID);
		// bValid = bValid && fv.checkEmptySelect($(FORM_FIELD.COUNTRY_ID), G_ERROR.MSG.empty_error_selectbox+LABEL.COUNTRY_ID);
		// bValid = bValid && fv.checkEmpty($(FORM_FIELD.LATITUDE), G_ERROR.MSG.empty_error+LABEL.LATITUDE);
		// bValid = bValid && fv.checkEmpty($(FORM_FIELD.LONGITUDE), G_ERROR.MSG.empty_error+LABEL.LONGITUDE);
		// bValid = bValid && fv.checkEmpty($(FORM_FIELD.LAST_LOGIN_DATE_DATE), G_ERROR.MSG.empty_error+LABEL.LAST_LOGIN_DATE_DATE);
		// bValid = bValid && fv.checkDate($(FORM_FIELD.LAST_LOGIN_DATE_DATE), G_ERROR.MSG.invalid_date_error+LABEL.LAST_LOGIN_DATE_DATE);
		// bValid = bValid && fv.checkEmpty($(FORM_FIELD.LAST_LOGIN_DATE_TIME), G_ERROR.MSG.empty_error+LABEL.LAST_LOGIN_DATE_TIME);
		// bValid = bValid && fv.checkTime($(FORM_FIELD.LAST_LOGIN_DATE_TIME), G_ERROR.MSG.invalid_time_error+LABEL.LAST_LOGIN_DATE_TIME);
		// bValid = bValid && fv.checkEmpty($(FORM_FIELD.USAGE_COUNT), G_ERROR.MSG.empty_error+LABEL.USAGE_COUNT);
		// bValid = bValid && fv.checkEmpty($(FORM_FIELD.PROPERTIES), G_ERROR.MSG.empty_error+LABEL.PROPERTIES);
		// bValid = bValid && fv.checkEmptySelect($(FORM_FIELD.ACTIVE_LOOKUP_ID), G_ERROR.MSG.empty_error_selectbox+LABEL.ACTIVE_LOOKUP_ID);
		// bValid = bValid && fv.checkEmpty($(FORM_FIELD.PASSWORD), G_ERROR.MSG.empty_error+LABEL.PASSWORD);
		// bValid = bValid && fv.checkEmpty($(FORM_FIELD.SALT), G_ERROR.MSG.empty_error+LABEL.SALT);
		// bValid = bValid && fv.checkEmpty($(FORM_FIELD.NOTIFICATION_TOKEN), G_ERROR.MSG.empty_error+LABEL.NOTIFICATION_TOKEN);
		/**/
		return bValid;
	}
	function setFormDefaults() {
		DEFAULT.SYS_USER_ID = getNewId(getStorageData(), (INDEX.SYS_USER_ID));
		$(FORM_FIELD.SYS_USER_ID).val(DEFAULT.SYS_USER_ID);
		$(FORM_FIELD.NAME).val(DEFAULT.NAME);
		$(FORM_FIELD.MOBILE_NUMBER).val(DEFAULT.MOBILE_NUMBER);
		$(FORM_FIELD.MOBILE_NUMBER_2).val(DEFAULT.MOBILE_NUMBER_2);
		$(FORM_FIELD.EMAIL).val(DEFAULT.EMAIL);
		$(FORM_FIELD.ADDRESS).val(DEFAULT.ADDRESS);
		var city = CityScript.getInstance();
		city.populateInfo($(FORM_FIELD.CITY_ID), DEFAULT.CITY_ID);
		var state = StateScript.getInstance();
		state.populateInfo($(FORM_FIELD.STATE_ID), DEFAULT.STATE_ID);
		var country = CountryScript.getInstance();
		country.populateInfo($(FORM_FIELD.COUNTRY_ID), DEFAULT.COUNTRY_ID);
		$(FORM_FIELD.LATITUDE).val(DEFAULT.LATITUDE);
		$(FORM_FIELD.LONGITUDE).val(DEFAULT.LONGITUDE);
		$(FORM_FIELD.LAST_LOGIN_DATE_DATE).val(DEFAULT.LAST_LOGIN_DATE_DATE); // getTodaysDate()
		$(FORM_FIELD.LAST_LOGIN_DATE_TIME).val(DEFAULT.LAST_LOGIN_DATE_TIME); // getCurrentTime()
		$(FORM_FIELD.USAGE_COUNT).val(DEFAULT.USAGE_COUNT);
		$(FORM_FIELD.PROPERTIES).val(DEFAULT.PROPERTIES);
		var lookup = LookupScript.getInstance();
		lookup.populateInfo($(FORM_FIELD.ACTIVE_LOOKUP_ID), DEFAULT.ACTIVE_LOOKUP_ID);
		$(FORM_FIELD.PASSWORD).val(DEFAULT.PASSWORD);
		$(FORM_FIELD.SALT).val(DEFAULT.SALT);
		$(FORM_FIELD.NOTIFICATION_TOKEN).val(DEFAULT.NOTIFICATION_TOKEN);

	}
	function popUpAddForm(field, create_table) {

		if (field) {

			formField = field;

			isChildForm = true;

		}

		setFormDefaults();

		displayForm("Add New Sys User", INSERT_DATA, 0, create_table);
	}

	function popUpEditForm(data, row_index) {

		$(FORM_FIELD.SYS_USER_ID).val(data[INDEX.SYS_USER_ID]);
		$(FORM_FIELD.NAME).val(data[INDEX.NAME]);
		$(FORM_FIELD.MOBILE_NUMBER).val(data[INDEX.MOBILE_NUMBER]);
		$(FORM_FIELD.MOBILE_NUMBER_2).val(data[INDEX.MOBILE_NUMBER_2]);
		$(FORM_FIELD.EMAIL).val(data[INDEX.EMAIL]);
		$(FORM_FIELD.ADDRESS).val(data[INDEX.ADDRESS]);
		var city = CityScript.getInstance();
		city.populateInfo($(FORM_FIELD.CITY_ID), data[INDEX.CITY_ID]);
		var state = StateScript.getInstance();
		state.populateInfo($(FORM_FIELD.STATE_ID), data[INDEX.STATE_ID]);
		var country = CountryScript.getInstance();
		country.populateInfo($(FORM_FIELD.COUNTRY_ID), data[INDEX.COUNTRY_ID]);
		$(FORM_FIELD.LATITUDE).val(data[INDEX.LATITUDE]);
		$(FORM_FIELD.LONGITUDE).val(data[INDEX.LONGITUDE]);
		$(FORM_FIELD.LAST_LOGIN_DATE_DATE).val(timeToDisplayDate(data[INDEX.LAST_LOGIN_DATE]));
		$(FORM_FIELD.LAST_LOGIN_DATE_TIME).val(timeToDisplayTime(data[INDEX.LAST_LOGIN_DATE]));
		$(FORM_FIELD.USAGE_COUNT).val(data[INDEX.USAGE_COUNT]);
		$(FORM_FIELD.PROPERTIES).val(data[INDEX.PROPERTIES]);
		var lookup = LookupScript.getInstance();
		lookup.populateInfo($(FORM_FIELD.ACTIVE_LOOKUP_ID), DEFAULT.ACTIVE_LOOKUP_ID, data[INDEX.ACTIVE_LOOKUP_ID]);
		$(FORM_FIELD.PASSWORD).val(data[INDEX.PASSWORD]);
		$(FORM_FIELD.SALT).val(data[INDEX.SALT]);
		$(FORM_FIELD.NOTIFICATION_TOKEN).val(data[INDEX.NOTIFICATION_TOKEN]);
		displayForm("Edit Sys User", UPDATE_DATA, row_index);
	}

	function getFormDataAsJson() {
		var jsonData = {
			sys_user_id: ($(FORM_FIELD.SYS_USER_ID).val()),
			name: ($(FORM_FIELD.NAME).val()),
			mobile_number: ($(FORM_FIELD.MOBILE_NUMBER).val()),
			mobile_number_2: ($(FORM_FIELD.MOBILE_NUMBER_2).val()),
			email: ($(FORM_FIELD.EMAIL).val()),
			address: ($(FORM_FIELD.ADDRESS).val()),
			city_id: ($(FORM_FIELD.CITY_ID).val()),
			state_id: ($(FORM_FIELD.STATE_ID).val()),
			country_id: ($(FORM_FIELD.COUNTRY_ID).val()),
			latitude: parseFloat($(FORM_FIELD.LATITUDE).val()),
			longitude: parseFloat($(FORM_FIELD.LONGITUDE).val()),
			last_login_date: DateTimeToSaveTime($(FORM_FIELD.LAST_LOGIN_DATE_DATE).val(), $(FORM_FIELD.LAST_LOGIN_DATE_TIME).val()),
			usage_count: ($(FORM_FIELD.USAGE_COUNT).val()),
			properties: ($(FORM_FIELD.PROPERTIES).val()),
			active_lookup_id: ($(FORM_FIELD.ACTIVE_LOOKUP_ID).val()),
			password: ($(FORM_FIELD.PASSWORD).val()),
			salt: ($(FORM_FIELD.SALT).val()),
			notification_token: ($(FORM_FIELD.NOTIFICATION_TOKEN).val())
		};

		console.log("JSON FormData:", jsonData);
		return jsonData;
	}

	function saveFormData(mode, row_index, create_table = true) {	//pass create table as additional param

		var jsonData = getFormDataAsJson();

		var inData = JSON.stringify(jsonData);

		var _url = ROOT_URL + URL, TYPE = '';

		switch (mode) {
			case INSERT_DATA:
				TYPE = "POST";
				break;
			case UPDATE_DATA:
				TYPE = "PUT";
				break;
			default:
				return false;
		}

		var com = new AjaxRequest();
		com.init({ url: _url, type: TYPE, data: inData });
		com.send({
			callback: function (status, response) {

				var dialogMessage = " ERROR ";
				if (status && response.data.status_code >= 0 && mode == INSERT_DATA)
					dialogMessage = "Sys User has been successfully added ("/*+jsonData.name*/ + " Id:" + response.data.id + ")";
				else if (status && response.data.status_code >= 0 && mode == UPDATE_DATA)
					dialogMessage = "Sys User has been successfully updated("/*+jsonData.name*/ + " Id:" + response.data.id + ")";

				//expect a message key in the json
				if (response.data.message && response.data.message.length > 0) {
					dialogMessage += response.data.message;
				}

				if (status && response.data.status_code >= 0) {


					if (status && response.status_code >= 0) {

						if (mode == INSERT_DATA) {
							row_index = $(`#${REL}_table`).DataTable().row(':last', { order: 'applied' }).index();//row_index = response.data.values.length;
						}
						// setStorageData( response );
						if (create_table == false) {

						}
						else {

							createTable(row_index, getFilterObject());
						}
					}

					//we are fetching again to get data to store in session storage..
					fetchData({
						callback: function (status, response) {

							setStorageData(response);
						}
					});
					$(`#${FORM_ID}`).modal('hide');//critical line which shows the modal

					dialogMessageSuccess(dialogMessage, "Status");
				}
				else {
					dialogMessageFailed(dialogMessage, "Status");
				}
			}
		});
	}
	function deleteRows(selectedRows) {

		var jsonData = {
			sys_user_id: selectedRows.map((sysUser) => sysUser[INDEX.SYS_USER_ID]).join(','), // 1,2,3,4
			organization_id: getOrganizationId()
		};

		var _url = ROOT_URL + URL, TYPE = "DELETE";

		var com = new AjaxRequest();
		com.init({ url: _url, type: TYPE, data: JSON.stringify(jsonData) });
		com.send({
			callback: function (status, response) {
				var dialogMessage = " ERROR";
				console.log("DELETE RESPONSE", response);
				if (true == status && response.status_code > 0) {
					//				check whether the delete operation was successful
					if (response.data.status_code == G_ERROR.CODE.SUCCESS) {

						dialogMessage = "Sys User has been successfully deleted :" + response.data.rows_deleted + " row(s)";

						/*var table_id = REL+'_table';
						var data = JSON.parse($('#'+table_id).data('table_data'));
						var value_array = data.values;
						var index = getSelectedRowDataIndex(table_id);
						//on call back remove rows from table:put inside callback
						DATA_TABLE = $('#'+REL+"_table").dataTable();
						var aReturn = new Array();
	
						var aTrs = DATA_TABLE.fnGetNodes();
	
						for(var i=0; i<aTrs.length;i++) {
							if ( $(aTrs[i]).hasClass('selected_row') ) {
								aReturn.push( aTrs[i] );
							}
						}
						for(var i=0; i<aReturn.length;i++){
							DATA_TABLE.fnDeleteRow( aReturn[i] );
						}
						//update table data- remove deleted row
						index.sort();
						for(var j = (index.length - 1); j>=0; j--){
							value_array.splice(index[j], 1);
						}
						data.values = value_array;
						data.rows = value_array.length;
						$('#'+table_id).data('table_data', JSON.stringify(data));*/

						if (selectedRows.length > 0) {

							$(`#${REL}_table`).DataTable().rows({ selected: true }).remove().draw('page');
						}
						else {

							$(`#${REL}_table`).DataTable().rows().remove().draw('page');
						}

						fetchData({
							callback: function (status, fetchResponse) {
								if (status && fetchResponse.status_code >= 0) {
									setStorageData(fetchResponse);
								}
							}
						});
						dialogMessageSuccess(dialogMessage, "Status");
					}
					else {

						dialogMessage = "Unable to delete. Status Code is: " + response.data.status_code;
						if (response.data.message && response.data.message.length > 0) {
							dialogMessage += "<br>" + response.data.message;
						}
						dialogMessageFailed(dialogMessage, "Status");
					}

				}

				//we add an empty list condition also so that it doesn't show error dialog if there was no data to be deleted
				else if (true == status && (response.data.status_code == G_ERROR.CODE.DELETE_OPERATION_DEPENDENT_EXISTS || response.data.status_code == G_ERROR.CODE.EMPTYLIST)) {
					dialogMessage = "Cannot delete Sys User";

					if (selectedRows.length > 1)
						dialogMessage += "s";

					if (response.data.message && response.data.message.length > 0) {
						dialogMessage += "<br>" + response.data.message;
					}

					dialogMessageWarning(dialogMessage, "Status");
				}
				else {

					dialogMessage += ":" + response.data.message;
					dialogMessageFailed(dialogMessage, "Status");
				}
			}
		});
	}
	function fetchData(option) {

		var _url = ROOT_URL + URL + "/select?organization_id=" + getOrganizationId();	//sys_user_id="+ getCurLogUserId();

		if (option && option.sys_user_id) {
			//$.each(option.sys_user_id, function(inx, val){
			_url += '&sys_user_id=' + option.sys_user_id;
			//});
		}

		console.log(_url);
		var com = new AjaxRequest();
		com.init({ url: _url });
		com.send({
			callback: function (status, response) {
				//if( status && response.data.status_code >= 0 ){
				if (option && option.callback)
					option.callback(status, response);
				//}
				//else {
				//if(option && option.callback)
				//option.callback(false, response);
				//}
			}
		});
	}
	/* populate combobox*/
	function populateInfo(elem, select_id, callback) {
		var id_index = INDEX.SYS_USER_ID, name_index = getNameIdx();
		if (select_id == undefined) select_id = 0;
		var values = [];

		if (null == getStorageData()) {
			$("option:first", elem).nextAll().remove();
		}
		if (null !== getStorageData()) {
			var storageData = getStorageData();
			values = storageData.data.values;
			populateCombobox(elem, values, id_index, name_index);
			elem.val(select_id);
			if (callback)
				callback();
		}
		else {
			fetchData({
				callback: function (status, response) {
					if (status && response.data.values) {
						values = response.data.values;

						populateCombobox(elem, values, id_index, name_index);
						elem.val(select_id);
					}
					else {
						console.log('SYS_USER_DATA is empty : selected_id=' + select_id);
					}
					if (callback)
						callback();
				}
			});
		}
	}

	/**
	 *  Populate Action menu
	 */
	function populateActionMenu(list) {
		//empty list
		list.html('');
		//add items
		list.append($('<button class="dropdown-item" type="button" value="1">Send SMS</button>'));
		list.append($('<button class="dropdown-item" type="button" value="2">Send Email</button>'));
	}

	/**
	 *execute click function
	 * @param id{int}: button value in populateActionMenu()
	 */
	function execMenuAction(id) {
		switch (id) {
			case 1:
				SysUserSendSms();
				break;
			case 2:
				SysUserSendEmail();
				break;
			default:
				log('Sys User Action', 'unknown parameter', id);
		}
	}

	//this will add filter controls on top right
	function addFilterControl(table_id) {
		//these two lines need to be generated as is
		$(`#${table_id}_wrapper > div:first-child > div:first-child`).removeClass('col-md-6').addClass('col-md-3')
		$(`#${table_id}_wrapper > div:first-child > div:last-child`).removeClass('col-md-6').addClass('col-md-9')

		//uncomment as need for filter controls

		//this will be commented at first (we can also have it uncommented but then in the CityDataHanler we have to genarate along with FK as query Params)
		$(`#${table_id}_filter`).prepend(`
			<!--
			<label>
				City: 
				<select class="form-control form-control-sm d-inline-block w-auto" id="sys_user_city_id_filter">
					<option value="0">Show All</option>
				</select>
			</label>
			<label>
				State: 
				<select class="form-control form-control-sm d-inline-block w-auto" id="sys_user_state_id_filter">
					<option value="0">Show All</option>
				</select>
			</label>
			<label>
				Country: 
				<select class="form-control form-control-sm d-inline-block w-auto" id="sys_user_country_id_filter">
					<option value="0">Show All</option>
				</select>
			</label>
			<label>
				Active: 
				<select class="form-control form-control-sm d-inline-block w-auto" id="sys_user_active_lookup_id_filter">
					<option value="0">Show All</option>
				</select>
			</label>
			-->
		`)
	}


	// this will populate the filters with relevant values
	function populateFilters(table_id, filterObject) {

		// Uncomment the required filters appropriately


		//CityScript.getInstance().populateInfo( $(`#${table_id}_filter #sys_user_city_id_filter`), filterObject.cityId );
		//StateScript.getInstance().populateInfo( $(`#${table_id}_filter #sys_user_state_id_filter`), filterObject.stateId );
		//CountryScript.getInstance().populateInfo( $(`#${table_id}_filter #sys_user_country_id_filter`), filterObject.countryId );
		//LookupScript.getInstance().populateInfo( $(`#${table_id}_filter #sys_user_active_lookup_id_filter`), DEFAULT.ACTIVE_LOOKUP_ID, filterObject.activeLookupId, 0 /*getOrganizationId()*/ );
	}

	// this will bind the event handler for filter change
	function bindFilterHandlers(table_id) {

		// for each controls we bind the event handler

		//$(`#${table_id}_filter #sys_user_city_id_filter`).on("change", handleFilterChange);
		//$(`#${table_id}_filter #sys_user_state_id_filter`).on("change", handleFilterChange);
		//$(`#${table_id}_filter #sys_user_country_id_filter`).on("change", handleFilterChange);
		//$(`#${table_id}_filter #sys_user_active_lookup_id_filter`).on("change", handleFilterChange);
	}

	// whatever needs to be done when filter values are changed
	function handleFilterChange() {
		//sample as shown below
		createTable(0, getFilterObject());
	}

	//this will return an object representing the current state of filter values
	function getFilterObject() {

		//sample

		return {

			cityId: Number($('#sys_user_city_id_filter').val()) || DEFAULT.CITY_ID,
			stateId: Number($('#sys_user_state_id_filter').val()) || DEFAULT.STATE_ID,
			countryId: Number($('#sys_user_country_id_filter').val()) || DEFAULT.COUNTRY_ID,
			activeLookupId: Number($('#sys_user_active_lookup_id_filter').val()) || 0, //DEFAULT.ACTIVE_LOOKUP_ID,
		}
	}

	/// All custom functions area START


	/// custom functions area END
	function getData() {

		var data = getStorageData();
		if (data != null && data.values != null)
			return;

		fetchData({
			callback: function (status, response) {

				if (status && response.status_code >= 0) {

					console.log(response);
					setStorageData(response);
				}
			}
		});
	}
	/////////////////////////////////////////////////////////////////////////////////////////////////////////
	//// all tabulator dependent code goes in here




	//// all tabulator dependent code goes in here END
	/////////////////////////////////////////////////////////////////////////////////////////////////////////

	function myFunction(value) {
		return value;
	}

	function getIdIdx() {
		return INDEX.SYS_USER_ID;
	}

	function getNameIdx() {
		console.log('Please Change the Name Idx');
		return INDEX.CHOOSE_NAME;
	}

	function init() {
		return {
			//expose all public instance methods
			// createTabulator: createTabulator,
			loadTabContent: loadTabContent,
			// populateInfo: populateInfo,
			// setStorageData: setStorageData,
			// getStorageData: getStorageData,
			// fetchData: fetchData,
			//popUpAddForm: popUpAddForm,
			// getIdIdx: getIdIdx,
			// getNameIdx: getNameIdx,
			// getData: getData
		};
	}

	return {
		// Get the Singleton instance if one exists
		// or create one if it doesn't
		getInstance: function () {
			if (!instance) {
				instance = init();
			}
			return instance;
		},
		//expose all public method and objects here
		// INDEX: INDEX,
		// LABEL: LABEL,
		// FORM_FIELD: FORM_FIELD,
		// URL: URL,
		// REL: REL //,
		//loadDependents: loadDependents
	};
})();

// SysUserScript.myFunction();