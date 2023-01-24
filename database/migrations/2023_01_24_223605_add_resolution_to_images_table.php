<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('images', function (Blueprint $table) {
            $table->integer('resolution')
                  ->comment('dpi')
                  ->after('bleed')
                  ->nullable();
        });

        DB::update(
            'UPDATE images SET resolution = 300 WHERE `type` = "final" AND resolution IS NULL'
        );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('images', function (Blueprint $table) {
            $table->dropColumn('resolution');
        });
    }
};
