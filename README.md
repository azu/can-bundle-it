r# can-bundle-it

A command line tool that detect JavaScript file can be bundled.

This command line use [webpack](https://webpack.js.org/) to bundle js files.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install can-bundle-it

## Usage

    Usage
      $ can-bundle-it /path/to/file.js
 
    Options
      --verbose        Show info/warning/error messages 
      
    Bundle Options
      
      --target              [String]  Bundle target. Available: https://webpack.js.org/configuration/target/
      --node-fallback       [Boolean] enable Node.js modules fallback
                            webpack 5 disable Node.js polyfill by default. This options set node-libs-browser to resolve.fallback.
     
    Examples
      $ can-bundle-it lib/iresondex.js
      $ can-bundle-it lib/*.js --verbose
      # Enable Node.js polyfill like "assert"
      $ can-bundle-it lib/*.js --verbose --node-fallback


- If success to bundle js file, exit status is `0`
- If fail to bundle js file, exit status is `1`


## Changelog

See [Releases page](https://github.com/azu/can-bundle-it/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/azu/can-bundle-it/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
