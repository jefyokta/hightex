<?php

namespace App\Service;

use Jefyokta\Json2Tex\Converter;
use Jefyokta\Json2Tex\HtmlConverter;

use function Illuminate\Log\log;

class Compiler
{





    /**
     * @param \Jefyokta\Json2Tex\Types\Node[] $nodes
     */
    public function compile($nodes)
    {
        HtmlConverter::register('page', function ($element) {
            log("pagee");
            return Converter::getHtml($element->content);
        });
        HtmlConverter::register('body', function ($element) {
            log("body");
            return Converter::getHtml($element->content);
        });

        return Converter::setContent($nodes)->getHtml();
    }
};
