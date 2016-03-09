var Objects = {},
    Users = [],
    Food = [],
    FoodTotal = [],
    CompleteFoodTotal = 0,
    Travel = [],
    TravelTotal = [],
    CompleteTravelTotal = 0,
    Other = [],
    OtherTotal = [],
    CompleteOtherTotal = 0,
    UsersCount = 0,
    Variables = {
        SideMenuOpen: false,
        SideMenuTransiting: false,
        CurrentUserID: -1
    },
    ExpenseType = {
        Food: 0,
        Travel: 1,
        Other: 2
    },
    Functions = {
        MenuButtonSVGEnterEvent: function () {
            TweenMax.killTweensOf(Objects.MenuButtonSVGRects);
            TweenMax.staggerFromTo(Objects.MenuButtonSVGRects, 1, {
                scale: 0.75,
                transformOrigin: '50% 50%'
            }, {
                scale: 1,
                transformOrigin: '50% 50%',
                ease: Elastic.easeOut.config(2, 1)
            }, 0.1);
        },
        MenuButtonSVGLeaveEvent: function () {
            TweenMax.killTweensOf(Objects.MenuButtonSVGRects);
            TweenMax.staggerFromTo(Objects.MenuButtonSVGRects, 1, {
                scale: 1,
                transformOrigin: '50% 50%'
            }, {
                scale: 0.75,
                transformOrigin: '50% 50%',
                ease: Elastic.easeOut.config(2, 1)
            }, 0.1);
        },
        MenuButtonSVGClickEvent: function () {
            if (!Variables.SideMenuTransiting) {
                if (!Variables.SideMenuOpen) Functions.SideMenuOpen();
                else Functions.SideMenuClose();
            }
        },
        SideMenuOpen: function () {
            Variables.SideMenuTransiting = true;
            Objects.SideMenuClose.css('display', 'block');
            TweenMax.to(Objects.SideMenu, 1, {
                x: '0%',
                ease: Power4.easeOut,
                onComplete: function () {
                    Variables.SideMenuOpen = true;
                    Variables.SideMenuTransiting = false;
                }
            });
            TweenMax.to(Objects.MenuButtonSVG, 1, {
                x: '-75%',
                ease: Power4.easeOut
            });
            TweenMax.to({x: 2.5}, 1, {
                x: -2.5,
                onUpdate: function (tween) {
                    Objects.HeaderTitle.css('left', tween.target.x + 'vh');
                },
                onUpdateParams: ["{self}"],
                ease: Power4.easeOut
            });
        },
        SideMenuClose: function () {
            Variables.SideMenuTransiting = true;
            Objects.SideMenuClose.css('display', 'none');
            TweenMax.to(Objects.SideMenu, 1, {
                x: '-100%',
                ease: Power4.easeOut,
                onComplete: function () {
                    Variables.SideMenuOpen = false;
                    Variables.SideMenuTransiting = false;
                }
            });
            TweenMax.to(Objects.MenuButtonSVG, 1, {
                x: '0%',
                ease: Power4.easeOut
            });
            TweenMax.to({x: -2.5}, 1, {
                x: 2.5,
                onUpdate: function (tween) {
                    Objects.HeaderTitle.css('left', tween.target.x + 'vh');
                },
                onUpdateParams: ["{self}"],
                ease: Power4.easeOut
            });
        },
        GetUsers: function () {
            $.get('GetUsers.php', function (data, status) {
                if (status === 'success') {
                    Users = data.Users;
                    UsersCount = Users.length;
                    Functions.GetExpenses();
                } else alert('Error getting users!');
            });
        },
        GetExpenses: function () {
            $.get('GetExpenses.php', function (data, status) {
                if (status === 'success') {
                    Food = data.Food;
                    Travel = data.Travel;
                    Other = data.Other;
                    Functions.PopulateUsers();
                    var CurrentUserID = (window.location + '').split('#');
                    if (CurrentUserID.length != 2 || CurrentUserID == '') CurrentUserID = -1;
                    else CurrentUserID = CurrentUserID[1];
                    Variables.CurrentUserID = parseInt(CurrentUserID, 10);
                    Functions.FrameEnterAnimation(Variables.CurrentUserID);
                } else alert('Error getting users!');
            });
        },
        AddExpense: function () {
            var SelectedExpenseType = Objects.PopUpType.selectedIndex,
                Description = Objects.PopUpDescription.val(),
                Amount = Objects.PopUpAmount.val();
            $.get('AddExpense.php?UserID=' + Variables.CurrentUserID + '&Type=' + SelectedExpenseType +
                '&Description=' + Description + '&Amount=' + Amount, function (data, status) {
                if (status === 'success' && data.status === 'success') {
                    Functions.AddExpenseOf(Variables.CurrentUserID, SelectedExpenseType, {
                        Description: Description,
                        Amount: parseInt(Amount, 10)
                    });
                    Functions.CalculateTotalOf(Variables.CurrentUserID, SelectedExpenseType);
                    Functions.PopUpHide();
                } else alert('Error adding expense!');
            });
        },
        RemoveExpense: function () {
            var This = $(this),
                SelectedExpenseType = parseInt(This.attr('data-type'), 10),
                Entry = parseInt(This.attr('data-entry'), 10);
            $.get('RemoveExpense.php?UserID=' + Variables.CurrentUserID + '&Type=' + SelectedExpenseType +
                '&Entry=' + Entry, function (data, status) {
                if (status === 'success' && data.status === 'success') {
                    Functions.RemoveExpenseOf(Variables.CurrentUserID, SelectedExpenseType, Entry);
                    Functions.CalculateTotalOf(Variables.CurrentUserID, SelectedExpenseType);
                } else alert('Error adding expense!');
            });
        },
        PopulateUsers: function () {

            var i = 0, j, ExpenseLength, Total;
            Objects.UserSideMenuItems = [];
            Objects.UserFrames = [];
            Objects.UserFoodTables = [];
            Objects.UserTravelTables = [];
            Objects.UserOtherTables = [];
            Objects.SideMenu.html('');
            Objects.MainFrame.html('');

            Objects.UserSideMenuItems.push($('<a class="SideMenuItem" data-user="-1" href="#-1">Total</a>').appendTo(Objects.SideMenu));
            Objects.TotalFrame = $('<div class="Frame"><h1>Total</h1><h3>Food</h3><table class="FoodTable" border="0" cellpadding="0" cellspacing="0"><tbody></tbody></table><h3>Travel</h3><table class="TravelTable" border="0" cellpadding="0" cellspacing="0"><tbody></tbody></table><h3>Other</h3><table class="OtherTable" border="0" cellpadding="0" cellspacing="0"><tbody></tbody></table></div>').appendTo(Objects.MainFrame);
            Objects.TotalFoodTable = $(Objects.TotalFrame.find('.FoodTable tbody')[0]);
            Objects.TotalTravelTable = $(Objects.TotalFrame.find('.TravelTable tbody')[0]);
            Objects.TotalOtherTable = $(Objects.TotalFrame.find('.OtherTable tbody')[0]);

            for (; i < UsersCount; i++) {
                Objects.UserSideMenuItems.push($('<a class="SideMenuItem" data-user="' + i + '" href="#' + i + '">' + Users[i] + '</a>').appendTo(Objects.SideMenu));
                Objects.UserFrames.push($('<div class="Frame"><h1>' + Users[i] + '</h1><h3>Food</h3><table class="FoodTable" border="0" cellpadding="0" cellspacing="0"><tbody></tbody></table><h3>Travel</h3><table class="TravelTable" border="0" cellpadding="0" cellspacing="0"><tbody></tbody></table><h3>Other</h3><table class="OtherTable" border="0" cellpadding="0" cellspacing="0"><tbody></tbody></table></div>').appendTo(Objects.MainFrame));
                Objects.UserFoodTables.push($(Objects.UserFrames[i].find('.FoodTable tbody')[0]));
                Objects.UserTravelTables.push($(Objects.UserFrames[i].find('.TravelTable tbody')[0]));
                Objects.UserOtherTables.push($(Objects.UserFrames[i].find('.OtherTable tbody')[0]));

                j = 0;
                ExpenseLength = Food[i].length;
                Total = 0;
                for (; j < ExpenseLength; j++) {
                    $('<tr><td class="DescriptionColumn">' + Food[i][j].Description + '</td><td class="RemoveExpenseButtonColumn"></td><td class="AmountColumn">' + Food[i][j].Amount + '</td></tr>')
                        .appendTo(Objects.UserFoodTables[i])
                        .find('td:eq(1)')
                        .append(Objects.RemoveExpenseButtonCache.clone().attr({
                            'data-entry': j,
                            'data-type': 0
                        }));
                    Total += Food[i][j].Amount;
                }
                if (ExpenseLength > 0) Objects.UserFoodTables[i].append('<tr><td class="TotalColumn"></td><td class="TotalColumn"></td><td class="TotalColumn">' + Total + '</td></tr>');
                FoodTotal.push(Total);

                j = 0;
                ExpenseLength = Travel[i].length;
                Total = 0;
                for (; j < ExpenseLength; j++) {
                    $('<tr><td class="DescriptionColumn">' + Travel[i][j].Description + '</td><td class="RemoveExpenseButtonColumn"></td><td class="AmountColumn">' + Travel[i][j].Amount + '</td></tr>')
                        .appendTo(Objects.UserTravelTables[i])
                        .find('td:eq(1)')
                        .append(Objects.RemoveExpenseButtonCache.clone().attr({
                            'data-entry': j,
                            'data-type': 1
                        }));
                    Total += Travel[i][j].Amount;
                }
                if (ExpenseLength > 0) Objects.UserTravelTables[i].append('<tr><td class="TotalColumn"></td><td class="TotalColumn"></td><td class="TotalColumn">' + Total + '</td></tr>');
                TravelTotal.push(Total);

                j = 0;
                ExpenseLength = Other[i].length;
                Total = 0;
                for (; j < ExpenseLength; j++) {
                    $('<tr><td class="DescriptionColumn">' + Other[i][j].Description + '</td><td class="RemoveExpenseButtonColumn"></td><td class="AmountColumn">' + Other[i][j].Amount + '</td></tr>')
                        .appendTo(Objects.UserOtherTables[i])
                        .find('td:eq(1)')
                        .append(Objects.RemoveExpenseButtonCache.clone().attr({
                            'data-entry': j,
                            'data-type': 2
                        }));
                    Total += Other[i][j].Amount;
                }
                if (ExpenseLength > 0) Objects.UserOtherTables[i].append('<tr><td class="TotalColumn"></td><td class="TotalColumn"></td><td class="TotalColumn">' + Total + '</td></tr>');
                OtherTotal.push(Total);

            }

            Objects.UserSideMenuItems.push($('<a class="SideMenuItem" data-user="-2" href="#-2">Add User</a>').appendTo(Objects.SideMenu));
            Objects.AddUserFrame = $('<div class="Frame"><h1>Add User</h1></div>').appendTo(Objects.MainFrame);

            Functions.PopulateTotalFrame();

        },
        CalculateTotalOf: function (userID, expenseType) {
            var UserTotalColumn, ExpenseTotalColumn, NewUserTotal = 0, NewExpenseTotal = 0, i = 0;
            switch (expenseType) {
                case ExpenseType.Food:
                    ExpenseTotalColumn = Objects.TotalFoodTable.find('.TotalColumn:eq(1)');
                    UserTotalColumn = Objects.TotalFoodTable.find('tr[data-user="' + userID + '"] .AmountColumn');
                    NewUserTotal = FoodTotal[userID];
                    for (; i < UsersCount; i++) NewExpenseTotal += FoodTotal[i];
                    CompleteFoodTotal = NewExpenseTotal;
                    break;
                case ExpenseType.Travel:
                    ExpenseTotalColumn = Objects.TotalTravelTable.find('.TotalColumn:eq(1)');
                    UserTotalColumn = Objects.TotalTravelTable.find('tr[data-user="' + userID + '"] .AmountColumn');
                    NewUserTotal = TravelTotal[userID];
                    for (; i < UsersCount; i++) NewExpenseTotal += TravelTotal[i];
                    CompleteTravelTotal = NewExpenseTotal;
                    break;
                case ExpenseType.Other:
                    ExpenseTotalColumn = Objects.TotalOtherTable.find('.TotalColumn:eq(1)');
                    UserTotalColumn = Objects.TotalOtherTable.find('tr[data-user="' + userID + '"] .AmountColumn');
                    NewUserTotal = OtherTotal[userID];
                    for (; i < UsersCount; i++) NewExpenseTotal += OtherTotal[i];
                    CompleteOtherTotal = NewExpenseTotal;
                    break;
            }
            UserTotalColumn.html(NewUserTotal);
            ExpenseTotalColumn.html(NewExpenseTotal);
        },
        AddExpenseOf: function (userID, expenseType, expenseObject) {
            var Expense, ExpenseTable, i = 0, ExpenseLength, ExpenseTotalColumn, Total = 0, ExpenseTotalArray, AddedColumn;
            switch (expenseType) {
                case ExpenseType.Food:
                    Expense = Food[userID];
                    ExpenseTable = Objects.UserFoodTables[userID];
                    ExpenseTotalArray = FoodTotal;
                    break;
                case ExpenseType.Travel:
                    Expense = Travel[userID];
                    ExpenseTable = Objects.UserTravelTables[userID];
                    ExpenseTotalArray = TravelTotal;
                    break;
                case ExpenseType.Other:
                    Expense = Other[userID];
                    ExpenseTable = Objects.UserOtherTables[userID];
                    ExpenseTotalArray = OtherTotal;
                    break;
            }
            Expense.push(expenseObject);
            ExpenseLength = Expense.length;
            ExpenseTotalColumn = ExpenseTable.find('.TotalColumn');
            if (ExpenseTotalColumn.length != 3) {
                AddedColumn = $('<tr><td class="DescriptionColumn">' + expenseObject.Description + '</td><td class="RemoveExpenseButtonColumn"></td><td class="AmountColumn">' + expenseObject.Amount + '</td></tr>')
                    .css('opacity', 0)
                    .appendTo(ExpenseTable);
                ExpenseTotalColumn = $('<tr><td class="TotalColumn"></td><td class="TotalColumn"></td><td class="TotalColumn">' + expenseObject.Amount + '</td></tr>')
                    .css('opacity', 0)
                    .appendTo(ExpenseTable)[0];
                Total = expenseObject.Amount;
                TweenMax.to(ExpenseTotalColumn, 1, {
                    opacity: 1,
                    ease: Power4.easeOut
                });
            } else {
                ExpenseTotalColumn = ExpenseTotalColumn[2];
                AddedColumn = $('<tr><td class="DescriptionColumn">' + expenseObject.Description + '</td><td class="RemoveExpenseButtonColumn"></td><td class="AmountColumn">' + expenseObject.Amount + '</td></tr>')
                    .css('opacity', 0)
                    .insertBefore($(ExpenseTotalColumn).parent());
                for (; i < ExpenseLength; i++) Total += Expense[i].Amount;
                ExpenseTotalColumn.innerText = Total;
            }
            ExpenseTotalArray[userID] = Total;
            AddedColumn.find('td:eq(1)').append(Objects.RemoveExpenseButtonCache.clone().attr({
                'data-entry': ExpenseLength - 1,
                'data-type': expenseType
            }));
            TweenMax.to(AddedColumn, 1, {
                opacity: 1,
                ease: Power4.easeOut
            });
        },
        RemoveExpenseOf: function (userID, expenseType, entry) {
            var Expense, ExpenseTable, i = 0, ExpenseLength, ExpenseTotalColumn, Total = 0, ExpenseTotalArray;
            switch (expenseType) {
                case ExpenseType.Food:
                    Expense = Food[userID];
                    ExpenseTable = Objects.UserFoodTables[userID];
                    ExpenseTotalArray = FoodTotal;
                    break;
                case ExpenseType.Travel:
                    Expense = Travel[userID];
                    ExpenseTable = Objects.UserTravelTables[userID];
                    ExpenseTotalArray = TravelTotal;
                    break;
                case ExpenseType.Other:
                    Expense = Other[userID];
                    ExpenseTable = Objects.UserOtherTables[userID];
                    ExpenseTotalArray = OtherTotal;
                    break;
            }
            Expense.splice(entry, 1);
            ExpenseLength = Expense.length;
            if (ExpenseLength > 0) {
                ExpenseTotalColumn = ExpenseTable.find('.TotalColumn');
                ExpenseTotalColumn = ExpenseTotalColumn[2];
                for (; i < ExpenseLength; i++) Total += Expense[i].Amount;
                ExpenseTotalColumn.innerText = Total;
            } else TweenMax.to(ExpenseTable.find('.TotalColumn').parent(), 0.5, {
                opacity: 0,
                ease: Power4.easeOut,
                onComplete: function () {
                    $(this.target).remove();
                }
            });
            TweenMax.to(ExpenseTable.find('tr:eq(' + entry + ')'), 0.5, {
                opacity: 0,
                ease: Power4.easeOut,
                onComplete: function () {
                    $(this.target).remove();
                }
            });
            ExpenseTotalArray[userID] = Total;
        },
        PopulateTotalFrame: function () {
            var i = 0;
            Objects.TotalFoodTable.html('');
            Objects.TotalTravelTable.html('');
            Objects.TotalOtherTable.html('');
            CompleteFoodTotal = CompleteTravelTotal = CompleteOtherTotal = 0;
            for (; i < UsersCount; i++) {
                Objects.TotalFoodTable.append('<tr data-user="' + i + '"><td class="DescriptionColumn">' + Users[i] + '</td><td class="AmountColumn">' + FoodTotal[i] + '</td></tr>');
                Objects.TotalTravelTable.append('<tr data-user="' + i + '"><td class="DescriptionColumn">' + Users[i] + '</td><td class="AmountColumn">' + TravelTotal[i] + '</td></tr>');
                Objects.TotalOtherTable.append('<tr data-user="' + i + '"><td class="DescriptionColumn">' + Users[i] + '</td><td class="AmountColumn">' + OtherTotal[i] + '</td></tr>');
                CompleteFoodTotal += FoodTotal[i];
                CompleteTravelTotal += TravelTotal[i];
                CompleteOtherTotal += OtherTotal[i];
            }
            Objects.TotalFoodTable.append('<tr class="TotalRow"><td class="TotalColumn"></td><td class="TotalColumn">' + CompleteFoodTotal + '</td></tr>');
            Objects.TotalTravelTable.append('<tr class="TotalRow"><td class="TotalColumn"></td><td class="TotalColumn">' + CompleteTravelTotal + '</td></tr>');
            Objects.TotalOtherTable.append('<tr class="TotalRow"><td class="TotalColumn"></td><td class="TotalColumn">' + CompleteOtherTotal + '</td></tr>');
        },
        GetUserFrame: function (userID) {
            switch (userID) {
                case -1:
                    return Objects.TotalFrame;
                    break;
                case -2:
                    return Objects.AddUserFrame;
                    break;
                default:
                    return Objects.UserFrames[userID];
            }
        },
        FrameEnterAnimation: function (userID, callback) {
            var Frame = Functions.GetUserFrame(userID);
            TweenMax.fromTo(Frame, 1, {
                opacity: 0,
                y: 100,
                zIndex: 1
            }, {
                opacity: 1,
                y: 0,
                onComplete: callback,
                ease: Power4.easeOut
            });
            if (userID >= 0)Functions.AddExpenseButtonEnterAnimation();
            else Functions.AddExpenseButtonExitAnimation();
        },
        FrameExitAnimation: function (userID, callback) {
            TweenMax.fromTo(Functions.GetUserFrame(userID), 1, {
                opacity: 1,
                y: 0,
                zIndex: 0
            }, {
                opacity: 0,
                y: -100,
                onComplete: callback,
                ease: Power4.easeOut
            });
        },
        AddExpenseButtonEnterAnimation: function () {
            Objects.AddExpenseButton.css('visibility', 'visible');
            TweenMax.to(Objects.AddExpenseButton, 0.5, {
                opacity: 1,
                scale: 1,
                rotation: 0,
                transformOrigin: '50% 50% 0',
                ease: Power4.easeOut
            });
        },
        AddExpenseButtonExitAnimation: function () {
            TweenMax.to(Objects.AddExpenseButton, 0.5, {
                opacity: 0,
                scale: 0.5,
                rotation: 90,
                transformOrigin: '50% 50% 0',
                ease: Power4.easeOut,
                onComplete: function () {
                    Objects.AddExpenseButton.css('visibility', 'hidden');
                }
            });
        },
        PopUpShow: function () {
            TweenMax.fromTo(Objects.PopUpBack, 1, {
                zIndex: 6,
                opacity: 0
            }, {
                opacity: 1,
                ease: Power4.easeOut
            });
            TweenMax.fromTo(Objects.PopUpFrame, 1, {
                zIndex: 6,
                opacity: 0
            }, {
                opacity: 1,
                ease: Power4.easeOut
            });
        },
        PopUpHide: function () {
            TweenMax.fromTo(Objects.PopUpBack, 1, {
                opacity: 1
            }, {
                opacity: 0,
                ease: Power4.easeOut,
                onComplete: function () {
                    Objects.PopUpBack.css('z-index', 0);
                }
            });
            TweenMax.fromTo(Objects.PopUpFrame, 1, {
                opacity: 1
            }, {
                opacity: 0,
                ease: Power4.easeOut,
                onComplete: function () {
                    Objects.PopUpFrame.css('z-index', 0);
                    Objects.PopUpAmount.val('');
                    Objects.PopUpDescription.val('');
                }
            });
        }
    };

