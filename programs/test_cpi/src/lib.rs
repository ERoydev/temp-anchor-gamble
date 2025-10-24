use anchor_lang::prelude::*;
use anchor_counter::cpi::accounts::Increment as CounterIncrement;
use anchor_counter::program::Counter as CounterProgram;
use anchor_counter::{self, Counter};

declare_id!("6inE9dVsasHcEyF6TCVak8ymhktH6y1a34xoLFuW1Wn4");

#[program]
pub mod test_cpi {
    use super::*;

    pub fn cpi_increment_counter(ctx: Context<CpiIncrementCounter>) -> Result<()> {
              let cpi_program = ctx.accounts.counter_program.to_account_info();
        let cpi_accounts = CounterIncrement {
            counter: ctx.accounts.counter.to_account_info(),
            payer: ctx.accounts.payer.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        anchor_counter::cpi::increment(cpi_ctx)
    }

    pub fn cpi_increment_counter_with_signer(ctx: Context<CpiIncrementCounterWithSigner>) -> Result<()> {
        let cpi_program = ctx.accounts.counter_program.to_account_info();

        let cpi_accounts = CounterIncrement {
            counter: ctx.accounts.counter.to_account_info(),
            payer: ctx.accounts.pda_signer.to_account_info(),
        };
        let seeds: &[&[u8]] = &[b"my_pda", &[ctx.accounts.pda_signer.bump]];
        let signer = &[seeds];
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        anchor_counter::cpi::increment(cpi_ctx)
    }
}

#[derive(Accounts)]
pub struct CpiIncrementCounter<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub counter_program: Program<'info, CounterProgram>,
}

#[account]
pub struct PdaSigner {
    pub bump: u8,
}

#[derive(Accounts)]
pub struct CpiIncrementCounterWithSigner<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
    #[account(
        mut,
        seeds = [b"my_pda"],
        bump = pda_signer.bump
    )]
    pub pda_signer: Account<'info, PdaSigner>,
    pub counter_program: Program<'info, CounterProgram>,
}