<?php

namespace App\Service;

use Jefyokta\Json2Tex\Converter;

class Compiler
{
    /**
     * @param \Jefyokta\Json2Tex\Types\Node[] $nodes
     */
    public function compile($nodes)
    {

        return Converter::setContent($nodes)->getHtml();
    }
};
