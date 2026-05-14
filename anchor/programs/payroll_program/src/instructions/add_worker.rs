use crate::errors::PayrollError;
use crate::errors::PayrollError::*;
use anchor_lang::prelude::*;

use crate::states::{organization::Organization, worker::Worker};
pub fn add_worker(ctx: Context<AddWorker>, salary: u64) -> Result<()> {
    require!(salary > 0, PayrollError::InvalidSalary);
    let worker = &mut ctx.accounts.worker;
    let org = &mut ctx.accounts.org;
    worker.org = org.key();
    worker.worker_pubkey = ctx.accounts.worker_pubkey.key();
    worker.salary = salary;
    worker.last_paid_at = 0;
    worker.created_at = Clock::get()?.unix_timestamp as u64;
    worker.bump = ctx.bumps.worker;
    org.worker_count += 1;
    Ok(())
}
#[derive(Accounts)]
pub struct AddWorker<'info> {
    #[account(mut, has_one = authority @ Unauthorized,
         seeds = [b"org".as_ref(), authority.key().as_ref(), org.name.as_bytes()],
         bump)]
    pub org: Account<'info, Organization>,
    #[account(init,
         payer = authority,
         space = 8 + Worker::INIT_SPACE,
         seeds = [b"worker".as_ref(), org.key().as_ref(), worker_pubkey.key().as_ref()],
         bump)]
    pub worker: Account<'info, Worker>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub worker_pubkey: UncheckedAccount<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}
