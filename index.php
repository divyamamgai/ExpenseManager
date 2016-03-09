<html>
<head>
    <title>Expense Manager</title>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <meta name="theme-color" content="#37474F"/>
    <link rel="stylesheet" href="style.css"/>
    <script src="jquery.js" type="text/javascript"></script>
    <script src="TweenMax.js" type="text/javascript"></script>
    <script src="main.js" type="text/javascript"></script>
</head>
<body>
<div id="MainFrame"></div>
<svg id="RemoveExpenseButtonCache" class="RemoveExpenseButton" viewBox="0 0 64 64">
    <g>
        <rect id="Base" width="48" height="48" x="8" y="8" rx="24" ry="24" fill="#607D8B"></rect>
        <g id="Plus">
            <rect width="18" height="2" x="23" y="31" fill="#CFD8DC"></rect>
        </g>
    </g>
</svg>
<svg id="AddExpenseButton" viewBox="0 0 64 64">
    <g>
        <rect id="Base" width="48" height="48" x="8" y="8" rx="24" ry="24" fill="#607D8B"></rect>
        <g id="Plus">
            <rect width="2" height="18" x="31" y="23" fill="#CFD8DC"></rect>
            <rect width="18" height="2" x="23" y="31" fill="#CFD8DC"></rect>
        </g>
    </g>
</svg>
<div id="Header">
    <svg id="MenuButtonSVG" viewBox="0 0 64 48">
        <rect id="Top"
              width="48"
              height="5"
              x="8"
              y="9"></rect>
        <rect id="Middle"
              width="48"
              height="5"
              x="8"
              y="21.4"></rect>
        <rect id="Bottom"
              width="48"
              height="5"
              x="8"
              y="33.8"></rect>
    </svg>
    <span id="HeaderTitle">Expense Manager</span>
</div>
<div id="SideMenu"></div>
<div id="SideMenuClose"></div>
<div id="PopUpBack"></div>
<div id="PopUpFrame">
    <h1>Add Expense</h1>
    <h3>Type</h3>
    <select id="PopUpType" title="Type">
        <option>Food</option>
        <option>Travel</option>
        <option>Other</option>
    </select>
    <h3>Description</h3>
    <input id="PopUpDescription" type="text" title="Description">
    <h3>Amount</h3>
    <input id="PopUpAmount" type="text" title="Amount">
    <a id="PopUpAddButton" class="PopUpButton">Add</a>
    <a id="PopUpCancelButton" class="PopUpButton">Cancel</a>
</div>
</body>
</html>
