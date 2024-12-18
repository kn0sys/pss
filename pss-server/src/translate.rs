#![allow(non_snake_case)]

use serde::{ Deserialize, Serialize };

use crate::args;
use clap::Parser;

/// LibreTranslate request
#[derive(Deserialize, Serialize, Debug)]
pub struct TranslateRequest {
    pub q: String,
    pub source: String,
    pub target: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct TranslateResponse {
    pub translatedText: String
}

pub async fn query(q: String, source: String, target: String) -> String {
    log::info!("fetching translation response for query {:?}", &q);
    let client = reqwest::Client::new();
    let args = args::Args::parse();
    let req = TranslateRequest {
        q,
        source,
        target,
    };
    let res = client
        .post(args.libretranslate_host)
        .json(&req)
        .send()
        .await;
    match res {
        Ok(r) => {
            let res = r.json::<TranslateResponse>().await;
            match res {
                Ok(r) => r.translatedText,
                Err(_) => Default::default(),
            }
        }
        Err(_) => Default::default(),
    }
}
