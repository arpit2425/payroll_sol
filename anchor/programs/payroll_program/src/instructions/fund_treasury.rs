use crate::errors::PayrollError;
use crate::errors::PayrollError::*;
use crate::states::organization::Organization;
use anchor_lang::prelude::*;
use anchor_lang::system_program;
pub fn fund_treasury(ctx: Context<FundTreasury>, amount: u64) -> Result<()> {
    require!(amount > 0, PayrollError::InvalidAmount);
    let org = &mut ctx.accounts.org;
    let cpi_accounts = system_program::Transfer {
        from: ctx.accounts.authority.to_account_info(),
        to: org.to_account_info(),
    };
    let cpi_program = *ctx.accounts.system_program.to_account_info().key;
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    system_program::transfer(cpi_ctx, amount)?;
    org.treasury += amount;
    msg!("Treasury funded with {} lamports", amount);

    Ok(())
}

#[derive(Accounts)]
pub struct FundTreasury<'info> {
    #[account(mut, has_one = authority @ Unauthorized,
         seeds = [b"org".as_ref(), authority.key().as_ref(), org.name.as_bytes()],
         bump)]
    pub org: Account<'info, Organization>,

    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}
