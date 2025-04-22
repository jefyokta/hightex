<?php

use Swoole\Coroutine;
use Swoole\Coroutine\Channel;

class Promise
{

    protected $result;
    public function __construct(protected Channel $chan) {}

    public function then(callable $callback)
    {
        Coroutine::create(function () use ($callback) {
            $this->result = $this->chan->pop();
            $callback($this->result);
        });
    }
}

function async($func,): Promise
{
    $chan = new Channel(1);
    Coroutine::create(function () use ($chan, $func) {
        $chan->push($func());
    });

    return new Promise($chan);
}

Coroutine\run(function () {
    async(function () {
        Coroutine::sleep(5);

        return "1\n";
    })->then(function ($res) {
        echo $res;
    });

    async(function () {
        Coroutine::sleep(2);
        return "2\n";
    })->then(function ($res) {
        echo $res;
    });

    async(function () {
        Coroutine::sleep(1);

        return "3\n";
    })->then(function ($res) {
        echo "$res\n";
    });
});
