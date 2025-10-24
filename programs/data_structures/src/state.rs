use anchor_lang::prelude::*;


#[account]
#[derive(InitSpace)]
pub struct ArrayAccount {
    #[max_len(2)]
    pub u8_array: Vec<u8>,
    #[max_len(2)]
    pub i8_array: Vec<i8>,
    #[max_len(2)]
    pub u16_array: Vec<u16>,
    #[max_len(2)]
    pub i16_array: Vec<i16>,
    #[max_len(2)]
    pub u32_array: Vec<u32>,
    #[max_len(2)]
    pub i32_array: Vec<i32>,
    #[max_len(2)]
    pub u64_array: Vec<u64>,
    #[max_len(2)]
    pub i64_array: Vec<i64>,
    pub fixed_i8: [i8; 2],
    pub fixed_u16: [u16; 2],
    pub fixed_i16: [i16; 2],
    pub fixed_u32: [u32; 2],
    pub fixed_i32: [i32; 2],
    pub fixed_u64: [u64; 2],
    pub fixed_i64: [i64; 2],
    #[max_len(2, 10)]
    pub string_vector: Vec<String>,
    #[max_len(2)]
    pub boolean_vector: Vec<bool>,
    #[max_len(2)]
    pub pubkey_vector: Vec<Pubkey>,
    #[max_len(2)]
    pub struct_vector: Vec<SimpleStruct>,
    #[max_len(4, 4)]
    pub nested_u32: Vec<Vec<u32>>,
    #[max_len(4)]
    pub option_u32: Option<Vec<u32>>,
    #[max_len(4)]
    pub optional_vec_struct: Option<Vec<SimpleStruct>>,
    #[max_len(5)]
    pub optional_str: Option<String>,
    pub optional_fix_arr: Option<[u32; 2]>,
    // pub fixed_nested_vec: [[u32;3]; 2] // Not supported yet
}

#[account]
#[derive(InitSpace)]
pub struct SimpleStruct {
    #[max_len(20)]
    pub name: String,
    pub age: u32,
    #[max_len(100)]
    pub location: String
}


// STRUCTS ==========================================

// Primitive account
#[account]
#[derive(InitSpace)]
pub struct PrimitiveAccount {
    pub u8_field: u8,
    pub i8_field: i8,
    pub u16_field: u16,
    pub i16_field: i16,
    pub u32_field: u32,
    pub i32_field: i32,
    pub u64_field: u64,
    pub i64_field: i64,
    pub bool_field: bool,
    pub pubkey_field: Pubkey,
    #[max_len(3)]
    pub string_field: String,
}

// Fixed-size arrays
#[account]
#[derive(InitSpace)]
pub struct FixedArrayAccount {
    #[max_len(4)]
    pub u8_array: Vec<u8>,
    pub i32_array: [i32; 3],
    pub pubkey_array: [Pubkey; 2],
}

// Strings
#[account]
#[derive(InitSpace)]
pub struct StringAccount {
    #[max_len(3)]
    pub simple_string: String,
    #[max_len(3)]
    pub optional_string: Option<String>,
}

// Vectors
#[account]
#[derive(InitSpace)]
pub struct VectorAccount {
    #[max_len(2)]
    pub u8_vec: Vec<u8>,
    #[max_len(2)]
    pub i64_vec: Vec<i64>,
    #[max_len(2, 5)]
    pub string_vec: Vec<String>,
    #[max_len(3)]
    pub pubkey_vec: Vec<Pubkey>,
}

// Optional fields
#[account]
#[derive(InitSpace)]
pub struct OptionalAccount {
    pub optional_u32: Option<u32>,
    #[max_len(3)]
    pub optional_vec: Option<Vec<i64>>,
    pub optional_struct: Option<SimpleStruct>,
}

// Nested Structs
#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct NestedStruct {
    pub a: u32,
    pub b: bool,
}

#[account]
#[derive(InitSpace)]
pub struct StructAcc {
    pub simple_struct: NestedStruct,
    #[max_len(2)]
    pub nested_vec_struct: Vec<NestedStruct>,
    pub optional_nested: Option<NestedStruct>,
}

