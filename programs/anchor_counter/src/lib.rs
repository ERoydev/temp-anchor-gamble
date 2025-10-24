use anchor_lang::prelude::*;

declare_id!("3QGV33sxrvn6Yq17kFMGM8Luuruz6YVnuLP9ov6QoEo4");

pub const DISCRIMINATOR_SIZE: usize = 8;
pub const COUNTER_SEED: &[u8] = b"counter";

#[program]
pub mod counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, initial_value: u64) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.value = initial_value;
        counter.owner = *ctx.accounts.payer.key;
        counter.bump = ctx.bumps.counter;

        msg!("Counter initialized with value: {}", initial_value);
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let counter: &mut Account<'_, Counter> = &mut ctx.accounts.counter;

        counter.value = counter.value.checked_add(1).unwrap_or(counter.value);

        msg!("Counter incremented to: {}", counter.value);
        Ok(())
    }
}

#[account]
#[derive(InitSpace)]
pub struct Counter {
    pub value: u64,
    pub owner: Pubkey,
    pub bump: u8,
}

#[derive(Accounts)]
#[instruction(initial_value: u64)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = payer,
        space = DISCRIMINATOR_SIZE + Counter::INIT_SPACE,
        seeds = [COUNTER_SEED],
        bump
    )]
    pub counter: Account<'info, Counter>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(
        mut,
        seeds = [COUNTER_SEED],
        bump = counter.bump
    )]
    pub counter: Account<'info, Counter>,

    #[account(constraint = counter.owner == payer.key())]
    pub payer: Signer<'info>,
}
