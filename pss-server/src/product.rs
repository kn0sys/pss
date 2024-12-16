use serde::{ Deserialize, Serialize };
use serde_json::Value;
use valentinus::embeddings::*;
use rocket::{serde::json::Json};

/// Product returned from the PSS vector database
#[derive(Default, Deserialize, Serialize, Debug)]
pub struct Product {
    /// query sentence to transorm for semantic search
    pub description: String,
    /// unique random identifier concated with product name by the caller
    pub id: String,
    /// cost of the product
    pub price: f64,
    /// number remaining
    pub quantity: u64,
}

impl Product {
    pub fn add_product(collection: String, product: Json<Product>) -> Result<(), ValentinusError> {
        let view = Some(format!("view-{}", String::from(&collection)));
        let ec = find(None, view).unwrap_or_default();
        log::debug!("found collection {}: {:?}", &collection, ec);
        let v_meta = vec![
            format!(r#"{{"price": {}}}"#, product.price),
            format!(r#"{{"quantity": {}}}"#, product.quantity),
        ];
        let model_path = String::from("all-MiniLM-L6-v2_onnx");
        let model_type = ModelType::AllMiniLmL6V2;
        if ec.get_documents().is_empty() {
            // create new collection
            let documents: Vec<String> = vec![product.description.clone()];
            let ids: Vec<String> = vec![product.id.clone()];
            let metadata: Vec<Vec<String>> = vec![v_meta];
            let mut new_ec = EmbeddingCollection::new(documents, metadata, ids, collection, model_type, model_path)?;
            new_ec.save()?;
            return Ok(());
        } else {
            // update existing collection
            let old_ec = ec;
            let mut documents: Vec<String> = old_ec.get_documents().to_vec();
            let mut metadata: Vec<Vec<String>> = old_ec.get_metadata().to_vec();
            let mut ids: Vec<String> = old_ec.get_ids().to_vec();
            documents.push(product.description.clone());
            metadata.push(v_meta);
            ids.push(product.id.clone());
            let mut new_ec = EmbeddingCollection::new(documents, metadata, ids, String::from(&collection), model_type, model_path)?;
            EmbeddingCollection::delete(format!("view-{}", String::from(&collection)))?;
            new_ec.save()?;
            return Ok(());
        }
    }
    pub fn product_from_nn(query: String, collection: String) -> Result<Product, ValentinusError> {
        let view = format!("view-{}", String::from(&collection));
        let ec = find(None, Some(String::from(&view)))?;
        let result = EmbeddingCollection::nearest_query(query, String::from(&view))?;
        let description = String::from(&ec.get_documents()[result]);
        let id = String::from(&ec.get_ids()[result]);
        let meta = &ec.get_metadata()[result];
        let price_meta: Value = serde_json::from_str(&meta[0]).unwrap();
        let qty_meta: Value = serde_json::from_str(&meta[1]).unwrap();
        log::debug!("price: {:?}, name: {:?}", meta[0], meta[1]);
        let price = price_meta["price"].as_f64().unwrap_or_default();
        let quantity = qty_meta["quantity"].as_u64().unwrap_or_default();
        Ok(Product { description, id, price, quantity })
    }
}
