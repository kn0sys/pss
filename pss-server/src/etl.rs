use valentinus::embeddings::*;
use std::{fs::File, path::Path};

use pss_server::product;

/// Create a new collection via upload of a .csv.file
///
/// MUST contain the headers id, name and description
pub fn upload(collection: String, file: String) -> Result<(), ValentinusError> {
    if file.is_empty() { panic!(".csv file not found") };
    if collection.is_empty() { panic!("collection name is blank") };
    let mut documents: Vec<String> = Vec::new();
    let mut metadata: Vec<Vec<String>> = Vec::new();
    let mut ids: Vec<String> = Vec::new();
    let file_path = Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("data")
        .join(file);
    let csv_file = File::open(file_path).expect("csv file not found");
    let mut rdr = csv::Reader::from_reader(csv_file);
    for result in rdr.deserialize() {
        let p: product::Product = result.unwrap_or_default();
        documents.push(p.description);
        let qty: u64 = p.quantity;
        let price: f64 = p.price;
        let id: String = p.id;
        ids.push(id);
        metadata.push(vec![
            format!(r#"{{"price": {}}}"#, qty),
            format!(r#"{{"quantity": {}}}"#, price)
        ]);
    }
    let model_path = String::from("all-Mini-LM-L6-v2_onnx");
    let model_type = ModelType::AllMiniLmL6V2;
    let mut ec: EmbeddingCollection = 
        EmbeddingCollection::new(documents, metadata, ids, collection, model_type, model_path)?;
    ec.save()?;
    Ok(())
}
