

let budgetController = (function () {

    let Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    Expense.prototype.calPercentage = function (totalIncome) {
        if (totalIncome > 0)
            this.percentage = Math.round((this.value / totalIncome) * 100)
        else
            this.percentage = -1;
    };
    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }
    let Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    let calculateTotal = function (type) {
        let sum = 0;
        data.allItems[type].forEach(element => {
            sum += element.value;
        });
        data.totals[type] = sum;
    }
    let data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        per: -1
    };
    let formatNumbers = function (num, type) {
        let numSplit, int, dec;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');
        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        dec = numSplit[1];


        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };
    let allData = {
        inc: [],
        exp: []
    }

    return {
        addItem: function (type, des, val) {
            let newItem, id;

            if (data.allItems[type].length > 0)
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            else id = 0;

            if (type === "exp") {
                newItem = new Expense(id, des, val);
            }
            else if (type === "inc") {
                newItem = new Income(id, des, val);
            }
            data.allItems[type].push(newItem);
            let arr = {
                id: newItem.id,
                description: newItem.description,
                value: newItem.value
            };

            allData[type].push(arr);
            return newItem;
        },
        allDataRecords: function () {
            return allData;
        },
        deleteItem: function (type, id) {
            let index, ids;
            // data.allItems[type].splice(id, 1);
            // console.log(data.allItems[type][id]);

            ids = data.allItems[type].map(function (current) {
                return current.id;
            });
            // console.log(id);
            // console.log(ids);
            index = ids.indexOf(id);
            // console.log(index);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
                allData[type].splice(index, 1);
            }
        },
        updateItem: function (type, id) {
            let index, ids;

            ids = data.allItems[type].map(function (current) {
                return current.id;
            });
            // console.log(ids);
            index = ids.indexOf(id);
            alert(id + index);
            if (index !== -1) {
                checkSort = document.getElementById("sortSelectBox").value;
                if (checkSort === "name") {
                    document.getElementById("IncomeExpenseSelector").style.background = "white";
                    document.getElementById("IncomeExpenseSelector").style.color = "black";
                    document.getElementById("IncomeExpenseSelector").value = type;
                    document.getElementById("description").value = allData[type][index].description;
                    document.getElementById("value").value = allData[type][index].value;
                    document.getElementById("addBtn").innerText = "Update";
                }
                else {
                    document.getElementById("IncomeExpenseSelector").style.background = "white";
                    document.getElementById("IncomeExpenseSelector").style.color = "black";
                    document.getElementById("IncomeExpenseSelector").value = type;
                    document.getElementById("description").value = data.allItems[type][index].description;
                    document.getElementById("value").value = data.allItems[type][index].value;
                    document.getElementById("addBtn").innerText = "Update";

                }
                // document.getElementById("IncomeExpenseSelector").disabled = true;

                // if (desc = prompt("Enter New Description : ")) {
                //     if (amo = parseInt(prompt("Enter New Amount : "))) {
                //         if (desc == "") {
                //             alert("Please Enter descriptin");
                //         }
                //         else if (isNaN(amo) || amo <= 0) {
                //             alert("Please Enter Valid Amount");
                //         }
                //         else {
                //             data.allItems[type][index].description = desc;
                //             data.allItems[type][index].value = amo;
                //             console.log(data.allItems[type][index]);
                //             document.getElementById(`desc_${type}-${id}`).innerText = data.allItems[type][index].description;
                //             document.getElementById(`value_${type}-${id}`).innerText = formatNumbers(data.allItems[type][index].value, type);
                //             console.log(document.getElementsByClassName(`pr-${id}`).innerText = 10);
                //         }
                //     }
                //     else {
                //         alert("Please Enter Amount....!");
                //     }
                // }
                // else {
                //     alert("Please Enter Valid Description");
                // }
            }
        },
        update: function (type, id) {
            let index, ids;

            ids = data.allItems[type].map(function (current) {
                return current.id;
            });
            // console.log(ids);
            index = ids.indexOf(id);
            if (index !== -1) {

                data.allItems[type][index].description = document.getElementById("description").value;
                data.allItems[type][index].value = parseInt(document.getElementById("value").value);
                allData[type][index].id = id;
                allData[type][index].description = data.allItems[type][index].description;
                allData[type][index].value = data.allItems[type][index].value;
                console.log(data.allItems[type][index]);
                console.log(allData[type][index]);
                document.getElementById(`desc_${type}-${id}`).innerText = data.allItems[type][index].description;
                document.getElementById(`value_${type}-${id}`).innerText = formatNumbers(data.allItems[type][index].value, type);
            }

        },

        calculateBudget: function () {
            calculateTotal("inc");
            calculateTotal("exp");

            data.budget = data.totals.inc - data.totals.exp;
            if (data.totals.inc > 0) {
                data.per = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
            else {
                data.per = -1;
            }
        },
        calculatePercentages: function () {
            data.allItems.exp.forEach(function (cur) {
                cur.calPercentage(data.totals.inc);
            });
        },
        getPercentages: function () {
            let allperc;
            allperc = data.allItems.exp.map(function (cur) {
                return cur.getPercentage();
            });
            return allperc;
        },
        getBudget: function () {

            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                perc: data.per
            };
        }
    }

})();

