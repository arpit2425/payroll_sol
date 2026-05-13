use anchor_lang::prelude::*;

use crate::states::organization::Organization;
pub fn create_org(ctx: Context<CreateOrg>, name: String) -> Result<()> {
    let org = &mut ctx.accounts.org;
    org.authority = ctx.accounts.authority.key();
    org.name = name;
    org.treasury = 0;
    org.worker_count = 0;
    org.created_at = Clock::get()?.unix_timestamp as u64;
    org.bump = ctx.bumps.org;
    Ok(())
}
#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreateOrg<'info> {
    #[account(init,
    payer = authority,
    space = 8 + Organization::INIT_SPACE,
    seeds = [b"org".as_ref(), authority.key().as_ref(), name.as_bytes()],
    // seeds = [b"org".as_ref(), authority.key().as_ref(), name.as_bytes()],
    bump)]
    pub org: Account<'info, Organization>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}
