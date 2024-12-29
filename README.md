# pss

## Installation and Dependencies

* sudo apt install pkg-config cmake python3.12 python3-dev python3.12-venv
* Install [Rust](https://www.rust-lang.org/tools/install)
* Install [Node.js](https://github.com/nvm-sh/nvm/blob/master/README.md#installing-and-updating)
* Optional: Setup [LibreTranslate](https://github.com/LibreTranslate/LibreTranslate) server
* Optional: Add addition languages as per https://forum.yunohost.org/t/libretranslate-how-to-add-additional-language-models/25879
* Configure models for [Valentinus](https://github.com/kn0sys/valentinus)

## pss-server

```bash
RUST_LOG=debug cargo run -- -h
```

## pss-client

```bash
npm i
npm run dev
```

