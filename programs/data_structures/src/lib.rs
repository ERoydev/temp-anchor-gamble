
use anchor_lang::prelude::{borsh::{BorshDeserialize}, *};
declare_id!("BCLLx4WgaCX4oSMdmkqdYxSjJyydSphEqwbG8H69my3E");


pub mod errors;
pub use errors::*;

pub mod state;
pub use state::*;

#[program]
pub mod data_structures {
    use super::*;

    pub fn init_array(ctx: Context<InitArray>) -> Result<()> {
        let array_acc = &mut ctx.accounts.array_acc;
        array_acc.u8_array = vec![1, 2];
        array_acc.i8_array = vec![-1, -2];
        array_acc.u16_array = vec![10, 20];
        array_acc.i16_array = vec![-10, -20];
        array_acc.u32_array = vec![100, 200];
        array_acc.i32_array = vec![-100, -200];
        array_acc.u64_array = vec![1000, 2000];
        array_acc.i64_array = vec![-1000, -2000];
        array_acc.fixed_i8 = [-1, -2];
        array_acc.fixed_u16 = [10, 20];
        array_acc.fixed_i16 = [-10, -20];
        array_acc.fixed_u32 = [100, 200];
        array_acc.fixed_i32 = [-100, -200];
        array_acc.fixed_u64 = [1000, 2000];
        array_acc.fixed_i64 = [-1000, -2000];
        array_acc.string_vector = vec!["hello".to_string(), "world".to_string()];
        array_acc.boolean_vector = vec![true, false];

        array_acc.pubkey_vector = vec![
            Pubkey::new_from_array([4u8; 32]),
            Pubkey::new_from_array([5u8; 32]),
        ];

        array_acc.struct_vector = vec![
            SimpleStruct {
                name: "emilio".to_string(),
                age: 18,
                location: "Sofia, Bulgaria".to_string(),
            },
            SimpleStruct {
                name: "emil".to_string(),
                age: 24,
                location: "North avenue, New York".to_string(),
            },
        ];
        array_acc.nested_u32 = vec![
            vec![1, 2, 3],
            vec![4, 5, 6],
            vec![7, 8, 9],
        ];

        array_acc.option_u32 = Some(vec![2, 4, 5]);
        array_acc.optional_vec_struct = Some(vec![
            SimpleStruct {
                name: "emilio".to_string(),
                age: 18,
                location: "Sofia, Bulgaria".to_string(),
            },
            SimpleStruct {
                name: "emil".to_string(),
                age: 24,
                location: "North avenue, New York".to_string(),
            },
        ]);
        array_acc.optional_fix_arr = Some([32, 12]);
        // array_acc.fixed_nested_vec = [[1,2,3],[4,5,6]];   

        Ok(())
    }

    pub fn modify_array(
        ctx: Context<ModifyArray>,
        u8_array: Vec<u8>,
        i8_array: Vec<i8>,
        u16_array: Vec<u16>,
        i16_array: Vec<i16>,
        u32_array: Vec<u32>,
        i32_array: Vec<i32>,
        u64_array: Vec<u64>,
        i64_array: Vec<i64>,
        string_vector: Vec<String>,
        boolean_vector: Vec<bool>,
        pubkey_vector: Vec<Pubkey>,
        struct_vector: Vec<SimpleStruct>,
        option_u32: Option<Vec<u32>>,
        optional_vec_struct: Option<Vec<SimpleStruct>>,
        optional_str: Option<String>,
        optional_fix_arr: Option<[u32; 2]>,
    ) -> Result<()> {
        require!(u8_array.len() <= 2, ArgsError::VectorTooLong);
        require!(i8_array.len() <= 2, ArgsError::VectorTooLong);
        require!(u16_array.len() <= 2, ArgsError::VectorTooLong);
        require!(i16_array.len() <= 2, ArgsError::VectorTooLong);
        require!(u32_array.len() <= 2, ArgsError::VectorTooLong);
        require!(i32_array.len() <= 2, ArgsError::VectorTooLong);
        require!(u64_array.len() <= 2, ArgsError::VectorTooLong);
        require!(i64_array.len() <= 2, ArgsError::VectorTooLong);
        require!(string_vector.iter().all(|s| s.len() <= 10), ArgsError::StringTooLong);
        require!(boolean_vector.len() <= 2, ArgsError::VectorTooLong);
        require!(pubkey_vector.len() <= 2, ArgsError::VectorTooLong);
        require!(struct_vector.len() <= 2, ArgsError::VectorTooLong);
        
        require!(option_u32.as_ref().map_or(true, |s| s.len() <= 2), ArgsError::VectorTooLong);
        require!(optional_vec_struct.as_ref().map_or(true, |s| s.len() <= 2), ArgsError::VectorTooLong);
        require!(optional_str.as_ref().map_or(true, |s| s.len() <= 10), ArgsError::StringTooLong);
        require!(optional_fix_arr.as_ref().map_or(true, |s| s.len() <= 2), ArgsError::VectorTooLong);

        let array_acc = &mut ctx.accounts.array_acc;
        array_acc.u8_array = u8_array;
        array_acc.i8_array = i8_array;
        array_acc.u16_array = u16_array;
        array_acc.i16_array = i16_array;
        array_acc.u32_array = u32_array;
        array_acc.i32_array = i32_array;
        array_acc.u64_array = u64_array;
        array_acc.i64_array = i64_array;
        array_acc.string_vector = string_vector;
        array_acc.boolean_vector = boolean_vector;
        array_acc.pubkey_vector = pubkey_vector;
        array_acc.struct_vector = struct_vector;
        array_acc.option_u32 = option_u32;
        array_acc.optional_vec_struct = optional_vec_struct;
        array_acc.optional_str = optional_str;
        array_acc.optional_fix_arr = optional_fix_arr;
    Ok(())
    }