// Enums
#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub enum ExampleEnum {
    VariantA(u32, bool),
    VariantB { 
        x: i64,
        #[max_len(5)]
        y: String,
    },
    VariantC,
    VariantD(u8, i16, 
        #[max_len(5)]
        String), 
    VariantE { nested: SimpleStruct, flag: bool },
    VariantF(
        #[max_len(2)]
        Vec<u32>),
    VariantG(
        #[max_len(3)]
        Option<String>),
    VariantH(
        #[max_len(3)]
        Vec<u8>),
    VariantI { a: u32, b: i64, c: bool, 
        #[max_len(2)]
        d:  String },
    
    VariantJ(
        #[max_len(2)]
        Option<Vec<SimpleStruct>>
    ),

    VariantK([SimpleStruct; 2]),
    VariantM(
        #[max_len(2, 2)]
        Vec<Vec<u64>>
    ),
    VariantN(Option<[u32; 3]>),
    VariantO {
        #[max_len(2)]
        items: Vec<NestedStruct>,
        flag: Option<bool>,
    },
    VariantP {
        #[max_len(2, 5)]
        names: Vec<String>,
    },
    VariantQ(
        #[max_len(2)]
        Option<Vec<Option<SimpleStruct>>>
    ),
    VariantR(u8, Option<NestedStruct>, [u64; 2], bool),

    // --- Additions below ---

    // Option<Vec<u64>>
    VariantS(
        #[max_len(3)]
        Option<Vec<u64>>
    ),

    // Array of primitives
    VariantT([u8; 4]),

    // Struct with vector and option
    VariantU {
        #[max_len(2)]
        nested_structs: Vec<NestedStruct>,
        flag: Option<bool>,
    },

    // Option<Vec<Option<u64>>>
    VariantW(
        #[max_len(2)]
        Option<Vec<Option<u64>>>
    ),

    // Deeply nested struct
    VariantX {
        nested_struct: NestedStruct,
        #[max_len(2)]
        nested_vec: Vec<NestedStruct>,
    },

    // Option<[SimpleStruct; 2]>
    VariantY(Option<[SimpleStruct; 2]>),
    // Option<Vec<[u8; 2]>>

    VariantZ(
        #[max_len(2)]
        Option<Vec<[u8; 2]>>
    ),
}

#[derive(InitSpace, Clone, AnchorDeserialize, AnchorSerialize)]
pub struct StructWithEnum {
    pub field_enum: ExampleEnum,
    #[max_len(2)]
    pub field_enum_vec: Vec<ExampleEnum>,
}

#[derive(InitSpace, Clone, AnchorDeserialize, AnchorSerialize)]
pub struct StructWithOptionalEnum {
    pub field_optional_enum: Option<ExampleEnum>,
}

#[account]
#[derive(InitSpace)]
pub struct EnumAccount {
    pub my_enum: ExampleEnum,
    pub optional_enum: Option<ExampleEnum>,
    #[max_len(2)]
    pub enum_vec: Vec<ExampleEnum>,
    #[max_len(2)]
    pub optional_enum_vec: Option<Vec<ExampleEnum>>,
    pub enum_array: [ExampleEnum; 2],
    pub struct_with_enum: StructWithEnum,
    pub struct_with_optional_enum: StructWithOptionalEnum,

    // Additions bellow

    // // Option<[ExampleEnum; 2]>
    // pub optional_enum_array: Option<[ExampleEnum; 2]>,

    // // Option<Vec<[ExampleEnum; 2]>>
    // #[max_len(2)]
    // pub optional_enum_vec_array: Option<Vec<[ExampleEnum; 2]>>,

    // // Vec<Option<ExampleEnum>>
    // #[max_len(2)]
    // pub vec_of_optional_enum: Vec<Option<ExampleEnum>>,

    // Option<Vec<Option<ExampleEnum>>>
    // #[max_len(2)]
    // pub optional_vec_of_optional_enum: Option<Vec<Option<ExampleEnum>>>,

    // // Nested struct containing enum
    // pub nested_struct: NestedStruct,

    // #[max_len(2, 2, 2)]
    // pub super_nested: Vec<Vec<Vec<ExampleEnum>>>,
}

#[account]
#[derive(InitSpace)]
pub struct StructAccount {
    pub simple_struct: SimpleStruct,
    pub primitive_account: PrimitiveAccount,
    pub fixed_array_account: FixedArrayAccount,
    pub string_account:  StringAccount,
    pub vector_account: VectorAccount,
    pub optional_account: OptionalAccount,
    pub nested_structs: StructAcc,
    // pub simple_enum: ExampleEnum,
}