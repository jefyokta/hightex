<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentController extends Controller
{
    public function show($document, $chapter = null)
    {

        return Inertia::render('Document/Document', ['name' => 'jefyokta']);
    }
}