    pub fn init_structs(ctx: Context<InitStructs>) -> Result<()> {
        let struct_acc = &mut ctx.accounts.struct_acc;
        struct_acc.simple_struct = SimpleStruct {
            name: "emil".to_string(), 
            age: 24, 
            location: "North avenue, Bulgaria".to_string() 
        };

        struct_acc.primitive_account = PrimitiveAccount {
            u8_field: 1,
            i8_field: -1,
            u16_field: 100,
            i16_field: -100,
            u32_field: 1000,
            i32_field: -1000,
            u64_field: 10000,
            i64_field: -10000,
            bool_field: true,
            pubkey_field: Pubkey::new_from_array([1u8; 32]),
            string_field: "abc".to_string(),
        };;

        struct_acc.string_account = StringAccount { simple_string: "hello".to_string(), optional_string: Some("random".to_string()) };

        struct_acc.vector_account = VectorAccount { 
            u8_vec: vec![2, 3], 
            i64_vec: vec![-2, -145], 
            string_vec: vec!["hey".to_string()], 
            pubkey_vec: vec![Pubkey::new_from_array([1u8; 32])]
        };

        struct_acc.optional_account = OptionalAccount { 
            optional_u32: Some(12),
            optional_vec: Some(vec![-123]), 
            optional_struct: Some(SimpleStruct { name: "hey".to_string(), age: 23, location: "Ruse".to_string() })
        };

        struct_acc.nested_structs = StructAcc { 
            simple_struct: NestedStruct { a: 15, b: true }, 
            nested_vec_struct: vec![NestedStruct { a: 25, b: true }, NestedStruct { a: 15, b: false }], 
            optional_nested: Some(NestedStruct { a: 25, b: true })
        };

        struct_acc.fixed_array_account = FixedArrayAccount { 
            u8_array: vec![1, 2, 23, 32],
            i32_array: [-23, 23, 12],
            pubkey_array: [
                Pubkey::new_from_array([1u8; 32]),
                Pubkey::new_from_array([2u8; 32]),
            ]
        };

        // struct_acc.simple_enum = ExampleEnum::VariantA(14, true); 

        Ok(())
    }



    pub fn modify_struct(
        ctx: Context<ModifyStruct>,
        simple_struct: SimpleStruct,
        primitive_account: PrimitiveAccount,
        string_account: StringAccount,
        vector_account: VectorAccount,
        optional_account: OptionalAccount,
        nested_structs: StructAcc,
        fixed_array_account: FixedArrayAccount,
        // simple_enum: ExampleEnum,
    ) -> Result<()> {
        let struct_acc = &mut ctx.accounts.struct_acc;
        struct_acc.simple_struct = simple_struct;
        struct_acc.primitive_account = primitive_account;
        struct_acc.string_account = string_account;
        struct_acc.vector_account = vector_account;
        struct_acc.optional_account = optional_account;
        struct_acc.nested_structs = nested_structs;
        struct_acc.fixed_array_account = fixed_array_account;
        // struct_acc.simple_enum = simple_enum;
        Ok(())
    }

