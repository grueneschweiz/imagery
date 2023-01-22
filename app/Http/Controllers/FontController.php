<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;

class FontController extends Controller
{
    public function show(string $font)
    {
        $font = basename($font); // prevent directory traversal

        $relPath = config('app.protected_fonts_dir')
                       .DIRECTORY_SEPARATOR
                       .$font;

        if ( ! Storage::fileExists($relPath)) {
            return response('File not found', 404);
        }

        return response()->file(disk_path($relPath));
    }
}
