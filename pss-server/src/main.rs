#[macro_use] extern crate rocket;
use rocket::fairing::{Fairing, Info, Kind};
use rocket::http::Header;
use rocket::{Request, Response};

use clap::Parser;
mod args;
mod etl;
mod controller;

#[launch]
async fn rocket() -> _ {
    env_logger::init();
    let args = args::Args::parse();
    if args.etl {
        log::debug!("processing {} in file {} for etl", &args.collection_name, &args.file);
        let _ = etl::upload(args.file, args.collection_name);
        std::process::exit(0);
    }
    let str_port = std::env::var("PSS_PORT").unwrap_or(String::from("3443"));
    let port = str_port.parse::<u16>().unwrap_or(3443);
    let config = rocket::Config {
        ident: rocket::config::Ident::none(),
        port,
        ip_header: None,
        ..rocket::Config::debug_default()
    };
    log::info!("product server system is running on port {}", port);
    rocket::custom(&config)
        .attach(Cors)
        .mount("/", routes![_all_options])
        .mount("/product", routes![controller::add_product, controller::nn_query])
        .mount("/collection", routes![controller::get_collection])
        .mount("/collections", routes![controller::get_all_collections])
        .mount("/translate", routes![controller::translate_query])
}

/// Catches all OPTION requests in order to get the CORS related Fairing triggered.
#[options("/<_..>")]
fn _all_options() {
    /* Intentionally left empty */
}

pub struct Cors;

#[rocket::async_trait]
impl Fairing for Cors {
    fn info(&self) -> Info {
        Info {
            name: "Cross-Origin-Resource-Sharing Fairing",
            kind: Kind::Response,
        }
    }

    async fn on_response<'r>(&self, _request: &'r Request<'_>, response: &mut Response<'r>) {
        response.set_header(Header::new("Access-Control-Allow-Origin", "*"));
        response.set_header(Header::new(
            "Access-Control-Allow-Methods",
            "POST, PATCH, PUT, DELETE, HEAD, OPTIONS, GET",
        ));
        response.set_header(Header::new("Access-Control-Allow-Headers", "*"));
        response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));
    }
}

