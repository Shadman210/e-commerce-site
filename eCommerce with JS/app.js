var budgetControler=(function(){
    var Expense = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Income = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    calulateTotal = function(type){
        var sum = 0;
        data.allItem[type].forEach(function(cur){
            sum += cur.value;
        });
        data.totals[type] = sum;

    }

    var data = {
        allItem:{
            exp :[],
            inc :[]
        },
        totals:{
            exp : 0,
            inc : 0
        },
        budget : 0,
        persentage : -1

    }


    return{
        addItem : function(type, des ,val){
            var newItem, ID;
        if(data.allItem[type].length>0){
            ID = data.allItem[type][data.allItem[type].length-1]+1;
        }
        else {
            ID = 0;
        }
        if(type ==='exp'){
            newItem = new Expense(ID,des,val);
        }
        else if(type === 'inc'){
            newItem = new Income(ID,des,val);
        }
        data.allItem[type].push(newItem);
        return newItem;

        },

        calculateBudget: function(){
            // calculate total income and expenses
            calulateTotal('exp');
            calulateTotal('inc');
            // calculate the income (income -expenses)
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the persentage of income that we spent
            if(data.totals.inc>0){
            data.persentage = Math.round(data.totals.exp / data.totals.inc * 100);
            }
            else{
                data.persentage = -1;
            }

        },

        getBudget : function(){
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                persentage: data.persentage
            };
        },

        testing : function(){
            console.log(data);
        }


    }
    
})();

var UIControler = (function(){
    var DOMstring={
        inputType : '.add__type',
        descriptionType : '.add__description',
        valueType : '.add__value',
        inputBtn : '.add__btn',
        incomeControler : '.income__list',
        expenseControler : '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        persentageLabel: '.budget__expenses--percentage'

    }

    return{
        getInput: function(){
            return{
                type : document.querySelector(DOMstring.inputType).value, // Will be either inc or exp
            description : document.querySelector(DOMstring.descriptionType).value,
                  value : parseFloat(document.querySelector(DOMstring.valueType).value)
            };
        },

            addListItem : function(obj, type){
                var html,newHtml,element;

                if(type === 'inc'){
                    element = DOMstring.incomeControler;
                    html = `<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`; 
                }

                else if(type === 'exp'){
                    element = DOMstring.expenseControler;
                    html = `<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
                }

                newHtml = html.replace('%id', obj.id);
                newHtml = html.replace('%description%',obj.description);
                newHtml = html.replace('%value%',obj.value);
                console.log(obj.description);

                
                document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);  


            },

            clearFields: function(){
                var fields, fieldsArr;
                 fields = document.querySelectorAll(DOMstring.descriptionType + ', ' + DOMstring.valueType);

                 fieldsArr = Array.prototype.slice.call(fields);

                 fieldsArr.forEach(function(current, index, array) {
                     current.value = "";
                      
                 });
                
                 fieldsArr[0].focus();


            },

           

            displayBudget: function(obj){
                document.querySelector(DOMstring.budgetLabel).textContent = obj.budget;
                document.querySelector(DOMstring.incomeLabel).textContent = obj.totalInc;
                document.querySelector(DOMstring.expensesLabel).textContent = obj.totalExp;
                

                if(obj.persentage>0){
                    document.querySelector(DOMstring.persentageLabel).textContent = obj.persentage + '%';
                }
                else{
                    document.querySelector(DOMstring.persentageLabel).textContent = '---';
                }
                 /*
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                persentage: data.persentage
                */

            },

            getDOMstring : function(){ 
            return DOMstring;
        }

    }


})();


    


var controler = (function(budgetCtrl,UICtrl){

    var setupEventListeners = function(){
    var DOM=UICtrl.getDOMstring();
        
    document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem)
 
    document.addEventListener('keypress',function(event){
        if(event.keyCode===13|| event.which===13)
            ctrlAddItem();
    })
    };

    var updateBudget = function(){
        //calculate the budget
         budgetCtrl.calculateBudget();

        //return the budget
        var budget = budgetCtrl.getBudget();

        

        //display the budget in UI
       UICtrl.displayBudget(budget);
    }
    
    var ctrlAddItem=function(){

    //get input value
    let input= UICtrl.getInput();
    console.log(input);

    if(input.description !=='' && !isNaN(input.value) && input.value>0){
        //add item to the budget controler
        var newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        //add the item to the UI 
        UICtrl.addListItem(newItem, input.type);

        //clear the field
        UICtrl.clearFields();

        //calculate and update the budget
        updateBudget();

        }

    console.log("it is working");
    };

    return{

        init : function(){
            console.log("Application has started");
            UIControler.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                persentage: -1
            });
            setupEventListeners();
        }

    }

})(budgetControler,UIControler);
controler.init();