let UIController = (function () {
    document.getElementById("IncomeExpenseSelector").addEventListener('change', function () {
        let income_expense = document.getElementById("IncomeExpenseSelector").value;
        // alert(document.getElementById("IncomeExpenseSelector").value);
        if (income_expense === "inc") {
            document.getElementById("IncomeExpenseSelector").style.background = "green";
            document.getElementById("IncomeExpenseSelector").style.border = "2px solid lightgreen";
            document.getElementById("addBtn").style.background = "lightgreen";
            document.getElementById("addBtn").style.borderColor = "green";
            document.getElementById("description").style.borderColor = "green";
            document.getElementById("value").style.borderColor = "green";
            document.getElementById("addBtn").style.boxShadow = "0px 0px 10px green";
        }
        else {
            document.getElementById("IncomeExpenseSelector").style.background = "red";
            document.getElementById("IncomeExpenseSelector").style.border = "2px solid tomato";
            document.getElementById("addBtn").style.background = "tomato";
            document.getElementById("description").style.borderColor = "red";
            document.getElementById("value").style.borderColor = "red";
            document.getElementById("addBtn").style.borderColor = "red";
            document.getElementById("addBtn").style.boxShadow = "0px 0px 10px red";
        }
    });


    let formatNumbers = function (num, type) {
        let numSplit, int, dec;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');
        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        dec = numSplit[1];


        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    return {
        getInput: function () {
            return {
                income_expense: document.getElementById("IncomeExpenseSelector").value,
                description: document.getElementById("description").value,
                value: parseFloat(document.getElementById("value").value)
            }
        },

        addListItems: function (obj, type) {
            let htmlstr, newHtml, d;
            if (type === "inc") {
                htmlstr = '<tr id="inc-%id%"><td>' + new Date().getDate() + '-' + getMonthName(new Date().getMonth()) + '-' + new Date().getFullYear() + '</td><td id="desc_inc-' + obj.id + '">%desc%</td><td id="value_inc-' + obj.id + '">%value%</td><td><button id="delete">Delete</button></td><td><button id="update">Update</button></td></tr>';
                d = document.getElementById("iRec");


            }
            else if (type === "exp") {

                htmlstr = '<tr id="exp-%id%"><td>' + new Date().getDate() + '-' + getMonthName(new Date().getMonth()) + '-' + new Date().getFullYear() + '</td><td id="desc_exp-' + obj.id + '">%desc%</td><td id="value_exp-' + obj.id + '">%value%<font size=1 style="background:black" id="perc">--</font></td><td><button id="delete">Delete</button></td><td><button id="update">Update</button></td></tr>';

                d = document.getElementById("eRec");

            }

            newHtml = htmlstr.replace('%id%', obj.id);
            newHtml = newHtml.replace('%desc%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumbers(obj.value, type));
            d.insertAdjacentHTML('beforeend', newHtml);
            // document.getElementById("per").innerText = "20%";
        },
        deleteListItem: function (selectorId) {

            let el = document.getElementById(selectorId);
            if (el === null) {
                return false;
            }
            else {
                //alert(el)
                if (el === null) {
                    document.getElementById("description").value = "";
                    document.getElementById("value").value = "";
                    document.getElementById("addBtn").innerText = "ADD";

                }
                el.parentNode.removeChild(el);
                return true;
            }

        },
        clearFields: function () {
            let field, fieldArr;
            field = document.querySelectorAll("#description" + ',' + "#value");
            fieldArr = Array.prototype.slice.call(field);
            fieldArr.forEach(i => { i.value = "" });
            fieldArr[0].focus();
        },

        displayBudget: function (obj) {
            let type;
            obj.budget > 0 ? type = "inc" : type = "exp";
            document.getElementById("showCurrentBudget").innerText = formatNumbers(obj.budget, type);
            document.getElementById("incomeStatus").innerText = formatNumbers(obj.totalInc, "inc");
            document.getElementById("expenseStatus").innerText = formatNumbers(obj.totalExp, "exp");
            if (obj.perc > 0) {
                document.getElementById("percExpenseStatus").innerText = obj.perc + "%";
            }
            else {
                document.getElementById("percExpenseStatus").innerText = "---";
            }
        },
        colorChanger: function () {
            let income_expense = document.getElementById("IncomeExpenseSelector").value;
            // alert(document.getElementById("IncomeExpenseSelector").value);
            if (income_expense === "inc") {
                document.getElementById("IncomeExpenseSelector").style.background = "green";
                document.getElementById("IncomeExpenseSelector").style.border = "2px solid lightgreen";
                document.getElementById("addBtn").style.background = "lightgreen";
                document.getElementById("addBtn").style.borderColor = "green";
                document.getElementById("description").style.borderColor = "green";
                document.getElementById("value").style.borderColor = "green";
                document.getElementById("addBtn").style.boxShadow = "0px 0px 10px green";
            }
            else {
                document.getElementById("IncomeExpenseSelector").style.background = "red";
                document.getElementById("IncomeExpenseSelector").style.border = "2px solid tomato";
                document.getElementById("addBtn").style.background = "tomato";
                document.getElementById("description").style.borderColor = "red";
                document.getElementById("value").style.borderColor = "red";
                document.getElementById("addBtn").style.borderColor = "red";
                document.getElementById("addBtn").style.boxShadow = "0px 0px 10px red";
            }
        },
        displayPercentages: function (percentages) {
            let field = document.querySelectorAll("#perc");
            // alert(percentages);
            nodeListForEach = function (list, callback) {
                for (let i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            }

            nodeListForEach(field, function (current, index) {
                if (percentages[index] > 0) {
                    current.innerText = percentages[index] + "%";
                }
                else
                    current.innerText = "--";
            });
        },

    }


})();

let controller = (function (budgetCtrl, UICtrl) {
    let focus = false, upid, updateValue = true;
    function updateBudget() {
        budgetCtrl.calculateBudget();
        let budget = budgetCtrl.getBudget();
        // console.log(budget);
        UICtrl.displayBudget(budget);

    };

    function updatePercentages() {
        budgetCtrl.calculatePercentages();

        let per = budgetCtrl.getPercentages();

        UICtrl.displayPercentages(per);
    }

    function add() {
        let inputs, newItem, percent;
        // focus = false;
        inputs = UICtrl.getInput();
        // console.log(inputs);
        newItem = budgetCtrl.addItem(inputs.income_expense, inputs.description, inputs.value);
        UICtrl.addListItems(newItem, inputs.income_expense);
        UICtrl.clearFields();
        updateBudget();
        updatePercentages();
    }
    function addItem() {
        let checkBtn = document.getElementById("addBtn").innerText;
        if (checkBtn === "ADD") {
            let inputs, newItem, percent;
            focus = false;
            inputs = UICtrl.getInput();
            // console.log(inputs);
            if (inputs.description == "") {
                alert("Please Enter Valid Description [Description More than 3 Words]");
            }
            else if (inputs.value <= 0 || isNaN(inputs.value)) {
                alert("Please Enter Amount [Amount is Greater than 0]");
            }
            else {
                newItem = budgetCtrl.addItem(inputs.income_expense, inputs.description, inputs.value);
                UICtrl.addListItems(newItem, inputs.income_expense);
                UICtrl.clearFields();
                updateBudget();
                updatePercentages();
            }
        }
        else if (checkBtn === "Update") {
            let type = document.getElementById("IncomeExpenseSelector").value;
            if (updateValue) {
                if (document.getElementById("description").value === "" || parseInt(document.getElementById("value").value) <= 0) {
                    alert("Please Enter all fields");

                }
                else {
                    UICtrl.colorChanger();
                    let budget = budgetCtrl.getBudget();
                    //alert("this is working");
                    //let type = document.getElementById("IncomeExpenseSelector").value;
                    console.log(type, upid);
                    budgetCtrl.update(type, upid);

                    updateBudget();
                    UICtrl.clearFields();
                    document.getElementById("IncomeExpenseSelector").disabled = false;
                    document.getElementById("addBtn").innerText = "ADD";
                }
            }
            else {

                UICtrl.colorChanger();

                type === "inc" ? type = "exp" : type = "inc";
                if (document.getElementById("description").value === "" || parseInt(document.getElementById("value").value) <= 0) {
                    alert("Please Enter all fields");
                }
                else {
                    //type === "inc" ? type = "exp" : type = "inc";

                    if (type !== document.getElementById("IncomeExpenseSelector").value) {
                        budgetCtrl.deleteItem(type, upid);
                        itemId = type + "-" + upid;

                        if (UICtrl.deleteListItem(itemId)) {
                            document.getElementById("IncomeExpenseSelector").disabled = false;
                            document.getElementById("addBtn").innerText = "ADD";
                            add();
                            updateBudget();
                            updatePercentages();
                            UICtrl.clearFields();
                            updateValue = true;
                        }
                        else {
                            alert("You have Deleted This record");
                            document.getElementById("addBtn").innerText = "ADD";
                            UICtrl.clearFields();
                            updateValue = true;
                        }
                    }
                    else {
                        alert("check");
                    }

                }


            }


        }

    }
    function deleteRecord() {
        let itemId, splitId, type, id;
        itemId = event.target.parentNode.parentNode.id;
        //console.log(itemId);
        if (itemId) {
            splitId = itemId.split('-');
            type = splitId[0];
            id = parseInt(splitId[1]);

            budgetCtrl.deleteItem(type, id);

            UICtrl.deleteListItem(itemId);

            updateBudget();
            updatePercentages();
        }
    }
    function ctrDeleteUpdateItem(event) {
        if (event.target.id === "delete") {
            deleteRecord();
        }
        else if (event.target.id === "update") {
            updateValue = true;
            let budget = budgetCtrl.getBudget();
            let itemId, splitId, type, id;
            itemId = event.target.parentNode.parentNode.id;
            alert(itemId);
            //console.log(itemId);
            if (itemId) {
                splitId = itemId.split('-');
                type = splitId[0];
                id = parseInt(splitId[1]);
                upid = id;
                budgetCtrl.updateItem(type, id);

                updateBudget();
                updatePercentages();

            }


        }
    }
    document.getElementById("sortSelectBox").addEventListener('change', sortItems);
    function sortItems() {
        if (this.value === "none") {
            alert("No Change");
        }
        else if (this.value === "name") {
            let arr = budgetCtrl.allDataRecords();
            let type = document.getElementById("IncomeExpenseSelector").value;

            arr[type].sort((a, b) => {
                return a.description.localeCompare(b.description)
            });


            // arr[type].sort((a, b) => {
            //     return a[1].localeCompare(b[1]);
            // });

            console.log(arr[type]);

            arr[type].map(function (cur, id) {
                cur.id = id;
                console.log(cur, id);
                document.getElementById(type + "-" + id).innerHTML = `<td>${new Date().getDate()}-${getMonthName(new Date().getMonth())}-${new Date().getFullYear()}</td><td id="desc_${type}-${id}">${cur.description}</td><td id="value_${type}-${id}">${formatNumbers(cur.value, type)}</td><td><button id="delete">Delete</button></td><td> <button id="update">Update</button></td>`;
            });

        }
    }
    document.getElementById("addBtn").addEventListener('click', addItem);
    document.getElementById("addBtn").addEventListener('focusin', () => {
        focus = true;
    });
    document.getElementById("addBtn").addEventListener('focusout', () => {
        focus = false;
    });
    document.addEventListener('keypress', function (e) {
        if (!focus) {
            if (e.key === "Enter") {
                addItem();
            }
        }
    });

    document.getElementById("container3").addEventListener('click', ctrDeleteUpdateItem);
    document.getElementById("IncomeExpenseSelector").addEventListener('change', () => {
        let checkBtn = document.getElementById("addBtn").innerText;
        if (checkBtn === "Update") {
            updateValue ? updateValue = false : updateValue = true;
        }
    });



    let formatNumbers = function (num, type) {
        let numSplit, int, dec;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');
        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        dec = numSplit[1];


        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

})(budgetController, UIController);

(function () {
    let str, year, now;

    function getMonthName(month) {
        const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        return monthName[month];
    }
    now = new Date();
    year = now.getFullYear();
    str = document.getElementById("displayMonth").innerText;
    str = str.replace("%month%", getMonthName(now.getMonth()));
    str = str.replace("%year%", now.getFullYear());
    document.getElementById("displayMonth").innerText = str;
})();

function getMonthName(month) {
    const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    return monthName[month];
}