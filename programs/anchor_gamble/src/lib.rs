use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

declare_id!("6s6rYBQHQPYJsFYbyPGa1k4uAX9MNGFKQ2NeqXQB5Wv2");

pub const DISCRIMINATOR_SIZE: usize = 8;
pub const CONFIG_SEED: &[u8] = b"config";
pub const REWARD_POOL_SEED: &[u8] = b"reward_pool";

#[program]
pub mod anchor_gamble {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, gamble_cost: u64) -> Result<()> {
        let config: &mut Account<'_, Config> = &mut ctx.accounts.config;
        config.admin = *ctx.accounts.admin.key;
        config.gamble_cost = gamble_cost;
        config.config_bump = ctx.bumps.config;
        config.reward_pool_bump = ctx.bumps.reward_pool;
        Ok(())
    }

    pub fn set_gamble_cost(ctx: Context<SetGambleCost>, new_cost: u64) -> Result<()> {
        let config: &Account<'_, Config> = &ctx.accounts.config;
        require_keys_eq!(
            ctx.accounts.admin.key(),
            config.admin,
            ErrorCode::Unauthorized
        );
        ctx.accounts.config.gamble_cost = new_cost;
        Ok(())
    }

    pub fn gamble(ctx: Context<Gamble>) -> Result<()> {
        let config: &Account<'_, Config> = &ctx.accounts.config;
        let user: &Signer<'_> = &ctx.accounts.user;
        let reward_pool: &SystemAccount<'_> = &ctx.accounts.reward_pool;
        let system_program: &Program<'_, System> = &ctx.accounts.system_program;

        let cpi_to_pool: CpiContext<'_, '_, '_, '_, Transfer<'_>> = CpiContext::new(
            system_program.to_account_info(),
            Transfer {
                from: user.to_account_info(),
                to: reward_pool.to_account_info(),
            },
        );
        transfer(cpi_to_pool, config.gamble_cost)?;

        let clock: Clock = Clock::get()?;
        let won: bool = clock.unix_timestamp % 2 == 0;

        if won {
            let reward: u64 = config.gamble_cost.checked_mul(2).unwrap();
            let pool_balance: u64 = reward_pool.to_account_info().lamports();
            require!(pool_balance >= reward, ErrorCode::RewardPoolInsufficient);

            let signer_seeds: &[&[&[u8]]] = &[&[REWARD_POOL_SEED, &[config.reward_pool_bump]]];

            let cpi_from_pool: CpiContext<'_, '_, '_, '_, Transfer<'_>> =
                CpiContext::new_with_signer(
                    system_program.to_account_info(),
                    Transfer {
                        from: reward_pool.to_account_info(),
                        to: user.to_account_info(),
                    },
                    signer_seeds,
                );
            transfer(cpi_from_pool, reward)?;
            msg!("You won!");
        } else {
            msg!("You lost!");
        }

        Ok(())
    }
}

#[account]
#[derive(InitSpace)]
pub struct Config {
    pub admin: Pubkey,
    pub gamble_cost: u64,
    pub config_bump: u8,
    pub reward_pool_bump: u8,
}

#[derive(Accounts)]
#[instruction(gamble_cost: u64)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = admin,
        space = DISCRIMINATOR_SIZE + Config::INIT_SPACE,
        seeds = [CONFIG_SEED],
        bump
    )]
    pub config: Account<'info, Config>,

    #[account(
        seeds = [REWARD_POOL_SEED],
        bump
    )]
    pub reward_pool: SystemAccount<'info>,

    #[account(mut)]
    pub admin: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SetGambleCost<'info> {
    #[account(mut, seeds = [CONFIG_SEED], bump = config.config_bump)]
    pub config: Account<'info, Config>,

    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct Gamble<'info> {
    #[account(seeds = [CONFIG_SEED], bump = config.config_bump)]
    pub config: Account<'info, Config>,

    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [REWARD_POOL_SEED],
        bump = config.reward_pool_bump,
    )]
    pub reward_pool: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Only admin can call this method.")]
    Unauthorized,
    #[msg("The reward pool does not have enough SOL.")]
    RewardPoolInsufficient,
}
