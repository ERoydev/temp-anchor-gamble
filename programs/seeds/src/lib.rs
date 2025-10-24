use anchor_lang::prelude::*;
use anchor_lang::solana_program::hash::hash;

declare_id!("FDz8JaKAPhZ8JZ4tzjrriX6taKgvkzhKryMfdYMLUV9n");

#[program]
pub mod seeds {
    use super::*;

    // 1. Static seed instruction
    pub fn create_static_seed(ctx: Context<CreateStaticSeed>) -> Result<()> {
        msg!("Static seed PDA created: {:?}", ctx.accounts.static_pda.key());
        Ok(())
    }

    // 2. User key seed instruction
    pub fn create_user_seed(ctx: Context<CreateUserSeed>) -> Result<()> {
        msg!("User-based PDA created: {:?}", ctx.accounts.user_pda.key());
        Ok(())
    }

    // 3. Instruction argument seed
    pub fn create_argument_seed(
        ctx: Context<CreateArgumentSeed>,
        custom_string: String,
        name: String,
        age: u32
    ) -> Result<()> {
        msg!("Argument-based PDA created: {:?}", ctx.accounts.argument_pda.key());
        let argument_data_account = &mut ctx.accounts.argument_pda;
        argument_data_account.name = name;
        argument_data_account.age= age;

        Ok(())
    }

    // 4. Combined seeds instruction
    pub fn create_combined_seed(
        ctx: Context<CreateCombinedSeed>,
        custom_string: String,
    ) -> Result<()> {
        msg!("Combined seed PDA created: {:?}", ctx.accounts.combined_pda.key());
        Ok(())
    }

    // 5. Number/index seed instruction
    pub fn create_number_seed(
        ctx: Context<CreateNumberSeed>,
        round_number: u64,
    ) -> Result<()> {
        msg!("Number-based PDA created: {:?}", ctx.accounts.number_pda.key());
        Ok(())
    }

    // 6. Hash-based seed instruction
    pub fn create_hash_seed(
        ctx: Context<CreateHashSeed>,
        hash_value: [u8; 32], // Need to pass precomputed hash as a parameter
    ) -> Result<()> {
        msg!("Hash-based PDA created: {:?}", ctx.accounts.hash_pda.key());
        Ok(())
    }

    // 7. Multiple accounts seed instruction
    pub fn create_multi_account_seed(ctx: Context<CreateMultiAccountSeed>) -> Result<()> {
        msg!("Multi-account PDA created: {:?}", ctx.accounts.multi_pda.key());
        Ok(())
    }

    // 8. Super complex multi-seed instruction
    pub fn create_complex_seed(
        ctx: Context<CreateComplexSeed>,
        custom_string: String,
        round_number: u64,
        hash_value: [u8; 32],
        index: u32,
        bool_flag: bool,
) -> Result<()> {
    msg!("Complex multi-seed PDA created: {:?}", ctx.accounts.complex_pda.key());
    Ok(())
}
}

// 1. Static seed
#[derive(Accounts)]
pub struct CreateStaticSeed<'info> {
    #[account(
        seeds = [b"static"],
        bump
    )]
    pub static_pda: SystemAccount<'info>,

    #[account(mut)]
    pub user: Signer<'info>,
}

// 2. User key seed
#[derive(Accounts)]
pub struct CreateUserSeed<'info> {
    #[account(
        seeds = [b"user", user.key().as_ref()],
        bump
    )]
    pub user_pda: SystemAccount<'info>,

    #[account(mut)]
    pub user: Signer<'info>,
}

// 3. Instruction argument seed
#[derive(Accounts)]
#[instruction(custom_string: String)]
pub struct CreateArgumentSeed<'info> {
    #[account(
        init,
        payer = user,
        space = ArgumentPdaAccount::INIT_SPACE,
        seeds = [b"argument", custom_string.as_bytes()],
        bump
    )]
    pub argument_pda: Account<'info, ArgumentPdaAccount>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct ArgumentPdaAccount {
    #[max_len(50)]
    pub name: String,
    pub age: u32,
}

// 4. Combined seeds
#[derive(Accounts)]
#[instruction(custom_string: String)]
pub struct CreateCombinedSeed<'info> {
    #[account(
        seeds = [b"combined", user.key().as_ref(), custom_string.as_bytes()],
        bump
    )]
    pub combined_pda: SystemAccount<'info>,

    #[account(mut)]
    pub user: Signer<'info>,
}

// 5. Number/index seed
#[derive(Accounts)]
#[instruction(round_number: u64)]
pub struct CreateNumberSeed<'info> {
    #[account(
        seeds = [b"round", &round_number.to_le_bytes()],
        bump
    )]
    pub number_pda: SystemAccount<'info>,

    #[account(mut)]
    pub user: Signer<'info>,
}

// 6. Hash-based seed
#[derive(Accounts)]
#[instruction(hash_value: [u8; 32])]
pub struct CreateHashSeed<'info> {
    #[account(
        seeds = [b"hashed", &hash_value],
        bump
    )]
    pub hash_pda: SystemAccount<'info>,

    #[account(mut)]
    pub user: Signer<'info>,
}

// 7. Multiple accounts seed
#[derive(Accounts)]
pub struct CreateMultiAccountSeed<'info> {
    #[account(
        seeds = [b"pair", user.key().as_ref(), admin.key().as_ref()],
        bump
    )]
    pub multi_pda: SystemAccount<'info>,

    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK: Used only as a seed component
    pub admin: UncheckedAccount<'info>,
}

// 8. Super complex multi-seed - combines all seed types
#[derive(Accounts)]
#[instruction(custom_string: String, round_number: u64, hash_value: [u8; 32], index: u32, bool_flag: bool)]
pub struct CreateComplexSeed<'info> {
    #[account(
        seeds = [
            b"complex",
            user.key().as_ref(),
            admin.key().as_ref(),
            custom_string.as_bytes(),
            &round_number.to_le_bytes(),
            &hash_value,
            &index.to_le_bytes(),
            &[bool_flag as u8],
            b"suffix"
        ],
        bump
    )]
    pub complex_pda: SystemAccount<'info>,

    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK: Used only as a seed component
    pub admin: UncheckedAccount<'info>,
}