    pub fn init_enums(ctx: Context<InitEnums>) -> Result<()> {
        let enum_acc = &mut ctx.accounts.enums_acc;

        enum_acc.my_enum = ExampleEnum::VariantA(14, true);
        enum_acc.optional_enum = Some(ExampleEnum::VariantA(14, true));
        enum_acc.enum_vec = vec![
            ExampleEnum::VariantB { x: 12, y: "hello".to_string()},
            ExampleEnum::VariantG(Some("alabala".to_string()))
        ];

        enum_acc.optional_enum_vec = Some(vec![
            ExampleEnum::VariantB { x: 12, y: "hello".to_string()},
            ExampleEnum::VariantG(Some("alabala".to_string()))
        ]);

        enum_acc.enum_array = [ExampleEnum::VariantA(14, true), ExampleEnum::VariantB { x: 23, y: "hello".to_string() }];
        enum_acc.struct_with_enum = StructWithEnum {
            field_enum: ExampleEnum::VariantB { x: 23, y: "hello".to_string() },
            field_enum_vec: vec![ExampleEnum::VariantB { x: 23, y: "hello".to_string() }]
        };

        enum_acc.struct_with_optional_enum = StructWithOptionalEnum { 
            field_optional_enum: Some(ExampleEnum::VariantC)
        };

        // Option<[ExampleEnum; 2]>
        // enum_acc.optional_enum_array = Some([
        //     ExampleEnum::VariantA(10, false),
        //     ExampleEnum::VariantC,
        // ]);

        // // Option<Vec<[ExampleEnum; 2]>>
        // enum_acc.optional_enum_vec_array = Some(vec![
        //     [ExampleEnum::VariantA(1, true), ExampleEnum::VariantC],
        //     [ExampleEnum::VariantB { x: 5, y: "test".to_string() }, ExampleEnum::VariantA(2, false)]
        // ]);

        // // Vec<Option<ExampleEnum>>
        // enum_acc.vec_of_optional_enum = vec![
        //     Some(ExampleEnum::VariantA(7, true)),
        //     None
        // ];

        // Option<Vec<Option<ExampleEnum>>>
        // enum_acc.optional_vec_of_optional_enum = Some(vec![
        //     Some(ExampleEnum::VariantB { x: 15, y: "abc".to_string() }),
        //     None
        // ]);

        // // Nested struct containing enum
        // enum_acc.nested_struct = NestedStruct { 
        //     a: 42, 
        //     b: true 
        // };

        // // Vec<Vec<Vec<ExampleEnum>>>
        // enum_acc.super_nested = vec![
        //     vec![
        //         vec![ExampleEnum::VariantA(1, true), ExampleEnum::VariantC],
        //         vec![ExampleEnum::VariantB { x: 2, y: "hi".to_string() }]
        //     ],
        //     vec![
        //         vec![ExampleEnum::VariantA(3, false)]
        //     ]
        // ];

        Ok(())
    }

    pub fn modify_enum(
        ctx: Context<ModifyEnum>, 
        my_enum: ExampleEnum, 
        optional_enum: Option<ExampleEnum>, 
        enum_vec: Vec<ExampleEnum>, 
        optional_enum_vec: Option<Vec<ExampleEnum>>, 
        enum_array: [ExampleEnum; 2], 
        struct_with_enum: StructWithEnum, 
        struct_with_optional_enum: StructWithOptionalEnum,
        // optional_enum_array: Option<[ExampleEnum; 2]>,
        // optional_enum_vec_array: Option<Vec<[ExampleEnum; 2]>>,
        // vec_of_optional_enum: Vec<Option<ExampleEnum>>,
        // optional_vec_of_optional_enum: Option<Vec<Option<ExampleEnum>>>,
        // nested_struct: NestedStruct,
        // super_nested: Vec<Vec<Vec<ExampleEnum>>>,
    ) -> Result<()> {
        let enum_acc = &mut ctx.accounts.enums_acc;
        enum_acc.my_enum = my_enum;
        enum_acc.optional_enum = optional_enum;
        enum_acc.enum_vec = enum_vec;
        enum_acc.optional_enum_vec = optional_enum_vec;
        enum_acc.enum_array = enum_array;
        enum_acc.struct_with_enum = struct_with_enum;
        enum_acc.struct_with_optional_enum = struct_with_optional_enum;
        // enum_acc.optional_enum_array = optional_enum_array;
        // enum_acc.optional_enum_vec_array = optional_enum_vec_array;
        // enum_acc.vec_of_optional_enum = vec_of_optional_enum;
        // enum_acc.optional_vec_of_optional_enum = optional_vec_of_optional_enum;
        // enum_acc.nested_struct = nested_struct;
        // enum_acc.super_nested = super_nested;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct ModifyEnum<'info> {
    #[account(mut)]
    pub enums_acc: Account<'info, EnumAccount>, 
}

#[derive(Accounts)]
pub struct ModifyStruct<'info> {
    #[account(mut)]
    pub struct_acc: Account<'info, StructAccount>,
}

#[derive(Accounts)]
pub struct InitArray<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + ArrayAccount::INIT_SPACE
    )]
    pub array_acc: Account<'info, ArrayAccount>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ModifyArray<'info> {
    #[account(mut)]
    pub array_acc: Account<'info, ArrayAccount>,
}

#[derive(Accounts)]
pub struct InitStructs<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + StructAccount::INIT_SPACE
    )]
    pub struct_acc: Account<'info, StructAccount>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitEnums<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + EnumAccount::INIT_SPACE
    )]
    pub enums_acc: Account<'info, EnumAccount>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
