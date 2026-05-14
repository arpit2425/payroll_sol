use crate::errors::PayrollError;
use crate::errors::PayrollError::*;
use crate::states::organization::Organization;
use anchor_lang::prelude::*;

pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
    require!(amount > 0, PayrollError::InvalidAmount);
    let org = &mut ctx.accounts.org;
    require!(org.treasury >= amount, PayrollError::InsufficientFunds);
    require!(
        org.authority == ctx.accounts.authority.key(),
        PayrollError::Unauthorized
    );
    **org.to_account_info().try_borrow_mut_lamports()? -= amount;
    **ctx
        .accounts
        .authority
        .to_account_info()
        .try_borrow_mut_lamports()? += amount;
    org.treasury -= amount;
    msg!("Withdrew {} lamports from treasury", amount);
    Ok(())
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut, has_one = authority @ Unauthorized,
         seeds = [b"org".as_ref(), authority.key().as_ref(), org.name.as_bytes()],
         bump)]
    pub org: Account<'info, Organization>,

    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}
