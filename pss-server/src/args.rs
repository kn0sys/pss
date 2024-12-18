/// command line arguments

use clap::Parser;

#[derive(Parser, Default, Debug)]
#[command(author, version, about, long_about = None)]
pub struct Args {
    /// ETL upload with the path to the .csv to upload
    #[arg(
        short,
        long,
        help = "relative path of the .csv file for ETL upload.",
        default_value = ""
    )]
    pub file: String,
    /// Flag for ETL mode
    #[arg(
        short,
        long,
        help = "Flag for setting PSS to ETL mode.",
        default_value = "false"
    )]
    pub etl: bool,
    /// collection name for ETL
    #[arg(
        short,
        long,
        help = "Unique collection name for the ETL. Must be alphanumeric with underscores.",
        default_value = ""
    )]
    pub collection_name: String,
    /// Flag for ETL update
    #[arg(
        short,
        long,
        help = "Flag for setting PSS to ETL update mode",
        default_value = "false"
    )]
    pub update_etl: bool,
    /// Flag for local LibreTranslate server
    /// TODO: add support for API keys
    #[arg(
        short,
        long,
        help = "Set the host for LibreTranslate locally. API Keys not yet supported",
        default_value = "false",
    )]
    pub libretranslate_host: String,
}
