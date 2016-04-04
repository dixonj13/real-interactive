var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
    mix.sass(['app.sass']);
    mix.browserify(['app.js']);
    mix.browserify(['test.js'], 'public/js/testbundle.js');

    mix.browserSync({proxy: 'real.app'});

    mix.version(['public/css/app.css']);
});
