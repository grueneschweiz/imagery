<?php


namespace App\Logo;


use App\Exceptions\LogoException;

class LogoFactory
{
    /**
     * @param  string  $type
     * @param  string  $color
     * @param  array  $args
     * @return Logo
     * @throws LogoException
     */
    public static function get(string $type, string $color, array $args): Logo
    {
        Logo::validateColorScheme($color);

        $compositor = match (mb_strtolower($type)) {
            'alternative' => new Alternative(),
            'alternative-risch' => new AlternativeRisch(),
            'basta' => new Basta(),
            'giovani-verdi' => new GiovaniVerdi(),
            'gruene' => new Gruene(...$args),
            'gruene-vert-e-s' => new GrueneVertes(...$args),
            'gruene-verts' => new GrueneVerts(...$args),
            'jeunes-vert-e-s' => new JeunesVertes(),
            'junge-gruene' => new JungeGruene(),
            'verda' => new Verda(...$args),
            'verdi' => new Verdi(...$args),
            'vert-e-s' => new Vertes(...$args),
            'verts' => new Verts(...$args),
            default => throw new LogoException("Missing logo compositor: $type"),
        };

        return new Logo($compositor, $color);
    }
}
