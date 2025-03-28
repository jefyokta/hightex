<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;


class DocumentController extends Controller
{

    private $chapters = ['bab1', 'bab2', 'bab3', 'bab4', 'bab5', 'bab6'];

    public function index()
    {
        return Inertia::render('Document/Document', [
            'document' => Auth::user()->document ?? false
        ]);
    }

    private function filter($contents)
    {
        $result = [];
        foreach ($contents as $c) {
            if ($c['type'] == 'heading') {
                if ($c['attrs']['level'] !== 1) {
                    $result[] = $c;
                }
            } else {

                $result[] = $c;
            }
        }

        return $result;
    }

    public function show($document, $chapter = null)
    {
        return Inertia::render('Document/Document');
    }


    public function create()
    {
        return Inertia::render("Document/CreateDocument");
    }

    public function store(Request $request)
    {
        $id = uniqid();
        $res = $request->validate(['title' => 'required|max:100']);
        $files = Storage::disk('local')->allFiles('template');
        $dir = 'documents/' . $id;
        if (!Storage::disk('local')->exists($dir)) {
            Storage::disk('local')->makeDirectory($dir);
        }


        foreach ($files as $file) {
            Storage::disk('local')->copy($file,  $dir . '/' . basename($file));
        }
        Document::create(
            [
                'title' => $res['title'],
                'id' => $id,
                'author' => Auth::user()->id
            ]
        );
        return;
    }

    public function save(Request $request, $chapter)
    {
        try {
            sleep(2);
            $requestData = json_decode($request->getContent(), true);

            if (!$requestData) {
                return response()->json(['error' => 'Invalid JSON'], 400);
            }


            $data = $this->filter($requestData['data']['content']);


            $document = Auth::user()->document->id;
            $dir = 'documents/' . $document;

            if (!Storage::disk('local')->exists($dir . "/$chapter.json")) {
                return response()->json(['error' => 'File not found'], 404);
            }

            $content = Storage::disk('local')->get($dir . "/$chapter.json");
            $content = json_decode($content, true);
            $content['contents'] = $data;

            Storage::disk('local')->put($dir . "/$chapter.json", json_encode($content));

            return response()->json(['message' => 'Document saved successfully', 'data' => $data], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage(), 'line' => $th->getLine()], 500);
        }
    }

    public function delete(Document $document)
    {

        Storage::disk('local')->deleteDirectory("documents/{$document->id}");
        $document->delete();
        return back()->with('success', 'Document Terhapus!');
    }


    public function compile(Document $document)
    {

        $files =  Storage::disk('local')->allFiles("documents/{$document->id}");

        foreach ($files as $file) {
            $object = json_decode($file);
            // $object->compile();
        }
    }
}
