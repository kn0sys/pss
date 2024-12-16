use rocket::{
    http::Status,
    post,
    response::status::Custom,
    serde::json::Json,
};

use pss_server::product;
use serde::{Deserialize, Serialize};
use valentinus::embeddings::*;

/// The request from the customer
#[derive(Default, Deserialize, Serialize, Debug)]
pub struct QueryRequest {
    /// query string to convert to embeddings
    query: String,
    /// collection to run semantic search against
    collection: String,
}

/// List of collections stored in valentinus
#[derive(Default, Deserialize, Serialize, Debug)]
pub struct CollectionsResponse {
    collections: Vec<String>,
}

// TODO: update, delete product from collections, tricky...

/// Return the list of collections from valentinus
#[get("/")]
pub async fn get_all_collections() -> Custom<Json<CollectionsResponse>> {
    let kv = EmbeddingCollection::fetch_collection_keys(true).unwrap();
    let mut collections = kv.get_values().to_vec();
    collections.dedup();
    Custom(Status::Ok, Json(CollectionsResponse { collections }))
}

/// Return the collection
#[get("/<collection_name>")]
pub async fn get_collection(collection_name: &str) -> Custom<Json<EmbeddingCollection>> {
    let view = format!("view-{}", String::from(collection_name));
    let ec = find(None, Some(view)).unwrap();
    Custom(Status::Ok, Json(ec))
}

/// Add a new product
#[post("/<collection_name>", data = "<product>")]
pub async fn add_product(collection_name: &str, product: Json<product::Product>) -> Custom<Json<product::Product>> {
    product::Product::add_product(collection_name.to_string(), product).unwrap();
    Custom(Status::Ok, Json(Default::default()))
}

/// Perform nearest neighbor query on a collection
#[post("/nn", data = "<request>")]
pub async fn nn_query(request: Json<QueryRequest>) -> Custom<Json<product::Product>> {
    log::debug!("fetching product response for query {:?}", &request.query);
    let response = product::Product::product_from_nn(String::from(&request.query), String::from(&request.collection)).unwrap();
    Custom(Status::Ok, Json(response))
}

