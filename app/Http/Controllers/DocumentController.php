<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Service\Compiler;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Jefyokta\Json2Tex\Converter as Json2TexConverter;
use Jefyokta\Json2Tex\Interface\Converter;
use Spatie\Browsershot\Browsershot;

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


    public function compile()
    {

        try {


            $document = Auth::user()->document;

            $files =  Storage::disk('local')->allFiles("documents/{$document->id}");

            $json = Storage::disk('local')->get("documents/{$document->id}/bab1.json");

            $docs = [];

            foreach ($files as $file) {
                $filesArr = explode('.', $file);
                $fileExt = end($filesArr);
                if ($fileExt && $fileExt == 'json') {
                    $json =   Storage::disk('local')->get($file);
                    $object =  json_decode($json, false);


                    if (!isset($object->type) || $object->type !== 'bab') {
                        continue;
                    }
                    if ($object->type == 'bab') {
                        $node = (object) [
                            'type' => "heading",
                            'attrs' => (object) ['level' => 1],
                            'content' => [(object) [
                                'type' => "text",
                                'text' => $object->main->text
                            ]]
                        ];

                        $object->contents = array_merge([$node], is_array($object->contents) ? $object->contents : []);
                    }

                    $docs =  array_merge($docs, is_array($object->contents) ? $object->contents : []);
                }
            }

            $result = Json2TexConverter::setContent($docs)->getHtml();

            $pdfContent = Browsershot::html(view('pdf', ['html' => $result])->render())
                ->setNodeBinary('/Users/jefyokta/Library/Application\\ Support/Herd/config/nvm/versions/node/v22.12.0/bin/node')
                ->setNpmBinary('/Users/jefyokta/Library/Application\\ Support/Herd/config/nvm/versions/node/v22.12.0/bin/npm')
                ->margins(3, 3, 4, 4,'cm')
                ->format('A4')
                ->pdf();

            return response($pdfContent)
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'attachment; filename="document.pdf"');
        } catch (\Throwable $th) {
            dd($th);
            throw $th;
        }
    }
}
