<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

trait FileResponseTrait
{
    /**
     * Respond with file, if it exists, else with a 404
     *
     * @param  string  $relPath
     *
     * @return Response|BinaryFileResponse
     */
    private function fileResponse(string $relPath)
    {
        if ( ! Storage::fileExists($relPath)) {
            return response('File not found', 404);
        }

        return response()->file(disk_path($relPath));
    }
}
