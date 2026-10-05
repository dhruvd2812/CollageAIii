<?php

namespace App\Http\Controllers;

use App\Models\DesignUpload;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file' => [
                'required',
                'file',
                'max:25600', // 25 MB
                'mimes:jpg,jpeg,png,webp,pdf,svg',
            ],
        ]);

        $file = $request->file('file');
        $user = $request->user();

        $originalName = $file->getClientOriginalName();
        $extension = strtolower($file->getClientOriginalExtension());
        $mimeType = $file->getMimeType() ?: 'application/octet-stream';
        $sizeBytes = $file->getSize();
        $sha256 = hash_file('sha256', $file->getRealPath());

        $fileName = Str::uuid()->toString() . '.' . $extension;
        $path = $file->storeAs('designs/' . date('Y/m'), $fileName, 'public');

        $upload = DesignUpload::create([
            'user_id' => $user?->id,
            'disk' => 'public',
            'path' => $path,
            'original_name' => $originalName,
            'mime_type' => $mimeType,
            'extension' => $extension,
            'size_bytes' => $sizeBytes,
            'sha256' => $sha256,
            'status' => 'uploaded',
        ]);

        return response()->json([
            'success' => true,
            'upload' => [
                'id' => $upload->id,
                'name' => $upload->original_name,
                'url' => $upload->url,
                'is_image' => $upload->is_image,
                'size_formatted' => round($upload->size_bytes / 1024, 1) . ' KB',
            ],
        ]);
    }
}
