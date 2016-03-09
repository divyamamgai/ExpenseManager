<?php
header('Content-Type: application/json');
$UsersData = file_get_contents('users.txt');
$Users = preg_split('/[|]/', $UsersData);
$UsersCount = count($Users);
$l = $UsersCount - 1;
$i = 0;
echo '{"Users":[';
for (; $i < $UsersCount; $i++)
    if ($i < $l) echo '"' . $Users[$i] . '",';
    else echo '"' . $Users[$i] . '"';
echo ']}';
