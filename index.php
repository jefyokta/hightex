<?php

require __DIR__ . '/../oktaax/vendor/autoload.php';

$app = new class extends \Oktaax\Oktaax {
    // use Oktaax\Trait\Laravelable;
};

// $app->laravelRegister(new Oktaax\Types\Laravel(__DIR__));
$app->get("/",function($req, $res){
 return  1 ;
});

$app->listen(8000,function($url){
    echo "started at $url";
});
