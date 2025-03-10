<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ChapterController extends Controller
{
    private function getJson($document, $chapter)
    {

        // dd($chapter,$document,str_contains($chapter, 'bab'));
        if (str_contains($chapter, 'bab')) {
            $path = storage_path("app/private/documents/$document/$chapter");
            // dd($path);
            if (!file_exists($path)) {
                abort(404);
            }

            return json_decode(file_get_contents($path), true);
        }
        return abort(404);
    }

    public function showChapter($document, $chapter)
    {
        $content = $this->getJson($document, "$chapter.json");

        $chapter = "Bab". implode(" ", explode('bab', $chapter));
        return Inertia::render('Document/DocumentEditor', [
            'content' => $content,
            'document' => Document::find($document),
            'chapter' => $chapter,
        ]);
    }
}
