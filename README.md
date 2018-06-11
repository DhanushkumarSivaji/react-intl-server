# React-Intl-Server

`react-intl-server` is a translation tool, originally built for [react-intl-translations-manager](https://github.com/GertjanReynaert/react-intl-translations-manager), but can be used for anything that stores `.json` files with an object of 'key/value' pairs.

## Screenshot

![react-intl-server screenshot](https://raw.githubusercontent.com/dachinat/react-intl-server/master/doc/screenshot.png)
 
 
## Getting started

#### Clone repository

`git clone git@github.com:dachinat/react-intl-server.git`

#### Navigate to project root

`cd react-intl-server`

#### Start development server

`yarn start`

or

`npm run start`

By default server will be started on port `8001` and `3012`
To access a web-ui navigate to `http://localhost:3012`

#### Changing ports

To change a port of web-server, open `package.json`, find `"port"` property and change it to whatever you like.
Note: You must also open `client/package.json` and change `"proxy"` url accordingly.

To change a port of web-ui, open `client/.env` and change `PORT` directive

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/dachinat/react-intl-server. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The package is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Code of Conduct

Everyone interacting in the `react-intl-server` project’s codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/dachinat/nextcloud/blob/master/CODE_OF_CONDUCT.md).