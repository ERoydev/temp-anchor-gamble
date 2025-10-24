use anchor_lang::prelude::*;

#[error_code]
pub enum ItemError {
    #[msg("Index out of bounds")]
    IndexOutOfBounds
}


#[error_code]
pub enum ArgsError {
   #[msg("String length exceeds 10 characters")]
    StringTooLong,
    #[msg("Vector length exceeds maximum allowed")]
    VectorTooLong,
}