$(document).on('ready', function () {
        Objects.MainFrame = $('#MainFrame', document);
        Objects.PopUpBack = $('#PopUpBack', document)
            .on('click', Functions.PopUpHide);
        Objects.PopUpFrame = $('#PopUpFrame', document);
        Objects.PopUpType = $('#PopUpType', document)[0];
        Objects.PopUpDescription = $('#PopUpDescription', document);
        Objects.PopUpAmount = $('#PopUpAmount', document);
        Objects.PopUpAddButton = $('#PopUpAddButton', document)
            .on('click', Functions.AddExpense);
        Objects.PopUpCancelButton = $('#PopUpCancelButton', document)
            .on('click', Functions.PopUpHide);
        Objects.RemoveExpenseButtonCache = $('#RemoveExpenseButtonCache', document).clone().removeAttr('id');
        Objects.AddExpenseButtonBase = $('#AddExpenseButton #Base', document);
        Objects.AddExpenseButtonPlus = $('#AddExpenseButton #Plus', document);
        Objects.AddExpenseButton = $('#AddExpenseButton', document)
            .on('mouseenter', function () {
                TweenMax.to(Objects.AddExpenseButtonBase, 0.5, {
                    scale: 1.3,
                    transformOrigin: '50% 50% 0',
                    ease: Power4.easeOut
                });
                TweenMax.to(Objects.AddExpenseButtonPlus, 0.5, {
                    scale: 1.3,
                    transformOrigin: '50% 50% 0',
                    rotation: 90,
                    ease: Power4.easeOut
                });
            })
            .on('mouseleave', function () {
                TweenMax.to(Objects.AddExpenseButtonBase, 0.5, {
                    scale: 1,
                    fill: '#607D8B',
                    transformOrigin: '50% 50% 0',
                    ease: Power4.easeOut
                });
                TweenMax.to(Objects.AddExpenseButtonPlus, 0.5, {
                    scale: 1,
                    transformOrigin: '50% 50% 0',
                    rotation: 0,
                    ease: Power4.easeOut
                });
            })
            .on('mousedown', function () {
                TweenMax.to(Objects.AddExpenseButtonBase, 0.5, {
                    fill: '#546E7A',
                    ease: Power4.easeOut
                });
            })
            .on('mouseup', function () {
                TweenMax.to(Objects.AddExpenseButtonBase, 0.5, {
                    fill: '#607D8B',
                    ease: Power4.easeOut
                });
            })
            .on('click', Functions.PopUpShow);
        Objects.SideMenu = $('#SideMenu', document);
        Objects.SideMenuClose = $('#SideMenuClose', document)
            .on('click', function () {
                if (Variables.SideMenuOpen) Functions.SideMenuClose();
            });
        Objects.HeaderTitle = $('#HeaderTitle', document);
        Objects.MenuButtonSVG = $('#MenuButtonSVG', document)
            .on('mouseenter', Functions.MenuButtonSVGEnterEvent)
            .on('mouseleave', Functions.MenuButtonSVGLeaveEvent)
            .on('click', Functions.MenuButtonSVGClickEvent);
        Objects.MenuButtonSVGRects = Objects.MenuButtonSVG.find('rect');
        Functions.GetUsers();
    })
    .on('mouseenter', '.SideMenuItem', function () {
        TweenMax.to(this, 0.5, {
            color: '#CFD8DC',
            backgroundColor: '#37474F',
            ease: Power4.easeOut
        });
    })
    .on('mouseleave', '.SideMenuItem', function () {
        TweenMax.to(this, 0.5, {
            color: '#90A4AE',
            backgroundColor: '#263238',
            ease: Power4.easeOut
        });
    })
    .on('click', '.SideMenuItem', function () {
        var This = $(this),
            UserID = parseInt(This.attr('data-user'));
        Functions.SideMenuClose();
        if (UserID != Variables.CurrentUserID) {
            Functions.FrameEnterAnimation(UserID, function () {
                Variables.CurrentUserID = UserID;
            });
            Functions.FrameExitAnimation(Variables.CurrentUserID);
        }
    })
    .on('mouseenter', '.PopUpButton', function () {
        TweenMax.to(this, 0.5, {
            backgroundColor: '#546E7A',
            ease: Power4.easeOut
        });
    })
    .on('mouseleave', '.PopUpButton', function () {
        TweenMax.to(this, 0.5, {
            backgroundColor: '#455A64',
            ease: Power4.easeOut
        });
    })
    .on('mousedown', '.PopUpButton', function () {
        TweenMax.to(this, 0.5, {
            backgroundColor: '#455A64',
            ease: Power4.easeOut
        });
    })
    .on('mouseup', '.PopUpButton', function () {
        TweenMax.to(this, 0.5, {
            backgroundColor: '#546E7A',
            ease: Power4.easeOut
        });
    })
    .on('click', '.RemoveExpenseButton', Functions.RemoveExpense);