






//Data input arrays
var dataModule = (function () {

//1. function constructor
    var Meal = function (id, dishName, mealType, calories, date) {
        this.id = id;
        this.dishName = dishName;
        this.mealType = mealType;
        this.calories = calories;
        this.date = date;
    };
//2. function to add item from array stored in local memory
    var allItems;
    if (JSON.parse(localStorage.getItem('MyMeals')) == null) {
        allItems = [];
    } else {
        allItems = JSON.parse(localStorage.getItem('MyMeals'));
    }

    return {
        addItem: function (dishObj, mealObj, caloriesObj, dateObj) {
            var newItem, ID;

            //create new id  for item and making sure it can't be length -1
            if (allItems.length > 0) {
                ID = allItems[allItems.length - 1].id + 1;
            } else {
                ID = 0;
            }
            //create item
            newItem = new Meal(ID, dishObj, mealObj, caloriesObj, dateObj);
            //push item to data structure
            allItems.push(newItem);
            //return the new element
            return newItem;
        },
        // delete item from array stored in local storage
        deleteItem: function (id) {
            var getLocal, ids, index;
            allItems = JSON.parse(localStorage.getItem('MyMeals'));
            ids = allItems.map(function (current) {
                return current.id;
            });

            index = ids.indexOf(id);
            if (index !== -1) {
                allItems.splice(index, 1);
                localStorage.setItem('MyMeals', JSON.stringify(allItems));
            }
        },
        //saves data in the local storage as string and overwrites allItems array
        localStorageItems: function () {
            localStorage.setItem('MyMeals', JSON.stringify(allItems));             
        },
        testing: function () {
            console.log(allItems);
        },
    };
})();

//UIcontroller
var UImodule = (function () {
    //1. DOMstrings variables
    var DOMstrings = {
        inputDishName: '.dish-name',
        inputMealType: '.meal-type',
        inputCalories: '.calories',
        inputDate: '.date',
        addButton: '.add-btn',
        outputContainer: '.output-wrapper',
        deleteButton: '.delete-btn'
    };

    return {
        // getInput function
        getInput: function () {

            return {
                dishObj: document.querySelector(DOMstrings.inputDishName).value, //input type string for dish name
                mealObj: document.querySelector(DOMstrings.inputMealType).value, // will be one of the meal types, type string
                caloriesObj: document.querySelector(DOMstrings.inputCalories).value, // input type string for calorie
                dateObj: document.querySelector(DOMstrings.inputDate).value // input type string for date      
            }
        },
        // add list item function
        addListItem: function (obj) {
            var html, newHTML,element;
            //create html string with placeholder text
            element = DOMstrings.outputContainer;
            html = '<div class="output-child" id="meal-%id%"> <div class="dish-names-output item output">%dishObj%</div> <div class="meal-types-output item output">%mealObj%</div><div class="calories-output item output">%caloriesObj% Cal</div><div class="dates-output item output">%dateObj%</div><div class="delete-item"><button class="delete-btn"><ion-icon name="remove-circle-outline"></ion-icon></button></div></div>'
            //replace the text with some actual data from local storage
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%dishObj%', obj.dishName);
            newHTML = newHTML.replace('%mealObj%', obj.mealType);
            newHTML = newHTML.replace('%caloriesObj%', obj.calories);
            newHTML = newHTML.replace('%dateObj%', obj.date);
            //insert the html into the DOM
            
            document.querySelector(element).insertAdjacentHTML('afterbegin', newHTML);

        },
        // delete list item function
        deleteListItem: function (selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        clearFields: function () {
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMstrings.inputDishName + ', ' + DOMstrings.inputCalories);

            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function (current, index, array) {
                current.value = "";
            });
            fieldsArray[0].focus();
        },
        //return DOMstrings so global app controller can get them
        getDOMstrings: function () {
            return DOMstrings;
        }
    };
})();

//Global app controller with event listeners
var controllerModule = (function (dataMod, UImod) {
//1. function to get DOMstrings from UI controller
//2. event listener for click and keypress
    var setupEventListeners = function () {
        var DOM = UImodule.getDOMstrings();
        //listen for click on delete button
        document.querySelector(DOM.addButton).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                return ctrlAddItem();
            }
        });
        //listen for click on remove/delete button
        document.querySelector(DOM.outputContainer).addEventListener('click',ctrlDeleteItem)

        document.querySelector(".today").valueAsDate = new Date();
    };
    
    var ctrlAddItem = function () {
        var input, newItem;
        //1. get field input data
        input = UImod.getInput();

        if (input.dishObj !== "" && !isNaN(input.caloriesObj) && input.caloriesObj > 0) {

        
            //2. add the item to the UImodule
            newItem = dataMod.addItem(input.dishObj, input.mealObj, input.caloriesObj, input.dateObj);
            console.log(newItem);
            //3. add all items to local storage
            dataMod.localStorageItems();
            //4. clear input fields
            UImod.clearFields();
            //5. add the items from local storage to the UI
            UImod.addListItem(newItem);

        }
    };

    // delete item
    var ctrlDeleteItem = function (event) {
        var itemID, splitID, ID;
        itemID = event.target.parentNode.parentNode.parentNode.id;
        if (itemID) {
            
            splitID = itemID.split('-');
            ID = parseInt(splitID[1]);
            
            //delete item from local storage
            dataMod.deleteItem(ID);
            //delete item form UI
            UImod.deleteListItem(itemID);
        }
    };

    return {
        init: function () {
            setupEventListeners();

            //gets data from local storage as objects
            var getLocalStorage = JSON.parse(localStorage.getItem('MyMeals')); 
            
            getLocalStorage.forEach(function output(item) {
                if (getLocalStorage !== null) {
                    UImod.addListItem(item);
                }
            });    
        }
    }
})(dataModule, UImodule);

//global app controller initiator on start up
controllerModule.init();
