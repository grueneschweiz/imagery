<?php

namespace Tests\Feature\Services;

use Database\Seeders\RootSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Logo;
use App\Services\LogoPackageService;
use Tests\TestStorage;

class LogoPackageServiceTest extends TestCase
{
    use RefreshDatabase;
    use TestStorage;

    public function setUp(): void
    {
        parent::setUp();

        $this->seed(RootSeeder::class);
        $this->setUpTestStorage();
    }

    public function testGeneratePackage()
    {
        /** @var Logo $logo */
        $logo = factory(Logo::class)->create();

        $service = new LogoPackageService();
        $path = $service->generatePackage($logo, true);

        self::assertEquals('zip', pathinfo($path)['extension']);
        self::assertFileExists(disk_path($path));

        $nameLight = sprintf(
            'logo-%s-%s-%s-%s.%s',
            $logo->type,
            $logo->getSlug(),
            'light',
            'sRGB',
            'png'
        );
        $nameDark = sprintf(
            'logo-%s-%s-%s-%s.%s',
            $logo->type,
            $logo->getSlug(),
            'dark',
            'sRGB',
            'png'
        );

        $templatePath = $logo->getRelTemplateFilePath();
        $templateFiles = \Illuminate\Support\Facades\Storage::allFiles($templatePath);

        $expectedFiles = [
            $nameLight,
            $nameDark,
            ...$templateFiles
        ];
        $expectedFiles = array_map(
            static fn(string $file) => "logo-{$logo->getSlug()}".DIRECTORY_SEPARATOR.$file,
            $expectedFiles
        );

        $actualFiles = [];
        $zip = new \ZipArchive;
        if ($zip->open(disk_path($path)) === true) {
            for($i = 0; $i < $zip->numFiles; $i++) {
                $filename = $zip->getNameIndex($i);
                $actualFiles[] = $filename;
            }
            $zip->close();
        }

        foreach($actualFiles as $file) {
            self::assertContains($file, $expectedFiles, "Unexpected file in package: $file");
        }
        foreach($expectedFiles as $file) {
            self::assertContains($file, $actualFiles, "Missing file in package: $file");
        }
    }
}
