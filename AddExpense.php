<?php
header('Content-Type: application/json');
if (isset($_GET['UserID']) && isset($_GET['Type']) && isset($_GET['Description']) && isset($_GET['Amount'])) {

    $UserID = $_GET['UserID'];
    $Type = $_GET['Type'];
    $Description = $_GET['Description'];
    $Amount = $_GET['Amount'];

    $UsersData = file_get_contents('expenses.txt');
    $UsersDataArray = preg_split('/[|]/', $UsersData);
    $UsersCount = count($UsersDataArray);
    $LastUserIndex = $UsersCount - 1;
    $ExpenseArray = preg_split('/[#]/', $UsersDataArray[$UserID]);
    if (count($ExpenseArray) == 3) {
        $UpdatedData = '';
        $NewUserData = '';
        $i = 0;
        for (; $i < 3; $i++) {
            if ($i == $Type) {
                if (empty($ExpenseArray[$Type])) $ExpenseEntryArray = array();
                else $ExpenseEntryArray = preg_split('/[,]/', $ExpenseArray[$Type]);
                array_push($ExpenseEntryArray, $Description . ':' . $Amount);
                $ExpenseEntryCount = count($ExpenseEntryArray);
                $LastExpenseEntryIndex = $ExpenseEntryCount - 1;
                $j = 0;
                $NewExpenseData = '';
                for (; $j < $ExpenseEntryCount; $j++) $NewExpenseData .= $ExpenseEntryArray[$j] . ($j < $LastExpenseEntryIndex ? ',' : '');
                $NewUserData .= $NewExpenseData . ($i < 2 ? '#' : '');
            } else $NewUserData .= $ExpenseArray[$i] . ($i < 2 ? '#' : '');
        }
        $i = 0;
        for (; $i < $UsersCount; $i++) {
            if ($i == $UserID) $UpdatedData .= $NewUserData . ($i < $LastUserIndex ? '|' : '');
            else $UpdatedData .= $UsersDataArray[$i] . ($i < $LastUserIndex ? '|' : '');
        }
        if (file_put_contents('expenses.txt', $UpdatedData)) echo '{"status":"success"}';
        else echo '{"status":"error"}';
    } else die('{"status":"error"}');

} else die('{"status":"error"}');