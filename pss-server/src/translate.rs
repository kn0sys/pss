use serde::{ Deserialize, Serialize };

use pss_server::args;

/// LibreTranslate request
#[derive(Deserialize, Serialize, Debug)]
struct TranslateRequest {
    q: String,
    source: String,
    target: String,
}

#[derive(Deserialize, Serialize, Debug)]
struct TranslateResponse {
    translatedText: String
}

async fn query(q: String, source: String, target: String) -> String {
    log::info!("fetching translation response for query {:?}", text);
    let client = reqwest::Client::new();
    let args = args::Args::parse();
    let req = TranslateRequest {
        q,
        source,
        target,
    };
    let res = client
        .post(args.translate_host)
        .json(&req)
        .send()
        .await;
    match res {
        Ok(r) => {
            let res = r.json::<TranslateResponse>().await;
            match res {
                Ok(r) => r.response,
                Err(_) => Default::default(),
            }
        }
        Err(_) => Default::default(),
    }
}
